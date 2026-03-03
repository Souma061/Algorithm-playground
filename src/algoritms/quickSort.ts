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

export function quickSort(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr: ArrayBar[] = input.map(value => ({ value, state: "default" }));

  steps.push(snapshot(arr, "Starting array", 0, { n: arr.length }));

  function partition(low: number, high: number): number {
    const pivot = arr[high]!.value;
    arr[high]!.state = 'comparing';
    steps.push(snapshot(arr, `Choosing pivot: ${pivot} at index ${high}`, 8, { low, high, pivot, i: low - 1 }));

    let i = low - 1;
    for (let j = low; j < high; j++) {
      arr[j]!.state = 'comparing';
      steps.push(snapshot(arr, `Comparing arr[${j}]=${arr[j]!.value} with pivot ${pivot}`, 11, { low, high, pivot, i, j, 'arr[j]': arr[j]!.value }));

      if (arr[j]!.value <= pivot) {
        i++;
        arr[i]!.state = 'swapping';
        arr[j]!.state = 'swapping';
        steps.push(snapshot(arr, `Swapping arr[${i}]=${arr[i]!.value} and arr[${j}]=${arr[j]!.value}`, 13, { low, high, pivot, i, j }));

        const temp = arr[i]!.value;
        arr[i]!.value = arr[j]!.value;
        arr[j]!.value = temp;
      }
      arr[j]!.state = 'default';
      if (i >= low) arr[i]!.state = 'default';
    }
    arr[i + 1]!.state = 'swapping';
    arr[high]!.state = 'swapping';
    steps.push(snapshot(arr, `Placing pivot: swapping arr[${i + 1}]=${arr[i + 1]!.value} and arr[${high}]=${arr[high]!.value}`, 16, { 'i+1': i + 1, high, pivot }));

    const temp = arr[i + 1]!.value;
    arr[i + 1]!.value = arr[high]!.value;
    arr[high]!.value = temp;

    arr[i + 1]!.state = 'sorted';
    arr[high]!.state = 'default';

    return i + 1;
  }

  function sort(low: number, high: number) {
    if (low >= high) {
      if (low === high) arr[low]!.state = 'sorted';
      return;
    }
    const pi = partition(low, high);
    sort(low, pi - 1);
    sort(pi + 1, high);
  }

  sort(0, arr.length - 1);

  arr.forEach(bar => bar.state = 'sorted');
  steps.push(snapshot(arr, "Array sorted", 17, { n: arr.length }));
  return steps;
}
