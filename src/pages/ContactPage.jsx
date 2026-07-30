import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import Button from "../components/common/Button";
import { brand } from "../data/content";
import { leadService } from "../services/api";

const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-dark">{label}</span>
    <input
      className="w-full rounded-2xl border border-brand-line bg-brand-bg px-5 py-3.5 text-brand-dark outline-none transition-shadow placeholder:text-brand-text/50 focus:ring-2 focus:ring-brand-accent"
      {...props}
    />
  </label>
);

const info = (brand) => [
  { icon: MapPin, label: "Studio", value: brand.address },
  { icon: Clock, label: "Hours", value: brand.hours },
  { icon: Phone, label: "Call", value: brand.phone },
  { icon: Mail, label: "Email", value: brand.email },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await leadService.sendEnquiry(form);
      toast.success("Thank you! We'll be in touch very soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Say Hello"
        title="Get in touch"
        subtitle="Custom cake in mind, a corporate order, or just a sweet hello — we'd love to hear from you."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      <Section>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Form */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[2rem] border border-brand-line bg-brand-secondary p-8 md:p-10"
            data-testid="contact-form"
          >
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-brand-dark">Send us a message</h2>
            <div className="mt-6 space-y-5">
              <Field label="Full Name" placeholder="Your name" value={form.name} onChange={set("name")} data-testid="contact-name" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Email" type="email" placeholder="you@email.com" value={form.email} onChange={set("email")} data-testid="contact-email" />
                <Field label="Phone" placeholder="Optional" value={form.phone} onChange={set("phone")} data-testid="contact-phone" />
              </div>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-dark">Message</span>
                <textarea
                  rows={5}
                  placeholder="Tell us about your order or occasion…"
                  value={form.message}
                  onChange={set("message")}
                  className="w-full resize-none rounded-2xl border border-brand-line bg-brand-bg px-5 py-3.5 text-brand-dark outline-none transition-shadow placeholder:text-brand-text/50 focus:ring-2 focus:ring-brand-accent"
                  data-testid="contact-message"
                />
              </label>
              <Button type="submit" disabled={loading} size="lg" className="w-full" icon={<Send size={17} />} data-testid="contact-submit">
                {loading ? "Sending…" : "Send Message"}
              </Button>
            </div>
          </motion.form>

          {/* Info + map */}
          <div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {info(brand).map((row) => (
                <div key={row.label} className="rounded-2xl border border-brand-line p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-secondary text-brand-accent">
                    <row.icon size={18} />
                  </span>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">{row.label}</p>
                  <p className="mt-1 text-sm text-brand-dark">{row.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 overflow-hidden rounded-[2rem] border border-brand-line">
              <iframe
                title="GHARELU.BAKE location"
                src="https://www.google.com/maps?q=Bandra%20West%20Mumbai&output=embed"
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                data-testid="contact-map"
              />
            </div>
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}
