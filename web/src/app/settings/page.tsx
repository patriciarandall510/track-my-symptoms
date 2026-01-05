"use client";

import { useUser } from "../../lib/hooks/useUser";

export default function SettingsPage() {
  const { user, loading, error, linkGoogle } = useUser();

  if (loading) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading your account…</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Settings</h1>
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Account</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
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
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Link Google account
          </button>
        )}
        {error && (
          <p className="text-xs text-red-600">
            {error.message || "An error occurred while updating your account."}
          </p>
        )}
      </div>
    </section>
  );
}


