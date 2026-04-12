import { LoginButton } from "../LoginButton";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "$19",
    cadence: "/mo",
    blurb: "Test angles fast without a full production stack.",
    features: [
      "10 video credits / mo",
      "1080p exports",
      "1 brand preset",
      "Standard queue",
    ],
    cta: "Start Starter",
    featured: false,
  },
  {
    name: "Pro",
    price: "$49",
    cadence: "/mo",
    blurb: "For channels shipping multiple faceless videos weekly.",
    features: [
      "40 video credits / mo",
      "Priority rendering",
      "Unlimited brand presets",
      "Captions + safe zones",
      "Bulk topic ingest",
    ],
    cta: "Start Pro",
    featured: true,
  },
  {
    name: "Studio",
    price: "Custom",
    cadence: "",
    blurb: "Teams, agencies, and multi-channel operators.",
    features: [
      "Dedicated throughput",
      "Shared workspace",
      "Custom templates",
      "SLA & invoicing",
    ],
    cta: "Talk to sales",
    featured: false,
  },
] as const;

export function LandingPricing(): React.ReactElement {
  return (
    <section
      id="pricing"
      className="scroll-mt-24 border-b border-cv-border bg-cv-bg-surface py-16 sm:py-20 lg:py-24"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            id="pricing-heading"
            className="text-3xl font-semibold tracking-tight text-cv-text-primary sm:text-4xl"
          >
            Simple SaaS pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-cv-text-secondary">
            Pick throughput that matches your publishing cadence. Upgrade when
            your winners start compounding.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-5">
          {tiers.map((tier) => (
            <li
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-6 sm:p-8 ${
                tier.featured
                  ? "border-cv-border-strong bg-cv-bg-card shadow-[0_0_0_1px_var(--cv-border-strong),0_24px_64px_-24px_rgba(0,0,0,0.55)] lg:scale-[1.02]"
                  : "border-cv-border bg-cv-bg-elevated/50"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-cv-border-strong bg-cv-gold px-3 py-0.5 text-xs font-semibold text-cv-bg-deep">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-cv-text-primary">
                {tier.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cv-text-secondary">
                {tier.blurb}
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-cv-text-primary">
                  {tier.price}
                </span>
                {tier.cadence ? (
                  <span className="text-cv-text-tertiary">{tier.cadence}</span>
                ) : null}
              </div>
              <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-cv-text-secondary">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-cv-gold"
                      aria-hidden
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                {tier.name === "Studio" ? (
                  <a
                    href="mailto:sales@creatvid.app"
                    className="flex h-11 w-full items-center justify-center rounded-full border border-cv-border-strong text-sm font-semibold text-cv-text-primary transition hover:bg-cv-gold-subtle"
                  >
                    {tier.cta}
                  </a>
                ) : (
                  <LoginButton
                    className={`h-11 w-full rounded-full text-sm font-semibold ${
                      tier.featured
                        ? "border-0 bg-cv-gold text-cv-bg-deep shadow-[0_0_24px_var(--cv-gold-glow)] hover:bg-cv-gold-hover dark:hover:bg-cv-gold-hover"
                        : "border-cv-border bg-cv-bg-card text-cv-text-primary hover:bg-cv-gold-subtle dark:border-cv-border dark:hover:bg-cv-gold-subtle"
                    }`}
                  >
                    {tier.cta}
                  </LoginButton>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm text-cv-text-tertiary">
          Prices shown are illustrative placeholders — wire your billing when
          ready.
        </p>
      </div>
    </section>
  );
}
