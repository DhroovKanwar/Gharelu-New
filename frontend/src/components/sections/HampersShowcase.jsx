import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Section from "../common/Section";
import SectionHeading from "../common/SectionHeading";
import Button from "../common/Button";
import Reveal from "../common/Reveal";
import { corporateGifts } from "../../data/content";

export const HampersShowcase = () => (
  <Section id="hampers" data-testid="hampers-section">
    <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
      <SectionHeading
        eyebrow="Diwali Hampers"
        title="Ready to gift, beautifully boxed"
        intro="Festive hampers with premium, fresh and 100% eggless bakes, dressed in signature GHARELU.BAKE packaging."
      />
      <Reveal delay={0.2}>
        <Button to="/hampers" variant="ghost" icon={<ArrowRight size={18} />} className="shrink-0">
          View all hampers
        </Button>
      </Reveal>
    </div>

    <div className="mt-16 grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {corporateGifts.map((h) => (
        <Link key={h.id} to="/hampers" className="group block" data-testid={`home-hamper-${h.id}`}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-brand-line">
            <img
              src={h.images?.[0] || h.image}
              alt={h.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {h.tag && (
              <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-accent backdrop-blur-sm">
                {h.tag}
              </span>
            )}
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-4">
            <h3 className="font-heading text-lg font-bold tracking-tight text-brand-dark">{h.name}</h3>
            {h.price != null && (
              <span className="font-heading text-lg font-extrabold text-brand-dark">₹{h.price}</span>
            )}
          </div>
        </Link>
      ))}
    </div>
  </Section>
);

export default HampersShowcase;
