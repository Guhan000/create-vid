import { isElevenLabsVoiceIdAvailable } from "@/lib/elevenlabs/voices";
import { synthesizeSpeechToMp3 } from "@/lib/elevenlabs/synthesize";
import { VOICE_PREVIEW_SAMPLE_TEXT } from "@/lib/elevenlabs/voice-preview-text";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const voiceId =
    typeof body === "object" &&
    body !== null &&
    "elevenLabsVoiceId" in body &&
    typeof (body as { elevenLabsVoiceId: unknown }).elevenLabsVoiceId === "string"
      ? (body as { elevenLabsVoiceId: string }).elevenLabsVoiceId.trim()
      : "";

  if (!voiceId) {
    return NextResponse.json({ error: "Invalid voice selection." }, { status: 400 });
  }

  const exists = await isElevenLabsVoiceIdAvailable(voiceId);
  if (!exists) {
    return NextResponse.json({ error: "Unknown or unavailable voice." }, { status: 400 });
  }

  try {
    const buffer = await synthesizeSpeechToMp3({
      text: VOICE_PREVIEW_SAMPLE_TEXT,
      elevenLabsVoiceId: voiceId,
    });
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Text-to-speech request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
