export type VideoScriptScene = {
  index: number;
  voiceover: string;
  imagePrompt: string;
};

/**
 * Structured script output from step 1 — JSON-only, safe to pass to later steps (TTS, visuals).
 */
export type VideoScriptPack = {
  title: string;
  fullVoiceoverScript: string;
  scenes: VideoScriptScene[];
};
