import { Variants, useReducedMotion } from "framer-motion";

// Entrance animation: opacity + y slide
export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Scroll section heading: slightly larger y offset
export const headingVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Scroll section body: smaller y offset, 60ms delay after heading
export const bodyVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.06 },
  },
};

// Stagger container for feature cards (80ms between children)
export const featureContainerVariant: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

// Stagger container for testimonial cards (100ms between children)
export const testimonialContainerVariant: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// Individual card child variant
export const cardVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Reduced-motion override: simple opacity fade, 200ms
export const reducedMotionVariant: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

// Spring config for micro-interactions
export const springTransition = { type: "spring" as const, stiffness: 300, damping: 20 };

/**
 * Hook that returns the appropriate animation variant based on user's motion preferences.
 * Returns reducedMotionVariant when user prefers reduced motion, otherwise returns the provided normalVariant.
 * 
 * @param normalVariant - The standard animation variant to use when reduced motion is not preferred
 * @returns The appropriate variant based on user's motion preferences
 */
export function useAnimationVariants(normalVariant: Variants): Variants {
  const prefersReduced = useReducedMotion();
  return prefersReduced ? reducedMotionVariant : normalVariant;
}
