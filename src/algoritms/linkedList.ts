import type { ListNodeBar, LinkedListStep, ListNodeState } from "./types";

function snapshot(
  nodes: ListNodeBar[],
  description: string,
  comparisons: number,
  accesses: number,
  highlightedLine = -1,
  variables: Record<string, string | number> = {},
  resultOrder?: number[]
): LinkedListStep {
  return {
    nodes: nodes.map((n) => ({ ...n })),
    description,
    comparisons,
    swaps: accesses,
    dryRun: { variables, highlightedLine },
    resultOrder,
  };
}

function makeNodes(values: number[]): ListNodeBar[] {
  return values.map((v, i) => ({
    value: v,
    state: "default" as ListNodeState,
    index: i,
    hasArrow: i < values.length - 1,
    isHead: i === 0,
    isTail: i === values.length - 1,
  }));
}

function resetAll(nodes: ListNodeBar[], state: ListNodeState = "default"): void {
  nodes.forEach((n) => (n.state = state));
}

export function linkedListTraversal(values: number[]): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  if (values.length === 0) return steps;

  const nodes = makeNodes(values);
  const comparisons = 0;
  let accesses = 0;

  steps.push(
    snapshot(nodes, `Traversing linked list of ${values.length} nodes`, comparisons, accesses, 0, {
      head: values[0]!,
      length: values.length,
    })
  );

  for (let i = 0; i < nodes.length; i++) {
    resetAll(nodes);
    nodes[i]!.state = "visiting";
    accesses++;
    steps.push(
      snapshot(
        nodes,
        `Visiting node[${i}] = ${nodes[i]!.value}`,
        comparisons,
        accesses,
        2,
        { i, "node.value": nodes[i]!.value }
      )
    );
    nodes[i]!.state = "visited";
  }

  resetAll(nodes, "visited");
  steps.push(
    snapshot(nodes, `Traversal complete. Visited all ${values.length} nodes.`, comparisons, accesses, 4, {
      length: values.length,
    })
  );

  return steps;
}

export function linkedListInsertHead(values: number[]): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  if (values.length === 0) return steps;

  const list = [...values];
  const newValue = Math.floor(Math.random() * 100) + 100;
  const comparisons = 0;
  let accesses = 0;

  let nodes = makeNodes(list);
  steps.push(
    snapshot(nodes, `Current list: head -> ${list.join(" -> ")} -> null`, comparisons, accesses, 0, {
      head: list[0]!,
    })
  );

  list.unshift(newValue);
  nodes = makeNodes(list);
  nodes[0]!.state = "inserting";
  accesses++;
  steps.push(
    snapshot(
      nodes,
      `Inserting ${newValue} at head. New head -> ${newValue}`,
      comparisons,
      accesses,
      2,
      { "newNode.value": newValue, head: newValue }
    )
  );

  resetAll(nodes, "default");
  nodes[0]!.state = "found";
  steps.push(
    snapshot(nodes, `Insert complete. List: ${list.join(" -> ")}`, comparisons, accesses, 4, {
      head: newValue,
      length: list.length,
    })
  );

  return steps;
}

export function linkedListInsertTail(values: number[]): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  if (values.length === 0) return steps;

  const list = [...values];
  const newValue = Math.floor(Math.random() * 100) + 100;
  const comparisons = 0;
  let accesses = 0;

  let nodes = makeNodes(list);
  steps.push(
    snapshot(nodes, `Current list: ${list.join(" -> ")} -> null`, comparisons, accesses, 0, {
      tail: list[list.length - 1]!,
    })
  );

  for (let i = 0; i < nodes.length; i++) {
    resetAll(nodes);
    nodes[i]!.state = "visiting";
    accesses++;
    steps.push(
      snapshot(
        nodes,
        `Traversing to tail: node[${i}] = ${nodes[i]!.value}`,
        comparisons,
        accesses,
        2,
        { i, "node.value": nodes[i]!.value }
      )
    );
    nodes[i]!.state = "visited";
  }

  list.push(newValue);
  nodes = makeNodes(list);
  nodes[nodes.length - 1]!.state = "inserting";
  accesses++;
  steps.push(
    snapshot(
      nodes,
      `Reached tail. Inserting ${newValue} at tail.`,
      comparisons,
      accesses,
      4,
      { "newNode.value": newValue, tail: newValue }
    )
  );

  resetAll(nodes, "default");
  nodes[nodes.length - 1]!.state = "found";
  steps.push(
    snapshot(nodes, `Insert complete. List: ${list.join(" -> ")}`, comparisons, accesses, 5, {
      tail: newValue,
      length: list.length,
    })
  );

  return steps;
}

export function linkedListDelete(values: number[]): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  if (values.length === 0) return steps;

  const list = [...values];
  const target = list[Math.floor(list.length / 2)]!;
  let comparisons = 0;
  let accesses = 0;

  let nodes = makeNodes(list);
  steps.push(
    snapshot(nodes, `Deleting node with value ${target}`, comparisons, accesses, 0, {
      target,
      head: list[0]!,
    })
  );

  for (let i = 0; i < nodes.length; i++) {
    resetAll(nodes);
    nodes[i]!.state = "visiting";
    comparisons++;
    accesses++;
    steps.push(
      snapshot(
        nodes,
        `Checking node[${i}] = ${nodes[i]!.value} ${nodes[i]!.value === target ? "==" : "!="} ${target}`,
        comparisons,
        accesses,
        2,
        { i, "node.value": nodes[i]!.value, target }
      )
    );

    if (nodes[i]!.value === target) {
      nodes[i]!.state = "deleting";
      steps.push(
        snapshot(nodes, `Found ${target} at index ${i}. Deleting...`, comparisons, accesses, 3, {
          i,
          target,
        })
      );
      break;
    }
    nodes[i]!.state = "visited";
  }

  const idx = list.indexOf(target);
  if (idx !== -1) {
    nodes = makeNodes(list);
    nodes[idx]!.state = "deleting";
    steps.push(
      snapshot(nodes, `Removing node at index ${idx} with value ${target}`, comparisons, accesses, 4, {
        i: idx,
        target,
      })
    );

    list.splice(idx, 1);
    nodes = makeNodes(list);
    steps.push(
      snapshot(nodes, `Deleted. List: ${list.join(" -> ")}`, comparisons, accesses, 5, {
        result: `[${list.join(", ")}]`,
        length: list.length,
      })
    );
  }

  return steps;
}

export function linkedListReverse(values: number[]): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  if (values.length === 0) return steps;

  const list = [...values];
  let comparisons = 0;
  let accesses = 0;

  let nodes = makeNodes(list);
  steps.push(
    snapshot(nodes, `Reversing linked list: ${list.join(" -> ")}`, comparisons, accesses, 0, {
      head: list[0]!,
      tail: list[list.length - 1]!,
    })
  );

  let left = 0;
  let right = list.length - 1;

  while (left < right) {
    comparisons++;
    resetAll(nodes);
    nodes[left]!.state = "swapping";
    nodes[right]!.state = "swapping";
    accesses += 2;
    steps.push(
      snapshot(
        nodes,
        `Swapping node[${left}]=${list[left]} with node[${right}]=${list[right]}`,
        comparisons,
        accesses,
        3,
        { left, right, "list[left]": list[left]!, "list[right]": list[right]! }
      )
    );

    const tmp = list[left]!;
    list[left] = list[right]!;
    list[right] = tmp;
    nodes = makeNodes(list);
    nodes[left]!.state = "visited";
    nodes[right]!.state = "visited";
    left++;
    right--;
  }

  nodes = makeNodes(list);
  resetAll(nodes, "found");
  steps.push(
    snapshot(nodes, `Reversed. List: ${list.join(" -> ")}`, comparisons, accesses, 5, {
      head: list[0]!,
      tail: list[list.length - 1]!,
    })
  );

  return steps;
}

export function linkedListFindMiddle(values: number[]): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  if (values.length === 0) return steps;

  const nodes = makeNodes(values);
  let comparisons = 0;
  let accesses = 0;

  steps.push(
    snapshot(nodes, `Finding middle using slow/fast pointers`, comparisons, accesses, 0, {
      length: values.length,
    })
  );

  let slow = 0;
  let fast = 0;

  while (fast + 2 <= nodes.length) {
    resetAll(nodes);

    if (slow < nodes.length) nodes[slow]!.state = "visiting";
    if (fast < nodes.length) nodes[fast]!.state = "found";

    accesses += 2;
    comparisons++;
    steps.push(
      snapshot(
        nodes,
        `slow[${slow}]=${nodes[slow]!.value}, fast[${fast}]=${nodes[fast]!.value}`,
        comparisons,
        accesses,
        3,
        { slow, fast, "slow.value": nodes[slow]!.value, "fast.value": nodes[fast]!.value }
      )
    );

    slow++;
    fast += 2;
  }

  resetAll(nodes);
  if (slow < nodes.length) {
    nodes[slow]!.state = "found";
  }
  steps.push(
    snapshot(
      nodes,
      `Middle element is at index ${slow}: ${nodes[slow]!.value}`,
      comparisons,
      accesses,
      5,
      { middle: nodes[slow]!.value, index: slow }
    )
  );

  return steps;
}
