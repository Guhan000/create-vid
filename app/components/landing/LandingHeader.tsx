"use client";

import * as Avatar from "@radix-ui/react-avatar";
import { LoginButton } from "../LoginButton";
import type { LandingUser } from "./CreatVidLanding";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const nav = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
] as const;

export function LandingHeader({
  user,
}: {
  user: LandingUser;
}): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = (): void => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-transparent transition-colors duration-300",
        scrolled && "border-cv-border bg-cv-bg-deep/90 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-baseline gap-1.5 text-lg font-semibold tracking-tight text-cv-text-primary"
        >
          <span className="bg-gradient-to-r from-cv-gold-bright to-cv-gold bg-clip-text text-transparent">
            CreatVid
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-cv-text-secondary transition hover:text-cv-gold-bright"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-full border border-cv-border-strong bg-cv-gold-subtle px-5 text-sm font-semibold text-cv-gold-bright shadow-[0_0_20px_var(--cv-gold-glow)] transition hover:border-cv-gold-bright hover:bg-cv-gold/15"
              >
                Dashboard
              </Link>
              {/* <div className="flex max-w-[12rem] items-center gap-2 rounded-full border border-cv-border bg-cv-bg-elevated py-1 pl-1 pr-3">
                <Avatar.Root className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cv-border bg-cv-bg-card">
                  <Avatar.Image
                    src={user.avatarUrl ?? undefined}
                    alt={user.displayName}
                    className="h-full w-full object-cover"
                  />
                  <Avatar.Fallback className="text-xs font-semibold text-cv-gold-bright">
                    {user.displayName.slice(0, 2).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>
                <span className="truncate text-sm font-medium text-cv-text-primary">
                  {user.displayName}
                </span>
              </div> */}
            </>
          ) : (
            <LoginButton className="h-10 w-auto min-w-[7rem] rounded-full border-cv-border-strong bg-cv-gold px-5 text-sm font-semibold text-cv-bg-deep shadow-[0_0_24px_var(--cv-gold-glow)] hover:bg-cv-gold-hover dark:border-cv-border-strong dark:hover:bg-cv-gold-hover" />
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-cv-border text-cv-text-primary md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-cv-border bg-cv-bg-surface md:hidden",
          !open && "hidden",
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-cv-text-secondary hover:bg-cv-bg-elevated hover:text-cv-gold-bright"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="mt-2 border-t border-cv-border pt-4">
            {user ? (
              <div className="flex flex-col gap-3">
                <Link
                  href="/dashboard"
                  className="flex h-11 w-full items-center justify-center rounded-xl border border-cv-border-strong bg-cv-gold-subtle text-sm font-semibold text-cv-gold-bright transition hover:bg-cv-gold/15"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                {/* <div className="flex items-center gap-3 rounded-xl border border-cv-border bg-cv-bg-elevated px-3 py-2">
                  <Avatar.Root className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cv-border bg-cv-bg-card">
                    <Avatar.Image
                      src={user.avatarUrl ?? undefined}
                      alt={user.displayName}
                      className="h-full w-full object-cover"
                    />
                    <Avatar.Fallback className="text-sm font-semibold text-cv-gold-bright">
                      {user.displayName.slice(0, 2).toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-cv-text-primary">
                    {user.displayName}
                  </span>
                </div> */}
              </div>
            ) : (
              <LoginButton className="h-11 w-full rounded-xl border-cv-border-strong bg-cv-gold text-sm font-semibold text-cv-bg-deep shadow-[0_0_20px_var(--cv-gold-glow)] hover:bg-cv-gold-hover dark:border-cv-border-strong dark:hover:bg-cv-gold-hover md:w-full" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
