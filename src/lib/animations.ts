'use client'

import type { Variants } from 'framer-motion'

// Apple-style cubic bezier
export const appleEase = [0.25, 0.1, 0.25, 1] as const

// Framer Motion variants
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: appleEase,
    },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: appleEase,
    },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const cardHover: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: appleEase,
    },
  },
}

// GSAP defaults — use in useEffect with gsap.context()
export const gsapDefaults = {
  duration: 0.8,
  ease: 'power2.out',
}

export const scrollTriggerDefaults = {
  start: 'top 85%',
  toggleActions: 'play none none none',
}
