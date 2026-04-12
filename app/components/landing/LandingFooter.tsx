import Link from "next/link";

const product = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
] as const;

const legal = [
  { href: "#", label: "Privacy" },
  { href: "#", label: "Terms" },
] as const;

export function LandingFooter(): React.ReactElement {
  return (
    <footer
      className="border-t border-cv-border bg-cv-bg-deep py-12 sm:py-14"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-cv-text-primary"
            >
              <span className="bg-gradient-to-r from-cv-gold-bright to-cv-gold bg-clip-text text-transparent">
                CreatVid
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-cv-text-secondary">
              Faceless video generation for creators who treat content like a
              product — ship fast, measure, and scale what works.
            </p>
          </div>
          <div className="flex flex-wrap gap-12 sm:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cv-gold-muted">
                Product
              </p>
              <ul className="mt-4 space-y-2">
                {product.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm text-cv-text-secondary transition hover:text-cv-gold-bright"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cv-gold-muted">
                Legal
              </p>
              <ul className="mt-4 space-y-2">
                {legal.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm text-cv-text-secondary transition hover:text-cv-gold-bright"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-cv-border pt-8 text-sm text-cv-text-tertiary sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CreatVid. All rights reserved.</p>
          <p className="font-mono text-xs text-cv-text-tertiary">
            Built for viral faceless video workflows
          </p>
        </div>
      </div>
    </footer>
  );
}
