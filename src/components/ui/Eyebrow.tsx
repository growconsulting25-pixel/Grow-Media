import { cn } from "@/lib/cn";

/** Small pill label above section headings: "— Features —". */
export function Eyebrow({ children, tone = "dark", className }: { children: React.ReactNode; tone?: "dark" | "light"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[0.8rem] font-medium tracking-tight",
        tone === "dark"
          ? "bg-white/[0.05] text-fg-muted shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-white)_8%,transparent)]"
          : "bg-white text-muted-on-paper shadow-[inset_0_0_0_1px_rgba(22,41,45,0.08)]",
        className,
      )}
    >
      <span aria-hidden className="h-px w-3 bg-brand-600 text-on-brand" />
      {children}
      <span aria-hidden className="h-px w-3 bg-brand-600 text-on-brand" />
    </span>
  );
}
