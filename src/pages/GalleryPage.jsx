import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import { gallery } from "../data/content";
import { cn } from "../utils/cn";

const spanFor = (w) => (w === "tall" ? "row-span-2" : w === "wide" ? "sm:col-span-2" : "");

export default function GalleryPage() {
  const [active, setActive] = useState(null);
  return (
    <MainLayout>
      <PageHeader
        eyebrow="From Our Kitchen"
        title="The Gallery"
        subtitle="A closer look at the craft — our bakes, our people, and the little moments that make GHARELU.BAKE."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Gallery" }]}
      />

      <Section>
        <div className="grid auto-rows-[13rem] grid-cols-2 gap-4 sm:grid-cols-3 md:auto-rows-[16rem]">
          {gallery.map((g, i) => (
            <motion.button
              key={g.id}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (i % 6) * 0.05 }}
              onClick={() => setActive(g.image)}
              className={cn("group relative overflow-hidden rounded-3xl", spanFor(g.w))}
              data-testid={`gallery-${g.id}`}
            >
              <img src={g.image} alt="GHARELU.BAKE" loading="lazy" className="h-full w-full object-cover transition-transform [transition-duration:900ms] ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-brand-accent/0 transition-colors duration-500 group-hover:bg-brand-accent/20" />
            </motion.button>
          ))}
        </div>
      </Section>

      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={() => setActive(null)}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-brand-dark/70 backdrop-blur-sm" />
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              src={active}
              alt="Preview"
              className="relative z-10 max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            />
            <button className="absolute right-6 top-6 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-brand-dark" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
