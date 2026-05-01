import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const DEFAULT_MODEL = "eleven_multilingual_v2";
/** Smaller file for step payloads & previews; upgrade format in one place if needed. */
const DEFAULT_OUTPUT_FORMAT = "mp3_22050_32" as const;

const MAX_CHARS = 9_500;

function getClient(): ElevenLabsClient {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey?.trim()) {
    throw new Error("Missing ELEVENLABS_API_KEY for text-to-speech.");
  }
  return new ElevenLabsClient({ apiKey });
}

async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Buffer[] = [];
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value?.length) {
        chunks.push(Buffer.from(value));
      }
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks);
}

function truncateForTts(text: string): { text: string; truncated: boolean } {
  const t = text.trim();
  if (t.length <= MAX_CHARS) {
    return { text: t, truncated: false };
  }
  return { text: t.slice(0, MAX_CHARS), truncated: true };
}

/**
 * ElevenLabs text-to-speech (non-streaming convert). See
 * https://elevenlabs.io/docs/eleven-api/guides/cookbooks/text-to-speech
 */
export async function synthesizeMp3Buffer(params: {
  text: string;
  voiceId: string;
  modelId?: string;
  outputFormat?: typeof DEFAULT_OUTPUT_FORMAT;
}): Promise<{ buffer: Buffer; truncated: boolean; characterCount: number }> {
  const { text, voiceId } = params;
  const { text: safeText, truncated } = truncateForTts(text);
  if (!safeText) {
    throw new Error("No text to synthesize.");
  }

  const client = getClient();
  const modelId = params.modelId ?? process.env.ELEVENLABS_TTS_MODEL_ID ?? DEFAULT_MODEL;
  const outputFormat = params.outputFormat ?? DEFAULT_OUTPUT_FORMAT;

  const stream = await client.textToSpeech.convert(voiceId, {
    text: safeText,
    modelId,
    outputFormat,
  });

  const buffer = await streamToBuffer(stream);
  return { buffer, truncated, characterCount: safeText.length };
}

export function bufferToAudioBase64(buffer: Buffer): { audioBase64: string; mimeType: "audio/mpeg" } {
  return {
    audioBase64: buffer.toString("base64"),
    mimeType: "audio/mpeg",
  };
}
