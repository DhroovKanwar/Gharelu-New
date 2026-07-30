import { Star } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * Star rating display. `value` 0–5 (supports halves visually via fill count).
 */
export const Rating = ({ value = 5, size = 14, showValue = false, count, className }) => {
  const rounded = Math.round(value);
  return (
    <div className={cn("flex items-center gap-1.5", className)} data-testid="rating">
      <div className="flex items-center gap-0.5 text-brand-accent">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={size} fill={i < rounded ? "currentColor" : "none"} className={i < rounded ? "" : "text-brand-line"} />
        ))}
      </div>
      {showValue && <span className="text-sm font-semibold text-brand-dark">{value.toFixed(1)}</span>}
      {count != null && <span className="text-sm text-brand-text">({count})</span>}
    </div>
  );
};

export default Rating;
