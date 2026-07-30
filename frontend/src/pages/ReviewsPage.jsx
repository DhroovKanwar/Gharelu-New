import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import Rating from "../components/common/Rating";
import Button from "../components/common/Button";
import { reviews } from "../data/content";

export default function ReviewsPage() {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    pct: Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100),
  }));

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Kind Words"
        title="Customer Reviews"
        subtitle="Real words from real celebrations. Here's what our community has to say about their GHARELU.BAKE moments."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Reviews" }]}
      />

      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 rounded-[1.75rem] border border-brand-line bg-brand-secondary p-8">
              <p className="font-heading text-6xl font-extrabold text-brand-dark">{avg.toFixed(1)}</p>
              <Rating value={avg} size={18} className="mt-2" />
              <p className="mt-2 text-sm text-brand-text">Based on {reviews.length} verified reviews</p>
              <div className="mt-6 space-y-2.5">
                {dist.map((d) => (
                  <div key={d.star} className="flex items-center gap-3 text-sm">
                    <span className="w-3 text-brand-dark">{d.star}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-bg">
                      <div className="h-full rounded-full bg-brand-accent" style={{ width: `${d.pct}%` }} />
                    </div>
                    <span className="w-9 text-right text-brand-text">{d.pct}%</span>
                  </div>
                ))}
              </div>
              <Button as="a" to="/contact" variant="dark" className="mt-7 w-full">Share your experience</Button>
            </div>
          </div>

          {/* Reviews grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {reviews.map((r, i) => (
                <motion.figure
                  key={r.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (i % 2) * 0.08 }}
                  className="flex flex-col rounded-[1.75rem] border border-brand-line bg-brand-bg p-7"
                  data-testid={`review-${r.id}`}
                >
                  <div className="flex items-center justify-between">
                    <Quote size={26} className="text-brand-primary" fill="currentColor" />
                    <Rating value={r.rating} size={13} />
                  </div>
                  <blockquote className="mt-4 flex-1 leading-relaxed text-brand-dark">&ldquo;{r.quote}&rdquo;</blockquote>
                  <figcaption className="mt-6 flex items-center justify-between border-t border-brand-line pt-4">
                    <div>
                      <p className="font-heading text-sm font-bold text-brand-dark">{r.name}</p>
                      <p className="text-xs text-brand-text">{r.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-brand-accent">{r.product}</p>
                      <p className="text-xs text-brand-text">{r.date}</p>
                    </div>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}
