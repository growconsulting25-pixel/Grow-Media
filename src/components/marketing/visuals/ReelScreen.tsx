"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import type { PropertyImageKey } from "@/config/media";
import { cn } from "@/lib/cn";

export interface ReelContent {
  handle?: string;
  badge?: string;
  price?: string;
  caption?: string;
  cta?: string;
  agent?: string;
  audio?: string;
}

interface Props {
  images: PropertyImageKey[];
  content: ReelContent;
  /** ms per shot */
  interval?: number;
  /** Hide social chrome (icons/progress) for tighter compositions. */
  minimal?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * A vertical social video, simulated: cross-fading shots with a slow
 * Ken Burns move, story progress, captions and agent branding. Pauses when
 * off-screen or when the user prefers reduced motion.
 */
export function ReelScreen({ images, content, interval = 3200, minimal, className, priority, sizes = "320px" }: Props) {
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting && !reduce.matches), { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running || images.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => window.clearInterval(id);
  }, [running, images.length, interval]);

  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden bg-black text-white", className)}>
      {images.map((name, i) => (
        <div
          key={name + i}
          aria-hidden={i !== index}
          className={cn("absolute inset-0 transition-opacity duration-[1200ms] ease-in-out", i === index ? "opacity-100" : "opacity-0")}
        >
          <Photo
            name={name}
            width={480}
            sizes={sizes}
            priority={priority && i === 0}
            decorative
            className="size-full"
            imgClassName={cn(running && i === index && "animate-kenburns")}
          />
        </div>
      ))}

      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/80" />

      {!minimal && (
        <div className="absolute inset-x-3 top-9 flex gap-1" aria-hidden>
          {images.map((_, i) => (
            <span key={i} className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/30">
              <span
                key={`${index}-${i}`}
                className="block h-full origin-left bg-white"
                style={{
                  transform: i < index ? "scaleX(1)" : "scaleX(0)",
                  animation: i === index && running ? `reel-progress ${interval}ms linear forwards` : undefined,
                }}
              />
            </span>
          ))}
        </div>
      )}

      {content.badge && (
        <div className="absolute top-14 left-3 flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[0.62rem] font-semibold tracking-wide uppercase backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-orchid-400" />
          {content.badge}
        </div>
      )}

      {!minimal && (
        <div className="absolute right-2.5 bottom-24 flex flex-col items-center gap-3.5 text-white/90" aria-hidden>
          <Icon name="heart" className="size-5" />
          <Icon name="comment" className="size-5" />
          <Icon name="send" className="size-[1.1rem]" />
          <Icon name="bookmark" className="size-5" />
        </div>
      )}

      <div className="absolute inset-x-3 bottom-3.5">
        {content.price && <p className="text-[1.35rem] leading-none font-semibold tracking-tight">{content.price}</p>}
        {content.caption && <p className="mt-1.5 text-[0.7rem] font-medium text-white/90">{content.caption}</p>}
        {content.cta && (
          <p className="mt-2.5 inline-flex rounded-full bg-white px-2.5 py-1 text-[0.62rem] font-semibold text-ink-900">{content.cta}</p>
        )}
        {(content.agent || content.audio) && (
          <div className="mt-2.5 flex items-center gap-2 border-t border-white/15 pt-2">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-orchid-400 text-[0.5rem] font-bold">GM</span>
            <div className="min-w-0 text-[0.58rem] leading-tight">
              {content.agent && <p className="truncate font-medium">{content.agent}</p>}
              {content.audio && (
                <p className="flex items-center gap-1 truncate text-white/70">
                  <Icon name="music" className="size-2.5" /> {content.audio}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes reel-progress { from { transform: scaleX(0) } to { transform: scaleX(1) } }`}</style>
    </div>
  );
}
