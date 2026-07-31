import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Heart } from "lucide-react";
import { navLinks, brand } from "../../data/content";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import Button from "../common/Button";
import { cn } from "../../utils/cn";

const Wordmark = ({ className }) => (
  <Link to="/" className={cn("font-heading font-extrabold tracking-tight", className)} data-testid="logo">
    <span style={{ color: '#000000' }}>GHARELU</span>
    <span style={{ color: '#000000' }}>.BAKE</span>
  </Link>
);

const IconButton = ({ onClick, to, label, count, children, testid }) => {
  const inner = (
    <span className="relative grid h-11 w-11 place-items-center rounded-full border border-brand-line text-brand-dark transition-colors hover:border-brand-accent hover:text-brand-accent">
      {children}
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-brand-accent px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </span>
  );
  return to ? (
    <Link to={to} aria-label={label} data-testid={testid}>{inner}</Link>
  ) : (
    <button onClick={onClick} aria-label={label} data-testid={testid}>{inner}</button>
  );
};

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count, openCart } = useCart();
  const wishlist = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={cn(
        "sticky top-0 z-[1000] w-full transition-all duration-500",
        scrolled
          ? "border-b border-brand-line/70 bg-brand-bg/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
      data-testid="navbar"
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        <Wordmark className="text-xl md:text-2xl" />

        <div className="hidden items-center gap-9 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              className="group relative text-sm font-medium text-brand-dark transition-colors hover:text-brand-accent"
              data-testid={`nav-link-${l.label.toLowerCase()}`}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <IconButton to="/wishlist" label="Wishlist" count={wishlist.count} testid="nav-wishlist">
            <Heart size={18} />
          </IconButton>
          <IconButton onClick={openCart} label="Cart" count={count} testid="nav-cart">
            <ShoppingBag size={18} />
          </IconButton>
          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-brand-line text-brand-dark lg:hidden"
            onClick={() => setOpen((v) => !v)}
            data-testid="mobile-menu-toggle"
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-brand-line bg-brand-bg lg:hidden"
            data-testid="mobile-menu"
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 font-heading text-lg font-semibold text-brand-dark transition-colors hover:bg-brand-secondary"
                >
                  {l.label}
                </Link>
              ))}
              <p className="mt-4 px-4 text-sm text-brand-text">{brand.phone}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export { Wordmark };
export default Navbar;
