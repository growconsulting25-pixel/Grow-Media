"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { featuredExample } from "@/config/media";
import { useI18n } from "@/i18n/I18nProvider";
import { track } from "@/lib/analytics";

/** Opens the featured example video in a modal; the iframe loads only on open. */
export function WatchExampleButton({ className }: { className?: string }) {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const title = dict.examples.items[featuredExample.key].title;

  return (
    <>
      <Button variant="secondary" size="lg" className={className} onClick={() => {
          setOpen(true);
          track("example_video_play", { video: featuredExample.id, location: "hero_modal" });
        }}>
        <Icon name="play" className="size-3.5" fill="currentColor" />
        {dict.common.watchExample}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={dict.examples.modalTitle} className={featuredExample.aspect === "9:16" ? "max-w-sm" : "max-w-4xl"}>
        <div className="p-3 pt-4 sm:p-5">
          {open && <VideoPlayer video={featuredExample} title={title} autoplay location="hero_modal" className="rounded-2xl" />}
        </div>
      </Modal>
    </>
  );
}
