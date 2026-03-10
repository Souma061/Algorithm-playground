import { useCallback, useState } from "react";
import { algorithmInfo } from "../algoritms/algorithmCodes";
import { bubbleSort } from "../algoritms/bubbleSort";
import { insertionSort } from "../algoritms/insertionSort";
import { mergeSort } from "../algoritms/mergeSort";
import { quickSort } from "../algoritms/quickSort";
import { selectionSort } from "../algoritms/selectionSort";
import type { SortingAlgorithm } from "../algoritms/types";
import type { RaceLane } from "../hooks/useRace";
import { useRace } from "../hooks/useRace";

const ALGORITHMS: Record<
  string,
  {
    fn: SortingAlgorithm;
    label: string;
    icon: string;
    color: string;
    glow: string;
    bg: string;
  }
> = {
  bubble: {
    fn: bubbleSort,
    label: "Bubble Sort",
    icon: "🫧",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.4)",
    bg: "from-indigo-500 to-indigo-600",
  },
  selection: {
    fn: selectionSort,
    label: "Selection Sort",
    icon: "👆",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.4)",
    bg: "from-violet-500 to-violet-600",
  },
  insertion: {
    fn: insertionSort,
    label: "Insertion Sort",
    icon: "📥",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.4)",
    bg: "from-pink-500 to-pink-600",
  },
  merge: {
    fn: mergeSort,
    label: "Merge Sort",
    icon: "🔀",
    color: "#14b8a6",
    glow: "rgba(20,184,166,0.4)",
    bg: "from-teal-500 to-teal-600",
  },
  quick: {
    fn: quickSort,
    label: "Quick Sort",
    icon: "⚡",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.4)",
    bg: "from-amber-500 to-amber-600",
  },
};



function randomArray(size: number) {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * 100) + 1,
  );
}

interface MiniBarsProps {
  lane: RaceLane;
  isWinner: boolean;
  isLoser: boolean;
}

function MiniBars({ lane, isWinner, isLoser }: MiniBarsProps) {
  const frame = lane.steps[lane.currentStep];
  if (!frame) return null;
  const bars = frame.bars;
  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: bars.length > 40 ? "1px" : bars.length > 20 ? "2px" : "3px",
        height: "220px",
        padding: "20px 12px 0",
        transition: "opacity 0.3s",
        opacity: isLoser ? 0.5 : 1,
      }}
    >
      {bars.map((bar, i) => {
        const color =
          bar.state === "default"
            ? isWinner
              ? "linear-gradient(180deg, #4ade80 0%, #22c55e 100%)"
              : "linear-gradient(180deg, #818cf8 0%, #6366f1 100%)"
            : bar.state === "comparing"
              ? "linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)"
              : bar.state === "swapping"
                ? "linear-gradient(180deg, #f87171 0%, #ef4444 100%)"
                : "linear-gradient(180deg, #4ade80 0%, #22c55e 100%)";

        return (
          <div
            key={i}
            title={`${bar.value}`}
            style={{
              flex: 1,
              height: `${(bar.value / max) * 100}%`,
              background: color,
              borderRadius: "3px 3px 0 0",
              transition:
                "height 0.12s cubic-bezier(0.4,0,0.2,1), background 0.12s ease",
              minWidth: "2px",
            }}
          />
        );
      })}
    </div>
  );
}

interface LaneCardProps {
  lane: RaceLane;
  algoKey: string;
  isWinner: boolean;
  isLoser: boolean;
  otherFinished: boolean;
}

function LaneCard({ lane, algoKey, isWinner, isLoser }: LaneCardProps) {
  const algo = ALGORITHMS[algoKey]!;
  const info = algorithmInfo[algoKey]!;
  const frame = lane.steps[lane.currentStep] ?? null;
  const progress =
    lane.steps.length > 0
      ? (lane.currentStep / (lane.steps.length - 1)) * 100
      : 0;

  return (
    <div
      className="flex-1 flex flex-col rounded-2xl overflow-hidden border transition-all duration-300"
      style={{
        borderColor: isWinner
          ? "#22c55e"
          : isLoser
            ? "rgba(100,116,139,0.3)"
            : algo.color + "50",
        boxShadow: isWinner
          ? "0 0 32px rgba(34,197,94,0.25), 0 8px 32px rgba(0,0,0,0.12)"
          : "0 4px 24px rgba(0,0,0,0.08)",
        background: "var(--lane-bg)",
      }}
    >
      {/* Header */}
      <div
        className={`px-5 py-3.5 flex items-center justify-between bg-gradient-to-r ${algo.bg} text-white`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{algo.icon}</span>
          <div>
            <div className="font-bold text-base leading-tight">
              {algo.label}
            </div>
            <div className="text-xs opacity-75 font-mono">
              {info.timeComplexity} · {info.spaceComplexity}
            </div>
          </div>
        </div>
        {isWinner && (
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-sm font-bold animate-bounce">
            🏆 Winner!
          </div>
        )}
        {isLoser && (
          <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium opacity-80">
            Finished
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex divide-x divide-slate-100 dark:divide-slate-700/50 bg-white dark:bg-slate-800/80">
        <div className="flex-1 px-4 py-2.5 text-center">
          <div className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-0.5">
            Comparisons
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-amber-500">
            {frame?.comparisons.toLocaleString() ?? "—"}
          </div>
        </div>
        <div className="flex-1 px-4 py-2.5 text-center">
          <div className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-0.5">
            Swaps
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-rose-500">
            {frame?.swaps.toLocaleString() ?? "—"}
          </div>
        </div>
        <div className="flex-1 px-4 py-2.5 text-center">
          <div className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-0.5">
            Steps
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-indigo-500 dark:text-indigo-400">
            {lane.currentStep + 1}
            <span className="text-xs font-normal text-slate-400">
              {" "}
              / {lane.steps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-100 dark:bg-slate-700/50">
        <div
          className="h-full transition-all duration-200 rounded-full"
          style={{
            width: `${progress}%`,
            background: isWinner
              ? "linear-gradient(90deg, #22c55e, #4ade80)"
              : `linear-gradient(90deg, ${algo.color}, ${algo.color}cc)`,
          }}
        />
      </div>

      {/* Bars */}
      <div className="flex-1 bg-white dark:bg-slate-800 relative">
        <MiniBars
          lane={lane}
          isWinner={isWinner}
          isLoser={isLoser}
        />
        {/* Step description */}
        {frame && (
          <div className="px-4 pb-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
              {frame.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function RaceView() {
  const [algoKeyA, setAlgoKeyA] = useState("bubble");
  const [algoKeyB, setAlgoKeyB] = useState("quick");
  const [arraySize, setArraySize] = useState(30);
  const [hasStarted, setHasStarted] = useState(false);

  const {
    lanes,
    isPlaying,
    speed,
    setSpeed,
    isAllFinished,
    generate,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
  } = useRace();

  const handleGenerate = useCallback(() => {
    const arr = randomArray(arraySize);
    generate(
      arr,
      algoKeyA,
      ALGORITHMS[algoKeyA]!.fn,
      algoKeyB,
      ALGORITHMS[algoKeyB]!.fn,
    );
    setHasStarted(true);
  }, [algoKeyA, algoKeyB, arraySize, generate]);

  // Determine winner (who finished in fewer steps)
  let winnerIdx: number | null = null;
  if (lanes && isAllFinished) {
    const stepsA = lanes[0].steps.length;
    const stepsB = lanes[1].steps.length;
    if (stepsA < stepsB) winnerIdx = 0;
    else if (stepsB < stepsA) winnerIdx = 1;
    // else tie
  }

  // If one lane is done but the other isn't yet
  const aFinished = lanes
    ? lanes[0].currentStep >= lanes[0].steps.length - 1
    : false;
  const bFinished = lanes
    ? lanes[1].currentStep >= lanes[1].steps.length - 1
    : false;

  return (
    <div className="flex flex-col gap-5">
      {/* Race Setup Panel */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700/50">
        <div className="flex flex-col gap-5">
          {/* Algorithm pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Lane A */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-indigo-500">
                🔵 Lane A
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ALGORITHMS).map(([key, a]) => (
                  <button
                    key={key}
                    onClick={() => setAlgoKeyA(key)}
                    disabled={key === algoKeyB}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                      algoKeyA === key
                        ? "text-white scale-105 shadow-md"
                        : key === algoKeyB
                          ? "opacity-30 cursor-not-allowed bg-slate-100 dark:bg-slate-700/50 text-slate-400"
                          : "bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:scale-105 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                    style={
                      algoKeyA === key
                        ? {
                            background: `linear-gradient(135deg, ${a.color}, ${a.color}cc)`,
                          }
                        : {}
                    }
                  >
                    <span>{a.icon}</span>
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lane B */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-rose-500">
                🔴 Lane B
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ALGORITHMS).map(([key, a]) => (
                  <button
                    key={key}
                    onClick={() => setAlgoKeyB(key)}
                    disabled={key === algoKeyA}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                      algoKeyB === key
                        ? "text-white scale-105 shadow-md"
                        : key === algoKeyA
                          ? "opacity-30 cursor-not-allowed bg-slate-100 dark:bg-slate-700/50 text-slate-400"
                          : "bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:scale-105 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                    style={
                      algoKeyB === key
                        ? {
                            background: `linear-gradient(135deg, ${a.color}, ${a.color}cc)`,
                          }
                        : {}
                    }
                  >
                    <span>{a.icon}</span>
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Array size + Speed + Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex flex-col gap-1.5 flex-1 w-full">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex justify-between">
                <span>Array Size</span>
                <span className="text-indigo-500">{arraySize}</span>
              </label>
              <input
                type="range"
                min={8}
                max={60}
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                className="w-full h-2 rounded-lg accent-indigo-500 bg-slate-200 dark:bg-slate-700 cursor-pointer appearance-none"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 w-full">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex justify-between">
                <span>Speed</span>
                <span className="text-indigo-500">{speed}ms</span>
              </label>
              <input
                type="range"
                min={30}
                max={800}
                step={10}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-2 rounded-lg accent-indigo-500 bg-slate-200 dark:bg-slate-700 cursor-pointer appearance-none"
              />
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-700/50" />

          {/* Playback Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleGenerate}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-xl">🎲</span> New Race
            </button>

            <div className="flex items-center gap-2">
              {/* Reset */}
              <button
                className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                onClick={reset}
                disabled={!lanes}
                title="Reset"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Step back */}
              <button
                className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                onClick={stepBackward}
                disabled={
                  !lanes ||
                  (lanes[0].currentStep === 0 && lanes[1].currentStep === 0)
                }
                title="Step Back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              {/* Play/Pause */}
              {isPlaying ? (
                <button
                  className="w-14 h-14 rounded-full text-white shadow-lg hover:scale-105 transition-all flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #ef4444, #f97316)",
                    boxShadow: "0 8px 24px rgba(239,68,68,0.4)",
                  }}
                  onClick={pause}
                  title="Pause"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                </button>
              ) : (
                <button
                  className="w-14 h-14 rounded-full text-white shadow-lg hover:scale-105 transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 pl-1"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
                  }}
                  onClick={play}
                  disabled={!lanes || isAllFinished}
                  title="Play Race"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>
              )}

              {/* Step forward */}
              <button
                className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                onClick={stepForward}
                disabled={!lanes || isAllFinished}
                title="Step Forward"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>

            <div className="text-sm font-mono text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-4 py-2 rounded-xl">
              {isAllFinished
                ? "🏁 Race Complete!"
                : hasStarted && lanes
                  ? "Racing..."
                  : "Ready to Race"}
            </div>
          </div>
        </div>
      </div>

      {/* Winner Banner */}
      {isAllFinished && lanes && (
        <div
          className="rounded-2xl px-6 py-4 text-center text-white font-bold text-lg shadow-xl animate-in fade-in zoom-in-95 duration-500"
          style={{
            background:
              winnerIdx !== null
                ? `linear-gradient(135deg, ${ALGORITHMS[lanes[winnerIdx].algorithmKey]!.color}, ${ALGORITHMS[lanes[winnerIdx].algorithmKey]!.color}aa)`
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow:
              winnerIdx !== null
                ? `0 8px 32px ${ALGORITHMS[lanes[winnerIdx].algorithmKey]!.glow}`
                : "0 8px 32px rgba(99,102,241,0.3)",
          }}
        >
          {winnerIdx !== null ? (
            <>
              🏆 {ALGORITHMS[lanes[winnerIdx].algorithmKey]!.icon}{" "}
              {ALGORITHMS[lanes[winnerIdx].algorithmKey]!.label} wins with{" "}
              {lanes[winnerIdx].steps.length.toLocaleString()} steps vs{" "}
              {lanes[1 - winnerIdx].steps.length.toLocaleString()} steps!
            </>
          ) : (
            <>
              🤝 It's a tie! Both algorithms took{" "}
              {lanes[0].steps.length.toLocaleString()} steps!
            </>
          )}
        </div>
      )}

      {/* Race Lanes */}
      {lanes ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LaneCard
            lane={lanes[0]}
            algoKey={lanes[0].algorithmKey}
            isWinner={isAllFinished && winnerIdx === 0}
            isLoser={isAllFinished && winnerIdx === 1}
            otherFinished={bFinished}
          />
          <LaneCard
            lane={lanes[1]}
            algoKey={lanes[1].algorithmKey}
            isWinner={isAllFinished && winnerIdx === 1}
            isLoser={isAllFinished && winnerIdx === 0}
            otherFinished={aFinished}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 text-center">
          <div className="text-6xl mb-4">🏁</div>
          <h2 className="text-2xl font-bold mb-2">Pick Your Contestants</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm">
            Select two algorithms above, then click{" "}
            <strong className="text-indigo-500">New Race</strong> to generate an
            array and start the race!
          </p>
        </div>
      )}
    </div>
  );
}
