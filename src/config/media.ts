/**
 * Visual assets. Property photography is placeholder imagery (Unsplash) and is
 * meant to be replaced with the company's own listings. Every image renders on
 * top of a tonal fallback so a missing file never breaks a layout.
 */
const unsplash = (id: string) => `https://images.unsplash.com/${id}`;

export interface PropertyImage {
  src: string;
  /** Localized alt text key in `dict.media.alt`. */
  alt: "exterior" | "pool" | "kitchen" | "living" | "bedroom" | "dining" | "facade" | "interior";
  /** Tonal fallback (shown while loading / on error). */
  tone: string;
}

export const propertyImages = {
  exterior: { src: unsplash("photo-1600596542815-ffad4c1539a9"), alt: "exterior", tone: "#2a2f3a" },
  pool: { src: unsplash("photo-1613490493576-7fde63acd811"), alt: "pool", tone: "#23303b" },
  kitchen: { src: unsplash("photo-1600566753190-17f0baa2a6c3"), alt: "kitchen", tone: "#3a3530" },
  living: { src: unsplash("photo-1600210492486-724fe5c67fb0"), alt: "living", tone: "#34302c" },
  bedroom: { src: unsplash("photo-1616594039964-ae9021a400a0"), alt: "bedroom", tone: "#2f2c2b" },
  dining: { src: unsplash("photo-1600607687939-ce8a6c25118c"), alt: "dining", tone: "#322f2d" },
  facade: { src: unsplash("photo-1600585154340-be6161a56a0c"), alt: "facade", tone: "#27303a" },
  interior: { src: unsplash("photo-1600573472550-8090b5e0745e"), alt: "interior", tone: "#33302e" },
} satisfies Record<string, PropertyImage>;

export type PropertyImageKey = keyof typeof propertyImages;

/** Builds a responsive Unsplash URL. Non-Unsplash sources are returned as-is. */
export function imageUrl(src: string, width: number, quality = 70) {
  if (!src.includes("images.unsplash.com")) return src;
  return `${src}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

/**
 * Real example videos produced by the team (YouTube). `aspect` controls how the
 * player frames them; switch to "9:16" for vertical Shorts.
 */
export interface ExampleVideo {
  id: string;
  youtubeId: string;
  aspect: "16:9" | "9:16";
  /** Localized title/description key in `dict.examples.items`. */
  key: "one" | "two" | "three";
}

export const exampleVideos: ExampleVideo[] = [
  { id: "example-1", youtubeId: "R0yi4eWtbxk", aspect: "16:9", key: "one" },
  { id: "example-2", youtubeId: "2C9Ai9C0fss", aspect: "16:9", key: "two" },
  { id: "example-3", youtubeId: "3EtTOnG84zQ", aspect: "16:9", key: "three" },
];

export const featuredExample = exampleVideos[0];
