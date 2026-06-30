import { Icon } from "./Icon";

export function IconCard({ icon, title, variant = "default" }) {
  return (
    <article className={`icon-card icon-card-${variant}`}>
      <Icon name={icon} />
      <p>{title}</p>
    </article>
  );
}
