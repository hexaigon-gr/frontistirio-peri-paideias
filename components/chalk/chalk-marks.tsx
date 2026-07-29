import type { SVGProps } from "react";

/**
 * Chalk marks drawn by hand as SVG paths, not icons from a set.
 *
 * Every mark borrows the vocabulary of the client's own roll-up banners: the
 * lightbulb, the conical flask, the atom, the paper plane and the set square
 * are the doodles already printed behind their students. The rough filter
 * displaces each stroke with fractal noise so the edge crumbles the way chalk
 * does on slate, which is what stops these from reading as clip art.
 */

const STROKE: SVGProps<SVGSVGElement> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/** Rendered once per page. Every mark references the filter by id. */
export const ChalkDefs = () => (
  <svg aria-hidden className="pointer-events-none absolute size-0" focusable="false">
    <defs>
      <filter id="chalk-rough" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" seed="11" result="grain" />
        <feDisplacementMap in="SourceGraphic" in2="grain" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="chalk-rough-soft" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="3" seed="5" result="grain" />
        <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

const Mark = ({ children, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" aria-hidden focusable="false" filter="url(#chalk-rough)" {...STROKE} {...props}>
    {children}
  </svg>
);

export const ChalkBulb = (props: SVGProps<SVGSVGElement>) => (
  <Mark {...props}>
    <path d="M50 14c-16 0-27 12-27 26 0 9 5 15 9 20 3 4 4 7 4 11h28c0-4 1-7 4-11 4-5 9-11 9-20 0-14-11-26-27-26Z" />
    <path d="M37 78h26M39 86h22" />
    <path d="M42 62c3-7 5-10 8-4 3 6 5 1 8-5" />
    <path d="M13 24 6 18M87 24l7-6M8 54H1M92 54h7" />
  </Mark>
);

export const ChalkAtom = (props: SVGProps<SVGSVGElement>) => (
  <Mark {...props}>
    <ellipse cx="50" cy="50" rx="46" ry="17" />
    <ellipse cx="50" cy="50" rx="46" ry="17" transform="rotate(60 50 50)" />
    <ellipse cx="50" cy="50" rx="46" ry="17" transform="rotate(120 50 50)" />
    <circle cx="50" cy="50" r="6" fill="currentColor" stroke="none" />
  </Mark>
);

export const ChalkFlask = (props: SVGProps<SVGSVGElement>) => (
  <Mark {...props}>
    <path d="M39 9v25L18 76c-3 7 2 14 9 14h46c7 0 12-7 9-14L61 34V9" />
    <path d="M34 9h32" />
    <path d="M28 63c6-3 10 3 16 0s10 3 16 0 8 2 12 1" />
    <circle cx="43" cy="46" r="3.5" />
    <circle cx="57" cy="27" r="2.5" />
  </Mark>
);

export const ChalkPlane = (props: SVGProps<SVGSVGElement>) => (
  <Mark {...props}>
    <path d="M5 44 95 8 58 95 45 58Z" />
    <path d="M95 8 45 58" />
  </Mark>
);

export const ChalkPlus = (props: SVGProps<SVGSVGElement>) => (
  <Mark {...props}>
    <path d="M14 49c22-3 50-3 72 1" />
    <path d="M49 13c3 24 3 50 0 74" />
  </Mark>
);

export const ChalkSetSquare = (props: SVGProps<SVGSVGElement>) => (
  <Mark {...props}>
    <path d="M22 88 58 11l28 77Z" />
    <path d="M64 28l7-3M69 42l8-3M74 56l8-3M79 70l8-3" />
  </Mark>
);

export const ChalkPi = (props: SVGProps<SVGSVGElement>) => (
  <Mark {...props}>
    <path d="M13 29c22-4 52-5 74-1" />
    <path d="M33 29c2 18 1 34-4 48" />
    <path d="M66 29c-2 17-3 32-1 43 1 6 8 7 13 2" />
  </Mark>
);

/** Curved chalk arrow used to point at the call button. */
export const ChalkArrow = (props: SVGProps<SVGSVGElement>) => (
  <Mark {...props} strokeWidth={3}>
    <path d="M6 8c16 30 32 48 66 58" />
    <path d="M56 56 72 67 60 82" />
  </Mark>
);

/**
 * The stroke under the emphasised word. Two overlapping passes, because nobody
 * underlines something on a board in one clean line.
 */
export const ChalkUnderline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 300 22"
    preserveAspectRatio="none"
    aria-hidden
    focusable="false"
    filter="url(#chalk-rough-soft)"
    {...STROKE}
    strokeWidth={5}
    {...props}
  >
    <path
      className="chalk-stroke"
      style={{ "--stroke-length": 320, "--stroke-delay": "0.55s" } as React.CSSProperties}
      d="M4 13c48-6 104-8 152-7 46 1 94 4 141 9"
    />
    <path
      className="chalk-stroke"
      style={{ "--stroke-length": 300, "--stroke-delay": "0.72s" } as React.CSSProperties}
      strokeWidth={2.4}
      opacity={0.55}
      d="M14 19c54-5 112-6 160-5 38 1 76 3 112 6"
    />
  </svg>
);
