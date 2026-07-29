import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import Button from "../components/common/Button";
import { events } from "../data/content";

export default function EventsPage() {
  return (
    <MainLayout>
      <PageHeader
        eyebrow="What's Baking"
        title="Events & Workshops"
        subtitle="Join us in the kitchen for hands-on masterclasses, or let us cater your next celebration with bespoke dessert experiences."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Events" }]}
      />

      <Section>
        <div className="mx-auto max-w-4xl">
          {events.map((ev, i) => {
            const [day, month] = ev.date.split(" ");
            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 border-b border-brand-line py-8 md:gap-10"
                data-testid={`event-${ev.id}`}
              >
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-brand-secondary text-center md:h-24 md:w-24">
                  <div>
                    <p className="font-heading text-2xl font-extrabold leading-none text-brand-accent md:text-3xl">{day}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-brand-dark">{month}</p>
                  </div>
                </div>
                <div>
                  <span className="mb-2 inline-block rounded-full bg-brand-primary/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-accent">{ev.tag}</span>
                  <h3 className="font-heading text-xl font-bold tracking-tight text-brand-dark md:text-2xl">{ev.title}</h3>
                  <p className="mt-1 text-sm text-brand-text">{ev.desc}</p>
                </div>
                <Button as="a" to="/contact" variant="outline" size="sm" className="hidden shrink-0 sm:inline-flex" icon={<ArrowUpRight size={16} />}>Enquire</Button>
              </motion.div>
            );
          })}
        </div>

        <div className="mx-auto mt-16 max-w-3xl rounded-[2rem] bg-brand-dark p-10 text-center md:p-14">
          <CalendarDays className="mx-auto text-brand-primary" size={34} />
          <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-white md:text-4xl">Planning something special?</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/70">From private workshops to grand grazing tables, our team crafts bespoke dessert experiences for every occasion.</p>
          <Button as="a" to="/contact" variant="light" className="mt-7">Book an event</Button>
        </div>
      </Section>
    </MainLayout>
  );
}
