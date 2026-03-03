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

export function selectionSort(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr: ArrayBar[] = input.map(v => ({
    value: v,
    state: 'default'
  }))

  steps.push(snapshot(arr, 'Starting array', 0, { n: arr.length }));

  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    arr[minIndex].state = 'comparing';
    steps.push(snapshot(arr, `Assuming index ${minIndex} (${arr[minIndex].value}) is the minimum`, 2, { i, minIndex, 'arr[minIndex]': arr[minIndex].value }));

    for (let j = i + 1; j < n; j++) {
      arr[j]!.state = 'comparing';
      steps.push(snapshot(arr, `Comparing index ${j} (${arr[j]!.value}) with current min index ${minIndex} (${arr[minIndex].value})`, 4, { i, j, minIndex, 'arr[j]': arr[j]!.value, 'arr[minIndex]': arr[minIndex].value }));

      if (arr[j]!.value < arr[minIndex]!.value) {
        arr[minIndex]!.state = 'default';
        minIndex = j;
        steps.push(snapshot(arr, `New minimum found at index ${minIndex} (${arr[minIndex].value})`, 5, { i, j, minIndex }));
      } else {
        arr[j]!.state = 'default';
      }
    }
    if (minIndex !== i) {
      arr[i]!.state = 'swapping';
      arr[minIndex]!.state = 'swapping';
      steps.push(snapshot(arr, `Swapping index ${i} (${arr[i]!.value}) with min index ${minIndex} (${arr[minIndex]!.value})`, 8, { i, minIndex, 'arr[i]': arr[i]!.value, 'arr[minIndex]': arr[minIndex]!.value }));

      const temp = arr[i]!.value;
      arr[i]!.value = arr[minIndex]!.value;
      arr[minIndex]!.value = temp;
    }
    arr[minIndex]!.state = 'default';
    arr[i]!.state = 'sorted';
  }
  arr[n - 1]!.state = 'sorted';
  steps.push(snapshot(arr, 'Array is fully sorted', 10, { n }));

  return steps;
}
