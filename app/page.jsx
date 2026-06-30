import { CTAButton } from "../components/CTAButton";
import { Icon } from "../components/Icon";
import { IconCard } from "../components/IconCard";
import { MobileSection } from "../components/MobileSection";
import { SectionHeader } from "../components/SectionHeader";
import { StatBlock } from "../components/StatBlock";
import { getCollection } from "../lib/content";

export default function HomePage() {
  const sections = getCollection("sections");

  return (
    <div className="app-stage">
      <main className="phone-page" aria-label="O1SF landing page">
        {sections.map((section) => (
          <LandingSection key={section.slug} section={section} />
        ))}
      </main>
    </div>
  );
}

function LandingSection({ section }) {
  const anchor = section.anchor || section.slug;

  if (section.kind === "hero") {
    return (
      <MobileSection id={anchor} className="hero-section" ariaLabel="O1SF hero">
        <div className="hero-card glass-card">
          <h1>
            {splitField(section.headline).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <div className="purple-rule" aria-hidden="true" />
          <p className="hero-lead">
            {splitField(section.lead).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <ParagraphStack paragraphs={section.paragraphs} />
          <CTAButton href={section.ctaHref || "#reality"}>{section.ctaLabel || "Read more"}</CTAButton>
        </div>
      </MobileSection>
    );
  }

  if (section.kind === "signals") {
    return (
      <MobileSection id={anchor} className="reality-section" ariaLabel={section.title}>
        <div className="section-card glass-card">
          <SectionHeader eyebrow={section.eyebrow} title={section.title} />
          <ParagraphStack paragraphs={section.paragraphs} />
          <div className="icon-grid reality-grid">
            {parseIconItems(section.items).map((item) => (
              <IconCard key={item.title} icon={item.icon} title={item.title} />
            ))}
          </div>
          <p className="closing-line">{section.close}</p>
        </div>
      </MobileSection>
    );
  }

  if (section.kind === "filter-list") {
    const icons = ["room", "target", "building", "room", "chat"];
    const cards = [section.main, ...section.paragraphs].filter(Boolean);

    return (
      <MobileSection id={anchor} className="other-side-section" ariaLabel={section.title}>
        <div className="section-card glass-card">
          <SectionHeader eyebrow={section.eyebrow} title={section.title} />
          <h2 className="statement-heading">
            {splitField(section.statement).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <div className="filter-card-list">
            {cards.map((text, index) => (
              <div className="filter-card" key={text}>
                <Icon name={icons[index] || "filter"} />
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </MobileSection>
    );
  }

  if (section.kind === "stats") {
    return (
      <MobileSection id={anchor} className="experience-section" ariaLabel={section.title}>
        <div className="section-card stats-card glass-card">
          <SectionHeader eyebrow={section.eyebrow} title={section.title} align="center" />
          <div className="stats-list">
            {parseStats(section.items).map((stat) => (
              <StatBlock key={stat.number} {...stat} />
            ))}
          </div>
        </div>
      </MobileSection>
    );
  }

  if (section.kind === "moments") {
    const moments = parseIconItems(section.items).map((item, index) => ({
      ...item,
      title: section.paragraphs[index] || item.title,
    }));

    return (
      <MobileSection id={anchor} className="filter-section" ariaLabel={section.title}>
        <div className="section-card glass-card">
          <SectionHeader eyebrow={section.eyebrow} title={section.title} align="center" />
          <div className="moment-stack">
            {moments.map((moment) => (
              <IconCard key={moment.title} icon={moment.icon} title={moment.title} variant="moment" />
            ))}
          </div>
        </div>
      </MobileSection>
    );
  }

  if (section.kind === "outcome") {
    return (
      <MobileSection id={anchor} className="outcome-section" ariaLabel={section.title}>
        <div className="section-card outcome-card glass-card">
          <SectionHeader eyebrow={section.eyebrow} title={section.title} align="center" />
          <Icon name="peopleSignal" className="outcome-icon" />
          <p className="outcome-opener">{section.opener}</p>
          <h2 className="outcome-heading">
            {splitField(section.statement).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <div className="outcome-rhythm">
            {splitField(section.rhythm).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="outcome-close">{section.close}</p>
        </div>
      </MobileSection>
    );
  }

  return null;
}

function ParagraphStack({ paragraphs }) {
  return (
    <div className="copy-stack">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{renderInlineMarkdown(paragraph)}</p>
      ))}
    </div>
  );
}

function renderInlineMarkdown(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={part}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

function splitField(value = "") {
  return value
    .split("|")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseIconItems(value = "") {
  return splitField(value).map((item) => {
    const [icon, title] = item.split(":");
    return { icon: icon.trim(), title: title.trim() };
  });
}

function parseStats(value = "") {
  return splitField(value).map((item) => {
    const [intro, number, label] = item.split("::");
    return { intro: intro.trim(), number: number.trim(), label: label.trim() };
  });
}
