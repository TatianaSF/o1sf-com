"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { trackAnalyticsEvent } from "../../lib/analytics-events.js";
import styles from "./HomeSectionNavigator.module.css";

const sections = Object.freeze([
  { id: "top", label: "Start" },
  { id: "outcomes", label: "The shift" },
  { id: "program", label: "Program" },
  { id: "testing-loop", label: "Testing loop" },
  { id: "deliverables", label: "What you leave with" },
  { id: "san-francisco", label: "San Francisco" },
  { id: "support", label: "Program support" },
  { id: "network", label: "Professional network" },
  { id: "pricing", label: "Pricing" },
  { id: "resources", label: "Founder resources" },
  { id: "fit", label: "Who it is for" },
  { id: "faq", label: "FAQ" },
]);

const HANDLE_SIZE = 44;
const KEYBOARD_STEP = 0.06;

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function HomeSectionNavigator() {
  const [activeId, setActiveId] = useState(sections[0].id);
  const [isDragging, setIsDragging] = useState(false);
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const activeIdRef = useRef(activeId);
  const dragStartYRef = useRef(0);
  const movedDuringDragRef = useRef(false);
  const trackRef = useRef(null);
  const panelIsOpen = isDragging || isPinnedOpen;

  const activeLabel = useMemo(
    () => sections.find((section) => section.id === activeId)?.label ?? sections[0].label,
    [activeId],
  );

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    let frameId = 0;

    const updatePosition = () => {
      frameId = 0;
      const root = document.documentElement;
      const maximumScroll = Math.max(0, root.scrollHeight - window.innerHeight);
      const nextProgress = maximumScroll > 0 ? window.scrollY / maximumScroll : 0;
      const readingLine = window.scrollY + Math.min(window.innerHeight * 0.42, 360);
      let nextActiveId = sections[0].id;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= readingLine) nextActiveId = section.id;
      }

      setProgress(clamp(nextProgress));
      setActiveId(nextActiveId);
    };

    const scheduleUpdate = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updatePosition);
    };

    updatePosition();
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate);
    };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsPinnedOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  const scrollToProgress = useCallback((nextProgress, interactionSource) => {
    const normalizedProgress = clamp(nextProgress);
    const maximumScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    window.scrollTo({
      behavior: "instant",
      top: Math.round(maximumScroll * normalizedProgress),
    });
    setProgress(normalizedProgress);

    if (interactionSource === "keyboard") {
      trackAnalyticsEvent("story_step_click", {
        interaction_source: "section_navigator_keyboard",
        section_id: activeIdRef.current,
        surface: "home",
      });
    }
  }, []);

  const scrollFromPointer = useCallback((clientY) => {
    const track = trackRef.current;
    if (!track) return;

    const bounds = track.getBoundingClientRect();
    const usableHeight = Math.max(1, bounds.height - HANDLE_SIZE);
    const pointerOffset = clientY - bounds.top - HANDLE_SIZE / 2;
    scrollToProgress(pointerOffset / usableHeight, "drag");
  }, [scrollToProgress]);

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;

    dragStartYRef.current = event.clientY;
    movedDuringDragRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    scrollFromPointer(event.clientY);
  };

  const handlePointerMove = (event) => {
    if (!isDragging) return;

    if (Math.abs(event.clientY - dragStartYRef.current) > 4) {
      movedDuringDragRef.current = true;
    }
    scrollFromPointer(event.clientY);
  };

  const finishPointerInteraction = (event) => {
    if (!isDragging) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);

    if (event.type === "pointercancel") return;

    if (movedDuringDragRef.current) {
      trackAnalyticsEvent("story_step_click", {
        interaction_source: "section_navigator_drag",
        section_id: activeIdRef.current,
        surface: "home",
      });
    } else {
      setIsPinnedOpen((currentValue) => !currentValue);
    }
  };

  const handleControlClick = (event) => {
    if (event.detail === 0) setIsPinnedOpen((currentValue) => !currentValue);
  };

  const handleKeyDown = (event) => {
    const progressByKey = {
      ArrowDown: progress + KEYBOARD_STEP,
      ArrowUp: progress - KEYBOARD_STEP,
      End: 1,
      Home: 0,
      PageDown: progress + KEYBOARD_STEP * 3,
      PageUp: progress - KEYBOARD_STEP * 3,
    };

    if (!(event.key in progressByKey)) return;

    event.preventDefault();
    setIsPinnedOpen(true);
    scrollToProgress(progressByKey[event.key], "keyboard");
  };

  return (
    <aside
      aria-label="Homepage section navigator"
      className={styles.navigator}
      data-dragging={isDragging ? "true" : "false"}
      data-open={panelIsOpen ? "true" : "false"}
      style={{ "--navigator-progress": progress }}
    >
      <div className={styles.panel}>
        <div className={styles.panelHeading}>
          <span>Page sections</span>
          <strong>{activeLabel}</strong>
        </div>
        <nav aria-label="Homepage sections">
          {sections.map((section) => (
            <a
              aria-current={activeId === section.id ? "location" : undefined}
              data-analytics-destination={`#${section.id}`}
              data-analytics-event="site_navigation_click"
              data-analytics-link-id={`section_navigator_${section.id.replaceAll("-", "_")}`}
              data-analytics-link-location="section_navigator"
              data-analytics-surface="home"
              href={`#${section.id}`}
              key={section.id}
              onClick={() => setIsPinnedOpen(false)}
            >
              <span aria-hidden="true" className={styles.sectionMarker} />
              <span>{section.label}</span>
            </a>
          ))}
        </nav>
      </div>

      <div
        className={styles.trackArea}
        onPointerCancel={finishPointerInteraction}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerInteraction}
        ref={trackRef}
      >
        <span aria-hidden="true" className={styles.track} />
        <button
          aria-label={`Page position: ${activeLabel}. Drag or use arrow keys to navigate sections.`}
          aria-orientation="vertical"
          aria-valuemax="100"
          aria-valuemin="0"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuetext={activeLabel}
          className={styles.handle}
          onClick={handleControlClick}
          onKeyDown={handleKeyDown}
          role="slider"
          type="button"
        >
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
            <path d="m7 9 5-5 5 5M7 15l5 5 5-5" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
