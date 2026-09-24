"use client";

import { useEffect } from "react";

import { trackAnalyticsEvent } from "../../lib/analytics-events.js";

const analyticsDatasetProperties = Object.freeze({
  analyticsAnswerLoadMs: "answer_load_ms",
  analyticsAffordanceVariantId: "affordance_variant_id",
  analyticsAffordanceVariantName: "affordance_variant_name",
  analyticsButtonVariantId: "button_variant_id",
  analyticsButtonVariantName: "button_variant_name",
  analyticsCtaLocation: "cta_location",
  analyticsCreativeCombinationId: "creative_combination_id",
  analyticsCreativeFormat: "creative_format",
  analyticsDestination: "destination",
  analyticsExperimentId: "experiment_id",
  analyticsFeedbackRating: "feedback_rating",
  analyticsInteractionSource: "interaction_source",
  analyticsImageVariantId: "image_variant_id",
  analyticsImageVariantName: "image_variant_name",
  analyticsLinkId: "link_id",
  analyticsLinkLocation: "link_location",
  analyticsPlacementId: "placement_id",
  analyticsPlacementPosition: "placement_position",
  analyticsQuestionId: "question_id",
  analyticsSectionId: "section_id",
  analyticsSurface: "surface",
  analyticsTopicId: "topic_id",
  analyticsRotationStrategy: "rotation_strategy",
  analyticsVariantId: "variant_id",
  analyticsVariantName: "variant_name",
});

function propertiesFromElement(element) {
  return Object.fromEntries(
    Object.entries(analyticsDatasetProperties).flatMap(([datasetKey, propertyName]) => {
      const value = element.dataset[datasetKey];
      if (!value) return [];

      return [[
        propertyName,
        propertyName === "placement_position" ? Number(value) : value,
      ]];
    }),
  );
}

export function SiteInteractionAnalytics() {
  useEffect(() => {
    const trackAnnotatedClick = (event) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest("[data-analytics-event]");
      if (!(element instanceof HTMLElement)) return;
      if (element.matches(":disabled, [aria-disabled='true']")) return;

      trackAnalyticsEvent(
        element.dataset.analyticsEvent,
        propertiesFromElement(element),
      );
    };

    document.addEventListener("click", trackAnnotatedClick);
    return () => document.removeEventListener("click", trackAnnotatedClick);
  }, []);

  return null;
}
