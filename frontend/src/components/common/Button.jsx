import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

/**
 * Reusable pill button with premium micro-interactions.
 * Variants: primary (pink), dark, outline, ghost.
 */
const VARIANTS = {
  primary:
    "bg-brand-accent text-white hover:bg-brand-dark",
  soft:
    "bg-brand-primary text-brand-dark hover:bg-brand-accent hover:text-white",
  dark:
    "bg-brand-dark text-white hover:bg-brand-accent",
  outline:
    "bg-transparent text-brand-dark border border-brand-dark/25 hover:border-brand-accent hover:text-brand-accent",
  ghost:
    "bg-transparent text-brand-dark hover:text-brand-accent",
  light:
    "bg-white text-brand-dark hover:bg-brand-primary",
};

const SIZES = {
  sm: "text-xs px-5 py-2.5",
  md: "text-sm px-7 py-3.5",
  lg: "text-base px-9 py-4",
};

export const Button = ({
  as = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  icon,
  ...props
}) => {
  const Comp = motion[as] || motion.button;
  return (
    <Comp
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-heading font-semibold tracking-tight",
        "transition-colors duration-300 ease-out cursor-pointer select-none",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
      {icon}
    </Comp>
  );
};

export default Button;
