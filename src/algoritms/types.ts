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
