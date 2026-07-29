/**
 * Central dummy content for Gharelu.Bake.
 * Everything here mirrors the shape a real API would return, so the
 * `services/api.js` layer can be swapped to live endpoints with zero
 * component changes.
 */

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
  { label: "Cakes", href: "#featured" },
  { label: "Categories", href: "#categories" },
  { label: "Corporate", href: "#corporate" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#location" },
];

export const featuredCakes = [
  {
    id: "belgian-truffle",
    name: "Belgian Dark Truffle",
    category: "Signature",
    price: 1499,
    image: IMG.cakeSlice,
    tag: "Bestseller",
    description: "Silken 70% Belgian ganache layered over cloud-soft sponge.",
  },
  {
    id: "rose-pistachio",
    name: "Rose & Pistachio",
    category: "Celebration",
    price: 1699,
    image: IMG.layerCake,
    tag: "New",
    description: "Persian rose cream, slow-roasted pistachio, gold leaf finish.",
  },
  {
    id: "strawberry-cloud",
    name: "Strawberry Cloud",
    category: "Fresh Fruit",
    price: 1299,
    image: IMG.strawberryCake,
    tag: "Seasonal",
    description: "Whipped vanilla chantilly folded with hand-picked berries.",
  },
  {
    id: "salted-caramel",
    name: "Salted Caramel Gateau",
    category: "Signature",
    price: 1599,
    image: IMG.pastry1,
    tag: "Loved",
    description: "Burnt-butter caramel, sea salt flakes, honeycomb shards.",
  },
];

export const categories = [
  { id: "signature-cakes", name: "Signature Cakes", count: 24, image: IMG.weddingCakes, span: "lg:col-span-2 lg:row-span-2" },
  { id: "cupcakes", name: "Cupcakes", count: 18, image: IMG.cupcakesPink, span: "" },
  { id: "macarons", name: "Macarons", count: 12, image: IMG.macaronsPink, span: "" },
  { id: "artisan-breads", name: "Artisan Breads", count: 9, image: IMG.cinnamon, span: "lg:col-span-2" },
];

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

export const events = [
  { id: 1, date: "24 Dec", title: "Christmas Yule Log Workshop", tag: "Workshop", desc: "Hands-on masterclass with our head pâtissier." },
  { id: 2, date: "31 Dec", title: "New Year Dessert Grazing Table", tag: "Catering", desc: "Bespoke grazing tables for private soirées." },
  { id: 3, date: "14 Feb", title: "Valentine’s Patisserie Box", tag: "Seasonal", desc: "Limited edition rose & raspberry collection." },
  { id: 4, date: "08 Mar", title: "High-Tea Pairing Evening", tag: "Event", desc: "An intimate evening of pastry & artisan tea." },
];

export const gallery = [
  { id: 1, image: IMG.chefIcing, w: "tall" },
  { id: 2, image: IMG.macarons, w: "wide" },
  { id: 3, image: IMG.cupcakeTray, w: "" },
  { id: 4, image: IMG.donuts, w: "" },
  { id: 5, image: IMG.cakeStudio, w: "wide" },
  { id: 6, image: IMG.cheesecake, w: "tall" },
];

export const instagram = [
  { id: 1, image: IMG.cupcakesFrost, likes: 482 },
  { id: 2, image: IMG.donutPink, likes: 731 },
  { id: 3, image: IMG.pastry2, likes: 356 },
  { id: 4, image: IMG.cupcakeRack, likes: 908 },
  { id: 5, image: IMG.macaronsPink, likes: 612 },
  { id: 6, image: IMG.strawberryCake, likes: 1204 },
];

export const testimonials = [
  {
    id: 1,
    name: "Ananya Mehta",
    role: "Bride, Mumbai",
    quote:
      "The most exquisite eggless wedding cake we could have dreamed of. Guests could not believe it was eggless — pure magic.",
    rating: 5,
  },
  {
    id: 2,
    name: "Rohan Kapoor",
    role: "Head of People, Fintech Co.",
    quote:
      "Our clients still talk about the festive hampers. Impeccable packaging and flavour that feels genuinely premium.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sara D’Souza",
    role: "Home Celebrations",
    quote:
      "Every birthday now comes from Gharelu.Bake. It truly tastes home-made in the best possible way. Warm and beautiful.",
    rating: 5,
  },
];

export const faqs = [
  {
    q: "Is everything really 100% eggless?",
    a: "Yes — every single item we bake is completely eggless. Our recipes are developed from the ground up so texture and taste are never compromised.",
  },
  {
    q: "How far in advance should I order a custom cake?",
    a: "We recommend 48–72 hours for custom celebration cakes. Signature cakes and boxes are often available for same-day dispatch before 12 PM.",
  },
  {
    q: "Do you use preservatives?",
    a: "Never. We bake in small batches daily using premium, natural ingredients. This is why we recommend enjoying our bakes fresh within 2–3 days.",
  },
  {
    q: "Which areas do you deliver to?",
    a: "We currently deliver across Mumbai with pan-city dispatch for corporate and bulk gifting orders. Reach out for custom locations.",
  },
  {
    q: "Can you accommodate allergies?",
    a: "Absolutely. We offer nut-free, gluten-conscious and vegan options on request. Do mention your requirements while ordering.",
  },
];

export const footerLinks = [
  {
    heading: "Explore",
    links: [
      { label: "Signature Cakes", href: "#featured" },
      { label: "Categories", href: "#categories" },
      { label: "Corporate Gifting", href: "#corporate" },
      { label: "Events", href: "#events" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Our Story", href: "#why" },
      { label: "Gallery", href: "#gallery" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact", href: "#location" },
      { label: "Delivery Info", href: "#faq" },
      { label: "Order Tracking", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
];
