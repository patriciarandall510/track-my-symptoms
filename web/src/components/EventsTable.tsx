"use client";

import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { useEvents } from "../lib/hooks/useEvents";
import type { ActivityType } from "../lib/types";

const typeLabels: Record<ActivityType, string> = {
  pt: "Physical therapy",
  run: "Run",
  elliptical: "Elliptical",
  long_drive: "Long drive",
  other: "Other",
};

export function EventsTable() {
  const [typeFilter, setTypeFilter] = useState<ActivityType | "all">("all");
  const { data, loading, error, deleteEvent } = useEvents({
    type: typeFilter,
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      try {
        await deleteEvent(id);
      } catch (err) {
        console.error("Failed to delete event:", err);
        alert("Failed to delete activity. Please try again.");
      }
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading events…</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-red-600">
        Failed to load events. Try refreshing the page.
      </p>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <h2 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
          Logged PT & activity
        </h2>
        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value as ActivityType | "all")
          }
          className="rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs text-slate-900 dark:text-slate-100 shadow-sm transition-colors hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        >
          <option value="all">All types</option>
          {Object.entries(typeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {data.length === 0 ? (
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          No events yet. Use the form on the left to log PT or other activities.
        </p>
      ) : (
        <div className="w-full max-w-full overflow-x-auto overflow-y-auto rounded-xl sm:rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-white dark:bg-slate-800 shadow-sm max-h-[500px] sm:max-h-[600px]">
          <table className="min-w-[600px] divide-y divide-slate-100 dark:divide-slate-700 text-xs sm:text-sm">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 z-10">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                  Time
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                  Type
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                  Duration
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                  Intensity
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                  Notes
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {data.map((event, index) => {
                const date =
                  event.timestamp instanceof Timestamp
                    ? event.timestamp.toDate()
                    : new Date(event.timestamp as any);
                return (
                  <tr key={event.id} className={index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50/40 dark:bg-slate-700/40"}>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-700 dark:text-slate-300">
                      {format(date, "MMM d, yyyy HH:mm")}
                    </td>
                    <td className="px-3 py-2 font-semibold text-slate-900 dark:text-slate-100">
                      {typeLabels[event.type]}
                    </td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">
                      {event.durationMinutes != null ? (
                        `${event.durationMinutes} min`
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">
                      {event.intensity ?? <span className="text-slate-300 dark:text-slate-600">—</span>}
                    </td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300 line-clamp-2">
                      {event.notes ?? <span className="text-slate-300 dark:text-slate-600">—</span>}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        aria-label="Delete activity"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


