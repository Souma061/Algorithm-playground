import type { ArrayBar, SortStep } from "./types";

function snapshot(
  arr: ArrayBar[],
  description: string,
  comparisons: number,
  accesses: number,
  highlightedLine = -1,
  variables: Record<string, string | number> = {}
): SortStep {
  return {
    bars: arr.map((b) => ({ ...b })),
    description,
    comparisons,
    swaps: accesses,
    dryRun: { variables, highlightedLine },
  };
}

export function binarySearch(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const sorted = [...input].sort((a, b) => a - b);
  const arr: ArrayBar[] = sorted.map((v) => ({ value: v, state: "default" }));
  const target = sorted[Math.floor(sorted.length / 2)]!;

  let comparisons = 0;
  let accesses = 0;

  steps.push(
    snapshot(
      arr,
      `Binary Search: looking for target = ${target} (sorted array)`,
      comparisons,
      accesses,
      0,
      { target, n: arr.length }
    )
  );

  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;
    accesses++;

    for (let i = low; i <= high; i++) {
      if (arr[i]!.state !== "sorted") arr[i]!.state = "default";
    }
    arr[mid]!.state = "comparing";

    steps.push(
      snapshot(
        arr,
        `Checking arr[${mid}] = ${arr[mid]!.value} against target ${target}`,
        comparisons,
        accesses,
        3,
        { low, high, mid, target, "arr[mid]": arr[mid]!.value }
      )
    );

    if (arr[mid]!.value === target) {
      arr[mid]!.state = "sorted";
      steps.push(
        snapshot(
          arr,
          `Found ${target} at index ${mid}!`,
          comparisons,
          accesses,
          4,
          { low, high, mid, target, result: mid }
        )
      );
      return steps;
    }

    if (arr[mid]!.value < target) {
      for (let i = low; i <= mid; i++) {
        arr[i]!.state = "sorted";
      }
      steps.push(
        snapshot(
          arr,
          `${arr[mid]!.value} < ${target}, search right half [${mid + 1}..${high}]`,
          comparisons,
          accesses,
          5,
          { low, high, mid, target, "arr[mid]": arr[mid]!.value }
        )
      );
      low = mid + 1;
    } else {
      for (let i = mid; i <= high; i++) {
        arr[i]!.state = "sorted";
      }
      steps.push(
        snapshot(
          arr,
          `${arr[mid]!.value} > ${target}, search left half [${low}..${mid - 1}]`,
          comparisons,
          accesses,
          6,
          { low, high, mid, target, "arr[mid]": arr[mid]!.value }
        )
      );
      high = mid - 1;
    }
  }

  steps.push(
    snapshot(arr, `${target} not found in the array`, comparisons, accesses, 8, {
      target,
      result: -1,
    })
  );

  return steps;
}
