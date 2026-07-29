import useLenis from "../hooks/useLenis";
import AnnouncementBar from "../components/sections/AnnouncementBar";
import Navbar from "../components/sections/Navbar";
import Footer from "../components/sections/Footer";

/**
 * Global chrome: smooth scroll + announcement + navbar + footer.
 */
export const MainLayout = ({ children }) => {
  useLenis();
  return (
    <div className="min-h-screen bg-brand-bg">
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
