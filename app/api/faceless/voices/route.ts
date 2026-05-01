import { listElevenLabsVoices } from "@/lib/elevenlabs/voices";
import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

function readQuery(req: NextRequest, key: string): string | undefined {
  const value = req.nextUrl.searchParams.get(key)?.trim();
  return value ? value : undefined;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const voices = await listElevenLabsVoices({
      search: readQuery(req, "search"),
      category: readQuery(req, "category"),
      voiceType: readQuery(req, "voiceType"),
      gender: readQuery(req, "gender"),
      age: readQuery(req, "age"),
      accent: readQuery(req, "accent"),
      language: readQuery(req, "language"),
      locale: readQuery(req, "locale"),
      pageSize: 100,
    });
    return NextResponse.json({ voices }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not load voices.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
