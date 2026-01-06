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
    return <p className="text-sm text-text-muted">Loading events…</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-danger">
        Failed to load events. Try refreshing the page.
      </p>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <h2 className="text-xs sm:text-sm font-semibold text-text-strong">
          Logged PT & activity
        </h2>
        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value as ActivityType | "all")
          }
          className="rounded-lg sm:rounded-xl border border-border bg-input px-2 py-1 text-xs text-text shadow-sm transition-colors hover:border-border-subtle focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
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
        <p className="text-xs sm:text-sm text-text-muted">
          No events yet. Use the form on the left to log PT or other activities.
        </p>
      ) : (
        <div className="w-full max-w-full overflow-x-auto overflow-y-auto rounded-xl sm:rounded-2xl border border-border bg-card shadow-sm max-h-[500px] sm:max-h-[600px]">
          <table className="min-w-[600px] divide-y divide-divider text-xs sm:text-sm">
            <thead className="sticky top-0 bg-muted z-10">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Time
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Type
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Duration
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Intensity
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Notes
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {data.map((event, index) => {
                const date =
                  event.timestamp instanceof Timestamp
                    ? event.timestamp.toDate()
                    : new Date(event.timestamp as any);
                return (
                  <tr key={event.id} className={index % 2 === 0 ? "bg-card" : "bg-card-2"}>
                    <td className="whitespace-nowrap px-3 py-2 text-text">
                      {format(date, "MMM d, yyyy HH:mm")}
                    </td>
                    <td className="px-3 py-2 font-semibold text-text-strong">
                      {typeLabels[event.type]}
                    </td>
                    <td className="px-3 py-2 text-text">
                      {event.durationMinutes != null ? (
                        `${event.durationMinutes} min`
                      ) : (
                        <span className="text-text-disabled">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-text">
                      {event.intensity ?? <span className="text-text-disabled">—</span>}
                    </td>
                    <td className="px-3 py-2 text-text line-clamp-2">
                      {event.notes ?? <span className="text-text-disabled">—</span>}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-xs text-danger hover:opacity-80 transition-colors"
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


