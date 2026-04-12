import { CreatVidLanding } from "./components/landing/CreatVidLanding";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/database";

export default async function Home(): Promise<React.ReactElement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let landingUser: { displayName: string; avatarUrl: string | null } | null =
    null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, avatar_url")
      .eq("id", user.id)
      .maybeSingle() as {
      data: Pick<Profile, "full_name" | "email" | "avatar_url"> | null;
    };

    landingUser = {
      displayName: profile?.full_name ?? user.email ?? "User",
      avatarUrl: profile?.avatar_url ?? null,
    };
  }

  return <CreatVidLanding user={landingUser} />;
}
