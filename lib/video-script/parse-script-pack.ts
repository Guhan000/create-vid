import type { VideoScriptPack, VideoScriptScene } from "./types";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function parseVideoScriptPack(
  raw: unknown,
  expectedSceneCount: number,
): VideoScriptPack {
  if (!isRecord(raw)) {
    throw new Error("Script JSON root must be an object.");
  }

  const title = raw.title;
  const fullVoiceoverScript = raw.fullVoiceoverScript;
  const scenesRaw = raw.scenes;

  if (typeof title !== "string" || !title.trim()) {
    throw new Error('Script JSON must include non-empty string "title".');
  }
  if (typeof fullVoiceoverScript !== "string" || !fullVoiceoverScript.trim()) {
    throw new Error(
      'Script JSON must include non-empty string "fullVoiceoverScript".',
    );
  }
  if (!Array.isArray(scenesRaw)) {
    throw new Error('Script JSON must include array "scenes".');
  }
  if (scenesRaw.length !== expectedSceneCount) {
    throw new Error(
      `Script JSON must have exactly ${expectedSceneCount} scenes for this duration; got ${scenesRaw.length}.`,
    );
  }

  const scenes: VideoScriptScene[] = [];
  for (let i = 0; i < scenesRaw.length; i++) {
    const item = scenesRaw[i];
    if (!isRecord(item)) {
      throw new Error(`scenes[${i}] must be an object.`);
    }
    const idx = item.index;
    const voiceover = item.voiceover;
    const imagePrompt = item.imagePrompt;
    if (typeof idx !== "number" || !Number.isInteger(idx) || idx < 1) {
      throw new Error(`scenes[${i}].index must be a positive integer.`);
    }
    if (typeof voiceover !== "string" || !voiceover.trim()) {
      throw new Error(`scenes[${i}].voiceover must be a non-empty string.`);
    }
    if (typeof imagePrompt !== "string" || !imagePrompt.trim()) {
      throw new Error(`scenes[${i}].imagePrompt must be a non-empty string.`);
    }
    scenes.push({
      index: idx,
      voiceover: voiceover.trim(),
      imagePrompt: imagePrompt.trim(),
    });
  }

  const sorted = [...scenes].sort((a, b) => a.index - b.index);
  const indexSet = new Set(sorted.map((s) => s.index));
  if (indexSet.size !== sorted.length) {
    throw new Error("Scene indexes must be unique.");
  }
  for (let j = 0; j < sorted.length; j++) {
    if (sorted[j].index !== j + 1) {
      throw new Error(
        `Scene indexes must be 1..${expectedSceneCount} in order; check index ${sorted[j].index}.`,
      );
    }
  }

  return {
    title: title.trim(),
    fullVoiceoverScript: fullVoiceoverScript.trim(),
    scenes: sorted,
  };
}
