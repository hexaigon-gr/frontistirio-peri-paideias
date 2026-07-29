"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { ChalkFrame } from "@/components/sections/board-blocks";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { type GalleryImage } from "@/lib/general/gallery-blur";

export interface GalleryItem extends GalleryImage {
  slug: string;
  caption: string;
}

interface GalleryGridProps {
  items: GalleryItem[];
}

/** Matches the arrows. The dialog's own 16px glyph vanishes against a photo. */
const CONTROL =
  "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-chalk/20 bg-board-deep/80 text-chalk backdrop-blur transition-colors duration-200 hover:border-yellow/60 hover:text-yellow disabled:pointer-events-none disabled:opacity-30";

export const GalleryGrid = ({ items }: GalleryGridProps) => {
  const t = useTranslations("Gallery");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const current = openIndex === null ? null : items[openIndex];

  const step = useCallback(
    (direction: number) => {
      setOpenIndex((index) => {
        if (index === null) return index;
        return (index + direction + items.length) % items.length;
      });
    },
    [items.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openIndex, step]);

  return (
    <>
      {/* CSS columns, so every photo keeps its own proportions. These are 9:20
          phone frames and cropping them to a tidy grid would throw away most of
          each room. */}
      <div className="columns-2 gap-3 md:columns-3 md:gap-4 xl:columns-4">
        {items.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`${t("open")}: ${item.caption}`}
            className="group relative mb-3 block w-full cursor-pointer overflow-hidden break-inside-avoid md:mb-4"
          >
            <Image
              src={item.src}
              alt={item.caption}
              width={item.width}
              height={item.height}
              placeholder="blur"
              blurDataURL={item.blurDataURL}
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />

            <span className="absolute inset-0 bg-board-deep/25 transition-opacity duration-300 group-hover:opacity-0" />
            <ChalkFrame className="text-chalk/25" />

            <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-linear-to-t from-board-deep/90 to-transparent px-3 pt-8 pb-3 text-left text-[0.8rem] leading-snug text-chalk opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {item.caption}
            </span>
          </button>
        ))}
      </div>

      <Dialog open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-board-deep/94 backdrop-blur-sm"
          className="flex max-h-[92svh] w-full max-w-[min(96vw,72rem)] flex-col gap-4 border-chalk/15 bg-board-deep/95 p-4 backdrop-blur sm:max-w-[min(94vw,72rem)] sm:p-6"
        >
          {current ? (
            <>
              <DialogTitle className="sr-only">{current.caption}</DialogTitle>

              <div className="relative flex min-h-0 flex-1 items-center justify-center">
                <Image
                  src={current.src}
                  alt={current.caption}
                  width={current.width}
                  height={current.height}
                  placeholder="blur"
                  blurDataURL={current.blurDataURL}
                  sizes="(max-width: 768px) 92vw, 72rem"
                  className="max-h-[70svh] w-auto max-w-full object-contain"
                  priority
                />
              </div>

              <div className="flex shrink-0 items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm text-chalk sm:text-base">{current.caption}</p>
                  <p className="mt-0.5 font-display text-xs tabular-nums text-chalk-faint">
                    {t("counter", { current: (openIndex ?? 0) + 1, total: items.length })}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    className={CONTROL}
                    aria-label={t("previous")}
                    onClick={() => step(-1)}
                  >
                    <ChevronLeft className="size-5" strokeWidth={2.2} />
                  </button>
                  <button
                    type="button"
                    className={CONTROL}
                    aria-label={t("next")}
                    onClick={() => step(1)}
                  >
                    <ChevronRight className="size-5" strokeWidth={2.2} />
                  </button>
                  <button
                    type="button"
                    className={CONTROL}
                    aria-label={t("close")}
                    onClick={() => setOpenIndex(null)}
                  >
                    <X className="size-5" strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};
