export function StatBlock({ intro, number, label }) {
  return (
    <article className="stat-block">
      <p>{intro}</p>
      <strong>{number}</strong>
      <span>{label}</span>
    </article>
  );
}
