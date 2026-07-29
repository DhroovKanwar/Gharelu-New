/**
 * Slow editorial marquee — a single kinetic ribbon that breaks the page
 * rhythm between sections. Pure CSS (tailwind keyframe) for silky loop.
 */
const WORDS = [
  "Belgian Chocolate",
  "Fresh Cream",
  "Real Fruit",
  "Single-Origin Vanilla",
  "Slow Baked",
  "Zero Preservatives",
];

export const EditorialMarquee = () => (
  <section className="overflow-hidden border-y border-brand-line bg-brand-secondary py-8" data-testid="editorial-marquee">
    <div className="flex w-max animate-marquee-x whitespace-nowrap will-change-transform">
      {[0, 1].map((dup) => (
        <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
          {WORDS.map((w, i) => (
            <span key={i} className="mx-8 flex items-center gap-8">
              <span className="font-heading text-3xl font-extrabold tracking-tight text-brand-dark md:text-5xl">
                {w}
              </span>
              <span className="text-2xl text-brand-accent md:text-4xl">✳</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </section>
);

export default EditorialMarquee;
