import React from 'react';

const Bar = ({ className }: { className: string }) => (
  <div className={`gp-dash-skeleton rounded-xl ${className}`} />
);

/** In-shell skeleton shown while a dashboard page loads its data. */
const AnimatedLoading = () => (
  <div className="space-y-8" role="status" aria-label="Loading">
    <div className="space-y-3">
      <Bar className="h-3 w-24" />
      <Bar className="h-10 w-2/3 max-w-md" />
      <Bar className="h-4 w-1/2 max-w-sm" />
    </div>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <Bar key={i} className="h-28 rounded-2xl" />
      ))}
    </div>
    <div className="rounded-2xl border border-dash-line bg-white p-6">
      <div className="space-y-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Bar className="h-12 w-16 shrink-0" />
            <div className="flex-1 space-y-2">
              <Bar className="h-4 w-3/4" />
              <Bar className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
    <span className="sr-only">Loading…</span>
  </div>
);

export { AnimatedLoading };
