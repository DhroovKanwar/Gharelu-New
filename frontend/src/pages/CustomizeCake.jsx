import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

import MainLayout from "../layouts/MainLayout";
import Container from "../components/common/Container";
import Section from "../components/common/Section";
import Breadcrumb from "../components/common/Breadcrumb";
import Button from "../components/common/Button";

import {
  OCCASIONS,
  PREFERRED_TIMES,
  GUEST_BUCKETS,
  DELIVERY_TYPES,
  FLAVOURS,
  SHAPES,
  BUDGETS,
  initialCustomCakeState,
  toApiPayload,
  buildWhatsappMessage,
  toWhatsappNumber,
  validateStep,
} from "../features/customizeCake/schema";
import {
  TextInput,
  TextArea,
  OptionGrid,
} from "../features/customizeCake/FormFields";
import SearchableDropdown from "../features/customizeCake/SearchableDropdown";
import ImageUploader from "../features/customizeCake/ImageUploader";
import SummaryCard from "../features/customizeCake/SummaryCard";
import {
  draftService,
  submitCustomCakeRequest,
} from "../services/customCakeService";
import { brand } from "../data/content";

const TOTAL_STEPS = 7;

const STEP_META = [
  { id: 1, title: "Customer Details", desc: "Let us know who we're baking for." },
  { id: 2, title: "Occasion", desc: "What's the celebration about?" },
  { id: 3, title: "Celebration Details", desc: "When would you like it ready?" },
  { id: 4, title: "Guest Count", desc: "How big should the cake be?" },
  { id: 5, title: "Delivery Details", desc: "How should we get it to you?" },
  { id: 6, title: "Cake Preferences", desc: "Design, flavour and message." },
  { id: 7, title: "Budget & Notes", desc: "Anything else we should know?" },
];

const openWhatsapp = (state) => {
  const msg = buildWhatsappMessage(state);
  const num = toWhatsappNumber(brand.phone);
  const url = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

export default function CustomizeCake() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1..7, 8 = summary, 9 = done
  const [state, setState] = useState(() => draftService.load() || initialCustomCakeState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);

  // Persist draft on every change so a refresh doesn't lose progress
  useEffect(() => {
    if (submittedId) return; // stop saving after successful submit
    draftService.save(state);
  }, [state, submittedId]);

  const set = (patch) => setState((s) => ({ ...s, ...patch }));

  const progress = useMemo(() => Math.min(step, TOTAL_STEPS) / TOTAL_STEPS, [step]);

  const goNext = () => {
    if (step <= TOTAL_STEPS) {
      const { ok, errors: err } = validateStep(step, state);
      setErrors(err);
      if (!ok) {
        toast.error("Please complete the required fields.");
        return;
      }
    }
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep((s) => Math.max(1, s - 1));
  };

  const submitForm = async ({ afterOpenWhatsapp = false } = {}) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = toApiPayload(state);
      const res = await submitCustomCakeRequest(payload);
      setSubmittedId(res.id);
      draftService.clear();
      toast.success("Request received. We'll be in touch shortly!");
      if (afterOpenWhatsapp) openWhatsapp(state);
      setStep(9);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const startFresh = () => {
    setState(initialCustomCakeState);
    setSubmittedId(null);
    setErrors({});
    setStep(1);
  };

  // ─── UI ────────────────────────────────────────────────────────────────
  return (
    <MainLayout>
      {/* Header */}
      <section className="relative overflow-hidden bg-brand-secondary pt-14 pb-14 md:pt-20 md:pb-20" data-testid="customize-cake-header">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-primary/40 blur-[110px]" />
          <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-brand-bg blur-[90px]" />
        </div>
        <Container>
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Start Your Order", to: "/order" }, { label: "Customize Your Cake" }]} />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent">
            Made for your celebration
          </p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-dark sm:text-5xl lg:text-6xl">
            Customize Your Cake
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-text sm:text-lg">
            Answer a few quick questions. This helps us recommend the perfect cake for your celebration.
          </p>
        </Container>
      </section>

      <Section className="pt-10 md:pt-14">
        <Container className="max-w-3xl">
          {step <= TOTAL_STEPS && (
            <ProgressHeader step={step} />
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8"
            >
              {step === 1 && <Step1 state={state} set={set} errors={errors} />}
              {step === 2 && <Step2 state={state} set={set} errors={errors} />}
              {step === 3 && <Step3 state={state} set={set} errors={errors} />}
              {step === 4 && <Step4 state={state} set={set} errors={errors} />}
              {step === 5 && <Step5 state={state} set={set} errors={errors} />}
              {step === 6 && <Step6 state={state} set={set} errors={errors} />}
              {step === 7 && <Step7 state={state} set={set} errors={errors} />}
              {step === 8 && (
                <SummaryStep state={state} onEdit={() => setStep(1)} onSubmit={submitForm} submitting={submitting} />
              )}
              {step === 9 && (
                <SuccessStep state={state} submittedId={submittedId} onStartFresh={startFresh} onBack={() => navigate("/")} />
              )}
            </motion.div>
          </AnimatePresence>

          {step <= TOTAL_STEPS && (
            <StepNav
              step={step}
              onBack={step === 1 ? () => navigate(-1) : goBack}
              onNext={step === TOTAL_STEPS ? () => setStep(8) : goNext}
              nextLabel={step === TOTAL_STEPS ? "Review Summary" : "Continue"}
            />
          )}
        </Container>
      </Section>
    </MainLayout>
  );
}

// ─────────────────────────── Sub-components ─────────────────────────────

const ProgressHeader = ({ step }) => {
  const meta = STEP_META.find((m) => m.id === step) || STEP_META[0];
  return (
    <div className="rounded-3xl border border-brand-line bg-brand-bg p-5 shadow-[0_18px_50px_-28px_rgba(215,134,159,0.4)] md:p-6" data-testid="customize-cake-progress">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-accent">
          Step {step} of {TOTAL_STEPS}
        </p>
        <p className="text-xs font-semibold text-brand-text">
          {Math.round((step / TOTAL_STEPS) * 100)}%
        </p>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-brand-secondary">
        <motion.div
          initial={false}
          animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full bg-brand-accent"
        />
      </div>
      <div className="mt-4">
        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-brand-dark md:text-3xl">
          {meta.title}
        </h2>
        <p className="mt-1 text-sm text-brand-text">{meta.desc}</p>
      </div>
    </div>
  );
};

const StepNav = ({ step, onBack, onNext, nextLabel }) => (
  <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-line bg-brand-bg px-6 py-3 font-heading text-sm font-bold text-brand-dark transition-colors hover:border-brand-accent hover:text-brand-accent"
      data-testid="customize-cake-back"
    >
      <ArrowLeft size={16} /> Back
    </button>
    <button
      type="button"
      onClick={onNext}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-dark px-7 py-3 font-heading text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-brand-accent"
      data-testid="customize-cake-next"
    >
      {nextLabel} <ArrowRight size={16} />
    </button>
  </div>
);

const Step1 = ({ state, set, errors }) => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
    <TextInput
      id="firstName"
      label="First Name"
      required
      value={state.firstName}
      onChange={(e) => set({ firstName: e.target.value })}
      error={errors.firstName}
      autoComplete="given-name"
      placeholder="e.g. Ananya"
    />
    <TextInput
      id="lastName"
      label="Last Name"
      required
      value={state.lastName}
      onChange={(e) => set({ lastName: e.target.value })}
      error={errors.lastName}
      autoComplete="family-name"
      placeholder="e.g. Sharma"
    />
    <TextInput
      id="phone"
      label="Contact Number"
      required
      inputMode="tel"
      value={state.phone}
      onChange={(e) => set({ phone: e.target.value })}
      error={errors.phone}
      autoComplete="tel"
      placeholder="+91 98765 43210"
    />
    <TextInput
      id="email"
      label="Email Address"
      hint="Optional"
      type="email"
      value={state.email}
      onChange={(e) => set({ email: e.target.value })}
      error={errors.email}
      autoComplete="email"
      placeholder="you@example.com"
    />
  </div>
);

const Step2 = ({ state, set, errors }) => (
  <div className="grid grid-cols-1 gap-5">
    <SearchableDropdown
      id="occasion"
      label="What is the occasion?"
      required
      placeholder="Choose an occasion"
      options={OCCASIONS}
      value={state.occasion}
      onChange={(v) => set({ occasion: v, ...(v !== "Other" ? { otherOccasion: "" } : {}) })}
      error={errors.occasion}
    />
    {state.occasion === "Other" && (
      <TextInput
        id="otherOccasion"
        label="Please specify"
        required
        value={state.otherOccasion}
        onChange={(e) => set({ otherOccasion: e.target.value })}
        error={errors.otherOccasion}
        placeholder="Tell us the occasion"
      />
    )}
  </div>
);

const Step3 = ({ state, set, errors }) => (
  <div className="grid grid-cols-1 gap-5">
    <TextInput
      id="occasionDate"
      label="Date of Occasion"
      required
      type="date"
      value={state.occasionDate}
      onChange={(e) => set({ occasionDate: e.target.value })}
      error={errors.occasionDate}
    />
    <OptionGrid
      id="preferredTime"
      label="Preferred Delivery Time"
      required
      options={PREFERRED_TIMES}
      value={state.preferredTime}
      onChange={(v) => set({ preferredTime: v, ...(v !== "Custom Time" ? { customTime: "" } : {}) })}
      cols={4}
      error={errors.preferredTime}
    />
    {state.preferredTime === "Custom Time" && (
      <TextInput
        id="customTime"
        label="Custom Time"
        required
        type="time"
        value={state.customTime}
        onChange={(e) => set({ customTime: e.target.value })}
        error={errors.customTime}
      />
    )}
  </div>
);

const Step4 = ({ state, set, errors }) => (
  <OptionGrid
    id="peopleCount"
    label="How many people will the cake serve?"
    required
    options={GUEST_BUCKETS}
    value={state.peopleCount}
    onChange={(v) => set({ peopleCount: v })}
    cols={4}
    error={errors.peopleCount}
  />
);

const Step5 = ({ state, set, errors }) => (
  <div className="grid grid-cols-1 gap-5">
    <OptionGrid
      id="deliveryType"
      label="Delivery Method"
      required
      options={DELIVERY_TYPES}
      value={state.deliveryType}
      onChange={(v) => set({ deliveryType: v })}
      cols={2}
      error={errors.deliveryType}
    />

    {state.deliveryType === "Delivery" && (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextInput
          id="addressLine1"
          label="Address Line 1"
          required
          value={state.addressLine1}
          onChange={(e) => set({ addressLine1: e.target.value })}
          error={errors.addressLine1}
          placeholder="House / flat, street"
          containerClassName="sm:col-span-2"
        />
        <TextInput
          id="addressLine2"
          label="Address Line 2"
          value={state.addressLine2}
          onChange={(e) => set({ addressLine2: e.target.value })}
          placeholder="Area / apartment (optional)"
          containerClassName="sm:col-span-2"
        />
        <TextInput
          id="city"
          label="City"
          required
          value={state.city}
          onChange={(e) => set({ city: e.target.value })}
          error={errors.city}
        />
        <TextInput
          id="state"
          label="State"
          required
          value={state.state}
          onChange={(e) => set({ state: e.target.value })}
          error={errors.state}
        />
        <TextInput
          id="pincode"
          label="Pincode"
          required
          inputMode="numeric"
          value={state.pincode}
          onChange={(e) => set({ pincode: e.target.value })}
          error={errors.pincode}
        />
        <TextInput
          id="landmark"
          label="Landmark"
          value={state.landmark}
          onChange={(e) => set({ landmark: e.target.value })}
          placeholder="Optional"
        />
      </div>
    )}
  </div>
);

const Step6 = ({ state, set }) => (
  <div className="grid grid-cols-1 gap-5">
    <SearchableDropdown
      id="flavour"
      label="Cake Flavour"
      placeholder="Choose a flavour"
      options={FLAVOURS}
      value={state.flavour}
      onChange={(v) => set({ flavour: v })}
    />
    <OptionGrid
      id="shape"
      label="Cake Shape"
      options={SHAPES}
      value={state.shape}
      onChange={(v) => set({ shape: v })}
      cols={3}
    />
    <TextInput
      id="theme"
      label="Cake Theme / Design"
      value={state.theme}
      onChange={(e) => set({ theme: e.target.value })}
      placeholder="e.g. Rustic floral, pastel unicorn…"
    />
    <TextInput
      id="cakeMessage"
      label="Message on Cake"
      value={state.cakeMessage}
      onChange={(e) => set({ cakeMessage: e.target.value })}
      placeholder="e.g. Happy 30th, Priya!"
    />
    <ImageUploader
      id="reference-image"
      value={state.referenceImage}
      onChange={(v) => set({ referenceImage: v })}
    />
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-brand-line bg-brand-bg px-4 py-3" data-testid="eggless-toggle">
      <input
        type="checkbox"
        className="h-4 w-4 accent-[#D7869F]"
        checked={state.eggless}
        onChange={(e) => set({ eggless: e.target.checked })}
      />
      <div>
        <p className="text-sm font-bold text-brand-dark">Eggless</p>
        <p className="text-xs text-brand-text">Uncheck if you want the cake baked with eggs.</p>
      </div>
    </label>
  </div>
);

const Step7 = ({ state, set }) => (
  <div className="grid grid-cols-1 gap-5">
    <OptionGrid
      id="budget"
      label="Estimated Budget"
      options={BUDGETS}
      value={state.budget}
      onChange={(v) => set({ budget: v })}
      cols={2}
    />
    <TextArea
      id="notes"
      label="Additional Notes"
      hint="Optional"
      rows={5}
      value={state.notes}
      onChange={(e) => set({ notes: e.target.value })}
      placeholder="Anything else we should know?"
    />
  </div>
);

const SummaryStep = ({ state, onEdit, onSubmit, submitting }) => (
  <div className="flex flex-col gap-6">
    <div className="rounded-3xl border border-brand-line bg-brand-bg p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-accent">
        Final Step
      </p>
      <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-brand-dark md:text-3xl">
        Review your request
      </h2>
      <p className="mt-1 text-sm text-brand-text">
        Please double-check everything below. You can edit any step or send it straight to us on WhatsApp.
      </p>
    </div>

    <SummaryCard state={state} />

    <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-line bg-brand-bg px-6 py-3 font-heading text-sm font-bold text-brand-dark transition-colors hover:border-brand-accent hover:text-brand-accent"
        data-testid="summary-edit"
      >
        <ArrowLeft size={16} /> Edit
      </button>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => onSubmit({ afterOpenWhatsapp: false })}
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-dark px-6 py-3 font-heading text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-brand-accent disabled:opacity-60"
          data-testid="summary-submit"
        >
          {submitting ? "Sending…" : "Submit Request"} <Send size={16} />
        </button>
        <button
          type="button"
          onClick={() => onSubmit({ afterOpenWhatsapp: true })}
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-heading text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:brightness-95 disabled:opacity-60"
          data-testid="summary-whatsapp"
        >
          <MessageCircle size={16} /> Continue on WhatsApp
        </button>
      </div>
    </div>
  </div>
);

const SuccessStep = ({ state, submittedId, onStartFresh, onBack }) => (
  <div className="rounded-3xl border border-brand-line bg-brand-bg p-8 text-center md:p-12" data-testid="customize-cake-success">
    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-secondary text-brand-accent">
      <Check size={26} />
    </div>
    <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-brand-dark">
      Your request is with us
    </h2>
    <p className="mx-auto mt-3 max-w-xl text-sm text-brand-text md:text-base">
      Thanks {state.firstName || "there"}! We've saved your celebration brief
      {submittedId ? ` (ref #${String(submittedId).slice(-6).toUpperCase()})` : ""}. A member of our team will
      reach out shortly to confirm the details.
    </p>
    <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <button
        type="button"
        onClick={() => {
          const num = toWhatsappNumber(brand.phone);
          const msg = buildWhatsappMessage(state);
          window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
        }}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-heading text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:brightness-95"
        data-testid="success-whatsapp"
      >
        <MessageCircle size={16} /> Continue on WhatsApp
      </button>
      <Link
        to="/catalogue"
        className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-line bg-brand-bg px-6 py-3 font-heading text-sm font-bold text-brand-dark transition-colors hover:border-brand-accent hover:text-brand-accent"
      >
        Browse the catalogue
      </Link>
      <button
        type="button"
        onClick={onStartFresh}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent px-4 py-3 text-sm font-semibold text-brand-text transition-colors hover:text-brand-accent"
      >
        Start another request
      </button>
    </div>
  </div>
);
