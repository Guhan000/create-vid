import { persistVoiceMp3 } from "@/lib/elevenlabs/persist-voice-audio";
import { ELEVEN_TTS_MODEL, synthesizeSpeechToMp3 } from "@/lib/elevenlabs/synthesize";
import type { VoiceoverStepResult } from "@/lib/elevenlabs/voice-step-result";
import { generateVideoScriptPack } from "@/lib/video-script/generate-script-pack";
import type { VideoScriptPack } from "@/lib/video-script/types";
import { NonRetriableError } from "inngest";
import { inngest } from "./client";

/** `moving_ai` → image asset; `full_ai` → video asset (placeholders only). */
export type VideoGenerationMode = "moving_ai" | "full_ai";

export type VideoGenerationRequestedEvent = {
  name: "app/video.generation.requested";
  data: {
    userId: string;
    prompt: string;
    generationMode: VideoGenerationMode;
    durationSeconds: 30 | 60 | 90;
    scriptMode: boolean;
    videoStyle: string | null;
    elevenLabsVoiceId: string;
  };
};

function toNonRetriableVoiceError(error: unknown): NonRetriableError | null {
  if (!(error instanceof Error)) {
    return null;
  }

  const message = error.message;
  if (
    message.includes("Missing ELEVENLABS_API_KEY") ||
    message.includes("Missing R2_BUCKET_NAME") ||
    message.includes("Missing R2_PUBLIC_BASE_URL") ||
    message.includes("R2 is not configured")
  ) {
    return new NonRetriableError(message, { cause: error });
  }

  const maybeStatusCode = error as Error & { statusCode?: number };
  if (maybeStatusCode.statusCode === 402) {
    return new NonRetriableError(message, { cause: error });
  }

  return null;
}

export default inngest.createFunction(
  {
    id: "generate-video",
    name: "Generate Video",
    triggers: [{ event: "app/video.generation.requested" }],
  },
  async ({ event, step }) => {
    const {
      userId,
      prompt,
      generationMode,
      durationSeconds,
      scriptMode,
      videoStyle,
      elevenLabsVoiceId,
    } = event.data;

    const scriptResult = await step.run("generate-video-script", async (): Promise<VideoScriptPack> => {
      return await generateVideoScriptPack({
        prompt,
        scriptMode,
        durationSeconds,
        videoStyle,
      });
    });

    const voiceResult = await step.run(
      "generate-voice-elevenlabs-tts",
      async (): Promise<VoiceoverStepResult> => {
        try {
          const text = scriptResult.fullVoiceoverScript;
          const buffer = await synthesizeSpeechToMp3({
            text,
            elevenLabsVoiceId,
          });
          const persisted = await persistVoiceMp3({ userId, buffer });
          return {
            format: "audio/mpeg",
            audioUrl: persisted.audioUrl,
            audioMp3Base64: persisted.audioMp3Base64,
            elevenLabsVoiceId,
            modelId: ELEVEN_TTS_MODEL,
            characterCount: text.length,
          };
        } catch (error) {
          const nonRetriable = toNonRetriableVoiceError(error);
          if (nonRetriable) {
            throw nonRetriable;
          }
          throw error;
        }
      },
    );

    const captionResult = await step.run("generate-captions", async () => {
      void voiceResult;
      return { captions: [] as string[] };
    });

    const visualResult = await step.run(
      "generate-image-or-video-from-script",
      async () => {
        void captionResult;
        void scriptResult;
        if (generationMode === "moving_ai") {
          return { assetType: "image" as const, url: null as string | null };
        }
        return { assetType: "video" as const, url: null as string | null };
      },
    );

    const persistResult = await step.run(
      "save-generation-to-user-profile",
      async () => {
        void userId;
        void prompt;
        void durationSeconds;
        void scriptResult;
        void voiceResult;
        void captionResult;
        void visualResult;
        return { recordId: null as string | null };
      },
    );

    return {
      ok: true as const,
      scriptResult,
      voiceResult,
      captionResult,
      visualResult,
      persistResult,
    };
  },
);
