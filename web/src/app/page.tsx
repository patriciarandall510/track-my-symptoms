"use client";

import { PainEntryForm } from "../components/PainEntryForm";
import { RecentPainTable } from "../components/RecentPainTable";
import { PainChart } from "../components/PainChart";

export default function HomePage() {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      <section>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-strong">
          Pain dashboard
        </h1>
        <p className="text-xs sm:text-sm text-text-muted">
          Quickly record how you feel, see recent entries, and view trends over
          time.
        </p>
      </section>

      <section className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.3fr)] w-full max-w-full">
        <PainEntryForm />
        <div className="space-y-1.5 sm:space-y-2 min-w-0 w-full max-w-full overflow-hidden">
          <h2 className="text-xs sm:text-sm font-semibold text-text-strong">
            Recent pain entries
          </h2>
          <RecentPainTable />
        </div>
      </section>

      <section>
        <PainChart />
      </section>
    </div>
  );
}


