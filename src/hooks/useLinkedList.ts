import { useCallback, useRef, useState } from "react";
import type { LinkedListAlgorithm, LinkedListStep } from "../algoritms/types";

export function useLinkedList(algorithm: LinkedListAlgorithm) {
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generate = useCallback(
    (values: number[], algorithmOverride?: LinkedListAlgorithm) => {
      const s = (algorithmOverride ?? algorithm)(values);
      setSteps(s);
      setCurrentStep(0);
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    },
    [algorithm]
  );

  const play = useCallback(() => {
    if (steps.length === 0) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(intervalRef.current!);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
  }, [steps, speed]);

  const pause = useCallback(() => {
    clearInterval(intervalRef.current!);
    setIsPlaying(false);
  }, []);

  const stepForward = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps]);

  const stepBackward = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const currentFrame = steps[currentStep] ?? null;

  return {
    currentFrame,
    currentStep,
    totalSteps: steps.length,
    isPlaying,
    speed,
    setSpeed,
    generate,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
  };
}
