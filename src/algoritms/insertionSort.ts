import type { ArrayBar, SortStep } from "./types";

function snapshot(arr: ArrayBar[], description: string, highlightedLine = -1, variables: Record<string, string | number> = {}): SortStep {
  return {
    bars: arr.map(b => ({ ...b })),
    description,
    dryRun: {
      variables,
      highlightedLine,
    },
  };
}

export function insertionSort(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr: ArrayBar[] = input.map(v => ({
    value: v,
    state: 'default'
  }))

  steps.push(snapshot(arr, 'Starting array', 0, { n: arr.length }));
  const n = arr.length;
  arr[0]!.state = 'sorted';

  for (let i = 1; i < n; i++) {
    const key = arr[i]!.value;
    arr[i]!.state = 'comparing';
    steps.push(snapshot(arr, `Picking key = ${key} at index ${i}`, 2, { i, key, j: i - 1 }));

    let j = i - 1;

    while (j >= 0 && arr[j]!.value > key) {
      arr[j]!.state = 'swapping';
      arr[j + 1]!.state = 'swapping';
      steps.push(snapshot(arr, `Shifting arr[${j}]=${arr[j]!.value} → arr[${j + 1}]`, 5, { i, key, j, 'arr[j]': arr[j]!.value }));

      arr[j + 1]!.value = arr[j]!.value;
      arr[j]!.state = 'sorted';
      arr[j + 1]!.state = 'sorted';
      j--;
    }
    arr[j + 1]!.value = key;
    arr[j + 1]!.state = 'sorted';
    steps.push(snapshot(arr, `Inserted key ${key} at index ${j + 1}`, 8, { i, key, 'j+1': j + 1 }));
  }
  steps.push(snapshot(arr, 'Array is fully sorted', 10, { n }));

  return steps;
}
