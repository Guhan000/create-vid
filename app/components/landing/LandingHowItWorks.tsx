const steps = [
  {
    step: "01",
    title: "Drop a topic or outline",
    body: "Tell CreatVid the niche, angle, and outcome you want — hook style, length, and platform.",
  },
  {
    step: "02",
    title: "Generate script & voice",
    body: "Get a tight narration with pacing markers. Tune tone, then lock the read that fits your brand.",
  },
  {
    step: "03",
    title: "Match visuals & captions",
    body: "Pull in b-roll suggestions, motion, and on-screen text that keeps viewers watching to the end.",
  },
  {
    step: "04",
    title: "Export & ship",
    body: "Render platform-ready files, aspect ratios, and caption tracks — upload and iterate fast.",
  },
] as const;

export function LandingHowItWorks(): React.ReactElement {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-b border-cv-border py-16 sm:py-20 lg:py-24"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2
              id="how-heading"
              className="text-3xl font-semibold tracking-tight text-cv-text-primary sm:text-4xl"
            >
              How CreatVid fits your workflow
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-cv-text-secondary">
              A linear pipeline from idea to publish — so you can focus on
              packaging, thumbnails, and doubling down on winners.
            </p>
          </div>
          <p className="text-sm font-medium uppercase tracking-widest text-cv-gold-muted">
            Minutes, not all-nighters
          </p>
        </div>

        <ol className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {steps.map(({ step, title, body }) => (
            <li
              key={step}
              className="flex gap-5 rounded-2xl border border-cv-border bg-cv-bg-elevated/60 p-6 sm:p-7"
            >
              <span className="font-mono text-2xl font-semibold tabular-nums text-cv-gold">
                {step}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-cv-text-primary">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cv-text-secondary">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
