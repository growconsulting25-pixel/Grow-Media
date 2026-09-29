import type { SVGProps } from "react";

/** Small, consistent line-icon set (1.6px stroke). Only what the UI uses. */
const paths = {
  check: "M4 10.5 8 14.5 16 5.5",
  play: "M7 4.5v11l9-5.5z",
  upload: "M10 13V3.5M6 7l4-4 4 4M3.5 13v2.5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V13",
  download: "M10 3.5V13M6 9.5l4 4 4-4M3.5 16.5h13",
  share: "M13.5 6.5 10 3 6.5 6.5M10 3v10M5 10H4.5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H15",
  revise: "M3.5 10a6.5 6.5 0 1 0 2-4.7M3.5 3.5v3.3h3.3",
  music: "M7.5 15V4.5l9-1.5V13.5M7.5 15a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm9-1.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
  sparkle: "M10 2.5c.5 3.8 3.7 7 7.5 7.5-3.8.5-7 3.7-7.5 7.5-.5-3.8-3.7-7-7.5-7.5 3.8-.5 7-3.7 7.5-7.5Z",
  clock: "M10 17.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM10 6v4l2.5 2",
  layers: "m10 3 7.5 4L10 11 2.5 7 10 3Zm-7.5 7L10 14l7.5-4M2.5 13 10 17l7.5-4",
  palette: "M10 17.5a7.5 7.5 0 1 1 7.5-7.5c0 2-1.7 2.5-3 2.5h-1.8a1.5 1.5 0 0 0-1 2.6c.7.7.2 2.4-1.7 2.4ZM6.5 9.5h0M9 6.5h0M12.5 7h0",
  calendar: "M4.5 4.5h11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1ZM3.5 8.5h13M7 2.5v3M13 2.5v3",
  scale: "M3.5 16.5h13M5.5 16.5v-5M10 16.5V7M14.5 16.5V3.5",
  coins: "M10 8c3.6 0 6.5-1.1 6.5-2.5S13.6 3 10 3 3.5 4.1 3.5 5.5 6.4 8 10 8Zm6.5-2.5v4.5c0 1.4-2.9 2.5-6.5 2.5s-6.5-1.1-6.5-2.5V5.5m13 4.5v4.5C16.5 15.9 13.6 17 10 17s-6.5-1.1-6.5-2.5V10",
  phone: "M6.5 2.5h7a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1ZM9 15h2",
  cube: "m10 2.5 6.5 3.75v7.5L10 17.5l-6.5-3.75v-7.5L10 2.5Zm0 7.5 6.5-3.75M10 10v7.5M10 10 3.5 6.25",
  user: "M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6.5 7.5c0-3 2.9-5 6.5-5s6.5 2 6.5 5",
  megaphone: "M3.5 8v4h2.5l6 3.5v-11L6 8H3.5Zm11 -.5c.9.6 1.5 1.5 1.5 2.5s-.6 1.9-1.5 2.5M6 12l1 4.5",
  image: "M4.5 3.5h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Zm-1 10 4-4 3 3 2-2 4 4M13 7.5h0",
  plus: "M10 4v12M4 10h12",
  minus: "M4 10h12",
  close: "M5 5l10 10M15 5 5 15",
  menu: "M3.5 6.5h13M3.5 13.5h13",
  heart: "M10 16.5s-6.5-3.8-6.5-8.3A3.5 3.5 0 0 1 10 6.3a3.5 3.5 0 0 1 6.5 1.9c0 4.5-6.5 8.3-6.5 8.3Z",
  comment: "M4 4.5h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9l-4 3v-3H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z",
  send: "m17 3-7.5 14-2-6.5L1 8.5 17 3Z",
  bookmark: "M5.5 3.5h9v13.5L10 13.5 5.5 17V3.5Z",
  eye: "M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Zm8.5 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  arrowRight: "M4 10h12m-4.5-4.5L16 10l-4.5 4.5",
  arrowDown: "M10 4v12m-4.5-4.5L10 16l4.5-4.5",
  bell: "M5 8.5a5 5 0 0 1 10 0c0 4 1.5 5.5 1.5 5.5h-13S5 12.5 5 8.5ZM8.5 16.5a1.6 1.6 0 0 0 3 0",
  paperclip: "m16 9.5-6.2 6.2a3.5 3.5 0 0 1-5-5l6.4-6.4a2.3 2.3 0 0 1 3.3 3.3l-6.3 6.3a1.2 1.2 0 0 1-1.7-1.7l5.6-5.6",
  google: "",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-4", ...rest }: { name: IconName } & SVGProps<SVGSVGElement>) {
  if (name === "google") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className} {...rest}>
        <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.8-5.4 3.8-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z" />
      </svg>
    );
  }
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} {...rest}>
      <path d={paths[name]} />
    </svg>
  );
}
