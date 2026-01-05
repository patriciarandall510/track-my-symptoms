"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { usePainLogs } from "../../../lib/hooks/usePainLogs";
import { DateRangePicker, type DateRangeValue } from "../../../components/DateRangePicker";

function getPainBadgeClasses(score: number): string {
  if (score <= 2) return "border-green-500 text-green-700 bg-green-50";
  if (score <= 4) return "border-blue-500 text-blue-700 bg-blue-50";
  if (score <= 7) return "border-amber-500 text-amber-700 bg-amber-50";
  return "border-red-500 text-red-700 bg-red-50";
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
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Pain history</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Explore your pain entries over time and filter by date range.
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </section>

      <section className="space-y-3 w-full max-w-full overflow-hidden">
        {loading && (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading pain logs…</p>
        )}
        {error && (
          <p className="text-sm text-red-600">
            Failed to load pain logs. Try refreshing the page.
          </p>
        )}
        {!loading && !error && data.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No entries for this range yet.
          </p>
        )}
        {!loading && !error && data.length > 0 && (
          <div className="w-full max-w-full overflow-x-auto overflow-y-auto rounded-xl sm:rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-white dark:bg-slate-800 shadow-sm max-h-[500px] sm:max-h-[600px]">
            <table className="min-w-[700px] divide-y divide-slate-100 dark:divide-slate-700 text-xs sm:text-sm">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 z-10">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    Time
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    Pain
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    Location
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    Quality
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    Notes
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((log, index) => {
                  const date =
                    log.timestamp instanceof Timestamp
                      ? log.timestamp.toDate()
                      : new Date(log.timestamp as any);
                  return (
                    <tr key={log.id} className={index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50/40 dark:bg-slate-700/40"}>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-slate-700 dark:text-slate-300">
                        {format(date, "MMM d, yyyy HH:mm")}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold tabular-nums ${getPainBadgeClasses(log.painScore)}`}>
                          {log.painScore}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300">
                        {log.location ?? <span className="text-slate-300 dark:text-slate-600">—</span>}
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300">
                        {log.quality ?? <span className="text-slate-300 dark:text-slate-600">—</span>}
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300">
                        {log.notes ?? <span className="text-slate-300 dark:text-slate-600">—</span>}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
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


