"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUpVariant, springTransition } from "./motionVariants";
import IllustratedPreview from "./IllustratedPreview";

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  // Disable micro-interactions when reduced motion is preferred
  const hoverProps = prefersReducedMotion ? {} : { scale: 1.04 };
  const tapProps = prefersReducedMotion ? {} : { scale: 0.96 };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-[#6c5ce7]/8 via-[#fdcb6e]/12 to-[#00b894]/8">
      {/* Floating shapes with looping animations */}
      <motion.div
        className="absolute top-24 left-[10%] w-16 h-16 rounded-full border-2 border-[#e84393]/30"
        aria-hidden="true"
        animate={prefersReducedMotion ? {} : { y: [-8, 8, -8], rotate: [0, 10, 0] }}
        transition={
          prefersReducedMotion
            ? {}
            : { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0 }
        }
      />
      <motion.div
        className="absolute top-40 right-[15%] w-12 h-12 border-2 border-[#fdcb6e]/40 rounded-[12px_4px_16px_8px] bg-[#fdcb6e]/10"
        aria-hidden="true"
        animate={prefersReducedMotion ? {} : { y: [6, -6, 6], rotate: [0, -8, 0] }}
        transition={
          prefersReducedMotion
            ? {}
            : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
        }
      />
      <motion.div
        className="absolute bottom-32 left-[20%] w-10 h-10 border-2 border-[#0984e3]/30 rotate-45"
        aria-hidden="true"
        animate={prefersReducedMotion ? {} : { y: [-5, 5, -5] }}
        transition={
          prefersReducedMotion
            ? {}
            : { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
        }
      />
      <motion.div
        className="absolute top-[60%] right-[8%] w-20 h-20 rounded-full border-2 border-[#00b894]/25"
        style={{ opacity: 0.3 }}
        aria-hidden="true"
        animate={prefersReducedMotion ? {} : { y: [-10, 10, -10], rotate: [0, -15, 0] }}
        transition={
          prefersReducedMotion
            ? {}
            : { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
        }
      />

      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge - delay 0ms */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6c5ce7]/10 text-[#6c5ce7] text-sm font-medium mb-6">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              Free & Open Source
            </div>
          </motion.div>

          {/* Headline - delay 100ms */}
          <motion.h1
            className="text-[5rem] md:text-[7rem] font-bold leading-[0.95] mb-6"
            style={{ fontFamily: "'Caveat', cursive" }}
            initial="hidden"
            animate="show"
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            Draw. Think.
            <br />
            <span className="text-[#6c5ce7]">Collaborate.</span>
          </motion.h1>

          {/* Subtext - delay 200ms */}
          <motion.p
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10"
            initial="hidden"
            animate="show"
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            A virtual whiteboard for sketching hand-drawn like diagrams. Simple,
            intuitive, and endlessly creative.
          </motion.p>

          {/* CTA buttons - delay 300ms */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden"
            animate="show"
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <motion.a
              href="/dashboard"
              className="px-8 py-3 text-base font-medium text-white bg-[#6c5ce7] rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all inline-flex items-center gap-2 justify-center"
              whileHover={hoverProps}
              whileTap={tapProps}
              transition={springTransition}
            >
              Start Drawing{" "}
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
            <motion.a
              href="#how-it-works"
              className="px-8 py-3 text-base font-medium border-2 border-gray-200 bg-white/80 backdrop-blur rounded-xl hover:bg-gray-50 transition-all"
              whileHover={hoverProps}
              whileTap={tapProps}
              transition={springTransition}
            >
              See how it works
            </motion.a>
          </motion.div>
        </div>

        {/* Hero Preview - IllustratedPreview component - delay 500ms */}
        <motion.div
          className="mt-16 w-full max-w-[1000px] mx-auto px-4"
          initial="hidden"
          animate="show"
          variants={fadeUpVariant}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        >
          <IllustratedPreview />
        </motion.div>
      </div>
    </section>
  );
}
