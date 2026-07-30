import { motion } from "framer-motion";
import { Plus, ArrowRight, Gift } from "lucide-react";
import { toast } from "sonner";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import SectionHeading from "../components/common/SectionHeading";
import Button from "../components/common/Button";
import { corporateGifts } from "../data/content";
import { useCart } from "../context/CartContext";

export default function Hampers() {
  const { addItem } = useCart();

  const addHamper = (h) => {
    addItem(
      { id: `hamper-${h.id}`, name: h.name, image: h.image, collection: "Gift Hampers", price: h.price, sizes: [] },
      { qty: 1 },
    );
    toast.success(`${h.name} added to your box.`);
  };

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Curated Collections"
        title={["Gift Hampers", "for every celebration"]}
        subtitle="Beautiful festive hampers and curated gift collections — thoughtfully assembled and dressed in signature Gharelu.Bake packaging."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Start Your Order", to: "/order" }, { label: "Gift Hampers" }]}
      />

      <Section>
        <SectionHeading eyebrow="The Hamper Edit" title="Ready to gift, beautifully boxed" intro="Each hamper arrives with ribbons, a handwritten card and our finest small-batch bakes." />

        <div className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {corporateGifts.map((h, i) => (
            <motion.article
              key={h.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-brand-line bg-brand-bg"
              data-testid={`hamper-${h.id}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={h.image} alt={h.name} loading="lazy" className="h-full w-full object-cover transition-transform [transition-duration:900ms] group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-accent backdrop-blur-sm">{h.tag}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-heading text-lg font-bold tracking-tight text-brand-dark">{h.name}</h3>
                <p className="mt-1.5 text-xs text-brand-accent">{h.items}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-text">{h.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-heading text-xl font-extrabold text-brand-dark">₹{h.price}</span>
                  <button
                    onClick={() => addHamper(h)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-dark px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-accent"
                    data-testid={`hamper-add-${h.id}`}
                  >
                    <Plus size={15} /> Add
                  </button>
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
