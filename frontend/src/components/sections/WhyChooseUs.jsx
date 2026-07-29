import { motion } from "framer-motion";
import Section from "../common/Section";
import { whyChooseUs, IMG } from "../../data/content";

export const WhyChooseUs = () => (
  <Section id="why" className="bg-brand-secondary" data-testid="why-section">
    <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
      {/* Sticky visual + intro */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent">
            The Gharelu Promise
          </p>
          <h2 className="font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-brand-dark sm:text-5xl lg:text-6xl">
            Why we&rsquo;re worth the indulgence
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-brand-text sm:text-lg">
            Four principles guide everything that leaves our kitchen. No factory
            lines. No shortcuts. Only craft.
          </p>
          <div className="mt-10 overflow-hidden rounded-[1.75rem] rounded-tr-[6rem] border border-brand-line">
            <img src={IMG.chefIcing} alt="Pastry chef at work" className="aspect-[5/4] w-full object-cover" />
          </div>
        </div>
      </div>

      {/* Manifesto chapters */}
      <div className="lg:col-span-7 lg:pt-6">
        <div className="flex flex-col">
          {whyChooseUs.map((item, i) => (
            <motion.div
              key={item.no}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group flex gap-6 border-b border-brand-line py-9 first:pt-0 md:gap-10"
              data-testid={`why-item-${item.no}`}
            >
              <span className="text-stroke font-heading text-5xl font-extrabold leading-none md:text-7xl">
                {item.no}
              </span>
              <div className="pt-1">
                <h3 className="font-heading text-2xl font-bold tracking-tight text-brand-dark md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-brand-text">
                  {item.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </Section>
);

export default WhyChooseUs;
