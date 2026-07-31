import MainLayout from "../layouts/MainLayout";
import Hero from "../components/sections/Hero";
import FeaturedCakes from "../components/sections/FeaturedCakes";
import EditorialMarquee from "../components/sections/EditorialMarquee";
import Categories from "../components/sections/Categories";
import WhyChooseUs from "../components/sections/WhyChooseUs";
import CorporateGifting from "../components/sections/CorporateGifting";
import Events from "../components/sections/Events";
import GalleryPreview from "../components/sections/GalleryPreview";
import InstagramFeed from "../components/sections/InstagramFeed";
import Testimonials from "../components/sections/Testimonials";
import FAQ from "../components/sections/FAQ";
import Newsletter from "../components/sections/Newsletter";
import Location from "../components/sections/Location";
import FloatingOrderCTA from "../components/FloatingOrderCTA";

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <FeaturedCakes />
      <EditorialMarquee />
      <Categories />
      <WhyChooseUs />
      <CorporateGifting />
      <Events />
      <GalleryPreview />
      <InstagramFeed />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <Location />
      <FloatingOrderCTA />
    </MainLayout>
  );
}
