"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Visually hide the title (still announced to screen readers). */
  hideTitle?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Accessible dialog built on the native <dialog> element: focus trapping,
 * Escape to close and inert background come from the platform.
 */
export function Modal({ open, onClose, title, hideTitle, children, className }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { dict } = useI18n();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto max-h-[92dvh] w-[calc(100%-2rem)] overflow-visible bg-transparent p-0 text-fg backdrop:bg-ink-950/80 backdrop:backdrop-blur-sm",
        "open:animate-[dialog-in_0.45s_var(--ease-out-expo)]",
        className,
      )}
    >
      <div className="surface-raised relative max-h-[92dvh] overflow-y-auto rounded-[var(--radius-panel)]">
        <div className={cn("flex items-center justify-between gap-4 px-6 pt-5", hideTitle && "absolute inset-x-0 top-0 z-10 px-3 pt-3")}>
          <h2 className={cn("text-lg font-semibold tracking-tight", hideTitle && "sr-only")}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={dict.common.close}
            className="ml-auto grid size-9 place-items-center rounded-full bg-white/5 text-fg-muted transition-colors hover:bg-white/10 hover:text-fg"
          >
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
      <style>{`@keyframes dialog-in { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: none; } }`}</style>
    </dialog>
  );
}
