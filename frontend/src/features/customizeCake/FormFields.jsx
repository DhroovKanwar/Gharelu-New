import { forwardRef } from "react";
import { cn } from "../../utils/cn";

/**
 * Reusable inputs that match the existing Gharelu.Bake design language
 * (pink border, brand-bg fill, brand-accent focus ring). Used by every step
 * of the Customize Your Cake form so styling stays consistent.
 */

export const FieldLabel = ({ htmlFor, children, required, hint }) => (
  <div className="flex items-baseline justify-between">
    <label htmlFor={htmlFor} className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">
      {children}
      {required && <span className="ml-1 text-brand-accent">*</span>}
    </label>
    {hint && <span className="text-[11px] text-brand-text/70">{hint}</span>}
  </div>
);

export const FieldError = ({ message }) =>
  message ? <p className="mt-1.5 text-xs font-medium text-red-500">{message}</p> : null;

const baseInputCls =
  "w-full rounded-2xl border bg-brand-bg px-4 py-3 text-sm text-brand-dark outline-none transition-shadow placeholder:text-brand-text/50 focus:ring-2 focus:ring-brand-accent";

export const TextInput = forwardRef(function TextInput(
  { id, label, required, hint, error, className, containerClassName, ...rest },
  ref,
) {
  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <FieldLabel htmlFor={id} required={required} hint={hint}>
          {label}
        </FieldLabel>
      )}
      <input
        id={id}
        ref={ref}
        className={cn(
          baseInputCls,
          error ? "border-red-400" : "border-brand-line",
          className,
        )}
        data-testid={id}
        {...rest}
      />
      <FieldError message={error} />
    </div>
  );
});

export const TextArea = forwardRef(function TextArea(
  { id, label, required, hint, error, rows = 5, className, containerClassName, ...rest },
  ref,
) {
  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <FieldLabel htmlFor={id} required={required} hint={hint}>
          {label}
        </FieldLabel>
      )}
      <textarea
        id={id}
        ref={ref}
        rows={rows}
        className={cn(
          baseInputCls,
          "resize-y",
          error ? "border-red-400" : "border-brand-line",
          className,
        )}
        data-testid={id}
        {...rest}
      />
      <FieldError message={error} />
    </div>
  );
});

/**
 * A dropdown option card group used for guest count, budget, shape, flavour
 * when we want a compact chip-style select.
 */
export const OptionGrid = ({ id, label, required, error, options, value, onChange, cols = 3 }) => (
  <div className="flex flex-col gap-2">
    {label && (
      <FieldLabel required={required}>
        {label}
      </FieldLabel>
    )}
    <div
      className={cn(
        "grid gap-2.5",
        cols === 2 && "grid-cols-2",
        cols === 3 && "grid-cols-2 sm:grid-cols-3",
        cols === 4 && "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
      )}
      role="radiogroup"
      data-testid={id}
    >
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors",
              active
                ? "border-brand-dark bg-brand-dark text-white"
                : "border-brand-line bg-brand-bg text-brand-dark hover:border-brand-accent hover:text-brand-accent",
            )}
            data-testid={`${id}-${opt.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
          >
            {opt}
          </button>
        );
      })}
    </div>
    <FieldError message={error} />
  </div>
);
