/**
 * Visual assets: free Pexels photography (pexels.com/license), chosen to feel
 * like everyday listings — family homes, townhouses, bright simple interiors —
 * plus real estate agents with clients. Replace with the company's own
 * listings any time. Every image renders on a tonal fallback so a missing file
 * never breaks a layout.
 */
const pexels = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;

export type ImageAlt =
  | "exterior" | "frontYard" | "twoStory" | "townhouse" | "street" | "facade"
  | "kitchen" | "living" | "bedroom" | "dining" | "interior"
  | "agentWoman" | "agentMan" | "agentPhone" | "keys" | "handshake" | "showing";

export interface PropertyImage {
  src: string;
  /** Localized alt text key in `dict.media.alt`. */
  alt: ImageAlt;
  /** Tonal fallback (shown while loading / on error). */
  tone: string;
  /** CSS object-position, for portraits whose subject isn't centered. */
  focus?: string;
}

export const propertyImages = {
  // Homes — affordable, family-scale properties
  exterior: { src: pexels(8031873), alt: "exterior", tone: "#2c3540" },
  frontYard: { src: pexels(8894802), alt: "frontYard", tone: "#2d3a33" },
  twoStory: { src: pexels(4030036), alt: "twoStory", tone: "#2c3540" },
  townhouse: { src: pexels(12008034), alt: "townhouse", tone: "#34302c" },
  street: { src: pexels(8504300), alt: "street", tone: "#2c3540" },
  facade: { src: pexels(5353883), alt: "facade", tone: "#2c3540" },
  // Interiors — bright, simple, lived-in
  kitchen: { src: pexels(7168013), alt: "kitchen", tone: "#3a3833" },
  living: { src: pexels(4468806), alt: "living", tone: "#3a3530" },
  bedroom: { src: pexels(4792349), alt: "bedroom", tone: "#3a3530" },
  dining: { src: pexels(4713242), alt: "dining", tone: "#3a3833" },
  interior: { src: pexels(5825398), alt: "interior", tone: "#3a3530" },
  // People — real estate professionals and their clients
  agentWoman: { src: pexels(8293766), alt: "agentWoman", tone: "#2b3440", focus: "center 25%" },
  agentMan: { src: pexels(8815878), alt: "agentMan", tone: "#2a2f38", focus: "center 20%" },
  agentPhone: { src: pexels(12432832), alt: "agentPhone", tone: "#2e3238", focus: "center 30%" },
  keys: { src: pexels(8815915), alt: "keys", tone: "#2f2d2a", focus: "center 35%" },
  handshake: { src: pexels(7641899), alt: "handshake", tone: "#2c3036" },
  showing: { src: pexels(7937330), alt: "showing", tone: "#2c3036" },
} satisfies Record<string, PropertyImage>;

export type PropertyImageKey = keyof typeof propertyImages;

/** Builds a responsive image URL (Pexels and Unsplash CDNs resize on the fly). */
export function imageUrl(src: string, width: number, quality = 82) {
  if (src.includes("images.pexels.com")) return `${src}?auto=compress&cs=tinysrgb&w=${width}`;
  if (src.includes("images.unsplash.com")) return `${src}?auto=format&fit=crop&w=${width}&q=${quality}`;
  return src;
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
