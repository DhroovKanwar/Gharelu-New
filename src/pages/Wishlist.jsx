import { useState } from "react";
import { Heart, ArrowRight } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import ProductCard from "../components/common/ProductCard";
import QuickViewModal from "../components/common/QuickViewModal";
import Button from "../components/common/Button";
import { useWishlist } from "../context/WishlistContext";

export default function Wishlist() {
  const { items, count } = useWishlist();
  const [quick, setQuick] = useState(null);

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Saved for later"
        title="Your Wishlist"
        subtitle={count > 0 ? `You've saved ${count} treat${count > 1 ? "s" : ""}. Ready when you are.` : "Save your favourite bakes here and come back to them any time."}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Wishlist" }]}
      />

      <Section>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-brand-secondary text-brand-accent">
              <Heart size={30} />
            </div>
            <p className="font-heading text-xl font-bold text-brand-dark">Your wishlist is empty</p>
            <p className="max-w-md text-brand-text">Tap the heart on any product to save it here for later.</p>
            <Button as="a" to="/catalogue" className="mt-2" icon={<ArrowRight size={18} />}>Browse Cakes</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} showWishlist onQuickView={setQuick} />
            ))}
          </div>
        )}
      </Section>

      <QuickViewModal product={quick} onClose={() => setQuick(null)} />
    </MainLayout>
  );
}
