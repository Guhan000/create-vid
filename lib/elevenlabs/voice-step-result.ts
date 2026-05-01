export type VoiceoverStepResult = {
  format: "audio/mpeg";
  audioUrl: string | null;
  audioMp3Base64: string | null;
  elevenLabsVoiceId: string;
  modelId: string;
  characterCount: number;
};
