import MainLayout from "../../layouts/MainLayout";
import PageHeader from "./PageHeader";
import Section from "./Section";
import Reveal from "./Reveal";

/**
 * Reusable legal / policy page rendered from JSON policy data.
 */
export const LegalPage = ({ policy, breadcrumb }) => (
  <MainLayout>
    <PageHeader
      eyebrow={`Updated ${policy.updated}`}
      title={policy.title}
      subtitle={policy.intro}
      breadcrumb={breadcrumb}
    />
    <Section className="pt-16 md:pt-20">
      <div className="mx-auto max-w-3xl">
        {policy.sections.map((s, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div className="mb-12 border-b border-brand-line pb-12 last:border-0">
              <div className="flex items-baseline gap-4">
                <span className="text-stroke font-heading text-3xl font-extrabold leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-heading text-2xl font-bold tracking-tight text-brand-dark">{s.heading}</h2>
              </div>
              <p className="mt-4 pl-0 text-base leading-relaxed text-brand-text md:pl-16">{s.body}</p>
            </div>
          </Reveal>
        ))}
        <p className="text-sm text-brand-text">
          Questions about this policy? Write to us at{" "}
          <a href="mailto:hello@gharelu.bake" className="font-semibold text-brand-accent">hello@gharelu.bake</a>.
        </p>
      </div>
    </Section>
  </MainLayout>
);

export default LegalPage;
