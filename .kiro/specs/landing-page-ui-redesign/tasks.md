# Implementation Plan: Landing Page UI Redesign

## Overview

Refactor the Drawlify landing page from a single monolithic `page.tsx` into a set of focused component files, introduce a shared animation system, replace the static hero image with an animated inline SVG, apply an organic visual design language, and add property-based and unit tests for all 14 correctness properties. No new dependencies are required — the existing Next.js 16, React 19, TypeScript, Tailwind CSS v4, and Framer Motion v12 stack is sufficient.

## Tasks

- [x] 1. Set up shared animation system and types
  - [x] 1.1 Create `apps/frontend/components/motionVariants.ts` with all shared Framer Motion variant objects and the `useAnimationVariants` hook
    - Export `fadeUpVariant`, `headingVariant`, `bodyVariant`, `featureContainerVariant`, `testimonialContainerVariant`, `cardVariant`, `reducedMotionVariant`, and `springTransition` as described in the design
    - Export `useAnimationVariants(normalVariant)` hook that calls `useReducedMotion()` and returns `reducedMotionVariant` when true
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.7, 3.1, 3.2, 8.2_

  - [x] 1.2 Create `apps/frontend/types/landing.ts` with `Feature`, `Step`, and `Testimonial` TypeScript interfaces
    - Include `blobPath: string` on `Feature` for the pre-computed SVG blob path
    - _Requirements: 5.6_

  - [x] 1.3 Write property tests for animation config pure functions
    - Create `apps/frontend/__tests__/properties/animationConfig.property.test.ts`
    - Install `fast-check` as a dev dependency (`npm install --save-dev fast-check` in `apps/frontend`)
    - **Property 1: Step animation direction alternates by index** — test `getStepAnimationX(index)` returns -30 for even, 30 for odd across all non-negative integers
    - **Property 2: Scroll animation durations are within bounds** — test `isValidScrollTransition(duration, ease)` holds for all durations in [0.4, 0.7] with `easeOut`
    - **Validates: Requirements 1.4, 1.7**

- [x] 2. Implement `globals.css` additions
  - [x] 2.1 Add illustrated preview fallback CSS, feature card hover CSS, testimonial card border CSS, and focus ring styles to `apps/frontend/app/globals.css`
    - Add `.illustrated-preview-fallback { display: none; }` and `.illustrated-preview-svg:empty ~ .illustrated-preview-fallback { display: flex; }`
    - Add `.feature-card:hover { transform: translateY(-4px); box-shadow: 3px 7px 8px rgba(0,0,0,0.10), 6px 10px 12px rgba(0,0,0,0.06); transition: transform 200ms ease, box-shadow 200ms ease; }`
    - Add `.testimonial-card { border-color: rgba(var(--card-border-rgb), 0.3); transition: border-color 200ms ease; }` and `.testimonial-card:hover { border-color: rgba(var(--card-border-rgb), 1.0); }`
    - Add focus ring styles: `:focus-visible { outline: 2px solid #6c5ce7; outline-offset: 2px; }` ensuring 3:1 contrast against adjacent backgrounds
    - _Requirements: 3.3, 3.5, 4.7, 7.6_

- [x] 3. Implement `IllustratedPreview.tsx`
  - [x] 3.1 Create `apps/frontend/components/IllustratedPreview.tsx` as a `"use client"` component
    - Render an inline SVG with `viewBox="0 0 800 450"`, `role="img"`, and a `<title>` child element
    - Include four `<motion.path>` elements: freehand sketch stroke (`#6c5ce7`), shape outline (`#fdcb6e`), arrow connector (`#00b894`), and a `<motion.text>` label using Caveat font
    - Animate each path with `initial={{ pathLength: 0, opacity: 0 }}`, `animate={{ pathLength: 1, opacity: 1 }}`, staggered at 300ms intervals (delay: `index * 0.3`)
    - Wrap in a container with `rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)] bg-[#fdfbf7]` and `aspect-video` class
    - Render the fallback `<p className="illustrated-preview-fallback ...">Interactive whiteboard preview</p>` alongside the SVG
    - When `useReducedMotion()` is true, render all paths with `pathLength: 1` immediately and fade in the container with a 200ms opacity transition
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 7.7, 8.1, 8.4_

  - [x] 3.2 Write unit tests for `IllustratedPreview`
    - Create `apps/frontend/__tests__/landing/IllustratedPreview.test.tsx`
    - Test: renders an `<svg>` element with `role="img"` and a `<title>` child
    - Test: fallback paragraph is present in the DOM
    - Test: each `<motion.path>` has `pathLength` animation props with correct stagger delays (0, 0.3, 0.6)
    - Test: when `useReducedMotion` returns true, paths render with `pathLength: 1` and no stagger
    - _Requirements: 4.4, 4.7, 7.7_

- [x] 4. Implement `Navbar.tsx`
  - [x] 4.1 Create `apps/frontend/components/Navbar.tsx` as a `"use client"` component
    - Apply frosted-glass background: `bg-[#fdfbf7]/80 backdrop-blur-[12px]`
    - Wrap each nav link in a `<span>` with a CSS `::after` pseudo-element that animates `scaleX` from 0 to 1 on hover via a 200ms ease transition
    - Wrap "Start Drawing" button in `<motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={springTransition}>`
    - Implement mobile menu with `<AnimatePresence>` and `<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>`
    - Add `aria-label="Toggle navigation menu"` and `aria-expanded={open}` to the hamburger button
    - When `useReducedMotion()` is true, set `whileHover={{}}` and `whileTap={{}}` on all motion elements
    - _Requirements: 3.4, 3.6, 3.7, 6.5, 7.2, 7.3, 7.4, 8.1, 8.2_

  - [x] 4.2 Write unit tests for `Navbar`
    - Create `apps/frontend/__tests__/landing/Navbar.test.tsx`
    - Test: frosted glass classes are applied to the nav element
    - Test: hamburger button has `aria-label` and `aria-expanded` attributes
    - Test: mobile menu animates open/closed with correct initial/animate/exit props
    - Test: "Start Drawing" button has `whileHover={{ scale: 1.03 }}` and `whileTap={{ scale: 0.96 }}`
    - Test: when `useReducedMotion` returns true, `whileHover` and `whileTap` are `{}`
    - _Requirements: 3.6, 3.7, 6.5, 7.2, 7.3, 7.4_

- [x] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement `HeroSection.tsx`
  - [x] 6.1 Create `apps/frontend/components/HeroSection.tsx` as a `"use client"` component
    - Render badge, h1, subtext, and CTA buttons each as `<motion.div>` / `<motion.h1>` with `initial="hidden"` and `animate="show"` using `fadeUpVariant` with explicit delay overrides: badge 0ms, h1 100ms, subtext 200ms, CTAs 300ms, `IllustratedPreview` 500ms
    - Render at least four floating `<motion.div>` shapes with `aria-hidden="true"`, absolute positioning, opacity between 0.15–0.4, sizes between 40–200px, looping `y` oscillation with unique delays between 0–2s and durations between 4–12s
    - Wrap CTA buttons in `<motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={springTransition}>`
    - Apply `useReducedMotion()` to disable `whileHover`, `whileTap`, and looping animations when true
    - Apply h1 font sizes: `text-[5rem]` on mobile, `md:text-[7rem]` on desktop, `leading-[0.95]`
    - Import and render `<IllustratedPreview />` in place of the `<img src="/canvas-preview.png">` element
    - _Requirements: 1.1, 2.1, 2.2, 2.4, 2.5, 2.6, 3.1, 3.2, 3.7, 4.1, 6.2, 6.3, 7.4, 8.1, 8.2_

  - [x] 6.2 Write unit tests for `HeroSection`
    - Create `apps/frontend/__tests__/landing/HeroSection.test.tsx`
    - Test: renders at least 4 floating shapes, each with `aria-hidden="true"`
    - Test: entrance animation delays are in correct sequence (0, 0.1, 0.2, 0.3, 0.5)
    - Test: CTA buttons have `whileHover={{ scale: 1.04 }}` and `whileTap={{ scale: 0.96 }}`
    - Test: `IllustratedPreview` is rendered (no `<img src="/canvas-preview.png">`)
    - Test: when `useReducedMotion` returns true, looping animations and micro-interactions are disabled
    - _Requirements: 1.1, 2.1, 3.1, 3.2, 3.7, 4.1_

  - [x] 6.3 Write property tests for floating shape configuration
    - Create `apps/frontend/__tests__/properties/shapeConfig.property.test.ts`
    - **Property 3: Floating shape animation delays are within bounds** — test `isValidShapeDelay(delay)` for all delays in [0, 2]
    - **Property 4: Floating shape opacity is within bounds** — test `isValidShapeOpacity(opacity)` for all opacities in [0.15, 0.4]
    - **Property 5: Floating shape dimensions are within bounds** — test `isValidShapeSize(size)` for all sizes in [40, 200]
    - **Validates: Requirements 2.4, 2.5, 2.6**

- [x] 7. Implement `FeaturesSection.tsx`
  - [x] 7.1 Create `apps/frontend/components/FeaturesSection.tsx` as a `"use client"` component
    - Define the six `Feature` objects using the `Feature` interface, each with a pre-computed `blobPath` SVG string
    - Render each feature card with `style={{ borderRadius: "12px 4px 16px 8px" }}` and `style={{ boxShadow: "3px 3px 0px rgba(0,0,0,0.06), 6px 6px 0px rgba(0,0,0,0.04)" }}`
    - Apply `className="feature-card"` to each card to pick up the hover CSS from `globals.css`
    - Render each icon inside an SVG blob container: a `<svg viewBox="0 0 100 100">` with a `<path>` filled with the feature's accent color at 15% opacity, icon rendered on top via absolute positioning
    - Use `featureContainerVariant` on the grid container with `whileInView` and `viewport={{ once: true, amount: 0.2 }}`
    - Use `cardVariant` on each card child
    - Apply `bg-[#f5f1eb]` to card backgrounds
    - _Requirements: 1.3, 3.3, 5.1, 5.2, 5.5, 5.6, 8.1_

  - [x] 7.2 Write unit tests for `FeaturesSection`
    - Create `apps/frontend/__tests__/landing/FeaturesSection.test.tsx`
    - Test: renders exactly 6 feature cards
    - Test: each card has `bg-[#f5f1eb]` background class
    - Test: each card has a blob SVG icon container (not a plain square/rectangle)
    - Test: stagger container uses 80ms (`staggerChildren: 0.08`) delay
    - _Requirements: 1.3, 5.5, 5.6_

  - [x] 7.3 Write property tests for feature card styles
    - Create `apps/frontend/__tests__/properties/cardStyle.property.test.ts`
    - **Property 6: Feature card border radii are asymmetric** — test `hasAsymmetricBorderRadius(borderRadius)` for all valid 4-corner radius strings where adjacent corners differ
    - **Property 7: Feature cards have multi-layer box shadows** — test `hasMultiLayerShadow(boxShadow)` for all box-shadow strings with at least two comma-separated layers
    - **Validates: Requirements 5.1, 5.2**

- [x] 8. Implement `HowItWorksSection.tsx`
  - [x] 8.1 Create `apps/frontend/components/HowItWorksSection.tsx` as a `"use client"` component
    - Render three step cards in a vertical flex column
    - Between each pair of steps, render a `<svg width="2" height="48" aria-hidden="true">` with a `<line>` using `stroke="#6c5ce7"`, `strokeWidth="2"`, `strokeDasharray="4 4"`
    - Render each step number as a large decorative `<span>` with `aria-hidden="true"`, Caveat font, `opacity: 0.15`, `color: "#6c5ce7"`, positioned absolutely behind step content
    - Apply alternating slide-in animation: even-index steps from `x: -30`, odd-index from `x: 30`, both to `x: 0` with `viewport={{ once: true, amount: 0.2 }}`
    - Apply asymmetric border radius to each step card
    - _Requirements: 1.4, 1.6, 1.7, 5.3, 5.4, 8.1_

  - [x] 8.2 Write unit tests for `HowItWorksSection`
    - Create `apps/frontend/__tests__/landing/HowItWorksSection.test.tsx`
    - Test: renders exactly 2 SVG dashed connector lines between 3 steps
    - Test: connector lines use `strokeDasharray` attribute
    - Test: step numerals have `aria-hidden="true"` and opacity in [0.1, 0.25]
    - Test: even-index steps have `initial.x === -30`, odd-index steps have `initial.x === 30`
    - _Requirements: 1.4, 5.3, 5.4_

- [x] 9. Implement `TestimonialsSection.tsx`
  - [x] 9.1 Create `apps/frontend/components/TestimonialsSection.tsx` as a `"use client"` component
    - Define three `Testimonial` objects using the `Testimonial` interface
    - Apply `className="testimonial-card"` and `style={{ "--card-border-rgb": "<rgb values>" } as React.CSSProperties}` to each card for the CSS hover border effect
    - Use `testimonialContainerVariant` on the grid container with `whileInView` and `viewport={{ once: true, amount: 0.2 }}`
    - Use `cardVariant` on each testimonial card child
    - _Requirements: 1.5, 1.6, 1.7, 3.5, 8.1_

  - [x] 9.2 Write unit tests for `TestimonialsSection`
    - Create `apps/frontend/__tests__/landing/TestimonialsSection.test.tsx`
    - Test: renders exactly 3 testimonial cards
    - Test: stagger container uses 100ms (`staggerChildren: 0.1`) delay
    - Test: each card has `testimonial-card` class and `--card-border-rgb` CSS variable set
    - _Requirements: 1.5, 3.5_

- [x] 10. Implement `CtaSection.tsx`
  - [x] 10.1 Create `apps/frontend/components/CtaSection.tsx` as a `"use client"` component
    - Apply gradient background: `background: linear-gradient(135deg, rgba(253,203,110,0.10) 0%, rgba(0,184,148,0.10) 100%), #fdfbf7`
    - Render at least two floating `<motion.div>` shapes with `aria-hidden="true"`, looping `y` oscillation, opacity between 0.15–0.4, sizes between 40–200px, delays between 0–2s
    - Wrap the CTA button in `<motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={springTransition}>`
    - Apply `useReducedMotion()` to disable looping animations and micro-interactions when true
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.7, 6.7, 8.1, 8.2_

  - [x] 10.2 Write unit tests for `CtaSection`
    - Create `apps/frontend/__tests__/landing/CtaSection.test.tsx`
    - Test: renders at least 2 floating shapes with `aria-hidden="true"`
    - Test: CTA button has `whileHover={{ scale: 1.04 }}` and `whileTap={{ scale: 0.96 }}`
    - Test: gradient background includes two Color_Palette accent colors
    - _Requirements: 2.3, 3.1, 6.7_

- [x] 11. Implement `Footer.tsx`
  - [x] 11.1 Create `apps/frontend/components/Footer.tsx` as a static (non-client) component
    - Extract the existing footer markup from `page.tsx` into this file
    - No animations — static footer only
    - _Requirements: 6.1, 6.4, 6.6_

- [x] 12. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Refactor `page.tsx` to server component with dynamic imports
  - [x] 13.1 Rewrite `apps/frontend/app/page.tsx` as a server component (remove `"use client"`)
    - Import `Navbar`, `HeroSection`, `FeaturesSection`, `HowItWorksSection`, and `Footer` as static imports
    - Import `TestimonialsSection` and `CtaSection` via `next/dynamic` with `{ ssr: false, loading: () => <div className="py-24" /> }`
    - Remove the `<link>` tag for Google Fonts (fonts are already loaded via `next/font/google` in `layout.tsx`)
    - Assemble all sections in order: `<Navbar>`, `<HeroSection>`, `<FeaturesSection>`, `<HowItWorksSection>`, `<TestimonialsSection>`, `<CtaSection>`, `<Footer>`
    - _Requirements: 8.3, 8.5_

  - [x] 13.2 Write property tests for reduced motion behavior
    - Create `apps/frontend/__tests__/properties/reducedMotion.property.test.ts`
    - **Property 8: Reduced motion disables micro-interactions** — test `getMicroInteractionProps(reducedMotion)` returns `whileHover: {}` and `whileTap: {}` when `reducedMotion` is true, for all boolean inputs
    - **Property 9: Reduced motion disables looping animations and simplifies entrance animations** — test `getEntranceAnimationProps(reducedMotion)` returns opacity-only with duration ≤ 0.2s when `reducedMotion` is true
    - **Validates: Requirements 3.7, 8.2**

  - [x] 13.3 Write property tests for color and typography constraints
    - Create `apps/frontend/__tests__/properties/colorContrast.property.test.ts`
    - **Property 10: Headings use Caveat font, body text uses Inter** — test `getFontForElement(elementType)` returns `Caveat` for `h1`/`h2` and `Inter` for `p`/`label`/`caption`
    - **Property 11: Body text color is not lighter than #2d3436** — test `isColorDarkEnough(hexColor)` for all hex colors with luminance ≤ luminance(`#2d3436`)
    - **Property 12: No section uses pure white background** — test `isWarmBackground(hexColor)` returns false for `#ffffff` and true for all warm off-white values
    - **Validates: Requirements 6.1, 6.4, 6.6**

- [x] 14. Implement accessibility and animation constraint tests
  - [x] 14.1 Create `apps/frontend/__tests__/landing/accessibility.test.tsx`
    - Test: all icon-only buttons across all components have a non-empty `aria-label`
    - Test: all decorative SVGs have `aria-hidden="true"`
    - Test: `IllustratedPreview` SVG has `role="img"` and a `<title>` element
    - _Requirements: 7.4, 7.7_

  - [x] 14.2 Write property tests for accessibility and animation prop constraints
    - Create `apps/frontend/__tests__/properties/animationConfig.property.test.ts` (extend existing file)
    - **Property 13: Icon-only buttons have aria-label** — test `buttonHasAriaLabel(buttonProps)` returns true when button has no visible text and has a non-empty `aria-label`
    - **Property 14: Animations use only transform and opacity properties** — test `getAnimationPropKeys(motionProps)` returns only keys from `{ opacity, x, y, scale, rotate, pathLength }` for all valid motion prop objects
    - **Validates: Requirements 7.4, 8.1**

- [x] 15. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at logical milestones
- Property tests validate universal correctness properties using `fast-check` (minimum 100 iterations each)
- Unit tests validate specific examples and edge cases using the existing test framework
- The `"use client"` directive lives in individual component files; `page.tsx` is a server component
- `fast-check` must be installed as a dev dependency before running property tests: `npm install --save-dev fast-check` in `apps/frontend`
- Pure logic functions (`getStepAnimationX`, `isValidScrollTransition`, etc.) should be exported from their respective component files or a shared `utils/animationUtils.ts` file to enable unit testing without rendering

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "2.1"] },
    { "id": 2, "tasks": ["3.1", "4.1", "11.1"] },
    { "id": 3, "tasks": ["3.2", "4.2", "6.1", "7.1", "8.1", "9.1", "10.1"] },
    { "id": 4, "tasks": ["6.2", "6.3", "7.2", "7.3", "8.2", "9.2", "10.2"] },
    { "id": 5, "tasks": ["13.1"] },
    { "id": 6, "tasks": ["13.2", "13.3", "14.1"] },
    { "id": 7, "tasks": ["14.2"] }
  ]
}
```
