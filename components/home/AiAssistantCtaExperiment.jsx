"use client";

import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  buildCtaAnalyticsProperties,
  buildCtaAssignment,
  createBrowserCtaAssignment,
  CTA_EXPERIMENT_ID,
  storeCtaAttribution,
} from "../../lib/cta-experiment.js";
import { trackAnalyticsEvent } from "../../lib/analytics-events.js";
import styles from "./ai-assistant-cta.module.css";

const IMPRESSION_DELAY_MS = 1000;
const IMPRESSION_MIN_VISIBLE_PX = 200;
const fallbackAssignment = buildCtaAssignment(0);
const AssistantCtaExperimentContext = createContext({
  assignment: fallbackAssignment,
  ready: false,
  rotationIndex: 0,
});

export function AssistantCtaExperimentProvider({ children }) {
  const initializedRef = useRef(false);
  const [experiment, setExperiment] = useState({
    assignment: fallbackAssignment,
    ready: false,
    rotationIndex: 0,
  });

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const nextExperiment = createBrowserCtaAssignment();
    setExperiment({
      assignment: nextExperiment.assignment,
      ready: true,
      rotationIndex: nextExperiment.rotationIndex,
    });
  }, []);

  return (
    <AssistantCtaExperimentContext.Provider value={experiment}>
      {children}
    </AssistantCtaExperimentContext.Provider>
  );
}

export function AssistantCtaSlot({ compact = false, placementId }) {
  const cardRef = useRef(null);
  const trackedImpressionsRef = useRef(new Set());
  const { assignment, ready, rotationIndex } = useContext(AssistantCtaExperimentContext);
  const assigned = assignment.find((item) => item.placement.id === placementId);
  const fallback = fallbackAssignment.find((item) => item.placement.id === placementId);
  const { button, image, placement, variant } =
    assigned ?? fallback ?? fallbackAssignment[0];
  const analyticsProperties = useMemo(() => {
    const properties = buildCtaAnalyticsProperties(placement, variant, image, button);
    return compact ? { ...properties, creative_format: "compact_image_text" } : properties;
  }, [button, compact, image, placement, variant]);
  const headingId = `assistant-cta-${placement.id}-${variant.id}`;
  const impressionKey =
    `${rotationIndex}:${placement.id}:${variant.id}:${image.id}:${button.id}`;

  useEffect(() => {
    if (!ready || !cardRef.current || trackedImpressionsRef.current.has(impressionKey)) {
      return undefined;
    }

    const card = cardRef.current;
    let impressionTimer;

    const markImpression = () => {
      if (trackedImpressionsRef.current.has(impressionKey)) return;
      trackedImpressionsRef.current.add(impressionKey);
      trackAnalyticsEvent("cta_impression", analyticsProperties);
    };

    if (typeof IntersectionObserver === "undefined") {
      impressionTimer = window.setTimeout(markImpression, IMPRESSION_DELAY_MS);
      return () => window.clearTimeout(impressionTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isMeaningfullyVisible = Boolean(
          entry?.isIntersecting &&
          (entry.intersectionRatio >= 0.5 ||
            (entry.intersectionRatio >= 0.3 &&
              entry.intersectionRect.height >= IMPRESSION_MIN_VISIBLE_PX)),
        );

        if (isMeaningfullyVisible) {
          if (!impressionTimer) {
            impressionTimer = window.setTimeout(markImpression, IMPRESSION_DELAY_MS);
          }
        } else {
          window.clearTimeout(impressionTimer);
          impressionTimer = undefined;
        }
      },
      { threshold: [0, 0.3, 0.5, 1] },
    );

    observer.observe(card);
    return () => {
      observer.disconnect();
      window.clearTimeout(impressionTimer);
    };
  }, [analyticsProperties, impressionKey, ready]);

  const handleClick = () => {
    storeCtaAttribution(analyticsProperties);
    trackAnalyticsEvent("assistant_opened", analyticsProperties);
  };

  const card = (
    <aside
      aria-labelledby={headingId}
      className={`${styles.card}${compact ? ` ${styles.compact}` : ""}`}
      data-cta-button={button.id}
      data-cta-experiment={CTA_EXPERIMENT_ID}
      data-cta-image={image.id}
      data-cta-placement={placement.id}
      data-cta-ready={ready ? "true" : "false"}
      data-cta-variant={variant.id}
      id={`assistant-cta-${placement.id}`}
      ref={cardRef}
    >
      <div className={styles.copy}>
        <div className={styles.label}>
          <SparkleIcon />
          <span>O1SF AI assistant</span>
        </div>
        <div className={styles.heroRow}>
          <div className={styles.imageFrame}>
            <picture>
              {!compact ? (
                <source media="(max-width: 760px)" srcSet={image.src320} />
              ) : null}
              <Image
                alt=""
                decoding="async"
                height={compact ? 240 : 480}
                loading="lazy"
                sizes={compact ? "88px" : "(max-width: 760px) 110px, 220px"}
                src={compact ? image.src320 : image.src640}
                width={compact ? 320 : 640}
              />
            </picture>
          </div>
          <h3 id={headingId}>{variant.headline}</h3>
        </div>
        <p className={styles.promise}>
          <span aria-hidden="true">🔥</span>
          <span>
            From assumptions to <span aria-hidden="true">💲 </span>paying customers.
          </span>
        </p>
        <Link
          className={styles.link}
          data-affordance={button.affordanceId}
          data-analytics-affordance-variant-id={button.affordanceId}
          data-analytics-affordance-variant-name={button.affordanceName}
          data-analytics-button-variant-id={button.id}
          data-analytics-button-variant-name={button.name}
          data-analytics-creative-combination-id={analyticsProperties.creative_combination_id}
          data-analytics-creative-format={analyticsProperties.creative_format}
          data-analytics-cta-location={placement.id}
          data-analytics-destination="ask_document"
          data-analytics-event="cta_click"
          data-analytics-experiment-id={CTA_EXPERIMENT_ID}
          data-analytics-image-variant-id={image.id}
          data-analytics-image-variant-name={image.name}
          data-analytics-placement-id={placement.id}
          data-analytics-placement-position={placement.position}
          data-analytics-rotation-strategy={analyticsProperties.rotation_strategy}
          data-analytics-surface="home"
          data-analytics-variant-id={variant.id}
          data-analytics-variant-name={variant.name}
          href="/ask_document/"
          onClick={handleClick}
          prefetch={false}
        >
          <span className={styles.buttonLeading} aria-hidden="true">
            <ButtonLeadingCue affordanceId={button.affordanceId} />
          </span>
          <span className={styles.buttonLabel}>{button.label}</span>
          <span className={styles.buttonTrailing} aria-hidden="true">
            <ButtonTrailingCue affordanceId={button.affordanceId} />
          </span>
          {button.affordanceId === "affordance_03" ? (
            <span className={styles.cursorCue} aria-hidden="true">
              <CursorClickIcon />
            </span>
          ) : null}
        </Link>
        <p className={styles.note}>
          Interactive guide · prepared program answers · no guaranteed commercial outcomes
        </p>
      </div>
    </aside>
  );

  if (compact) return card;

  return (
    <div className={styles.band} data-placement={placement.id}>
      <div className={styles.container}>{card}</div>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 2.75c.48 4.42 2.83 6.77 7.25 7.25-4.42.48-6.77 2.83-7.25 7.25-.48-4.42-2.83-6.77-7.25-7.25C9.17 9.52 11.52 7.17 12 2.75Z" />
      <path d="M19 15.75c.2 1.86 1.19 2.85 3.05 3.05-1.86.2-2.85 1.19-3.05 3.05-.2-1.86-1.19-2.85-3.05-3.05 1.86-.2 2.85-1.19 3.05-3.05Z" />
    </svg>
  );
}

function ButtonLeadingCue({ affordanceId }) {
  if (affordanceId === "affordance_02") return <TapFingerIcon />;
  if (affordanceId === "affordance_04") return <ButtonSparkleIcon />;
  return <SpeechBubbleIcon />;
}

function ButtonTrailingCue({ affordanceId }) {
  if (affordanceId === "affordance_03") return <TypingDotsIcon />;
  return <ArrowIcon withRays={affordanceId === "affordance_04"} />;
}

function SpeechBubbleIcon() {
  return (
    <svg className={styles.buttonIcon} viewBox="0 0 24 24">
      <path d="M5.25 5.75h13.5A2.25 2.25 0 0 1 21 8v6.25a2.25 2.25 0 0 1-2.25 2.25H11l-4.75 3v-3h-1A2.25 2.25 0 0 1 3 14.25V8a2.25 2.25 0 0 1 2.25-2.25Z" />
    </svg>
  );
}

function TapFingerIcon() {
  return (
    <svg className={styles.buttonIcon} viewBox="0 0 24 24">
      <circle className={styles.rippleRingOuter} cx="10" cy="7" r="5" />
      <circle className={styles.rippleRingInner} cx="10" cy="7" r="2.75" />
      <path d="M10 6.25v7.1l-1.4-1.3a1.42 1.42 0 0 0-2.02.08 1.48 1.48 0 0 0 .08 2.03l4.2 4.06c.67.65 1.56 1.03 2.49 1.03h1.38A3.27 3.27 0 0 0 18 15.98v-4.23a1.45 1.45 0 0 0-2.65-.8 1.45 1.45 0 0 0-2.5-.73 1.45 1.45 0 0 0-2.85.38" />
    </svg>
  );
}

function ButtonSparkleIcon() {
  return (
    <svg className={styles.buttonIcon} viewBox="0 0 24 24">
      <path d="M10.5 3.25c.38 3.55 2.27 5.44 5.82 5.82-3.55.38-5.44 2.27-5.82 5.82-.38-3.55-2.27-5.44-5.82-5.82 3.55-.38 5.44-2.27 5.82-5.82Z" />
      <path d="M17.75 13.75c.18 1.7 1.08 2.6 2.78 2.78-1.7.18-2.6 1.08-2.78 2.78-.18-1.7-1.08-2.6-2.78-2.78 1.7-.18 2.6-1.08 2.78-2.78Z" />
    </svg>
  );
}

function ArrowIcon({ withRays = false }) {
  return (
    <svg className={styles.buttonIcon} viewBox="0 0 24 24">
      <path d="M5 12h13.25" />
      <path d="m13.75 7.5 4.5 4.5-4.5 4.5" />
      {withRays ? (
        <>
          <path className={styles.arrowRay} d="M19.25 5.25 21 3.5" />
          <path className={styles.arrowRay} d="M20.5 8h2" />
          <path className={styles.arrowRay} d="M19.25 18.75 21 20.5" />
        </>
      ) : null}
    </svg>
  );
}

function TypingDotsIcon() {
  return (
    <svg className={styles.buttonIcon} viewBox="0 0 24 24">
      <circle className={styles.typingDot} cx="5" cy="12" r="1.25" />
      <circle className={styles.typingDot} cx="12" cy="12" r="1.25" />
      <circle className={styles.typingDot} cx="19" cy="12" r="1.25" />
    </svg>
  );
}

function CursorClickIcon() {
  return (
    <svg viewBox="0 0 32 32">
      <path d="m8.2 5.5 12.95 12.13-6.25 1.05-2.63 5.75L8.2 5.5Z" />
      <path d="M22.5 5.5 25 3M25.75 10h3.5M21.5 13.5l2.5 2.5" />
    </svg>
  );
}
