import OpenAI from "openai";
import { parseVideoScriptPack } from "./parse-script-pack";
import { requiredSceneCount, type ScriptPackDuration } from "./scene-count";
import type { VideoScriptPack } from "./types";

const MODEL = "gpt-4o-mini";

function stripJsonFences(text: string): string {
  const t = text.trim();
  const m = /^```(?:json)?\s*\r?\n?([\s\S]*?)\r?\n?```$/i.exec(t);
  if (m?.[1]) {
    return m[1].trim();
  }
  return t;
}

function buildSystemPrompt(sceneCount: number, durationSeconds: number): string {
  return [
    "You write structured short-form vertical video (TikTok, Reels, YouTube Shorts) scripts.",
    "Output MUST be a single valid JSON object only: no markdown, no code fences, no text before or after the JSON.",
    "The JSON shape is exactly:",
    '{"title":string,"fullVoiceoverScript":string,"scenes":[{"index":number,"voiceover":string,"imagePrompt":string}]}',
    `Rules:`,
    `- scenes: exactly ${sceneCount} objects, with index 1 through ${sceneCount} in order.`,
    `- fullVoiceoverScript: one continuous narration suitable for voiceover/TTS (~${durationSeconds}s when read aloud at a natural short-form pace: clear, conversational, contractions where natural).`,
    `- Each scene voiceover is one beat of that narration; read in order they must flow naturally.`,
    `- imagePrompt: rich English prompt for an image model for that beat; describe subject, lighting, composition; no on-image text or captions unless the user explicitly asked for text in frame.`,
    `- Title: short, scroll-stopping, no clickbait lies.`,
    `- Keep language natural for spoken voiceover; avoid bullet symbols and meta stage directions unless essential.`,
  ].join("\n");
}

function buildUserPrompt(params: {
  prompt: string;
  scriptMode: boolean;
  durationSeconds: ScriptPackDuration;
  videoStyle: string | null;
  sceneCount: number;
}): string {
  const styleLine = params.videoStyle?.trim()
    ? `Visual / mood reference: "${params.videoStyle.trim()}". Reflect this in imagePrompts where relevant.`
    : "No specific visual style was chosen; use cohesive cinematic imagery that fits the topic.";

  if (params.scriptMode) {
    return [
      `The user already wrote their full voiceover script. Preserve their meaning and wording; you may only fix obvious typos, punctuation, and light line breaks for clarity — do not rewrite in a different voice.`,
      `Split that script across exactly ${params.sceneCount} scenes for pacing and visuals. Each scene's "voiceover" is a segment; together they should cover the full script with no major omissions.`,
      `Target total spoken length when read aloud: about ${params.durationSeconds} seconds (short-form pacing).`,
      styleLine,
      "",
      "USER SCRIPT (source of truth for spoken content):",
      params.prompt.trim(),
    ].join("\n");
  }

  return [
    `Write from this creative brief. Target spoken runtime ~${params.durationSeconds} seconds (short-form).`,
    `Use exactly ${params.sceneCount} scenes.`,
    styleLine,
    "",
    "CREATIVE BRIEF:",
    params.prompt.trim(),
  ].join("\n");
}

/**
 * Calls OpenAI (gpt-4o-mini) and returns a validated {@link VideoScriptPack}.
 */
export async function generateVideoScriptPack(params: {
  prompt: string;
  scriptMode: boolean;
  durationSeconds: ScriptPackDuration;
  videoStyle: string | null;
}): Promise<VideoScriptPack> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    throw new Error("Missing OPENAI_API_KEY for script generation.");
  }

  const sceneCount = requiredSceneCount(params.durationSeconds);
  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: MODEL,
    temperature: 0.55,
    max_tokens: 4096,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildSystemPrompt(sceneCount, params.durationSeconds) },
      {
        role: "user",
        content: buildUserPrompt({
          ...params,
          sceneCount,
        }),
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content?.trim()) {
    throw new Error("OpenAI returned an empty script response.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripJsonFences(content));
  } catch {
    throw new Error("OpenAI returned non-JSON content.");
  }

  return parseVideoScriptPack(parsed, sceneCount);
}
