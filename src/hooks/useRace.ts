import { useCallback, useRef, useState } from "react";
import type { SortStep, SortingAlgorithm } from "../algoritms/types";

export interface RaceLane {
  algorithmKey: string;
  steps: SortStep[];
  currentStep: number;
  isFinished: boolean;
}

export function useRace() {
  const [lanes, setLanes] = useState<[RaceLane, RaceLane] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(200);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generate = useCallback(
    (
      arr: number[],
      algoKeyA: string,
      algoA: SortingAlgorithm,
      algoKeyB: string,
      algoB: SortingAlgorithm
    ) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      const stepsA = algoA([...arr]);
      const stepsB = algoB([...arr]);
      setLanes([
        { algorithmKey: algoKeyA, steps: stepsA, currentStep: 0, isFinished: false },
        { algorithmKey: algoKeyB, steps: stepsB, currentStep: 0, isFinished: false },
      ]);
      setIsPlaying(false);
    },
    []
  );

  const play = useCallback(() => {
    if (!lanes) return;
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setLanes((prev) => {
        if (!prev) return prev;
        let anyProgress = false;
        const next = prev.map((lane) => {
          if (lane.currentStep >= lane.steps.length - 1) {
            return { ...lane, isFinished: true };
          }
          anyProgress = true;
          return { ...lane, currentStep: lane.currentStep + 1 };
        }) as [RaceLane, RaceLane];

        if (!anyProgress) {
          clearInterval(intervalRef.current!);
          setIsPlaying(false);
        }
        return next;
      });
    }, speed);
  }, [lanes, speed]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setLanes((prev) => {
      if (!prev) return prev;
      return prev.map((lane) => ({ ...lane, currentStep: 0, isFinished: false })) as [
        RaceLane,
        RaceLane
      ];
    });
  }, []);

  const stepForward = useCallback(() => {
    setLanes((prev) => {
      if (!prev) return prev;
      return prev.map((lane) => ({
        ...lane,
        currentStep: Math.min(lane.currentStep + 1, lane.steps.length - 1),
        isFinished: lane.currentStep + 1 >= lane.steps.length - 1,
      })) as [RaceLane, RaceLane];
    });
  }, []);

  const stepBackward = useCallback(() => {
    setLanes((prev) => {
      if (!prev) return prev;
      return prev.map((lane) => ({
        ...lane,
        currentStep: Math.max(lane.currentStep - 1, 0),
        isFinished: false,
      })) as [RaceLane, RaceLane];
    });
  }, []);

  const currentFrameA = lanes ? (lanes[0].steps[lanes[0].currentStep] ?? null) : null;
  const currentFrameB = lanes ? (lanes[1].steps[lanes[1].currentStep] ?? null) : null;

  const isAllFinished = lanes
    ? lanes[0].currentStep >= lanes[0].steps.length - 1 &&
    lanes[1].currentStep >= lanes[1].steps.length - 1
    : false;

  return {
    lanes,
    currentFrameA,
    currentFrameB,
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
  };
}
