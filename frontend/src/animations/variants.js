/**
 * Shared Framer Motion animation variants.
 * Reusable across all sections for consistent, premium motion.
 */

export const EASE_LUX = [0.16, 1, 0.3, 1];
export const EASE_SOFT = [0.25, 0.1, 0.25, 1];

// Fade + rise in — the workhorse scroll reveal
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_LUX },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: EASE_SOFT } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: EASE_LUX },
  },
};

// Stagger container
export const stagger = (staggerChildren = 0.12, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
});

// Masked line reveal — the inner span rises from below the mask
export const maskLine = {
  hidden: { y: "115%" },
  visible: {
    y: "0%",
    transition: { duration: 1.05, ease: EASE_LUX },
  },
};

// Word-by-word for kinetic headings
export const maskWord = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.9, ease: EASE_LUX },
  },
};
