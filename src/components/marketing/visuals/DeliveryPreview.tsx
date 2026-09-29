import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";

export function DeliveryPreview({ checklist, actions }: { checklist: string[]; actions: { download: string; revise: string; share: string } }) {
  return (
    <div className="flex h-full gap-4 p-5">
      <div className="relative aspect-[9/16] w-[36%] shrink-0 overflow-hidden rounded-xl shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_40px_-20px_rgba(0,171,255,0.6)]">
        <Photo name="pool" width={220} sizes="120px" decorative className="size-full" imgClassName="animate-kenburns" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-9 place-items-center rounded-full bg-white/20 backdrop-blur">
            <Icon name="play" className="size-4 translate-x-px text-white" fill="currentColor" />
          </span>
        </span>
        <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1 font-mono text-[0.6rem] text-white">0:24</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <ul className="space-y-2">
          {checklist.map((item, i) => (
            <li key={item} className="flex items-center gap-2 text-[0.8rem] text-fg" style={{ animationDelay: `${i * 120}ms` }}>
              <span className="grid size-4 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                <Icon name="check" className="size-2.5" />
              </span>
              <span className="truncate">{item}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-1.5">
          <span className="btn-primary inline-flex h-8 items-center justify-center gap-1.5 rounded-full text-xs font-medium">
            <Icon name="download" className="size-3.5" /> {actions.download}
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <span className="btn-secondary inline-flex h-8 items-center justify-center gap-1 truncate rounded-full px-2 text-[0.7rem]">
              <Icon name="revise" className="size-3 shrink-0" /> <span className="truncate">{actions.revise}</span>
            </span>
            <span className="btn-secondary inline-flex h-8 items-center justify-center gap-1 rounded-full px-2 text-[0.7rem]">
              <Icon name="share" className="size-3 shrink-0" /> {actions.share}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
