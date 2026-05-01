/** Same values as the faceless duration picker (seconds). */
export type ScriptPackDuration = 30 | 60 | 90;

/** Target scene count for image prompts / beats (4–5 / 5–6 / 7–8 by duration tier). */
export function requiredSceneCount(durationSeconds: ScriptPackDuration): number {
  switch (durationSeconds) {
    case 30:
      return 5;
    case 60:
      return 6;
    case 90:
      return 8;
    default:
      return 5;
  }
}
