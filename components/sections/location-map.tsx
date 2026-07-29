import { ArrowUpRight, Navigation } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { ChalkFrame } from "@/components/sections/board-blocks";
import { BUSINESS } from "@/lib/general/constants";

/**
 * A real map, not a decoration.
 *
 * `components/expand-map.tsx` draws an invented street grid with a pin in the
 * middle, which is fine as an ornament and actively misleading when the point of
 * the section is "here is where we are". This renders OpenStreetMap data for the
 * actual coordinates, rendered dark so it sits on the board, with the pin placed
 * on the exact point the tiles were centred on.
 *
 * The image is generated offline and committed. If the coordinates change, it has
 * to be regenerated: see `tasks/todo.md`.
 */

/** Where the coordinate falls inside the generated crop. */
const PIN_POSITION = { left: "50%", top: "50.05%" };

export const LocationMap = async () => {
  const t = await getTranslations("Contact");
  const { address, coordinates, name } = BUSINESS;

  const point = `${coordinates.lat},${coordinates.lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${point}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${point}`;

  return (
    <div>
      <div className="relative aspect-16/10 w-full overflow-hidden sm:aspect-21/9">
        <Image
          src="/images/map/venerato.jpg"
          alt={t("mapAlt", { area: address.area })}
          fill
          sizes="(max-width: 1024px) 100vw, 84rem"
          className="object-cover"
        />

        {/* Fades the tiles into the board so the map does not sit on the page as a
            bright rectangle pasted on slate. */}
        <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-board/25 to-board/85" />

        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={PIN_POSITION}
        >
          <span className="relative flex size-24 items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              aria-hidden
              focusable="false"
              filter="url(#chalk-rough)"
              className="absolute inset-0 size-full text-yellow"
            >
              <circle
                cx="50"
                cy="50"
                r="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity="0.75"
              />
              <circle cx="50" cy="50" r="9" fill="currentColor" />
            </svg>
          </span>
          <span className="absolute top-full left-1/2 mt-1 -translate-x-1/2 font-chalk text-lg whitespace-nowrap text-yellow">
            {name}
          </span>
        </div>

        <ChalkFrame className="text-chalk/30" />
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-display text-xl font-bold text-chalk sm:text-2xl">
            {address.street ? `${address.street}, ` : ""}
            {address.area}
          </p>
          <p className="mt-1.5 text-chalk-dim">
            {address.postalCode} {address.city}
          </p>
          {address.street ? null : (
            <p className="mt-3 max-w-[46ch] text-[0.9rem] leading-[1.7] text-chalk-faint">
              {t("addressPending")}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex cursor-pointer items-center gap-2.5 rounded-full bg-yellow px-6 py-3.5 font-display text-base font-extrabold tracking-wide text-board-deep transition-transform duration-200 hover:-translate-y-0.5"
          >
            <Navigation
              className="size-4.5 shrink-0 transition-transform duration-300 group-hover:rotate-12"
              strokeWidth={2.5}
            />
            {t("directions")}
          </a>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex cursor-pointer items-center gap-2 px-2 py-3 font-medium text-chalk-dim transition-colors duration-200 hover:text-chalk"
          >
            {t("openInMaps")}
            <ArrowUpRight className="size-4.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      <p className="mt-6 text-xs text-chalk-faint/70">{t("mapAttribution")}</p>
    </div>
  );
};
