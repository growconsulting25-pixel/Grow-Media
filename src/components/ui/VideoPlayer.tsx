"use client";

import { useState } from "react";
import type { ExampleVideo } from "@/config/media";
import { useI18n } from "@/i18n/I18nProvider";
import { interpolate } from "@/i18n/interpolate";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

interface Props {
  video: ExampleVideo;
  title: string;
  /** Load the iframe immediately (e.g. inside a modal the user just opened). */
  autoplay?: boolean;
  className?: string;
  location?: string;
  /** Overrides the box shape (e.g. a tall card); the poster is cropped to fit. */
  aspectClass?: string;
  /** Shown over the poster until the video plays (e.g. a card caption). */
  overlay?: React.ReactNode;
}

/**
 * Lightweight YouTube facade: shows the poster only and swaps in the
 * privacy-enhanced iframe on demand. No third-party JS until the user plays.
 */
export function VideoPlayer({ video, title, autoplay, className, location = "inline", aspectClass, overlay }: Props) {
  const { dict } = useI18n();
  const [active, setActive] = useState(!!autoplay);
  const [poster, setPoster] = useState<string | null>(`https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`);
  const aspect = aspectClass ?? (video.aspect === "9:16" ? "aspect-[9/16]" : "aspect-video");

  const play = () => {
    setActive(true);
    track("example_video_play", { video: video.id, location });
  };

  return (
    <div className={cn("relative overflow-hidden bg-ink-950", aspect, className)}>
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={play}
          aria-label={interpolate(dict.examples.playLabel, { title })}
          className="group absolute inset-0 size-full"
        >
          <span aria-hidden className="absolute inset-0 bg-ink-800" />
          {/* eslint-disable-next-line @next/next/no-img-element -- remote poster, facade pattern */}
          {poster && <img
            src={poster}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setPoster((p) => (p?.includes("maxres") ? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg` : null))}
            className="absolute inset-0 size-full object-cover opacity-90 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
          />}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/10" />
          <span
            aria-hidden
            className="btn-primary absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ring-8 ring-white/10 transition-transform duration-500 group-hover:scale-105"
          >
            <Icon name="play" className="size-6 translate-x-0.5" fill="currentColor" />
          </span>
          {overlay}
        </button>
      )}
    </div>
  );
}
