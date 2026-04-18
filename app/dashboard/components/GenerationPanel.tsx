export type CreateVideoVariant =
  | "faceless"
  | "avatar"
  | "fake-text"
  | "gameplay";

const copy: Record<
  CreateVideoVariant,
  { eyebrow: string; title: string; description: string; placeholder: string }
> = {
  faceless: {
    eyebrow: "Faceless Video",
    title: "Describe your faceless video",
    description:
      "Script, voice, and visuals without an on-camera host—built for channels that scale with narration and B-roll.",
    placeholder:
      "e.g. 60-second stoic philosophy short, deep male voice, dark abstract backgrounds…",
  },
  avatar: {
    eyebrow: "Avatar Video",
    title: "Describe your avatar-led video",
    description:
      "Use a digital presenter for explainers, ads, and updates while keeping production lightweight.",
    placeholder:
      "e.g. friendly female avatar, product launch recap, upbeat tone, 45 seconds…",
  },
  "fake-text": {
    eyebrow: "FakeText Video",
    title: "Describe your chat-style story",
    description:
      "Stories told through messaging UI—great for drama, humor, and viral text threads.",
    placeholder:
      "e.g. two friends arguing about a rent hike, comedic pacing, iMessage style…",
  },
  gameplay: {
    eyebrow: "Gameplay Video",
    title: "Describe your gameplay edit",
    description:
      "Hook, commentary, and pacing for screen-capture content—outline the game and the angle.",
    placeholder:
      "e.g. cozy sim build montage, whisper commentary, lo-fi overlay, 2 minutes…",
  },
};

export function GenerationPanel({
  variant,
}: {
  variant: CreateVideoVariant;
}): React.ReactElement {
  const { eyebrow, title, description, placeholder } = copy[variant];

  return (
    <div className="rounded-2xl border border-cv-border bg-cv-bg-surface/80 p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.04)] sm:p-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cv-gold-muted">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-cv-text-primary sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-cv-text-secondary">
          {description}
        </p>

        <label className="mt-8 block">
          <span className="sr-only">Video brief</span>
          <textarea
            name="brief"
            rows={6}
            placeholder={placeholder}
            className="w-full resize-y rounded-xl border border-cv-border bg-cv-bg-elevated px-4 py-3 text-sm text-cv-text-primary placeholder:text-cv-text-tertiary transition focus:border-cv-border-strong focus:outline-none focus:ring-2 focus:ring-cv-gold/25"
          />
        </label>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-cv-text-tertiary">
            Est. cost and duration will appear once models are wired.
          </p>
          <button
            type="button"
            className="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-xl bg-cv-gold px-6 text-sm font-semibold text-cv-bg-deep shadow-[0_0_24px_var(--cv-gold-glow)] transition hover:bg-cv-gold-hover sm:w-auto"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
