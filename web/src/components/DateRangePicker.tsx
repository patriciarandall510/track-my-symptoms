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
      <div className="flex gap-1 rounded-full border border-border bg-card p-0.5 text-xs">
        <button
          type="button"
          onClick={() => setPreset("7d")}
          className={`rounded-full px-2 py-1 transition-colors ${
            value.preset === "7d"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-muted"
          }`}
        >
          7 days
        </button>
        <button
          type="button"
          onClick={() => setPreset("30d")}
          className={`rounded-full px-2 py-1 transition-colors ${
            value.preset === "30d"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-muted"
          }`}
        >
          30 days
        </button>
        <button
          type="button"
          onClick={() => setPreset("90d")}
          className={`rounded-full px-2 py-1 transition-colors ${
            value.preset === "90d"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-muted"
          }`}
        >
          90 days
        </button>
        <button
          type="button"
          onClick={() => setPreset("all")}
          className={`rounded-full px-2 py-1 transition-colors ${
            value.preset === "all"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-muted"
          }`}
        >
          All time
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <label className="text-text-secondary">
          From{" "}
          <input
            type="date"
            value={fromInput}
            onChange={(e) => updateFrom(e.target.value)}
            className="rounded-xl border border-border bg-input text-text px-1.5 py-1 shadow-sm transition-colors hover:border-border-subtle focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
          />
        </label>
        <label className="text-text-secondary">
          To{" "}
          <input
            type="date"
            value={toInput}
            onChange={(e) => updateTo(e.target.value)}
            className="rounded-xl border border-border bg-input text-text px-1.5 py-1 shadow-sm transition-colors hover:border-border-subtle focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
          />
        </label>
      </div>
    </div>
  );
}


