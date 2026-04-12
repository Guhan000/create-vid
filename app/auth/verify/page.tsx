"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DEFAULT_REDIRECT = "/dashboard";

export default function VerifyEmailPage(): React.ReactElement {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    async function load(): Promise<void> {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/");
        return;
      }

      setEmail(user.email ?? null);
      if (user.email_confirmed_at) {
        router.replace(DEFAULT_REDIRECT);
        return;
      }
      setLoading(false);
    }

    load();
  }, [router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  async function resendLink(): Promise<void> {
    if (!email || cooldown > 0) return;
    setSending(true);
    setMessage(null);
    setError(null);
    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(DEFAULT_REDIRECT)}`,
      },
    });
    if (otpError) {
      setError(otpError.message);
      setSending(false);
      return;
    }
    setCooldown(30);
    setMessage("Verification link sent. Please check your inbox.");
    setSending(false);
  }

  async function handleLogout(): Promise<void> {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cv-bg-deep px-6 text-cv-text-primary">
        <p className="text-sm text-cv-text-secondary">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cv-bg-deep px-6 text-cv-text-primary">
      <div className="w-full max-w-md rounded-2xl border border-cv-border bg-cv-bg-card p-6 shadow-[0_0_0_1px_var(--cv-border),0_24px_80px_-20px_rgba(0,0,0,0.75)]">
        <h1 className="text-2xl font-semibold tracking-tight">
          Verify your email
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-cv-text-secondary">
          {email
            ? `We sent a magic link to ${email}. Open it to finish login.`
            : "We sent a magic link to your email. Open it to finish login."}
        </p>

        {message && (
          <p className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={resendLink}
          disabled={sending || cooldown > 0 || !email}
          className="mt-5 w-full rounded-xl border border-cv-border-strong bg-cv-gold px-4 py-3 text-sm font-semibold text-cv-bg-deep transition hover:bg-cv-gold-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend verification link"}
        </button>

        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="text-sm text-cv-text-secondary transition hover:text-cv-text-primary"
          >
            Back to home
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-cv-gold-bright transition hover:text-cv-gold"
          >
            Use another email
          </button>
        </div>
      </div>
    </main>
  );
}
