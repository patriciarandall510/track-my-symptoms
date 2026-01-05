"use client";

import { addDays, endOfDay, startOfDay, subDays } from "date-fns";
import { useState } from "react";

export type DateRangePreset = "7d" | "30d" | "90d" | "all";

export type DateRangeValue = {
  from?: Date;
  to?: Date;
  preset: DateRangePreset;
};

type Props = {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
};

export function DateRangePicker({ value, onChange }: Props) {
  const [fromInput, setFromInput] = useState(
    value.from?.toISOString().slice(0, 10) ?? "",
  );
  const [toInput, setToInput] = useState(
    value.to?.toISOString().slice(0, 10) ?? "",
  );

  const setPreset = (preset: DateRangePreset) => {
    const today = new Date();
    if (preset === "all") {
      onChange({ preset, from: undefined, to: undefined });
      return;
    }
    const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;
    const from = startOfDay(subDays(today, days - 1));
    const to = endOfDay(today);
    setFromInput(from.toISOString().slice(0, 10));
    setToInput(to.toISOString().slice(0, 10));
    onChange({ preset, from, to });
  };

  const updateFrom = (valueStr: string) => {
    setFromInput(valueStr);
    const date = valueStr ? startOfDay(new Date(valueStr)) : undefined;
    onChange({ ...value, from: date, preset: value.preset });
  };

  const updateTo = (valueStr: string) => {
    setToInput(valueStr);
    const date = valueStr ? endOfDay(addDays(new Date(valueStr), 0)) : undefined;
    onChange({ ...value, to: date, preset: value.preset });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex gap-1 rounded-full border bg-white p-0.5 text-xs">
        <button
          type="button"
          onClick={() => setPreset("7d")}
          className={`rounded-full px-2 py-1 ${
            value.preset === "7d"
              ? "bg-zinc-900 text-white"
              : "text-zinc-700 hover:bg-zinc-100"
          }`}
        >
          7 days
        </button>
        <button
          type="button"
          onClick={() => setPreset("30d")}
          className={`rounded-full px-2 py-1 ${
            value.preset === "30d"
              ? "bg-zinc-900 text-white"
              : "text-zinc-700 hover:bg-zinc-100"
          }`}
        >
          30 days
        </button>
        <button
          type="button"
          onClick={() => setPreset("90d")}
          className={`rounded-full px-2 py-1 ${
            value.preset === "90d"
              ? "bg-zinc-900 text-white"
              : "text-zinc-700 hover:bg-zinc-100"
          }`}
        >
          90 days
        </button>
        <button
          type="button"
          onClick={() => setPreset("all")}
          className={`rounded-full px-2 py-1 ${
            value.preset === "all"
              ? "bg-zinc-900 text-white"
              : "text-zinc-700 hover:bg-zinc-100"
          }`}
        >
          All time
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <label className="text-zinc-600">
          From{" "}
          <input
            type="date"
            value={fromInput}
            onChange={(e) => updateFrom(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-1.5 py-1 shadow-sm transition-colors hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          />
        </label>
        <label className="text-zinc-600">
          To{" "}
          <input
            type="date"
            value={toInput}
            onChange={(e) => updateTo(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-1.5 py-1 shadow-sm transition-colors hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          />
        </label>
      </div>
    </div>
  );
}


