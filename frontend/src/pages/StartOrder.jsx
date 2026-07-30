import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Truck, Store, Gift, ShoppingBasket } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import Container from "../components/common/Container";
import OrderOptionCard from "../components/common/OrderOptionCard";
import { useOrder } from "../context/OrderContext";

export default function StartOrder() {
  const navigate = useNavigate();
  const { setMode } = useOrder();

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Let's Begin"
        title="Start Your Order"
        subtitle="Choose how you'd like to order from GHARELU.BAKE."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Start Your Order" }]}
      />

      <Section className="pt-6 md:pt-10">
        <Container className="px-0">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-dark transition-colors hover:text-brand-accent md:mb-8"
            data-testid="start-order-back"
          >
            <ArrowLeft size={16} /> Back
          </motion.button>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
            <OrderOptionCard
              index={0}
              variant="soft"
              icon={Truck}
              title="Delivery"
              description="Freshly baked cakes delivered straight to your doorstep, in signature packaging."
              buttonLabel="Order for Delivery"
              to="/catalogue"
              onClick={() => setMode("delivery")}
              testid="option-delivery"
            />
            <OrderOptionCard
              index={1}
              variant="soft"
              icon={Store}
              title="Pickup"
              description="Collect your order fresh from our GHARELU.BAKE flagship outlet at your convenience."
              buttonLabel="Order for Pickup"
              to="/catalogue"
              onClick={() => setMode("pickup")}
              testid="option-pickup"
            />
            <OrderOptionCard
              index={2}
              icon={Gift}
              title="Corporate Gifting"
              description="Premium gifting solutions for offices, businesses and bulk celebrations."
              buttonLabel="Explore Corporate Gifting"
              to="/corporate"
              buttonVariant="outline"
              testid="option-corporate"
            />
            <OrderOptionCard
              index={3}
              icon={ShoppingBasket}
              title="Gift Hampers"
              description="Beautiful festive hampers and curated gift collections for every celebration."
              buttonLabel="Explore Hampers"
              to="/hampers"
              buttonVariant="outline"
              testid="option-hampers"
            />
          </div>
        </Container>
      </Section>
    </MainLayout>
  );
}
