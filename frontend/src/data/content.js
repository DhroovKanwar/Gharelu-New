/**
 * Central content for Gharelu.Bake.
 *
 * Collections (products, categories, testimonials, faqs, events, gallery,
 * corporate gifts, reviews, policies) live in JSON files and are re-exported
 * here so components import from a single, stable module. Brand config and a
 * few homepage-specific blocks remain inline.
 */
import productsData from "./products.json";
import categoriesData from "./categories.json";
import testimonialsData from "./testimonials.json";
import faqsData from "./faqs.json";
import eventsData from "./events.json";
import galleryData from "./gallery.json";
import corporateGiftsData from "./corporateGifts.json";
import reviewsData from "./reviews.json";
import policiesData from "./policies.json";

const px = (id, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const pxPng = (id, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.png?auto=compress&cs=tinysrgb&w=${w}`;
const un = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMG = {
  dessertTable: px("31266998", 1600),
  weddingCakes: px("29051739"),
  cupcakesPink: un("1622995706580-a332aed41cdf"),
  bakeryWindow: px("37798966"),
  chefIcing: un("1519733870-f96bef9bc85f"),
  macarons: pxPng("29647512"),
  pastry1: un("1578985545062-69928b1d9587"),
  pastry2: un("1565958011703-44f9829ba187"),
  donuts: un("1464349095431-e9a21285b5f3"),
  cinnamon: un("1486427944299-d1955d23e34d"),
  donutPink: un("1557925923-cd4648e211a0"),
  cakeSlice: un("1587668178277-295251f900ce"),
  cheesecake: un("1563729784474-d77dbb933a9e"),
  cupcakeTray: un("1535141192574-5d4897c12636"),
  cakeStudio: un("1488477181946-6428a0291777"),
  cupcakeRack: un("1509440159596-0249088772ff"),
  layerCake: px("1055272"),
  strawberryCake: px("2144112"),
  macaronsPink: px("587741"),
  cupcakesFrost: px("1721932"),
};

export const brand = {
  name: "Gharelu.Bake",
  tagline: "Pure • Premium • Eggless",
  phone: "+91 98765 43210",
  email: "hello@gharelu.bake",
  address: "14, Blossom Lane, Bandra West, Mumbai 400050",
  hours: "Tue – Sun · 9:00 AM – 9:00 PM",
  socials: [
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { label: "Pinterest", href: "https://pinterest.com", icon: "pinterest" },
    { label: "WhatsApp", href: "https://wa.me/919876543210", icon: "whatsapp" },
  ],
};

export const announcements = [
  "100% Eggless · Baked Fresh Daily",
  "Free Delivery on Orders Over ₹1500",
  "Same-Day Dispatch Before 12 PM",
  "Preservative-Free · Small Batch",
  "Custom Celebration Cakes on Order",
];

export const navLinks = [
  { label: "Cakes", href: "/catalogue" },
  { label: "About", href: "/about" },
  { label: "Corporate", href: "/corporate" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export const products = productsData;
export const featuredCakes = productsData.filter((p) => p.featured);

export const categories = categoriesData;

export const whyChooseUs = [
  {
    no: "01",
    title: "Purely Eggless",
    body: "Every recipe is crafted 100% eggless without ever compromising on the melt-in-mouth texture you expect from world-class patisserie.",
  },
  {
    no: "02",
    title: "Small-Batch Craft",
    body: "We bake in intimate batches each morning — no factory lines, no shortcuts. Just slow, deliberate hands and premium ingredients.",
  },
  {
    no: "03",
    title: "Pure Ingredients",
    body: "Belgian couverture, single-origin vanilla, real fruit and zero preservatives. If we would not eat it, we would not sell it.",
  },
  {
    no: "04",
    title: "Made With Warmth",
    body: "‘Gharelu’ means home. Each box leaves our kitchen carrying the warmth, love and care of a home-baked treat.",
  },
];

export const corporate = {
  title: "Corporate Gifting, Beautifully Boxed",
  body: "Curated hampers and bespoke branded confections that make your team and clients feel genuinely valued. Bulk pricing, custom packaging, and pan-city delivery.",
  image: IMG.dessertTable,
  points: [
    "Custom branded packaging & ribbons",
    "Volume pricing for 25+ boxes",
    "Dedicated gifting concierge",
    "Scheduled festive dispatch",
  ],
};

export const events = eventsData;

export const gallery = galleryData;

export const instagram = [
  { id: 1, image: IMG.cupcakesFrost, likes: 482 },
  { id: 2, image: IMG.donutPink, likes: 731 },
  { id: 3, image: IMG.pastry2, likes: 356 },
  { id: 4, image: IMG.cupcakeRack, likes: 908 },
  { id: 5, image: IMG.macaronsPink, likes: 612 },
  { id: 6, image: IMG.strawberryCake, likes: 1204 },
];

export const testimonials = testimonialsData;

export const faqs = faqsData;

export const reviews = reviewsData;
export const corporateGifts = corporateGiftsData;
export const policies = policiesData;

export const footerLinks = [
  {
    heading: "Explore",
    links: [
      { label: "Cake Catalogue", href: "/catalogue" },
      { label: "Corporate Gifting", href: "/corporate" },
      { label: "Events", href: "/events" },
      { label: "Wishlist", href: "/wishlist" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Gallery", href: "/gallery" },
      { label: "Reviews", href: "/reviews" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund Policy", href: "/refund" },
    ],
  },
];
