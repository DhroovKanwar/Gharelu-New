import useLenis from "../hooks/useLenis";
import AnnouncementBar from "../components/sections/AnnouncementBar";
import Navbar from "../components/sections/Navbar";
import Footer from "../components/sections/Footer";
import CartDrawer from "../components/sections/CartDrawer";
import FloatingOrderCTA from "../components/FloatingOrderCTA";
import ChatWidget from '../components/chat/ChatWidget'

/**
 * Global chrome: smooth scroll + announcement + navbar + cart drawer + footer.
 */
export const MainLayout = ({ children }) => {
  useLenis();
  return (
    <div className="min-h-screen bg-brand-bg">
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <FloatingOrderCTA />
      <ChatWidget />
    </div>
  );
};

export default MainLayout;
