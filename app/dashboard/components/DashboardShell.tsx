"use client";

import { cn } from "@/lib/utils";
import {
  Clapperboard,
  Coins,
  CreditCard,
  History,
  Menu,
  Send,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  {
    href: "/dashboard/create/faceless",
    label: "Create Video",
    icon: Clapperboard,
    isActive: (path: string) =>
      path === "/dashboard" || path.startsWith("/dashboard/create"),
  },
  {
    href: "/dashboard/history",
    label: "History",
    icon: History,
    isActive: (path: string) => path.startsWith("/dashboard/history"),
  },
  {
    href: "/dashboard/auto-post",
    label: "Auto post",
    icon: Send,
    isActive: (path: string) => path.startsWith("/dashboard/auto-post"),
  },
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: CreditCard,
    isActive: (path: string) => path.startsWith("/dashboard/billing"),
  },
] as const;

export function DashboardShell({
  userEmail,
  credits,
  children,
}: {
  userEmail: string;
  credits: number;
  children: React.ReactNode;
}): React.ReactElement {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  const localPart = userEmail.includes("@")
    ? userEmail.split("@")[0]
    : userEmail;
  const initials = (localPart.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2) || "CV")
    .toUpperCase()
    .padEnd(2, "·");

  const sidebarInner = (
    <>
      <div className="flex h-16 shrink-0 items-center border-b border-cv-border bg-cv-bg-surface px-5">
        <Link
          href="/dashboard/create/faceless"
          onClick={() => setMobileNavOpen(false)}
          className="text-lg font-semibold tracking-tight text-cv-text-primary"
        >
          <span className="bg-gradient-to-r from-cv-gold-bright to-cv-gold bg-clip-text text-transparent">
            CreatVid
          </span>
        </Link>
      </div>

      <nav
        className="cv-scrollbar-dashboard flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden p-3"
        aria-label="Dashboard"
      >
        {navItems.map(({ href, label, icon: Icon, isActive }) => {
          const active = isActive(pathname);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileNavOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-cv-gold-subtle text-cv-gold-bright ring-1 ring-cv-border-strong"
                  : "text-cv-text-secondary hover:bg-cv-bg-elevated hover:text-cv-text-primary",
              )}
            >
              <Icon
                className={cn(
                  "h-[1.125rem] w-[1.125rem] shrink-0",
                  active ? "text-cv-gold-bright" : "text-cv-text-tertiary",
                )}
                aria-hidden
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-cv-border bg-cv-bg-surface p-4">
        <div className="rounded-xl border border-cv-border bg-cv-bg-elevated/80 p-3.5">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cv-border bg-cv-bg-card text-xs font-semibold text-cv-gold-bright"
              aria-hidden
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-cv-text-tertiary">
                Profile
              </p>
              <p className="truncate text-sm font-medium text-cv-text-primary">
                {userEmail}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-cv-border bg-cv-bg-deep/60 px-3 py-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-cv-text-secondary">
              <Coins className="h-3.5 w-3.5 text-cv-gold-muted" aria-hidden />
              Credits
            </span>
            <span className="tabular-nums text-sm font-semibold text-cv-gold-bright">
              {credits}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden bg-cv-bg-deep text-cv-text-primary lg:flex-row">
      <aside className="relative z-30 hidden h-dvh w-[17rem] shrink-0 flex-col border-r border-cv-border bg-cv-bg-surface lg:flex">
        {sidebarInner}
      </aside>

      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] lg:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <aside
        id="dashboard-mobile-nav"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(18rem,100vw-2rem)] flex-col border-r border-cv-border bg-cv-bg-surface shadow-2xl transition-transform duration-200 ease-out lg:hidden",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!mobileNavOpen}
      >
        {sidebarInner}
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="z-20 flex h-14 shrink-0 items-center gap-3 border-b border-cv-border bg-cv-bg-deep/90 px-4 backdrop-blur-md sm:h-16 sm:px-5 lg:hidden">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-cv-border text-cv-text-primary transition hover:bg-cv-bg-elevated"
            aria-expanded={mobileNavOpen}
            aria-controls="dashboard-mobile-nav"
            onClick={() => setMobileNavOpen((o) => !o)}
          >
            {mobileNavOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
          <span className="text-sm font-semibold text-cv-text-primary">
            Dashboard
          </span>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col overflow-hidden px-4 py-5 sm:px-6 sm:py-6 lg:max-w-none lg:px-8 lg:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
