import { ArrowUpRight, Navigation } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { ChalkFrame } from "@/components/sections/board-blocks";
import { BUSINESS } from "@/lib/general/constants";
/* Static import, not a string path. next/image caches optimised output by URL, so
   regenerating the map in place keeps serving the old bytes. A static import gives
   the file a content hash, and the URL changes whenever the map does. */
import mapImage from "@/public/images/map/venerato.jpg";

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
  const { address, mapLabel, mapsQuery, name } = BUSINESS;

  const query = encodeURIComponent(mapsQuery);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div>
      <div className="relative aspect-4/3 w-full overflow-hidden sm:aspect-16/10 lg:aspect-9/5">
        <Image
          src={mapImage}
          alt={t("mapAlt", { area: address.area })}
          fill
          sizes="(max-width: 1024px) 100vw, 84rem"
          placeholder="blur"
          className="object-cover"
        />

        {/* Only the outer edge is faded. Anything stronger swallows the road
            network, which is the whole point of showing a map. */}
        <div className="pointer-events-none absolute inset-0 bg-radial from-transparent from-70% to-board/50" />

        {/* The tiles carry no place names, so the village is named in chalk here. */}
        <span className="pointer-events-none absolute bottom-5 left-5 font-display text-sm font-bold tracking-[0.28em] text-chalk/45 uppercase sm:bottom-7 sm:left-8 sm:text-base">
          {mapLabel}
        </span>

        <div className="pointer-events-none absolute" style={PIN_POSITION}>
          {/* The marker sits on the coordinate, the name hangs off it on a leader
              line so the two never overlap. */}
          <span className="absolute -translate-x-1/2 -translate-y-1/2">
            <svg
              viewBox="0 0 120 120"
              aria-hidden
              focusable="false"
              filter="url(#chalk-rough)"
              className="size-20 text-yellow sm:size-28"
            >
              <circle
                cx="60"
                cy="60"
                r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeDasharray="120 26"
              />
              <circle cx="60" cy="60" r="8.5" fill="currentColor" />
              <path
                d="M60 30V13M60 107V90M30 60H13M107 60H90"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
          </span>

          {/* Beside the marker where there is room, tucked underneath it on a
              phone, where a right-hand label runs off the edge of the map. */}
          <span className="absolute top-12 left-1/2 flex -translate-x-1/2 items-center gap-2 sm:top-1.5 sm:left-14 sm:translate-x-0">
            <span className="hidden h-px w-10 bg-yellow/70 sm:block" />
            <span className="font-chalk text-lg whitespace-nowrap text-yellow sm:text-2xl">
              {name}
            </span>
          </span>
        </div>

        <ChalkFrame className="text-chalk/30" />
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="max-w-[26ch] font-display text-xl font-bold text-chalk sm:text-2xl">
            {address.street}
          </p>
          <p className="mt-1.5 text-chalk-dim">
            {address.area}, {address.postalCode} {address.city}
          </p>
          <p className="mt-3 max-w-[46ch] text-[0.9rem] leading-[1.7] text-chalk-faint">
            {t("addressPending")}
          </p>
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
