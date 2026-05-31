/**
 * TypeScript interfaces for landing page static content
 * Feature: landing-page-ui-redesign
 */

/**
 * Feature card data structure
 * Used in FeaturesSection to render the six key features
 */
export interface Feature {
  /** Emoji or lucide icon name */
  icon: string;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Hex color from Color_Palette for accent elements */
  accentColor: string;
  /** Pre-computed SVG path for organic blob container */
  blobPath: string;
}

/**
 * How-it-works step data structure
 * Used in HowItWorksSection to render the three-step walkthrough
 */
export interface Step {
  /** Step number as string: "01" | "02" | "03" */
  num: string;
  /** Step title */
  title: string;
  /** Step description */
  desc: string;
}

/**
 * Testimonial card data structure
 * Used in TestimonialsSection to render user quotes
 */
export interface Testimonial {
  /** User name */
  name: string;
  /** User role or title */
  role: string;
  /** Testimonial quote text */
  quote: string;
  /** Hex color from Color_Palette for card border */
  borderColor: string;
}
