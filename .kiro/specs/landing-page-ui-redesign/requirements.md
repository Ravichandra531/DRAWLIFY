# Requirements Document

## Introduction

Drawlify's landing page needs a visual redesign to feel premium, human-crafted, and organic — not AI-generated or template-like. The current page already uses Framer Motion and a warm color palette, but suffers from generic card-based layouts, a boxy static image placeholder in the hero, and animations that lack personality. This redesign focuses on three pillars: richer motion design throughout every section, replacing the generic hero image block with an expressive illustrated SVG preview, and an overall aesthetic upgrade that feels hand-made and intentional.

The frontend is a Next.js 16 app using Tailwind CSS v4, Framer Motion v12, and the Caveat + Inter font pairing. All changes are confined to `apps/frontend/app/page.tsx` and `apps/frontend/app/globals.css`, with optional new component files under `apps/frontend/components/`.

## Glossary

- **Landing_Page**: The root route (`/`) rendered by `apps/frontend/app/page.tsx`
- **Hero_Section**: The top section of the Landing_Page containing the headline, subtext, and primary CTA
- **Features_Section**: The section listing Drawlify's six key features
- **How_It_Works_Section**: The three-step walkthrough section
- **Testimonials_Section**: The social proof section with user quotes
- **CTA_Section**: The bottom call-to-action section before the footer
- **Navbar**: The fixed top navigation bar
- **Footer**: The bottom site footer
- **Scroll_Animation**: A Framer Motion animation triggered when an element enters the viewport
- **Entrance_Animation**: A Framer Motion animation that plays once when a component first mounts
- **Micro_Interaction**: A subtle hover, focus, or tap animation on an interactive element
- **Organic_Shape**: A non-rectangular, asymmetric, or hand-drawn-style visual element such as a blob, squiggle, or sketch stroke
- **Illustrated_Preview**: An SVG-based representation of the Drawlify whiteboard, replacing the `<img>` tag pointing to a static PNG
- **Stagger_Animation**: A Framer Motion animation where child elements animate in sequence with a configurable delay between each
- **Color_Palette**: The existing warm palette — `#6c5ce7` (purple), `#fdcb6e` (yellow), `#00b894` (green), `#e84393` (pink), `#0984e3` (blue), `#fdfbf7` (cream background)
- **Reduce_Motion_Preference**: The operating system or browser accessibility setting `prefers-reduced-motion: reduce`

## Requirements

---

### Requirement 1: Entrance and Scroll Animations Throughout All Sections

**User Story:** As a visitor, I want every section of the landing page to animate smoothly into view as I scroll, so that the page feels alive and engaging rather than static.

#### Acceptance Criteria

1. WHEN the Landing_Page first loads, THE Hero_Section SHALL animate its badge, headline, subtext, and CTA buttons in sequence using an Entrance_Animation with staggered delays of 100ms between each element, each element transitioning from `opacity: 0, y: 20px` to `opacity: 1, y: 0`.
2. WHEN a section other than the Hero_Section enters the viewport at a threshold of 20% visible, THE Landing_Page SHALL trigger a Scroll_Animation for that section's heading (transitioning from `opacity: 0, y: 24px` to `opacity: 1, y: 0`) and body content (transitioning from `opacity: 0, y: 16px` to `opacity: 1, y: 0`) with a 60ms delay between heading and body.
3. WHEN a feature card in the Features_Section enters the viewport, THE Features_Section SHALL animate the cards using a Stagger_Animation with an 80ms delay between each card, each card transitioning from `opacity: 0, y: 20px` to `opacity: 1, y: 0`.
4. WHEN a step in the How_It_Works_Section enters the viewport, THE How_It_Works_Section SHALL animate each step with alternating slide-in directions — odd-numbered steps from `x: -30px, opacity: 0` and even-numbered steps from `x: 30px, opacity: 0` — both transitioning to `x: 0, opacity: 1`.
5. WHEN a testimonial card in the Testimonials_Section enters the viewport, THE Testimonials_Section SHALL animate the cards using a Stagger_Animation with a 100ms delay between each card, each card transitioning from `opacity: 0, y: 20px` to `opacity: 1, y: 0`.
6. THE Landing_Page SHALL configure all Scroll_Animations with `viewport={{ once: true }}` so that animations do not replay when the visitor scrolls back up.
7. WHEN a Scroll_Animation plays, THE Landing_Page SHALL use an easeOut easing curve with a duration between 0.4s and 0.7s for all animated elements.

---

### Requirement 2: Ambient Background Animations in Hero and CTA Sections

**User Story:** As a visitor, I want the hero and CTA sections to have subtle, continuously moving background elements, so that the page feels dynamic without being distracting.

#### Acceptance Criteria

1. THE Hero_Section SHALL render at least four floating Organic_Shape elements in the background that animate position or scale properties continuously, with each shape completing one full animation cycle in 4–12 seconds.
2. THE Hero_Section SHALL position floating Organic_Shape elements using absolute positioning so they are rendered behind all text and interactive elements in the stacking order and do not affect document flow.
3. THE CTA_Section SHALL render at least two floating Organic_Shape elements that animate position or scale properties continuously using the same looping animation style as the Hero_Section background shapes, each completing one full cycle in 4–12 seconds.
4. WHEN floating Organic_Shape elements animate, THE Landing_Page SHALL apply staggered `delay` values between 0s and 2s across the shapes so they do not move in unison.
5. THE Landing_Page SHALL render floating Organic_Shape elements with an opacity between 0.15 and 0.4 so they remain subtle and do not compete with text content.
6. THE Landing_Page SHALL render each floating Organic_Shape element with a width and height between 40px and 200px so they are neither invisible nor large enough to obscure content areas.

---

### Requirement 3: Micro-Interactions on All Interactive Elements

**User Story:** As a visitor, I want buttons, links, and cards to respond visually when I hover or tap them, so that the interface feels responsive and crafted.

#### Acceptance Criteria

1. WHEN a visitor hovers over a primary CTA button, THE Landing_Page SHALL scale the button to 1.04 using a Framer Motion `whileHover` with a spring transition of stiffness 300 and damping 20; WHEN the visitor moves the cursor away, THE Landing_Page SHALL return the button to scale 1.0 using the same spring transition.
2. WHEN a visitor taps or clicks a primary CTA button, THE Landing_Page SHALL scale the button to 0.96 using a Framer Motion `whileTap` with a spring transition of stiffness 300 and damping 20; WHEN the tap or click is released, THE Landing_Page SHALL return the button to scale 1.0 using the same spring transition.
3. WHEN a visitor hovers over a feature card in the Features_Section, THE Features_Section SHALL translate the card upward by 4px and increase the card's box-shadow blur radius by 8px and spread by 2px using a transition of 200ms ease; WHEN the visitor moves the cursor away, THE Features_Section SHALL return the card to its default position and shadow.
4. WHEN a visitor hovers over a navigation link in the Navbar, THE Navbar SHALL animate an underline indicator from 0% to 100% width using a transition of 200ms ease; WHEN the visitor moves the cursor away, THE Navbar SHALL animate the underline back to 0% width.
5. WHEN a visitor hovers over a testimonial card, THE Testimonials_Section SHALL transition the card's border opacity to 1.0 using a transition of 200ms ease; WHEN the visitor moves the cursor away, THE Testimonials_Section SHALL return the border opacity to its default value.
6. WHEN a visitor hovers over the "Start Drawing" button in the Navbar, THE Navbar SHALL scale the button to 1.03 using a Framer Motion `whileHover` transition; WHEN the visitor moves the cursor away, THE Navbar SHALL return the button to scale 1.0.
7. WHILE the Reduce_Motion_Preference is active, THE Landing_Page SHALL disable all Micro_Interactions so that no scale, translate, or opacity changes occur on hover or tap.

---

### Requirement 4: Replace the Hero Image Placeholder with an Illustrated Preview

**User Story:** As a visitor, I want the hero section to show an expressive, illustrated representation of the Drawlify canvas rather than a generic screenshot in a boxy container, so that the product feels unique and hand-crafted.

#### Acceptance Criteria

1. THE Hero_Section SHALL replace the `<img src="/canvas-preview.png">` element with an Illustrated_Preview component built using inline SVG.
2. THE Illustrated_Preview SHALL depict recognizable whiteboard elements: at least one freehand sketch stroke, one shape outline, one arrow connector, and one text label — all rendered with irregular, non-uniform stroke widths and rough path edges that are visually distinguishable from geometrically precise lines.
3. THE Illustrated_Preview SHALL use colors from the Color_Palette for its drawn elements.
4. WHEN the Illustrated_Preview mounts, THE Illustrated_Preview SHALL animate its drawn SVG paths sequentially using Framer Motion `pathLength` transitions from 0 to 1, with a 300ms stagger between each path, such that the total draw-in duration falls between 1.5s and 2.5s.
5. THE Illustrated_Preview SHALL be contained within a rounded container with a drop shadow of blur radius between 8px and 24px and shadow opacity between 0.08 and 0.18, set against a warm off-white background of `#fdfbf7`.
6. THE Illustrated_Preview SHALL maintain a 16:9 aspect ratio and be responsive across viewport widths from 320px to 1440px without horizontal overflow.
7. IF the Illustrated_Preview SVG element is absent from the DOM or contains no rendered child elements at mount time, THEN THE Hero_Section SHALL display a plain text fallback reading "Interactive whiteboard preview".

---

### Requirement 5: Organic, Non-Boxy Visual Design for Feature and Step Cards

**User Story:** As a visitor, I want the feature cards and how-it-works steps to use organic, asymmetric shapes rather than uniform rectangles, so that the layout feels hand-crafted and not template-generated.

#### Acceptance Criteria

1. THE Features_Section SHALL render each feature card with an asymmetric border-radius where no two adjacent corners share the same radius value (e.g., `12px 4px 16px 8px`).
2. THE Features_Section SHALL apply a multi-layer box-shadow to each feature card using at least two shadow layers with non-uniform x and y offsets to mimic a hand-drawn outline effect.
3. THE How_It_Works_Section SHALL render the three steps in a vertical timeline layout where each step is connected by a dashed SVG line that spans from the bottom edge of one step to the top edge of the next, drawn in a Color_Palette accent color.
4. THE How_It_Works_Section SHALL render each step number as a large Caveat-font numeral positioned as a decorative background element behind the step content, with an opacity between 0.1 and 0.25.
5. THE Features_Section SHALL use a warm background color of `#f5f1eb` for card backgrounds rather than pure white.
6. THE Features_Section SHALL display each feature card's icon inside an Organic_Shape container (such as a blob or irregular polygon) rather than a plain square or rectangle.

---

### Requirement 6: Typography and Color Refinements for a Premium Feel

**User Story:** As a visitor, I want the typography and color usage to feel intentional and premium, so that the page reads as professionally designed rather than auto-generated.

#### Acceptance Criteria

1. THE Landing_Page SHALL apply the Caveat font exclusively to display headings (h1, h2) and decorative numerals, and the Inter font to all body text, captions, and UI labels.
2. IF the viewport width is below 768px, THEN THE Hero_Section headline SHALL use a font size of at least `5rem` with a line-height of 0.95 or tighter.
3. IF the viewport width is 768px or above, THEN THE Hero_Section headline SHALL use a font size of at least `7rem` with a line-height of 0.95 or tighter.
4. THE Landing_Page SHALL use `#6c5ce7` for primary action elements and accents, warm neutrals (`#fdfbf7`, `#f5f1eb`) for section backgrounds, and a body text color no lighter than `#2d3436` throughout.
5. THE Navbar SHALL use a frosted-glass background composed of `#fdfbf7` at 80% opacity with a `backdrop-blur` of 12px.
6. THE Landing_Page SHALL not use pure white (`#ffffff`) as a section background; all section backgrounds SHALL use warm off-white or cream tones from the Color_Palette.
7. THE CTA_Section SHALL use a gradient background blending at least two of the following Color_Palette accent colors — `#fdcb6e`, `#00b894`, `#e84393`, `#0984e3` — at an opacity between 8% and 15% over the `#fdfbf7` base.

---

### Requirement 7: Responsive Layout and Accessibility

**User Story:** As a visitor on any device, I want the redesigned landing page to be fully usable and visually correct, so that the premium experience is consistent regardless of screen size or assistive technology.

#### Acceptance Criteria

1. THE Landing_Page SHALL render without horizontal scrollbars, content clipping, or elements overflowing their parent containers at viewport widths of 320px, 768px, and 1440px.
2. WHEN the viewport width is below 768px, THE Navbar SHALL collapse the navigation links and CTA button into a mobile menu toggled by an animated hamburger icon.
3. WHEN the mobile menu opens, THE Navbar SHALL animate the menu panel using a Framer Motion height and opacity transition of 300ms ease; WHEN the mobile menu closes, THE Navbar SHALL reverse the animation using the same 300ms ease transition.
4. THE Landing_Page SHALL provide `aria-label` attributes on all icon-only buttons; SVG elements that are purely decorative SHALL include `aria-hidden="true"`.
5. THE Landing_Page SHALL maintain a color contrast ratio of at least 4.5:1 between body text and its background, as required by WCAG 2.1 AA.
6. WHEN a visitor uses keyboard navigation, THE Landing_Page SHALL display a visible focus ring with a contrast ratio of at least 3:1 against the adjacent background on all interactive elements.
7. THE Illustrated_Preview SVG SHALL include a `role="img"` attribute and a `<title>` element describing the whiteboard content for screen readers.

---

### Requirement 8: Performance Constraints for Animations

**User Story:** As a visitor on a low-powered device, I want the animations to not degrade page performance, so that the experience remains smooth even on older hardware.

#### Acceptance Criteria

1. THE Landing_Page SHALL use CSS `transform` and `opacity` properties exclusively for all animations, avoiding layout-triggering properties such as `width`, `height`, `top`, or `left`; SVG `pathLength` attribute animations are explicitly permitted as an exception to this rule.
2. WHILE the Reduce_Motion_Preference is active, THE Landing_Page SHALL disable all looping ambient animations and all Scroll_Animations, and SHALL reduce all Entrance_Animations to a simple opacity fade of 200ms duration.
3. THE Landing_Page SHALL not load any external JavaScript animation libraries beyond the already-installed Framer Motion v12.
4. THE Illustrated_Preview SHALL be implemented as an inline SVG React component so that it scales without quality loss and does not require an additional network request for the image asset.
5. THE Landing_Page SHALL implement the Testimonials_Section and CTA_Section using Next.js dynamic imports with `ssr: false` so that their JavaScript is not included in the initial server-rendered page bundle.
