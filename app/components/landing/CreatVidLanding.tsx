import { LandingCTA } from "./LandingCTA";
import { LandingFeatures } from "./LandingFeatures";
import { LandingFooter } from "./LandingFooter";
import { LandingHeader } from "./LandingHeader";
import { LandingHero } from "./LandingHero";
import { LandingHowItWorks } from "./LandingHowItWorks";
import { LandingPricing } from "./LandingPricing";

export type LandingUser = {
  displayName: string;
  avatarUrl: string | null;
} | null;

export function CreatVidLanding({
  user,
}: {
  user?: LandingUser;
}): React.ReactElement {
  return (
    <div className="min-h-screen bg-cv-bg-deep text-cv-text-primary antialiased">
      <a
        href="#main"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:inline-flex focus:h-auto focus:w-auto focus:overflow-visible focus:rounded-lg focus:bg-cv-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-cv-bg-deep focus:outline-none focus:ring-2 focus:ring-cv-gold-bright focus:ring-offset-2 focus:ring-offset-cv-bg-deep"
      >
        Skip to content
      </a>
      <LandingHeader user={user ?? null} />
      <main id="main">
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingPricing />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
