import type { Profile } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardChrome } from "./components/DashboardChrome";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): Promise<React.ReactElement> {
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

  const userProfile = {
    displayName: profile?.full_name ?? user.email ?? "User",
    displayEmail: profile?.email ?? user.email ?? null,
    avatarUrl: profile?.avatar_url ?? null,
  };

  return <DashboardChrome user={userProfile}>{children}</DashboardChrome>;
}
