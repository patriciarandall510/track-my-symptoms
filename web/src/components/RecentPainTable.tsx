"use client";

import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { usePainLogs } from "../lib/hooks/usePainLogs";

function getPainBadgeClasses(score: number): string {
  if (score <= 2) return "border-green-500 text-green-700 bg-success-soft dark:border-green-400 dark:text-green-300";
  if (score <= 4) return "border-blue-500 text-blue-700 bg-primary-soft dark:border-blue-400 dark:text-blue-300";
  if (score <= 7) return "border-amber-500 text-amber-700 bg-warning-soft dark:border-amber-400 dark:text-amber-300";
  return "border-red-500 text-red-700 bg-danger-soft dark:border-red-400 dark:text-red-300";
}

export function RecentPainTable() {
  const { data, loading, error, deletePainLog } = usePainLogs({ limit: 10 });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this pain entry?")) {
      try {
        await deletePainLog(id);
      } catch (err) {
        console.error("Failed to delete pain log:", err);
        alert("Failed to delete entry. Please try again.");
      }
    }
  };

  if (loading) {
    return <p className="text-sm text-text-muted">Loading recent entries…</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-danger">
        Failed to load pain logs. Try refreshing the page.
      </p>
    );
  }

  if (!data.length) {
    return (
      <p className="text-sm text-text-muted">
        No entries yet. Use the form above to record how you feel.
      </p>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-auto overflow-y-auto rounded-xl sm:rounded-2xl border border-border bg-card shadow-sm max-h-[280px] sm:max-h-[320px]">
      <table className="min-w-[600px] divide-y divide-divider text-xs sm:text-sm">
        <thead className="sticky top-0 bg-muted z-10">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Time
            </th>
            <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Pain
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Location
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Quality
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
          {data.map((log, index) => {
            const date =
              log.timestamp instanceof Timestamp
                ? log.timestamp.toDate()
                : new Date(log.timestamp as any);
            return (
              <tr key={log.id} className={index % 2 === 0 ? "bg-card" : "bg-card-2"}>
                <td className="whitespace-nowrap px-3 py-2 text-sm text-text">
                  {format(date, "MMM d, yyyy HH:mm")}
                </td>
                <td className="px-3 py-2 text-right">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold tabular-nums ${getPainBadgeClasses(log.painScore)}`}>
                    {log.painScore}
                  </span>
                </td>
                <td className="px-3 py-2 text-sm text-text">
                  {log.location ?? <span className="text-text-disabled">—</span>}
                </td>
                <td className="px-3 py-2 text-sm text-text">
                  {log.quality ?? <span className="text-text-disabled">—</span>}
                </td>
                <td className="px-3 py-2 text-sm text-text line-clamp-2">
                  {log.notes ?? <span className="text-text-disabled">—</span>}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="text-xs text-danger hover:opacity-80 transition-colors"
                    aria-label="Delete entry"
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
  );
}


