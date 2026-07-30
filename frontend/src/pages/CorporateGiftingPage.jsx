import { motion } from "framer-motion";
import { ArrowRight, Check, Gift, Palette, Truck, Users } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import SectionHeading from "../components/common/SectionHeading";
import Reveal from "../components/common/Reveal";
import Button from "../components/common/Button";
import { corporateGifts, corporate } from "../data/content";

const steps = [
  { icon: Palette, title: "Choose & Personalise", body: "Pick a hamper or build your own, then add branding, ribbons and a message." },
  { icon: Users, title: "Share Your List", body: "Send us recipient details — we handle individual addressing and packaging." },
  { icon: Truck, title: "We Deliver", body: "Scheduled, on-time dispatch across the city so every gift lands perfectly." },
];

export default function CorporateGiftingPage() {
  return (
    <MainLayout>
      <PageHeader
        eyebrow="Corporate & Bulk"
        title={["Gifting that leaves", "a lasting taste"]}
        subtitle="Curated hampers and bespoke branded confections that make your team and clients feel genuinely valued."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Corporate Gifting" }]}
      />

      {/* Gift collections */}
      <Section>
        <SectionHeading eyebrow="Gift Collections" title="Curated to impress" intro="Thoughtfully assembled boxes for every budget and occasion." />
        <div className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {corporateGifts.map((g, i) => (
            <motion.article
              key={g.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-brand-line bg-brand-bg"
              data-testid={`gift-${g.id}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={g.image} alt={g.name} className="h-full w-full object-cover transition-transform [transition-duration:900ms] group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-accent backdrop-blur-sm">{g.tag}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-heading text-lg font-bold tracking-tight text-brand-dark">{g.name}</h3>
                <p className="mt-1.5 text-xs text-brand-accent">{g.items}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-text">{g.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-heading text-xl font-extrabold text-brand-dark">₹{g.price}</span>
                  <Button as="a" to="/contact" size="sm" variant="soft">Enquire</Button>
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
                <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-brand-dark">{s.title}</h3>
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
            <img src={corporate.image} alt="Corporate hampers" className="aspect-[4/3] w-full object-cover" />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
