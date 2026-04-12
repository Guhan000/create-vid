"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

function titleForPath(pathname: string): string {
  if (pathname === "/dashboard" || pathname === "/dashboard/") return "Dashboard";
  if (pathname.startsWith("/dashboard/create")) return "Create video";
  if (pathname.startsWith("/dashboard/history")) return "History";
  if (pathname.startsWith("/dashboard/settings")) return "Settings";
  if (pathname.startsWith("/dashboard/account/subscription")) return "Subscription";
  if (pathname.startsWith("/dashboard/account")) return "Account";
  return "Dashboard";
}

export function DashboardTopBar({
  mobileNavOpen,
  onOpenMobileNav,
}: {
  mobileNavOpen: boolean;
  onOpenMobileNav: () => void;
}): React.ReactElement {
  const pathname = usePathname();
  const title = titleForPath(pathname);

  return (
    <header className="relative z-30 flex min-h-16 w-full shrink-0 flex-col border-b border-cv-border-strong bg-cv-bg-elevated shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
      <div
        className="h-1 w-full shrink-0 bg-gradient-to-r from-cv-gold/20 via-cv-gold-bright/50 to-cv-gold/20"
        aria-hidden
      />
      <div className="flex min-h-14 flex-1 items-center gap-3 px-4 py-2 sm:px-5">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cv-border text-cv-text-primary transition hover:border-cv-border-strong hover:bg-cv-gold-subtle md:hidden"
          aria-expanded={mobileNavOpen}
          aria-controls="dashboard-sidebar"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1 py-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cv-gold-bright">
            CreatVid Studio
          </p>
          <h1 className="truncate text-lg font-semibold tracking-tight text-cv-text-primary sm:text-xl">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
}
