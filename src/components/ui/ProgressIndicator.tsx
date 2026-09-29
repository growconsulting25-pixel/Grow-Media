import { cn } from "@/lib/cn";

export function ProgressIndicator({ value, label, className, animated }: { value: number; label: string; className?: string; animated?: boolean }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} className={cn("h-1.5 overflow-hidden rounded-full bg-white/[0.07]", className)}>
      <div
        className={cn("h-full origin-left rounded-full bg-brand-500 text-on-brand", animated && "animate-progress")}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
