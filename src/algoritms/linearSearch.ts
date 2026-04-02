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

export function linearSearch(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr: ArrayBar[] = input.map((v) => ({ value: v, state: "default" }));
  const target = input[0]!;

  let comparisons = 0;
  let accesses = 0;

  steps.push(
    snapshot(arr, `Linear Search: looking for target = ${target}`, comparisons, accesses, 0, {
      target,
      n: arr.length,
    })
  );

  for (let i = 0; i < arr.length; i++) {
    arr[i]!.state = "comparing";
    comparisons++;
    accesses++;
    steps.push(
      snapshot(
        arr,
        `Checking arr[${i}] = ${arr[i]!.value} ${arr[i]!.value === target ? "==" : "!="} ${target}`,
        comparisons,
        accesses,
        2,
        { i, target, "arr[i]": arr[i]!.value }
      )
    );

    if (arr[i]!.value === target) {
      arr[i]!.state = "sorted";
      steps.push(
        snapshot(arr, `Found ${target} at index ${i}!`, comparisons, accesses, 3, {
          i,
          target,
          result: i,
        })
      );
      return steps;
    }

    arr[i]!.state = "default";
  }

  steps.push(
    snapshot(arr, `${target} not found in the array`, comparisons, accesses, 5, {
      target,
      result: -1,
    })
  );

  return steps;
}
