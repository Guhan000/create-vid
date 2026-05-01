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

export type DurationSecondsId = 30 | 60 | 90;

export const DURATION_OPTIONS: {
  id: DurationSecondsId;
  label: string;
  hint: string;
  credits: number;
}[] = [
  { id: 30, label: "30s", hint: "Short hooks & teasers", credits: 2 },
  { id: 60, label: "60s", hint: "Standard social spot", credits: 4 },
  { id: 90, label: "90s", hint: "Deeper story beats", credits: 6 },
];

export type VoiceOption = {
  id: string;
  label: string;
  tag: string;
  credits: number;
  /** ElevenLabs premade voice id ([voice library](https://elevenlabs.io/app/voice-library)). */
  elevenLabsVoiceId: string;
  description: string;
};

export const VOICE_OPTIONS: VoiceOption[] = [
  {
    id: "v1",
    label: "Avery — Neutral US",
    tag: "Female",
    credits: 2,
    elevenLabsVoiceId: "21m00Tcm4TlvDq8ikWAM",
    description: "Warm, conversational American — great for explainers and hooks.",
  },
  {
    id: "v2",
    label: "Jordan — Warm US",
    tag: "Male",
    credits: 2,
    elevenLabsVoiceId: "pNInz6obpgDQGcFmaJgB",
    description: "Deep, steady male tone suited to authority and product walkthroughs.",
  },
  {
    id: "v3",
    label: "Riley — Upbeat US",
    tag: "Non-binary",
    credits: 2,
    elevenLabsVoiceId: "TxTHwcPrLiqJP7ALd0yt",
    description: "Youthful American energy; strong for fast-paced Shorts pacing.",
  },
  {
    id: "v4",
    label: "Morgan — Calm UK",
    tag: "Female",
    credits: 3,
    elevenLabsVoiceId: "EXAVITQu4vr4xnSDxMaL",
    description: "British clarity with a soft presence — ideal for premium or lifestyle topics.",
  },
  {
    id: "v5",
    label: "Casey — Deep US",
    tag: "Male",
    credits: 3,
    elevenLabsVoiceId: "VR6AewLTigWG4xSOukaG",
    description: "Bold, cinematic male read; works for dramatic beats and trailers.",
  },
  {
    id: "v6",
    label: "Sky — Young US",
    tag: "Female",
    credits: 2,
    elevenLabsVoiceId: "AZnzlk1XvdvUeBnXmlld",
    description: "Bright, expressive female voice for playful or trend-led content.",
  },
  {
    id: "v7",
    label: "Alex — Narration US",
    tag: "Male",
    credits: 2,
    elevenLabsVoiceId: "ErXwobaYiN019PkySvj",
    description: "Clear documentary-style narration with natural emphasis.",
  },
  {
    id: "v8",
    label: "Sam — Soft AU",
    tag: "Neutral",
    credits: 3,
    elevenLabsVoiceId: "MF3mGyEYCl7XYWbV9V6O",
    description: "Gentle, airy delivery — strong for mindfulness, ASMR-adjacent, or soft sells.",
  },
  {
    id: "v9",
    label: "George — Storyteller US",
    tag: "Male",
    credits: 2,
    elevenLabsVoiceId: "JBFqnCBsd6RMkjVDRZzb",
    description: "Warm, rounded American storyteller — great for hooks and friendly explainers.",
  },
  {
    id: "v10",
    label: "Charlotte — Expressive UK",
    tag: "Female",
    credits: 2,
    elevenLabsVoiceId: "XB0fDUnXU5powFXDhCwa",
    description: "British clarity with lively inflection; strong for lifestyle and product demos.",
  },
  {
    id: "v11",
    label: "Matilda — Knowledgeable UK",
    tag: "Female",
    credits: 2,
    elevenLabsVoiceId: "XrExE9yKIg1WjnnlVkGX",
    description: "Confident, articulate British tone for education and list-style Shorts.",
  },
  {
    id: "v12",
    label: "Will — Casual US",
    tag: "Male",
    credits: 2,
    elevenLabsVoiceId: "bIHbv24MWmeRgasZH58o",
    description: "Relaxed American guy-next-door; ideal for memes, reactions, and casual reviews.",
  },
  {
    id: "v13",
    label: "Jessica — Newsroom US",
    tag: "Female",
    credits: 2,
    elevenLabsVoiceId: "cgSgspJ2msm6clMCkdW9",
    description: "Bright, broadcast-ready American read — good for headlines and fast updates.",
  },
  {
    id: "v14",
    label: "Lily — Warm Story US",
    tag: "Female",
    credits: 2,
    elevenLabsVoiceId: "pFZP5JQG7iQjIQuC4Bku",
    description: "Soft, empathetic American voice for wellness, finance explainers, and reassurance.",
  },
  {
    id: "v15",
    label: "Callum — Steady UK",
    tag: "Male",
    credits: 2,
    elevenLabsVoiceId: "N2lVS1w4EtoT3dr4eOWO",
    description: "Transatlantic-leaning British male; even pacing for tutorials and walkthroughs.",
  },
  {
    id: "v16",
    label: "River — Relaxed US",
    tag: "Neutral",
    credits: 2,
    elevenLabsVoiceId: "SAz9YHcvj6GT2YYXdXww",
    description: "Laid-back American delivery with modern cadence — fits trends and soft CTAs.",
  },
];

const VOICE_FORM_IDS = new Set(VOICE_OPTIONS.map((v) => v.id));

export function isValidVoiceFormId(id: string): boolean {
  return VOICE_FORM_IDS.has(id);
}

export function getVoiceOptionByFormId(id: string): VoiceOption | undefined {
  return VOICE_OPTIONS.find((v) => v.id === id);
}

export function isAllowedElevenLabsVoiceId(voiceId: string): boolean {
  return VOICE_OPTIONS.some((v) => v.elevenLabsVoiceId === voiceId);
}

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
  durationSeconds: DurationSecondsId;
  voiceCredits: number;
  musicCredits: number;
  captionCredits: number;
  scriptMode: boolean;
}): { total: number; lines: { label: string; value: number }[] } {
  const lines: { label: string; value: number }[] = [];

  lines.push({ label: "Base render", value: 8 });

  const durationRow = DURATION_OPTIONS.find((d) => d.id === params.durationSeconds);
  const durationCredits = durationRow?.credits ?? 4;
  lines.push({
    label: `Target length (${params.durationSeconds}s)`,
    value: durationCredits,
  });

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
