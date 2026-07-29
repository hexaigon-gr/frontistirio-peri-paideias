import { getTranslations } from "next-intl/server";

import { BoardSection, ChalkHeading } from "@/components/sections/board-blocks";
import { GalleryGrid, type GalleryItem } from "@/components/sections/gallery-grid";
import { GALLERY } from "@/lib/general/constants";
import { GALLERY_IMAGES } from "@/lib/general/gallery-blur";

/**
 * Server half of the gallery: it resolves the captions and the generated image
 * data, then hands a plain array to the client half that owns the lightbox
 * state. Splitting it this way keeps `getTranslations` on the server and ships
 * only the interactive part to the browser.
 */
export const Gallery = async () => {
  const t = await getTranslations("Gallery");

  const items: GalleryItem[] = GALLERY.map((slug) => ({
    slug,
    caption: t(`captions.${slug}`),
    ...GALLERY_IMAGES[slug],
  }));

  return (
    <BoardSection tone="deep" id="o-choros-mas">
      <ChalkHeading title={t("title")} intro={t("intro")} className="mb-12" />

      <GalleryGrid items={items} />
    </BoardSection>
  );
};
