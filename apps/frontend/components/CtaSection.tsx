"use client";

import { motion, useReducedMotion } from "framer-motion";
import { springTransition } from "./motionVariants";

export default function CtaSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(253,203,110,0.10) 0%, rgba(0,184,148,0.10) 100%), #fdfbf7",
      }}
    >
      {/* Floating background shapes */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute top-20 left-[15%] w-24 h-24 rounded-full border-2 border-[#fdcb6e]/30 bg-[#fdcb6e]/10"
            aria-hidden="true"
            animate={{ y: [-10, 10, -10] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: 0,
            }}
            style={{ opacity: 0.25 }}
          />
          <motion.div
            className="absolute bottom-32 right-[20%] w-16 h-16 border-2 border-[#00b894]/40 rounded-[12px_4px_16px_8px] bg-[#00b894]/15"
            aria-hidden="true"
            animate={{ y: [8, -8, 8] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: 1.5,
            }}
            style={{ opacity: 0.3 }}
          />
        </>
      )}

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Ready to sketch?
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            No sign-up. No download. Just open and draw.
          </p>
          <motion.a
            href="/dashboard"
            className="px-8 py-3 text-base font-medium text-white bg-[#6c5ce7] rounded-xl shadow-lg inline-flex items-center gap-2"
            whileHover={prefersReducedMotion ? {} : { scale: 1.04 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
            transition={springTransition}
          >
            Open Drawlify{" "}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
