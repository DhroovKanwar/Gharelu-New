import { motion } from "framer-motion";
import { Plus, ArrowRight, Check, Gift } from "lucide-react";
import { toast } from "sonner";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import SectionHeading from "../components/common/SectionHeading";
import Button from "../components/common/Button";
import HamperGallery from "../components/common/HamperGallery";
import { corporateGifts } from "../data/content";
import { useCart } from "../context/CartContext";

export default function Hampers() {
  const { addItem } = useCart();

  const addHamper = (h) => {
    addItem(
      { id: h.id, slug: h.id, name: h.name, image: h.images?.[0] || h.image, collection: "Gift Hampers", price: h.price, sizes: [] },
      { qty: 1 },
    );
    toast.success(`${h.name} added to your box.`);
  };

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Curated Collections"
        title={["Gift Hampers", "for every celebration"]}
        subtitle="Beautiful festive hampers and curated gift collections — thoughtfully assembled and dressed in signature GHARELU.BAKE packaging."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Start Your Order", to: "/order" }, { label: "Gift Hampers" }]}
      />

      <Section>
        <SectionHeading eyebrow="The Hamper Edit" title="Ready to gift, beautifully boxed" intro="Each hamper arrives with ribbons, a handwritten card and our finest small-batch bakes." />

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {corporateGifts.map((h, i) => (
            <motion.article
              key={h.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i % 2) * 0.08 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-brand-line bg-brand-bg sm:flex-row"
              data-testid={`hamper-${h.id}`}
            >
              <div className="relative aspect-[16/10] shrink-0 overflow-hidden sm:aspect-auto sm:w-[38%] sm:min-h-[15rem]">
                <HamperGallery images={h.images || [h.image]} alt={h.name} />
                <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-accent backdrop-blur-sm">{h.tag}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-heading text-xl font-bold tracking-tight text-brand-dark">{h.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-text">{h.description}</p>

                <div className="mt-4 rounded-xl bg-brand-secondary px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-accent">What's inside</p>
                  <ul className="mt-2 grid grid-flow-col grid-rows-3 gap-x-4 gap-y-1.5" data-testid={`hamper-includes-${h.id}`}>
                    {(h.includes || [h.items]).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13px] text-brand-dark">
                        <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-accent"><Check size={10} className="text-white" /></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                  {h.price != null ? <span className="font-heading text-xl font-extrabold text-brand-dark">₹{h.price}</span> : <span className="text-sm font-semibold text-brand-accent">Price on request</span>}
                  {h.price != null ? (
                    <button
                      onClick={() => addHamper(h)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-dark px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-accent"
                      data-testid={`hamper-add-${h.id}`}
                    >
                      <Plus size={15} /> Add to box
                    </button>
                  ) : (
                    <Button as="a" to="/contact" size="sm" variant="dark" data-testid={`hamper-enquire-${h.id}`}>Enquire</Button>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Section>

      <section className="relative overflow-hidden bg-brand-dark py-20 md:py-24">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-accent/25 blur-[120px]" />
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Gift className="mx-auto text-brand-primary" size={34} />
          <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-white md:text-4xl">Need a bespoke or bulk hamper?</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/70">For custom curation, branding and volume orders, our gifting concierge is here to help.</p>
          <Button as="a" to="/corporate" variant="light" className="mt-7" icon={<ArrowRight size={18} />}>Corporate & bulk gifting</Button>
        </div>
      </section>
    </MainLayout>
  );
}
