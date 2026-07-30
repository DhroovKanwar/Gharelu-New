import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { corporate } from "../../data/content";
import Button from "../common/Button";

export const CorporateGifting = () => (
  <section id="corporate" className="relative overflow-hidden bg-brand-dark py-24 md:py-32" data-testid="corporate-section">
    <div className="pointer-events-none absolute -right-40 top-0 h-[30rem] w-[30rem] rounded-full bg-brand-accent/25 blur-[130px]" />
    <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-14 px-6 md:px-12 lg:grid-cols-2 lg:gap-20 lg:px-20">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-brand-primary">
          Corporate & Bulk
        </p>
        <h2 className="font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
          {corporate.title}
        </h2>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
          {corporate.body}
        </p>

        <ul className="mt-9 grid gap-4 sm:grid-cols-2">
          {corporate.points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-white/85">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-accent">
                <Check size={13} className="text-white" />
              </span>
              <span className="text-sm leading-relaxed">{p}</span>
            </li>
          ))}
        </ul>

        <Button as="a" href="#location" variant="light" size="lg" className="mt-10" icon={<ArrowRight size={18} />} data-testid="corporate-cta">
          Request a quote
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <div className="overflow-hidden rounded-[2rem] rounded-bl-[8rem] border border-white/10">
          <img src={corporate.image} alt="Corporate gifting hampers" className="aspect-[4/5] w-full object-cover" />
        </div>
        <div className="absolute -left-5 top-8 rounded-2xl bg-brand-primary px-5 py-4 shadow-xl">
          <p className="font-heading text-2xl font-extrabold text-brand-dark">25+</p>
          <p className="text-xs font-medium text-brand-dark/70">boxes · bulk pricing</p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CorporateGifting;
