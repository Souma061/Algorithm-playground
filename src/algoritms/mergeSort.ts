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

export function mergeSort(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr: ArrayBar[] = input.map(v => ({
    value: v,
    state: 'default'
  }))

  steps.push(snapshot(arr, 'Starting array', 0, { n: arr.length }));

  function merge(left: number, mid: number, right: number) {
    const leftArr = arr.slice(left, mid + 1).map(b => b.value);
    const rightArr = arr.slice(mid + 1, right + 1).map(b => b.value);

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      arr[left + i]!.state = 'comparing';
      arr[mid + 1 + j]!.state = 'comparing';
      steps.push(snapshot(arr, `Comparing left[${i}]=${leftArr[i]} with right[${j}]=${rightArr[j]}`, 11, { i, j, k, left, mid, right, 'left[i]': leftArr[i]!, 'right[j]': rightArr[j]! }));

      if (leftArr[i]! <= rightArr[j]!) {
        arr[k]!.value = leftArr[i]!;
        arr[k]!.state = 'swapping';
        steps.push(snapshot(arr, `Placing ${leftArr[i]} from left array into index ${k}`, 12, { i: i + 1, j, k: k + 1 }));
        i++;
      } else {
        arr[k]!.value = rightArr[j]!;
        arr[k]!.state = 'swapping';
        steps.push(snapshot(arr, `Placing ${rightArr[j]} from right array into index ${k}`, 13, { i, j: j + 1, k: k + 1 }));
        j++;
      }
      arr[k]!.state = 'default';
      k++;
    }
    while (i < leftArr.length) {
      arr[k]!.value = leftArr[i]!;
      arr[k]!.state = 'swapping';
      steps.push(snapshot(arr, `Placing remaining ${leftArr[i]} from left into index ${k}`, 15, { i: i + 1, k: k + 1 }));
      arr[k]!.state = 'default';
      i++;
      k++;
    }
    while (j < rightArr.length) {
      arr[k]!.value = rightArr[j]!;
      arr[k]!.state = 'swapping';
      steps.push(snapshot(arr, `Placing remaining ${rightArr[j]} from right into index ${k}`, 16, { j: j + 1, k: k + 1 }));
      arr[k]!.state = 'default';
      j++;
      k++;
    }
    for (let x = left; x <= right; x++) {
      arr[x]!.state = left === 0 && right === arr.length - 1 ? 'sorted' : 'default';
    }
  }

  function divide(left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    steps.push(snapshot(arr, `Dividing array [${left}..${right}] at mid=${mid}`, 2, { left, right, mid }));
    divide(left, mid);
    divide(mid + 1, right);
    merge(left, mid, right);
  }

  divide(0, arr.length - 1);
  arr.forEach(b => b.state = 'sorted');
  steps.push(snapshot(arr, 'Array is fully sorted', 18, { n: arr.length }));

  return steps;
}
