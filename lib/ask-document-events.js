import {
  assistantAnalyticsEventNames,
  legacyAskDocumentEventNames,
  trackAnalyticsEvent,
} from "./analytics-events.js";
import { readCtaAttribution } from "./cta-experiment.js";

export const askDocumentEventNames = Object.freeze([
  ...new Set([
    ...legacyAskDocumentEventNames,
    ...assistantAnalyticsEventNames,
    "program_document_opened",
  ]),
]);

const supportedEvents = new Set(askDocumentEventNames);

export function trackAskDocumentEvent(eventName, properties = {}) {
  if (!supportedEvents.has(eventName) || typeof window === "undefined") return false;
  const attribution = readCtaAttribution();
  const tracked = trackAnalyticsEvent(eventName, {
    ...properties,
    ...attribution,
  });
  if (tracked) {
    window.dispatchEvent(
      new CustomEvent("o1sf:ask-document", {
        detail: { event: eventName },
      }),
    );
  }
  return tracked;
}
