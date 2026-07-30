import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * Breadcrumb trail. `items` = [{ label, to }] — last item is current (no link).
 */
export const Breadcrumb = ({ items = [] }) => (
  <nav className="flex flex-wrap items-center gap-1.5 text-sm" data-testid="breadcrumb">
    {items.map((item, i) => {
      const last = i === items.length - 1;
      return (
        <span key={i} className="flex items-center gap-1.5">
          {item.to && !last ? (
            <Link to={item.to} className="text-brand-text transition-colors hover:text-brand-accent">
              {item.label}
            </Link>
          ) : (
            <span className={last ? "font-semibold text-brand-dark" : "text-brand-text"}>{item.label}</span>
          )}
          {!last && <ChevronRight size={14} className="text-brand-accent/60" />}
        </span>
      );
    })}
  </nav>
);

export default Breadcrumb;
