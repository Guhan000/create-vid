/** Result of Inngest step `generate-voice-elevenlabs-tts` (MP3 as base64 for downstream steps). */
export type VoiceGenerationStepResult = {
  mimeType: "audio/mpeg";
  audioBase64: string;
  elevenlabsVoiceId: string;
  characterCount: number;
  truncated: boolean;
};
