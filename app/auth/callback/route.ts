import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const DEFAULT_REDIRECT = "/dashboard";
const VERIFY_REDIRECT = "/auth/verify";

function buildRedirect(origin: string, path: string, error?: string): NextResponse {
  const url = new URL(path, origin);
  if (error) {
    url.searchParams.set("error", error);
  }
  return NextResponse.redirect(url.toString());
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? DEFAULT_REDIRECT;
  const errorParam = searchParams.get("error");

  if (errorParam) {
    return buildRedirect(origin, "/", errorParam);
  }

  const supabase = await createClient();
  let exchangeError: string | null = null;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      exchangeError = error.message;
    }
  } else if (tokenHash && type) {
    const otpType = type as EmailOtpType;
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: otpType,
    });
    if (error) {
      exchangeError = error.message;
    }
  } else {
    exchangeError = "missing_auth_params";
  }

  if (exchangeError) {
    return buildRedirect(origin, "/", exchangeError);
  }

  const safeNext = next.startsWith("/") ? next : DEFAULT_REDIRECT;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return buildRedirect(origin, "/", "auth_session_missing");
  }

  const provider = user.app_metadata?.provider;
  const isVerified = Boolean(user.email_confirmed_at);
  if (provider === "email" && !isVerified) {
    return buildRedirect(origin, VERIFY_REDIRECT);
  }

  return buildRedirect(origin, safeNext);
}
