"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/i18n/I18nProvider";
import { interpolate } from "@/i18n/interpolate";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { removeProjectFile, reorderFiles, uploadProjectFile } from "@/lib/projects/client-api";
import { ACCEPTED_UPLOADS, MAX_UPLOAD_BYTES, type Project, type ProjectFile } from "@/lib/projects/types";

export type UploadedFile = ProjectFile & { url?: string };

interface Pending {
  key: string;
  file: File;
  preview?: string;
  progress: number;
  error?: string;
}

const CONCURRENCY = 2;

interface Props {
  supabase: SupabaseClient;
  project: Pick<Project, "id" | "user_id">;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  onBusyChange: (busy: boolean) => void;
}

/**
 * Drag & drop uploads with per-file progress, retries, removal and
 * reordering (drag, or the arrow buttons for keyboard/touch users).
 */
export function UploadManager({ supabase, project, files, onFilesChange, onBusyChange }: Props) {
  const { dict } = useI18n();
  const t = dict.app.create;
  const [pending, setPending] = useState<Pending[]>([]);
  const [dragging, setDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Latest file list for async upload callbacks (kept in sync after each render).
  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  const active = pending.some((p) => !p.error);
  useEffect(() => onBusyChange(active), [active, onBusyChange]);
  useEffect(() => () => pending.forEach((p) => p.preview && URL.revokeObjectURL(p.preview)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const patchPending = (key: string, patch: Partial<Pending>) =>
    setPending((list) => list.map((p) => (p.key === key ? { ...p, ...patch } : p)));

  const uploadOne = async (item: Pending, position: number) => {
    try {
      const saved = await uploadProjectFile(supabase, project, item.file, position, (fraction) => patchPending(item.key, { progress: fraction }));
      onFilesChange([...filesRef.current, { ...saved, url: item.preview }]);
      filesRef.current = [...filesRef.current, { ...saved, url: item.preview }];
      setPending((list) => list.filter((p) => p.key !== item.key));
      return true;
    } catch {
      patchPending(item.key, { error: interpolate(t.uploadFailed, { name: item.file.name }) });
      return false;
    }
  };

  const runQueue = async (items: Pending[]) => {
    const start = filesRef.current.length;
    let next = 0;
    let ok = 0;
    const worker = async () => {
      while (next < items.length) {
        const i = next++;
        if (await uploadOne(items[i], start + i)) ok++;
      }
    };
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, worker));
    if (ok) track("photos_uploaded", { count: ok });
  };

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const rejected: string[] = [];
    const accepted: Pending[] = [];
    for (const file of Array.from(list)) {
      if (!ACCEPTED_UPLOADS[file.type]) rejected.push(interpolate(t.unsupported, { name: file.name }));
      else if (file.size > MAX_UPLOAD_BYTES) rejected.push(interpolate(t.tooLarge, { name: file.name }));
      else accepted.push({ key: crypto.randomUUID(), file, progress: 0, preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined });
    }
    setNotice(rejected.length ? rejected.join(" ") : null);
    if (!accepted.length) return;
    setPending((p) => [...p, ...accepted]);
    void runQueue(accepted);
  };

  const retry = (item: Pending) => {
    patchPending(item.key, { error: undefined, progress: 0 });
    void runQueue([item]);
  };

  const remove = async (file: UploadedFile) => {
    const previous = files;
    onFilesChange(files.filter((f) => f.id !== file.id));
    try {
      await removeProjectFile(supabase, file.id);
    } catch {
      onFilesChange(previous);
    }
  };

  const move = async (from: number, to: number) => {
    if (to < 0 || to >= files.length || from === to) return;
    const next = [...files];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    const previous = files;
    onFilesChange(next);
    try {
      await reorderFiles(supabase, project.id, next.map((f) => f.id));
    } catch {
      onFilesChange(previous);
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          if (dragIndex !== null) return;
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          if (dragIndex !== null) return;
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-[var(--radius-panel)] border border-dashed px-6 py-12 text-center transition-colors",
          dragging ? "border-brand-400 bg-brand-500/10" : "border-white/15 bg-white/[0.02]",
        )}
      >
        <span className="grid size-14 place-items-center rounded-full bg-brand-500/15 text-brand-300">
          <Icon name="upload" className="size-6" />
        </span>
        <p className="text-base font-medium">{dragging ? t.dropHere : <><button type="button" onClick={() => inputRef.current?.click()} className="text-brand-300 underline-offset-4 hover:underline">{t.browse}</button> <span className="text-fg-muted">{t.orDrag}</span></>}</p>
        <p className="text-xs text-fg-subtle">{t.uploadHint}</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={Object.keys(ACCEPTED_UPLOADS).join(",")}
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {notice && <p role="alert" className="mt-3 text-sm text-red-300">{notice}</p>}

      {(files.length > 0 || pending.length > 0) && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between text-sm">
            <p className="flex items-center gap-1.5 text-success"><Icon name="check" className="size-4" /> {interpolate(t.uploaded, { count: files.length })}</p>
            <p className="text-xs text-fg-subtle">{t.firstIsCover}</p>
          </div>
          <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-5">
            {files.map((f, i) => (
              <li
                key={f.id}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragEnd={() => setDragIndex(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIndex !== null) void move(dragIndex, i);
                  setDragIndex(null);
                }}
                className={cn("group relative aspect-square cursor-grab overflow-hidden rounded-xl bg-ink-800 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:cursor-grabbing", dragIndex === i && "opacity-40", i === 0 && "ring-2 ring-brand-400/70")}
              >
                {f.url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local object URL or signed URL
                  <img src={f.url} alt={f.file_name} className="size-full object-cover" draggable={false} />
                ) : (
                  <span className="grid size-full place-items-center p-2 text-center text-[0.65rem] text-fg-muted">
                    <Icon name={f.kind === "video" ? "play" : "image"} className="mb-1 size-5" />
                    <span className="line-clamp-2 break-all">{f.file_name}</span>
                  </span>
                )}
                <span className="absolute top-1.5 left-1.5 rounded bg-black/60 px-1.5 font-mono text-[0.62rem] text-white">{i + 1}</span>
                <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                  <span className="flex gap-1">
                    <IconButton label={interpolate(t.moveEarlier, { name: f.file_name })} icon="arrowRight" className="rotate-180" disabled={i === 0} onClick={() => move(i, i - 1)} />
                    <IconButton label={interpolate(t.moveLater, { name: f.file_name })} icon="arrowRight" disabled={i === files.length - 1} onClick={() => move(i, i + 1)} />
                  </span>
                  <IconButton label={interpolate(t.remove, { name: f.file_name })} icon="close" onClick={() => remove(f)} />
                </div>
              </li>
            ))}
            {pending.map((p) => (
              <li key={p.key} className="relative aspect-square overflow-hidden rounded-xl bg-ink-800">
                {p.preview && (
                  // eslint-disable-next-line @next/next/no-img-element -- local preview
                  <img src={p.preview} alt="" className="size-full object-cover opacity-40" />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2 text-center">
                  {p.error ? (
                    <>
                      <p className="text-[0.65rem] text-red-300">{p.error}</p>
                      <button type="button" onClick={() => retry(p)} className="rounded-full bg-white/10 px-2.5 py-1 text-[0.65rem]">↻</button>
                    </>
                  ) : (
                    <>
                      <span className="sr-only">{interpolate(t.uploadingProgress, { name: p.file.name })}</span>
                      <span className="font-mono text-xs tabular-nums">{Math.round(p.progress * 100)}%</span>
                      <span className="h-1 w-3/4 overflow-hidden rounded-full bg-white/15">
                        <span className="block h-full rounded-full bg-brand-500 transition-[width] text-on-brand" style={{ width: `${p.progress * 100}%` }} />
                      </span>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function IconButton({ label, icon, onClick, disabled, className }: { label: string; icon: "arrowRight" | "close"; onClick: () => void; disabled?: boolean; className?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-7 place-items-center rounded-full bg-black/65 text-white backdrop-blur transition-colors hover:bg-black/85 disabled:opacity-30"
    >
      <Icon name={icon} className={cn("size-3.5", className)} />
    </button>
  );
}
