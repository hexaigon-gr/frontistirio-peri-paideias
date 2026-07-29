"use client";

import { domAnimation, LazyMotion, m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The two motion primitives the site uses. Everything else stays a Server
 * Component: these are deliberately tiny leaves so a section can animate
 * without its content shipping to the browser as JS.
 *
 * Imported from `framer-motion` rather than `motion/react` because that is the
 * package this repo actually depends on. The API is identical, and pulling in
 * `motion` alongside it would ship the same library twice.
 *
 * `m` plus `LazyMotion`/`domAnimation` rather than the full `motion` component:
 * `motion` drags in every feature including drag and layout projection, none of
 * which this site uses. `domAnimation` carries animations, variants and the
 * viewport detection `whileInView` needs, and nothing else.
 *
 * Only `opacity` and `transform` are animated, so nothing here triggers layout.
 *
 * REDUCED MOTION IS HANDLED BY CHANGING THE VALUES, NEVER THE ELEMENT.
 * Returning a plain `<div>` instead of an `<m.div>` looks equivalent and is
 * not: `useReducedMotion` reads `null` on the first render, so the animated
 * element renders first with an inline `opacity: 0`, and when the hook resolves
 * and the element is swapped for a plain one React reuses the same DOM node
 * without clearing a style it never set. The section stays invisible forever
 * for exactly the users who asked for less motion.
 */
const EASE = [0.22, 1, 0.36, 1] as const;

/** Fires slightly before the block reaches the fold, so it is never caught mid-fade. */
const VIEWPORT = { once: true, margin: "-80px" } as const;

const RESTING = { opacity: 1, y: 0 } as const;
const OFFSCREEN = { opacity: 0, y: 24 } as const;
const INSTANT = { duration: 0 } as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const Reveal = ({ children, className, delay = 0 }: RevealProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        initial={shouldReduceMotion ? RESTING : OFFSCREEN}
        whileInView={RESTING}
        viewport={VIEWPORT}
        transition={
          shouldReduceMotion ? INSTANT : { duration: 0.5, ease: EASE, delay }
        }
      >
        {children}
      </m.div>
    </LazyMotion>
  );
};

/* The container itself never animates. It only holds the stagger clock, so the
   cards inside can be handed to it straight from a Server Component. */
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const staticListVariants = { hidden: {}, show: {} };

const itemVariants = {
  hidden: OFFSCREEN,
  show: { ...RESTING, transition: { duration: 0.45, ease: EASE } },
};

const staticItemVariants = {
  hidden: RESTING,
  show: { ...RESTING, transition: INSTANT },
};

interface StaggerProps {
  children: ReactNode;
  className?: string;
}

export const Stagger = ({ children, className }: StaggerProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <m.ul
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={shouldReduceMotion ? staticListVariants : listVariants}
      >
        {children}
      </m.ul>
    </LazyMotion>
  );
};

export const StaggerItem = ({ children, className }: StaggerProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.li
      className={className}
      variants={shouldReduceMotion ? staticItemVariants : itemVariants}
    >
      {children}
    </m.li>
  );
};
