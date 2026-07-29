import { motion } from "framer-motion";
import MainLayout from "../layouts/MainLayout";
import Button from "../components/common/Button";
import { ArrowLeft, Cake } from "lucide-react";

export default function NotFound() {
  return (
    <MainLayout>
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-24" data-testid="notfound-page">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary/30 blur-[120px]" />
        </div>
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mb-8 grid h-20 w-20 place-items-center rounded-full bg-brand-secondary text-brand-accent"
          >
            <Cake size={34} />
          </motion.div>
          <p className="font-heading text-[7rem] font-extrabold leading-none tracking-tighter text-brand-dark sm:text-[10rem]">404</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            This page has crumbled away
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-brand-text">
            The page you're looking for isn't on the menu. Let's get you back to something sweet.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button as="a" to="/" icon={<ArrowLeft size={18} />}>Back Home</Button>
            <Button as="a" to="/catalogue" variant="outline">Browse Cakes</Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
