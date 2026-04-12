import { LoginButton } from "../LoginButton";
import { Clapperboard, Play, Sparkles } from "lucide-react";

export function LandingHero(): React.ReactElement {
  return (
    <section
      className="relative overflow-hidden border-b border-cv-border"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--cv-gradient-hero)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `linear-gradient(var(--cv-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--cv-grid-line) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cv-border-strong bg-cv-gold-subtle px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cv-gold-bright">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Video generation SaaS
          </p>
          <h1
            id="hero-heading"
            className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-cv-text-primary sm:text-5xl lg:text-6xl"
          >
            Create{" "}
            <span className="bg-gradient-to-r from-cv-gold-bright via-cv-gold to-cv-gold-muted bg-clip-text text-transparent">
              viral faceless videos
            </span>{" "}
            in minutes
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-cv-text-secondary sm:text-xl">
            Get your unfair advantage: ship consistent faceless content that
            compounds reach, monetization, and brand recall — without showing
            your face or living in the edit bay.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <LoginButton className="h-12 w-full rounded-full border-0 bg-cv-gold px-8 text-base font-semibold text-cv-bg-deep shadow-[0_0_32px_var(--cv-gold-glow)] hover:bg-cv-gold-hover sm:w-auto">
              Start free — Google
            </LoginButton>
            <a
              href="#how-it-works"
              className="flex h-12 w-full items-center justify-center rounded-full border border-cv-border-strong px-8 text-base font-medium text-cv-text-primary transition hover:bg-cv-gold-subtle sm:w-auto"
            >
              See how it works
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-cv-text-tertiary">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cv-gold" />
              AI scripts &amp; pacing
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cv-gold" />
              Voice + visuals pipeline
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cv-gold" />
              Export ready for Shorts
            </li>
          </ul>
        </div>

        <div className="relative lg:justify-self-end">
          <div
            className="absolute -inset-4 rounded-3xl blur-2xl"
            style={{ background: "var(--cv-gold-glow)" }}
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-2xl border border-cv-border-strong bg-cv-bg-card shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)]">
            <div className="flex items-center justify-between border-b border-cv-border bg-cv-bg-elevated px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium text-cv-text-primary">
                <Clapperboard className="h-4 w-4 text-cv-gold" aria-hidden />
                New viral cut
              </div>
              <span className="rounded-md bg-cv-gold-subtle px-2 py-0.5 text-xs font-semibold text-cv-gold-bright">
                Rendering
              </span>
            </div>
            <div className="aspect-[4/3] bg-gradient-to-br from-cv-bg-elevated to-cv-bg-deep p-4 sm:p-5">
              <div className="flex h-full flex-col rounded-xl border border-cv-border bg-cv-bg-surface/80 p-3">
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-cv-border-strong bg-cv-bg-deep/50">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cv-gold text-cv-bg-deep shadow-[0_0_24px_var(--cv-gold-glow)]">
                    <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" aria-hidden />
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-2 overflow-hidden rounded-full bg-cv-bg-elevated">
                    <div
                      className="h-full w-[72%] rounded-full bg-gradient-to-r from-cv-gold to-cv-gold-bright"
                      aria-hidden
                    />
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-6 flex-1 rounded-sm bg-cv-bg-elevated"
                        style={{
                          opacity: 0.35 + (i % 5) * 0.12,
                        }}
                        aria-hidden
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-cv-border bg-cv-bg-elevated px-4 py-2.5 text-xs text-cv-text-tertiary">
              <span>1080p · 9:16 · Captions on</span>
              <span className="font-mono text-cv-gold-muted">00:47</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
