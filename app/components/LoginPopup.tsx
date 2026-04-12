"use client";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type LoginPopupProps = {
  open: boolean;
  onClose: () => void;
};

function GoogleMark({ className }: { className?: string }): React.ReactElement {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function LoginPopup({
  open,
  onClose,
}: LoginPopupProps): React.ReactElement | null {
  const router = useRouter();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  async function handleGoogleLogin(): Promise<void> {
    setLoadingGoogle(true);
    setError(null);
    setNotice(null);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (err) {
      setError(err.message);
      setLoadingGoogle(false);
      return;
    }
    setLoadingGoogle(false);
    onClose();
    router.refresh();
  }

  async function handleEmailMagicLink(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      setNotice(null);
      return;
    }
    setSendingEmail(true);
    setError(null);
    setNotice(null);

    const supabase = createClient();
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo,
      },
    });

    if (err) {
      setError(err.message);
      setSendingEmail(false);
      return;
    }

    setEmailSent(true);
    setCooldown(30);
    setNotice("Magic link sent. Check your inbox and open the link to continue.");
    setSendingEmail(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cv-bg-deep/80 p-4 backdrop-blur-md"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-[400px] rounded-2xl border border-cv-border-strong bg-cv-bg-card p-6 shadow-[0_0_0_1px_var(--cv-border),0_24px_80px_-20px_rgba(0,0,0,0.75)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-popup-title"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cv-gold/50 to-transparent"
          aria-hidden
        />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="login-popup-title"
              className="text-xl font-semibold tracking-tight text-cv-text-primary"
            >
              Log in to{" "}
              <span className="bg-gradient-to-r from-cv-gold-bright to-cv-gold bg-clip-text text-transparent">
                CreatVid
              </span>
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-cv-text-secondary">
              Continue with Google or a magic link to open your dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-cv-border p-2 text-cv-text-secondary transition hover:border-cv-border-strong hover:bg-cv-gold-subtle hover:text-cv-text-primary"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error !== null && (
          <p
            className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
            role="alert"
          >
            {error}
          </p>
        )}

        {notice !== null && (
          <p
            className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
            role="status"
          >
            {notice}
          </p>
        )}

        <form onSubmit={handleEmailMagicLink} className="mt-6 space-y-3">
          <label htmlFor="email" className="block text-sm text-cv-text-secondary">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-cv-border bg-cv-bg-elevated px-3 py-3 text-sm text-cv-text-primary outline-none transition placeholder:text-cv-text-tertiary focus:border-cv-gold/60 focus:ring-2 focus:ring-cv-gold/20"
          />
          <button
            type="submit"
            disabled={sendingEmail || cooldown > 0}
            className={cn(
              "w-full rounded-xl border border-cv-border-strong bg-cv-gold px-4 py-3 text-sm font-semibold text-cv-bg-deep transition",
              "hover:bg-cv-gold-hover",
              "disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            {sendingEmail
              ? "Sending link..."
              : emailSent && cooldown > 0
                ? `Resend in ${cooldown}s`
                : emailSent
                  ? "Resend magic link"
                  : "Send magic link"}
          </button>
        </form>

        <div className="mt-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-cv-border" />
          <span className="text-xs uppercase tracking-wide text-cv-text-tertiary">
            or
          </span>
          <div className="h-px flex-1 bg-cv-border" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loadingGoogle}
          className={cn(
            "mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white py-3.5 text-sm font-semibold text-zinc-900 shadow-sm transition",
            "hover:bg-zinc-50 hover:shadow-md",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          {loadingGoogle ? (
            <span className="text-zinc-600">Redirecting…</span>
          ) : (
            <>
              <GoogleMark />
              Continue with Google
            </>
          )}
        </button>

        <p className="mt-4 text-center text-xs leading-relaxed text-cv-text-tertiary">
          By continuing, you agree to our terms and privacy policy.
        </p>
      </div>
    </div>
  );
}
