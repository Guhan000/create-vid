export type VideoTypeId = "moving" | "full_ai" | "stock";

export const VIDEO_TYPES: {
  id: VideoTypeId;
  label: string;
  description: string;
}[] = [
  {
    id: "moving",
    label: "Moving Image",
    description: "Ken Burns–style motion over stills or light animation.",
  },
  {
    id: "full_ai",
    label: "Full AI Video",
    description: "Scene-level AI generation for richer, dynamic visuals.",
  },
  {
    id: "stock",
    label: "Stock",
    description: "Curated stock footage cuts—no creative style layer.",
  },
];

export const VIDEO_STYLES: string[] = [
  "Cinematic",
  "Minimal clean",
  "Neon cyberpunk",
  "Warm documentary",
  "Retro VHS",
  "Corporate bright",
  "Dark moody",
  "Pastel soft",
  "High contrast B&W",
  "Nature organic",
  "Tech futuristic",
  "Luxury gold",
  "Street gritty",
  "Anime-inspired",
  "Watercolor art",
  "3D glossy",
  "Flat illustration",
  "Noir mystery",
  "Sports energetic",
  "Lo-fi cozy",
];

export type AspectRatioId = "9:16" | "16:9" | "1:1";

export const ASPECT_RATIOS: {
  id: AspectRatioId;
  label: string;
  hint: string;
}[] = [
  { id: "9:16", label: "Portrait", hint: "Shorts · Reels · TikTok" },
  { id: "16:9", label: "Landscape", hint: "YouTube · Web" },
  { id: "1:1", label: "Square", hint: "Feed · Ads" },
];

export type VoiceOption = { id: string; label: string; tag: string; credits: number };

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: "v1", label: "Avery — Neutral US", tag: "Female", credits: 2 },
  { id: "v2", label: "Jordan — Warm US", tag: "Male", credits: 2 },
  { id: "v3", label: "Riley — Upbeat US", tag: "Non-binary", credits: 2 },
  { id: "v4", label: "Morgan — Calm UK", tag: "Female", credits: 3 },
  { id: "v5", label: "Casey — Deep US", tag: "Male", credits: 3 },
  { id: "v6", label: "Sky — Young US", tag: "Female", credits: 2 },
  { id: "v7", label: "Alex — Narration US", tag: "Male", credits: 2 },
  { id: "v8", label: "Sam — Soft AU", tag: "Neutral", credits: 3 },
];

export type MusicOption = { id: string; label: string; mood: string; credits: number };

export const MUSIC_OPTIONS: MusicOption[] = [
  { id: "m0", label: "None", mood: "Silent", credits: 0 },
  { id: "m1", label: "Ambient Rise", mood: "Cinematic", credits: 1 },
  { id: "m2", label: "Lo-fi Study", mood: "Chill", credits: 1 },
  { id: "m3", label: "Corporate Pulse", mood: "Uplifting", credits: 1 },
  { id: "m4", label: "Epic Trail", mood: "Dramatic", credits: 2 },
  { id: "m5", label: "Synth Drive", mood: "Energetic", credits: 2 },
  { id: "m6", label: "Acoustic Dawn", mood: "Warm", credits: 1 },
];

export type CaptionOption = {
  id: string;
  label: string;
  description: string;
  credits: number;
};

export const CAPTION_OPTIONS: CaptionOption[] = [
  {
    id: "c0",
    label: "Off",
    description: "No on-screen captions.",
    credits: 0,
  },
  {
    id: "c1",
    label: "Clean lower-third",
    description: "Readable single-line captions.",
    credits: 1,
  },
  {
    id: "c2",
    label: "Word highlight",
    description: "Karaoke-style word emphasis.",
    credits: 2,
  },
  {
    id: "c3",
    label: "SRT export only",
    description: "Sidecar file for editors—no burn-in.",
    credits: 1,
  },
  {
    id: "c4",
    label: "Bold social",
    description: "Large type tuned for vertical.",
    credits: 2,
  },
];

export function estimateCredits(params: {
  videoType: VideoTypeId;
  styleId: string | null;
  aspect: AspectRatioId;
  voiceCredits: number;
  musicCredits: number;
  captionCredits: number;
  scriptMode: boolean;
}): { total: number; lines: { label: string; value: number }[] } {
  const lines: { label: string; value: number }[] = [];

  lines.push({ label: "Base render", value: 8 });

  const typeAdd =
    params.videoType === "full_ai" ? 12 : params.videoType === "moving" ? 4 : 2;
  lines.push({
    label:
      params.videoType === "full_ai"
        ? "Full AI pipeline"
        : params.videoType === "moving"
          ? "Moving image"
          : "Stock assembly",
    value: typeAdd,
  });

  if (params.videoType !== "stock" && params.styleId) {
    lines.push({ label: "Style treatment", value: 2 });
  }

  if (params.aspect === "9:16") {
    lines.push({ label: "Portrait mastering", value: 1 });
  }

  if (params.scriptMode) {
    lines.push({ label: "Script alignment", value: 2 });
  }

  if (params.voiceCredits > 0) {
    lines.push({ label: "Voice", value: params.voiceCredits });
  }
  if (params.musicCredits > 0) {
    lines.push({ label: "Music", value: params.musicCredits });
  }
  if (params.captionCredits > 0) {
    lines.push({ label: "Captions", value: params.captionCredits });
  }

  const total = lines.reduce((sum, row) => sum + row.value, 0);
  return { total, lines };
}
