"use client";

import { useEffect } from "react";

import { trackAnalyticsEvent } from "../../lib/analytics-events.js";

const SECTION_VIEW_DELAY_MS = 1000;

export function HomeAnalytics() {
  useEffect(() => {
    const sections = [...document.querySelectorAll("[data-analytics-section]")];
    if (!sections.length || typeof IntersectionObserver === "undefined") return undefined;

    const viewedSectionIds = new Set();
    const pendingTimers = new Map();
    const sectionPositionByElement = new Map(
      sections.map((section, index) => [section, index + 1]),
    );

    const markSectionViewed = (section) => {
      const sectionId = section.dataset.analyticsSection;
      if (!sectionId || viewedSectionIds.has(sectionId)) return;

      viewedSectionIds.add(sectionId);
      trackAnalyticsEvent("section_view", {
        surface: "home",
        section_id: sectionId,
        section_position: sectionPositionByElement.get(section),
      });

      if (section.dataset.analyticsCompletion === "true") {
        trackAnalyticsEvent("story_completed", {
          surface: "home",
          section_id: sectionId,
          sections_viewed: viewedSectionIds.size,
        });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = entry.target;
          if (entry.isIntersecting) {
            if (pendingTimers.has(section)) continue;
            pendingTimers.set(
              section,
              window.setTimeout(() => {
                pendingTimers.delete(section);
                markSectionViewed(section);
                observer.unobserve(section);
              }, SECTION_VIEW_DELAY_MS),
            );
          } else {
            window.clearTimeout(pendingTimers.get(section));
            pendingTimers.delete(section);
          }
        }
      },
      { rootMargin: "-20% 0px -40% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      pendingTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return null;
}
