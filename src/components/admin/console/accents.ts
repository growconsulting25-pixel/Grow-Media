/**
 * One accent per section, used sparingly: a 2px top line, a tinted icon chip,
 * and the active nav tab. Full class strings so Tailwind can see them.
 */
export type Accent = "cyan" | "emerald" | "amber" | "orange" | "rose" | "blue" | "slate";

export const accents: Record<Accent, { line: string; chip: string; text: string; bar: string; tab: string }> = {
  cyan: { line: "bg-brand-500", chip: "bg-brand-500/12 text-brand-300", text: "text-brand-300", bar: "bg-brand-500", tab: "bg-brand-500/15 text-brand-200 shadow-[inset_0_0_0_1px_rgba(0,171,255,0.35)]" },
  emerald: { line: "bg-emerald-400", chip: "bg-emerald-400/12 text-emerald-300", text: "text-emerald-300", bar: "bg-emerald-400", tab: "bg-emerald-400/15 text-emerald-200 shadow-[inset_0_0_0_1px_rgba(52,211,153,0.35)]" },
  amber: { line: "bg-amber-400", chip: "bg-amber-400/12 text-amber-300", text: "text-amber-300", bar: "bg-amber-400", tab: "bg-amber-400/15 text-amber-200 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.35)]" },
  orange: { line: "bg-orange-400", chip: "bg-orange-400/12 text-orange-300", text: "text-orange-300", bar: "bg-orange-400", tab: "bg-orange-400/15 text-orange-200 shadow-[inset_0_0_0_1px_rgba(251,146,60,0.35)]" },
  blue: { line: "bg-blue-400", chip: "bg-blue-400/12 text-blue-300", text: "text-blue-300", bar: "bg-blue-400", tab: "bg-blue-400/15 text-blue-200 shadow-[inset_0_0_0_1px_rgba(96,165,250,0.35)]" },
  slate: { line: "bg-slate-400", chip: "bg-slate-400/12 text-slate-300", text: "text-slate-300", bar: "bg-slate-400", tab: "bg-slate-400/15 text-slate-100 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.35)]" },
  rose: { line: "bg-rose-400", chip: "bg-rose-400/12 text-rose-300", text: "text-rose-300", bar: "bg-rose-400", tab: "bg-rose-400/15 text-rose-200 shadow-[inset_0_0_0_1px_rgba(251,113,133,0.35)]" },
};

/** Client types keep the same color everywhere (filters, tables, badges). */
export const segmentAccent = { subscriber_agent: "emerald", subscriber_pro: "blue", single: "amber", free: "cyan" } as const satisfies Record<string, Accent>;
