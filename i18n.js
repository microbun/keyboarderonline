// Internationalization helper hooks.
// Keep this file as the dedicated entry for i18n-related shared helpers.

window.KeyboaderI18nUtils = {
  warnMissingKeys(currentMessages, fallbackMessages, keys) {
    const missing = keys.filter((key) => !(key in currentMessages) && !(key in fallbackMessages));
    if (missing.length > 0) {
      console.warn("[i18n] Missing translation keys:", missing.join(", "));
    }
  },
  validateLocaleShape(translations, fallbackLanguage) {
    const fallback = translations[fallbackLanguage] || {};
    const fallbackKeys = Object.keys(fallback);

    Object.entries(translations).forEach(([language, messageMap]) => {
      const missing = fallbackKeys.filter((key) => !(key in messageMap));
      if (missing.length > 0) {
        console.warn(`[i18n] ${language} missing keys:`, missing.join(", "));
      }
    });
  },
};
