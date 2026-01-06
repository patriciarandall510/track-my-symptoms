"use client";

import { useState } from "react";
import { useEvents } from "../lib/hooks/useEvents";
import type { ActivityType } from "../lib/types";

const activityTypes: { value: ActivityType; label: string }[] = [
  { value: "pt", label: "Physical therapy" },
  { value: "run", label: "Run" },
  { value: "elliptical", label: "Elliptical" },
  { value: "long_drive", label: "Long drive" },
  { value: "other", label: "Other" },
];

const intensities = ["easy", "moderate", "hard"] as const;

export function EventEntryForm() {
  const { addEvent } = useEvents();
  const [type, setType] = useState<ActivityType>("pt");
  const [dateStr, setDateStr] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [timeStr, setTimeStr] = useState(() => {
    const d = new Date();
    return d.toTimeString().slice(0, 5);
  });
  const [durationMinutes, setDurationMinutes] = useState<string>("");
  const [intensity, setIntensity] =
    useState<(typeof intensities)[number] | "">("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const activityTypeLabel = activityTypes.find((t) => t.value === type)?.label || type;
    const date = new Date(
      `${dateStr}T${timeStr || "00:00"}:00${new Date()
        .toISOString()
        .slice(19)}`,
    );
    const formattedDate = date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

    const confirmMessage = `Are you sure you want to log this ${activityTypeLabel.toLowerCase()} activity?\n\nDate: ${formattedDate}${durationMinutes ? `\nDuration: ${durationMinutes} minutes` : ""}${intensity ? `\nIntensity: ${intensity}` : ""}${notes ? `\nNotes: ${notes.substring(0, 50)}${notes.length > 50 ? "..." : ""}` : ""}`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setSubmitting(true);
    try {
      await addEvent({
        type,
        timestamp: date,
        durationMinutes: durationMinutes
          ? Number.parseInt(durationMinutes, 10)
          : null,
        intensity: intensity || null,
        notes: notes || undefined,
        userId: "",
      } as any);
      setNotes("");
    } catch (err) {
      console.error("Failed to add event", err);
      alert("Failed to save activity. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-6 rounded-xl sm:rounded-2xl border border-border bg-card p-3 sm:p-6 shadow-sm"
    >
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-text-strong">
          Log PT, exercise, or other events
        </h2>
        <p className="text-sm text-text-muted">
          Track when you did PT, ran, took long drives, etc.
        </p>
      </div>

      <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wide">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ActivityType)}
            className="w-full rounded-lg sm:rounded-xl border border-border bg-input px-2 py-1.5 text-xs sm:text-sm text-text shadow-sm transition-colors hover:border-border-subtle focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
          >
            {activityTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wide">
            When
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="flex-1 min-w-0 rounded-lg sm:rounded-xl border border-border bg-input px-2 py-1.5 text-xs sm:text-sm text-text shadow-sm transition-colors hover:border-border-subtle focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
            />
            <input
              type="time"
              value={timeStr}
              onChange={(e) => setTimeStr(e.target.value)}
              className="flex-1 min-w-0 rounded-lg sm:rounded-xl border border-border bg-input px-2 py-1.5 text-xs sm:text-sm text-text shadow-sm transition-colors hover:border-border-subtle focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
            />
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setDateStr(now.toISOString().slice(0, 10));
                setTimeStr(now.toTimeString().slice(0, 5));
              }}
              className="rounded-lg sm:rounded-xl border border-border bg-card-2 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-text shadow-sm transition-colors hover:border-border-subtle hover:bg-card"
            >
              Now
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wide">
            Duration (minutes)
          </label>
          <input
            type="number"
            min={0}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            className="w-full rounded-lg sm:rounded-xl border border-border bg-input px-2 py-1.5 text-xs sm:text-sm text-text shadow-sm transition-colors hover:border-border-subtle focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wide">
            Intensity
          </label>
          <select
            value={intensity}
            onChange={(e) =>
              setIntensity(e.target.value as (typeof intensities)[number] | "")
            }
            className="w-full rounded-lg sm:rounded-xl border border-border bg-input px-2 py-1.5 text-xs sm:text-sm text-text shadow-sm transition-colors hover:border-border-subtle focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
          >
            <option value="">Select</option>
            {intensities.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-text-secondary uppercase tracking-wide">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Anything notable about the session or event."
          className="w-full rounded-lg sm:rounded-xl border border-border bg-muted px-2 py-1.5 text-xs sm:text-sm text-text placeholder:text-text-muted shadow-sm transition-colors hover:border-border-subtle focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary focus:bg-input"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg sm:rounded-xl bg-primary px-4 py-2.5 sm:py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover disabled:opacity-60 transition-colors"
        >
          {submitting ? "Saving…" : "Save event"}
        </button>
      </div>
    </form>
  );
}


