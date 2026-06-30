import { Icon } from "./Icon";

export function CTAButton({ href, children }) {
  return (
    <a className="cta-button" href={href}>
      <span>{children}</span>
      <Icon name="arrow" />
    </a>
  );
}
