export function SectionHeader({ eyebrow, title, align = "start" }) {
  return (
    <div className={`section-header section-header-${align}`}>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  );
}
