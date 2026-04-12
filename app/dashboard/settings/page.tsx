import Link from "next/link";

export default function DashboardSettingsPage(): React.ReactElement {
  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-cv-text-primary sm:text-3xl">
        Settings
      </h1>
      <p className="mt-2 text-sm text-cv-text-secondary sm:text-base">
        Manage your application settings.
      </p>
      <ul className="mt-6 space-y-2 text-sm">
        <li className="rounded-xl border border-cv-border bg-cv-bg-card px-4 py-3">
          <Link
            href="/dashboard/account"
            className="font-medium text-cv-gold-bright transition hover:text-cv-gold hover:underline"
          >
            Account
          </Link>
          <span className="text-cv-text-tertiary">
            {" "}
            – User details, logout, subscription
          </span>
        </li>
      </ul>
    </div>
  );
}
