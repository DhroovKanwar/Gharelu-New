import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Section from "../common/Section";
import SectionHeading from "../common/SectionHeading";
import { testimonials } from "../../data/content";

export const Testimonials = () => (
  <Section id="testimonials" className="bg-brand-secondary" data-testid="testimonials-section">
    <SectionHeading
      eyebrow="Kind Words"
      title="Loved at every celebration"
      align="center"
    />
    <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
      {testimonials.map((t, i) => (
        <motion.figure
          key={t.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
          className="flex flex-col rounded-[1.75rem] border border-brand-line bg-brand-bg p-8"
          data-testid={`testimonial-${t.id}`}
        >
          <Quote size={34} className="text-brand-primary" fill="currentColor" />
          <div className="mt-4 flex gap-0.5 text-brand-accent">
            {[...Array(t.rating)].map((_, s) => (
              <Star key={s} size={15} fill="currentColor" />
            ))}
          </div>
          <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-brand-dark">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-7 border-t border-brand-line pt-5">
            <p className="font-heading text-base font-bold text-brand-dark">{t.name}</p>
            <p className="text-sm text-brand-text">{t.role}</p>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  </Section>
);

export default Testimonials;
