import Image from "next/image";

import { PARTNER_LOGOS } from "@/lib/general/partner-logos";
import { cn } from "@/lib/general/utils";

interface PartnerLogoProps {
  /** A key of PARTNER_LOGOS. */
  logo: string;
  className?: string;
}

/**
 * An external organisation's mark, shown as a badge pinned to the board.
 *
 * The white plate is the whole point. These are the only saturated colours on
 * the site, and a partner's logo cannot be recoloured into chalk without
 * misrepresenting them, so instead of pretending it belongs to the palette the
 * plate declares that it does not: it reads as something applied to the board,
 * the way a real sticker would.
 *
 * Extracted rather than repeated, because the plate has to look identical
 * wherever a partner appears. Two copies of it drift.
 */
export const PartnerLogo = ({ logo, className }: PartnerLogoProps) => {
  const image = PARTNER_LOGOS[logo];

  if (!image) return null;

  return (
    <Image
      src={image}
      alt=""
      aria-hidden
      className={cn(
        "mb-4 h-20 w-auto shrink-0 rounded-md bg-white shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:mb-0",
        className,
      )}
    />
  );
};
