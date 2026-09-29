"use client";

import type { ComponentProps } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";
import { href } from "@/i18n/routing";
import { track } from "@/lib/analytics";
import { useSignup } from "./SignupProvider";

type Props = Omit<ComponentProps<typeof ButtonLink>, "href" | "children"> & {
  /** Where the click happened — sent with analytics events. */
  source: string;
  label?: string;
};

/**
 * The primary conversion CTA. It's a real link to the signup page (works
 * without JS) that opens the onboarding modal when JS is available.
 */
export function FreeVideoButton({ source, label, onClick, ...rest }: Props) {
  const { dict, locale } = useI18n();
  const { openSignup } = useSignup();

  return (
    <ButtonLink
      href={href("signup", locale)}
      arrow
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        if (source === "hero") track("hero_free_video_click");
        openSignup(source);
      }}
    >
      {label ?? dict.common.freeVideoCta}
    </ButtonLink>
  );
}
