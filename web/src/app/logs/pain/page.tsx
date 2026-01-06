"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { usePainLogs } from "../../../lib/hooks/usePainLogs";
import { DateRangePicker, type DateRangeValue } from "../../../components/DateRangePicker";

function getPainBadgeClasses(score: number): string {
  if (score <= 2) return "border-green-500 text-green-700 bg-success-soft dark:border-green-400 dark:text-green-300";
  if (score <= 4) return "border-blue-500 text-blue-700 bg-primary-soft dark:border-blue-400 dark:text-blue-300";
  if (score <= 7) return "border-amber-500 text-amber-700 bg-warning-soft dark:border-amber-400 dark:text-amber-300";
  return "border-red-500 text-red-700 bg-danger-soft dark:border-red-400 dark:text-red-300";
}

export default function PainLogsPage() {
  const [range, setRange] = useState<DateRangeValue>({
    preset: "30d",
  });
  const { data, loading, error, deletePainLog } = usePainLogs({
    from: range.from,
    to: range.to,
  });

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

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      <section className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-strong">Pain history</h1>
          <p className="text-xs sm:text-sm text-text-muted">
            Explore your pain entries over time and filter by date range.
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </section>

      <section className="space-y-3 w-full max-w-full overflow-hidden">
        {loading && (
          <p className="text-sm text-text-muted">Loading pain logs…</p>
        )}
        {error && (
          <p className="text-sm text-danger">
            Failed to load pain logs. Try refreshing the page.
          </p>
        )}
        {!loading && !error && data.length === 0 && (
          <p className="text-sm text-text-muted">
            No entries for this range yet.
          </p>
        )}
        {!loading && !error && data.length > 0 && (
          <div className="w-full max-w-full overflow-x-auto overflow-y-auto rounded-xl sm:rounded-2xl border border-border bg-card shadow-sm max-h-[500px] sm:max-h-[600px]">
            <table className="min-w-[700px] divide-y divide-divider text-xs sm:text-sm">
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
                      <td className="px-3 py-2 text-sm text-text">
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
        )}
      </section>
    </div>
  );
}


