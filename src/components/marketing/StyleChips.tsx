"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/** Interactive style picker preview (single choice, radio semantics). */
export function StyleChips({ styles, label }: { styles: string[]; label: string }) {
  const [selected, setSelected] = useState(0);
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {styles.map((style, i) => {
        const active = i === selected;
        const last = i === styles.length - 1;
        return (
          <button
            key={style}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setSelected(i)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.82rem] font-medium transition-all duration-300",
              active
                ? "btn-primary"
                : "bg-white/[0.04] text-fg-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-white/[0.07] hover:text-fg",
            )}
          >
            {last && <Icon name="sparkle" className="size-3.5" />}
            {style}
          </button>
        );
      })}
    </div>
  );
}
