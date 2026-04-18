"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

type PickerModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function PickerModal({
  open,
  title,
  description,
  onClose,
  children,
}: PickerModalProps): React.ReactElement | null {
  const panelRef = useRef<HTMLDivElement>(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onKeyDown]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button[data-autofocus]")?.focus();
    }, 50);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4 lg:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-cv-bg-deep/80 backdrop-blur-[4px] transition-opacity"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="picker-modal-title"
        className={cn(
          "relative z-10 mx-0 flex w-full max-w-full flex-col overflow-hidden rounded-t-2xl border border-cv-border-strong bg-cv-bg-surface",
          "shadow-[0_-12px_48px_rgba(0,0,0,0.55)] ring-1 ring-cv-gold/12",
          "max-h-[min(70dvh,560px)] pb-[max(0.75rem,env(safe-area-inset-bottom))]",
          "sm:mx-auto sm:max-h-[min(82dvh,640px)] sm:max-w-lg sm:rounded-2xl sm:pb-0 sm:shadow-2xl sm:ring-cv-gold/10",
          "lg:max-h-[min(85dvh,720px)]",
        )}
      >
        <div
          className="pointer-events-none flex shrink-0 justify-center pt-2 sm:hidden"
          aria-hidden
        >
          <span className="h-1 w-10 rounded-full bg-cv-text-tertiary/40" />
        </div>
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-cv-border bg-cv-bg-elevated/30 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4 lg:px-6">
          <div className="min-w-0 flex-1">
            <h2
              id="picker-modal-title"
              className="text-base font-semibold tracking-tight text-cv-text-primary sm:text-lg"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-xs leading-relaxed text-cv-text-secondary sm:text-sm">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cv-border bg-cv-bg-deep/60 text-cv-text-secondary transition hover:border-cv-border-strong hover:bg-cv-bg-elevated hover:text-cv-gold-bright active:scale-95"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="cv-scrollbar-dashboard min-h-0 flex-1 overflow-y-auto bg-cv-bg-deep/25 px-3 py-2 sm:bg-cv-bg-surface sm:px-4 sm:py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
