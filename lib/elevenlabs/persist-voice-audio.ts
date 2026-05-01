import { uploadPublicMp3 } from "@/lib/r2/upload-public-mp3";

export type PersistedVoiceAudio = {
  audioUrl: string;
  audioMp3Base64: null;
};

/**
 * Uploads narration MP3 to Cloudflare R2 (S3 API) and returns a public URL for downstream steps.
 */
export async function persistVoiceMp3(params: {
  userId: string;
  buffer: Buffer;
}): Promise<PersistedVoiceAudio> {
  const key = `generations/${params.userId}/${crypto.randomUUID()}-voiceover.mp3`;
  const audioUrl = await uploadPublicMp3({
    objectKey: key,
    body: params.buffer,
  });
  return { audioUrl, audioMp3Base64: null };
}
