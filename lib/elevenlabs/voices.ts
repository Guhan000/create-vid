import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export type ElevenLabsVoiceOption = {
  voiceId: string;
  name: string;
  category: string | null;
  description: string | null;
  previewUrl: string | null;
  labels: Record<string, string>;
  isOwner: boolean;
};

export type ElevenLabsVoiceFilters = {
  search?: string;
  category?: string;
  voiceType?: string;
  gender?: string;
  age?: string;
  accent?: string;
  language?: string;
  locale?: string;
  pageSize?: number;
};

function getClient(): ElevenLabsClient {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Missing ELEVENLABS_API_KEY for voices.");
  }
  return new ElevenLabsClient({ apiKey });
}

function normalizeLabelValue(value: string | undefined): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function matchesLabelFilter(
  labels: Record<string, string>,
  key: "gender" | "age" | "accent" | "language" | "locale",
  expected?: string,
): boolean {
  if (!expected?.trim()) {
    return true;
  }
  const actual = normalizeLabelValue(labels[key]);
  const wanted = normalizeLabelValue(expected);
  return actual === wanted || actual.includes(wanted) || wanted.includes(actual);
}

export async function listElevenLabsVoices(
  filters: ElevenLabsVoiceFilters,
): Promise<ElevenLabsVoiceOption[]> {
  const client = getClient();
  const pageSize = Math.max(1, Math.min(100, filters.pageSize ?? 100));
  const requestedVoiceType = filters.voiceType?.trim() || undefined;
  const search = filters.search?.trim() || undefined;
  const category = filters.category?.trim() || undefined;

  const fallbackVoiceTypes = requestedVoiceType ? [requestedVoiceType] : ["saved", "default", "community", "non-default"];
  let voices: Awaited<ReturnType<typeof client.voices.search>>["voices"] = [];

  for (const voiceType of fallbackVoiceTypes) {
    const response = await client.voices.search({
      pageSize,
      search,
      category,
      voiceType,
      sort: "name",
      sortDirection: "asc",
    });
    voices = response.voices ?? [];
    if (voices.length > 0 || requestedVoiceType) {
      break;
    }
  }

  if (voices.length === 0 && !requestedVoiceType) {
    const fallback = await client.voices.getAll({ showLegacy: true });
    voices = fallback.voices ?? [];
  }

  const deduped = new Map<string, (typeof voices)[number]>();
  for (const voice of voices) {
    if (voice.voiceId && !deduped.has(voice.voiceId)) {
      deduped.set(voice.voiceId, voice);
    }
  }

  const normalized = Array.from(deduped.values())
    .map((voice) => {
      const labels = voice.labels ?? {};
      return {
        voiceId: voice.voiceId,
        name: (voice.name ?? "").trim() || "Untitled voice",
        category: voice.category ?? null,
        description: voice.description?.trim() || null,
        previewUrl: voice.previewUrl?.trim() || null,
        labels,
        isOwner: Boolean(voice.isOwner),
      } satisfies ElevenLabsVoiceOption;
    })
    .filter((voice) => Boolean(voice.voiceId))
    .filter((voice) => matchesLabelFilter(voice.labels, "gender", filters.gender))
    .filter((voice) => matchesLabelFilter(voice.labels, "age", filters.age))
    .filter((voice) => matchesLabelFilter(voice.labels, "accent", filters.accent))
    .filter((voice) => matchesLabelFilter(voice.labels, "language", filters.language))
    .filter((voice) => matchesLabelFilter(voice.labels, "locale", filters.locale));

  return normalized.sort((a, b) => a.name.localeCompare(b.name));
}

export async function isElevenLabsVoiceIdAvailable(voiceId: string): Promise<boolean> {
  const id = voiceId.trim();
  if (!id) {
    return false;
  }
  const client = getClient();
  const response = await client.voices.search({
    pageSize: 1,
    voiceIds: [id],
    includeTotalCount: false,
  });
  return response.voices.some((voice) => voice.voiceId === id);
}
