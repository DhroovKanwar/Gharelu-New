import { motion } from "framer-motion";
import { Instagram, Heart } from "lucide-react";
import Section from "../common/Section";
import { instagram, brand } from "../../data/content";

export const InstagramFeed = () => (
  <Section id="instagram" data-testid="instagram-section">
    <div className="mb-14 flex flex-col items-center text-center">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent">
        @gharelu.bake
      </p>
      <h2 className="font-heading text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl lg:text-6xl">
        Follow the crumbs
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

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
      {instagram.map((post, i) => (
        <motion.a
          key={post.id}
          href={brand.socials[0].href}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
          className="group relative aspect-square overflow-hidden rounded-2xl"
          data-testid={`instagram-${post.id}`}
        >
          <img src={post.image} alt="Instagram post" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 flex items-center justify-center bg-brand-accent/0 opacity-0 transition-all duration-400 group-hover:bg-brand-accent/70 group-hover:opacity-100">
            <span className="flex items-center gap-2 font-semibold text-white">
              <Heart size={18} fill="currentColor" /> {post.likes}
            </span>
          </div>
        </motion.a>
      ))}
    </div>
  </Section>
);

export default InstagramFeed;
