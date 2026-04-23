const keyElements = new Map(
  Array.from(document.querySelectorAll("[data-code]")).map((element) => [element.dataset.code, element]),
);

const totalPressesElement = document.querySelector("#totalPresses");
const activeCountElement = document.querySelector("#activeCount");
const lastCodeElement = document.querySelector("#lastCode");
const responseSpeedElement = document.querySelector("#responseSpeed");
const responseMetaElement = document.querySelector("#responseMeta");
const responseSpeedCardElement = document.querySelector("#responseSpeedCard");
const lastKeyLabelElement = document.querySelector("#lastKeyLabel");
const lastKeyMetaElement = document.querySelector("#lastKeyMeta");
const activeHintElement = document.querySelector("#activeHint");
const activeKeysElement = document.querySelector("#activeKeys");
const eventLogElement = document.querySelector("#eventLog");
const clearLogButton = document.querySelector("#clearLogButton");
const resetDetectedButton = document.querySelector("#resetDetectedButton");
const logItemTemplate = document.querySelector("#logItemTemplate");
const lockElements = new Map(
  Array.from(document.querySelectorAll("[data-lock]")).map((element) => [element.dataset.lock, element]),
);

const pressedCodes = new Set();
const testedCodes = new Set();
const unknownKeys = new Map();
const fallbackReleaseTimers = new Map();

let totalPresses = 0;
let responseSampleCount = 0;
let responseAverage = 0;
let pendingResponseFrame = 0;

function resolveCode(event) {
  const code = event.code || "";
  const key = event.key || "";
  const keyCode = event.keyCode || event.which || 0;

  if (code && keyElements.has(code)) {
    return code;
  }

  // Browser/driver aliases for Print Screen.
  if (
    code === "Snapshot" ||
    code === "Print" ||
    code === "SysRq" ||
    key === "PrintScreen" ||
    key === "Print" ||
    key === "SysRq" ||
    key === "PrtSc" ||
    keyCode === 44
  ) {
    return "PrintScreen";
  }

  // Fallback for layouts that only report generic Shift + location.
  if ((code === "Shift" || key === "Shift" || keyCode === 16) && event.location === 2) {
    return "ShiftRight";
  }

  if ((code === "Shift" || key === "Shift" || keyCode === 16) && event.location === 1) {
    return "ShiftLeft";
  }

  // Some environments report generic Shift with location=0; prefer right Shift for visibility.
  if ((code === "Shift" || key === "Shift" || keyCode === 16) && event.location === 0) {
    return "ShiftRight";
  }

  return code;
}

function getEventTimestamp(event) {
  if (typeof event.timeStamp !== "number") {
    return null;
  }

  // Some engines report epoch-based timestamps; convert to performance timeline.
  if (event.timeStamp > 1e12) {
    return event.timeStamp - performance.timeOrigin;
  }

  return event.timeStamp;
}

function updateResponseSpeed(event) {
  const eventTime = getEventTimestamp(event);

  if (eventTime === null || !responseSpeedElement || !responseMetaElement || !responseSpeedCardElement) {
    return;
  }

  if (pendingResponseFrame) {
    cancelAnimationFrame(pendingResponseFrame);
  }

  // Measure from keydown to a confirmed rendered frame (two RAF hops)
  // to avoid near-zero readings caused by same-frame timestamps.
  pendingResponseFrame = requestAnimationFrame((paintTime) => {
    pendingResponseFrame = requestAnimationFrame((finalPaintTime) => {
      pendingResponseFrame = 0;
      const latencyMs = Math.max(0.8, Math.min(999, finalPaintTime - eventTime));
      responseSampleCount += 1;
      responseAverage += (latencyMs - responseAverage) / responseSampleCount;

      responseSpeedElement.textContent = `${latencyMs.toFixed(1)}ms`;
      responseMetaElement.textContent = `平均 ${responseAverage.toFixed(1)}ms`;

      responseSpeedCardElement.classList.remove("is-fast", "is-normal", "is-slow");

      if (latencyMs <= 20) {
        responseSpeedCardElement.classList.add("is-fast");
      } else if (latencyMs <= 40) {
        responseSpeedCardElement.classList.add("is-normal");
      } else {
        responseSpeedCardElement.classList.add("is-slow");
      }
    });
  });
}

function formatKeyLabel(event) {
  if (!event.key || event.key === " ") {
    return event.code === "Space" ? "Space" : "Unknown";
  }

  if (event.key.length === 1) {
    return event.key.toUpperCase();
  }

  return event.key;
}

function formatLocation(location) {
  const labels = {
    0: "Standard",
    1: "Left",
    2: "Right",
    3: "Numpad",
  };

  return labels[location] || "Standard";
}

function setLastEvent(event, type) {
  const resolvedCode = resolveCode(event) || event.code;
  const label = formatKeyLabel(event);
  lastKeyLabelElement.textContent = label;
  lastCodeElement.textContent = resolvedCode || "-";
  lastKeyMetaElement.textContent = `${type} / ${resolvedCode || "UnknownCode"} / ${label} / ${formatLocation(event.location)}`;
}

function updateActiveKeys() {
  activeCountElement.textContent = String(pressedCodes.size);
  activeKeysElement.replaceChildren();

  if (pressedCodes.size === 0) {
    const placeholder = document.createElement("span");
    placeholder.className = "placeholder-chip";
    placeholder.textContent = "暂无";
    activeKeysElement.append(placeholder);
    activeHintElement.textContent = "当前没有按住的按键";
    return;
  }

  activeHintElement.textContent = "保持按压时，对应按键会持续高亮";

  Array.from(pressedCodes)
    .sort((left, right) => left.localeCompare(right))
    .forEach((code) => {
      const chip = document.createElement("span");
      chip.className = "active-chip";
      chip.textContent = code;
      activeKeysElement.append(chip);
    });
}

function updateLockState(event) {
  ["CapsLock", "NumLock", "ScrollLock"].forEach((lockName) => {
    const lockElement = lockElements.get(lockName);

    if (!lockElement || typeof event.getModifierState !== "function") {
      return;
    }

    const isOn = event.getModifierState(lockName);
    lockElement.classList.toggle("is-on", isOn);
    lockElement.querySelector("b").textContent = isOn ? "ON" : "OFF";
  });
}

function appendLog(event, type) {
  const isPlaceholder = eventLogElement.querySelector(".placeholder");
  if (isPlaceholder) {
    isPlaceholder.remove();
  }

  const resolvedCode = resolveCode(event) || event.code;
  const fragment = logItemTemplate.content.cloneNode(true);
  const entry = fragment.querySelector(".log-entry");
  entry.querySelector(".log-type").textContent = type;
  entry.querySelector(".log-code").textContent = resolvedCode || "UnknownCode";
  entry.querySelector(".log-key").textContent = formatKeyLabel(event);
  entry.querySelector(".log-extra").textContent = `key=${JSON.stringify(event.key)} | location=${formatLocation(event.location)}${event.repeat ? " | repeat" : ""}`;
  eventLogElement.prepend(fragment);

  while (eventLogElement.children.length > 12) {
    eventLogElement.lastElementChild?.remove();
  }
}

function ensureUnknownKey(code) {
  if (!code || keyElements.has(code) || unknownKeys.has(code)) {
    return keyElements.get(code) || unknownKeys.get(code);
  }

  const keyboardLayout = document.querySelector("#keyboardLayout");
  const dynamicKey = document.createElement("button");
  dynamicKey.type = "button";
  dynamicKey.className = "key is-unknown";
  dynamicKey.dataset.code = code;
  dynamicKey.innerHTML = `<span>${code}</span><small>Unmapped</small>`;
  keyboardLayout.append(dynamicKey);
  unknownKeys.set(code, dynamicKey);
  return dynamicKey;
}

function activateKey(event) {
  const resolvedCode = resolveCode(event);
  const keyElement = keyElements.get(resolvedCode) || ensureUnknownKey(resolvedCode || event.code);

  if (!keyElement) {
    return;
  }

  testedCodes.add(resolvedCode || event.code);
  keyElement.classList.add("is-tested");
  keyElement.classList.add("is-active");
  keyElement.classList.toggle("is-repeating", event.repeat);
}

function releaseKey(event) {
  const resolvedCode = resolveCode(event);
  const keyElement = keyElements.get(resolvedCode) || unknownKeys.get(resolvedCode || event.code);

  if (!keyElement) {
    return;
  }

  keyElement.classList.remove("is-active", "is-repeating");
}

function clearFallbackRelease(code) {
  const timerId = fallbackReleaseTimers.get(code);
  if (timerId) {
    clearTimeout(timerId);
    fallbackReleaseTimers.delete(code);
  }
}

function scheduleFallbackRelease(code) {
  clearFallbackRelease(code);

  // PrintScreen is often intercepted by OS screenshot overlays and may never emit keyup.
  if (code !== "PrintScreen") {
    return;
  }

  const timerId = setTimeout(() => {
    fallbackReleaseTimers.delete(code);

    if (!pressedCodes.has(code)) {
      return;
    }

    pressedCodes.delete(code);
    const keyElement = keyElements.get(code) || unknownKeys.get(code);
    keyElement?.classList.remove("is-active", "is-repeating");
    updateActiveKeys();
  }, 220);

  fallbackReleaseTimers.set(code, timerId);
}

function handleKeydown(event) {
  event.preventDefault();
  const resolvedCode = resolveCode(event);
  totalPresses += 1;
  totalPressesElement.textContent = String(totalPresses);
  updateResponseSpeed(event);
  const code = resolvedCode || event.code;
  pressedCodes.add(code);
  scheduleFallbackRelease(code);
  setLastEvent(event, event.repeat ? "repeat" : "keydown");
  activateKey(event);
  updateActiveKeys();
  updateLockState(event);
  appendLog(event, event.repeat ? "repeat" : "down");
}

function handleKeyup(event) {
  event.preventDefault();
  const resolvedCode = resolveCode(event);
  const code = resolvedCode || event.code;
  clearFallbackRelease(code);
  pressedCodes.delete(code);
  setLastEvent(event, "keyup");
  releaseKey(event);
  updateActiveKeys();
  updateLockState(event);
  appendLog(event, "up");
}

function resetPressedState() {
  fallbackReleaseTimers.forEach((timerId) => clearTimeout(timerId));
  fallbackReleaseTimers.clear();

  pressedCodes.forEach((code) => {
    const keyElement = keyElements.get(code) || unknownKeys.get(code);
    keyElement?.classList.remove("is-active", "is-repeating");
  });

  pressedCodes.clear();
  updateActiveKeys();
}

function resetDetectedState() {
  testedCodes.forEach((code) => {
    const keyElement = keyElements.get(code) || unknownKeys.get(code);
    keyElement?.classList.remove("is-tested");
  });

  testedCodes.clear();
}

document.addEventListener("keydown", handleKeydown, true);
document.addEventListener("keyup", handleKeyup, true);
window.addEventListener("blur", resetPressedState);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    resetPressedState();
  }
});

clearLogButton.addEventListener("click", () => {
  eventLogElement.innerHTML = '<li class="placeholder">按下任意按键后，这里会显示最近 12 条事件记录。</li>';
});

if (resetDetectedButton) {
  resetDetectedButton.addEventListener("click", resetDetectedState);
}

updateActiveKeys();