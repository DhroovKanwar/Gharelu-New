import { useState } from "react";
import useLenis from "../hooks/useLenis";
import AnnouncementBar from "../components/sections/AnnouncementBar";
import Navbar from "../components/sections/Navbar";
import Footer from "../components/sections/Footer";
import CartDrawer from "../components/sections/CartDrawer";
import FloatingOrderCTA from "../components/FloatingOrderCTA";
import FloatingContactWidget from "../components/FloatingContactWidget";
import ChatWidget from '../components/chat/ChatWidget'

/**
 * Global chrome: smooth scroll + announcement + navbar + cart drawer + footer.
 */
export const MainLayout = ({ children }) => {
  useLenis();
  // The contact widget's fan-out and the chat window both live in the same
  // bottom-right corner on mobile. Keeping them mutually exclusive here
  // stops the contact buttons from overlapping the chat bubble/window.
  const [openWidget, setOpenWidget] = useState(null); // "contact" | "chat" | null
  return (
    <div className="min-h-screen bg-brand-bg">
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <FloatingOrderCTA />
      <FloatingContactWidget
        forceClose={openWidget === "chat"}
        onOpenChange={(isOpen) => setOpenWidget(isOpen ? "contact" : null)}
      />
      <ChatWidget
        forceClose={openWidget === "contact"}
        onOpenChange={(isOpen) => setOpenWidget(isOpen ? "chat" : null)}
      />
    </div>
  );
};

export default MainLayout;
