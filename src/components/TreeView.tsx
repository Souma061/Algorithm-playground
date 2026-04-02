import type { TreeNodeBar } from "../algoritms/types";

const STATE_COLORS: Record<TreeNodeBar["state"], string> = {
  default: "#6366f1",
  visiting: "#f59e0b",
  visited: "#22c55e",
  found: "#ef4444",
};

const STATE_BG: Record<TreeNodeBar["state"], string> = {
  default: "rgba(99, 102, 241, 0.1)",
  visiting: "rgba(245, 158, 11, 0.15)",
  visited: "rgba(34, 197, 94, 0.15)",
  found: "rgba(239, 68, 68, 0.15)",
};

const STATE_GLOW: Record<TreeNodeBar["state"], string> = {
  default: "none",
  visiting: "0 0 16px rgba(245, 158, 11, 0.6)",
  visited: "0 0 12px rgba(34, 197, 94, 0.4)",
  found: "0 0 16px rgba(239, 68, 68, 0.6)",
};

interface TreeViewProps {
  nodes: TreeNodeBar[];
  traversalOrder?: number[];
}

export function TreeView({ nodes, traversalOrder }: TreeViewProps) {
  if (nodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        No tree data
      </div>
    );
  }

  const minX = Math.min(...nodes.map((n) => n.x));
  const maxX = Math.max(...nodes.map((n) => n.x));
  const maxY = Math.max(...nodes.map((n) => n.y));
  const padding = 40;
  const svgWidth = Math.max(maxX - minX + padding * 2, 400);
  const svgHeight = maxY + padding * 2 + 20;
  const offsetX = -minX + padding;

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center overflow-hidden">
      <svg
        width="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ maxHeight: "340px" }}
      >
        {nodes.map((node, i) => {
          if (node.parentX !== undefined && node.parentY !== undefined) {
            const x1 = node.parentX + offsetX;
            const y1 = node.parentY + 16;
            const x2 = node.x + offsetX;
            const y2 = node.y;
            return (
              <line
                key={`edge-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={node.state === "visiting" ? "#f59e0b" : "#94a3b8"}
                strokeWidth={node.state === "visiting" ? 2.5 : 1.5}
                strokeOpacity={0.6}
                style={{ transition: "all 0.3s ease" }}
              />
            );
          }
          return null;
        })}

        {nodes.map((node, i) => {
          const cx = node.x + offsetX;
          const cy = node.y;
          return (
            <g key={`node-${i}`} style={{ transition: "all 0.3s ease" }}>
              <circle
                cx={cx}
                cy={cy}
                r={20}
                fill={STATE_BG[node.state]}
                stroke={STATE_COLORS[node.state]}
                strokeWidth={2.5}
                style={{
                  filter:
                    STATE_GLOW[node.state] !== "none"
                      ? `drop-shadow(${STATE_GLOW[node.state].replace("0 0", "0 0")})`
                      : "none",
                  transition: "all 0.3s ease",
                }}
              />
              <text
                x={cx}
                y={cy + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={STATE_COLORS[node.state]}
                fontSize="13"
                fontWeight="700"
                fontFamily="'JetBrains Mono', monospace"
                style={{ transition: "all 0.3s ease" }}
              >
                {node.value}
              </text>
            </g>
          );
        })}
      </svg>

      {traversalOrder && traversalOrder.length > 0 && (
        <div className="flex items-center gap-2 mt-2 flex-wrap justify-center px-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Order:
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {traversalOrder.map((val, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold font-mono text-sm">
                  {val}
                </span>
                {i < traversalOrder.length - 1 && (
                  <span className="text-slate-400 text-xs">→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
