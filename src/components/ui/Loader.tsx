'use client';

import { motion } from 'framer-motion';
import React from 'react';

type LoaderProps = {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  fullScreen?: boolean;
  withText?: boolean;
  text?: string;
};

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = '#000000', // Default to black
  fullScreen = false,
  withText = false,
  text = 'Loading...',
}) => {
  // Calculate size based on prop
  const sizeMap = {
    sm: 60,
    md: 100,
    lg: 150,
  };
  const svgSize = sizeMap[size];

  // SVG path animation variants
  const pathVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      fillOpacity: 0,
    },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      fillOpacity: 1,
      transition: {
        opacity: {
          duration: 0.5,
          delay: i * 0.2,
        },
        scale: {
          duration: 0.6,
          delay: i * 0.2,
          type: 'spring',
          stiffness: 150,
        },
        fillOpacity: {
          duration: 1,
          delay: i * 0.2,
          repeat: Infinity,
          repeatType: 'reverse' as const,
          ease: 'easeInOut',
        },
      },
    }),
  };

  // Float animation for the entire SVG (subtle movement instead of rotation)
  const svgVariants = {
    animate: {
      y: [0, -3, 0, 3, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Pulse animation for the text
  const textVariants = {
    animate: {
      opacity: [0.7, 1, 0.7],
      scale: [0.98, 1, 0.98],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Create the loader content
  const loaderContent = (
    <div className="flex flex-col items-center justify-center">
      <motion.svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 300 300"
        preserveAspectRatio="xMidYMid meet"
        variants={svgVariants}
        animate="animate"
      >
        <g transform="translate(0.000000,300.000000) scale(0.050000,-0.050000)">
          <motion.path
            d="M2790 5456 c-86 -30 -220 -166 -249 -253 -49 -148 -20 -583 44 -676 172 -248 514 -252 685 -9 l60 85 0 304 c0 270 -4 310 -40 363 -117 175 -317 250 -500 186z"
            fill={color}
            fillOpacity={0.2}
            custom={0}
            variants={pathVariants}
            initial="hidden"
            animate="visible"
            whileInView="pulse"
            viewport={{ once: false }}
          />
          <motion.path
            d="M1259 4433 c-105 -48 -182 -120 -230 -214 l-49 -98 0 -1198 0 -1198 52 -93 c164 -294 545 -318 724 -46 l54 81 0 1263 0 1264 -78 95 c-124 151 -325 212 -473 144z"
            fill={color}
            fillOpacity={0.2}
            custom={1}
            variants={pathVariants}
            initial="hidden"
            animate="visible"
            whileInView="pulse"
            viewport={{ once: false }}
          />
          <motion.path
            d="M4363 4408 c-82 -41 -118 -75 -164 -155 l-59 -103 0 -414 0 -413 -55 -44 c-53 -42 -65 -43 -374 -31 -372 16 -362 11 -377 192 -31 371 -422 517 -701 262 -108 -100 -113 -133 -113 -799 1 -740 21 -806 272 -864 293 -68 509 62 546 330 36 249 47 255 482 247 l310 -6 10 -450 c8 -369 16 -461 43 -510 196 -354 705 -277 778 117 24 130 15 2329 -10 2418 -62 219 -365 334 -588 223z"
            fill={color}
            fillOpacity={0.2}
            custom={2}
            variants={pathVariants}
            initial="hidden"
            animate="visible"
            whileInView="pulse"
            viewport={{ once: false }}
          />
          <motion.path
            d="M2741 1495 c-276 -139 -323 -779 -72 -985 179 -147 492 -92 616 107 65 105 69 617 5 715 -128 198 -348 264 -549 163z"
            fill={color}
            fillOpacity={0.2}
            custom={3}
            variants={pathVariants}
            initial="hidden"
            animate="visible"
            whileInView="pulse"
            viewport={{ once: false }}
          />
        </g>

        {/* Add subtle highlight effect elements */}
        <motion.circle
          cx="150"
          cy="150"
          r="130"
          fill="transparent"
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.15"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.circle
          cx="150"
          cy="150"
          r="100"
          fill="transparent"
          stroke={color}
          strokeWidth="0.8"
          strokeOpacity="0.1"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
      </motion.svg>

      {withText && (
        <motion.div
          className="mt-4 text-center font-medium"
          style={{ color }}
          variants={textVariants}
          animate="animate"
        >
          {text}
        </motion.div>
      )}
    </div>
  );

  // Conditionally wrap content if fullScreen is requested
  if (fullScreen) {
    return (
      <div className="fixed inset-0  z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-black/50">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;
