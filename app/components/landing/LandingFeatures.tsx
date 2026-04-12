import {
  Captions,
  Film,
  Layers,
  Mic2,
  Rocket,
  Wand2,
} from "lucide-react";

const items = [
  {
    icon: Wand2,
    title: "AI scripts that sound human",
    description:
      "Hooks, retention bridges, and CTAs tuned for Shorts and long-form — iterate in minutes, not hours.",
  },
  {
    icon: Mic2,
    title: "Voice & pacing controls",
    description:
      "Match tone to your niche, lock pacing, and keep delivery consistent across every upload.",
  },
  {
    icon: Film,
    title: "B-roll & motion that fits",
    description:
      "Pair narration with visuals that reinforce the story — built for faceless storytelling at scale.",
  },
  {
    icon: Captions,
    title: "Auto captions & safe zones",
    description:
      "Readable captions with styles that pop on mobile — fewer drop-offs, more rewatches.",
  },
  {
    icon: Layers,
    title: "Templates & brand presets",
    description:
      "Save your look: fonts, colors, intros — one click to stay on-brand across channels.",
  },
  {
    icon: Rocket,
    title: "Built for channel velocity",
    description:
      "From idea to export fast enough to test angles weekly and double down on what prints.",
  },
] as const;

export function LandingFeatures(): React.ReactElement {
  return (
    <section
      id="features"
      className="scroll-mt-24 border-b border-cv-border bg-cv-bg-surface py-16 sm:py-20 lg:py-24"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2
            id="features-heading"
            className="text-3xl font-semibold tracking-tight text-cv-text-primary sm:text-4xl"
          >
            Everything you need to run a faceless content engine
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-cv-text-secondary">
            CreatVid is structured like the SaaS tools serious creators use:
            modular steps, clear outputs, and a workflow you can repeat every
            week.
          </p>
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="group rounded-2xl border border-cv-border bg-cv-bg-card p-6 transition hover:border-cv-border-strong hover:shadow-[0_0_0_1px_var(--cv-border-strong)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cv-gold-subtle text-cv-gold-bright transition group-hover:bg-cv-gold/15">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-cv-text-primary">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cv-text-secondary">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
