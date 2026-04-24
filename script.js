const keyElements = new Map(
  Array.from(document.querySelectorAll("[data-code]")).map((element) => [element.dataset.code, element]),
);

const i18nResource = window.KeyboaderI18nResource;
if (!i18nResource) {
  throw new Error("Missing i18n resource. Ensure locales.js loads before script.js.");
}

const { languageCatalog, translations, defaultLanguage } = i18nResource;
const supportedLanguages = Object.keys(translations);
const explicitLanguageStorageKey = "keyboader-language";
const i18nUtils = window.KeyboaderI18nUtils;
i18nUtils?.validateLocaleShape(translations, defaultLanguage);

const languageSelectElement = document.querySelector("#languageSelect");
const totalPressesElement = document.querySelector("#totalPresses");
const activeCountElement = document.querySelector("#activeCount");
const lastCodeElement = document.querySelector("#lastCode");
const responseSpeedElement = document.querySelector("#responseSpeed");
const responseMetaElement = document.querySelector("#responseMeta");
const responseSpeedCardElement = document.querySelector("#responseSpeedCard");
const nkroLevelElement = document.querySelector("#nkroLevel");
const nkroMetaElement = document.querySelector("#nkroMeta");
const nkroCardElement = document.querySelector("#nkroCard");
const lastKeyLabelElement = document.querySelector("#lastKeyLabel");
const lastKeyMetaElement = document.querySelector("#lastKeyMeta");
const activeHintElement = document.querySelector("#activeHint");
const activeKeysElement = document.querySelector("#activeKeys");
const eventLogElement = document.querySelector("#eventLog");
const clearLogButton = document.querySelector("#clearLogButton");
const resetDetectedButton = document.querySelector("#resetDetectedButton");
const logItemTemplate = document.querySelector("#logItemTemplate");
const startInspectionButton = document.querySelector("#startInspectionButton");
const resetSessionButton = document.querySelector("#resetSessionButton");
const exportJsonButton = document.querySelector("#exportJsonButton");
const exportTextButton = document.querySelector("#exportTextButton");
const inspectionProgressElement = document.querySelector("#inspectionProgress");
const inspectionRemainingElement = document.querySelector("#inspectionRemaining");
const anomalyListElement = document.querySelector("#anomalyList");
const metaDescriptionElement = document.querySelector("#metaDescription");
const metaKeywordsElement = document.querySelector("#metaKeywords");
const canonicalElement = document.querySelector("#canonicalUrl");
const ogTitleElement = document.querySelector("#ogTitle");
const ogDescriptionElement = document.querySelector("#ogDescription");
const ogUrlElement = document.querySelector("#ogUrl");
const ogLocaleElement = document.querySelector("#ogLocale");
const twitterTitleElement = document.querySelector("#twitterTitle");
const twitterDescriptionElement = document.querySelector("#twitterDescription");
const seoStructuredDataElement = document.querySelector("#seoStructuredData");
const faqStructuredDataElement = document.querySelector("#faqStructuredData");
const alternateLinkElements = Array.from(document.querySelectorAll("link[rel='alternate'][data-hreflang]"));
const lockElements = new Map(
  Array.from(document.querySelectorAll("[data-lock]")).map((element) => [element.dataset.lock, element]),
);

const pressedCodes = new Set();
const testedCodes = new Set();
const unknownKeys = new Map();
const fallbackReleaseTimers = new Map();

let selectedLanguage = "auto";
let resolvedLanguage = defaultLanguage;

let totalPresses = 0;
let responseSampleCount = 0;
let responseAverage = 0;
let pendingResponseFrame = 0;
let maxSimultaneousPressed = 0;
let maxPrintableSimultaneousPressed = 0;

let inspectionRunning = false;
let inspectionStartedAt = 0;
const inspectionRequiredCodes = new Set(keyElements.keys());
const inspectedCodes = new Set();

const keydownStartByCode = new Map();
const stuckTimers = new Map();
const anomalyStats = new Map();

const rapidThresholdMs = 45;
const stuckThresholdMs = 3200;
const nkroThreshold = 10;
const sixKroThreshold = 6;

function isPrintableCode(code) {
  return (
    code.startsWith("Key")
    || code.startsWith("Digit")
    || code === "Space"
    || code.startsWith("Numpad")
    || code === "Minus"
    || code === "Equal"
    || code === "BracketLeft"
    || code === "BracketRight"
    || code === "Backslash"
    || code === "Semicolon"
    || code === "Quote"
    || code === "Comma"
    || code === "Period"
    || code === "Slash"
    || code === "Backquote"
  );
}

function getPrintableActiveCount() {
  let count = 0;
  pressedCodes.forEach((code) => {
    if (isPrintableCode(code)) {
      count += 1;
    }
  });
  return count;
}

function renderNkroState() {
  if (!nkroLevelElement || !nkroMetaElement || !nkroCardElement) {
    return;
  }

  let levelKey = "nkroLevel1";
  let statusKey = "nkroStatusBasic";
  let cardClass = "is-basic";

  if (maxPrintableSimultaneousPressed >= nkroThreshold) {
    levelKey = "nkroLevelNkro";
    statusKey = "nkroStatusPass";
    cardClass = "is-pass";
  } else if (maxPrintableSimultaneousPressed >= sixKroThreshold) {
    levelKey = "nkroLevel6";
    statusKey = "nkroStatusGood";
    cardClass = "is-good";
  } else if (maxPrintableSimultaneousPressed >= 2) {
    levelKey = "nkroLevel2";
    statusKey = "nkroStatusLimited";
    cardClass = "is-limited";
  }

  nkroLevelElement.textContent = t(levelKey);
  nkroMetaElement.textContent = t(statusKey, {
    max: maxSimultaneousPressed,
    printable: maxPrintableSimultaneousPressed,
  });
  nkroCardElement.classList.remove("is-basic", "is-limited", "is-good", "is-pass");
  nkroCardElement.classList.add(cardClass);
}

function getAnomalyRecord(code) {
  if (!anomalyStats.has(code)) {
    anomalyStats.set(code, {
      code,
      rapidCount: 0,
      stuckCount: 0,
      repeatCount: 0,
      lastDownAt: 0,
    });
  }

  return anomalyStats.get(code);
}

function renderInspectionStatus() {
  if (!inspectionProgressElement || !inspectionRemainingElement) {
    return;
  }

  const requiredTotal = inspectionRequiredCodes.size;
  const completed = inspectedCodes.size;
  const percent = requiredTotal === 0 ? 0 : Math.round((completed / requiredTotal) * 100);

  inspectionProgressElement.textContent = inspectionRunning
    ? t("inspectionProgressRunning", { completed, requiredTotal, percent })
    : t("inspectionProgressIdle", { completed, requiredTotal, percent });

  const remaining = Array.from(inspectionRequiredCodes)
    .filter((code) => !inspectedCodes.has(code))
    .slice(0, 8);

  inspectionRemainingElement.textContent = remaining.length > 0
    ? t("inspectionRemainingPrefix", {
      keys: `${remaining.join(", ")}${requiredTotal - completed > 8 ? " ..." : ""}`,
    })
    : t("inspectionRemainingDone");

  if (startInspectionButton) {
    startInspectionButton.classList.toggle("is-running", inspectionRunning);
    startInspectionButton.textContent = inspectionRunning
      ? t("startInspectionButtonRunning")
      : t("startInspectionButton");
  }
}

function renderAnomalyList() {
  if (!anomalyListElement) {
    return;
  }

  const rows = Array.from(anomalyStats.values())
    .filter((item) => item.rapidCount > 0 || item.stuckCount > 0 || item.repeatCount > 0)
    .sort((left, right) => {
      const leftScore = left.stuckCount * 100 + left.rapidCount * 10 + left.repeatCount;
      const rightScore = right.stuckCount * 100 + right.rapidCount * 10 + right.repeatCount;
      return rightScore - leftScore;
    });

  anomalyListElement.replaceChildren();

  if (rows.length === 0) {
    anomalyListElement.innerHTML = `<li class="placeholder">${t("anomalyPlaceholder")}</li>`;
    return;
  }

  rows.slice(0, 10).forEach((item) => {
    const row = document.createElement("li");
    row.textContent = t("anomalyRow", {
      code: item.code,
      stuck: item.stuckCount,
      rapid: item.rapidCount,
      repeat: item.repeatCount,
    });
    anomalyListElement.append(row);
  });
}

function beginInspection() {
  inspectionRunning = true;
  inspectionStartedAt = Date.now();
  inspectedCodes.clear();
  renderInspectionStatus();
}

function markInspectedCode(code) {
  if (!inspectionRunning || !inspectionRequiredCodes.has(code)) {
    return;
  }

  inspectedCodes.add(code);

  if (inspectedCodes.size === inspectionRequiredCodes.size) {
    inspectionRunning = false;
  }

  renderInspectionStatus();
}

function clearStuckTimer(code) {
  const timerId = stuckTimers.get(code);

  if (timerId) {
    clearTimeout(timerId);
    stuckTimers.delete(code);
  }
}

function scheduleStuckCheck(code) {
  clearStuckTimer(code);

  const timerId = setTimeout(() => {
    stuckTimers.delete(code);

    if (!pressedCodes.has(code)) {
      return;
    }

    const record = getAnomalyRecord(code);
    record.stuckCount += 1;
    renderAnomalyList();
  }, stuckThresholdMs);

  stuckTimers.set(code, timerId);
}

function resetInspectionSession() {
  inspectionRunning = false;
  inspectionStartedAt = 0;
  inspectedCodes.clear();

  keydownStartByCode.clear();
  stuckTimers.forEach((timerId) => clearTimeout(timerId));
  stuckTimers.clear();

  anomalyStats.clear();
  maxSimultaneousPressed = 0;
  maxPrintableSimultaneousPressed = 0;
  renderAnomalyList();
  renderInspectionStatus();
  renderNkroState();
}

function buildReport() {
  const requiredCodes = Array.from(inspectionRequiredCodes);
  const missingCodes = requiredCodes.filter((code) => !inspectedCodes.has(code));
  const anomalyRows = Array.from(anomalyStats.values()).filter(
    (item) => item.rapidCount > 0 || item.stuckCount > 0 || item.repeatCount > 0,
  );

  return {
    generatedAt: new Date().toISOString(),
    totalPresses,
    responseAverageMs: Number(responseAverage.toFixed(2)),
    nkro: {
      maxSimultaneousPressed,
      maxPrintableSimultaneousPressed,
      estimatedLevel:
        maxPrintableSimultaneousPressed >= nkroThreshold
          ? "NKRO"
          : maxPrintableSimultaneousPressed >= sixKroThreshold
            ? "6KRO"
            : maxPrintableSimultaneousPressed >= 2
              ? "2KRO"
              : "1KRO",
    },
    inspection: {
      running: inspectionRunning,
      startedAt: inspectionStartedAt ? new Date(inspectionStartedAt).toISOString() : null,
      requiredKeys: requiredCodes.length,
      testedKeys: inspectedCodes.size,
      completionRate: requiredCodes.length === 0 ? 0 : Number(((inspectedCodes.size / requiredCodes.length) * 100).toFixed(1)),
      missingCodes,
    },
    anomalies: anomalyRows,
    environment: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
    },
  };
}

function downloadFile(fileName, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportJsonReport() {
  const report = buildReport();
  downloadFile(
    `keyboader-report-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
    JSON.stringify(report, null, 2),
    "application/json;charset=utf-8",
  );
}

function exportTextReport() {
  const report = buildReport();
  const lines = [
    t("reportTitle"),
    t("reportGeneratedAt", { value: report.generatedAt }),
    t("reportTotalPresses", { value: report.totalPresses }),
    t("reportAverageResponse", { value: report.responseAverageMs }),
    t("reportNkro", {
      level: report.nkro.estimatedLevel,
      max: report.nkro.maxSimultaneousPressed,
      printable: report.nkro.maxPrintableSimultaneousPressed,
    }),
    t("reportInspection", {
      tested: report.inspection.testedKeys,
      required: report.inspection.requiredKeys,
      rate: report.inspection.completionRate,
    }),
    t("reportMissingKeys", {
      value: report.inspection.missingCodes.length > 0 ? report.inspection.missingCodes.join(", ") : t("reportNone"),
    }),
    t("reportAnomalies", { value: report.anomalies.length }),
  ];

  report.anomalies.forEach((item) => {
    lines.push(
      `- ${item.code}: stuck=${item.stuckCount}, rapid=${item.rapidCount}, repeat=${item.repeatCount}`,
    );
  });

  downloadFile(
    `keyboader-report-${new Date().toISOString().replace(/[:.]/g, "-")}.txt`,
    `${lines.join("\n")}\n`,
    "text/plain;charset=utf-8",
  );
}

const languageLookup = new Map();

Object.entries(languageCatalog).forEach(([languageCode, metadata]) => {
  languageLookup.set(languageCode.toLowerCase(), languageCode);

  metadata.aliases.forEach((alias) => {
    languageLookup.set(alias.toLowerCase(), languageCode);
  });
});

function normalizeLanguage(input) {
  if (!input) {
    return null;
  }

  const value = String(input).trim();
  if (!value) {
    return null;
  }

  const normalizedValue = value.toLowerCase().replace(/_/g, "-");

  if (languageLookup.has(normalizedValue)) {
    return languageLookup.get(normalizedValue);
  }

  const parts = normalizedValue.split("-");

  while (parts.length > 1) {
    parts.pop();
    const partial = parts.join("-");

    if (languageLookup.has(partial)) {
      return languageLookup.get(partial);
    }
  }

  return languageLookup.get(parts[0]) || null;
}

function inferLanguageFromSource(value) {
  if (!value) {
    return null;
  }

  const lowerValue = String(value).toLowerCase();
  const tokens = lowerValue.match(/[a-z]{2,}(?:-[a-z]{2,4})?/g) || [];

  for (const token of tokens) {
    const match = normalizeLanguage(token);

    if (match) {
      return match;
    }
  }

  return null;
}

function renderLanguageOptions() {
  if (!languageSelectElement) {
    return;
  }

  const previousValue = languageSelectElement.value;
  languageSelectElement.replaceChildren();

  const autoOption = document.createElement("option");
  autoOption.value = "auto";
  autoOption.textContent = t("languageOptionAuto");
  languageSelectElement.append(autoOption);

  supportedLanguages.forEach((languageCode) => {
    const option = document.createElement("option");
    option.value = languageCode;
    option.textContent = languageCatalog[languageCode].label;
    languageSelectElement.append(option);
  });

  languageSelectElement.value = supportedLanguages.includes(previousValue) || previousValue === "auto"
    ? previousValue
    : selectedLanguage;
}

function detectAutoLanguage() {
  const params = new URLSearchParams(window.location.search);
  const queryLanguage = normalizeLanguage(params.get("lang"));
  if (queryLanguage) {
    return queryLanguage;
  }

  const referrerLanguage = inferLanguageFromSource(document.referrer);
  if (referrerLanguage) {
    return referrerLanguage;
  }

  const hostLanguage = inferLanguageFromSource(window.location.hostname);
  if (hostLanguage) {
    return hostLanguage;
  }

  const browserLanguage = normalizeLanguage(
    Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages[0]
      : navigator.language,
  );

  return browserLanguage || defaultLanguage;
}

function getMessages() {
  return translations[resolvedLanguage] || translations[defaultLanguage];
}

function t(key, replacements = {}) {
  const template = getMessages()[key] ?? translations[defaultLanguage][key] ?? key;

  return Object.entries(replacements).reduce(
    (message, [token, value]) => message.replace(`{${token}}`, String(value)),
    template,
  );
}

function getPreferredLanguage() {
  const storedLanguage = normalizeLanguage(localStorage.getItem(explicitLanguageStorageKey));
  return storedLanguage || defaultLanguage;
}

function toOpenGraphLocale(languageCode) {
  const localeMap = {
    "zh-CN": "zh_CN",
    en: "en_US",
    de: "de_DE",
    fr: "fr_FR",
    ja: "ja_JP",
  };

  return localeMap[languageCode] || "en_US";
}

function buildLocalizedUrl(languageCode) {
  const url = new URL(window.location.href);

  if (languageCode) {
    url.searchParams.set("lang", languageCode);
  } else {
    url.searchParams.delete("lang");
  }

  return url.toString();
}

function trimToWordBoundary(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }

  const shortened = text.slice(0, maxLength);
  const lastSpaceIndex = shortened.lastIndexOf(" ");

  if (lastSpaceIndex > Math.floor(maxLength * 0.6)) {
    return `${shortened.slice(0, lastSpaceIndex)}...`;
  }

  return `${shortened.trim()}...`;
}

function normalizeSeoDescription(description, languageCode) {
  const compactDescription = String(description || "").replace(/\s+/g, " ").trim();
  const maxLengthByLanguage = {
    "zh-CN": 86,
    ja: 96,
    en: 160,
    de: 165,
    fr: 165,
  };
  const maxLength = maxLengthByLanguage[languageCode] || 160;

  if (compactDescription.length <= maxLength) {
    return compactDescription;
  }

  if (languageCode === "zh-CN" || languageCode === "ja") {
    return `${compactDescription.slice(0, Math.max(1, maxLength - 1)).trim()}…`;
  }

  return trimToWordBoundary(compactDescription, Math.max(1, maxLength - 3));
}

function getFaqEntries(languageCode) {
  const faqEntriesByLanguage = {
    "zh-CN": [
      {
        question: "这个在线键盘测试工具可以检测什么问题？",
        answer:
          "可以检测按键失灵、连击（chatter）、卡键（stuck key）和键位映射异常，并实时显示 key、code 和物理位置。",
      },
      {
        question: "是否需要下载安装软件才能测试键盘？",
        answer: "不需要。直接在浏览器打开页面即可开始测试。",
      },
      {
        question: "测试结果可以导出吗？",
        answer: "可以，支持导出 JSON 和文本报告，方便保存或发送给售后排查。",
      },
    ],
    en: [
      {
        question: "What issues can this keyboard tester detect?",
        answer:
          "It can help detect dead keys, key chatter, stuck keys, and key mapping issues while showing key, code, and location in real time.",
      },
      {
        question: "Do I need to install any software?",
        answer: "No. You can run the keyboard test directly in your browser.",
      },
      {
        question: "Can I export the test results?",
        answer: "Yes. You can export both JSON and text inspection reports.",
      },
    ],
    de: [
      {
        question: "Welche Probleme kann der Tastaturtest erkennen?",
        answer:
          "Er erkennt unter anderem defekte Tasten, Prellen, haengende Tasten und Zuordnungsfehler und zeigt Taste, Code und Position in Echtzeit an.",
      },
      {
        question: "Muss ich eine Software installieren?",
        answer: "Nein, der Test laeuft direkt im Browser.",
      },
      {
        question: "Kann ich die Testergebnisse exportieren?",
        answer: "Ja, als JSON oder als Textbericht.",
      },
    ],
    fr: [
      {
        question: "Quels problemes ce testeur de clavier peut-il detecter ?",
        answer:
          "Il aide a detecter les touches mortes, le chatter, les touches bloquees et les erreurs de mappage, avec affichage en temps reel.",
      },
      {
        question: "Faut-il installer un logiciel ?",
        answer: "Non, le test fonctionne directement dans le navigateur.",
      },
      {
        question: "Peut-on exporter les resultats ?",
        answer: "Oui, en JSON et en rapport texte.",
      },
    ],
    ja: [
      {
        question: "このキーボードテストで何を確認できますか？",
        answer:
          "キーの反応不良、チャタリング、押しっぱなし、キー配列の異常を確認でき、key・code・位置をリアルタイム表示します。",
      },
      {
        question: "ソフトのインストールは必要ですか？",
        answer: "不要です。ブラウザですぐにテストできます。",
      },
      {
        question: "結果はエクスポートできますか？",
        answer: "はい。JSON とテキストレポートを出力できます。",
      },
    ],
  };

  return faqEntriesByLanguage[languageCode] || faqEntriesByLanguage.en;
}

function updateSeoMetadata() {
  const title = t("pageTitle");
  const explicitLanguage = selectedLanguage === "auto" ? null : resolvedLanguage;
  const canonicalUrl = buildLocalizedUrl(explicitLanguage);
  const currentLanguage = explicitLanguage || resolvedLanguage;
  const description = normalizeSeoDescription(t("seoDescription"), currentLanguage);
  const keywords = t("seoKeywords");

  if (metaDescriptionElement) {
    metaDescriptionElement.content = description;
  }

  if (metaKeywordsElement) {
    metaKeywordsElement.content = keywords;
  }

  if (canonicalElement) {
    canonicalElement.href = canonicalUrl;
  }

  if (ogTitleElement) {
    ogTitleElement.content = title;
  }

  if (ogDescriptionElement) {
    ogDescriptionElement.content = description;
  }

  if (ogUrlElement) {
    ogUrlElement.content = canonicalUrl;
  }

  if (ogLocaleElement) {
    ogLocaleElement.content = toOpenGraphLocale(currentLanguage);
  }

  if (twitterTitleElement) {
    twitterTitleElement.content = title;
  }

  if (twitterDescriptionElement) {
    twitterDescriptionElement.content = description;
  }

  alternateLinkElements.forEach((linkElement) => {
    const hrefLang = linkElement.dataset.hreflang;
    if (!hrefLang || hrefLang === "x-default") {
      linkElement.href = buildLocalizedUrl(null);
      return;
    }

    linkElement.href = buildLocalizedUrl(hrefLang);
  });

  if (seoStructuredDataElement) {
    seoStructuredDataElement.textContent = JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Keyboader Tester",
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web",
        inLanguage: currentLanguage,
        description,
        url: canonicalUrl,
      },
      null,
      2,
    );
  }

  if (faqStructuredDataElement) {
    faqStructuredDataElement.textContent = JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: currentLanguage,
        mainEntity: getFaqEntries(currentLanguage).map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: entry.answer,
          },
        })),
      },
      null,
      2,
    );
  }
}

function refreshStaticText() {
  renderLanguageOptions();
  const i18nKeysInDom = Array.from(document.querySelectorAll("[data-i18n]"))
    .map((element) => element.dataset.i18n)
    .filter(Boolean);

  i18nUtils?.warnMissingKeys(getMessages(), translations[defaultLanguage], i18nKeysInDom);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const i18nKey = element.dataset.i18n;
    if (!i18nKey) {
      return;
    }
    element.textContent = t(i18nKey);
  });

  document.documentElement.lang = resolvedLanguage;
  document.title = t("pageTitle");
  updateSeoMetadata();
  languageSelectElement?.setAttribute("aria-label", t("languageLabel"));

  if (totalPresses === 0) {
    lastKeyLabelElement.textContent = t("waitingInput");
    lastKeyMetaElement.textContent = t("lastKeyMetaIdle");
  }

  if (responseSampleCount === 0) {
    responseMetaElement.textContent = t("responseMetaIdle");
  } else {
    responseMetaElement.textContent = t("responseMetaAverage", {
      value: responseAverage.toFixed(1),
    });
  }

  renderNkroState();

  if (eventLogElement.querySelector(".placeholder")) {
    eventLogElement.innerHTML = `<li class="placeholder">${t("eventLogPlaceholder")}</li>`;
  }

  updateActiveKeys();
  updateLockState();
  renderInspectionStatus();
  renderAnomalyList();
}

function applyLanguage(nextSelection) {
  selectedLanguage = nextSelection;
  resolvedLanguage = nextSelection === "auto" ? detectAutoLanguage() : nextSelection;

  if (selectedLanguage === "auto") {
    localStorage.removeItem(explicitLanguageStorageKey);
  } else {
    localStorage.setItem(explicitLanguageStorageKey, selectedLanguage);
  }

  if (languageSelectElement) {
    languageSelectElement.value = selectedLanguage;
  }

  refreshStaticText();
}

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
      responseMetaElement.textContent = t("responseMetaAverage", {
        value: responseAverage.toFixed(1),
      });

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
    return event.code === "Space" ? "Space" : t("keyValueUnknown");
  }

  if (event.key.length === 1) {
    return event.key.toUpperCase();
  }

  return event.key;
}

function formatLocation(location) {
  const labels = {
    0: t("standard"),
    1: t("left"),
    2: t("right"),
    3: t("numpad"),
  };

  return labels[location] || t("standard");
}

function localizeEventType(type) {
  if (type === "keydown" || type === "down") {
    return t("eventTypeKeydown");
  }

  if (type === "keyup" || type === "up") {
    return t("eventTypeKeyup");
  }

  if (type === "repeat") {
    return t("eventTypeRepeat");
  }

  return type;
}

function setLastEvent(event, type) {
  const resolvedCode = resolveCode(event) || event.code;
  const label = formatKeyLabel(event);
  lastKeyLabelElement.textContent = label;
  if (lastCodeElement) {
    lastCodeElement.textContent = resolvedCode || "-";
  }
  lastKeyMetaElement.textContent = `${localizeEventType(type)} / ${resolvedCode || t("codeValueUnknown")} / ${label} / ${formatLocation(event.location)}`;
}

function updateActiveKeys() {
  activeCountElement.textContent = String(pressedCodes.size);
  activeKeysElement.replaceChildren();

  if (pressedCodes.size === 0) {
    const placeholder = document.createElement("span");
    placeholder.className = "placeholder-chip";
    placeholder.textContent = t("activeKeysPlaceholder");
    activeKeysElement.append(placeholder);
    activeHintElement.textContent = t("noActiveKeys");
    return;
  }

  activeHintElement.textContent = t("keepPressingHint");

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

    if (!lockElement) {
      return;
    }

    const isOn = typeof event?.getModifierState === "function" ? event.getModifierState(lockName) : lockElement.classList.contains("is-on");
    lockElement.classList.toggle("is-on", isOn);
    lockElement.querySelector("b").textContent = isOn ? t("on") : t("off");
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
  entry.querySelector(".log-type").textContent = localizeEventType(type);
  entry.querySelector(".log-code").textContent = resolvedCode || t("codeValueUnknown");
  entry.querySelector(".log-key").textContent = formatKeyLabel(event);
  entry.querySelector(".log-extra").textContent = t("logExtra", {
    key: JSON.stringify(event.key),
    location: formatLocation(event.location),
    repeat: event.repeat ? t("repeatSuffix") : "",
  });
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
  dynamicKey.innerHTML = `<span>${code}</span><small>${t("unmapped")}</small>`;
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

  const now = performance.now();
  const anomalyRecord = getAnomalyRecord(code);

  if (!event.repeat && anomalyRecord.lastDownAt > 0 && now - anomalyRecord.lastDownAt <= rapidThresholdMs) {
    anomalyRecord.rapidCount += 1;
  }

  if (event.repeat) {
    anomalyRecord.repeatCount += 1;
  }

  anomalyRecord.lastDownAt = now;

  if (!event.repeat) {
    keydownStartByCode.set(code, now);
    scheduleStuckCheck(code);
  }

  pressedCodes.add(code);
  maxSimultaneousPressed = Math.max(maxSimultaneousPressed, pressedCodes.size);
  maxPrintableSimultaneousPressed = Math.max(maxPrintableSimultaneousPressed, getPrintableActiveCount());
  scheduleFallbackRelease(code);
  markInspectedCode(code);
  setLastEvent(event, event.repeat ? "repeat" : "keydown");
  activateKey(event);
  updateActiveKeys();
  updateLockState(event);
  appendLog(event, event.repeat ? "repeat" : "down");
  renderAnomalyList();
  renderNkroState();
}

function handleKeyup(event) {
  event.preventDefault();
  const resolvedCode = resolveCode(event);
  const code = resolvedCode || event.code;

  // Some OS/browser combos only surface PrintScreen on keyup.
  // Pulse the key so users still get visual detection feedback.
  if (code === "PrintScreen" && !pressedCodes.has(code)) {
    const keyElement = keyElements.get(code) || ensureUnknownKey(code);
    if (keyElement) {
      testedCodes.add(code);
      keyElement.classList.add("is-tested", "is-active");
      window.setTimeout(() => {
        keyElement.classList.remove("is-active", "is-repeating");
      }, 180);
    }
  }

  clearFallbackRelease(code);
  clearStuckTimer(code);
  keydownStartByCode.delete(code);
  pressedCodes.delete(code);
  setLastEvent(event, "keyup");
  releaseKey(event);
  updateActiveKeys();
  updateLockState(event);
  appendLog(event, "up");
  renderNkroState();
}

function resetPressedState() {
  fallbackReleaseTimers.forEach((timerId) => clearTimeout(timerId));
  fallbackReleaseTimers.clear();
  stuckTimers.forEach((timerId) => clearTimeout(timerId));
  stuckTimers.clear();
  keydownStartByCode.clear();

  pressedCodes.forEach((code) => {
    const keyElement = keyElements.get(code) || unknownKeys.get(code);
    keyElement?.classList.remove("is-active", "is-repeating");
  });

  pressedCodes.clear();
  updateActiveKeys();
  renderNkroState();
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
  eventLogElement.innerHTML = `<li class="placeholder">${t("eventLogPlaceholder")}</li>`;
});

if (resetDetectedButton) {
  resetDetectedButton.addEventListener("click", resetDetectedState);
}

if (startInspectionButton) {
  startInspectionButton.addEventListener("click", beginInspection);
}

if (resetSessionButton) {
  resetSessionButton.addEventListener("click", resetInspectionSession);
}

if (exportJsonButton) {
  exportJsonButton.addEventListener("click", exportJsonReport);
}

if (exportTextButton) {
  exportTextButton.addEventListener("click", exportTextReport);
}

if (languageSelectElement) {
  languageSelectElement.addEventListener("change", (event) => {
    applyLanguage(event.currentTarget.value);
  });
}

selectedLanguage = normalizeLanguage(localStorage.getItem(explicitLanguageStorageKey)) || defaultLanguage;
resolvedLanguage = getPreferredLanguage();
if (languageSelectElement) {
  languageSelectElement.value = selectedLanguage;
}
refreshStaticText();
updateActiveKeys();
renderInspectionStatus();
renderAnomalyList();
renderNkroState();