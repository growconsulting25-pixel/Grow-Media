"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Modal } from "@/components/ui/Modal";
import { useI18n } from "@/i18n/I18nProvider";
import { track } from "@/lib/analytics";
import { SignupFlow } from "./SignupFlow";

interface SignupContextValue {
  openSignup: (source: string) => void;
}

const SignupContext = createContext<SignupContextValue | null>(null);

/** Owns the single free-video onboarding modal used by every CTA. */
export function SignupProvider({ children }: { children: ReactNode }) {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState("unknown");

  const openSignup = useCallback((from: string) => {
    setSource(from);
    setOpen(true);
    track("signup_started", { source: from });
  }, []);

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
