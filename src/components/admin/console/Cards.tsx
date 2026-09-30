import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { accents, type Accent } from "./accents";

/** A headline number. The whole card is a link to the detailed view. */
export function StatCard({ href, accent, icon, label, value, sub }: { href: string; accent: Accent; icon: IconName; label: string; value: string; sub?: string }) {
  const a = accents[accent];
  return (
    <Link href={href} className="surface group relative flex min-w-0 flex-col overflow-hidden rounded-[var(--radius-card)] p-4 transition-colors hover:bg-white/[0.04] sm:p-5">
      <span aria-hidden className={cn("absolute inset-x-0 top-0 h-0.5", a.line)} />
      <span className="flex items-center justify-between gap-3">
        <span className={cn("grid size-9 place-items-center rounded-xl", a.chip)}><Icon name={icon} className="size-4.5" /></span>
        <Icon name="arrowRight" className="size-4 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-fg" />
      </span>
      <span className="mt-4 text-sm leading-snug text-fg-muted">{label}</span>
      <span className="mt-1 truncate text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">{value}</span>
      {sub && <span className="mt-1 text-xs text-fg-subtle">{sub}</span>}
    </Link>
  );
}

/** A titled panel whose header links to the full view. */
export function Panel({ id, title, href, action, accent, children, className }: { id?: string; title: string; href?: string; action?: string; accent: Accent; children: React.ReactNode; className?: string }) {
  const a = accents[accent];
  return (
    <section id={id} className={cn("surface relative scroll-mt-24 overflow-hidden rounded-[var(--radius-panel)] p-5", className)}>
      <span aria-hidden className={cn("absolute inset-x-0 top-0 h-0.5", a.line)} />
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold tracking-tight">{title}</h2>
        {href && action && (
          <Link href={href} className={cn("inline-flex items-center gap-1 text-sm hover:underline", a.text)}>
            {action} <Icon name="arrowRight" className="size-3.5" />
          </Link>
        )}
      </header>
      {children}
    </section>
  );
}

/** Horizontal bars; every row links somewhere. Values stay in text colors. */
export function BarList({ rows, accent }: { rows: { label: string; value: number; display?: string; href: string }[]; accent: Accent }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  const a = accents[accent];
  return (
    <ul className="space-y-1">
      {rows.map((r) => (
        <li key={r.label}>
          <Link href={r.href} className="group block rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.04]">
            <span className="flex items-center justify-between gap-3 text-sm">
              <span className="text-fg-muted group-hover:text-fg">{r.label}</span>
              <span className="font-medium tabular-nums">{r.display ?? r.value}</span>
            </span>
            <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
              <span className={cn("block h-full rounded-full", a.bar)} style={{ width: `${Math.max(r.value ? 3 : 0, (r.value / max) * 100)}%` }} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Single-series column chart (one hue, no legend: the panel title names it).
 * Each column shows its value on hover/focus and can link to a filtered view.
 */
export function ColumnChart({ data, accent, format, label, height = 160 }: {
  data: { key: string; value: number; tip: string; href?: string }[];
  accent: Accent;
  format: (n: number) => string;
  label: string;
  height?: number;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const a = accents[accent];
  return (
    <figure>
      <div role="img" aria-label={label} className="relative flex items-end gap-[2px] border-b border-white/[0.08]" style={{ height }}>
        <span className="pointer-events-none absolute top-0 left-0 text-[0.65rem] text-fg-subtle tabular-nums">{format(max)}</span>
        {data.map((d) => {
          const bar = (
            <>
              <span className={cn("block w-full rounded-t-[4px] transition-opacity", a.bar, d.value ? "opacity-80 group-hover:opacity-100" : "opacity-0")} style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value ? 3 : 0 }} />
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded-md bg-ink-950 px-2 py-1 text-[0.7rem] whitespace-nowrap text-fg shadow-lg ring-1 ring-white/10 group-hover:block group-focus-visible:block">
                {d.tip} · <strong className="tabular-nums">{format(d.value)}</strong>
              </span>
            </>
          );
          const cls = "group relative flex h-full flex-1 items-end outline-none";
          return d.href ? (
            <Link key={d.key} href={d.href} className={cls} aria-label={`${d.tip}: ${format(d.value)}`}>{bar}</Link>
          ) : (
            <span key={d.key} tabIndex={0} className={cls} aria-label={`${d.tip}: ${format(d.value)}`}>{bar}</span>
          );
        })}
      </div>
    </figure>
  );
}
