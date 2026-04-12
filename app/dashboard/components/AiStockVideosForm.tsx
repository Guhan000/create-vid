"use client";

import * as React from "react";

const STYLE_TYPES = [
  "Cinematic Product Hero",
  "Urban Street Cinematic",
  "Nature Drone Panorama",
  "Tech Gadget Closeup",
  "Sports Action Highlight",
  "Fashion Editorial Runway",
  "Documentary Cinematic",
  "Abstract Motion Study",
  "Travel Montage Teaser",
  "Neon Cyberpunk",
  "Neo Noir Night Mood",
  "Retro Film Grain",
  "Minimal Studio Clean",
  "Anime-Inspired Motion",
  "Surreal Dreamscape",
  "Corporate Clean Demo",
] as const;
type StyleType = (typeof STYLE_TYPES)[number];

const SHOT_TYPES = ["closeup", "drone", "timelapse", "wide-shot", "macro"] as const;
type ShotType = (typeof SHOT_TYPES)[number];

const CAMERA_MOTIONS = ["zoom", "pan", "orbit", "dolly-in", "dolly-out", "handheld", "whip-pan"] as const;
type CameraMotion = (typeof CAMERA_MOTIONS)[number];

const COLOR_GRADING_OPTIONS = [
  "none",
  "Teal & Orange Pop",
  "Warm Golden Hour",
  "Cool Steel Tone",
  "Monochrome Noir",
  "Cinematic Noir",
  "Pastel Soft",
  "Vibrant Punch",
] as const;
type ColorGrading = (typeof COLOR_GRADING_OPTIONS)[number];

const FPS_OPTIONS = [24, 30, 60] as const;
type FpsOption = (typeof FPS_OPTIONS)[number];

const SEED_MODES = [
  { key: "consistent", label: "Consistent (fixed seed)" },
  { key: "session-stable", label: "Session-stable (repeatable)" },
  { key: "random", label: "Random (varies every run)" },
] as const;
type SeedMode = (typeof SEED_MODES)[number]["key"];

const PROMPT_TEMPLATES = [
  "Cinematic Product Hero",
  "Urban Street Cinematic",
  "Nature Drone Panorama",
  "Tech Gadget Closeup",
  "Sports Action Highlight",
  "Fashion Editorial Runway",
  "Documentary Field Recap",
  "Abstract Motion Study",
  "Travel Montage Teaser",
  "Chase Scene Momentum",
] as const;

const SCRIPT_TEMPLATES = [
  "YouTube Shorts Story Hook",
  "Product Showcase Narration",
  "Explainer (Simple + Clear)",
  "Cinematic Voice-over Scene",
  "Educational Micro-Story",
  "UGC-Style Reaction Script",
  "Corporate Demo Walkthrough",
  "Documentary Narration Segment",
  "Minimal Script (Clean Lines)",
  "High-Energy Promo Script",
] as const;

const SCRIPT_TYPES = [
  "Storytelling narration",
  "Product demo narration",
  "How-it-works explainer",
  "Motivational / quote style",
  "UGC reaction + CTA",
  "Scene-by-scene cinematic script",
] as const;
type ScriptType = (typeof SCRIPT_TYPES)[number];

const VOICE_OVER_OPTIONS = [
  "Narration (clear)",
  "Storytelling voice",
  "Explainer tone",
  "Energetic hype",
  "Calm cinematic",
  "Playful/comedic",
  "None",
] as const;
type VoiceOverOption = (typeof VOICE_OVER_OPTIONS)[number];

const BACKGROUND_SOUND_OPTIONS = [
  "Cinematic score",
  "Ambient ambience",
  "Lo-fi beats",
  "Tech synthwave",
  "Nature field",
  "Upbeat music",
  "None",
] as const;
type BackgroundSoundOption = (typeof BACKGROUND_SOUND_OPTIONS)[number];

const CAPTION_FONT_STYLES = [
  "Sans (clean)",
  "Serif (classic)",
  "Mono (tech)",
  "Rounded (friendly)",
  "Display (bold)",
] as const;
type CaptionFontStyle = (typeof CAPTION_FONT_STYLES)[number];

const CAPTION_SIZES = ["Small", "Medium", "Large", "XL"] as const;
type CaptionSize = (typeof CAPTION_SIZES)[number];

const CAPTION_WEIGHTS = ["Regular", "Medium", "SemiBold", "Bold", "ExtraBold"] as const;
type CaptionWeight = (typeof CAPTION_WEIGHTS)[number];

const CAPTION_POSITIONS = ["Bottom", "Center", "Top"] as const;
type CaptionPosition = (typeof CAPTION_POSITIONS)[number];

const TRANSITION_STYLES = ["Cut", "Fade", "Slide", "Wipe", "Zoom transition"] as const;
type TransitionStyle = (typeof TRANSITION_STYLES)[number];

const LENS_STYLES = ["35mm film look", "24mm wide", "85mm portrait", "Macro detail", "Anamorphic"] as const;
type LensStyle = (typeof LENS_STYLES)[number];

const ASPECT_RATIOS = ["9:16 (Shorts)", "16:9 (YouTube)", "1:1 (Square)", "4:5 (Feed)"] as const;
type AspectRatio = (typeof ASPECT_RATIOS)[number];

const DISTRIBUTION_PRESETS = [
  {
    key: "vertical-social",
    label: "Vertical social (TikTok / Reels / Shorts)",
    aspect: "9:16 (Shorts)" as AspectRatio,
  },
  {
    key: "youtube",
    label: "YouTube (landscape)",
    aspect: "16:9 (YouTube)" as AspectRatio,
  },
  {
    key: "square",
    label: "Square / feed (1:1)",
    aspect: "1:1 (Square)" as AspectRatio,
  },
  {
    key: "portrait-feed",
    label: "Portrait feed (4:5)",
    aspect: "4:5 (Feed)" as AspectRatio,
  },
] as const;
type DistributionKey = (typeof DISTRIBUTION_PRESETS)[number]["key"];

const OUTPUT_LANGUAGES = [
  "English (US)",
  "English (UK)",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Hindi",
  "Japanese",
] as const;
type OutputLanguage = (typeof OUTPUT_LANGUAGES)[number];

const EXPORT_QUALITY_PRESETS = [
  "720p (fast preview)",
  "1080p (standard)",
  "1080p (high bitrate)",
  "4K (pro)",
] as const;
type ExportQuality = (typeof EXPORT_QUALITY_PRESETS)[number];

const fieldClass =
  "rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary outline-none focus:border-cv-border-strong focus:ring-1 focus:ring-cv-gold/25";

const SPEECH_TONES = [
  "Expressive",
  "Narration (neutral/professional)",
  "Energetic hype",
  "Calm cinematic",
  "Playful/comedic",
  "Dramatic storytelling",
] as const;
type SpeechTone = (typeof SPEECH_TONES)[number];

const EMOTION_VIBES = ["Inspirational", "Confident", "Tense", "Dreamy", "Funny", "Action-packed"] as const;
type EmotionVibe = (typeof EMOTION_VIBES)[number];

function toggleInList<T extends string>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((v) => v !== item) : [...list, item];
}

function clampToMaxWords(input: string, maxWords: number): string {
  const words = input.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return input;
  return words.slice(0, maxWords).join(" ");
}

export function AiStockVideosForm(): React.ReactElement {
  const [promptOrScript, setPromptOrScript] = React.useState<"prompt" | "script">("prompt");
  const [templateIndex, setTemplateIndex] = React.useState<number>(0);
  const [styleType, setStyleType] = React.useState<StyleType>(STYLE_TYPES[0]);
  const [sceneCount, setSceneCount] = React.useState<number>(5);
  const [shotTypes, setShotTypes] = React.useState<ShotType[]>(["closeup"]);
  const [cameraMotions, setCameraMotions] = React.useState<CameraMotion[]>(["zoom"]);
  const [colorGrading, setColorGrading] = React.useState<ColorGrading>(COLOR_GRADING_OPTIONS[0]);
  const [fps, setFps] = React.useState<FpsOption>(30);
  const [seedMode, setSeedMode] = React.useState<SeedMode>("consistent");
  const [seedValue, setSeedValue] = React.useState<number>(12345);
  const [promptText, setPromptText] = React.useState<string>("");
  const [scriptType, setScriptType] = React.useState<ScriptType>("Storytelling narration");
  const [voiceOver, setVoiceOver] = React.useState<VoiceOverOption>(VOICE_OVER_OPTIONS[0]);
  const [backgroundSound, setBackgroundSound] = React.useState<BackgroundSoundOption>(BACKGROUND_SOUND_OPTIONS[0]);
  const [audioIntensity, setAudioIntensity] = React.useState<number>(70); // 1-100

  const [captionFontStyle, setCaptionFontStyle] = React.useState<CaptionFontStyle>(CAPTION_FONT_STYLES[0]);
  const [captionSize, setCaptionSize] = React.useState<CaptionSize>(CAPTION_SIZES[2] ?? CAPTION_SIZES[0]);
  const [captionWeight, setCaptionWeight] = React.useState<CaptionWeight>(CAPTION_WEIGHTS[2] ?? CAPTION_WEIGHTS[0]);
  const [captionPosition, setCaptionPosition] = React.useState<CaptionPosition>(CAPTION_POSITIONS[0]);

  const [transitionStyle, setTransitionStyle] = React.useState<TransitionStyle>(TRANSITION_STYLES[0]);
  const [lensStyle, setLensStyle] = React.useState<LensStyle>(LENS_STYLES[0]);
  const [aspectRatio, setAspectRatio] = React.useState<AspectRatio>(ASPECT_RATIOS[0]);
  const [motionIntensity, setMotionIntensity] = React.useState<number>(6); // 1-10
  const [vfxIntensity, setVfxIntensity] = React.useState<number>(5); // 1-10

  const [parallaxEnabled, setParallaxEnabled] = React.useState<boolean>(false);
  const [depthOfFieldEnabled, setDepthOfFieldEnabled] = React.useState<boolean>(false);
  const [motionBlurEnabled, setMotionBlurEnabled] = React.useState<boolean>(false);

  const [speechTone, setSpeechTone] = React.useState<SpeechTone>(SPEECH_TONES[0]);
  const [emotionVibe, setEmotionVibe] = React.useState<EmotionVibe>(EMOTION_VIBES[0]);

  const [distributionPreset, setDistributionPreset] =
    React.useState<DistributionKey>("vertical-social");
  const [outputLanguage, setOutputLanguage] =
    React.useState<OutputLanguage>("English (US)");
  const [exportQuality, setExportQuality] = React.useState<ExportQuality>(
    "1080p (standard)",
  );

  function handleDistributionChange(key: DistributionKey): void {
    setDistributionPreset(key);
    const preset = DISTRIBUTION_PRESETS.find((p) => p.key === key);
    if (preset) setAspectRatio(preset.aspect);
  }

  const enableSeedInput = seedMode !== "random";

  const canGenerate = promptOrScript === "script" || promptText.trim().length > 0;

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="rounded-xl border border-cv-border-strong bg-cv-bg-card/95 p-4 shadow-[0_0_0_1px_var(--cv-border)] backdrop-blur-sm sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight text-cv-text-primary sm:text-xl">
          Create video
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-cv-text-secondary">
          Choose where this video will live, how it should look and sound, then add
          your script or prompt below.
        </p>

        <div className="mt-5 border-t border-cv-border pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-cv-gold-muted">
            Required setup
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">
                Distribution / platform <span className="text-cv-gold">*</span>
              </span>
              <select
                required
                value={distributionPreset}
                onChange={(e) =>
                  handleDistributionChange(e.target.value as DistributionKey)
                }
                className={fieldClass}
              >
                {DISTRIBUTION_PRESETS.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
              <span className="text-xs text-cv-text-tertiary">
                Sets a default aspect ratio; you can override next.
              </span>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">
                Aspect ratio <span className="text-cv-gold">*</span>
              </span>
              <select
                required
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className={fieldClass}
              >
                {ASPECT_RATIOS.map((ar) => (
                  <option key={ar} value={ar}>
                    {ar}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">
                Export quality <span className="text-cv-gold">*</span>
              </span>
              <select
                required
                value={exportQuality}
                onChange={(e) =>
                  setExportQuality(e.target.value as ExportQuality)
                }
                className={fieldClass}
              >
                {EXPORT_QUALITY_PRESETS.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">
                Spoken language <span className="text-cv-gold">*</span>
              </span>
              <select
                required
                value={outputLanguage}
                onChange={(e) =>
                  setOutputLanguage(e.target.value as OutputLanguage)
                }
                className={fieldClass}
              >
                {OUTPUT_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">
                Visual style <span className="text-cv-gold">*</span>
              </span>
              <select
                required
                value={styleType}
                onChange={(e) => setStyleType(e.target.value as StyleType)}
                className={fieldClass}
              >
                {STYLE_TYPES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">
                Scene count <span className="text-cv-gold">*</span>
              </span>
              <select
                required
                value={sceneCount}
                onChange={(e) => setSceneCount(Number(e.target.value))}
                className={fieldClass}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} scenes
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">
                Voice over <span className="text-cv-gold">*</span>
              </span>
              <select
                required
                value={voiceOver}
                onChange={(e) => setVoiceOver(e.target.value as VoiceOverOption)}
                className={fieldClass}
              >
                {VOICE_OVER_OPTIONS.map((vo) => (
                  <option key={vo} value={vo}>
                    {vo}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">
                Background sound <span className="text-cv-gold">*</span>
              </span>
              <select
                required
                value={backgroundSound}
                onChange={(e) =>
                  setBackgroundSound(e.target.value as BackgroundSoundOption)
                }
                className={fieldClass}
              >
                {BACKGROUND_SOUND_OPTIONS.map((bs) => (
                  <option key={bs} value={bs}>
                    {bs}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-cv-border bg-cv-bg-card p-4 sm:p-5">
          <div className="text-sm font-semibold text-cv-text-primary">Scripts / Prompts</div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">
                Prompt or Script
              </span>
              <select
                value={promptOrScript}
                onChange={(e) => setPromptOrScript(e.target.value as "prompt" | "script")}
                className="rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary outline-none focus:border-cv-border-strong focus:ring-1 focus:ring-cv-gold/25"
              >
                <option value="prompt">Prompt</option>
                <option value="script">Script (generated by AI)</option>
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">Template</span>
              <select
                value={templateIndex}
                onChange={(e) => setTemplateIndex(Number(e.target.value))}
                className="rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary outline-none focus:border-cv-border-strong focus:ring-1 focus:ring-cv-gold/25"
              >
                {Array.from({ length: 10 }, (_, idx) => idx).map((idx) => {
                  const label =
                    promptOrScript === "prompt" ? PROMPT_TEMPLATES[idx] : SCRIPT_TEMPLATES[idx];
                  return (
                    <option key={idx} value={idx}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>

          {promptOrScript === "prompt" ? (
            <div className="mt-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-cv-text-primary">
                  Prompt (up to 400 words)
                </span>
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(clampToMaxWords(e.target.value, 400))}
                  placeholder="Describe subject, setting, mood, camera style, and key details..."
                  rows={6}
                  className="rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary placeholder:text-cv-text-tertiary outline-none focus:border-cv-border-strong focus:ring-1 focus:ring-cv-gold/25"
                />
                <span className="text-xs text-cv-text-tertiary">
                  {Math.min(
                    promptText.trim().length ? promptText.trim().split(/\s+/).filter(Boolean).length : 0,
                    400
                  )}
                  /400 words
                </span>
              </label>
            </div>
          ) : (
            <div className="mt-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-cv-text-primary">Script type</span>
                <select
                  value={scriptType}
                  onChange={(e) => setScriptType(e.target.value as ScriptType)}
                  className="rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary outline-none focus:border-cv-border-strong focus:ring-1 focus:ring-cv-gold/25"
                >
                  {SCRIPT_TYPES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-cv-text-tertiary">
                  Pick a script type, then choose a template for scene pacing.
                </span>
              </label>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-cv-border bg-cv-bg-card p-4 sm:p-5">
          <div className="text-sm font-semibold text-cv-text-primary">
            Color &amp; frame rate
          </div>
          <p className="mt-1 text-xs text-cv-text-tertiary">
            Fine-tune grade and FPS after your required setup above.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">Color grading</span>
              <select
                value={colorGrading}
                onChange={(e) => setColorGrading(e.target.value as ColorGrading)}
                className="rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary outline-none focus:border-cv-border-strong focus:ring-1 focus:ring-cv-gold/25"
              >
                {COLOR_GRADING_OPTIONS.map((cg) => (
                  <option key={cg} value={cg}>
                    {cg}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">FPS</span>
              <select
                value={fps}
                onChange={(e) => setFps(Number(e.target.value) as FpsOption)}
                className="rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary outline-none focus:border-cv-border-strong focus:ring-1 focus:ring-cv-gold/25"
              >
                {FPS_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f} fps
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-cv-border bg-cv-bg-card p-4 sm:p-5">
          <div className="text-sm font-semibold text-cv-text-primary">Sound mix</div>
          <p className="mt-1 text-xs text-cv-text-tertiary">
            Voice and bed are set in Required setup; adjust blend here.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-sm font-medium text-cv-text-primary">
                Audio intensity ({audioIntensity}%)
              </span>
              <input
                type="range"
                min={1}
                max={100}
                value={audioIntensity}
                onChange={(e) => setAudioIntensity(Number(e.target.value))}
                className="h-2 w-full cursor-pointer accent-cv-gold"
              />
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-cv-border bg-cv-bg-card p-4 sm:p-5">
          <div className="text-sm font-semibold text-cv-text-primary">Captions</div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">Font style</span>
              <select
                value={captionFontStyle}
                onChange={(e) => setCaptionFontStyle(e.target.value as CaptionFontStyle)}
                className="rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary outline-none focus:border-cv-border-strong focus:ring-1 focus:ring-cv-gold/25"
              >
                {CAPTION_FONT_STYLES.map((fs) => (
                  <option key={fs} value={fs}>
                    {fs}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">Size</span>
              <select
                value={captionSize}
                onChange={(e) => setCaptionSize(e.target.value as CaptionSize)}
                className="rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary outline-none focus:border-cv-border-strong focus:ring-1 focus:ring-cv-gold/25"
              >
                {CAPTION_SIZES.map((cs) => (
                  <option key={cs} value={cs}>
                    {cs}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">Weight</span>
              <select
                value={captionWeight}
                onChange={(e) => setCaptionWeight(e.target.value as CaptionWeight)}
                className="rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary outline-none focus:border-cv-border-strong focus:ring-1 focus:ring-cv-gold/25"
              >
                {CAPTION_WEIGHTS.map((cw) => (
                  <option key={cw} value={cw}>
                    {cw}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">Position</span>
              <select
                value={captionPosition}
                onChange={(e) => setCaptionPosition(e.target.value as CaptionPosition)}
                className="rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary outline-none focus:border-cv-border-strong focus:ring-1 focus:ring-cv-gold/25"
              >
                {CAPTION_POSITIONS.map((cp) => (
                  <option key={cp} value={cp}>
                    {cp}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-cv-border bg-cv-bg-card p-4 sm:p-5">
          <div className="text-sm font-semibold text-cv-text-primary">Advanced (Remotion-style)</div>
          <div className="mt-1 text-xs text-cv-text-tertiary">
            Camera motion, transitions, speech tone, and extra “make it awesome” controls.
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-cv-border bg-cv-bg-elevated/90 p-4">
              <div className="text-sm font-medium text-cv-text-primary">Shot types</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {SHOT_TYPES.map((st) => {
                  const checked = shotTypes.includes(st);
                  return (
                    <label
                      key={st}
                      className={[
                        "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                        checked
                          ? "border-cv-border-strong bg-cv-gold-subtle text-cv-text-primary"
                          : "border-cv-border bg-cv-bg-deep/40 text-cv-text-secondary hover:border-cv-border-strong hover:bg-cv-bg-elevated",
                      ].join(" ")}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => setShotTypes((prev) => toggleInList(prev, st))}
                        className="h-4 w-4 accent-cv-gold"
                      />
                      {st}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-cv-border bg-cv-bg-elevated/90 p-4">
              <div className="text-sm font-medium text-cv-text-primary">Camera movement</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {CAMERA_MOTIONS.map((cm) => {
                  const checked = cameraMotions.includes(cm);
                  return (
                    <label
                      key={cm}
                      className={[
                        "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                        checked
                          ? "border-cv-border-strong bg-cv-gold-subtle text-cv-text-primary"
                          : "border-cv-border bg-cv-bg-deep/40 text-cv-text-secondary hover:border-cv-border-strong hover:bg-cv-bg-elevated",
                      ].join(" ")}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => setCameraMotions((prev) => toggleInList(prev, cm))}
                        className="h-4 w-4 accent-cv-gold"
                      />
                      {cm}
                    </label>
                  );
                })}
              </div>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">Transition style</span>
              <select
                value={transitionStyle}
                onChange={(e) => setTransitionStyle(e.target.value as TransitionStyle)}
                className="rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary outline-none focus:border-cv-border-strong focus:ring-1 focus:ring-cv-gold/25"
              >
                {TRANSITION_STYLES.map((ts) => (
                  <option key={ts} value={ts}>
                    {ts}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">Lens style</span>
              <select
                value={lensStyle}
                onChange={(e) => setLensStyle(e.target.value as LensStyle)}
                className="rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary outline-none focus:border-cv-border-strong focus:ring-1 focus:ring-cv-gold/25"
              >
                {LENS_STYLES.map((ls) => (
                  <option key={ls} value={ls}>
                    {ls}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-cv-text-primary">Motion intensity ({motionIntensity}/10)</span>
              <input
                type="range"
                min={1}
                max={10}
                value={motionIntensity}
                onChange={(e) => setMotionIntensity(Number(e.target.value))}
                className="h-2 w-full cursor-pointer accent-cv-gold"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-cv-text-primary">VFX intensity ({vfxIntensity}/10)</span>
              <input
                type="range"
                min={1}
                max={10}
                value={vfxIntensity}
                onChange={(e) => setVfxIntensity(Number(e.target.value))}
                className="h-2 w-full cursor-pointer accent-cv-gold"
              />
            </label>

            <div className="rounded-lg border border-cv-border bg-cv-bg-elevated/90 p-4 md:col-span-2">
              <div className="text-sm font-medium text-cv-text-primary">Remotion effects</div>
              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary hover:border-cv-border-strong">
                  <input
                    type="checkbox"
                    checked={parallaxEnabled}
                    onChange={(e) => setParallaxEnabled(e.target.checked)}
                    className="h-4 w-4 accent-cv-gold"
                  />
                  Parallax
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary hover:border-cv-border-strong">
                  <input
                    type="checkbox"
                    checked={depthOfFieldEnabled}
                    onChange={(e) => setDepthOfFieldEnabled(e.target.checked)}
                    className="h-4 w-4 accent-cv-gold"
                  />
                  Depth of field
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary hover:border-cv-border-strong">
                  <input
                    type="checkbox"
                    checked={motionBlurEnabled}
                    onChange={(e) => setMotionBlurEnabled(e.target.checked)}
                    className="h-4 w-4 accent-cv-gold"
                  />
                  Motion blur
                </label>
              </div>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">Speech tone</span>
              <select
                value={speechTone}
                onChange={(e) => setSpeechTone(e.target.value as SpeechTone)}
                className="rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary outline-none focus:border-cv-border-strong focus:ring-1 focus:ring-cv-gold/25"
              >
                {SPEECH_TONES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">Emotion vibe</span>
              <select
                value={emotionVibe}
                onChange={(e) => setEmotionVibe(e.target.value as EmotionVibe)}
                className="rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary outline-none focus:border-cv-border-strong focus:ring-1 focus:ring-cv-gold/25"
              >
                {EMOTION_VIBES.map((ev) => (
                  <option key={ev} value={ev}>
                    {ev}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">Seed consistency</span>
              <select
                value={seedMode}
                onChange={(e) => setSeedMode(e.target.value as SeedMode)}
                className="rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary outline-none focus:border-cv-border-strong focus:ring-1 focus:ring-cv-gold/25"
              >
                {SEED_MODES.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-cv-text-primary">Seed value</span>
              <input
                type="number"
                value={seedValue}
                onChange={(e) => setSeedValue(Number(e.target.value))}
                disabled={!enableSeedInput}
                className="rounded-lg border border-cv-border bg-cv-bg-elevated px-3 py-2 text-sm text-cv-text-primary outline-none focus:border-cv-border-strong focus:ring-1 focus:ring-cv-gold/25 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <button
          type="submit"
          disabled={!canGenerate}
          className="w-full rounded-xl border border-cv-border-strong bg-cv-gold px-6 py-4 text-center text-base font-semibold text-cv-bg-deep shadow-[0_0_28px_var(--cv-gold-glow)] transition hover:bg-cv-gold-hover disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-md sm:mx-auto"
        >
          Generate Video
        </button>
      </div>
    </form>
  );
}

