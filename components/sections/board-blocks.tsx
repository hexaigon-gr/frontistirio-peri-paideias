import type { ReactNode } from "react";

import { cn } from "@/lib/general/utils";

/**
 * The building blocks every inner page is assembled from. They are deliberately
 * not cards: on a blackboard the surface itself is the container, so headings
 * get a freehand rule and groups get a hand-drawn frame instead of a box with a
 * drop shadow.
 */

interface BoardSectionProps {
  children: ReactNode;
  className?: string;
  /** `deep` alternates the surface so long pages do not read as one slab. */
  tone?: "board" | "deep";
  id?: string;
}

export const BoardSection = ({ children, className, tone = "board", id }: BoardSectionProps) => (
  <section
    id={id}
    className={cn(
      "board-texture relative isolate overflow-hidden",
      tone === "deep" ? "bg-board-deep" : "bg-board",
      className,
    )}
  >
    <div className="relative mx-auto w-full max-w-[84rem] px-5 py-16 sm:px-8 md:py-24">
      {children}
    </div>
  </section>
);

/** A freehand rule, redrawn slightly differently depending on the width given. */
export const ChalkRule = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 240 6"
    preserveAspectRatio="none"
    aria-hidden
    focusable="false"
    filter="url(#chalk-rough-soft)"
    className={className}
  >
    <path
      d="M2 4c40-3 78-4 118-3 38 1 78 2 118 4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

interface ChalkHeadingProps {
  title: string;
  intro?: string;
  className?: string;
}

export const ChalkHeading = ({ title, intro, className }: ChalkHeadingProps) => (
  <div className={cn("max-w-[46ch]", className)}>
    <h2 className="font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.06] font-black tracking-[-0.01em] text-chalk">
      {title}
    </h2>
    <ChalkRule className="mt-3 h-1.5 w-28 text-yellow" />
    {intro ? <p className="mt-5 leading-[1.75] text-chalk-dim">{intro}</p> : null}
  </div>
);

/**
 * A rectangle drawn by hand, four strokes that stop short of the corners the way
 * a chalked frame never closes cleanly.
 *
 * Each edge is its own SVG so it only ever stretches along its own axis. Drawing
 * the whole frame in one stretched viewBox bows the vertical strokes into arcs
 * as soon as the box is wider than it is tall. `non-scaling-stroke` keeps the
 * chalk the same weight on every edge.
 */
const EDGE_STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  vectorEffect: "non-scaling-stroke",
} as const;

export const ChalkFrame = ({ className }: { className?: string }) => (
  <span aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
    <svg
      viewBox="0 0 200 6"
      preserveAspectRatio="none"
      filter="url(#chalk-rough-soft)"
      className="absolute inset-x-0 top-0 h-1.5 w-full"
    >
      <path d="M3 4C54 1.8 128 1.4 197 3.2" {...EDGE_STROKE} />
    </svg>
    <svg
      viewBox="0 0 200 6"
      preserveAspectRatio="none"
      filter="url(#chalk-rough-soft)"
      className="absolute inset-x-0 bottom-0 h-1.5 w-full"
    >
      <path d="M4 2.6C58 4.6 132 4.4 196 2.4" {...EDGE_STROKE} />
    </svg>
    <svg
      viewBox="0 0 6 200"
      preserveAspectRatio="none"
      filter="url(#chalk-rough-soft)"
      className="absolute inset-y-0 left-0 h-full w-1.5"
    >
      <path d="M4 4C2.2 62 2.6 132 3.4 196" {...EDGE_STROKE} />
    </svg>
    <svg
      viewBox="0 0 6 200"
      preserveAspectRatio="none"
      filter="url(#chalk-rough-soft)"
      className="absolute inset-y-0 right-0 h-full w-1.5"
    >
      <path d="M2.6 3C4.4 58 4 130 3 197" {...EDGE_STROKE} />
    </svg>
  </span>
);
