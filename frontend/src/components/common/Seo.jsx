import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const SITE_URL = (process.env.REACT_APP_SITE_URL || "https://gharelubake.in").replace(/\/+$/, "");
export const SITE_NAME = "GHARELU.BAKE";
const DEFAULT_TITLE = "GHARELU.BAKE — Pure • Premium • Eggless";
const DEFAULT_DESCRIPTION =
  "GHARELU.BAKE — Pure, premium, 100% eggless cakes, pastries, cookies and festive gift hampers, freshly baked in Zirakpur.";
const DEFAULT_IMAGE = "/images/hero/diwali-hero-1.jpg";

const absolute = (value) => (/^https?:\/\//i.test(value) ? value : `${SITE_URL}${value.startsWith("/") ? "" : "/"}${value}`);

// Finds (or creates) a tag in <head>, so a page replaces the default tag instead of adding a second one.
function upsert(selector, create, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

const meta = (attr, name, content) =>
  upsert(`meta[${attr}="${name}"]`, () => {
    const el = document.createElement("meta");
    el.setAttribute(attr, name);
    return el;
  }, { content });

/**
 * Per-page search/share tags (title, description, canonical link, Open Graph, Twitter, robots, JSON-LD).
 * Renders nothing. Google runs the site's JavaScript, so these are what it indexes for each page; the
 * defaults in public/index.html are what crawlers that don't run JavaScript see. Leaving a page restores
 * the defaults, so a page without its own <Seo /> never shows the previous page's tags.
 *
 * @param {string} [title]       Page title; "| GHARELU.BAKE" is added. Omit for the home page title.
 * @param {string} [description] 50-160 characters read best in search results.
 * @param {string} [image]       Path or absolute URL of the share picture.
 * @param {string} [type]        Open Graph type: "website" (default), "product", "article"...
 * @param {boolean} [noindex]    Keep the page out of search results (checkout, tracking, ...).
 * @param {object|object[]} [jsonLd] schema.org data for this page.
 */
export default function Seo({ title, description = DEFAULT_DESCRIPTION, image = DEFAULT_IMAGE, type = "website", noindex = false, jsonLd }) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const url = `${SITE_URL}${pathname === "/" ? "/" : pathname.replace(/\/+$/, "")}`;
  const picture = absolute(image);
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    document.title = fullTitle;
    meta("name", "description", description);
    meta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    upsert('link[rel="canonical"]', () => {
      const el = document.createElement("link");
      el.setAttribute("rel", "canonical");
      return el;
    }, { href: url });

    meta("property", "og:type", type);
    meta("property", "og:site_name", SITE_NAME);
    meta("property", "og:locale", "en_IN");
    meta("property", "og:title", fullTitle);
    meta("property", "og:description", description);
    meta("property", "og:url", url);
    meta("property", "og:image", picture);
    meta("name", "twitter:card", "summary_large_image");
    meta("name", "twitter:title", fullTitle);
    meta("name", "twitter:description", description);
    meta("name", "twitter:image", picture);

    const old = document.head.querySelector('script[data-seo="page"]');
    if (old) old.remove();
    if (jsonLdText) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "page");
      script.text = jsonLdText;
      document.head.appendChild(script);
    }

    return () => {
      const page = document.head.querySelector('script[data-seo="page"]');
      if (page) page.remove();
      document.title = DEFAULT_TITLE;
      meta("name", "description", DEFAULT_DESCRIPTION);
      meta("name", "robots", "index, follow, max-image-preview:large");
    };
  }, [fullTitle, description, url, picture, type, noindex, jsonLdText]);

  return null;
}
