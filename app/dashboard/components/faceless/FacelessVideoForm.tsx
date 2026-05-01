"use client";

import { cn } from "@/lib/utils";
import {
  ASPECT_RATIOS,
  CAPTION_OPTIONS,
  DURATION_OPTIONS,
  estimateCredits,
  MUSIC_OPTIONS,
  type AspectRatioId,
  type DurationSecondsId,
  type VideoTypeId,
  VIDEO_STYLES,
  VIDEO_TYPES,
  VOICE_OPTIONS,
} from "./constants";
import { requestFacelessVideoGeneration } from "@/app/dashboard/create/faceless/actions";
import { PickerModal } from "./PickerModal";
import { VideoPreviewPanel } from "./VideoPreviewPanel";
import {
  Captions,
  Check,
  Clock,
  Loader2,
  Mic,
  Music,
  Pause,
  Play,
  RectangleHorizontal,
  Search,
  Smartphone,
  Square,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, useTransition } from "react";

const aspectIcons = {
  "9:16": Smartphone,
  "16:9": RectangleHorizontal,
  "1:1": Square,
} as const;

type PickerKind = "voice" | "music" | "caption";
type VoiceTypeFilter =
  | "all"
  | "mine"
  | "premade";

type FacelessVoiceOption = {
  voiceId: string;
  name: string;
  category: string | null;
  description: string | null;
  previewUrl: string | null;
  labels: Record<string, string>;
  isOwner: boolean;
};
const FALLBACK_VOICE_OPTIONS: FacelessVoiceOption[] = VOICE_OPTIONS.map(
  (v) =>
    ({
      voiceId: v.elevenLabsVoiceId,
      name: v.label,
      category: "premade",
      description: v.description,
      previewUrl: null,
      labels: { gender: v.tag },
      isOwner: false,
    }) satisfies FacelessVoiceOption,
);
type MusicPreviewState = {
  context: AudioContext;
  gain: GainNode;
  oscillators: OscillatorNode[];
  timeoutId: number;
};

function voiceRowClass(selected: boolean): string {
  return cn(
    "flex w-full items-stretch gap-2 rounded-xl border p-3 text-left transition sm:gap-3 sm:p-3.5",
    selected
      ? "border-cv-border-strong bg-cv-gold-subtle ring-1 ring-cv-gold-muted"
      : "border-cv-border bg-cv-bg-elevated/50 hover:border-cv-border-strong hover:bg-cv-bg-elevated",
  );
}

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
  const [durationSeconds, setDurationSeconds] = useState<DurationSecondsId>(60);
  const [selectedVoiceId, setSelectedVoiceId] = useState(
    VOICE_OPTIONS[0]?.elevenLabsVoiceId ?? "",
  );
  const [selectedVoiceName, setSelectedVoiceName] = useState(VOICE_OPTIONS[0]?.label ?? "Voice");
  const [musicId, setMusicId] = useState<string | null>(null);
  const [captionId, setCaptionId] = useState(CAPTION_OPTIONS[1]?.id ?? "c1");
  const [picker, setPicker] = useState<PickerKind | null>(null);
  const [generateMessage, setGenerateMessage] = useState<string | null>(null);
  const [isGeneratePending, startGenerateTransition] = useTransition();
  const [voicePreviewLoadingId, setVoicePreviewLoadingId] = useState<string | null>(null);
  const [activeVoiceId, setActiveVoiceId] = useState<string | null>(null);
  const [voicePreviewError, setVoicePreviewError] = useState<string | null>(null);
  const [voiceSearch, setVoiceSearch] = useState("");
  const [voiceTypeFilter, setVoiceTypeFilter] = useState<VoiceTypeFilter>("all");
  const [voiceCategoryFilter, setVoiceCategoryFilter] = useState("all");
  const [voiceGenderFilter, setVoiceGenderFilter] = useState("all");
  const [voiceAccentFilter, setVoiceAccentFilter] = useState("all");
  const [voiceAgeFilter, setVoiceAgeFilter] = useState("all");
  const [voiceOptions, setVoiceOptions] = useState<FacelessVoiceOption[]>(FALLBACK_VOICE_OPTIONS);
  const [isVoiceOptionsLoading, setIsVoiceOptionsLoading] = useState(false);
  const [musicMoodFilter, setMusicMoodFilter] = useState<"all" | string>("all");
  const [activeMusicId, setActiveMusicId] = useState<string | null>(null);
  const voicePreviewAudioRef = useRef<HTMLAudioElement | null>(null);
  /** Cached preview blob URLs keyed by ElevenLabs voice id (do not revoke until unmount or replace). */
  const voicePreviewCacheRef = useRef<Map<string, string>>(new Map());
  const voiceFetchAbortRef = useRef<AbortController | null>(null);
  const musicPreviewRef = useRef<MusicPreviewState | null>(null);

  useEffect(() => {
    return () => {
      voiceFetchAbortRef.current?.abort();
      for (const url of voicePreviewCacheRef.current.values()) {
        URL.revokeObjectURL(url);
      }
      voicePreviewCacheRef.current.clear();
      voicePreviewAudioRef.current?.pause();
      const current = musicPreviewRef.current;
      if (current) {
        for (const osc of current.oscillators) {
          try {
            osc.stop();
          } catch {}
        }
        current.context.close().catch(() => undefined);
      }
    };
  }, []);

  useEffect(() => {
    const audio = voicePreviewAudioRef.current;
    if (!audio) {
      return;
    }
    const onPlay = () => setVoicePreviewError(null);
    const onPause = () => setActiveVoiceId(null);
    const onEnded = () => setActiveVoiceId(null);
    const onError = () => {
      setActiveVoiceId(null);
      setVoicePreviewError("Preview failed to play. Try another voice.");
    };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, []);

  useEffect(() => {
    voiceFetchAbortRef.current?.abort();
    const controller = new AbortController();
    voiceFetchAbortRef.current = controller;
    setIsVoiceOptionsLoading(true);
    void (async () => {
      try {
        const res = await fetch("/api/faceless/voices", {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });
        if (!res.ok) {
          const err = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(err?.error || "Could not fetch voices.");
        }
        const data = (await res.json()) as { voices?: FacelessVoiceOption[] };
        const nextVoicesApi = Array.isArray(data.voices) ? data.voices : [];
        const deduped = new Map<string, FacelessVoiceOption>();
        for (const voice of [...nextVoicesApi, ...FALLBACK_VOICE_OPTIONS]) {
          if (!deduped.has(voice.voiceId)) {
            deduped.set(voice.voiceId, voice);
          }
        }
        const nextVoices = Array.from(deduped.values());
        setVoiceOptions(nextVoices);
        if (!selectedVoiceId && nextVoices[0]) {
          setSelectedVoiceId(nextVoices[0].voiceId);
          setSelectedVoiceName(nextVoices[0].name);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsVoiceOptionsLoading(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [
    selectedVoiceId,
  ]);

  function stopMusicPreview(): void {
    const current = musicPreviewRef.current;
    if (!current) {
      setActiveMusicId(null);
      return;
    }
    window.clearTimeout(current.timeoutId);
    for (const osc of current.oscillators) {
      try {
        osc.stop();
      } catch {}
    }
    current.context.close().catch(() => undefined);
    musicPreviewRef.current = null;
    setActiveMusicId(null);
  }

  async function toggleMusicPreview(id: string, mood: string): Promise<void> {
    if (id === "m0") {
      stopMusicPreview();
      return;
    }
    if (activeMusicId === id) {
      stopMusicPreview();
      return;
    }
    stopMusicPreview();
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) {
      return;
    }
    const context = new AudioCtor();
    const gain = context.createGain();
    gain.gain.value = 0.06;
    gain.connect(context.destination);
    const freqsByMood: Record<string, number[]> = {
      cinematic: [220, 329.63, 440],
      chill: [196, 246.94, 293.66],
      uplifting: [261.63, 329.63, 392],
      dramatic: [164.81, 246.94, 329.63],
      energetic: [293.66, 369.99, 440],
      warm: [174.61, 220, 261.63],
      silent: [220],
    };
    const key = mood.trim().toLowerCase();
    const freqs = freqsByMood[key] ?? [220, 277.18, 329.63];
    const oscillators = freqs.map((frequency, index) => {
      const osc = context.createOscillator();
      osc.type = index === 0 ? "sine" : index === 1 ? "triangle" : "sawtooth";
      osc.frequency.value = frequency;
      osc.connect(gain);
      osc.start();
      return osc;
    });
    const timeoutId = window.setTimeout(() => {
      stopMusicPreview();
    }, 6000);
    musicPreviewRef.current = { context, gain, oscillators, timeoutId };
    setActiveMusicId(id);
  }

  function playCachedPreview(elevenLabsVoiceId: string): void {
    const audio = voicePreviewAudioRef.current;
    const url = voicePreviewCacheRef.current.get(elevenLabsVoiceId);
    if (!audio || !url) {
      return;
    }
    audio.pause();
    audio.src = url;
    setActiveVoiceId(elevenLabsVoiceId);
    void audio.play().catch(() => {
      setActiveVoiceId(null);
      setVoicePreviewError("Tap Play again — your browser needs a direct tap to start audio.");
    });
  }

  async function toggleVoicePreview(v: FacelessVoiceOption): Promise<void> {
    setVoicePreviewError(null);
    const audio = voicePreviewAudioRef.current;
    if (!audio) {
      return;
    }

    if (activeVoiceId === v.voiceId && !audio.paused) {
      audio.pause();
      return;
    }

    if (v.previewUrl?.trim()) {
      audio.pause();
      audio.src = v.previewUrl;
      setActiveVoiceId(v.voiceId);
      void audio.play().catch(() => {
        setActiveVoiceId(null);
        setVoicePreviewError("Preview loaded. Tap Play once more to hear it.");
      });
      return;
    }

    if (voicePreviewCacheRef.current.has(v.voiceId)) {
      playCachedPreview(v.voiceId);
      return;
    }

    if (voicePreviewLoadingId) {
      return;
    }

    setVoicePreviewLoadingId(v.voiceId);
    try {
      const res = await fetch("/api/faceless/voice-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ elevenLabsVoiceId: v.voiceId }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => null)) as { error?: string } | null;
        setVoicePreviewError(
          typeof err?.error === "string" ? err.error : "Preview failed. Try again.",
        );
        return;
      }
      const blob = await res.blob();
      if (blob.size === 0) {
        setVoicePreviewError("Empty preview from server.");
        return;
      }
      const url = URL.createObjectURL(blob);
      const existing = voicePreviewCacheRef.current.get(v.voiceId);
      if (existing) {
        URL.revokeObjectURL(existing);
      }
      voicePreviewCacheRef.current.set(v.voiceId, url);
      audio.src = url;
      setActiveVoiceId(v.voiceId);
      void audio.play().catch(() => {
        setActiveVoiceId(null);
        setVoicePreviewError("Preview loaded. Tap Play once more to hear it.");
      });
    } catch {
      setVoicePreviewError("Could not load preview.");
    } finally {
      setVoicePreviewLoadingId(null);
    }
  }
  const fallbackVoice = VOICE_OPTIONS.find((v) => v.elevenLabsVoiceId === selectedVoiceId) ?? VOICE_OPTIONS[0];
  const voice =
    voiceOptions.find((v) => v.voiceId === selectedVoiceId) ??
    (fallbackVoice
      ? ({
          voiceId: fallbackVoice.elevenLabsVoiceId,
          name: fallbackVoice.label,
          category: null,
          description: fallbackVoice.description,
          previewUrl: null,
          labels: { gender: fallbackVoice.tag },
          isOwner: false,
        } satisfies FacelessVoiceOption)
      : null);
  const availableCategories = useMemo(
    () =>
      Array.from(
        new Set(
          voiceOptions.map((v) => (v.category ?? "").trim()).filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [voiceOptions],
  );
  const availableGenders = useMemo(
    () =>
      Array.from(
        new Set(voiceOptions.map((v) => (v.labels.gender ?? "").trim()).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b)),
    [voiceOptions],
  );
  const availableAccents = useMemo(
    () =>
      Array.from(
        new Set(voiceOptions.map((v) => (v.labels.accent ?? "").trim()).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b)),
    [voiceOptions],
  );
  const availableAges = useMemo(
    () =>
      Array.from(
        new Set(voiceOptions.map((v) => (v.labels.age ?? "").trim()).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b)),
    [voiceOptions],
  );
  useEffect(() => {
    if (voiceCategoryFilter !== "all" && !availableCategories.includes(voiceCategoryFilter)) {
      setVoiceCategoryFilter("all");
    }
  }, [voiceCategoryFilter, availableCategories]);
  useEffect(() => {
    if (voiceGenderFilter !== "all" && !availableGenders.includes(voiceGenderFilter)) {
      setVoiceGenderFilter("all");
    }
  }, [voiceGenderFilter, availableGenders]);
  useEffect(() => {
    if (voiceAccentFilter !== "all" && !availableAccents.includes(voiceAccentFilter)) {
      setVoiceAccentFilter("all");
    }
  }, [voiceAccentFilter, availableAccents]);
  useEffect(() => {
    if (voiceAgeFilter !== "all" && !availableAges.includes(voiceAgeFilter)) {
      setVoiceAgeFilter("all");
    }
  }, [voiceAgeFilter, availableAges]);
  const filteredVoiceOptions = useMemo(() => {
    const q = voiceSearch.trim().toLowerCase();
    return voiceOptions.filter((v) => {
      if (voiceTypeFilter === "mine" && !v.isOwner) return false;
      if (voiceTypeFilter === "premade" && (v.category ?? "").toLowerCase() !== "premade") return false;
      if (voiceCategoryFilter !== "all" && (v.category ?? "") !== voiceCategoryFilter) return false;
      if (voiceGenderFilter !== "all" && (v.labels.gender ?? "") !== voiceGenderFilter) return false;
      if (voiceAccentFilter !== "all" && (v.labels.accent ?? "") !== voiceAccentFilter) return false;
      if (voiceAgeFilter !== "all" && (v.labels.age ?? "") !== voiceAgeFilter) return false;
      if (!q) return true;
      const hay = [
        v.name,
        v.description ?? "",
        v.category ?? "",
        v.labels.gender ?? "",
        v.labels.accent ?? "",
        v.labels.age ?? "",
        v.labels.language ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [
    voiceOptions,
    voiceSearch,
    voiceTypeFilter,
    voiceCategoryFilter,
    voiceGenderFilter,
    voiceAccentFilter,
    voiceAgeFilter,
  ]);
  const musicMoodOptions = useMemo(
    () =>
      Array.from(new Set(MUSIC_OPTIONS.map((m) => m.mood).filter((mood) => mood && mood !== "Silent"))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [],
  );
  const filteredMusicOptions = useMemo(() => {
    if (musicMoodFilter === "all") {
      return MUSIC_OPTIONS;
    }
    return MUSIC_OPTIONS.filter((m) => m.mood === musicMoodFilter || m.id === "m0");
  }, [musicMoodFilter]);
  const music = MUSIC_OPTIONS.find((m) => m.id === musicId) ?? MUSIC_OPTIONS[0];
  const caption = CAPTION_OPTIONS.find((c) => c.id === captionId) ?? CAPTION_OPTIONS[0];

  const { total, lines } = useMemo(
    () =>
      estimateCredits({
        videoType,
        styleId: videoType === "stock" ? null : styleId,
        aspect,
        durationSeconds,
        voiceCredits: 2,
        musicCredits: music?.credits ?? 0,
        captionCredits: caption?.credits ?? 0,
        scriptMode,
      }),
    [videoType, styleId, aspect, durationSeconds, voice, music, caption, scriptMode],
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

  function onGenerateVideoClick(): void {
    if (!canSubmit || isGeneratePending) {
      return;
    }
    setGenerateMessage(null);
    startGenerateTransition(() => {
      void (async () => {
        const result = await requestFacelessVideoGeneration({
          prompt: brief,
          videoType,
          durationSeconds,
          scriptMode,
          videoStyle: videoType === "stock" ? null : styleId,
          elevenLabsVoiceId: selectedVoiceId,
        });
        if (result.ok) {
          setGenerateMessage("Generation started. You can track progress in Inngest.");
        } else {
          setGenerateMessage(result.error);
        }
      })();
    });
  }

  return (
    <>
      <audio ref={voicePreviewAudioRef} className="hidden" playsInline preload="none" />
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

            <FormSection
              title="Duration"
              description="Target runtime for export. Credit estimate scales with length."
            >
              <fieldset className="grid grid-cols-3 gap-2 sm:gap-3">
                <legend className="sr-only">Target duration</legend>
                {DURATION_OPTIONS.map((d) => {
                  const selected = durationSeconds === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDurationSeconds(d.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center transition sm:px-3 sm:py-4",
                        selected
                          ? "border-cv-border-strong bg-cv-gold-subtle ring-1 ring-cv-gold-muted"
                          : "border-cv-border bg-cv-bg-elevated/40 hover:border-cv-border-strong",
                      )}
                    >
                      <Clock
                        className={cn(
                          "h-5 w-5 sm:h-6 sm:w-6",
                          selected ? "text-cv-gold-bright" : "text-cv-text-tertiary",
                        )}
                        aria-hidden
                      />
                      <span className="text-xs font-semibold text-cv-text-primary sm:text-sm">
                        {d.label}
                      </span>
                      <span className="hidden text-[10px] leading-snug text-cv-text-tertiary sm:block">
                        {d.hint}
                      </span>
                    </button>
                  );
                })}
              </fieldset>
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
                      {voice?.name ?? selectedVoiceName}
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
                      {musicId ? music?.label : "Not selected"}
                      {musicId && music?.id !== "m0" ? <span className="text-cv-text-tertiary"> · {music?.mood}</span> : null}
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
                  disabled={!canSubmit || isGeneratePending}
                  onClick={onGenerateVideoClick}
                  className="inline-flex h-10 w-full shrink-0 touch-manipulation items-center justify-center rounded-lg bg-cv-gold px-5 text-[13px] font-semibold text-cv-bg-deep shadow-[0_0_20px_var(--cv-gold-glow)] transition hover:bg-cv-gold-hover active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40 sm:h-11 sm:w-auto sm:min-w-[200px] sm:rounded-xl sm:px-8 sm:text-sm"
                >
                  {isGeneratePending ? "Starting…" : "Generate video"}
                </button>
              </div>
              {!canSubmit ? (
                <p className="mt-2 text-[11px] leading-snug text-cv-text-tertiary sm:mt-3 sm:text-xs">
                  Add at least 8 characters in your {scriptMode ? "script" : "brief"} to continue.
                </p>
              ) : null}
              {generateMessage ? (
                <p
                  className="mt-2 text-[11px] leading-snug text-cv-text-secondary sm:mt-3 sm:text-xs"
                  role="status"
                >
                  {generateMessage}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="hidden min-h-0 min-w-0 flex-col overflow-hidden lg:flex lg:h-full lg:max-w-[300px] xl:max-w-[320px]">
          <div className="cv-scrollbar-dashboard flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
            <VideoPreviewPanel
              aspect={aspect}
              durationSeconds={durationSeconds}
              totalCredits={total}
              creditLines={lines}
            />
          </div>
        </aside>
      </div>

      <PickerModal
        open={picker === "voice"}
        onClose={() => {
          setVoicePreviewError(null);
          setPicker(null);
        }}
        size="wide"
        title="Narrator voice"
        description="Browse your ElevenLabs voices, filter by labels, and preview with reliable play/pause."
      >
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="flex items-center gap-2 rounded-lg border border-cv-border bg-cv-bg-elevated/50 px-3 py-2">
              <Search className="h-4 w-4 text-cv-text-tertiary" aria-hidden />
              <input
                value={voiceSearch}
                onChange={(e) => setVoiceSearch(e.target.value)}
                placeholder="Search name, description, labels"
                className="w-full bg-transparent text-sm text-cv-text-primary outline-none placeholder:text-cv-text-tertiary"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {(["all", "mine", "premade"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setVoiceTypeFilter(option)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    voiceTypeFilter === option
                      ? "border-cv-border-strong bg-cv-gold-subtle text-cv-gold-bright"
                      : "border-cv-border bg-cv-bg-elevated/50 text-cv-text-secondary hover:border-cv-border-strong",
                  )}
                >
                  {option === "all" ? "All voices" : option === "mine" ? "My voices" : "Premade"}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {["all", ...availableCategories].map((category) => (
                <button
                  key={`cat-${category}`}
                  type="button"
                  onClick={() => setVoiceCategoryFilter(category)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    voiceCategoryFilter === category
                      ? "border-cv-border-strong bg-cv-gold-subtle text-cv-gold-bright"
                      : "border-cv-border bg-cv-bg-elevated/50 text-cv-text-secondary hover:border-cv-border-strong",
                  )}
                >
                  {category === "all" ? "All categories" : category}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {["all", ...availableGenders].map((gender) => (
                <button
                  key={`gender-${gender}`}
                  type="button"
                  onClick={() => setVoiceGenderFilter(gender)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    voiceGenderFilter === gender
                      ? "border-cv-border-strong bg-cv-gold-subtle text-cv-gold-bright"
                      : "border-cv-border bg-cv-bg-elevated/50 text-cv-text-secondary hover:border-cv-border-strong",
                  )}
                >
                  {gender === "all" ? "Any gender" : gender}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {["all", ...availableAccents].map((accent) => (
                <button
                  key={`accent-${accent}`}
                  type="button"
                  onClick={() => setVoiceAccentFilter(accent)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    voiceAccentFilter === accent
                      ? "border-cv-border-strong bg-cv-gold-subtle text-cv-gold-bright"
                      : "border-cv-border bg-cv-bg-elevated/50 text-cv-text-secondary hover:border-cv-border-strong",
                  )}
                >
                  {accent === "all" ? "Any accent" : accent}
                </button>
              ))}
              {["all", ...availableAges].map((age) => (
                <button
                  key={`age-${age}`}
                  type="button"
                  onClick={() => setVoiceAgeFilter(age)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    voiceAgeFilter === age
                      ? "border-cv-border-strong bg-cv-gold-subtle text-cv-gold-bright"
                      : "border-cv-border bg-cv-bg-elevated/50 text-cv-text-secondary hover:border-cv-border-strong",
                  )}
                >
                  {age === "all" ? "Any age" : age}
                </button>
              ))}
            </div>
          </div>
          <ul className="space-y-2 sm:space-y-2.5">
            {!isVoiceOptionsLoading && filteredVoiceOptions.length === 0 ? (
              <li className="rounded-lg border border-cv-border bg-cv-bg-elevated/40 px-3 py-3 text-sm text-cv-text-secondary">
                No voices found for current filters.
              </li>
            ) : null}
            {filteredVoiceOptions.map((v) => {
              const selected = selectedVoiceId === v.voiceId;
              const loading = voicePreviewLoadingId === v.voiceId;
              const isPlaying = activeVoiceId === v.voiceId;
              const gender = v.labels.gender ?? "Unknown";
              const accent = v.labels.accent ?? "Unknown accent";
              return (
                <li key={v.voiceId} className={voiceRowClass(selected)}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVoiceId(v.voiceId);
                      setSelectedVoiceName(v.name);
                      setVoicePreviewError(null);
                      setPicker(null);
                    }}
                    className="flex min-w-0 flex-1 flex-col gap-1 rounded-lg py-0.5 text-left transition hover:opacity-95"
                  >
                    <span className="text-sm font-semibold text-cv-text-primary">{v.name}</span>
                    <span className="text-[11px] font-medium uppercase tracking-wide text-cv-text-tertiary">
                      {gender} · {accent}
                    </span>
                    <span className="text-xs leading-relaxed text-cv-text-secondary">
                      {v.description ?? "No description from ElevenLabs."}
                    </span>
                    <span className="mt-1 text-[11px] tabular-nums text-cv-text-tertiary">
                      {v.category ?? "uncategorized"} · {v.previewUrl ? "native preview" : "generated preview"}
                    </span>
                  </button>
                  <div className="flex shrink-0 flex-col items-center justify-center gap-1 border-l border-cv-border/60 pl-2 sm:pl-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        void toggleVoicePreview(v);
                      }}
                      disabled={Boolean(voicePreviewLoadingId && voicePreviewLoadingId !== v.voiceId)}
                      aria-label={`${isPlaying ? "Pause" : "Play"} preview: ${v.name}`}
                      className="inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-lg border border-cv-border bg-cv-bg-deep/70 text-cv-gold-bright transition hover:border-cv-border-strong hover:bg-cv-bg-elevated disabled:pointer-events-none disabled:opacity-40"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      ) : isPlaying ? (
                        <Pause className="h-4 w-4" aria-hidden />
                      ) : (
                        <Play className="h-4 w-4 translate-x-px" aria-hidden fill="currentColor" />
                      )}
                    </button>
                    {selected ? (
                      <span className="text-[10px] font-medium text-cv-gold-bright">Selected</span>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        {voicePreviewError ? (
          <p className="mt-3 text-xs text-cv-text-secondary" role="alert">
            {voicePreviewError}
          </p>
        ) : null}
      </PickerModal>

      <PickerModal
        open={picker === "music"}
        onClose={() => {
          stopMusicPreview();
          setPicker(null);
        }}
        title="Background music"
        description="Pick music by mood and preview with play/pause."
      >
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMusicMoodFilter("all")}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                musicMoodFilter === "all"
                  ? "border-cv-border-strong bg-cv-gold-subtle text-cv-gold-bright"
                  : "border-cv-border bg-cv-bg-elevated/50 text-cv-text-secondary hover:border-cv-border-strong",
              )}
            >
              All moods
            </button>
            {musicMoodOptions.map((mood) => (
              <button
                key={mood}
                type="button"
                onClick={() => setMusicMoodFilter(mood)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  musicMoodFilter === mood
                    ? "border-cv-border-strong bg-cv-gold-subtle text-cv-gold-bright"
                    : "border-cv-border bg-cv-bg-elevated/50 text-cv-text-secondary hover:border-cv-border-strong",
                )}
              >
                {mood}
              </button>
            ))}
          </div>
          <ul className="space-y-0.5 sm:space-y-1">
          {filteredMusicOptions.map((m) => {
            const selected = musicId === m.id;
            const isPlaying = activeMusicId === m.id;
            return (
              <li key={m.id}>
                <div className={pickerRowClass(selected, "center")}>
                  <button
                    type="button"
                    onClick={() => {
                      setMusicId(m.id === "m0" ? null : m.id);
                      setPicker(null);
                      stopMusicPreview();
                    }}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="block font-medium">{m.label}</span>
                    <span className="mt-0.5 block text-xs text-cv-text-tertiary">{m.mood}</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        void toggleMusicPreview(m.id, m.mood);
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-cv-border bg-cv-bg-deep/60 text-cv-gold-bright"
                      aria-label={`${isPlaying ? "Pause" : "Play"} music preview`}
                    >
                      {isPlaying ? <Pause className="h-3.5 w-3.5" aria-hidden /> : <Play className="h-3.5 w-3.5 translate-x-px" aria-hidden fill="currentColor" />}
                    </button>
                    <span className="shrink-0 tabular-nums text-xs font-semibold text-cv-text-secondary">
                      +{m.credits}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
          </ul>
        </div>
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
