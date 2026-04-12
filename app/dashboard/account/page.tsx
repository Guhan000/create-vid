import type { Profile } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import * as Avatar from "@radix-ui/react-avatar";
import * as Separator from "@radix-ui/react-separator";
import { signOut } from "../actions";
import Link from "next/link";

export default async function DashboardAccountPage(): Promise<React.ReactElement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url")
    .eq("id", user.id)
    .maybeSingle() as { data: Pick<Profile, "full_name" | "email" | "avatar_url"> | null };

  const displayName = profile?.full_name ?? user.email ?? "User";
  const displayEmail = profile?.email ?? user.email;

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-cv-text-primary sm:text-3xl">
        Account
      </h1>
      <p className="mt-2 text-sm text-cv-text-secondary sm:text-base">
        Manage your profile and subscription.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-cv-gold-muted">
          Profile
        </h2>
        <div className="mt-3 flex items-center gap-4 rounded-xl border border-cv-border bg-cv-bg-card p-4 sm:p-5">
          <Avatar.Root className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cv-border bg-cv-bg-elevated">
            <Avatar.Image
              src={profile?.avatar_url ?? undefined}
              alt={displayName}
            />
            <Avatar.Fallback className="text-sm font-medium text-cv-gold-bright">
              {displayName.slice(0, 2).toUpperCase()}
            </Avatar.Fallback>
          </Avatar.Root>
          <div>
            <p className="font-medium text-cv-text-primary">{displayName}</p>
            {displayEmail && (
              <p className="text-sm text-cv-text-tertiary">{displayEmail}</p>
            )}
          </div>
        </div>
      </section>

      <Separator.Root className="my-8 h-px bg-cv-border" decorative />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-cv-gold-muted">
          Subscription
        </h2>
        <div className="mt-3 rounded-xl border border-cv-border bg-cv-bg-card p-4 sm:p-5">
          <p className="text-sm text-cv-text-secondary">
            Manage your subscription, billing, and plan.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-lg border border-cv-border-strong bg-cv-gold-subtle px-3 py-1 text-xs font-semibold text-cv-gold-bright">
              Free plan
            </span>
            <Link
              href="/dashboard/account/subscription"
              className="text-sm font-medium text-cv-gold-bright transition hover:text-cv-gold hover:underline"
            >
              Manage subscription
            </Link>
          </div>
        </div>
      </section>

      <Separator.Root className="my-8 h-px bg-cv-border" decorative />

      <section>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg border border-cv-border-strong bg-cv-bg-elevated px-4 py-2.5 text-sm font-medium text-cv-text-primary transition hover:border-cv-gold/40 hover:bg-cv-gold-subtle"
          >
            Log out
          </button>
        </form>
      </section>
    </div>
  );
}
