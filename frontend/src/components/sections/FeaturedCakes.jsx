import { ArrowRight } from "lucide-react";
import Section from "../common/Section";
import SectionHeading from "../common/SectionHeading";
import ProductCard from "../common/ProductCard";
import Button from "../common/Button";
import Reveal from "../common/Reveal";
import { featuredCakes } from "../../data/content";

export const FeaturedCakes = () => (
  <Section id="featured" data-testid="featured-section">
    <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
      <SectionHeading
        eyebrow="Signature Collection"
        title="Cakes worth the occasion"
        intro="Hand-finished, small-batch and unmistakably premium — our most-loved eggless creations."
      />
      <Reveal delay={0.2}>
        <Button as="a" href="#categories" variant="ghost" icon={<ArrowRight size={18} />} className="shrink-0">
          View all categories
        </Button>
      </Reveal>
    </div>

    <div className="mt-16 grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
      {featuredCakes.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  </Section>
);

export default FeaturedCakes;
