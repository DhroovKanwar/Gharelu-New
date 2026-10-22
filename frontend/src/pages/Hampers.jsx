import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, ArrowRight, Check, Gift, Headphones, Truck, Download } from "lucide-react";
import { toast } from "sonner";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import SectionHeading from "../components/common/SectionHeading";
import Reveal from "../components/common/Reveal";
import Button from "../components/common/Button";
import HamperGallery from "../components/common/HamperGallery";
import { corporateGifts, corporate } from "../data/content";
import { useCart } from "../context/CartContext";
import { catalogService } from "../services/api";

const steps = [
  { icon: Gift, label: "Thoughtfully Made", title: "Premium Quality, Eggless Always", body: "Every hamper is thoughtfully curated with premium,100% eggless treats, beautiful packaging and a little extra love — because your family deserves nothing less." },
  { icon: Headphones, label: "We're Here for You", title: "Your Personal Gifting Partner", body: "Away from home? We're here to help. Our support team is available daily from 10 AM to 12 midnight to help you choose, personalise and arrange your hampers with ease." },
  { icon: Truck, label: "Delivered with Love", title: "Across India, From Your Heart", body: "From your home abroad to your loved ones' doorstep in India, we make festive gifting effortless with Pan-India delivery." },
];

export default function Hampers() {
  const { addItem } = useCart();
  // The hamper cards are static content; stock comes from the catalogue so the admin's
  // "Out of stock" setting shows up here too.
  const [stock, setStock] = useState({});
  useEffect(() => {
    catalogService
      .getAllProducts()
      .then((res) => setStock(Object.fromEntries((res.data || []).map((p) => [p.id, p.inStock]))))
      .catch(() => {});
  }, []);
  const gifts = corporateGifts.map((h) => ({ ...h, inStock: stock[h.id] }));

  const addHamper = (h) => {
    addItem(
      { id: h.id, slug: h.id, name: h.name, image: h.images?.[0] || h.image, collection: "Gift Hampers", price: h.price, sizes: [], inStock: h.inStock },
      { qty: 1 },
    );
    toast.success(`${h.name} added to your box.`);
  };

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Curated Collections"
        title={["Gift Hampers", "for every celebration"]}
        subtitle="Beautiful festive hampers with Premium, Fresh and 100% Eggless Bakes — thoughtfully assembled and dressed in signature GHARELU.BAKE packaging."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Start Your Order", to: "/order" }, { label: "Gift Hampers" }]}
      />

      <Section>
        <SectionHeading eyebrow="Diwali Hampers" title="Ready to gift, beautifully boxed" intro="Each hamper arrives with ribbons, a handwritten card and our finest small-batch bakes." />
        <Button as="a" href="/downloads/gharelu-diwali-hampers.pdf" download="Gharelu-Bake-Diwali-Hampers.pdf" variant="outline" className="mt-6" icon={<Download size={18} />} data-testid="hampers-catalogue-download">
          Download hamper catalogue (PDF)
        </Button>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {gifts.map((h, i) => (
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

                {(h.weight || h.cookies) && (
                  <div className="mt-3 flex flex-wrap gap-2" data-testid={`hamper-specs-${h.id}`}>
                    {h.weight && <span className="rounded-full border border-brand-line px-3 py-1 text-xs font-semibold text-brand-dark">Net wt. {h.weight}</span>}
                    {h.cookies && <span className="rounded-full border border-brand-line px-3 py-1 text-xs font-semibold text-brand-dark">{h.cookies} pieces</span>}
                  </div>
                )}

                <div className="mt-4 rounded-xl bg-brand-secondary px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-accent">What's inside</p>
                  <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2.5" data-testid={`hamper-includes-${h.id}`}>
                    {(h.includes || [h.items]).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm font-medium leading-snug text-brand-dark">
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
                      disabled={h.inStock === false}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-dark px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-accent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-dark"
                      data-testid={`hamper-add-${h.id}`}
                    >
                      {h.inStock === false ? "Out of stock" : <><Plus size={15} /> Add to cart</>}
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

      {/* How it works */}
      <Section className="bg-brand-secondary">
        <SectionHeading eyebrow="How It Works" title="Effortless, end to end" align="center" className="mx-auto" />
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="h-full rounded-[1.75rem] border border-brand-line bg-brand-bg p-8">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-primary text-brand-dark"><s.icon size={20} /></span>
                  <span className="text-stroke font-heading text-3xl font-extrabold leading-none">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-accent">{s.label}</p>
                <h3 className="mt-2 font-heading text-xl font-bold tracking-tight text-brand-dark">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-text">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CTA banner */}
      <section className="relative overflow-hidden bg-brand-dark py-24 md:py-28">
        <div className="pointer-events-none absolute -right-40 top-0 h-[30rem] w-[30rem] rounded-full bg-brand-accent/25 blur-[130px]" />
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-6 md:px-12 lg:grid-cols-2 lg:px-20">
          <div>
            <Gift className="text-brand-primary" size={34} />
            <h2 className="mt-5 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">Let's craft your perfect gift</h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {corporate.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-white/85">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-accent"><Check size={13} className="text-white" /></span>
                  <span className="text-sm">{p}</span>
                </li>
              ))}
            </ul>
            <Button as="a" to="/contact" variant="light" size="lg" className="mt-9" icon={<ArrowRight size={18} />}>Request a quote</Button>
          </div>
          <div className="overflow-hidden rounded-[2rem] rounded-bl-[8rem] border border-white/10">
            <img src={corporate.image} alt="Diwali gift hampers" className="aspect-[4/3] w-full object-cover" />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
