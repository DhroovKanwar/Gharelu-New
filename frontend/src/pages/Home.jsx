import MainLayout from "../layouts/MainLayout";
import Hero from "../components/sections/Hero";
import HampersShowcase from "../components/sections/HampersShowcase";
import FeaturedCakes from "../components/sections/FeaturedCakes";
import EditorialMarquee from "../components/sections/EditorialMarquee";
import WhyChooseUs from "../components/sections/WhyChooseUs";
import CorporateGifting from "../components/sections/CorporateGifting";
import GalleryPreview from "../components/sections/GalleryPreview";
import InstagramFeed from "../components/sections/InstagramFeed";
import Testimonials from "../components/sections/Testimonials";
import FAQ from "../components/sections/FAQ";
import Newsletter from "../components/sections/Newsletter";

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <HampersShowcase />
      <FeaturedCakes />
      <EditorialMarquee />
      <WhyChooseUs />
      <CorporateGifting />
      <GalleryPreview />
      <InstagramFeed />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </MainLayout>
  );
}
