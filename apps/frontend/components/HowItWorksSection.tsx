"use client";

import { motion } from "framer-motion";
import { Step } from "../types/landing";

const steps: Step[] = [
  { num: "01", title: "Open the canvas", desc: "No sign-up required. Just open the app and start creating." },
  { num: "02", title: "Sketch your ideas", desc: "Use shapes, arrows, text, and freehand tools to bring ideas to life." },
  { num: "03", title: "Share & collaborate", desc: "Send a link to teammates and edit together in real-time." },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-[#f5f1eb]/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "'Caveat', cursive" }}>
            How it works
          </h2>
          <p className="text-lg text-gray-500 max-w-md mx-auto">
            From zero to sketch in three simple steps.
          </p>
        </div>
        <div className="max-w-3xl mx-auto flex flex-col gap-0">
          {steps.map((step, i) => (
            <div key={step.num}>
              <motion.div
                className="relative p-6 rounded-2xl bg-[#f5f1eb] border-2 border-gray-900/10"
                style={{ borderRadius: "12px 4px 16px 8px" }}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.15 }}
              >
                <span
                  className="absolute -top-4 -left-2 text-8xl font-bold select-none pointer-events-none"
                  style={{ fontFamily: "'Caveat', cursive", opacity: 0.15, color: "#6c5ce7" }}
                  aria-hidden="true"
                >
                  {step.num}
                </span>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Caveat', cursive" }}>
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{step.desc}</p>
                </div>
              </motion.div>
              {i < steps.length - 1 && (
                <svg width="2" height="48" aria-hidden="true" className="mx-auto">
                  <line
                    x1="1"
                    y1="0"
                    x2="1"
                    y2="48"
                    stroke="#6c5ce7"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
