"use client";

import { cn } from "@/lib/utils";
import { Coins, Sparkles } from "lucide-react";
import type { AspectRatioId, DurationSecondsId } from "./constants";

const aspectClass: Record<AspectRatioId, string> = {
  "9:16": "aspect-[9/16] max-h-[min(46dvh,440px)] w-[min(70%,260px)]",
  "16:9": "aspect-video max-h-[min(32dvh,280px)] w-full max-w-[360px]",
  "1:1": "aspect-square max-h-[min(44dvh,380px)] w-[min(88%,340px)]",
};

export function VideoPreviewPanel({
  aspect,
  durationSeconds,
  totalCredits,
  creditLines,
}: {
  aspect: AspectRatioId;
  durationSeconds: DurationSecondsId;
  totalCredits: number;
  creditLines: { label: string; value: number }[];
}): React.ReactElement {
  const ratioLabel =
    aspect === "9:16" ? "Portrait 9:16" : aspect === "16:9" ? "Landscape 16:9" : "Square 1:1";

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-cv-border bg-cv-bg-surface/90 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cv-text-tertiary">
              Preview
            </p>
            <p className="mt-0.5 text-sm font-medium text-cv-text-primary">{ratioLabel}</p>
            <p className="mt-1 text-xs text-cv-text-tertiary">Target length · {durationSeconds}s</p>
          </div>
          <span className="rounded-full border border-cv-border bg-cv-bg-elevated px-2.5 py-1 text-xs font-medium text-cv-text-secondary">
            Draft
          </span>
        </div>

        <div className="mt-5 flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-cv-border bg-cv-bg-deep/80 px-4 py-8">
          <div
            className={cn(
              "mx-auto overflow-hidden rounded-lg border border-cv-border-strong bg-gradient-to-br from-cv-bg-card via-cv-bg-elevated to-cv-bg-deep shadow-[inset_0_0_60px_rgba(0,0,0,0.45)]",
              aspectClass[aspect],
            )}
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
              <Sparkles className="h-8 w-8 text-cv-gold-muted" aria-hidden />
              <p className="text-xs font-medium text-cv-text-tertiary">
                Preview updates with your settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-cv-border bg-cv-bg-surface/90 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-cv-text-primary">
          <Coins className="h-4 w-4 text-cv-gold-bright" aria-hidden />
          <h3 className="text-sm font-semibold tracking-tight">Credit estimate</h3>
        </div>
        <p className="mt-1 text-xs text-cv-text-tertiary">
          Final usage may vary with output length and retries.
        </p>
        <ul className="mt-4 space-y-2 border-t border-cv-border pt-4">
          {creditLines.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-3 text-sm text-cv-text-secondary"
            >
              <span className="min-w-0 truncate">{row.label}</span>
              <span className="shrink-0 tabular-nums font-medium text-cv-text-primary">
                +{row.value}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-cv-border pt-4">
          <span className="text-sm font-semibold text-cv-text-primary">Estimated total</span>
          <span className="text-lg font-bold tabular-nums text-cv-gold-bright">{totalCredits}</span>
        </div>
      </div>
    </div>
  );
}
