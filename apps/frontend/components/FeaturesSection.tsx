"use client";

import { motion } from "framer-motion";
import { featureContainerVariant, cardVariant } from "./motionVariants";
import { Feature } from "../types/landing";

// Six pre-computed organic blob paths for icon containers
const features: Feature[] = [
  {
    icon: "✏️",
    title: "Hand-drawn feel",
    description: "Sketchy, natural-looking shapes that feel like a real whiteboard.",
    accentColor: "#e84393",
    blobPath: "M50,10 C70,5 90,20 95,40 C100,60 85,85 65,90 C45,95 15,85 10,65 C5,45 20,15 50,10 Z",
  },
  {
    icon: "👥",
    title: "Real-time collab",
    description: "Invite teammates and draw together — changes sync instantly.",
    accentColor: "#0984e3",
    blobPath: "M45,8 C68,12 88,25 92,48 C96,71 78,92 55,95 C32,98 10,80 8,57 C6,34 22,4 45,8 Z",
  },
  {
    icon: "📥",
    title: "Export anywhere",
    description: "Save as PNG, SVG, or share a live link with anyone.",
    accentColor: "#00b894",
    blobPath: "M50,5 C72,8 92,22 95,44 C98,66 85,88 63,92 C41,96 18,85 12,63 C6,41 28,2 50,5 Z",
  },
  {
    icon: "🎨",
    title: "Infinite canvas",
    description: "Zoom, pan, and draw without limits on a boundless canvas.",
    accentColor: "#fdcb6e",
    blobPath: "M48,12 C66,10 86,28 90,46 C94,64 82,84 64,88 C46,92 22,78 15,60 C8,42 30,14 48,12 Z",
  },
  {
    icon: "⚡",
    title: "Blazing fast",
    description: "Lightweight and snappy — no loading screens, ever.",
    accentColor: "#6c5ce7",
    blobPath: "M52,8 C70,6 90,18 94,36 C98,54 88,76 70,82 C52,88 28,80 18,62 C8,44 34,10 52,8 Z",
  },
  {
    icon: "🔒",
    title: "Private & secure",
    description: "End-to-end encrypted. Your drawings stay yours.",
    accentColor: "#00b894",
    blobPath: "M46,10 C64,8 84,20 90,38 C96,56 86,78 68,86 C50,94 26,84 16,66 C6,48 28,12 46,10 Z",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#fdfbf7]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Everything you need
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Powerful features wrapped in a simple, delightful experience.
          </p>
        </div>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={featureContainerVariant}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariant}
              className="feature-card p-6 bg-[#f5f1eb] border-2 border-gray-900/10"
              style={{
                borderRadius: "12px 4px 16px 8px",
                boxShadow:
                  "3px 3px 0px rgba(0,0,0,0.06), 6px 6px 0px rgba(0,0,0,0.04)",
              }}
            >
              {/* Icon inside SVG blob container */}
              <div className="relative w-12 h-12 mb-4">
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full"
                  aria-hidden="true"
                >
                  <path
                    d={feature.blobPath}
                    fill={feature.accentColor}
                    fillOpacity="0.15"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl">
                  {feature.icon}
                </div>
              </div>

              <h3
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
