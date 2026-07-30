import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Section from "../common/Section";
import SectionHeading from "../common/SectionHeading";
import { events } from "../../data/content";

const EventRow = ({ ev, index }) => {
  const [day, month] = ev.date.split(" ");
  return (
    <motion.a
      href="#location"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 }}
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 border-b border-brand-line py-7 transition-colors hover:bg-brand-secondary/60 md:gap-10 md:px-4"
      data-testid={`event-${ev.id}`}
    >
      <div className="text-center">
        <p className="font-heading text-3xl font-extrabold leading-none text-brand-accent md:text-4xl">{day}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-brand-text">{month}</p>
      </div>
      <div>
        <span className="mb-2 inline-block rounded-full bg-brand-primary/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-accent">
          {ev.tag}
        </span>
        <h3 className="font-heading text-xl font-bold tracking-tight text-brand-dark md:text-2xl">{ev.title}</h3>
        <p className="mt-1 text-sm text-brand-text">{ev.desc}</p>
      </div>
      <span className="grid h-12 w-12 place-items-center rounded-full border border-brand-line text-brand-dark transition-all duration-300 group-hover:bg-brand-dark group-hover:text-white">
        <ArrowUpRight size={20} />
      </span>
    </motion.a>
  );
};

export const Events = () => (
  <Section id="events" data-testid="events-section">
    <SectionHeading
      eyebrow="Whats Baking"
      title="Events & workshops"
      intro="Join us in the kitchen, or let us cater your next celebration."
    />
    <div className="mt-14">
      {events.map((ev, i) => (
        <EventRow key={ev.id} ev={ev} index={i} />
      ))}
    </div>
  </Section>
);

export default Events;
