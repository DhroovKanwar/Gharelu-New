import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Section from "../common/Section";
import SectionHeading from "../common/SectionHeading";
import { categories } from "../../data/content";
import { cn } from "../../utils/cn";

const CategoryCard = ({ cat, index }) => (
  <motion.a
    href="#featured"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
    className={cn(
      "group relative overflow-hidden rounded-[1.75rem] border border-brand-line min-h-[16rem]",
      cat.span,
    )}
    data-testid={`category-${cat.id}`}
  >
    <img
      src={cat.image}
      alt={cat.name}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover transition-transform [transition-duration:900ms] ease-out group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-brand-dark/10 to-transparent" />
    <div className="absolute inset-0 flex flex-col justify-end p-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">
            {cat.count} creations
          </p>
          <h3 className="mt-1.5 font-heading text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            {cat.name}
          </h3>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/90 text-brand-dark transition-all duration-300 group-hover:bg-brand-accent group-hover:text-white">
          <ArrowUpRight size={20} />
        </span>
      </div>
    </div>
  </motion.a>
);

export const Categories = () => (
  <Section id="categories" className="bg-brand-bg" data-testid="categories-section">
    <SectionHeading
      eyebrow="Browse the Bakery"
      title="Every craving, curated"
      intro="From celebration centrepieces to everyday indulgences — explore our collections."
    />
    <div className="mt-16 grid auto-rows-[16rem] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((c, i) => (
        <CategoryCard key={c.id} cat={c} index={i} />
      ))}
    </div>
  </Section>
);

export default Categories;
