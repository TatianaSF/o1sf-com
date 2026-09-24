export const CTA_EXPERIMENT_ID = "home_ai_assistant_cta_v3";
export const CTA_ROTATION_STRATEGY = "balanced_message_image_button_cycle";
export const CTA_VARIANT_COUNT = 8;
export const CTA_IMAGE_VARIANT_COUNT = 3;
export const CTA_BUTTON_VARIANT_COUNT = 4;
export const CTA_CYCLE_LENGTH =
  CTA_VARIANT_COUNT * CTA_IMAGE_VARIANT_COUNT * CTA_BUTTON_VARIANT_COUNT;
export const CTA_ATTRIBUTION_TTL_MS = 30 * 60 * 1000;

export const CTA_PLACEMENTS = Object.freeze([
  Object.freeze({ id: "after_testing_loop", position: 1 }),
  Object.freeze({ id: "after_pricing", position: 2 }),
  Object.freeze({ id: "faq", position: 3 }),
]);

export const CTA_VARIANTS = Object.freeze([
  Object.freeze({
    id: "cta_01",
    name: "get_clarity",
    headline: "Get clarity. Build a program that works.",
  }),
  Object.freeze({
    id: "cta_02",
    name: "ask_with_purpose",
    headline: "Ask with purpose. Build with confidence.",
  }),
  Object.freeze({
    id: "cta_03",
    name: "ask_better_questions",
    headline: "Ask better questions. Get better programs.",
  }),
  Object.freeze({
    id: "cta_04",
    name: "ask_anything",
    headline: "Ask anything. Build everything.",
  }),
  Object.freeze({
    id: "cta_05",
    name: "ask_smarter_questions",
    headline: "Ask smarter questions. Build smarter programs.",
  }),
  Object.freeze({
    id: "cta_06",
    name: "ask_what_matters",
    headline: "Ask what matters. Build what works.",
  }),
  Object.freeze({
    id: "cta_07",
    name: "find_the_right_question",
    headline: "Find the right question. Build the right program.",
  }),
  Object.freeze({
    id: "cta_08",
    name: "start_with_a_question",
    headline: "Start with a question. Build what customers want.",
  }),
]);

export const CTA_IMAGE_VARIANTS = Object.freeze([
  Object.freeze({
    id: "image_01",
    name: "chat_bubbles_overlap",
    alt: "Glossy blue and white speech bubbles representing an AI conversation",
    src320: "/assets/o1sf/cta-experiment-v2/chat-bubbles-overlap-320.webp",
    src640: "/assets/o1sf/cta-experiment-v2/chat-bubbles-overlap-640.webp",
  }),
  Object.freeze({
    id: "image_02",
    name: "assistant_dialogue_orb",
    alt: "Blue and white dialogue forms representing a focused program question",
    src320: "/assets/o1sf/cta-experiment-v2/assistant-dialogue-orb-320.webp",
    src640: "/assets/o1sf/cta-experiment-v2/assistant-dialogue-orb-640.webp",
  }),
  Object.freeze({
    id: "image_03",
    name: "conversation_spark",
    alt: "Glossy conversation bubbles with a small O1SF-style sparkle",
    src320: "/assets/o1sf/cta-experiment-v2/conversation-spark-320.webp",
    src640: "/assets/o1sf/cta-experiment-v2/conversation-spark-640.webp",
  }),
]);

export const CTA_BUTTON_VARIANTS = Object.freeze([
  Object.freeze({
    id: "button_01",
    name: "ask_ai_assistant",
    label: "Ask the AI assistant",
    affordanceId: "affordance_01",
    affordanceName: "speech_bubble_arrow",
  }),
  Object.freeze({
    id: "button_02",
    name: "tap_to_start_chatting",
    label: "Tap to start chatting",
    affordanceId: "affordance_02",
    affordanceName: "tap_finger_ripple_arrow",
  }),
  Object.freeze({
    id: "button_03",
    name: "start_the_conversation",
    label: "Start the conversation",
    affordanceId: "affordance_03",
    affordanceName: "speech_bubble_typing_cursor",
  }),
  Object.freeze({
    id: "button_04",
    name: "open_the_ai_chat",
    label: "Open the AI chat",
    affordanceId: "affordance_04",
    affordanceName: "sparkle_arrow_rays",
  }),
]);

const CTA_VARIANT_OFFSETS = Object.freeze([0, 3, 5]);
const CTA_PERMUTATION_MULTIPLIER = 29;
const CTA_SEED_STORAGE_KEY = "o1sf_cta_experiment_seed_v3";
const CTA_LOAD_STORAGE_KEY = "o1sf_cta_experiment_load_v3";
const CTA_ATTRIBUTION_STORAGE_KEY = "o1sf_cta_attribution_v3";

let cachedAttribution;
let cachedAttributionStoredAt;
let attributionWasRead = false;

function normalizeWholeNumber(value, fallback = 0) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

function normalizeRotationIndex(value) {
  return normalizeWholeNumber(value) % CTA_CYCLE_LENGTH;
}

export function buildCtaAssignment(rotationIndex = 0) {
  const normalizedIndex = normalizeRotationIndex(rotationIndex);
  const permutedIndex =
    (normalizedIndex * CTA_PERMUTATION_MULTIPLIER) % CTA_CYCLE_LENGTH;
  const baseVariantIndex = permutedIndex % CTA_VARIANT_COUNT;
  const baseImageIndex =
    Math.floor(permutedIndex / CTA_VARIANT_COUNT) % CTA_IMAGE_VARIANT_COUNT;
  const baseButtonIndex =
    Math.floor(permutedIndex / (CTA_VARIANT_COUNT * CTA_IMAGE_VARIANT_COUNT)) %
    CTA_BUTTON_VARIANT_COUNT;

  return CTA_PLACEMENTS.map((placement, placementIndex) => ({
    placement,
    variant: CTA_VARIANTS[
      (baseVariantIndex + CTA_VARIANT_OFFSETS[placementIndex]) % CTA_VARIANT_COUNT
    ],
    image: CTA_IMAGE_VARIANTS[
      (baseImageIndex + placementIndex) % CTA_IMAGE_VARIANT_COUNT
    ],
    button: CTA_BUTTON_VARIANTS[
      (baseButtonIndex + placementIndex) % CTA_BUTTON_VARIANT_COUNT
    ],
  }));
}

/**
 * @param {{
 *   storedSeed?: string | number | null,
 *   storedLoadCount?: string | number | null,
 *   randomValue?: number,
 * }} [options]
 */
export function resolveCtaExperimentLoad({
  storedSeed,
  storedLoadCount,
  randomValue = 0,
} = {}) {
  const hasStoredSeed = /^\d+$/.test(String(storedSeed ?? ""));
  const boundedRandomValue = Math.min(Math.max(Number(randomValue) || 0, 0), 0.999999999);
  const seed = hasStoredSeed
    ? normalizeRotationIndex(storedSeed)
    : Math.floor(boundedRandomValue * CTA_CYCLE_LENGTH);
  const loadCount = normalizeWholeNumber(storedLoadCount);

  return {
    seed,
    loadCount,
    nextLoadCount: loadCount + 1,
    rotationIndex: (seed + loadCount) % CTA_CYCLE_LENGTH,
  };
}

function browserRandomValue() {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    return randomBuffer[0] / 2 ** 32;
  }

  return Math.random();
}

export function createBrowserCtaAssignment() {
  const fallback = resolveCtaExperimentLoad({ randomValue: browserRandomValue() });

  if (typeof window === "undefined") {
    return { ...fallback, assignment: buildCtaAssignment(fallback.rotationIndex) };
  }

  try {
    const resolved = resolveCtaExperimentLoad({
      storedSeed: window.localStorage.getItem(CTA_SEED_STORAGE_KEY),
      storedLoadCount: window.localStorage.getItem(CTA_LOAD_STORAGE_KEY),
      randomValue: browserRandomValue(),
    });

    window.localStorage.setItem(CTA_SEED_STORAGE_KEY, String(resolved.seed));
    window.localStorage.setItem(CTA_LOAD_STORAGE_KEY, String(resolved.nextLoadCount));

    return { ...resolved, assignment: buildCtaAssignment(resolved.rotationIndex) };
  } catch {
    return { ...fallback, assignment: buildCtaAssignment(fallback.rotationIndex) };
  }
}

export function buildCtaAnalyticsProperties(placement, variant, image, button) {
  return {
    experiment_id: CTA_EXPERIMENT_ID,
    variant_id: variant.id,
    variant_name: variant.name,
    image_variant_id: image.id,
    image_variant_name: image.name,
    button_variant_id: button.id,
    button_variant_name: button.name,
    affordance_variant_id: button.affordanceId,
    affordance_variant_name: button.affordanceName,
    creative_combination_id: `${variant.id}_${image.id}_${button.id}`,
    placement_id: placement.id,
    placement_position: placement.position,
    creative_format: "image_text",
    rotation_strategy: CTA_ROTATION_STRATEGY,
    surface: "home",
    destination: "ask_document",
  };
}

function isValidAttribution(value, now) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const variant = CTA_VARIANTS.find((item) => item.id === value.variant_id);
  const image = CTA_IMAGE_VARIANTS.find((item) => item.id === value.image_variant_id);
  const button = CTA_BUTTON_VARIANTS.find((item) => item.id === value.button_variant_id);
  const placement = CTA_PLACEMENTS.find((item) => item.id === value.placement_id);
  const storedAt = Number(value.stored_at);

  return Boolean(
    value.experiment_id === CTA_EXPERIMENT_ID &&
    variant &&
    variant.name === value.variant_name &&
    image &&
    image.name === value.image_variant_name &&
    button &&
    button.name === value.button_variant_name &&
    button.affordanceId === value.affordance_variant_id &&
    button.affordanceName === value.affordance_variant_name &&
    value.creative_combination_id === `${variant.id}_${image.id}_${button.id}` &&
    placement &&
    value.placement_position === placement.position &&
    value.rotation_strategy === CTA_ROTATION_STRATEGY &&
    Number.isFinite(storedAt) &&
    storedAt <= now &&
    now - storedAt <= CTA_ATTRIBUTION_TTL_MS,
  );
}

export function storeCtaAttribution(properties, now = Date.now()) {
  if (typeof window === "undefined") return false;

  const attribution = {
    experiment_id: properties.experiment_id,
    variant_id: properties.variant_id,
    variant_name: properties.variant_name,
    image_variant_id: properties.image_variant_id,
    image_variant_name: properties.image_variant_name,
    button_variant_id: properties.button_variant_id,
    button_variant_name: properties.button_variant_name,
    affordance_variant_id: properties.affordance_variant_id,
    affordance_variant_name: properties.affordance_variant_name,
    creative_combination_id: properties.creative_combination_id,
    placement_id: properties.placement_id,
    placement_position: properties.placement_position,
    creative_format: properties.creative_format,
    rotation_strategy: properties.rotation_strategy,
    stored_at: now,
  };

  if (!isValidAttribution(attribution, now)) return false;

  try {
    window.sessionStorage.setItem(
      CTA_ATTRIBUTION_STORAGE_KEY,
      JSON.stringify(attribution),
    );
    cachedAttribution = undefined;
    cachedAttributionStoredAt = undefined;
    attributionWasRead = false;
    return true;
  } catch {
    return false;
  }
}

export function readCtaAttribution(now = Date.now()) {
  if (attributionWasRead) {
    if (
      cachedAttribution &&
      Number.isFinite(cachedAttributionStoredAt) &&
      cachedAttributionStoredAt <= now &&
      now - cachedAttributionStoredAt <= CTA_ATTRIBUTION_TTL_MS
    ) {
      return cachedAttribution;
    }

    cachedAttribution = undefined;
    cachedAttributionStoredAt = undefined;
    return undefined;
  }
  attributionWasRead = true;

  if (typeof window === "undefined") return undefined;

  try {
    const serialized = window.sessionStorage.getItem(CTA_ATTRIBUTION_STORAGE_KEY);
    window.sessionStorage.removeItem(CTA_ATTRIBUTION_STORAGE_KEY);
    if (!serialized) return undefined;

    const parsed = JSON.parse(serialized);
    if (!isValidAttribution(parsed, now)) return undefined;

    cachedAttribution = {
      experiment_id: parsed.experiment_id,
      variant_id: parsed.variant_id,
      variant_name: parsed.variant_name,
      image_variant_id: parsed.image_variant_id,
      image_variant_name: parsed.image_variant_name,
      button_variant_id: parsed.button_variant_id,
      button_variant_name: parsed.button_variant_name,
      affordance_variant_id: parsed.affordance_variant_id,
      affordance_variant_name: parsed.affordance_variant_name,
      creative_combination_id: parsed.creative_combination_id,
      placement_id: parsed.placement_id,
      placement_position: parsed.placement_position,
      creative_format: parsed.creative_format,
      rotation_strategy: parsed.rotation_strategy,
    };
    cachedAttributionStoredAt = Number(parsed.stored_at);
    return cachedAttribution;
  } catch {
    return undefined;
  }
}

export function resetCtaAttributionCacheForTests() {
  cachedAttribution = undefined;
  cachedAttributionStoredAt = undefined;
  attributionWasRead = false;
}
