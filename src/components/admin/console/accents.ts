/**
 * One accent per section, used sparingly: a 2px top line, a tinted icon chip,
 * and the active nav tab. Full class strings so Tailwind can see them.
 */
export type Accent = "cyan" | "emerald" | "amber" | "violet" | "rose";

export const accents: Record<Accent, { line: string; chip: string; text: string; bar: string; tab: string }> = {
  cyan: { line: "bg-brand-500", chip: "bg-brand-500/12 text-brand-300", text: "text-brand-300", bar: "bg-brand-500", tab: "bg-brand-500/15 text-brand-200 shadow-[inset_0_0_0_1px_rgba(0,171,255,0.35)]" },
  emerald: { line: "bg-emerald-400", chip: "bg-emerald-400/12 text-emerald-300", text: "text-emerald-300", bar: "bg-emerald-400", tab: "bg-emerald-400/15 text-emerald-200 shadow-[inset_0_0_0_1px_rgba(52,211,153,0.35)]" },
  amber: { line: "bg-amber-400", chip: "bg-amber-400/12 text-amber-300", text: "text-amber-300", bar: "bg-amber-400", tab: "bg-amber-400/15 text-amber-200 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.35)]" },
  violet: { line: "bg-violet-400", chip: "bg-violet-400/12 text-violet-300", text: "text-violet-300", bar: "bg-violet-400", tab: "bg-violet-400/15 text-violet-200 shadow-[inset_0_0_0_1px_rgba(167,139,250,0.35)]" },
  rose: { line: "bg-rose-400", chip: "bg-rose-400/12 text-rose-300", text: "text-rose-300", bar: "bg-rose-400", tab: "bg-rose-400/15 text-rose-200 shadow-[inset_0_0_0_1px_rgba(251,113,133,0.35)]" },
};

/** Client types keep the same color everywhere (filters, tables, badges). */
export const segmentAccent = { subscriber_agent: "emerald", subscriber_pro: "violet", single: "amber", free: "cyan" } as const satisfies Record<string, Accent>;
