import type { HeadlineLine } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";
import { Headline } from "./Headline";
import { Reveal } from "./Reveal";

interface Props {
  eyebrow?: string;
  lines: HeadlineLine[];
  description?: string;
  align?: "center" | "left";
  tone?: "dark" | "light";
  titleId?: string;
  className?: string;
}

export function SectionHeading({ eyebrow, lines, description, align = "center", tone = "dark", titleId, className }: Props) {
  const centered = align === "center";
  return (
    <Reveal className={cn("flex flex-col gap-5", centered ? "items-center text-center" : "items-start", className)}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <Headline
        id={titleId}
        lines={lines}
        className={cn(
          "text-[2.35rem] sm:text-5xl lg:text-[3.6rem]",
          tone === "light" ? "text-ink-on-paper" : "text-fg",
          centered && "mx-auto max-w-4xl",
        )}
      />
      {description && (
        <p
          className={cn(
            "max-w-xl text-base leading-relaxed sm:text-lg",
            tone === "light" ? "text-muted-on-paper" : "text-fg-muted",
            centered && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
