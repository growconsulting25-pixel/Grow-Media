"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { Modal } from "@/components/ui/Modal";
import { useI18n } from "@/i18n/I18nProvider";
import { href } from "@/i18n/routing";
import { track } from "@/lib/analytics";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { SignupFlow } from "./SignupFlow";

interface SignupContextValue {
  openSignup: (source: string) => void;
}

const SignupContext = createContext<SignupContextValue | null>(null);

/** Owns the single free-video onboarding modal used by every CTA. */
export function SignupProvider({ children }: { children: ReactNode }) {
  const { dict, locale } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState("unknown");
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => sub.subscription.unsubscribe();
  }, []);

  const openSignup = useCallback(
    (from: string) => {
      if (signedIn) {
        track("project_started", { source: from });
        router.push(href("appCreate", locale));
        return;
      }
      setSource(from);
      setOpen(true);
      track("signup_started", { source: from });
    },
    [signedIn, router, locale],
  );

  return (
    <SignupContext.Provider value={{ openSignup }}>
      {children}
      <Modal open={open} onClose={() => setOpen(false)} title={dict.signup.title} hideTitle className="max-w-[30rem]">
        {open && <SignupFlow source={source} onDone={() => setOpen(false)} />}
      </Modal>
    </SignupContext.Provider>
  );
}

export function useSignup() {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error("useSignup must be used inside <SignupProvider>");
  return ctx;
}
