"use client";

import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Separator from "@radix-ui/react-separator";
import {
  History,
  LogOut,
  Menu as MenuIcon,
  Settings,
  User,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "../actions";
import { cn } from "@/lib/utils";

type UserProfile = {
  displayName: string;
  displayEmail: string | null;
  avatarUrl: string | null;
};

const navItems = [
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

type DashboardSidebarProps = {
  user: UserProfile;
  className?: string;
  onNavigate?: () => void;
  onCloseMobile?: () => void;
};

export function DashboardSidebar({
  user,
  className,
  onNavigate,
  onCloseMobile,
}: DashboardSidebarProps): React.ReactElement {
  const pathname = usePathname();
  const isCreateActive = pathname.startsWith("/dashboard/create");

  const linkBase =
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors";
  const linkActive =
    "border border-cv-border-strong bg-cv-gold-subtle text-cv-gold-bright";
  const linkIdle =
    "border border-transparent text-cv-text-secondary hover:border-cv-border hover:bg-cv-bg-elevated hover:text-cv-text-primary";

  return (
    <aside
      id="dashboard-sidebar"
      className={cn(
        "flex h-full w-[min(100vw,16rem)] flex-col border-r border-cv-border bg-cv-bg-surface sm:w-56",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-cv-border px-3 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cv-border bg-cv-bg-elevated">
            <MenuIcon className="h-4 w-4 text-cv-gold" aria-hidden />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-cv-gold-bright to-cv-gold bg-clip-text text-transparent">
              CreatVid
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => onCloseMobile?.()}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-cv-border text-cv-text-secondary transition hover:bg-cv-gold-subtle hover:text-cv-text-primary"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <Link
          href="/dashboard/create"
          onClick={onNavigate}
          className={cn(linkBase, isCreateActive ? linkActive : linkIdle)}
        >
          <Video className="h-4 w-4 shrink-0 text-cv-gold" aria-hidden />
          Create video
        </Link>

        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(linkBase, isActive ? linkActive : linkIdle)}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <Separator.Root className="mx-3 h-px shrink-0 bg-cv-border" decorative />

      <div className="p-3">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left outline-none ring-cv-gold/30 transition hover:bg-cv-bg-elevated focus-visible:ring-2"
              aria-label="Open user menu"
            >
              <Avatar.Root className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cv-border bg-cv-bg-elevated">
                <Avatar.Image
                  src={user.avatarUrl ?? undefined}
                  alt={user.displayName}
                />
                <Avatar.Fallback className="text-xs font-medium text-cv-gold-bright">
                  {user.displayName.slice(0, 2).toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-cv-text-primary">
                  {user.displayName}
                </p>
                {user.displayEmail && (
                  <p className="truncate text-xs text-cv-text-tertiary">
                    {user.displayEmail}
                  </p>
                )}
              </div>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className="z-[60] min-w-[200px] rounded-xl border border-cv-border-strong bg-cv-bg-card p-1 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.65)]"
            sideOffset={8}
            align="end"
            side="top"
          >
            <DropdownMenu.Item
              asChild
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-cv-text-primary outline-none focus:bg-cv-gold-subtle"
            >
              <Link href="/dashboard/account" onClick={onNavigate}>
                <User className="h-4 w-4 text-cv-gold" aria-hidden />
                Account
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-cv-border" />
            <DropdownMenu.Item
              asChild
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-cv-text-primary outline-none focus:bg-cv-gold-subtle"
            >
              <form action={signOut} className="w-full">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 text-left"
                >
                  <LogOut className="h-4 w-4 text-cv-gold" aria-hidden />
                  Log out
                </button>
              </form>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </aside>
  );
}
