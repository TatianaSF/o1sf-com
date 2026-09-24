export const homeAnalyticsEventNames = Object.freeze([
  "section_view",
  "story_step_click",
  "story_completed",
  "site_navigation_click",
  "program_document_opened",
  "assistant_opened",
  "cta_impression",
  "cta_click",
]);

export const assistantAnalyticsEventNames = Object.freeze([
  "assistant_ready",
  "topic_selected",
  "question_selected",
  "answer_viewed",
  "assistant_search",
  "search_result_selected",
  "answer_feedback_submitted",
  "answer_action_click",
  "conversation_reset",
  "assistant_load_error",
  "assistant_engaged",
  "assistant_started",
]);

export const legacyAskDocumentEventNames = Object.freeze([
  "ask_document_viewed",
  "question_selected",
  "short_answer_opened",
  "full_answer_opened",
  "related_question_selected",
  "custom_question_submitted",
  "document_section_opened",
  "answer_feedback_submitted",
]);

export const analyticsEventNames = Object.freeze([
  ...new Set([
    ...homeAnalyticsEventNames,
    ...assistantAnalyticsEventNames,
    ...legacyAskDocumentEventNames,
  ]),
]);

const supportedEvents = new Set(analyticsEventNames);
const blockedPropertyNames = new Set([
  "answer_text",
  "email",
  "entry_id",
  "full_name",
  "name",
  "phone",
  "query",
  "question_text",
  "search_term",
  "session_id",
  "timestamp",
  "user_id",
]);
const analyticsPropertyNamePattern = /^[a-z][a-z0-9_]{0,39}$/;

export function sanitizeAnalyticsProperties(properties = {}) {
  if (!properties || typeof properties !== "object" || Array.isArray(properties)) {
    return {};
  }

  /** @type {Record<string, string | number | boolean>} */
  const safeProperties = {};

  for (const [propertyName, value] of Object.entries(properties)) {
    if (
      !analyticsPropertyNamePattern.test(propertyName) ||
      blockedPropertyNames.has(propertyName)
    ) {
      continue;
    }

    if (typeof value === "string") {
      const normalizedValue = value.trim().slice(0, 100);
      if (normalizedValue) safeProperties[propertyName] = normalizedValue;
    } else if (typeof value === "number" && Number.isFinite(value)) {
      safeProperties[propertyName] = value;
    } else if (typeof value === "boolean") {
      safeProperties[propertyName] = value;
    }
  }

  return safeProperties;
}

export function trackAnalyticsEvent(eventName, properties = {}) {
  if (!supportedEvents.has(eventName) || typeof window === "undefined") return false;

  const safeProperties = sanitizeAnalyticsProperties(properties);
  const analyticsWindow = /** @type {Window & {
   *   dataLayer?: Array<unknown>,
   *   gtag?: (...args: unknown[]) => void,
   *   o1sfDirectAnalytics?: boolean,
   * }} */ (window);
  analyticsWindow.dataLayer ??= [];
  if (analyticsWindow.o1sfDirectAnalytics && typeof analyticsWindow.gtag === "function") {
    analyticsWindow.gtag("event", eventName, safeProperties);
  } else {
    analyticsWindow.dataLayer.push({ event: eventName, ...safeProperties });
  }

  window.dispatchEvent(
    new CustomEvent("o1sf:analytics", {
      detail: { event: eventName, properties: safeProperties },
    }),
  );

  if (process.env.NODE_ENV === "development") {
    console.debug("[o1sf:analytics]", eventName, safeProperties);
  }
  return true;
}
