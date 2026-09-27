export const supportedLanguages = Object.freeze(["en", "ru"]);
export const productionLanguage = "en";

/**
 * Production always resolves to English. Russian requires an explicit internal
 * manual-development configuration; this resolver is not connected to the UI.
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
