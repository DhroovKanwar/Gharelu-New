import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../animations/variants";
import { cn } from "../../utils/cn";

/**
 * Reusable eyebrow + heading + intro block with scroll reveal.
 */
export const SectionHeading = ({
  eyebrow,
  title,
  intro,
  align = "left",
  light = false,
  className,
  titleClassName,
}) => (
  <motion.div
    variants={stagger(0.12)}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.5 }}
    className={cn(
      "max-w-3xl",
      align === "center" && "mx-auto text-center",
      className,
    )}
  >
    {eyebrow && (
      <motion.p
        variants={fadeUp}
        className={cn(
          "mb-5 text-xs font-semibold uppercase tracking-[0.25em]",
          light ? "text-brand-primary" : "text-brand-accent",
        )}
      >
        {eyebrow}
      </motion.p>
    )}
    <motion.h2
      variants={fadeUp}
      className={cn(
        "font-heading font-extrabold tracking-tight leading-[1.08]",
        "text-4xl sm:text-5xl lg:text-6xl",
        light ? "text-white" : "text-brand-dark",
        titleClassName,
      )}
    >
      {title}
    </motion.h2>
    {intro && (
      <motion.p
        variants={fadeUp}
        className={cn(
          "mt-6 text-base sm:text-lg leading-relaxed",
          light ? "text-white/70" : "text-brand-text",
          align === "center" && "mx-auto",
        )}
      >
        {intro}
      </motion.p>
    )}
  </motion.div>
);

export default SectionHeading;
