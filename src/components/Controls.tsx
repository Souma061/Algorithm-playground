import { useState } from "react";
import type { VisualizerMode } from "../algoritms/types";

interface ControlsProps {
  isPlaying: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
  arraySize: number;
  algorithm: string;
  vizMode: VisualizerMode;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onAlgorithmChange: (algo: string) => void;
  onArraySizeChange: (size: number) => void;
  onRandomize: () => void;
  onVizModeChange: (mode: VisualizerMode) => void;
  onCustomArray: (arr: number[]) => void;
}

const ALGORITHM_OPTIONS = [
  { value: "bubble", label: "Bubble Sort", icon: "🫧" },
  { value: "selection", label: "Selection Sort", icon: "👆" },
  { value: "insertion", label: "Insertion Sort", icon: "📥" },
  { value: "merge", label: "Merge Sort", icon: "🔀" },
  { value: "quick", label: "Quick Sort", icon: "⚡" },
];

export function Controls({
  isPlaying,
  speed,
  currentStep,
  totalSteps,
  arraySize,
  algorithm,
  vizMode,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  onAlgorithmChange,
  onArraySizeChange,
  onRandomize,
  onVizModeChange,
  onCustomArray,
}: ControlsProps) {
  const [customInput, setCustomInput] = useState("");
  const [inputError, setInputError] = useState("");

  function handleCustomApply() {
    const parts = customInput
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const nums = parts.map(Number);
    if (parts.length === 0) {
      setInputError("Please enter at least one number.");
      return;
    }
    if (nums.some(isNaN) || nums.some((n) => n < 1 || n > 999)) {
      setInputError("Only numbers between 1–999 allowed.");
      return;
    }
    if (nums.length > 80) {
      setInputError("Maximum 80 elements.");
      return;
    }
    setInputError("");
    onCustomArray(nums);
  }
  return (
    <div className="flex flex-col gap-6 p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700/50 w-full animate-in fade-in zoom-in-95 duration-500">
      {/* Algorithm Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Algorithm
        </label>
        <div className="flex flex-wrap gap-2">
          {ALGORITHM_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                algorithm === opt.value
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-105"
                  : "bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105"
              }`}
              onClick={() => onAlgorithmChange(opt.value)}
            >
              <span className="text-xl">{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Array Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Custom Array
        </label>
        <div className="flex gap-2 items-start">
          <div className="flex-1 flex flex-col gap-1">
            <input
              type="text"
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value);
                setInputError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleCustomApply()}
              placeholder="e.g.  5, 3, 8, 1, 9, 2"
              className={`w-full px-4 py-2.5 rounded-xl font-mono text-sm bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 border-2 outline-none transition-colors placeholder:text-slate-400 ${
                inputError
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-transparent focus:border-indigo-400"
              }`}
            />
            {inputError && (
              <p className="text-xs text-rose-500 font-medium px-1">
                {inputError}
              </p>
            )}
          </div>
          <button
            onClick={handleCustomApply}
            className="px-5 py-2.5 rounded-xl font-semibold bg-indigo-500 text-white hover:bg-indigo-400 active:scale-95 transition-all shadow-md shadow-indigo-500/30 whitespace-nowrap"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Visualizer mode */}
        <div className="flex flex-col gap-2 shrink-0">
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            View
          </label>
          <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl">
            <button
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${vizMode === "bars" ? "bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
              onClick={() => onVizModeChange("bars")}
            >
              📊 Bars
            </button>
            <button
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${vizMode === "boxes" ? "bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
              onClick={() => onVizModeChange("boxes")}
            >
              🔲 Boxes
            </button>
          </div>
        </div>

        {/* Array Size Slider */}
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex justify-between">
            <span>Array Size</span>
            <span className="text-indigo-500 dark:text-indigo-400">
              {arraySize}
            </span>
          </label>
          <div className="h-10 flex items-center">
            <input
              type="range"
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              min={5}
              max={vizMode === "boxes" ? 30 : 80}
              value={arraySize}
              onChange={(e) => onArraySizeChange(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Speed Slider */}
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex justify-between">
            <span>Speed</span>
            <span className="text-indigo-500 dark:text-indigo-400">
              {speed}ms
            </span>
          </label>
          <div className="h-10 flex items-center">
            <input
              type="range"
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              min={30}
              max={1000}
              step={10}
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-slate-100 dark:bg-slate-700/50 my-2" />

      {/* Playback controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors flex items-center justify-center gap-2"
          onClick={onRandomize}
        >
          <span className="text-xl">🎲</span> Randomize
        </button>

        <div className="flex items-center gap-2">
          <button
            className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={onReset}
            disabled={currentStep === 0}
            title="Reset"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
          <button
            className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={onStepBackward}
            disabled={currentStep === 0}
            title="Previous Step"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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

          {isPlaying ? (
            <button
              className="w-16 h-16 flex items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/40 hover:scale-105 transition-all"
              onClick={onPause}
              title="Pause"
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
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            </button>
          ) : (
            <button
              className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 hover:scale-105 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all ml-1 pl-1"
              onClick={onPlay}
              disabled={totalSteps === 0 || currentStep >= totalSteps - 1}
              title="Play"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
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

          <button
            className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={onStepForward}
            disabled={currentStep >= totalSteps - 1}
            title="Next Step"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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

        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-700/50 px-4 py-2 rounded-xl">
          {totalSteps > 0 ? `${currentStep + 1} / ${totalSteps}` : "—"}
        </div>
      </div>
    </div>
  );
}
