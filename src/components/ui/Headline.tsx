import type { HeadlineLine } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { GradientText } from "./GradientText";

type Tag = "h1" | "h2" | "h3";

/** Renders a localized multi-line headline with brand-colored accent words. */
export function Headline({ lines, as: As = "h2", className, id }: { lines: HeadlineLine[]; as?: Tag; className?: string; id?: string }) {
  return (
    <As id={id} className={cn("display", className)}>
      {lines.map((line, i) => (
        <span key={i} className="block">
          {line.text}
          {line.accent && <GradientText>{line.accent}</GradientText>}
        </span>
      ))}
    </As>
  );
}
