import { getVoiceOptionByFormId } from "@/app/dashboard/components/faceless/constants";
import { synthesizeMp3Buffer } from "@/lib/voice/elevenlabs-tts";
import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

const PREVIEW_TEXT =
  "Here's a quick preview of this voice. CreatVid will use your full script when you generate the video.";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const voiceOptionId =
    typeof body === "object" &&
    body !== null &&
    "voiceOptionId" in body &&
    typeof (body as { voiceOptionId: unknown }).voiceOptionId === "string"
      ? (body as { voiceOptionId: string }).voiceOptionId
      : null;

  if (!voiceOptionId) {
    return NextResponse.json({ error: "Missing voiceOptionId" }, { status: 400 });
  }

  const option = getVoiceOptionByFormId(voiceOptionId);
  if (!option) {
    return NextResponse.json({ error: "Unknown voice" }, { status: 400 });
  }

  try {
    const { buffer } = await synthesizeMp3Buffer({
      text: PREVIEW_TEXT,
      voiceId: option.elevenLabsVoiceId,
    });
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "TTS preview failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
