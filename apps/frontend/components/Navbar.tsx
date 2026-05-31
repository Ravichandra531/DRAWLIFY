"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { springTransition } from "./motionVariants";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Conditionally disable animations when reduced motion is preferred
  const hoverScale = prefersReducedMotion ? {} : { scale: 1.03 };
  const tapScale = prefersReducedMotion ? {} : { scale: 0.96 };
  const mobileMenuTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: "easeOut" as const };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fdfbf7]/80 backdrop-blur-[12px] border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="font-bold text-2xl"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Drawlify
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <span className="nav-link-wrapper">
            <a
              href="#features"
              className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Features
            </a>
          </span>
          <span className="nav-link-wrapper">
            <a
              href="#how-it-works"
              className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              How it works
            </a>
          </span>
          <span className="nav-link-wrapper">
            <a
              href="#testimonials"
              className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Testimonials
            </a>
          </span>
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/signin"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Log in
          </a>
          <motion.a
            href="/signup"
            className="px-4 py-2 text-sm font-medium text-white bg-[#6c5ce7] rounded-lg hover:brightness-110 transition-all"
            whileHover={hoverScale}
            whileTap={tapScale}
            transition={springTransition}
          >
            Start Drawing
          </motion.a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={mobileMenuTransition}
            className="md:hidden bg-[#fdfbf7] border-b border-gray-200 overflow-hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-6">
              <a
                href="#features"
                className="text-gray-500 hover:text-gray-900 text-sm"
                onClick={() => setOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-500 hover:text-gray-900 text-sm"
                onClick={() => setOpen(false)}
              >
                How it works
              </a>
              <a
                href="#testimonials"
                className="text-gray-500 hover:text-gray-900 text-sm"
                onClick={() => setOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="/signup"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-[#6c5ce7] rounded-lg text-center block"
              >
                Start Drawing
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for nav link underline animation */}
      <style jsx>{`
        .nav-link-wrapper {
          position: relative;
          display: inline-block;
        }

        .nav-link-wrapper::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: currentColor;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 200ms ease;
        }

        .nav-link-wrapper:hover::after {
          transform: scaleX(1);
        }
      `}</style>
    </nav>
  );
}
