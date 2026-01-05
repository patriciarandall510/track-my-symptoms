"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, startOfDay } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { usePainLogs } from "../lib/hooks/usePainLogs";
import { useEvents } from "../lib/hooks/useEvents";

type ChartPoint = {
  date: Date;
  avg: number;
  min: number;
  max: number;
  hasEvent: boolean;
  eventsSummary?: string;
};

function getDotColor(score: number): string {
  if (score <= 2) return "#10b981"; // green-500
  if (score <= 4) return "#3b82f6"; // blue-500
  if (score <= 7) return "#f59e0b"; // amber-500
  return "#ef4444"; // red-500
}

function PainTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as ChartPoint;
  return (
    <div className="rounded-md border bg-white px-3 py-2 text-xs shadow-sm">
      <div className="font-medium text-slate-900">
        {format(label as Date, "MMM d, yyyy")}
      </div>
      <div className="mt-1 space-y-0.5 text-sm text-slate-700">
        <div>Average: {point.avg.toFixed(1)}</div>
        <div>
          Range: {point.min} – {point.max}
        </div>
        {point.eventsSummary && (
          <div className="text-slate-500">
            Events: {point.eventsSummary}
          </div>
        )}
      </div>
    </div>
  );
}

export function PainChart() {
  const { data: painLogs, loading: painLoading } = usePainLogs();
  const { data: events, loading: eventsLoading } = useEvents({
    type: "all",
  });

  if (painLoading || eventsLoading) {
    return <p className="text-sm text-slate-500">Loading chart…</p>;
  }

  if (!painLogs.length) {
    return (
      <p className="text-sm text-slate-500">
        No pain entries yet. Once you log a few, you&apos;ll see them here.
      </p>
    );
  }

  // Build a set of days that have any PT/activity events
  const eventDays = new Map<
    string,
    { hasEvent: boolean; eventsSummary?: string }
  >();
  events.forEach((ev) => {
    const rawDate =
      ev.timestamp instanceof Timestamp
        ? ev.timestamp.toDate()
        : new Date(ev.timestamp as any);
    const day = startOfDay(rawDate);
    const key = day.toISOString().slice(0, 10);
    const prev = eventDays.get(key);
    const summaryPart = ev.type;
    const combined = prev?.eventsSummary
      ? `${prev.eventsSummary}, ${summaryPart}`
      : summaryPart;
    eventDays.set(key, { hasEvent: true, eventsSummary: combined });
  });

  // Aggregate pain logs per day (avg / min / max)
  const byDay = new Map<
    string,
    { date: Date; sum: number; min: number; max: number; count: number }
  >();

  painLogs.forEach((log) => {
    const rawDate =
      log.timestamp instanceof Timestamp
        ? log.timestamp.toDate()
        : new Date(log.timestamp as any);
    const day = startOfDay(rawDate);
    const key = day.toISOString().slice(0, 10);
    const existing = byDay.get(key);
    if (!existing) {
      byDay.set(key, {
        date: day,
        sum: log.painScore,
        min: log.painScore,
        max: log.painScore,
        count: 1,
      });
    } else {
      existing.sum += log.painScore;
      existing.count += 1;
      existing.min = Math.min(existing.min, log.painScore);
      existing.max = Math.max(existing.max, log.painScore);
    }
  });

  const points: ChartPoint[] = Array.from(byDay.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((entry) => {
      const key = entry.date.toISOString().slice(0, 10);
      const eventInfo = eventDays.get(key);
      return {
        date: entry.date,
        avg: entry.sum / entry.count,
        min: entry.min,
        max: entry.max,
        hasEvent: eventInfo?.hasEvent ?? false,
        eventsSummary: eventInfo?.eventsSummary,
      };
    });

  return (
    <div className="space-y-2 sm:space-y-3 rounded-xl sm:rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-white dark:bg-slate-800 p-3 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Pain over time
          </h2>
          <p className="text-sm text-slate-500">
            Each point shows the average pain for a day; dots indicate days with
            PT or activity.
          </p>
        </div>
      </div>
      <div className="h-48 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={points}
            margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value: Date) => format(value, "MMM d")}
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 10]}
              tickCount={6}
              tick={{ fontSize: 10 }}
              width={30}
              label={{
                value: "Pain",
                angle: -90,
                position: "insideLeft",
                offset: 5,
                style: { fontSize: 10 },
              }}
            />
            <Tooltip content={<PainTooltip />} />
            <Line
              type="monotone"
              dataKey="avg"
              name="Average pain"
              stroke="#2563eb"
              strokeWidth={2}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                const color = getDotColor(payload.avg);
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={3}
                    fill={color}
                    stroke="white"
                    strokeWidth={1}
                  />
                );
              }}
              activeDot={{ r: 5 }}
            />
            {points.map(
              (point, index) =>
                point.hasEvent && (
                  <ReferenceDot
                    key={index}
                    x={point.date.getTime()}
                    y={point.avg}
                    r={4}
                    fill="#22c55e"
                    stroke="none"
                    ifOverflow="discard"
                  />
                ),
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


