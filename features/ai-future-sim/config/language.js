export const supportedLanguages = Object.freeze(["en", "ru"]);
export const productionLanguage = "en";

/**
 * Resolves the hidden, explicitly requested language flag. It deliberately
 * ignores browser preferences and accepts only a bare `?ru` parameter.
 * @param {string} search
 * @returns {"en" | "ru"}
 */
export function resolveAiFutureSimLanguageFromSearch(search = "") {
  const params = new URLSearchParams(search);
  return params.has("ru") && params.get("ru") === "" ? "ru" : productionLanguage;
}

/**
 * Language resolution for explicit configuration that is not sourced from the
 * public query string. The UI uses resolveAiFutureSimLanguageFromSearch for its
 * hidden, manually requested `?ru` presentation mode.
 * @param {{mode?: string, developmentLanguage?: string}} options
 * @returns {"en" | "ru"}
 */
export function resolveAiFutureSimLanguage({
  mode = "production",
  developmentLanguage,
} = {}) {
  if (mode === "manual_development" && developmentLanguage === "ru") {
    return "ru";
  }

  if (mode !== "production" && mode !== "manual_development") {
    throw new TypeError(`Unsupported AI Future Sim language mode: ${mode}`);
  }

  return productionLanguage;
}
