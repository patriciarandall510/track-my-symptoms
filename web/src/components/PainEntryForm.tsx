"use client";

import { useState } from "react";
import { usePainLogs } from "../lib/hooks/usePainLogs";

const qualities = ["sharp", "dull", "aching", "stiff", "burning", "other"];

function getPainLabel(score: number): string {
  if (score <= 2) return "Mild";
  if (score <= 4) return "Moderate";
  if (score <= 7) return "Severe";
  return "Extreme";
}

function getPainColorClasses(score: number): string {
  if (score <= 2) return "border-green-500 text-green-700 bg-green-50 dark:border-green-400 dark:text-green-300 dark:bg-green-950";
  if (score <= 4) return "border-blue-500 text-blue-700 bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:bg-blue-950";
  if (score <= 7) return "border-amber-500 text-amber-700 bg-amber-50 dark:border-amber-400 dark:text-amber-300 dark:bg-amber-950";
  return "border-red-500 text-red-700 bg-red-50 dark:border-red-400 dark:text-red-300 dark:bg-red-950";
}

function getPainTextColor(score: number): string {
  if (score <= 2) return "text-green-700 dark:text-green-300";
  if (score <= 4) return "text-blue-700 dark:text-blue-300";
  if (score <= 7) return "text-amber-700 dark:text-amber-300";
  return "text-red-700 dark:text-red-300";
}

export function PainEntryForm() {
  const [painScore, setPainScore] = useState(3);
  const [location, setLocation] = useState("");
  const [quality, setQuality] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [dateStr, setDateStr] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [timeStr, setTimeStr] = useState(() => {
    const d = new Date();
    return d.toTimeString().slice(0, 5); // HH:MM
  });
  const [submitting, setSubmitting] = useState(false);
  const { addPainLog } = usePainLogs();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const date = new Date(
      `${dateStr}T${timeStr || "00:00"}:00${new Date()
        .toISOString()
        .slice(19)}`,
    );

    // Build confirmation message
    const dateTimeStr = date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    let confirmMsg = `Save pain entry?\n\nPain Score: ${painScore}/10 (${getPainLabel(painScore)})\nDate/Time: ${dateTimeStr}`;
    if (location) confirmMsg += `\nLocation: ${location}`;
    if (quality) confirmMsg += `\nQuality: ${quality}`;
    if (notes) confirmMsg += `\nNotes: ${notes}`;

    if (!confirm(confirmMsg)) {
      return;
    }

    setSubmitting(true);
    try {
      await addPainLog({
        painScore,
        location: location || undefined,
        quality: quality || undefined,
        notes: notes || undefined,
        tags: undefined,
        userId: "", // filled in on write helper
        timestamp: date,
      } as any);
      setNotes("");
    } catch (err) {
      console.error("Failed to add pain log", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-6 rounded-xl sm:rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-white dark:bg-slate-800 p-3 sm:p-6 shadow-sm"
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            How is your pain right now?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            0 = no pain, 10 = worst imaginable.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-4 py-3 sm:py-4">
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <span className={`text-3xl sm:text-4xl font-semibold tabular-nums ${getPainTextColor(painScore)}`}>
              {painScore}
            </span>
            <span className={`inline-flex items-center rounded-full border px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium ${getPainColorClasses(painScore)}`}>
              {getPainLabel(painScore)}
            </span>
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={10}
          value={painScore}
          onChange={(e) => setPainScore(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide dark:text-slate-400">
            Where is the pain?
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. right knee, lower back"
            className="w-full rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm transition-colors hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide dark:text-slate-400">
            What does it feel like?
          </label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="w-full rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 shadow-sm transition-colors hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          >
            <option value="">Select</option>
            {qualities.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide dark:text-slate-400">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Anything else about the pain, what you were doing, etc."
          className="w-full rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm transition-colors hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide dark:text-slate-400">
          When was this?
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="flex-1 min-w-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 shadow-sm transition-colors hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          />
          <input
            type="time"
            value={timeStr}
            onChange={(e) => setTimeStr(e.target.value)}
            className="flex-1 min-w-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 shadow-sm transition-colors hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          />
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              setDateStr(now.toISOString().slice(0, 10));
              setTimeStr(now.toTimeString().slice(0, 5));
            }}
            className="rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-50 shadow-sm transition-colors hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Now
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center rounded-lg sm:rounded-xl bg-blue-600 px-4 py-2.5 sm:py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 transition-colors"
      >
        {submitting ? "Saving…" : "Save pain entry"}
      </button>
    </form>
  );
}


