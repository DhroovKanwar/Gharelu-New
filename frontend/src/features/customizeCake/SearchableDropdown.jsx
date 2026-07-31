import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Check } from "lucide-react";
import { cn } from "../../utils/cn";
import { FieldError, FieldLabel } from "./FormFields";

/**
 * Accessible searchable dropdown — used for Occasion (32 options) and
 * Flavour (20 options) where typing to filter is faster than scrolling.
 * Purely presentational; no data-fetching or business logic inside.
 */
export const SearchableDropdown = ({
  id,
  label,
  required,
  placeholder = "Select…",
  options = [],
  value,
  onChange,
  error,
  hint,
}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    if (!q.trim()) return options;
    const s = q.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(s));
  }, [q, options]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Autofocus search when opening
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const pick = (opt) => {
    onChange(opt);
    setOpen(false);
    setQ("");
  };

  return (
    <div className="flex flex-col gap-1.5" ref={wrapRef}>
      {label && (
        <FieldLabel htmlFor={id} required={required} hint={hint}>
          {label}
        </FieldLabel>
      )}
      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between rounded-2xl border bg-brand-bg px-4 py-3 text-left text-sm text-brand-dark transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-accent",
          error ? "border-red-400" : "border-brand-line",
        )}
        data-testid={id}
      >
        <span className={cn(value ? "text-brand-dark" : "text-brand-text/50")}>{value || placeholder}</span>
        <ChevronDown
          size={16}
          className={cn("text-brand-accent transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            <div className="absolute inset-x-0 top-2 rounded-2xl border border-brand-line bg-white shadow-[0_16px_50px_-16px_rgba(215,134,159,0.35)]">
              <div className="relative border-b border-brand-line px-3 py-2.5">
                <Search size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-accent" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search…"
                  className="w-full rounded-xl bg-transparent py-1.5 pl-8 pr-3 text-sm text-brand-dark outline-none placeholder:text-brand-text/50"
                  data-testid={`${id}-search`}
                />
              </div>
              <div className="max-h-60 overflow-y-auto p-1.5" role="listbox">
                {filtered.length === 0 && (
                  <p className="px-4 py-3 text-xs text-brand-text">No matches.</p>
                )}
                {filtered.map((opt) => {
                  const active = opt === value;
                  return (
                    <button
                      key={opt}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => pick(opt)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors",
                        active
                          ? "bg-brand-secondary text-brand-dark"
                          : "text-brand-dark hover:bg-brand-secondary/60",
                      )}
                      data-testid={`${id}-option-${opt.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                    >
                      {opt}
                      {active && <Check size={14} className="text-brand-accent" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FieldError message={error} />
    </div>
  );
};

export default SearchableDropdown;
