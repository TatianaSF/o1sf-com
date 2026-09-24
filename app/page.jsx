import Link from "next/link";

import { CompanyLogo } from "../components/CompanyLogo";
import { TatianaLink } from "../components/TatianaLink";
import { HomeAnalytics } from "../components/analytics/HomeAnalytics";
import {
  AssistantCtaExperimentProvider,
  AssistantCtaSlot,
} from "../components/home/AiAssistantCtaExperiment";
import { DisplayHeadingIcon } from "../components/home/DisplayHeadingIcon";
import { HomeSectionNavigator } from "../components/home/HomeSectionNavigator";
import { SfActivityIcon } from "../components/home/SfActivityIcon";
import { ProgramContentIcon } from "../components/home/ProgramContentIcon";
import { TestingLoopIcon } from "../components/home/TestingLoopIcon";
import { resourceGuideIndex } from "../lib/public-pages";
import { buildHomeJsonLd, serializeJsonLd } from "../lib/seo";
import styles from "./home.module.css";

const heroMetrics = [
  ["3", "Weeks"],
  ["2 + 1", "Online + in SF"],
  ["9", "Max startups"],
  ["$4,999", "Per company"],
  ["0%", "Equity"],
];

const beforeItems = [
  { icon: "unclearPositioning", label: "Unclear positioning" },
  { icon: "untestedMessaging", label: "Untested messaging" },
  { icon: "limitedAccess", label: "Limited access to the right people" },
  { icon: "unvalidatedPlan", label: "No validated U.S. market plan" },
  { icon: "assumptionStack", label: "Too many assumptions" },
];

const afterItems = [
  { icon: "testedPositioning", label: "Tested positioning and messaging" },
  { icon: "customerFeedback", label: "Real customer and partner feedback" },
  { icon: "warmIntroductions", label: "Target lists and warm introductions where available" },
  { icon: "gtmMetrics", label: "U.S. go-to-market plan and metrics" },
  { icon: "growthRoadmap", label: "Roadmap for 3, 6, and 12 months" },
];

const weeks = [
  {
    number: "01",
    icon: "diagnose",
    mode: "Online",
    title: "Diagnose & Prepare",
    items: ["Understand the market", "Clarify the story", "Define target segments", "Prepare the plan"],
  },
  {
    number: "02",
    icon: "prepare",
    mode: "Online",
    title: "Prepare to Execute",
    items: ["Build assets", "Identify targets", "Plan outreach", "Prepare conversations"],
  },
  {
    number: "03",
    icon: "execute",
    mode: "San Francisco",
    title: "Execute in the Market",
    items: ["Meet", "Test", "Learn", "Iterate", "Validate"],
  },
];

const testingLoop = [
  {
    number: "1",
    icon: "hypothesis",
    title: "Hypothesis",
    text: "Name the assumption that matters.",
  },
  {
    number: "2",
    icon: "asset",
    title: "Asset",
    text: "Build the pitch, message, or target list.",
  },
  {
    number: "3",
    icon: "interaction",
    title: "Real interaction",
    text: "Put it in front of the market.",
  },
  {
    number: "4",
    icon: "feedback",
    title: "Feedback",
    text: "Capture what people actually say and do.",
  },
  {
    number: "5",
    icon: "iterate",
    title: "Iterate",
    text: "Revise the story, target, or offer.",
  },
  {
    number: "6",
    icon: "action",
    title: "Action plan",
    text: "Document the next measurable moves.",
  },
];

const sfActivities = [
  { icon: "meetings", label: "Real meetings" },
  { icon: "discovery", label: "Customer discovery" },
  { icon: "ecosystem", label: "Ecosystem gatherings" },
  { icon: "coworking", label: "Coworking" },
  { icon: "demo", label: "Demo Day" },
  { icon: "testing", label: "Market testing" },
];

const deliverables = [
  { icon: "pitch", label: "U.S.-ready pitch deck" },
  { icon: "demo", label: "Demo Day deck" },
  { icon: "shortPitch", label: "Three one-minute pitches" },
  { icon: "targets", label: "Customer, partner, and investor target lists" },
  { icon: "outreach", label: "Email and LinkedIn message set" },
  { icon: "icp", label: "Ideal customer profile" },
  { icon: "metric", label: "North Star metric" },
  { icon: "gtm", label: "U.S. go-to-market plan" },
  { icon: "roadmap", label: "Roadmap for 3, 6, and 12 months" },
  { icon: "playbook", label: "Execution playbook" },
];

const supportMetrics = [
  { icon: "groupSessions", value: "4", label: "Online group sessions", note: "Minimum 60 minutes each" },
  { icon: "strategySession", value: "2", label: "Individual strategy sessions", note: "Minimum 30 minutes each" },
  { icon: "mentorGroup", value: "≤4", label: "Startups per mentor group", note: "Small, focused working groups" },
];

const pricingFeatures = [
  { icon: "primaryFounder", label: "One primary founder included" },
  { icon: "additionalFounder", label: "Additional founder: $2,500" },
  { icon: "zeroEquity", label: "0% equity" },
  { icon: "noSuccessFee", label: "No success fee" },
  { icon: "noInvestmentCommission", label: "No investment commission" },
];

const resourceGuideIcons = ["readinessGuide", "discoveryGuide", "gtmGuide"];

const backgrounds = [
  { company: "openai", role: "Member of Technical Staff, OpenAI" },
  { company: "openai", role: "Developer Experience Engineer, OpenAI" },
  { company: "apple", role: "ML Engineer, Apple" },
  { company: "microsoft", role: "ML Engineer, Microsoft" },
  { company: "microsoft", role: "Senior Software Engineer, Microsoft" },
  { company: "chime", role: "Senior Software Engineer, Chime" },
  { company: "paypal", role: "Staff Software Engineer, PayPal" },
  { company: "dnanexus", role: "Principal DevOps Engineer, DNAnexus" },
  { company: "ycombinator", role: "Founders and CTOs, YC-backed startups" },
  { company: "ycombinator", role: "GTM and Operations leaders, YC-backed startups" },
];

const fitItems = [
  {
    icon: "internationalFounder",
    label: "You are an international founder entering or expanding in the U.S.",
  },
  {
    icon: "directFeedback",
    label: "You are ready for intensive participation and direct feedback.",
  },
  { icon: "workingEnglish", label: "You can work in English throughout the program." },
  {
    icon: "outreachIterate",
    label: "You are willing to conduct outreach and revise assumptions.",
  },
  {
    icon: "sanFranciscoAttendance",
    label: "You can attend the San Francisco week in person.",
  },
];

const faqs = [
  [
    "Who is the program for?",
    "International founders who are evaluating or actively preparing a U.S. market entry and are ready to test assumptions through focused preparation, outreach, and in-person execution.",
  ],
  [
    "What is included in the fee?",
    "The program includes two weeks of online preparation, one week of guided execution in San Francisco, four group sessions, two individual strategy sessions, working assets, feedback, and the documented deliverables described on this page.",
  ],
  [
    "Does O1SF guarantee paying customers or revenue?",
    "No. Paying customers are the direction of the work, not a guaranteed program outcome. O1SF helps founders test assumptions, improve customer-facing assets, and define evidence-based next actions; customer acquisition and revenue depend on the company, market, offer, execution, and other factors outside the program.",
  ],
  ["Does O1SF take equity?", "No. O1SF takes 0% equity and charges no success fee or investment commission."],
  [
    "Are meetings guaranteed?",
    "No. The program targets 10–50 relevant interactions, which may include confirmed meetings, introductions, ecosystem events, and useful professional conversations. The mix and number depend on relevance, response, availability, and founder execution.",
  ],
  [
    "Are investors guaranteed to attend?",
    "No. Participation by any investor, mentor, advisor, speaker, professional, or company is not guaranteed.",
  ],
  [
    "Is travel included?",
    "No. Travel, accommodation, meals, and third-party fees are not included unless explicitly stated in a future written offer.",
  ],
  [
    "Does O1SF help with company formation?",
    "The program may help founders identify practical questions and relevant resources, but it does not guarantee company formation, an EIN, banking approval, or legal outcomes. Founders should use qualified legal and tax professionals.",
  ],
  [
    "Is visa approval guaranteed?",
    "No. O1SF does not provide or guarantee visas, immigration status, or admission to the United States. Participants are responsible for their own travel and immigration requirements.",
  ],
];

export default function HomePage() {
  const jsonLd = buildHomeJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <HomeAnalytics />
      <HomeSectionNavigator />
      <AssistantCtaExperimentProvider>
        <main className={styles.page}>
        <section
          className={`${styles.section} ${styles.hero}`}
          data-analytics-section="hero"
          id="top"
        >
          <div className={`${styles.container} ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <SectionLabel
                icon="payingCustomers"
                label="U.S. market entry for international founders"
                tone="success"
                variant="hero"
              />
              <h1>From assumptions to paying customers.</h1>
              <p className={styles.heroLead}>
                O1SF is a three-week program that helps international founders test U.S. market-entry
                assumptions, learn from real customer feedback, and build an evidence-based path toward
                paying customers: two weeks online, then one intensive week in San Francisco.
              </p>
              <p className={styles.heroAttribution}>
                Hosted and publicly authored by <TatianaLink /> in San Francisco.{" "}
                <Link href="/tatianasf">View the program host profile <span aria-hidden="true">→</span></Link>
              </p>
              <div className={styles.heroActions}>
                <Link
                  className={styles.heroPrimaryAction}
                  data-analytics-destination="program"
                  data-analytics-event="site_navigation_click"
                  data-analytics-link-id="program"
                  data-analytics-link-location="hero"
                  data-analytics-surface="home"
                  href="/program"
                >
                  Review the program <span aria-hidden="true">→</span>
                </Link>
                <Link
                  className={styles.heroSecondaryAction}
                  data-analytics-destination="methodology"
                  data-analytics-event="site_navigation_click"
                  data-analytics-link-id="methodology"
                  data-analytics-link-location="hero"
                  data-analytics-surface="home"
                  href="/methodology"
                >
                  See the methodology <span aria-hidden="true">→</span>
                </Link>
              </div>
              <p className={styles.heroFact}>
                Paying customers are the direction, not a guaranteed outcome. Each cohort is intentionally
                limited to 9 startups.
              </p>
            </div>

            <div className={styles.heroVisual}>
              <picture>
                <source
                  srcSet="/assets/o1sf/host-640.webp?v=20260716 640w, /assets/o1sf/host-960.webp?v=20260716 960w, /assets/o1sf/host-1280.webp?v=20260716 1280w"
                  sizes="(max-width: 760px) 87vw, (max-width: 1180px) 46vw, 560px"
                  type="image/webp"
                />
                <img
                  alt="O1SF program host in a professional event setting"
                  className={styles.heroPortrait}
                  decoding="async"
                  fetchPriority="high"
                  height="1280"
                  src="/assets/o1sf/host-1280.webp?v=20260716"
                  width="1280"
                />
              </picture>
              <div className={styles.heroVisualNote}>
                <span>Prepare online</span>
                <strong>Execute in SF</strong>
              </div>
            </div>
          </div>

          <div
            className={`${styles.container} ${styles.metricRail}`}
            aria-label="Program facts"
            role="list"
          >
            {heroMetrics.map(([value, label]) => (
              <div className={styles.heroMetric} key={label} role="listitem">
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.transformation}`}
          data-analytics-section="outcomes"
          id="outcomes"
        >
          <div className={styles.container}>
            <SectionIntro
              icon="evidence"
              label="The shift"
              title="Build the evidence behind a customer-ready plan."
              text="The program replaces vague confidence with documented customer feedback, clearer decisions, and a practical sequence of next moves toward commercial traction."
            />

            <div className={styles.beforeAfter}>
              <div className={styles.beforeColumn}>
                <h3>Before O1SF</h3>
                <Checklist items={beforeItems} muted />
              </div>
              <a
                aria-label="Go to frequently asked questions"
                className={styles.shiftMark}
                data-analytics-destination="#faq"
                data-analytics-event="site_navigation_click"
                data-analytics-link-id="testing_shift_to_faq"
                data-analytics-link-location="outcomes"
                data-analytics-surface="home"
                href="#faq"
              >
                <span>Test</span>
                <b aria-hidden="true">→</b>
                <span>Revise</span>
              </a>
              <div className={styles.afterColumn}>
                <h3>After O1SF</h3>
                <Checklist items={afterItems} />
              </div>
            </div>

            <div className={styles.photoPair}>
              <Photo
                alt="Founders and builders working together during an intensive session"
                className={styles.photoWide}
                defaultSrc="/assets/o1sf/working-session-1510.webp?v=20260716"
                height="884"
                sizes="(max-width: 760px) 92vw, 62vw"
                srcSet="/assets/o1sf/working-session-720.webp?v=20260716 720w, /assets/o1sf/working-session-1200.webp?v=20260716 1200w, /assets/o1sf/working-session-1510.webp?v=20260716 1510w"
                width="1510"
              />
              <div className={styles.photoPairCaption}>
                <span>Preparation becomes useful when it changes the next conversation.</span>
                <Photo
                  alt="An engaged audience taking part in a professional founder gathering"
                  className={styles.photoInset}
                  defaultSrc="/assets/o1sf/audience-1200.webp?v=20260716"
                  height="743"
                  sizes="(max-width: 760px) 92vw, 32vw"
                  srcSet="/assets/o1sf/audience-720.webp?v=20260716 720w, /assets/o1sf/audience-1200.webp?v=20260716 1200w, /assets/o1sf/audience-1550.webp?v=20260716 1550w"
                  width="1200"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.program}`}
          data-analytics-section="program"
          id="program"
        >
          <div className={styles.container}>
            <SectionIntro
              icon="program"
              label="The three-week program"
              title="Three weeks to test the path to paying customers."
              text="Each week has a distinct job: define what must be learned, prepare customer-facing assets and conversations, then test the plan in San Francisco."
            />
            <ol className={styles.timeline}>
              {weeks.map((week) => (
                <li className={styles.week} key={week.number}>
                  <div className={styles.weekTopline}>
                    <span>Week {week.number}</span>
                    <em>{week.mode}</em>
                  </div>
                  <div className={styles.weekHeading}>
                    <span className={styles.weekIcon} aria-hidden="true">
                      <ProgramContentIcon name={week.icon} />
                    </span>
                    <h3>{week.title}</h3>
                  </div>
                  <ul>
                    {week.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <Link
              className={styles.sectionLink}
              data-analytics-destination="/program"
              data-analytics-event="site_navigation_click"
              data-analytics-link-id="complete_program_structure"
              data-analytics-link-location="program_section"
              data-analytics-surface="home"
              href="/program"
            >
              Explore the complete program structure <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.loopSection}`}
          data-analytics-section="testing_loop"
          id="testing-loop"
        >
          <div className={styles.container}>
            <SectionIntro
              icon="marketTest"
              label="The O1SF testing loop"
              title="Every assumption must meet the market."
              text="The loop is lightweight on purpose: build only enough to create a real interaction, then turn feedback into a better next move."
              invert
            />
            <ol className={styles.testingLoop}>
              {testingLoop.map(({ icon, number, text, title }) => (
                <li key={number}>
                  <span className={styles.loopIcon} aria-hidden="true">
                    <TestingLoopIcon name={icon} />
                  </span>
                  <div className={styles.loopCard}>
                    <span className={styles.loopNumber}>{number}</span>
                    <div className={styles.loopCopy}>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <Link
              className={`${styles.sectionLink} ${styles.sectionLinkInvert}`}
              data-analytics-destination="/methodology"
              data-analytics-event="site_navigation_click"
              data-analytics-link-id="evidence_first_methodology"
              data-analytics-link-location="testing_loop"
              data-analytics-surface="home"
              href="/methodology"
            >
              Read the evidence-first methodology <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <AssistantCtaSlot placementId="after_testing_loop" />

        <section
          className={`${styles.section} ${styles.deliverables}`}
          data-analytics-section="deliverables"
          id="deliverables"
        >
          <div className={`${styles.container} ${styles.deliverablesGrid}`}>
            <div className={styles.deliverablesLead}>
              <SectionLabel icon="roadmap" label="What you leave with" />
              <h2>A customer-ready plan for the next 3, 6, and 12 months.</h2>
              <p>
                Not a certificate. Not a folder of generic templates. A working set of decisions,
                messages, targets, and plans shaped by real customer feedback.
              </p>
            </div>
            <div className={styles.deliverableList}>
              {deliverables.map(({ icon, label }) => (
                <div className={styles.deliverable} key={label}>
                  <span className={styles.deliverableIcon} aria-hidden="true">
                    <ProgramContentIcon name={icon} />
                  </span>
                  <strong>{label}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.sfSection}`}
          data-analytics-section="san_francisco"
          id="san-francisco"
        >
          <div className={styles.container}>
            <SectionIntro
              icon="sanFrancisco"
              label="San Francisco week"
              title="Real execution in the heart of the innovation ecosystem."
              text="The week is built around relevant conversations, customer discovery, ecosystem gatherings, coworking, Demo Day preparation, and hands-on iteration."
            />

            <div className={styles.sfPhotoGrid}>
              <figure className={styles.sfAnchor}>
                <Photo
                  alt="Downtown San Francisco and the bay seen from a high-floor professional venue"
                  defaultSrc="/assets/o1sf/sf-view-1370.webp?v=20260716"
                  height="793"
                  sizes="(max-width: 760px) 92vw, 66vw"
                  srcSet="/assets/o1sf/sf-view-720.webp?v=20260716 720w, /assets/o1sf/sf-view-1080.webp?v=20260716 1080w, /assets/o1sf/sf-view-1370.webp?v=20260716 1370w"
                  width="1370"
                />
                <figcaption>San Francisco is the execution environment - not a backdrop.</figcaption>
              </figure>
              <figure className={styles.sfSecondary}>
                <Photo
                  alt="The O1SF host preparing inside a professional San Francisco event venue"
                  defaultSrc="/assets/o1sf/sf-venue-1100.webp?v=20260716"
                  height="646"
                  sizes="(max-width: 760px) 92vw, 32vw"
                  srcSet="/assets/o1sf/sf-venue-720.webp?v=20260716 720w, /assets/o1sf/sf-venue-1100.webp?v=20260716 1100w, /assets/o1sf/sf-venue-1370.webp?v=20260716 1370w"
                  width="1100"
                />
                <figcaption>Professional rooms, prepared conversations.</figcaption>
              </figure>
            </div>

            <div className={styles.sfActivities}>
              {sfActivities.map(({ icon, label }) => (
                <div key={label}>
                  <span className={styles.sfActivityIcon} aria-hidden="true">
                    <SfActivityIcon name={icon} />
                  </span>
                  <strong>{label}</strong>
                </div>
              ))}
            </div>

            <div className={styles.targetCallout}>
              <div>
                <span>Target</span>
                <strong>10–50</strong>
                <p>relevant interactions during the San Francisco week</p>
              </div>
              <p>
                This may include confirmed meetings, introductions, ecosystem events, and useful
                professional conversations. It is a target, not a guarantee.
              </p>
            </div>

          </div>
        </section>

        <section
          className={`${styles.section} ${styles.support}`}
          data-analytics-section="support"
          id="support"
        >
          <div className={styles.container}>
            <SectionIntro
              icon="support"
              label="Program support"
              title="Small enough for direct work. Structured enough to keep moving."
              text="Founders receive group preparation, individual strategy time, direct guidance, and a main mentor or a closely matched mentor group where relevant."
            />
            <div className={styles.supportMetrics}>
              {supportMetrics.map(({ icon, value, label, note }) => (
                <div key={label}>
                  <span className={styles.supportMetricIcon} aria-hidden="true">
                    <ProgramContentIcon name={icon} />
                  </span>
                  <strong>{value}</strong>
                  <div className={styles.supportMetricCopy}>
                    <h3>{label}</h3>
                    <p>{note}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className={styles.supportNote}>
              Mentor matching depends on program needs, professional relevance, individual interest,
              approval, and availability.
            </p>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.network}`}
          data-analytics-section="network"
          id="network"
        >
          <div className={`${styles.container} ${styles.networkGrid}`}>
            <div className={styles.networkCopy}>
              <SectionLabel icon="network" label="Mentors, advisors & ecosystem network" />
              <h2>Professional context without borrowed endorsement.</h2>
              <p>
                O1SF engages a curated network of professionals who may support the program as mentors,
                advisors, speakers, technical experts, ecosystem connectors, or potential investors.
              </p>
              <Photo
                alt="Participants sharing a lively moment at a prior professional gathering"
                className={styles.networkPhoto}
                defaultSrc="/assets/o1sf/group-moment-1200.webp?v=20260716"
                height="708"
                sizes="(max-width: 760px) 92vw, 42vw"
                srcSet="/assets/o1sf/group-moment-720.webp?v=20260716 720w, /assets/o1sf/group-moment-1200.webp?v=20260716 1200w, /assets/o1sf/group-moment-1500.webp?v=20260716 1500w"
                width="1200"
              />
              <p className={styles.photoDisclaimer}>
                Photography shows prior professional gatherings. It does not identify confirmed O1SF
                mentors, advisors, investors, or program participants.
              </p>
            </div>
            <div className={styles.backgroundList}>
              {backgrounds.map((background) => (
                <div key={background.role}>
                  <CompanyLogo className={styles.companyLogo} company={background.company} />
                  <span>{background.role}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={`${styles.container} ${styles.networkDisclaimer}`}>
            Participation depends on program needs, professional relevance, individual interest,
            approval, and availability. Participation by any specific person or company is not
            guaranteed. Company names and logos identify professional backgrounds only and do not imply
            sponsorship, partnership, or endorsement.
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.pricing}`}
          data-analytics-section="pricing"
          id="pricing"
        >
          <div className={`${styles.container} ${styles.pricingGrid}`}>
            <div className={styles.pricingIntro}>
              <SectionLabel icon="pricing" label="Simple, transparent pricing" />
              <h2>One company. One focused market-entry sprint.</h2>
              <p>
                The fee covers the O1SF program described on this page. There is no equity, success fee,
                or investment commission.
              </p>
            </div>
            <div className={styles.pricePanel}>
              <div className={styles.priceLine}>
                <strong>$4,999</strong>
                <span>per company</span>
              </div>
              <ul>
                {pricingFeatures.map(({ icon, label }) => (
                  <li key={label}>
                    <span className={styles.priceFeatureIcon} aria-hidden="true">
                      <ProgramContentIcon name={icon} />
                    </span>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
              <p>Travel, accommodation, meals, and third-party fees are not included unless explicitly stated.</p>
              <Link
                className={styles.sectionLink}
                data-analytics-destination="/pricing"
                data-analytics-event="site_navigation_click"
                data-analytics-link-id="pricing_inclusions"
                data-analytics-link-location="pricing"
                data-analytics-surface="home"
                href="/pricing"
              >
                See pricing and inclusions <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <AssistantCtaSlot placementId="after_pricing" />

        <section
          className={`${styles.section} ${styles.resources}`}
          data-analytics-section="resources"
          id="resources"
        >
          <div className={styles.container}>
            <SectionIntro
              icon="resources"
              label="Founder resources"
              title="Prepare the questions before the market answers."
              text="Use the practical guides to audit readiness, run customer discovery, and build an evidence-based 3-, 6-, and 12-month U.S. plan."
            />
            <div className={styles.resourceGrid}>
              {resourceGuideIndex.map((guide, index) => (
                <Link
                  aria-label={`Open guide: ${guide.title}`}
                  className={styles.resourceCard}
                  data-analytics-destination={guide.path}
                  data-analytics-event="site_navigation_click"
                  data-analytics-link-id={`resource_guide_${index + 1}`}
                  data-analytics-link-location="resources"
                  data-analytics-surface="home"
                  href={guide.path}
                  key={guide.path}
                >
                  <span className={styles.resourceGuideIcon} aria-hidden="true">
                    <ProgramContentIcon name={resourceGuideIcons[index]} />
                  </span>
                  <h3>{guide.title}</h3>
                  <p>{guide.description}</p>
                  <span className={styles.resourceAction} aria-hidden="true">
                    Open guide <span>→</span>
                  </span>
                </Link>
              ))}
            </div>
            <Link
              className={styles.sectionLink}
              data-analytics-destination="/resources"
              data-analytics-event="site_navigation_click"
              data-analytics-link-id="all_resources"
              data-analytics-link-location="resources"
              data-analytics-surface="home"
              href="/resources"
            >
              Browse all resources <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.fit}`}
          data-analytics-section="fit"
          id="fit"
        >
          <div className={`${styles.container} ${styles.fitGrid}`}>
            <div>
              <SectionLabel icon="fit" label="Who it is for" />
              <h2>Built for founders ready to test, learn, and revise.</h2>
            </div>
            <Checklist items={fitItems} />
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.faq}`}
          data-analytics-completion="true"
          data-analytics-section="faq"
          id="faq"
        >
          <div className={`${styles.container} ${styles.faqGrid}`}>
            <div className={styles.faqIntro}>
              <SectionLabel icon="faq" label="FAQ" />
              <h2>Practical questions, precise answers.</h2>
              <p>No guaranteed outcomes. No hidden equity. No invented access.</p>
              <AssistantCtaSlot compact placementId="faq" />
            </div>
            <div className={styles.faqList}>
              {faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        </main>
      </AssistantCtaExperimentProvider>
    </>
  );
}

function SectionIntro({ icon, label, title, text, invert = false }) {
  return (
    <div className={`${styles.sectionIntro}${invert ? ` ${styles.sectionIntroInvert}` : ""}`}>
      <SectionLabel icon={icon} label={label} />
      <h2>{title}</h2>
      {text ? <p className={styles.sectionDescription}>{text}</p> : null}
    </div>
  );
}

function SectionLabel({ icon, label, tone = "blue", variant = "section" }) {
  return (
    <p className={variant === "hero" ? styles.heroLabel : styles.sectionLabel}>
      <HeadingIcon name={icon} tone={tone} />
      <span>{label}</span>
    </p>
  );
}

function HeadingIcon({ name, tone = "blue" }) {
  return (
    <span
      aria-hidden="true"
      className={styles.displayHeadingIcon}
      data-tone={tone}
    >
      <DisplayHeadingIcon name={name} />
    </span>
  );
}

function Checklist({ items, muted = false }) {
  return (
    <ul className={`${styles.checklist}${muted ? ` ${styles.checklistMuted}` : ""}`}>
      {items.map((item) => {
        const label = typeof item === "string" ? item : item.label;

        return (
          <li key={label}>
            {typeof item === "string" ? (
              <span aria-hidden="true">{muted ? " - " : "✓"}</span>
            ) : (
              <span className={styles.checklistIcon} aria-hidden="true">
                <ProgramContentIcon name={item.icon} />
              </span>
            )}
            {label}
          </li>
        );
      })}
    </ul>
  );
}

function Photo({ alt, className = "", defaultSrc, height, sizes, srcSet, width }) {
  return (
    <picture>
      <source srcSet={srcSet} sizes={sizes} type="image/webp" />
      <img
        alt={alt}
        className={className}
        decoding="async"
        height={height}
        loading="lazy"
        src={defaultSrc}
        width={width}
      />
    </picture>
  );
}
