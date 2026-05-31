"use client";

import { motion } from "framer-motion";
import { testimonialContainerVariant, cardVariant } from "./motionVariants";
import type { Testimonial } from "../types/landing";

const testimonials: Testimonial[] = [
  {
    name: "Sarah K.",
    role: "Product Designer",
    quote: "This replaced my sticky notes and Miro boards. It just feels right.",
    borderColor: "#e84393",
  },
  {
    name: "James L.",
    role: "Software Engineer",
    quote: "I use it to sketch system diagrams every day. Clean and fast.",
    borderColor: "#0984e3",
  },
  {
    name: "Priya M.",
    role: "Startup Founder",
    quote: "We brainstorm all our ideas here. The collab features are magic.",
    borderColor: "#00b894",
  },
];

/**
 * Convert hex color to RGB values for CSS variable
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0, 0, 0";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-[#fdfbf7]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Loved by creators
          </h2>
        </div>
        <motion.div
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          variants={testimonialContainerVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              className="testimonial-card p-6 rounded-2xl bg-[#f5f1eb] border-2 shadow-[4px_4px_0px_rgba(0,0,0,0.08)]"
              style={
                {
                  "--card-border-rgb": hexToRgb(t.borderColor),
                } as React.CSSProperties
              }
              variants={cardVariant}
            >
              <p className="text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
              <p
                className="font-bold text-xl"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                {t.name}
              </p>
              <p className="text-gray-500 text-xs">{t.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
