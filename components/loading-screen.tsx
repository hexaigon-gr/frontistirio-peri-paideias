import { cn } from "@/lib/general/utils";

/**
 * The route-level loading fallback, shared by every `loading.tsx`.
 *
 * Three chalk dashes tapped out on the board, middle one yellow, rather than a
 * generic ring spinner. It is deliberately a synchronous Server Component with
 * no SVG filter dependency: a Suspense fallback has to be renderable the
 * instant the boundary suspends, and `ChalkDefs` only exists inside the site
 * layout, so a filtered mark would render unroughened under `/admin`.
 *
 * Only `opacity` and `transform` animate, so the fallback never costs a frame.
 */
const DASHES = [
  { delay: "0ms", tone: "bg-chalk/70" },
  { delay: "160ms", tone: "bg-yellow" },
  { delay: "320ms", tone: "bg-chalk/70" },
];

interface LoadingScreenProps {
  /** Announced to screen readers while the route resolves. */
  label?: string;
  className?: string;
}

export const LoadingScreen = ({ label = "Loading", className }: LoadingScreenProps) => (
  <div
    role="status"
    aria-label={label}
    className={cn(
      "board-texture flex min-h-svh items-center justify-center bg-board",
      className,
    )}
  >
    <div className="flex items-center gap-2.5">
      {DASHES.map((dash) => (
        <span
          key={dash.delay}
          className={cn("h-1.5 w-9 rounded-full motion-safe:animate-pulse", dash.tone)}
          style={{ animationDelay: dash.delay, animationDuration: "1.15s" }}
        />
      ))}
    </div>
  </div>
);
