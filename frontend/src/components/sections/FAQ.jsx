import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import Section from "../common/Section";
import SectionHeading from "../common/SectionHeading";
import { faqs } from "../../data/content";
import { cn } from "../../utils/cn";

const FaqItem = ({ item, isOpen, onToggle, index }) => (
  <div className="border-b border-brand-line" data-testid={`faq-${index}`}>
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-6 py-6 text-left"
      data-testid={`faq-toggle-${index}`}
    >
      <span className="font-heading text-lg font-bold tracking-tight text-brand-dark md:text-xl">
        {item.q}
      </span>
      <span
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-all duration-300 md:h-10 md:w-10",
          isOpen ? "rotate-45 border-brand-accent bg-brand-accent text-white" : "border-brand-line text-brand-dark",
        )}
      >
        <Plus size={18} />
      </span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <p className="max-w-2xl pb-7 text-base leading-relaxed text-brand-text">{item.a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export const FAQ = () => {
  const [open, setOpen] = useState(0);
  return (
    <Section id="faq" data-testid="faq-section">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading eyebrow="Good to Know" title="Questions, answered" />
          </div>
        </div>
        <div className="lg:col-span-8">
          {faqs.slice(0, 5).map((item, i) => (
            <FaqItem
              key={i}
              index={i}
              item={item}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default FAQ;