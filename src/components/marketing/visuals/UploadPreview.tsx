import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import type { PropertyImageKey } from "@/config/media";

const thumbs: PropertyImageKey[] = ["snowStreet", "openPlan", "livingView", "pillowBed", "lightDining", "modernBath"];

export function UploadPreview({ address, uploaded, hint, items }: { address: string; uploaded: string; hint: string; items: string[] }) {
  return (
    <div className="flex h-full flex-col gap-3.5 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium">{address}</p>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-[0.7rem] font-medium text-success">
          <Icon name="check" className="size-3" /> {uploaded}
        </span>
      </div>
      <div className="rounded-xl border border-dashed border-white/12 p-2.5">
        <div className="grid grid-cols-3 gap-1.5">
          {thumbs.map((name, i) => (
            <div key={name} className="relative">
              <Photo name={name} width={160} sizes="90px" decorative className="aspect-[4/3] rounded-md" />
              {i === thumbs.length - 1 && (
                <span className="absolute inset-x-1.5 bottom-1.5 h-1 overflow-hidden rounded-full bg-black/50">
                  <span className="block h-full origin-left animate-progress bg-brand-300" />
                </span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[0.72rem] text-fg-subtle">
          <Icon name="upload" className="size-3.5" /> {hint}
        </p>
      </div>
      <ul className="flex flex-wrap gap-1.5" aria-label={hint}>
        {items.map((item) => (
          <li key={item} className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[0.7rem] text-fg-muted">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
