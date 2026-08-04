/**
 * Hero configuration — API-ready service layer.
 *
 * The Hero UI reads only from `getActiveHero()`. When the Laravel backend is
 * ready, replace this function body with:
 *
 *   const { data } = await http.get("/hero-config");
 *   return pick(data);
 *
 * No component code needs to change.
 */
import heroData from "../data/hero.json";

/**
 * Return the currently-active hero variant (image + optional campaign).
 * Falls back to the first variant if `active` doesn't match anything.
 *
 * Shape:
 *  {
 *    id: string,
 *    image: string,
 *    alt: string,
 *    campaign: null | {
 *      label: string,     // short pill title, e.g. "Diwali Special"
 *      line:  string,     // one-liner sub-copy, e.g. "20% off hampers"
 *      cta_href?: string, // optional CTA URL
 *      cta_label?: string // optional CTA button label
 *    }
 *  }
 */
export const getActiveHero = () => {
  const variants = Array.isArray(heroData.variants) ? heroData.variants : [];
  const activeId = heroData.active;
  const match = variants.find((v) => v.id === activeId);
  const chosen = match || variants[0];
  if (!chosen) {
    return { id: "default", image: null, alt: "", campaign: null };
  }
  return {
    id: chosen.id,
    image: chosen.image,
    alt: chosen.alt || "",
    campaign: chosen.campaign || null,
  };
};

/**
 * Return all available variants — useful for a future admin panel screen
 * where the bakery team picks which variant is live.
 */
export const listHeroVariants = () => (Array.isArray(heroData.variants) ? heroData.variants : []);

export const _plannedEndpoints = {
  get: "GET /api/hero-config",
  update: "PATCH /api/hero-config",
};
