import { DashboardShell } from "./components/DashboardShell";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — CreatVid",
  description: "Create and manage your CreatVid projects.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userEmail = user?.email ?? "—";
  const credits = 0;

  return (
    <DashboardShell userEmail={userEmail} credits={credits}>
      {children}
    </DashboardShell>
  );
}
