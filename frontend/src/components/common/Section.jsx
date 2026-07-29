import { cn } from "../../utils/cn";
import Container from "./Container";

/**
 * Reusable page section with generous vertical rhythm and optional
 * container wrapping. `bleed` renders full-bleed (no container).
 */
export const Section = ({
  id,
  className,
  containerClassName,
  bleed = false,
  children,
  ...props
}) => (
  <section
    id={id}
    className={cn("relative py-24 md:py-32", className)}
    {...props}
  >
    {bleed ? children : <Container className={containerClassName}>{children}</Container>}
  </section>
);

export default Section;
