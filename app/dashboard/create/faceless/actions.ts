"use server";

import {
  type DurationSecondsId,
  getVoiceOptionByFormId,
  isAllowedElevenLabsVoiceId,
  isValidVoiceFormId,
  type VideoTypeId,
} from "@/app/dashboard/components/faceless/constants";
import { inngest } from "@/inngest";
import { isElevenLabsVoiceIdAvailable } from "@/lib/elevenlabs/voices";
import type { VideoGenerationMode } from "@/inngest/generateVideo";
import { createClient } from "@/lib/supabase/server";

const VIDEO_TYPE_IDS = new Set<VideoTypeId>(["moving", "full_ai", "stock"]);
const DURATION_IDS = new Set<DurationSecondsId>([30, 60, 90]);

/** Stock + full AI use the full video pipeline; moving image uses the image path. */
function toGenerationMode(videoType: VideoTypeId): VideoGenerationMode {
  return videoType === "moving" ? "moving_ai" : "full_ai";
}

export async function requestFacelessVideoGeneration(input: {
  prompt: string;
  videoType: VideoTypeId;
  durationSeconds: DurationSecondsId;
  scriptMode: boolean;
  videoStyle: string | null;
  voiceFormId?: string;
  elevenLabsVoiceId?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = input.prompt.trim();
  if (trimmed.length < 8) {
    return { ok: false, error: "Add at least 8 characters to continue." };
  }
  if (!VIDEO_TYPE_IDS.has(input.videoType)) {
    return { ok: false, error: "Invalid video type." };
  }
  if (!DURATION_IDS.has(input.durationSeconds)) {
    return { ok: false, error: "Invalid duration." };
  }
  const explicitVoiceId = input.elevenLabsVoiceId?.trim();
  let elevenLabsVoiceId = explicitVoiceId ?? "";
  if (!elevenLabsVoiceId) {
    if (!input.voiceFormId || !isValidVoiceFormId(input.voiceFormId)) {
      return { ok: false, error: "Invalid voice selection." };
    }
    const voice = getVoiceOptionByFormId(input.voiceFormId);
    if (!voice) {
      return { ok: false, error: "Invalid voice selection." };
    }
    elevenLabsVoiceId = voice.elevenLabsVoiceId;
  }

  if (!isAllowedElevenLabsVoiceId(elevenLabsVoiceId)) {
    const isAvailable = await isElevenLabsVoiceIdAvailable(elevenLabsVoiceId);
    if (!isAvailable) {
      return { ok: false, error: "Voice is not available on your ElevenLabs account." };
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  const videoStyle =
    input.videoType === "stock"
      ? null
      : typeof input.videoStyle === "string" && input.videoStyle.trim()
        ? input.videoStyle.trim().slice(0, 200)
        : null;

  try {
    await inngest.send({
      name: "app/video.generation.requested",
      data: {
        userId: user.id,
        prompt: trimmed,
        generationMode: toGenerationMode(input.videoType),
        durationSeconds: input.durationSeconds,
        scriptMode: Boolean(input.scriptMode),
        videoStyle,
        elevenLabsVoiceId,
      },
    });
    return { ok: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not start video generation.";
    return { ok: false, error: message };
  }
}
