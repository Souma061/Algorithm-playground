import type { ArrayBar, SortStep } from "./types";

function snapshot(
  arr: ArrayBar[],
  description: string,
  comparisons: number,
  swaps: number,
  highlightedLine = -1,
  variables: Record<string, string | number> = {}
): SortStep {
  return {
    bars: arr.map((b) => ({ ...b })),
    description,
    comparisons,
    swaps,
    dryRun: { variables, highlightedLine },
  };
}

export function bubbleSort(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr: ArrayBar[] = input.map((v) => ({ value: v, state: "default" }));

  let comparisons = 0;
  let swaps = 0;

  steps.push(snapshot(arr, "Starting array", comparisons, swaps, 0, { n: arr.length }));

  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      arr[j]!.state = "comparing";
      arr[j + 1]!.state = "comparing";
      comparisons++;
      steps.push(
        snapshot(arr, `Comparing arr[${j}]=${arr[j]!.value} and arr[${j + 1}]=${arr[j + 1]!.value}`, comparisons, swaps, 3, {
          i, j, "arr[j]": arr[j]!.value, "arr[j+1]": arr[j + 1]!.value,
        })
      );

      if (arr[j]!.value > arr[j + 1]!.value) {
        arr[j]!.state = "swapping";
        arr[j + 1]!.state = "swapping";
        swaps++;
        steps.push(
          snapshot(arr, `Swapping ${arr[j]!.value} and ${arr[j + 1]!.value}`, comparisons, swaps, 4, {
            i, j, "arr[j]": arr[j]!.value, "arr[j+1]": arr[j + 1]!.value,
          })
        );
        const temp = arr[j]!.value;
        arr[j]!.value = arr[j + 1]!.value;
        arr[j + 1]!.value = temp;
      }
      arr[j]!.state = "default";
      arr[j + 1]!.state = "default";
    }
    arr[n - i - 1]!.state = "sorted";
  }
  arr[0]!.state = "sorted";
  steps.push(snapshot(arr, "Array is sorted", comparisons, swaps, 8, { n }));

  return steps;
}
