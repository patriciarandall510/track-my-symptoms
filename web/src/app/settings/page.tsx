"use client";

import { useUser } from "../../lib/hooks/useUser";

export default function SettingsPage() {
  const { user, loading, error, linkGoogle } = useUser();

  if (loading) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-text-strong">Settings</h1>
        <p className="text-sm text-text-muted">Loading your account…</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight text-text-strong">Settings</h1>
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-text-strong">Account</h2>
          <p className="text-sm text-text-muted">
            You are currently{" "}
            {user?.isAnonymous
              ? "using an anonymous account. Link it to keep data across devices."
              : `signed in as ${user?.email ?? "a linked account"}.`}
          </p>
        </div>
        {user?.isAnonymous && (
          <button
            type="button"
            onClick={linkGoogle}
            className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-primary-hover"
          >
            Link Google account
          </button>
        )}
        {error && (
          <p className="text-xs text-danger">
            {error.message || "An error occurred while updating your account."}
          </p>
        )}
      </div>
    </section>
  );
}


