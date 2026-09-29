import { FreeVideoButton } from "@/components/onboarding/FreeVideoButton";
import type { Dictionary } from "@/i18n/dictionaries";

export function NotConfigured({ dict }: { dict: Dictionary }) {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-4 text-center">
      <div className="max-w-md">
        <h1 className="display text-4xl">{dict.app.notConfigured.title}</h1>
        <p className="mt-4 text-fg-muted">{dict.app.notConfigured.description}</p>
        <FreeVideoButton source="app_not_configured" className="mt-8" />
      </div>
    </main>
  );
}
