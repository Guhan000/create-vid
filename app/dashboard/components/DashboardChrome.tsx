"use client";

import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopBar } from "./DashboardTopBar";
import { cn } from "@/lib/utils";

type UserProfile = {
  displayName: string;
  displayEmail: string | null;
  avatarUrl: string | null;
};

export function DashboardChrome({
  user,
  children,
}: {
  user: UserProfile;
  children: React.ReactNode;
}): React.ReactElement {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-cv-bg-deep text-cv-text-primary antialiased">
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-cv-bg-deep/80 backdrop-blur-sm md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <DashboardSidebar
        user={user}
        className={cn(
          "shrink-0 max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:transition-transform max-md:duration-200 max-md:ease-out",
          mobileNavOpen
            ? "max-md:translate-x-0 max-md:shadow-[4px_0_24px_rgba(0,0,0,0.45)]"
            : "max-md:pointer-events-none max-md:-translate-x-full",
          "md:relative md:z-auto md:translate-x-0 md:shadow-none",
        )}
        onNavigate={() => setMobileNavOpen(false)}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopBar
          mobileNavOpen={mobileNavOpen}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <main className="min-h-0 flex-1 overflow-auto bg-cv-bg-deep">
          {children}
        </main>
      </div>
    </div>
  );
}
