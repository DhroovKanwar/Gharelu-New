import { motion } from "framer-motion";
import Section from "../common/Section";
import SectionHeading from "../common/SectionHeading";
import Button from "../common/Button";
import { gallery } from "../../data/content";
import { cn } from "../../utils/cn";

const spanFor = (w) => {
  if (w === "tall") return "row-span-2";
  if (w === "wide") return "sm:col-span-2";
  return "";
};

export const GalleryPreview = () => (
  <Section id="gallery" className="bg-brand-secondary" data-testid="gallery-section">
    <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
      <SectionHeading eyebrow="From Our Kitchen" title="A feast for the eyes" />
      <Button as="a" href="#instagram" variant="outline" className="shrink-0">
        See the full gallery
      </Button>
    </div>

    <div className="mt-14 grid auto-rows-[13rem] grid-cols-2 gap-4 sm:grid-cols-3 md:auto-rows-[15rem]">
      {gallery.map((g, i) => (
        <motion.figure
          key={g.id}
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
          className={cn("group relative overflow-hidden rounded-3xl", spanFor(g.w))}
          data-testid={`gallery-${g.id}`}
        >
          <img
            src={g.image}
            alt="Bakery"
            loading="lazy"
            className="h-full w-full object-cover transition-transform [transition-duration:900ms] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-brand-accent/0 transition-colors duration-500 group-hover:bg-brand-accent/20" />
        </motion.figure>
      ))}
    </div>
  </Section>
);

export default GalleryPreview;
