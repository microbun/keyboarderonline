# Internationalization Guide

## File responsibilities

- `locales.js`: language catalog + translation dictionaries only.
- `i18n.js`: i18n utilities (missing key warnings, locale shape checks).
- `script.js`: business logic + `t("...")` calls only (no translation data).

## Add new UI text

1. Add `data-i18n="yourKey"` to the HTML element.
2. Add `yourKey` in `locales.js` for both `en` and `zh-CN`.
3. If dynamic text has variables, use placeholders like `{value}` and call `t("yourKey", { value })`.

## Add a new language

1. Add language metadata in `languageCatalog`.
2. Add translation object under `translations`.
3. Keep keys aligned with `en`.

## Runtime checks

- Missing DOM keys are warned by `warnMissingKeys`.
- Missing locale keys against fallback language are warned by `validateLocaleShape`.
