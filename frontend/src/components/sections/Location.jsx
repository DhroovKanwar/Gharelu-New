import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import Section from "../common/Section";
import SectionHeading from "../common/SectionHeading";
import { brand } from "../../data/content";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 border-b border-brand-line py-5">
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-secondary text-brand-accent">
      <Icon size={18} />
    </span>
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">{label}</p>
      <p className="mt-1 text-base text-brand-dark">{value}</p>
    </div>
  </div>
);

export const Location = () => (
  <Section id="location" className="bg-brand-secondary" data-testid="location-section">
    <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
      <div>
        <SectionHeading eyebrow="Visit / Order" title="Come say hello" intro="Walk in for a warm slice, or reach out to place a custom order." />
        <div className="mt-10">
          <InfoRow icon={MapPin} label="Studio" value={brand.address} />
          <InfoRow icon={Clock} label="Hours" value={brand.hours} />
          <InfoRow icon={Phone} label="Call" value={brand.phone} />
          <InfoRow icon={Mail} label="Email" value={brand.email} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden rounded-[2rem] border border-brand-line shadow-lg"
      >
        <iframe
          title="GHARELU.BAKE location"
          src="https://www.google.com/maps?q=Bandra%20West%20Mumbai&output=embed"
          className="h-full min-h-[26rem] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          data-testid="location-map"
        />
      </motion.div>
    </div>
  </Section>
);

export default Location;
