/**
 * Visual assets: free Pexels photography (pexels.com/license), chosen to feel
 * like everyday listings — family homes, townhouses, bright simple interiors —
 * plus real estate agents with clients. Replace with the company's own
 * listings any time. Every image renders on a tonal fallback so a missing file
 * never breaks a layout.
 */
const pexels = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;

export type ImageAlt =
  | "exterior" | "frontYard" | "twoStory" | "townhouse" | "street" | "facade" | "winter" | "forSale"
  | "kitchen" | "living" | "bedroom" | "dining" | "interior" | "bathroom" | "entrance"
  | "agentWoman" | "agentMan" | "agentPhone" | "keys" | "handshake" | "showing" | "couple" | "creator";

export interface PropertyImage {
  src: string;
  /** Localized alt text key in `dict.media.alt`. */
  alt: ImageAlt;
  /** Tonal fallback (shown while loading / on error). */
  tone: string;
  /** CSS object-position, for portraits whose subject isn't centered. */
  focus?: string;
}

const unsplash = (id: string) => `https://images.unsplash.com/${id}`;
const home = "#2c3540";
const room = "#3a3530";
const people = "#2b3036";
const snow = "#3a4450";

/**
 * Every homepage slot uses its own photo, so no image appears twice. Homes are
 * everyday $400k–700k family properties: bungalows, townhouses, two-storeys.
 */
export const propertyImages = {
  // Hero
  street: { src: pexels(8504300), alt: "street", tone: home },
  exterior: { src: pexels(8031873), alt: "exterior", tone: home },
  kitchen: { src: pexels(7168013), alt: "kitchen", tone: room },
  townhouse: { src: pexels(12008034), alt: "townhouse", tone: home },
  agentWoman: { src: pexels(8293766), alt: "agentWoman", tone: people, focus: "center 25%" },
  frontYard: { src: pexels(8894802), alt: "frontYard", tone: home },
  living: { src: pexels(4468806), alt: "living", tone: room },
  bedroom: { src: pexels(4792349), alt: "bedroom", tone: room },
  openKitchen: { src: pexels(4682120), alt: "kitchen", tone: room },
  garageHouse: { src: pexels(12700439), alt: "exterior", tone: home },
  // Transformation
  facade: { src: pexels(5353883), alt: "facade", tone: home },
  facadeSide: { src: pexels(5353890), alt: "facade", tone: home },
  dining: { src: pexels(4713242), alt: "dining", tone: room },
  whiteKitchen: { src: pexels(7027976), alt: "kitchen", tone: room },
  windowBedroom: { src: pexels(4740580), alt: "bedroom", tone: room },
  // Content engine
  garageFacade: { src: pexels(4030037), alt: "exterior", tone: home },
  sectional: { src: pexels(8583697), alt: "living", tone: room },
  islandKitchen: { src: pexels(2001944), alt: "kitchen", tone: room },
  brightKitchen: { src: pexels(15062155), alt: "kitchen", tone: room },
  minimalDining: { src: pexels(10164890), alt: "dining", tone: room },
  fireplace: { src: pexels(8583536), alt: "living", tone: room },
  forSaleSign: { src: pexels(7578855), alt: "forSale", tone: home },
  winterHouse: { src: pexels(4061594), alt: "winter", tone: snow },
  agentShowing: { src: pexels(7415064), alt: "showing", tone: people },
  stairs: { src: pexels(12700466), alt: "entrance", tone: room },
  blueLiving: { src: pexels(6510943), alt: "living", tone: room },
  woodHouse: { src: pexels(164522), alt: "exterior", tone: home },
  brickHouse: { src: pexels(4469146), alt: "twoStory", tone: home },
  agentMan: { src: pexels(8815878), alt: "agentMan", tone: people, focus: "center 20%" },
  // Benefits
  agentPhone: { src: pexels(12432832), alt: "agentPhone", tone: people, focus: "center 30%" },
  detached: { src: pexels(5008394), alt: "exterior", tone: home },
  lawnSign: { src: pexels(7578849), alt: "forSale", tone: home },
  cozyBedroom: { src: pexels(10554480), alt: "bedroom", tone: room },
  bathroom: { src: pexels(6956840), alt: "bathroom", tone: room },
  suburb: { src: pexels(10628458), alt: "street", tone: home },
  rowHouses: { src: pexels(18093637), alt: "townhouse", tone: home },
  sidingHouse: { src: pexels(4682081), alt: "exterior", tone: home },
  bungalow: { src: pexels(259588), alt: "exterior", tone: home },
  colorfulStreet: { src: pexels(31726753), alt: "street", tone: home },
  snowyYard: { src: pexels(16655113), alt: "winter", tone: snow },
  // Services
  houseForSale: { src: pexels(8482520), alt: "forSale", tone: home },
  interior: { src: pexels(5825398), alt: "interior", tone: room },
  ugcCreator: { src: unsplash("photo-1573496359142-b8d87734a5a2"), alt: "creator", tone: people, focus: "center 25%" },
  adsCreator: { src: unsplash("photo-1556157382-97eda2d62296"), alt: "agentPhone", tone: people, focus: "center 30%" },
  // How it works, results, final CTA
  entrance: { src: pexels(19227221), alt: "entrance", tone: home },
  snowStreet: { src: pexels(6220207), alt: "winter", tone: snow },
  openPlan: { src: pexels(7168076), alt: "dining", tone: room },
  pillowBed: { src: pexels(5825584), alt: "bedroom", tone: room },
  lightDining: { src: pexels(6180675), alt: "dining", tone: room },
  livingView: { src: pexels(6035357), alt: "living", tone: room },
  modernBath: { src: pexels(19846350), alt: "bathroom", tone: room },
  keysHandover: { src: pexels(7642008), alt: "keys", tone: people },
  twoStory: { src: pexels(4030036), alt: "twoStory", tone: home },
  // Client app
  keys: { src: pexels(8815915), alt: "keys", tone: "#2f2d2a", focus: "center 35%" },
} satisfies Record<string, PropertyImage>;

export type PropertyImageKey = keyof typeof propertyImages;

/**
 * Builds a responsive image URL (Pexels and Unsplash CDNs resize on the fly).
 * With `ratio` (width / height) the CDN crops to that shape, so tall frames —
 * phone screens, portraits — get a sharp crop instead of an upscaled landscape.
 */
export function imageUrl(src: string, width: number, ratio?: number, quality = 82) {
  const crop = ratio ? `&fit=crop&h=${Math.round(width / ratio)}` : "";
  if (src.includes("images.pexels.com")) return `${src}?auto=compress&cs=tinysrgb&w=${width}${crop}`;
  if (src.includes("images.unsplash.com")) return `${src}?auto=format&fit=crop&w=${width}${ratio ? `&h=${Math.round(width / ratio)}` : ""}&q=${quality}`;
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
