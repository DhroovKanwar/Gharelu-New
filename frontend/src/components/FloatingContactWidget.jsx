import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, Instagram, Facebook, Mail, X } from "lucide-react";
import { brand } from "../data/content";

/**
 * A small floating "Call" widget that lives on the right edge of the screen.
 * Tapping it fans out the full contact bouquet — Phone, WhatsApp, Instagram,
 * Facebook and Email — using the numbers/handles already in `data/content.js`.
 *
 * Reuses the existing site data so nothing here needs to change when the
 * Laravel backend goes live (only the source of `brand` in content.js does).
 */

const ICON_MAP = {
  instagram: Instagram,
  facebook: Facebook,
  whatsapp: MessageCircle,
};

const digits = (raw) => (raw || "").replace(/\D/g, "");

const buildActions = () => {
  const actions = [];
  const num = digits(brand.phone);

  // Always show WhatsApp first (most-used channel)
  const wa = brand.socials.find((s) => s.icon === "whatsapp");
  if (wa || num) {
    actions.push({
      key: "whatsapp",
      label: "WhatsApp",
      href: wa?.href || `https://wa.me/${num}`,
      Icon: MessageCircle,
      bg: "bg-[#25D366]",
      testid: "contact-widget-whatsapp",
    });
  }
  if (brand.phone) {
    actions.push({
      key: "phone",
      label: `Call ${brand.phone}`,
      href: `tel:${brand.phone.replace(/\s/g, "")}`,
      Icon: Phone,
      bg: "bg-brand-accent",
      testid: "contact-widget-call",
    });
  }
  brand.socials
    .filter((s) => s.icon !== "whatsapp")
    .forEach((s) => {
      const Icon = ICON_MAP[s.icon];
      if (!Icon) return;
      actions.push({
        key: s.icon,
        label: s.label,
        href: s.href,
        target: "_blank",
        rel: "noreferrer",
        Icon,
        bg:
          s.icon === "instagram"
            ? "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]"
            : s.icon === "facebook"
              ? "bg-[#1877F2]"
              : "bg-brand-dark",
        testid: `contact-widget-${s.icon}`,
      });
    });
  if (brand.email) {
    actions.push({
      key: "email",
      label: brand.email,
      href: `mailto:${brand.email}`,
      Icon: Mail,
      bg: "bg-brand-dark",
      testid: "contact-widget-email",
    });
  }
  return actions;
};

export const FloatingContactWidget = () => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const actions = buildActions();

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

  return (
    <div
      ref={wrapRef}
      className="fixed right-4 z-[880] md:right-6"
      style={{ bottom: "6.5rem" }}
      data-testid="contact-widget"
    >
      {/* Fan-out contact buttons (open state) */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
              closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
            }}
            className="mb-3 flex flex-col items-end gap-2.5"
            aria-label="Contact channels"
          >
            {actions.map((a) => (
              <motion.li
                key={a.key}
                variants={{
                  open: { opacity: 1, y: 0, scale: 1 },
                  closed: { opacity: 0, y: 8, scale: 0.9 },
                }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <a
                  href={a.href}
                  target={a.target}
                  rel={a.rel}
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3"
                  data-testid={a.testid}
                >
                  <span className="hidden max-w-[220px] truncate rounded-full border border-brand-line bg-white px-4 py-2 font-heading text-xs font-bold text-brand-dark shadow-[0_10px_24px_-16px_rgba(215,134,159,0.5)] transition-opacity group-hover:opacity-100 md:inline">
                    {a.label}
                  </span>
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full text-white shadow-[0_14px_32px_-14px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:scale-[1.06] ${a.bg}`}
                  >
                    <a.Icon size={18} />
                  </span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Main trigger — phone icon */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close contact options" : "Open contact options"}
        aria-expanded={open}
        whileTap={{ scale: 0.94 }}
        animate={{ rotate: open ? 90 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="grid h-14 w-14 place-items-center rounded-full bg-brand-accent text-white shadow-[0_18px_40px_-14px_rgba(215,134,159,0.7)] transition-colors hover:bg-brand-dark"
        data-testid="contact-widget-trigger"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="phone"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              <Phone size={22} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Subtle pulsating ring — attention without being noisy */}
        {!open && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full ring-2 ring-brand-accent/50"
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.35, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.button>
    </div>
  );
};

export default FloatingContactWidget;
