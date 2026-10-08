"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Container } from "@/components/ui/Container";

interface Chapter {
  eyebrow: string;
  title: string;
  body: string;
}

/** H.264 first (hardware decoding, Safari/iOS), VP9 for browsers without it. */
const pickSource = (mobile: boolean) => {
  const base = mobile ? "/hero/walkthrough-m" : "/hero/walkthrough";
  const h264 = document.createElement("video").canPlayType('video/mp4; codecs="avc1.640028"') !== "";
  return `${base}.${h264 ? "mp4" : "webm"}`;
};

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const smooth = (n: number) => {
  const x = clamp(n);
  return x * x * (3 - 2 * x);
};

/**
 * Scroll-scrubbed 3D walkthrough behind the homepage hero (ported from the
 * scroll-world skill's engine). The stage stays pinned while scroll drives the
 * video: façade → entrance → living room and kitchen → terrace, as one take.
 *
 * - The clip is fetched as a Blob (always seekable, no byte-range dependency),
 *   only after the page has painted, never under reduced motion or Save-Data.
 * - currentTime eases toward the scroll target in rAF; a new seek is never
 *   queued while the decoder is still seeking (keeps fast flicks smooth on phones).
 * - The poster stays visible until a real frame has painted (iOS paints nothing
 *   for a muted video that was never played; we also prime it on first touch).
 */
export function HeroWalkthrough({
  children,
  chapters,
  ctas = {},
  legSeconds,
  label,
  hint,
  demo,
}: {
  children: ReactNode;
  chapters: Chapter[];
  /** Calls to action shown with a chapter, by chapter index. */
  ctas?: Record<number, ReactNode>;
  /** Length of each shot in the film (façade first), so captions follow the rooms. */
  legSeconds?: number[];
  label: string;
  hint: string;
  demo: string;
}) {
  const trackRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    const video = videoRef.current;
    if (!track || !video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const mobile = coarse || window.matchMedia("(max-width: 860px)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    // Shot boundaries as fractions of the film: the façade shot, then one per chapter.
    const lengths = legSeconds ?? Array.from({ length: chapters.length + 1 }, () => 1);
    const total = lengths.reduce((a, b) => a + b, 0);
    const bounds = lengths.reduce<number[]>((acc, len) => [...acc, acc[acc.length - 1] + len / total], [0]);

    let target = 0;
    let cur = 0;
    let ready = false;
    let inView = true;
    let frame = 0;
    let objectUrl = "";
    let primed = false;
    let cancelled = false;

    const read = () => {
      const rect = track.getBoundingClientRect();
      const span = Math.max(1, rect.height - window.innerHeight);
      const p = clamp(-rect.top / span);
      target = p;

      if (introRef.current) {
        const o = smooth(1 - p / 0.08);
        introRef.current.style.opacity = String(o);
        introRef.current.style.transform = `translateY(${(-p * 12).toFixed(2)}vh)`;
        introRef.current.style.pointerEvents = o > 0.5 ? "auto" : "none";
      }
      if (veilRef.current) veilRef.current.style.opacity = String(0.12 + 0.63 * smooth(1 - p / 0.1));
      // The film is square; a wide screen shows a horizontal band of it. Keep the
      // whole façade in view outside, then lower the band to eye level once indoors
      // (floor, furniture, windows) so it reads like walking, not looking at ceilings.
      video.style.objectPosition = `50% ${(45 + 30 * smooth((p - 0.08) / 0.1)).toFixed(1)}%`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;

      chapterRefs.current.forEach((el, i) => {
        if (!el) return;
        const start = bounds[i + 1];
        const end = bounds[i + 2];
        const local = (p - start) / (end - start);
        const last = i === chapters.length - 1;
        const o = last ? smooth(local / 0.35) : local < 0 || local > 1 ? 0 : smooth(1 - Math.abs(local - 0.5) / 0.5) * 1.4;
        el.style.opacity = String(clamp(o));
        el.style.transform = `translateY(${((0.5 - clamp(local)) * 3).toFixed(2)}vh)`;
        el.style.pointerEvents = o > 0.5 ? "auto" : "none";
      });
    };

    const tick = () => {
      frame = 0;
      if (!inView) return;
      if (ready && !video.seeking) {
        cur += (target - cur) * 0.18;
        const t = clamp(cur, 0, 0.999) * (video.duration || 1);
        if (Math.abs(video.currentTime - t) > (mobile ? 0.03 : 0.012)) {
          try {
            video.currentTime = t;
          } catch {}
        }
      }
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      read();
      start();
    };

    const prime = () => {
      if (primed || !ready || !mobile) return;
      primed = true;
      video.play().then(() => video.pause()).catch(() => {});
    };

    const load = () => {
      if (reduce || saveData || cancelled) return;
      fetch(pickSource(mobile))
        .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
        .then((blob) => {
          if (cancelled) return;
          objectUrl = URL.createObjectURL(blob);
          video.src = objectUrl;
        })
        .catch(() => {}); // the poster simply stays up
    };

    video.addEventListener("loadedmetadata", () => {
      ready = true;
      cur = target;
      try {
        video.currentTime = clamp(cur, 0, 0.999) * video.duration;
      } catch {}
      start();
    });
    video.addEventListener("loadeddata", () => {
      try {
        video.pause();
      } catch {}
    });
    // Reveal the video only once a real frame has painted.
    video.addEventListener("seeked", () => video.classList.add("opacity-100"), { once: true });

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
    });
    io.observe(track);

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", read);
    window.addEventListener("pointerdown", prime, { passive: true });
    window.addEventListener("touchstart", prime, { passive: true });

    // Load after first paint so the hero text and poster stay the priority.
    let idle = 0;
    const kick = () => {
      idle = window.setTimeout(load, 400);
    };
    if (document.readyState === "complete") kick();
    else window.addEventListener("load", kick, { once: true });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(idle);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", read);
      window.removeEventListener("pointerdown", prime);
      window.removeEventListener("touchstart", prime);
      window.removeEventListener("load", kick);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [chapters.length, legSeconds]);

  return (
    <section ref={trackRef} aria-labelledby="hero-title" className="relative motion-safe:h-[600vh] sm:motion-safe:h-[720vh]">
      <p className="sr-only">{label}</p>
      <div className="sticky top-0 h-svh overflow-hidden motion-reduce:relative motion-reduce:min-h-svh">
        {/* Poster = first frame of the film; stays until the video paints. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- static poster, sized by srcset */}
        <img
          src="/hero/poster.webp"
          srcSet="/hero/poster-m.webp 720w, /hero/poster.webp 1440w"
          sizes="100vw"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-[50%_45%]"
        />
        <video
          ref={videoRef}
          aria-hidden
          muted
          playsInline
          preload="none"
          className="absolute inset-0 size-full object-cover object-[50%_45%] opacity-0 transition-opacity duration-500"
        />

        {/* Legibility: an even veil that lifts after the intro, plus a fixed bottom-left fade for captions. */}
        <div ref={veilRef} aria-hidden className="absolute inset-0 bg-ink-900" style={{ opacity: 0.75 }} />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(22,41,45,0.85)_0%,rgba(22,41,45,0.25)_40%,transparent_65%)]" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink-900/70 to-transparent" />

        <div ref={introRef} className="absolute inset-0 flex flex-col items-center justify-center pt-20 will-change-transform">
          {children}
          <p aria-hidden className="mt-10 flex flex-col items-center gap-2 text-xs tracking-wide text-fg-subtle uppercase motion-reduce:hidden">
            {hint}
            <span className="block h-8 w-px animate-pulse bg-gradient-to-b from-brand-300 to-transparent" />
          </p>
        </div>

        <Container className="pointer-events-none absolute inset-x-0 bottom-0 grid pb-[max(3rem,env(safe-area-inset-bottom))] motion-reduce:hidden sm:pb-16">
          {chapters.map((c, i) => (
            <div
              key={c.title}
              ref={(el) => {
                chapterRefs.current[i] = el;
              }}
              style={{ opacity: 0 }}
              className="col-start-1 row-start-1 max-w-xl self-end will-change-transform"
            >
              <p className="text-xs font-semibold tracking-wide text-brand-300 uppercase">{c.eyebrow}</p>
              <p className="display mt-2 text-3xl sm:text-5xl">{c.title}</p>
              <p className="mt-3 max-w-md text-base text-fg-muted sm:text-lg">{c.body}</p>
              {ctas[i] && <div className="mt-6">{ctas[i]}</div>}
            </div>
          ))}
        </Container>

        <p className="absolute right-4 bottom-4 text-[0.7rem] text-fg-subtle sm:right-6 sm:bottom-6">{demo}</p>
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-white/[0.06] motion-reduce:hidden">
          <div ref={barRef} className="h-full origin-left bg-brand-400" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
