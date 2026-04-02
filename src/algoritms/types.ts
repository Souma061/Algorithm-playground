export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted';

export interface ArrayBar {
  value: number;
  state: BarState;
}

export interface DryRunState {
  variables: Record<string, string | number>;
  highlightedLine: number;
}

export interface SortStep {
  bars: ArrayBar[];
  description: string;
  dryRun?: DryRunState;
  comparisons: number;
  swaps: number;
}

export type SortingAlgorithm = (arr: number[]) => SortStep[];

export type CodeLanguage = 'pseudo' | 'javascript' | 'python' | 'cpp' | 'java';

export interface AlgorithmCode {
  pseudo: string[];
  javascript: string[];
  python: string[];
  cpp: string[];
  java: string[];
}

export type VisualizerMode = 'bars' | 'boxes';

export type TreeNodeState = 'default' | 'visiting' | 'visited' | 'found';

export interface TreeNode {
  value: number;
  state: TreeNodeState;
  left: TreeNode | null;
  right: TreeNode | null;
}

export interface TreeNodeBar {
  value: number;
  state: TreeNodeState;
  x: number;
  y: number;
  parentX?: number;
  parentY?: number;
}

export interface TreeStep {
  nodes: TreeNodeBar[];
  description: string;
  dryRun?: DryRunState;
  comparisons: number;
  swaps: number;
  traversalOrder?: number[];
}

export type TreeAlgorithm = (values: number[]) => TreeStep[];

export type AlgorithmCategory = 'sorting' | 'searching' | 'tree' | 'linkedlist';

export type ListNodeState = 'default' | 'visiting' | 'visited' | 'found' | 'inserting' | 'deleting' | 'swapping';

export interface ListNodeBar {
  value: number;
  state: ListNodeState;
  index: number;
  hasArrow: boolean;
  isHead?: boolean;
  isTail?: boolean;
}

export interface LinkedListStep {
  nodes: ListNodeBar[];
  description: string;
  dryRun?: DryRunState;
  comparisons: number;
  swaps: number;
  resultOrder?: number[];
}

export type LinkedListAlgorithm = (values: number[]) => LinkedListStep[];
