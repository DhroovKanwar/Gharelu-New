import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Truck, Store, Gift, ShoppingBasket, ArrowRight, Cake } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import Container from "../components/common/Container";
import Breadcrumb from "../components/common/Breadcrumb";
import { useOrder } from "../context/OrderContext";
import { cn } from "../utils/cn";

const primaryCardBase =
  "group relative flex aspect-[5/4] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-brand-line bg-brand-primary/60 p-4 shadow-[0_18px_50px_-24px_rgba(215,134,159,0.45)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-24px_rgba(215,134,159,0.6)] sm:aspect-[6/5] sm:p-6 md:aspect-[16/10] md:p-7 lg:aspect-[16/9] lg:p-8";

const PrimaryCard = ({ icon: Icon, title, to, onClick, index, testid }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 + index * 0.08 }}
    className="h-full"
  >
    <Link
      to={to}
      onClick={onClick}
      className={primaryCardBase}
      data-testid={testid}
    >
      <div className="flex flex-1 items-center justify-center">
        <motion.span
          whileHover={{ rotate: -6, scale: 1.06 }}
          transition={{ type: "spring", stiffness: 300, damping: 12 }}
          className="grid h-20 w-20 place-items-center rounded-full bg-white/70 text-brand-dark shadow-sm sm:h-24 sm:w-24 md:h-28 md:w-28"
        >
          <Icon className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14" strokeWidth={1.6} />
        </motion.span>
      </div>
      <div className="flex items-end justify-between">
        <h3 className="font-heading text-xl font-extrabold tracking-tight text-brand-dark sm:text-2xl md:text-3xl">
          {title}
        </h3>
        <ArrowRight className="h-5 w-5 shrink-0 text-brand-dark opacity-70 transition-transform duration-500 group-hover:translate-x-1 group-hover:opacity-100 sm:h-6 sm:w-6" />
      </div>
    </Link>
  </motion.div>
);

const SecondaryRow = ({ icon: Icon, title, to, index, testid }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.25 + index * 0.08 }}
  >
    <Link
      to={to}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border border-brand-line bg-brand-bg px-4 py-4 shadow-[0_10px_30px_-20px_rgba(215,134,159,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-accent hover:shadow-[0_18px_45px_-20px_rgba(215,134,159,0.55)] sm:px-5 sm:py-5",
      )}
      data-testid={testid}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-secondary text-brand-accent transition-colors duration-300 group-hover:bg-brand-accent group-hover:text-white sm:h-12 sm:w-12">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
      </span>
      <p className="flex-1 font-heading text-base font-extrabold tracking-tight text-brand-dark sm:text-lg">
        {title}
      </p>
      <ArrowRight className="h-5 w-5 shrink-0 text-brand-accent opacity-0 transition-all duration-300 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100" />
    </Link>
  </motion.div>
);

export default function StartOrder() {
  const navigate = useNavigate();
  const { setMode } = useOrder();

  return (
    <MainLayout>
      {/* Compact local page header — page-scoped so global PageHeader is untouched */}
      <section className="relative overflow-hidden bg-brand-secondary pt-6 pb-4 md:pt-10 md:pb-6" data-testid="page-header">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-primary/40 blur-[100px]" />
          <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-brand-bg blur-[80px]" />
        </div>
        <Container>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Start Your Order" }]} />
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => navigate(-1)}
            className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-brand-dark transition-colors hover:text-brand-accent md:text-sm"
            data-testid="start-order-back"
          >
            <ArrowLeft size={14} /> Back
          </motion.button>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 font-heading text-3xl font-extrabold leading-[1.05] tracking-tight text-brand-dark sm:text-4xl md:text-5xl"
          >
            Start an Order
          </motion.h1>
        </Container>
      </section>

      <section className="bg-brand-bg pb-14 pt-5 md:pb-20 md:pt-8">
        <Container>
          {/* Primary cards — two-up on ALL breakpoints, per reference */}
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-5 md:gap-6">
            <PrimaryCard
              index={0}
              icon={Truck}
              title="Delivery"
              to="/catalogue"
              onClick={() => setMode("delivery")}
              testid="option-delivery"
            />
            <PrimaryCard
              index={1}
              icon={Store}
              title="Pickup"
              to="/catalogue"
              onClick={() => setMode("pickup")}
              testid="option-pickup"
            />
          </div>

          {/* Secondary compact rows */}
          <div className="mx-auto mt-3 grid max-w-5xl grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-5 md:mt-6 md:gap-6">
            <SecondaryRow
              index={0}
              icon={Gift}
              title="Corporate Gifting"
              to="/corporate"
              testid="option-corporate"
            />
            <SecondaryRow
              index={1}
              icon={ShoppingBasket}
              title="Gift Hampers"
              to="/hampers"
              testid="option-hampers"
            />
          </div>

          {/* Customize Your Cake — full-width tertiary card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="mx-auto mt-3 max-w-5xl sm:mt-5 md:mt-6"
          >
            <Link
              to="/customize-cake"
              className="group flex items-center gap-4 rounded-2xl border border-brand-line bg-brand-bg px-4 py-4 shadow-[0_10px_30px_-20px_rgba(215,134,159,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-accent hover:shadow-[0_18px_45px_-20px_rgba(215,134,159,0.55)] sm:gap-5 sm:px-6 sm:py-5"
              data-testid="option-customize-cake"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-secondary text-brand-accent transition-colors duration-300 group-hover:bg-brand-accent group-hover:text-white sm:h-12 sm:w-12">
                <Cake className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-base font-extrabold tracking-tight text-brand-dark sm:text-lg">
                  Customize Your Cake
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-brand-text sm:text-sm">
                  Tell us about your celebration and we'll recommend the perfect cake.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-brand-accent opacity-0 transition-all duration-300 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          </motion.div>
        </Container>
      </section>
    </MainLayout>
  );
}
