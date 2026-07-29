import { motion } from "framer-motion";
import { fadeUp } from "../../animations/variants";
import { cn } from "../../utils/cn";

/**
 * Generic scroll-reveal wrapper. Wrap anything to have it rise + fade
 * into view once. `delay` staggers manually placed items.
 */
export const Reveal = ({
  children,
  delay = 0,
  y = 40,
  className,
  amount = 0.3,
  once = true,
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once, amount }}
    variants={{
      hidden: { opacity: 0, y },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

/**
 * Line-by-line masked text reveal — the signature hero moment.
 * Pass an array of strings (each becomes a masked line).
 */
export const MaskedLines = ({ lines = [], className, lineClassName, delay = 0 }) => (
  <span className={cn("block", className)}>
    {lines.map((line, i) => (
      <span key={i} className="block overflow-hidden pb-[0.12em]">
        <motion.span
          className={cn("block", lineClassName)}
          initial={{ y: "115%" }}
          animate={{ y: "0%" }}
          transition={{
            duration: 1.05,
            ease: [0.16, 1, 0.3, 1],
            delay: delay + i * 0.12,
          }}
        >
          {line}
        </motion.span>
      </span>
    ))}
  </span>
);

export { fadeUp };
export default Reveal;
