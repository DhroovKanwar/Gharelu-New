import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Facebook, Send, MessageCircle, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { brand, footerLinks } from "../../data/content";
import { leadService } from "../../services/api";

const ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  pinterest: Send,
  whatsapp: MessageCircle,
};

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubscribe = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await leadService.subscribe(email);
      toast.success("You're on the list! Sweet things are coming.");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-brand-dark text-white" data-testid="footer">
      {/* Decorative outlined wordmark — responsive, fully visible, centered, behind content */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center md:bottom-5" aria-hidden="true">
        <span
          className="text-stroke-dark select-none whitespace-nowrap font-heading font-extrabold leading-none tracking-tight opacity-70"
          style={{ fontSize: "clamp(2.25rem, 12.5vw, 13rem)" }}
        >
          GHARELU.BAKE
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pt-20 md:px-12 lg:px-20">
        {/* Top: brand + newsletter */}
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <Link to="/" className="inline-block font-heading text-2xl font-extrabold tracking-tight transition-colors hover:text-brand-primary">
              GHARELU<span className="text-brand-primary">.BAKE</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              {brand.tagline}. Small-batch eggless patisserie, baked with the warmth of home.
            </p>
            <div className="mt-6 flex gap-3">
              {brand.socials.map((s) => {
                const Icon = ICONS[s.icon];
                return (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors duration-300 hover:border-brand-accent hover:bg-brand-accent hover:text-white"
                    data-testid={`social-${s.icon}`}
                  >
                    <Icon size={17} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:pl-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Join the inner circle</p>
            <h3 className="mt-3 max-w-md font-heading text-2xl font-extrabold leading-tight tracking-tight text-white">
              Early access to seasonal drops & members-only treats
            </h3>
            <form onSubmit={onSubscribe} className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row" data-testid="footer-newsletter-form">
              <div className="relative flex-1">
                <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-full border border-white/15 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-brand-accent"
                  data-testid="footer-newsletter-email"
                />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3.5 font-heading text-sm font-semibold text-brand-dark transition-colors duration-300 hover:bg-brand-accent hover:text-white disabled:opacity-60"
                data-testid="footer-newsletter-submit"
              >
                {loading ? "Joining…" : "Subscribe"} <ArrowRight size={16} />
              </motion.button>
            </form>
          </div>
        </div>

        {/* Middle: quick links + contact */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 border-b border-white/10 py-14 md:grid-cols-4">
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">{col.heading}</p>
              <ul className="mt-5 space-y-3.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-white/65 transition-colors duration-300 hover:text-white"
                    >
                      <span className="transition-transform duration-300 group-hover:translate-x-1">{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Contact</p>
            <ul className="mt-5 space-y-4 text-sm text-white/65">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand-accent" />
                <span>{brand.address}</span>
              </li>
              <li>
                <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="group inline-flex items-center gap-3 transition-colors duration-300 hover:text-white">
                  <Phone size={16} className="shrink-0 text-brand-accent" />
                  <span className="transition-transform duration-300 group-hover:translate-x-1">{brand.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${brand.email}`} className="group inline-flex items-center gap-3 transition-colors duration-300 hover:text-white">
                  <Mail size={16} className="shrink-0 text-brand-accent" />
                  <span className="transition-transform duration-300 group-hover:translate-x-1">{brand.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 py-8 text-center md:flex-row md:text-left">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} GHARELU.BAKE. All rights reserved.</p>
          <p className="text-xs text-white/40">Crafted with warmth · 100% Eggless</p>
        </div>

        {/* Spacer so decorative wordmark sits gracefully behind, never overlapping text */}
        <div aria-hidden="true" style={{ height: "clamp(2.5rem, 12vw, 12rem)" }} />
      </div>
    </footer>
  );
};

export default Footer;
