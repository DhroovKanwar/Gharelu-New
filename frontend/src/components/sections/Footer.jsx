import { Instagram, Facebook, Send, MessageCircle } from "lucide-react";
import { brand, footerLinks } from "../../data/content";

const ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  pinterest: Send,
  whatsapp: MessageCircle,
};

export const Footer = () => (
  <footer className="bg-brand-dark pt-20 text-white" data-testid="footer">
    <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
      <div className="grid grid-cols-2 gap-10 border-b border-white/10 pb-16 md:grid-cols-4 lg:grid-cols-6">
        <div className="col-span-2 lg:col-span-3">
          <a href="#top" className="font-heading text-2xl font-extrabold tracking-tight">
            Gharelu<span className="text-brand-primary">.Bake</span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            {brand.tagline}. Small-batch eggless patisserie, baked with the warmth of home.
          </p>
          <div className="mt-6 flex gap-3">
            {brand.socials.map((s) => {
              const Icon = ICONS[s.icon];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:bg-brand-accent hover:text-white"
                  data-testid={`social-${s.icon}`}
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>
        </div>

        {footerLinks.map((col) => (
          <div key={col.heading}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">{col.heading}</p>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-white/65 transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <p className="text-xs text-white/40">© {new Date().getFullYear()} Gharelu.Bake. All rights reserved.</p>
        <p className="text-xs text-white/40">Crafted with warmth · 100% Eggless</p>
      </div>
    </div>

    {/* Massive brand wordmark */}
    <div className="overflow-hidden">
      <p className="text-stroke-dark select-none whitespace-nowrap text-center font-heading text-[22vw] font-extrabold leading-none tracking-tight lg:text-[16rem]">
        Gharelu.Bake
      </p>
    </div>
  </footer>
);

export default Footer;
