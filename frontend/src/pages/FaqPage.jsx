import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import Button from "../components/common/Button";
import { faqs } from "../data/content";
import { cn } from "../utils/cn";

export default function FaqPage() {
  const [open, setOpen] = useState(0);
  return (
    <MainLayout>
      <PageHeader
        eyebrow="Good to Know"
        title="Frequently asked questions"
        subtitle="Everything you might want to know about our bakes, ordering, delivery and more."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "FAQ" }]}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          {faqs.map((item, i) => (
            <div key={i} className="border-b border-brand-line" data-testid={`faq-${i}`}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
                data-testid={`faq-toggle-${i}`}
              >
                <span className="font-heading text-lg font-bold tracking-tight text-brand-dark md:text-xl">{item.q}</span>
                <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-300", open === i ? "rotate-45 border-brand-accent bg-brand-accent text-white" : "border-brand-line text-brand-dark")}>
                  <Plus size={18} />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-7 text-base leading-relaxed text-brand-text">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <div className="mt-12 rounded-[2rem] bg-brand-secondary p-10 text-center">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-brand-dark">Still have a question?</h2>
            <p className="mx-auto mt-3 max-w-md text-brand-text">Our team is always happy to help with custom orders and special requests.</p>
            <Button as="a" to="/contact" className="mt-6">Contact us</Button>
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}
