import { LoginButton } from "../LoginButton";
import { ArrowRight } from "lucide-react";

export function LandingCTA(): React.ReactElement {
  return (
    <section
      id="cta"
      className="scroll-mt-24 py-16 sm:py-20 lg:py-24"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-cv-border-strong bg-cv-bg-card px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
            style={{ background: "var(--cv-gold-glow)" }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full blur-3xl"
            style={{ background: "var(--cv-gold-subtle)" }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2
              id="cta-heading"
              className="text-3xl font-semibold tracking-tight text-cv-text-primary sm:text-4xl"
            >
              Ready for your unfair advantage?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-cv-text-secondary">
              Spin up your next faceless video in minutes. Sign in with Google,
              pick a flow in the dashboard, and ship while the algorithm is
              still warm.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <LoginButton className="h-12 w-full rounded-full border-0 bg-cv-gold px-8 text-base font-semibold text-cv-bg-deep shadow-[0_0_32px_var(--cv-gold-glow)] hover:bg-cv-gold-hover sm:w-auto">
                Get started free
              </LoginButton>
              <a
                href="#pricing"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-medium text-cv-gold-bright transition hover:text-cv-gold sm:w-auto"
              >
                Compare plans
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
