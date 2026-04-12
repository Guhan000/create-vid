"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { LoginPopup } from "./LoginPopup";

type LoginButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

export function LoginButton({
  className,
  children = "Log in",
}: LoginButtonProps): React.ReactElement {
  const [popupOpen, setPopupOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setPopupOpen(true)}
        className={cn(
          "flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]",
          className,
        )}
      >
        {children}
      </button>
      <LoginPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
    </>
  );
}
