import Link from "next/link";

export default function SubscriptionPage(): React.ReactElement {
  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link
          href="/dashboard/account"
          className="text-sm font-medium text-cv-gold-bright transition hover:text-cv-gold hover:underline"
        >
          ← Back to Account
        </Link>
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-cv-text-primary sm:text-3xl">
        Subscription
      </h1>
      <p className="mt-2 text-sm text-cv-text-secondary sm:text-base">
        Manage your plan, billing, and payment methods.
      </p>
      <div className="mt-6 rounded-xl border border-cv-border bg-cv-bg-card p-6 sm:p-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-cv-gold-muted">
          Current plan
        </h2>
        <p className="mt-2 text-sm text-cv-text-secondary">
          Free plan – upgrade for more features.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-cv-border-strong bg-cv-bg-elevated px-4 py-2 text-sm font-medium text-cv-text-primary transition hover:border-cv-gold/40 hover:bg-cv-gold-subtle"
          >
            Upgrade plan
          </button>
          <button
            type="button"
            className="rounded-lg border border-cv-border bg-cv-bg-elevated px-4 py-2 text-sm font-medium text-cv-text-primary transition hover:border-cv-border-strong"
          >
            Billing history
          </button>
        </div>
      </div>
    </div>
  );
}
