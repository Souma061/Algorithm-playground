import { useCallback, useState } from "react";
import { algorithmCodes, algorithmInfo } from "./algoritms/algorithmCodes";
import { bubbleSort } from "./algoritms/bubbleSort";
import { insertionSort } from "./algoritms/insertionSort";
import { mergeSort } from "./algoritms/mergeSort";
import { quickSort } from "./algoritms/quickSort";
import { selectionSort } from "./algoritms/selectionSort";
import type { SortingAlgorithm, VisualizerMode } from "./algoritms/types";
import { ArrayBoxes } from "./components/ArrayBoxes";
import { BarChart } from "./components/BarChart";
import { CodePanel } from "./components/CodePanel";
import { Controls } from "./components/Controls";
import { DryRunPanel } from "./components/DryRunPanel";
import { StepDescription } from "./components/StepDescription";
import { useSorting } from "./hooks/useSorting";

const ALGORITHMS: Record<string, SortingAlgorithm> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
};

function randomArray(size: number): number[] {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * 100) + 1,
  );
}

export default function App() {
  const [algorithm, setAlgorithm] = useState("bubble");
  const [arraySize, setArraySize] = useState(20);
  const [vizMode, setVizMode] = useState<VisualizerMode>("bars");

  const sortFn = ALGORITHMS[algorithm]!;
  const info = algorithmInfo[algorithm]!;
  const code = algorithmCodes[algorithm]!;

  const {
    currentFrame,
    currentStep,
    totalSteps,
    isPlaying,
    speed,
    setSpeed,
    generate,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
  } = useSorting(sortFn);

  const handleRandomize = useCallback(() => {
    generate(randomArray(arraySize));
  }, [arraySize, generate]);

  const handleAlgorithmChange = useCallback(
    (algo: string) => {
      setAlgorithm(algo);
      generate(randomArray(arraySize));
    },
    [arraySize, generate],
  );

  const handleArraySizeChange = useCallback(
    (size: number) => {
      setArraySize(size);
      generate(randomArray(size));
    },
    [generate],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4">
        {/* Header */}
        <header className="relative flex flex-col items-center justify-center text-center pb-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-10">
            <span className="mr-3 inline-block animate-bounce">⚡</span>
            Algorithm Playground
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium z-10">
            Interactive  Algorithm Visualizer
          </p>
        </header>

        {/* Algorithm Info Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/80 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700/50 backdrop-blur-xl">
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">
              Algorithm
            </span>
            <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
              {info.name}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">
              Time
            </span>
            <span className="text-base font-medium font-mono bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
              {info.timeComplexity}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">
              Space
            </span>
            <span className="text-base font-medium font-mono bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
              {info.spaceComplexity}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">
              Stable
            </span>
            <span className="text-base font-medium">
              {info.stable ? "✅ Yes" : "❌ No"}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex flex-col gap-6">
          {/* Controls */}
          <Controls
            isPlaying={isPlaying}
            speed={speed}
            currentStep={currentStep}
            totalSteps={totalSteps}
            arraySize={arraySize}
            algorithm={algorithm}
            vizMode={vizMode}
            onPlay={play}
            onPause={pause}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
            onReset={reset}
            onSpeedChange={setSpeed}
            onAlgorithmChange={handleAlgorithmChange}
            onArraySizeChange={handleArraySizeChange}
            onRandomize={handleRandomize}
            onVizModeChange={setVizMode}
          />

          {/* Visualizer Area */}
          <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700/50 min-h-[380px] flex flex-col overflow-hidden relative">
            {currentFrame ? (
              <div className="flex-1 flex flex-col justify-end relative h-full w-full">
                {vizMode === "bars" ? (
                  <BarChart bars={currentFrame.bars} />
                ) : (
                  <ArrayBoxes bars={currentFrame.bars} />
                )}
                <div className="mt-4 border-t border-slate-100 dark:border-slate-700 pt-4">
                  <StepDescription
                    description={currentFrame.description}
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-80 h-full">
                <div className="text-6xl mb-4 animate-pulse">🎲</div>
                <h2 className="text-2xl font-bold mb-2">Ready to Visualize</h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Select an algorithm and press{" "}
                  <strong className="text-indigo-500">Randomize</strong> to
                  generate an array
                </p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 py-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              <span className="text-sm font-medium">Default</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              <span className="text-sm font-medium">Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <span className="text-sm font-medium">Swapping</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-sm font-medium">Sorted</span>
            </div>
          </div>

          {/* Code + Dry Run Panels */}
          {currentFrame && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
              <CodePanel
                code={code}
                highlightedLine={currentFrame.dryRun?.highlightedLine ?? -1}
                algorithmName={info.name}
              />
              <DryRunPanel
                dryRun={currentFrame.dryRun}
                description={currentFrame.description}
                currentStep={currentStep}
                totalSteps={totalSteps}
              />
            </div>
          )}
        </main>



      </div>
    </div>
  );
}
