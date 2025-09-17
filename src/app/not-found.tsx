'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// Container and child animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// Animated background shapes for extra visual flair
function AnimatedBackgroundShapes() {
  return (
    <>
      {/* Floating Circle */}
      <motion.svg
        className="absolute left-10 top-10 opacity-20"
        width="100"
        height="100"
        viewBox="0 0 100 100"
        animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx="50" cy="50" r="50" fill="#fff" />
      </motion.svg>

      {/* Floating Square */}
      <motion.svg
        className="absolute bottom-10 right-10 opacity-20"
        width="150"
        height="150"
        viewBox="0 0 150 150"
        animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect width="150" height="150" fill="#fff" />
      </motion.svg>

      {/* Floating Ellipse */}
      <motion.svg
        className="absolute left-1/4 top-1/2 opacity-20"
        width="120"
        height="120"
        viewBox="0 0 120 120"
        animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="60" cy="60" rx="60" ry="30" fill="#fff" />
      </motion.svg>

      {/* Rotating Star for added creativity */}
      <motion.svg
        className="absolute left-10 top-1/2 opacity-10"
        width="80"
        height="80"
        viewBox="0 0 80 80"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <polygon
          points="40,0 50,30 80,30 55,50 65,80 40,65 15,80 25,50 0,30 30,30"
          fill="#FF6A3D"
        />
      </motion.svg>
    </>
  );
}

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A2238] to-black">
      {/* Render animated background shapes */}
      <AnimatedBackgroundShapes />

      {/* Main Content */}
      <motion.div
        className="relative z-10 px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative inline-block">
          {/* 404 Heading */}
          <motion.h1
            className="select-none text-9xl font-extrabold tracking-widest text-white"
            variants={childVariants}
          >
            404
          </motion.h1>

          {/* Rotated overlay for "Page Not Found" */}
          <motion.div
            className="absolute -right-4 -top-4 rotate-12 rounded bg-[#FF6A3D] px-3 py-1 text-sm shadow-lg"
            variants={childVariants}
          >
            Page Not Found
          </motion.div>
        </div>

        {/* Additional Message */}
        <motion.p className="mt-6 text-xl text-gray-300" variants={childVariants}>
          Oops! We can’t seem to find the page you’re looking for.
        </motion.p>

        {/* Call-to-Action Button */}
        <motion.div className="mt-8" variants={childVariants}>
          <Link href="/dashboard" className="group relative inline-block text-sm font-medium text-[#FF6A3D] focus:outline-none focus:ring">
            <span
              className="absolute inset-0 translate-x-1 translate-y-1 bg-[#FF6A3D] transition-transform group-hover:translate-x-0 group-hover:translate-y-0"
            >
            </span>
            <span className="relative block border border-current bg-[#1A2238] px-8 py-3">
              Go Home
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
