import type { TreeNode, TreeNodeBar, TreeStep, TreeNodeState } from "./types";

function snapshotTree(
  nodes: TreeNodeBar[],
  description: string,
  comparisons: number,
  accesses: number,
  highlightedLine = -1,
  variables: Record<string, string | number> = {},
  traversalOrder?: number[]
): TreeStep {
  return {
    nodes: nodes.map((n) => ({ ...n })),
    description,
    comparisons,
    swaps: accesses,
    dryRun: { variables, highlightedLine },
    traversalOrder,
  };
}

function layoutTree(root: TreeNode | null): TreeNodeBar[] {
  if (!root) return [];
  const result: TreeNodeBar[] = [];

  function traverse(
    node: TreeNode | null,
    x: number,
    y: number,
    parentX?: number,
    parentY?: number
  ) {
    if (!node) return;
    result.push({
      value: node.value,
      state: node.state,
      x,
      y,
      parentX,
      parentY,
    });
    const gap = 40 / (Math.floor(y / 60) + 1);
    traverse(node.left, x - gap, y + 70, x, y);
    traverse(node.right, x + gap, y + 70, x, y);
  }

  traverse(root, 250, 40);
  return result;
}

function insertNode(node: TreeNode, value: number): TreeNode {
  if (value < node.value) {
    if (!node.left) {
      node.left = { value, state: "default", left: null, right: null };
    } else {
      insertNode(node.left, value);
    }
  } else {
    if (!node.right) {
      node.right = { value, state: "default", left: null, right: null };
    } else {
      insertNode(node.right, value);
    }
  }
  return node;
}

function resetStates(node: TreeNode | null, state: TreeNodeState = "default"): void {
  if (!node) return;
  node.state = state;
  resetStates(node.left, state);
  resetStates(node.right, state);
}

function inorderTraversal(
  root: TreeNode | null,
  steps: TreeStep[],
  tree: TreeNode,
  comparisonsRef: { value: number },
  accessesRef: { value: number },
  order: number[]
): void {
  if (!root) return;
  inorderTraversal(root.left, steps, tree, comparisonsRef, accessesRef, order);
  root.state = "visiting";
  accessesRef.value++;
  order.push(root.value);
  steps.push(
    snapshotTree(
      layoutTree(tree),
      `Inorder: visiting node ${root.value}`,
      comparisonsRef.value,
      accessesRef.value,
      3,
      { "current": root.value },
      [...order]
    )
  );
  root.state = "visited";
  inorderTraversal(root.right, steps, tree, comparisonsRef, accessesRef, order);
}

function preorderTraversal(
  root: TreeNode | null,
  steps: TreeStep[],
  tree: TreeNode,
  comparisonsRef: { value: number },
  accessesRef: { value: number },
  order: number[]
): void {
  if (!root) return;
  root.state = "visiting";
  accessesRef.value++;
  order.push(root.value);
  steps.push(
    snapshotTree(
      layoutTree(tree),
      `Preorder: visiting node ${root.value}`,
      comparisonsRef.value,
      accessesRef.value,
      3,
      { "current": root.value },
      [...order]
    )
  );
  root.state = "visited";
  preorderTraversal(root.left, steps, tree, comparisonsRef, accessesRef, order);
  preorderTraversal(root.right, steps, tree, comparisonsRef, accessesRef, order);
}

function postorderTraversal(
  root: TreeNode | null,
  steps: TreeStep[],
  tree: TreeNode,
  comparisonsRef: { value: number },
  accessesRef: { value: number },
  order: number[]
): void {
  if (!root) return;
  postorderTraversal(root.left, steps, tree, comparisonsRef, accessesRef, order);
  postorderTraversal(root.right, steps, tree, comparisonsRef, accessesRef, order);
  root.state = "visiting";
  accessesRef.value++;
  order.push(root.value);
  steps.push(
    snapshotTree(
      layoutTree(tree),
      `Postorder: visiting node ${root.value}`,
      comparisonsRef.value,
      accessesRef.value,
      3,
      { "current": root.value },
      [...order]
    )
  );
  root.state = "visited";
}

export function bstInsertAndTraverse(values: number[]): TreeStep[] {
  const steps: TreeStep[] = [];
  if (values.length === 0) return steps;

  const root: TreeNode = { value: values[0]!, state: "default", left: null, right: null };
  const comparisons = 0;
  let accesses = 0;

  steps.push(
    snapshotTree(
      layoutTree(root),
      `Created BST root with value ${values[0]}`,
      comparisons,
      accesses,
      0,
      { root: values[0]! }
    )
  );

  for (let i = 1; i < values.length; i++) {
    const val = values[i]!;
    insertNode(root, val);
    accesses++;
    steps.push(
      snapshotTree(
        layoutTree(root),
        `Inserted ${val} into BST`,
        comparisons,
        accesses,
        1,
        { inserted: val, nodes: i + 1 }
      )
    );
  }

  resetStates(root);
  steps.push(
    snapshotTree(
      layoutTree(root),
      "BST built. Starting inorder traversal...",
      comparisons,
      accesses,
      2,
      {}
    )
  );

  const order: number[] = [];
  inorderTraversal(root, steps, root, { value: comparisons }, { value: accesses }, order);

  resetStates(root, "visited");
  steps.push(
    snapshotTree(
      layoutTree(root),
      `Inorder traversal complete: [${order.join(", ")}]`,
      comparisons,
      accesses,
      5,
      { result: `[${order.join(", ")}]` },
      order
    )
  );

  return steps;
}

export function bstSearch(values: number[]): TreeStep[] {
  const steps: TreeStep[] = [];
  if (values.length === 0) return steps;

  const root: TreeNode = { value: values[0]!, state: "default", left: null, right: null };
  for (let i = 1; i < values.length; i++) {
    insertNode(root, values[i]!);
  }

  let comparisons = 0;
  let accesses = 0;
  const target = values[Math.floor(values.length / 2)]!;

  steps.push(
    snapshotTree(
      layoutTree(root),
      `BST Search: looking for target = ${target}`,
      comparisons,
      accesses,
      0,
      { target }
    )
  );

  let current: TreeNode | null = root;
  while (current) {
    current.state = "visiting";
    comparisons++;
    accesses++;
    steps.push(
      snapshotTree(
        layoutTree(root),
        `Checking node ${current.value} ${current.value === target ? "==" : current.value < target ? "<" : ">"} ${target}`,
        comparisons,
        accesses,
        3,
        { current: current.value, target }
      )
    );

    if (current.value === target) {
      current.state = "found";
      steps.push(
        snapshotTree(
          layoutTree(root),
          `Found ${target} in BST!`,
          comparisons,
          accesses,
          4,
          { target, result: "found" }
        )
      );
      return steps;
    }

    if (current.value < target) {
      steps.push(
        snapshotTree(
          layoutTree(root),
          `${current.value} < ${target}, go right`,
          comparisons,
          accesses,
          5,
          { current: current.value, target }
        )
      );
      current.state = "visited";
      current = current.right;
    } else {
      steps.push(
        snapshotTree(
          layoutTree(root),
          `${current.value} > ${target}, go left`,
          comparisons,
          accesses,
          6,
          { current: current.value, target }
        )
      );
      current.state = "visited";
      current = current.left;
    }
  }

  steps.push(
    snapshotTree(
      layoutTree(root),
      `${target} not found in BST`,
      comparisons,
      accesses,
      7,
      { target, result: "not found" }
    )
  );

  return steps;
}

export function bstPreorder(values: number[]): TreeStep[] {
  const steps: TreeStep[] = [];
  if (values.length === 0) return steps;

  const root: TreeNode = { value: values[0]!, state: "default", left: null, right: null };
  for (let i = 1; i < values.length; i++) {
    insertNode(root, values[i]!);
  }

  const comparisons = 0;
  const accesses = 0;

  steps.push(
    snapshotTree(
      layoutTree(root),
      "Preorder Traversal (Root → Left → Right)",
      comparisons,
      accesses,
      0,
      {}
    )
  );

  const order: number[] = [];
  preorderTraversal(root, steps, root, { value: comparisons }, { value: accesses }, order);

  resetStates(root, "visited");
  steps.push(
    snapshotTree(
      layoutTree(root),
      `Preorder traversal complete: [${order.join(", ")}]`,
      comparisons,
      accesses,
      5,
      { result: `[${order.join(", ")}]` },
      order
    )
  );

  return steps;
}

export function bstPostorder(values: number[]): TreeStep[] {
  const steps: TreeStep[] = [];
  if (values.length === 0) return steps;

  const root: TreeNode = { value: values[0]!, state: "default", left: null, right: null };
  for (let i = 1; i < values.length; i++) {
    insertNode(root, values[i]!);
  }

  const comparisons = 0;
  const accesses = 0;

  steps.push(
    snapshotTree(
      layoutTree(root),
      "Postorder Traversal (Left → Right → Root)",
      comparisons,
      accesses,
      0,
      {}
    )
  );

  const order: number[] = [];
  postorderTraversal(root, steps, root, { value: comparisons }, { value: accesses }, order);

  resetStates(root, "visited");
  steps.push(
    snapshotTree(
      layoutTree(root),
      `Postorder traversal complete: [${order.join(", ")}]`,
      comparisons,
      accesses,
      5,
      { result: `[${order.join(", ")}]` },
      order
    )
  );

  return steps;
}
