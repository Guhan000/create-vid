"use client";

import { cn } from "@/lib/utils";
import {
  ASPECT_RATIOS,
  CAPTION_OPTIONS,
  estimateCredits,
  MUSIC_OPTIONS,
  type AspectRatioId,
  VIDEO_STYLES,
  VIDEO_TYPES,
  type VideoTypeId,
  VOICE_OPTIONS,
} from "./constants";
import { PickerModal } from "./PickerModal";
import { VideoPreviewPanel } from "./VideoPreviewPanel";
import {
  Captions,
  Check,
  Mic,
  Music,
  RectangleHorizontal,
  Smartphone,
  Square,
} from "lucide-react";
import { useId, useMemo, useState } from "react";

const aspectIcons = {
  "9:16": Smartphone,
  "16:9": RectangleHorizontal,
  "1:1": Square,
} as const;

type PickerKind = "voice" | "music" | "caption";

function pickerRowClass(selected: boolean, align: "center" | "start"): string {
  return cn(
    "flex w-full justify-between gap-2 border text-left transition touch-manipulation sm:gap-3",
    align === "start" ? "items-start" : "items-center",
    "rounded-lg px-3 py-2.5 text-[13px] sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm",
    selected
      ? "border-cv-border-strong bg-cv-gold-subtle text-cv-gold-bright ring-1 ring-cv-gold/20"
      : "border-cv-border/80 bg-cv-bg-elevated/70 text-cv-text-primary hover:border-cv-border-strong hover:bg-cv-bg-elevated max-lg:active:bg-cv-bg-card/90",
  );
}

function FormSection({
  title,
  description,
  descriptionId,
  children,
}: {
  title: string;
  description?: string;
  descriptionId?: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <section className="rounded-2xl border border-cv-border bg-cv-bg-surface/70 p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold tracking-tight text-cv-text-primary">{title}</h2>
        {description ? (
          <p
            id={descriptionId}
            className="mt-1 text-xs leading-relaxed text-cv-text-tertiary"
          >
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function FacelessVideoForm(): React.ReactElement {
  const briefFieldId = useId();
  const briefHintId = useId();
  const scriptToggleId = useId();
  const [scriptMode, setScriptMode] = useState(false);
  const [brief, setBrief] = useState("");
  const [videoType, setVideoType] = useState<VideoTypeId>("moving");
  const [styleId, setStyleId] = useState<string | null>(VIDEO_STYLES[0] ?? null);
  const [aspect, setAspect] = useState<AspectRatioId>("9:16");
  const [voiceId, setVoiceId] = useState(VOICE_OPTIONS[0]?.id ?? "v1");
  const [musicId, setMusicId] = useState(MUSIC_OPTIONS[1]?.id ?? "m1");
  const [captionId, setCaptionId] = useState(CAPTION_OPTIONS[1]?.id ?? "c1");
  const [picker, setPicker] = useState<PickerKind | null>(null);

  const voice = VOICE_OPTIONS.find((v) => v.id === voiceId) ?? VOICE_OPTIONS[0];
  const music = MUSIC_OPTIONS.find((m) => m.id === musicId) ?? MUSIC_OPTIONS[0];
  const caption = CAPTION_OPTIONS.find((c) => c.id === captionId) ?? CAPTION_OPTIONS[0];

  const { total, lines } = useMemo(
    () =>
      estimateCredits({
        videoType,
        styleId: videoType === "stock" ? null : styleId,
        aspect,
        voiceCredits: voice?.credits ?? 0,
        musicCredits: music?.credits ?? 0,
        captionCredits: caption?.credits ?? 0,
        scriptMode,
      }),
    [videoType, styleId, aspect, voice, music, caption, scriptMode],
  );

  function onVideoTypeChange(next: VideoTypeId): void {
    setVideoType(next);
    if (next === "stock") {
      setStyleId(null);
    } else if (!styleId) {
      setStyleId(VIDEO_STYLES[0] ?? null);
    }
  }

  const canSubmit = brief.trim().length >= 8;

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-5 lg:grid lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(200px,280px)] lg:items-stretch lg:gap-x-8 lg:gap-y-0 xl:grid-cols-[minmax(0,1fr)_minmax(220px,300px)] xl:gap-x-10">
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden max-lg:flex-1 max-lg:min-h-0 lg:h-full lg:min-h-0">
          <div className="cv-scrollbar-dashboard min-h-0 flex-1 basis-0 space-y-6 overflow-y-auto overflow-x-hidden pr-1 sm:space-y-7">
            <FormSection
              title="Brief"
              description={
                scriptMode
                  ? "Paste a full script for tighter alignment with scenes and pacing."
                  : "Describe the idea—topic, tone, audience, and how long it should feel."
              }
              descriptionId={briefHintId}
            >
              <div className="flex flex-col gap-3.5">
                <label
                  htmlFor={scriptToggleId}
                  className="flex cursor-pointer items-start gap-3.5 rounded-xl border border-cv-border bg-cv-bg-elevated/50 px-3.5 py-3.5 transition hover:border-cv-border-strong has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cv-gold/35 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-cv-bg-surface sm:px-4 sm:py-3.5"
                >
                  <input
                    id={scriptToggleId}
                    type="checkbox"
                    checked={scriptMode}
                    onChange={(e) => setScriptMode(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "pointer-events-none mt-0.5 flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded border-2 transition sm:mt-1",
                      scriptMode
                        ? "border-cv-gold-bright bg-cv-gold shadow-[0_0_14px_var(--cv-gold-glow)]"
                        : "border-cv-border-strong bg-cv-bg-deep",
                    )}
                    aria-hidden
                  >
                    <Check
                      strokeWidth={3.5}
                      className={cn(
                        "h-2.5 w-2.5 text-cv-bg-deep transition",
                        scriptMode ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <span className="block text-sm font-medium leading-snug text-cv-text-primary">
                      This is a full script
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-cv-text-tertiary">
                      Placeholder and timing hints switch to script mode.
                    </span>
                  </span>
                </label>

                <label className="block" htmlFor={briefFieldId}>
                  <span className="sr-only">{scriptMode ? "Script" : "Prompt"}</span>
                  <textarea
                    id={briefFieldId}
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    rows={9}
                    aria-describedby={briefHintId}
                    placeholder={
                      scriptMode
                        ? "Paste your full script. Use blank lines between beats or scenes when you want a natural pause…"
                        : "Describe your video: hook, main message, tone (e.g. calm, urgent, funny), target viewer, and rough length…"
                    }
                    className="min-h-[220px] w-full resize-y rounded-xl border border-cv-border bg-cv-bg-deep/60 px-4 py-3.5 text-sm leading-relaxed text-cv-text-primary transition placeholder:text-cv-text-tertiary focus:border-cv-border-strong focus:outline-none focus:ring-2 focus:ring-cv-gold/25"
                  />
                </label>
              </div>
            </FormSection>

            <FormSection
              title="Video type"
            description="Choose how visuals are produced. Stock skips creative style to match library footage."
          >
            <fieldset className="grid gap-2 sm:grid-cols-3">
              <legend className="sr-only">Video type</legend>
              {VIDEO_TYPES.map((opt) => {
                const selected = videoType === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={cn(
                      "relative flex cursor-pointer flex-col rounded-xl border p-3.5 transition sm:p-4",
                      selected
                        ? "border-cv-border-strong bg-cv-gold-subtle ring-1 ring-cv-gold-muted"
                        : "border-cv-border bg-cv-bg-elevated/40 hover:border-cv-border-strong hover:bg-cv-bg-elevated/70",
                    )}
                  >
                    <input
                      type="radio"
                      name="video-type"
                      value={opt.id}
                      checked={selected}
                      onChange={() => onVideoTypeChange(opt.id)}
                      className="sr-only"
                    />
                    <span className="text-sm font-semibold text-cv-text-primary">{opt.label}</span>
                    <span className="mt-2 text-xs leading-relaxed text-cv-text-tertiary">
                      {opt.description}
                    </span>
                  </label>
                );
              })}
            </fieldset>
            </FormSection>

            <FormSection
              title="Aspect ratio"
            description="Framing for export. Preview on the right updates to match."
          >
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {ASPECT_RATIOS.map((r) => {
                const Icon = aspectIcons[r.id];
                const selected = aspect === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setAspect(r.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center transition sm:px-3 sm:py-4",
                      selected
                        ? "border-cv-border-strong bg-cv-gold-subtle ring-1 ring-cv-gold-muted"
                        : "border-cv-border bg-cv-bg-elevated/40 hover:border-cv-border-strong",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 sm:h-6 sm:w-6",
                        selected ? "text-cv-gold-bright" : "text-cv-text-tertiary",
                      )}
                      aria-hidden
                    />
                    <span className="text-xs font-semibold text-cv-text-primary sm:text-sm">
                      {r.label}
                    </span>
                    <span className="hidden text-[10px] text-cv-text-tertiary sm:block">{r.hint}</span>
                  </button>
                );
              })}
            </div>
            </FormSection>

            {videoType !== "stock" ? (
              <FormSection
                title="Video style"
              description="Pick one look. You can refine later in the editor."
            >
              <div className="cv-scrollbar-dashboard max-h-[min(280px,38vh)] overflow-y-auto rounded-xl border border-cv-border bg-cv-bg-deep/40 p-2 sm:p-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {VIDEO_STYLES.map((name) => {
                    const selected = styleId === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setStyleId(name)}
                        className={cn(
                          "rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition sm:text-[13px]",
                          selected
                            ? "border-cv-border-strong bg-cv-gold-subtle text-cv-gold-bright ring-1 ring-cv-gold-muted"
                            : "border-cv-border bg-cv-bg-elevated/50 text-cv-text-secondary hover:border-cv-border-strong hover:text-cv-text-primary",
                        )}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>
              </FormSection>
            ) : null}

            <FormSection
              title="Audio & captions"
            description="Open a picker for each. Estimates include your current picks."
          >
            <div className="flex flex-col gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setPicker("voice")}
                className="flex w-full items-center justify-between gap-4 rounded-xl border border-cv-border bg-cv-bg-elevated/50 px-4 py-3.5 text-left transition hover:border-cv-border-strong hover:bg-cv-bg-elevated"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cv-border bg-cv-bg-deep">
                    <Mic className="h-4 w-4 text-cv-gold-bright" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium uppercase tracking-wide text-cv-text-tertiary">
                      Voice
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-medium text-cv-text-primary">
                      {voice?.label}
                    </span>
                  </span>
                </span>
                <span className="shrink-0 text-xs font-medium text-cv-text-tertiary">Change</span>
              </button>

              <button
                type="button"
                onClick={() => setPicker("music")}
                className="flex w-full items-center justify-between gap-4 rounded-xl border border-cv-border bg-cv-bg-elevated/50 px-4 py-3.5 text-left transition hover:border-cv-border-strong hover:bg-cv-bg-elevated"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cv-border bg-cv-bg-deep">
                    <Music className="h-4 w-4 text-cv-gold-bright" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium uppercase tracking-wide text-cv-text-tertiary">
                      Background music
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-medium text-cv-text-primary">
                      {music?.label}
                      {music?.id !== "m0" ? (
                        <span className="text-cv-text-tertiary"> · {music?.mood}</span>
                      ) : null}
                    </span>
                  </span>
                </span>
                <span className="shrink-0 text-xs font-medium text-cv-text-tertiary">Change</span>
              </button>

              <button
                type="button"
                onClick={() => setPicker("caption")}
                className="flex w-full items-center justify-between gap-4 rounded-xl border border-cv-border bg-cv-bg-elevated/50 px-4 py-3.5 text-left transition hover:border-cv-border-strong hover:bg-cv-bg-elevated"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cv-border bg-cv-bg-deep">
                    <Captions className="h-4 w-4 text-cv-gold-bright" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium uppercase tracking-wide text-cv-text-tertiary">
                      Captions
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-medium text-cv-text-primary">
                      {caption?.label}
                    </span>
                  </span>
                </span>
                <span className="shrink-0 text-xs font-medium text-cv-text-tertiary">Change</span>
              </button>
            </div>
            </FormSection>
          </div>

          <div className="shrink-0 border-t border-cv-border bg-cv-bg-deep pt-3 pb-[max(0.35rem,env(safe-area-inset-bottom))] max-lg:pt-2.5 sm:pt-5 sm:pb-1">
            <div className="w-full max-w-full rounded-lg border border-cv-border bg-cv-bg-surface/90 p-3 shadow-sm max-lg:mx-auto max-lg:max-w-[min(100%,26rem)] sm:rounded-xl sm:p-5 lg:mx-0">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-cv-text-tertiary sm:text-xs">
                    Estimated credits
                  </p>
                  <p className="mt-0.5 text-xl font-bold tabular-nums text-cv-gold-bright sm:mt-1 sm:text-2xl">
                    {total}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!canSubmit}
                  className="inline-flex h-10 w-full shrink-0 touch-manipulation items-center justify-center rounded-lg bg-cv-gold px-5 text-[13px] font-semibold text-cv-bg-deep shadow-[0_0_20px_var(--cv-gold-glow)] transition hover:bg-cv-gold-hover active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40 sm:h-11 sm:w-auto sm:min-w-[200px] sm:rounded-xl sm:px-8 sm:text-sm"
                >
                  Generate video
                </button>
              </div>
              {!canSubmit ? (
                <p className="mt-2 text-[11px] leading-snug text-cv-text-tertiary sm:mt-3 sm:text-xs">
                  Add at least 8 characters in your {scriptMode ? "script" : "brief"} to continue.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="hidden min-h-0 min-w-0 flex-col overflow-hidden lg:flex lg:h-full lg:max-w-[300px] xl:max-w-[320px]">
          <div className="cv-scrollbar-dashboard flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
            <VideoPreviewPanel aspect={aspect} totalCredits={total} creditLines={lines} />
          </div>
        </aside>
      </div>

      <PickerModal
        open={picker === "voice"}
        onClose={() => setPicker(null)}
        title="Voice"
        description="Preview playback will arrive in a later build—selection is saved with your project."
      >
        <ul className="space-y-0.5 sm:space-y-1">
          {VOICE_OPTIONS.map((v) => {
            const selected = voiceId === v.id;
            return (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => {
                    setVoiceId(v.id);
                    setPicker(null);
                  }}
                  className={pickerRowClass(selected, "center")}
                >
                  <span className="min-w-0">
                    <span className="block font-medium">{v.label}</span>
                    <span className="mt-0.5 block text-xs text-cv-text-tertiary">{v.tag}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-xs font-semibold text-cv-text-secondary">
                    +{v.credits}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </PickerModal>

      <PickerModal
        open={picker === "music"}
        onClose={() => setPicker(null)}
        title="Background music"
        description="Royalty-safe library placeholders for now."
      >
        <ul className="space-y-0.5 sm:space-y-1">
          {MUSIC_OPTIONS.map((m) => {
            const selected = musicId === m.id;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => {
                    setMusicId(m.id);
                    setPicker(null);
                  }}
                  className={pickerRowClass(selected, "center")}
                >
                  <span className="min-w-0">
                    <span className="block font-medium">{m.label}</span>
                    <span className="mt-0.5 block text-xs text-cv-text-tertiary">{m.mood}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-xs font-semibold text-cv-text-secondary">
                    +{m.credits}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </PickerModal>

      <PickerModal
        open={picker === "caption"}
        onClose={() => setPicker(null)}
        title="Captions"
        description="Choose how text appears on export."
      >
        <ul className="space-y-0.5 sm:space-y-1">
          {CAPTION_OPTIONS.map((c) => {
            const selected = captionId === c.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    setCaptionId(c.id);
                    setPicker(null);
                  }}
                  className={pickerRowClass(selected, "start")}
                >
                  <span className="min-w-0">
                    <span className="block font-medium">{c.label}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-cv-text-tertiary">
                      {c.description}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums text-xs font-semibold text-cv-text-secondary">
                    +{c.credits}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </PickerModal>
    </>
  );
}
