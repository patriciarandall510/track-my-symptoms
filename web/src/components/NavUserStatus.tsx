"use client";

import Link from "next/link";
import { useUser } from "../lib/hooks/useUser";

export function NavUserStatus() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <span className="text-xs text-text-muted" aria-live="polite">
        Loading…
      </span>
    );
  }

  if (!user) {
    return (
      <span className="text-xs text-danger" aria-live="polite">
        Not signed in
      </span>
    );
  }

  const isAnonymous = user.isAnonymous;

  return (
    <div className="flex items-center gap-1 sm:gap-2 text-xs">
      {isAnonymous ? (
        <span
          className="hidden sm:inline rounded-full bg-muted px-2 sm:px-3 py-1 text-[10px] sm:text-xs text-text-secondary"
          aria-live="polite"
        >
          Anonymous session
        </span>
      ) : (
        <span className="text-text-secondary truncate max-w-[100px] sm:max-w-none" aria-live="polite">
          {user.email ?? "Linked account"}
        </span>
      )}
      {isAnonymous && (
        <Link
          href="/settings"
          className="hidden sm:inline rounded-full border border-border px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-text hover:bg-card"
        >
          Link account
        </Link>
      )}
    </div>
  );
}


