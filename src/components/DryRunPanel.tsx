import type { DryRunState } from "../algoritms/types";

interface DryRunPanelProps {
  dryRun: DryRunState | undefined;
  description: string;
  currentStep: number;
  totalSteps: number;
}

export function DryRunPanel({
  dryRun,
  description,
  currentStep,
  totalSteps,
}: DryRunPanelProps) {
  const variables = dryRun?.variables ?? {};
  const entries = Object.entries(variables);

  return (
    <div className="flex flex-col bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700/50 h-[360px] lg:h-auto overflow-hidden flex-1 relative flex text-left">
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
          <span className="text-xl">🔍</span>
          <span>Dry Run Tracker</span>
        </div>
        <div className="text-xs font-bold font-mono tracking-wider bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full">
          Step {currentStep + 1} / {totalSteps}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Description */}
        <div className="flex flex-col gap-2 relative">
          <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
            What's happening
          </div>
          <div className="text-lg font-medium text-slate-800 dark:text-slate-200 leading-snug">
            {description}
          </div>
        </div>

        {/* Variables */}
        {entries.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Variables
            </div>
            <div className="grid grid-cols-2 gap-3">
              {entries.map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl p-3 shadow-sm"
                >
                  <span className="font-mono text-sm font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-sm border border-slate-100 dark:border-slate-700">
                    {key}
                  </span>
                  <span className="text-slate-400 font-mono text-xs">=</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 truncate text-right flex-1">
                    {Array.isArray(value) ? `[${value.join(", ")}]` : value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 w-full mt-auto">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
          style={{
            width: `${totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0}%`,
          }}
        />
      </div>
    </div>
  );
}
