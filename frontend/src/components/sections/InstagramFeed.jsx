import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import Section from "../common/Section";
import { instagram, brand } from "../../data/content";

export const InstagramFeed = () => (
  <Section id="instagram" data-testid="instagram-section">
    <div className="mb-14 flex flex-col items-center text-center">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent">
        @gharelu.bake
      </p>
      <h2 className="font-heading text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl lg:text-6xl">
        Follow Gharelu.Bake
      </h2>
      <a
        href={brand.socials[0].href}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-line px-6 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-dark hover:text-white"
        data-testid="instagram-follow"
      >
        <Instagram size={17} /> Follow us
      </a>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5">
      {instagram.map((post, i) => (
        <motion.a
          key={post.id}
          href={`https://www.instagram.com/p/${post.shortcode}/`}
          target="_blank"
          rel="noreferrer"
          aria-label="View this post on Instagram"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.08 }}
          className="group relative aspect-square overflow-hidden rounded-2xl border border-brand-line shadow-[0_18px_45px_-28px_rgba(215,134,159,0.6)] sm:rounded-3xl"
          data-testid={`instagram-${post.id}`}
        >
          <img
            src={`/images/instagram/${post.shortcode}.jpg`}
            alt="Gharelu.Bake on Instagram"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-brand-accent/0 opacity-0 transition-all duration-500 group-hover:bg-brand-accent/70 group-hover:opacity-100">
            <Instagram size={28} className="text-white" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
              View on Instagram
            </span>
          </div>
        </motion.a>
      ))}
    </div>
  </Section>
);

export default InstagramFeed;
