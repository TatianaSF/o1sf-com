import { getResourceLabel } from "../i18n/index.js";

const resourceLabels = Object.freeze({
  capital: "Capital",
  time: "Time",
  talent: "Organizational capacity",
});

/**
 * Reads costs directly from authored effects. Positive gains and world-state
 * changes are deliberately excluded so future benefits remain undisclosed.
 * @param {import("../engine/domain.js").Choice} choice
 * @returns {Array<{ resourceId: string, label: string, amount: number }>}
 */
export function getChoiceResourceCosts(choice, language = "en") {
  return choice.effects
    .filter((effect) => effect.target === "resources" && effect.delta < 0)
    .map((effect) => ({
      resourceId: effect.key,
      label: getResourceLabel(language, effect.key, resourceLabels[effect.key] ?? effect.key.replaceAll("_", " ")),
      amount: Math.abs(effect.delta),
    }));
}

/** @param {import("../engine/domain.js").Choice} choice */
export function formatChoiceResourceCost(choice, language = "en") {
  const costs = getChoiceResourceCosts(choice, language);
  const lead = language === "ru" ? "Затраты:" : "Cost:";
  return costs.length ? `${lead} ${costs.map(({ label, amount }) => `${label} ${amount}`).join(" · ")}` : null;
}
