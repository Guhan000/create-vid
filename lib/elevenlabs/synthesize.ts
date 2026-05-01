import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { readableStreamToBuffer } from "./stream-to-buffer";

/** Fast, cost-effective model for narration (see [ElevenLabs models](https://elevenlabs.io/docs/models)). */
export const ELEVEN_TTS_MODEL = "eleven_turbo_v2_5";

export const ELEVEN_TTS_OUTPUT_FORMAT = "mp3_44100_128" as const;

/**
 * Renders full narration to MP3 via [Text to Speech](https://elevenlabs.io/docs/eleven-api/guides/cookbooks/text-to-speech).
 */
export async function synthesizeSpeechToMp3(params: {
  text: string;
  elevenLabsVoiceId: string;
}): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Missing ELEVENLABS_API_KEY for text-to-speech.");
  }

  const client = new ElevenLabsClient({ apiKey });
  const stream = await client.textToSpeech.convert(params.elevenLabsVoiceId, {
    text: params.text,
    modelId: ELEVEN_TTS_MODEL,
    outputFormat: ELEVEN_TTS_OUTPUT_FORMAT,
  });

  return readableStreamToBuffer(stream);
}
