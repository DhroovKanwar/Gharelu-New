import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "./Button";
import { cn } from "../../utils/cn";

/**
 * Reusable premium order-option card for the "Start Your Order" page.
 * Soft shadow, rounded corners, hover lift + animated icon badge.
 */
export const OrderOptionCard = ({
  icon: Icon,
  title,
  description,
  buttonLabel,
  to,
  onClick,
  variant = "plain",
  buttonVariant = "dark",
  index = 0,
  testid,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 + index * 0.1 }}
    whileHover={{ y: -8 }}
    className={cn(
      "group flex h-full flex-col rounded-[2rem] p-8 shadow-[0_18px_50px_-24px_rgba(215,134,159,0.45)] transition-shadow duration-500 hover:shadow-[0_30px_70px_-24px_rgba(215,134,159,0.6)] md:p-10",
      variant === "soft"
        ? "bg-brand-secondary border border-brand-line"
        : "bg-brand-bg border border-brand-line",
    )}
    data-testid={testid}
  >
    <div className="flex items-center justify-between">
      <motion.span
        whileHover={{ rotate: -6, scale: 1.06 }}
        transition={{ type: "spring", stiffness: 300, damping: 12 }}
        className={cn(
          "grid h-16 w-16 place-items-center rounded-full transition-colors duration-500 group-hover:bg-brand-accent group-hover:text-white",
          variant === "soft" ? "bg-brand-bg text-brand-accent" : "bg-brand-secondary text-brand-accent",
        )}
      >
        <Icon size={28} strokeWidth={1.75} />
      </motion.span>
      <ArrowRight size={22} className="text-brand-accent opacity-0 transition-all duration-500 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100" />
    </div>

    <h3 className="mt-7 font-heading text-2xl font-extrabold tracking-tight text-brand-dark md:text-3xl">{title}</h3>
    <p className="mt-3 flex-1 text-base leading-relaxed text-brand-text">{description}</p>

    <Button
      as="a"
      to={to}
      onClick={onClick}
      variant={buttonVariant}
      size="lg"
      className="mt-8 w-full"
      icon={<ArrowRight size={18} />}
      data-testid={testid ? `${testid}-btn` : undefined}
    >
      {buttonLabel}
    </Button>
  </motion.div>
);

export default OrderOptionCard;
