"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function IllustratedPreview() {
  const prefersReducedMotion = useReducedMotion();

  // SVG path data for the illustrated elements
  const paths = [
    {
      // Freehand sketch stroke - wavy, irregular line
      d: "M150,120 Q180,100 210,115 T270,130 Q300,140 330,125 T390,135",
      stroke: "#6c5ce7",
      strokeWidth: 3,
      fill: "none",
    },
    {
      // Shape outline - rounded rectangle with wobbly edges
      d: "M450,180 Q455,175 460,180 L540,185 Q545,185 545,190 L548,260 Q548,265 543,268 L458,265 Q453,265 452,260 L450,185 Q450,180 450,180 Z",
      stroke: "#fdcb6e",
      strokeWidth: 2.5,
      fill: "none",
    },
    {
      // Arrow connector - line with arrowhead
      d: "M200,250 L350,200 M350,200 L340,195 M350,200 L345,210",
      stroke: "#00b894",
      strokeWidth: 2,
      fill: "none",
    },
  ];

  // Container animation for reduced motion
  const containerVariant = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      }
    : {
        initial: {},
        animate: {},
      };

  return (
    <motion.div
      className="rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)] bg-[#fdfbf7] aspect-video"
      {...containerVariant}
    >
      <svg
        viewBox="0 0 800 450"
        role="img"
        className="illustrated-preview-svg w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Interactive whiteboard preview showing freehand sketches, shapes, and connectors</title>
        
        {paths.map((path, index) => (
          <motion.path
            key={index}
            d={path.d}
            stroke={path.stroke}
            strokeWidth={path.strokeWidth}
            fill={path.fill}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={
              prefersReducedMotion
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            animate={
              prefersReducedMotion
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 1, opacity: 1 }
            }
            transition={
              prefersReducedMotion
                ? {}
                : {
                    pathLength: {
                      duration: 0.8,
                      ease: "easeInOut",
                      delay: index * 0.3,
                    },
                    opacity: {
                      duration: 0.1,
                      delay: index * 0.3,
                    },
                  }
            }
          />
        ))}

        {/* Text label using Caveat font */}
        <motion.text
          x="480"
          y="150"
          fontFamily="Caveat, cursive"
          fontSize="24"
          fill="#2d3436"
          initial={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 0 }
          }
          animate={{ opacity: 1 }}
          transition={
            prefersReducedMotion
              ? {}
              : {
                  opacity: {
                    duration: 0.3,
                    delay: 0.9,
                  },
                }
          }
        >
          Ideas
        </motion.text>
      </svg>
      
      <p className="illustrated-preview-fallback absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
        Interactive whiteboard preview
      </p>
    </motion.div>
  );
}
