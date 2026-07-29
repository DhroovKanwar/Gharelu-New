import { motion } from "framer-motion";
import Container from "./Container";
import Breadcrumb from "./Breadcrumb";
import { MaskedLines } from "./Reveal";

/**
 * Reusable inner-page header in the same premium language as the homepage
 * hero — soft pastel field, eyebrow, masked title reveal, optional breadcrumb.
 */
export const PageHeader = ({ eyebrow, title, subtitle, breadcrumb, align = "left" }) => (
  <section className="relative overflow-hidden bg-brand-secondary pt-16 pb-16 md:pt-20 md:pb-20" data-testid="page-header">
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-primary/40 blur-[110px]" />
      <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-brand-bg blur-[90px]" />
    </div>
    <Container className={align === "center" ? "text-center" : ""}>
      {breadcrumb && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={align === "center" ? "flex justify-center" : ""}
        >
          <Breadcrumb items={breadcrumb} />
        </motion.div>
      )}
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent"
        >
          {eyebrow}
        </motion.p>
      )}
      <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-dark sm:text-5xl lg:text-6xl">
        <MaskedLines lines={Array.isArray(title) ? title : [title]} delay={0.15} />
      </h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`mt-6 max-w-xl text-base leading-relaxed text-brand-text sm:text-lg ${align === "center" ? "mx-auto" : ""}`}
        >
          {subtitle}
        </motion.p>
      )}
    </Container>
  </section>
);

export default PageHeader;
