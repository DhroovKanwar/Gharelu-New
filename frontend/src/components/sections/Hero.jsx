import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, Sparkles, Star } from "lucide-react";
import { MaskedLines } from "../common/Reveal";
import Button from "../common/Button";
import { IMG } from "../../data/content";
import { getActiveHero } from "../../services/heroService";

export const Hero = () => {
  const ref = useRef(null);
  const hero = getActiveHero();
  const heroImage = hero.image || IMG.layerCake;
  const heroAlt = hero.alt || "Signature eggless cake";
  const campaign = hero.campaign;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yImg = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yMacaron = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const yBlob = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const scaleImg = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative overflow-hidden bg-brand-bg pt-16 md:pt-20"
      data-testid="hero"
    >
      {/* soft pastel background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-10 h-[38rem] w-[38rem] rounded-full bg-brand-primary/40 blur-[120px]" />
        <div className="absolute -right-20 bottom-0 h-[30rem] w-[30rem] rounded-full bg-brand-secondary blur-[100px]" />
      </div>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-14 px-6 pb-20 pt-10 md:px-12 lg:grid-cols-12 lg:gap-8 lg:px-20 lg:pb-28">
        {/* Copy */}
        <div className="lg:col-span-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent"
          >
            <span className="h-px w-10 bg-brand-accent" />
            Pure • Premium • Eggless
          </motion.p>

          <h1 className="font-heading text-[3.1rem] font-extrabold leading-[0.98] tracking-tight text-brand-dark sm:text-6xl lg:text-[5.4rem]">
            <MaskedLines lines={["Eggless bakes,", "made purely"]} delay={0.15} />
            <span className="mt-1 block overflow-hidden pb-[0.12em]">
              <motion.span
                className="block italic text-brand-accent"
                style={{ fontFamily: "Poppins" }}
                initial={{ y: "115%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.39 }}
              >
                premium.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-md text-base leading-relaxed text-brand-text sm:text-lg"
          >
            Small-batch patisserie baked fresh every morning — no eggs, no
            preservatives, no compromise. Just the warmth of home, elevated.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button as="a" href="#featured" size="lg" icon={<ArrowDownRight size={18} />} data-testid="hero-cta-shop">
              Explore Cakes
            </Button>
            <Button as="a" href="#corporate" size="lg" variant="outline" data-testid="hero-cta-corporate">
              Corporate Gifting
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 1 }}
            className="mt-12 flex items-center gap-8"
          >
            <div>
              <p className="font-heading text-3xl font-extrabold text-brand-dark">4.9</p>
              <div className="mt-1 flex items-center gap-0.5 text-brand-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" />
                ))}
              </div>
            </div>
            <div className="h-10 w-px bg-brand-line" />
            <div>
              <p className="font-heading text-3xl font-extrabold text-brand-dark">12k+</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-brand-text">Boxes gifted</p>
            </div>
            <div className="h-10 w-px bg-brand-line" />
            <div>
              <p className="font-heading text-3xl font-extrabold text-brand-dark">100%</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-brand-text">Eggless</p>
            </div>
          </motion.div>
        </div>

        {/* Visual */}
        <div className="relative lg:col-span-6 lg:pl-8">
          <motion.div style={{ y: yBlob }} className="pointer-events-none absolute -right-6 top-6 -z-10 hidden lg:block">
            <div className="h-72 w-72 rounded-full bg-brand-primary/50 blur-2xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative"
          >
            <motion.div
              style={{ y: yImg }}
              className="relative overflow-hidden rounded-[2rem] rounded-t-[14rem] border border-brand-line shadow-[0_40px_80px_-30px_rgba(215,134,159,0.5)]"
            >
              <motion.img
                style={{ scale: scaleImg }}
                src={heroImage}
                alt={heroAlt}
                className="aspect-[4/5] w-full object-cover"
              />

              {/* Campaign ribbon — festival / offer badge (data-driven) */}
              {campaign && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-4 bottom-4 rounded-2xl border border-brand-line bg-brand-bg/95 p-4 shadow-[0_18px_45px_-16px_rgba(215,134,159,0.55)] backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-5"
                  data-testid="hero-campaign-badge"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-accent text-white">
                      <Sparkles size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-accent">
                        {campaign.label}
                      </p>
                      <p className="mt-0.5 truncate font-heading text-sm font-extrabold text-brand-dark sm:text-base">
                        {campaign.line}
                      </p>
                    </div>
                    {campaign.cta_href && campaign.cta_label && (
                      <Link
                        to={campaign.cta_href}
                        className="shrink-0 rounded-full bg-brand-dark px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-accent"
                        data-testid="hero-campaign-cta"
                      >
                        {campaign.cta_label}
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* floating macaron badge */}
            <motion.div
              style={{ y: yMacaron }}
              className="absolute -left-6 bottom-16 hidden h-40 w-40 overflow-hidden rounded-3xl border-4 border-brand-bg shadow-xl sm:block"
            >
              <img src={IMG.macaronsPink} alt="Macarons" className="h-full w-full object-cover" />
            </motion.div>

            {/* rotating premium seal */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              className="absolute -right-4 -top-4 h-28 w-28 sm:-right-6 sm:-top-6"
            >
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <defs>
                  <path id="circlePath" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                </defs>
                <circle cx="50" cy="50" r="49" fill="#262626" />
                <text fill="#EFC7D3" fontSize="10" letterSpacing="3.4" fontFamily="Poppins" fontWeight="600">
                  <textPath href="#circlePath" startOffset="0%">
                    PURE • PREMIUM • EGGLESS •
                  </textPath>
                </text>
              </svg>
              <Star size={20} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary" fill="currentColor" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
