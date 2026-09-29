"use client";

import { useState } from "react";
import { imageUrl, propertyImages, type PropertyImageKey } from "@/config/media";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/cn";

interface Props {
  name: PropertyImageKey;
  /** Rendered width hint in CSS px, used to build the srcset. */
  width?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  decorative?: boolean;
}

/**
 * Property photo with responsive srcset and a tonal fallback, so layouts hold
 * even when an image is slow or unavailable.
 */
export function Photo({ name, width = 800, sizes, priority, className, imgClassName, decorative }: Props) {
  const { dict } = useI18n();
  const image = propertyImages[name];
  const [failed, setFailed] = useState(false);
  const widths = [Math.round(width / 2), width, width * 2];

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ background: `radial-gradient(120% 90% at 30% 20%, ${image.tone}, #0d0d15)` }}
    >
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element -- remote CDN handles resizing via srcset
        <img
          src={imageUrl(image.src, width)}
          srcSet={widths.map((w) => `${imageUrl(image.src, w)} ${w}w`).join(", ")}
          sizes={sizes ?? `${width}px`}
          alt={decorative ? "" : dict.media.alt[image.alt]}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onError={() => setFailed(true)}
          className={cn("absolute inset-0 size-full object-cover", imgClassName)}
        />
      )}
    </div>
  );
}
