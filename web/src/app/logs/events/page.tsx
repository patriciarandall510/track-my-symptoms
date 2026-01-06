"use client";

import { EventEntryForm } from "../../../components/EventEntryForm";
import { EventsTable } from "../../../components/EventsTable";

export default function EventsPage() {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      <section>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-strong">
          PT & activity log
        </h1>
        <p className="text-xs sm:text-sm text-text-muted">
          Track when you complete physical therapy sessions, runs, long drives,
          and other events that might affect your symptoms.
        </p>
      </section>

      <section className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.1fr)] w-full max-w-full">
        <EventEntryForm />
        <div className="min-w-0 w-full max-w-full overflow-hidden">
          <EventsTable />
        </div>
      </section>
    </div>
  );
}


