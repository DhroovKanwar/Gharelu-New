import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import SectionHeading from "../components/common/SectionHeading";
import Reveal from "../components/common/Reveal";
import Button from "../components/common/Button";
import { whyChooseUs, IMG, brand } from "../data/content";

const stats = [
  { value: "2015", label: "Baking since" },
  { value: "12k+", label: "Boxes gifted" },
  { value: "100%", label: "Eggless, always" },
  { value: "4.9", label: "Average rating" },
];

export default function About() {
  return (
    <MainLayout>
      <PageHeader
        eyebrow="Our Story"
        title={["Baked with the", "warmth of home"]}
        subtitle="GHARELU.BAKE began in a small home kitchen with one belief — that eggless could be extraordinary. Today we're a premium patisserie, but that home-baked soul has never left us."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "About Us" }]}
      />

      <Section>
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] rounded-tr-[7rem] border border-brand-line">
              <img src={IMG.chefIcing} alt="Our kitchen" className="aspect-[5/6] w-full object-cover" />
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow="How it started" title="From one oven, with love" />
            <div className="mt-6 space-y-5 text-base leading-relaxed text-brand-text">
              <p>What started as weekend baking for family and friends slowly became a promise: no eggs, no preservatives, no shortcuts — just honest, beautiful bakes that taste like they were made at home, because they are.</p>
              <p>Every morning our small team folds Belgian couverture, roasts pistachios and whips fresh cream in intimate batches. We bake the way we'd want our own celebrations catered — with patience, craft and genuine care.</p>
              <p>‘Gharelu’ means home. And that's exactly what we hope every box feels like when it reaches you.</p>
            </div>
            <Button as="a" to="/catalogue" className="mt-8" icon={<ArrowRight size={18} />}>Explore our bakes</Button>
          </div>
        </div>
      </Section>

      <Section className="bg-brand-dark">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <p className="font-heading text-4xl font-extrabold text-white md:text-5xl">{s.value}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-white/60">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section className="bg-brand-secondary">
        <SectionHeading eyebrow="What we stand for" title="Our promise, in four parts" align="center" className="mx-auto" />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {whyChooseUs.map((v, i) => (
            <Reveal key={v.no} delay={i * 0.08}>
              <div className="flex h-full gap-6 rounded-[1.75rem] border border-brand-line bg-brand-bg p-8">
                <span className="text-stroke font-heading text-4xl font-extrabold leading-none">{v.no}</span>
                <div>
                  <h3 className="font-heading text-xl font-bold tracking-tight text-brand-dark">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-text">{v.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 text-center">
          <p className="text-brand-text">Have a celebration in mind? We'd love to bake for it.</p>
          <Button as="a" to="/contact" variant="dark" className="mt-5">Get in touch</Button>
        </div>
      </Section>
    </MainLayout>
  );
}
