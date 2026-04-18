"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard/create/faceless", label: "Faceless Video" },
  { href: "/dashboard/create/avatar", label: "Avatar Video" },
  { href: "/dashboard/create/fake-text", label: "FakeText Video" },
  { href: "/dashboard/create/gameplay", label: "Gameplay Video" },
] as const;

export function CreateVideoTabs(): React.ReactElement {
  const pathname = usePathname();

  return (
    <div className="w-full">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cv-text-tertiary">
        Create Video
      </p>
      <div
        className="-mx-1 flex gap-1 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible"
        role="tablist"
        aria-label="Video type"
      >
        {tabs.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              role="tab"
              aria-selected={active}
              className={cn(
                "shrink-0 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors sm:px-4",
                active
                  ? "bg-cv-gold-subtle text-cv-gold-bright ring-1 ring-cv-border-strong"
                  : "text-cv-text-secondary hover:bg-cv-bg-elevated hover:text-cv-text-primary",
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
