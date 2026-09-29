import { cn } from "@/lib/cn";

/** Small pill label above section headings: "— Features —". */
export function Eyebrow({ children, tone = "dark", className }: { children: React.ReactNode; tone?: "dark" | "light"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[0.8rem] font-medium tracking-tight",
        tone === "dark"
          ? "bg-white/[0.05] text-fg-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
          : "bg-white text-muted-on-paper shadow-[inset_0_0_0_1px_rgba(18,17,25,0.08)]",
        className,
      )}
    >
      <span aria-hidden className="h-px w-3 bg-gradient-to-r from-transparent to-orchid-400" />
      {children}
      <span aria-hidden className="h-px w-3 bg-gradient-to-l from-transparent to-orchid-400" />
    </span>
  );
}
