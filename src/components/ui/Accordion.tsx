"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

export interface AccordionItem {
  q: string;
  a: string;
}

interface Props {
  items: AccordionItem[];
  className?: string;
  /** Show only this many items until "show more" is pressed. */
  initialCount?: number;
  moreLabel?: string;
  lessLabel?: string;
}

export function Accordion({ items, className, initialCount, moreLabel, lessLabel }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  const [expanded, setExpanded] = useState(false);
  const baseId = useId();
  const collapsible = initialCount !== undefined && items.length > initialCount;
  const visible = collapsible && !expanded ? items.slice(0, initialCount) : items;

  return (
    <div className={className}>
      <div className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
        {visible.map((item, i) => {
          const isOpen = open === i;
          const buttonId = `${baseId}-b${i}`;
          const panelId = `${baseId}-p${i}`;
          return (
            <div key={i}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-center justify-between gap-6 py-5 text-left text-[1.02rem] font-medium tracking-tight text-fg transition-colors hover:text-white sm:py-6 sm:text-lg"
                >
                  {item.q}
                  <span
                    aria-hidden
                    className={cn(
                      "relative grid size-8 shrink-0 place-items-center rounded-full transition-colors duration-300",
                      isOpen ? "bg-brand-600 text-on-brand" : "bg-white/[0.05] text-fg-muted group-hover:bg-white/10",
                    )}
                  >
                    <span className="absolute h-[1.5px] w-3 rounded bg-current" />
                    <span className={cn("absolute h-3 w-[1.5px] rounded bg-current transition-transform duration-300", isOpen && "scale-y-0")} />
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={cn("grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
              >
                <div className="overflow-hidden" inert={!isOpen}>
                  <p className="max-w-2xl pb-6 leading-relaxed text-fg-muted">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {collapsible && (
        <button
          type="button"
          onClick={() => {
            if (expanded && open !== null && open >= initialCount) setOpen(null);
            setExpanded(!expanded);
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-brand-500 hover:text-white"
        >
          {expanded ? lessLabel : moreLabel?.replace("{count}", String(items.length - initialCount))}
          <span aria-hidden className={cn("transition-transform", expanded && "rotate-180")}>↓</span>
        </button>
      )}
    </div>
  );
}
