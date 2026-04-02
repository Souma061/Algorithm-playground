import type { ListNodeBar } from "../algoritms/types";

const STATE_COLORS: Record<ListNodeBar["state"], string> = {
  default: "#6366f1",
  visiting: "#f59e0b",
  visited: "#22c55e",
  found: "#22c55e",
  inserting: "#8b5cf6",
  deleting: "#ef4444",
  swapping: "#f43f5e",
};

const STATE_BG: Record<ListNodeBar["state"], string> = {
  default: "rgba(99, 102, 241, 0.1)",
  visiting: "rgba(245, 158, 11, 0.15)",
  visited: "rgba(34, 197, 94, 0.12)",
  found: "rgba(34, 197, 94, 0.15)",
  inserting: "rgba(139, 92, 246, 0.15)",
  deleting: "rgba(239, 68, 68, 0.15)",
  swapping: "rgba(244, 63, 94, 0.15)",
};

const STATE_GLOW: Record<ListNodeBar["state"], string> = {
  default: "none",
  visiting: "0 0 14px rgba(245, 158, 11, 0.5)",
  visited: "none",
  found: "0 0 14px rgba(34, 197, 94, 0.5)",
  inserting: "0 0 14px rgba(139, 92, 246, 0.5)",
  deleting: "0 0 14px rgba(239, 68, 68, 0.5)",
  swapping: "0 0 14px rgba(244, 63, 94, 0.5)",
};

interface LinkedListViewProps {
  nodes: ListNodeBar[];
}

export function LinkedListView({ nodes }: LinkedListViewProps) {
  if (nodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-lg">
        No linked list data
      </div>
    );
  }

  const nodeWidth = 64;
  const nodeHeight = 44;
  const gap = 32;
  const arrowLen = gap - 4;
  const padding = 50;
  const totalWidth = nodes.length * (nodeWidth + gap) + padding * 2;
  const svgHeight = 120;

  const maxVisible = 12;
  const tooMany = nodes.length > maxVisible;

  if (tooMany) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center overflow-auto px-4">
        <div className="flex items-center gap-1 flex-wrap justify-center py-4">
          {nodes.map((node, i) => (
            <div key={i} className="flex items-center gap-1">
              <div
                className="flex items-center justify-center rounded-lg border-2 font-bold font-mono text-sm"
                style={{
                  width: "48px",
                  height: "38px",
                  borderColor: STATE_COLORS[node.state],
                  backgroundColor: STATE_BG[node.state],
                  color: STATE_COLORS[node.state],
                  boxShadow: STATE_GLOW[node.state],
                  transition: "all 0.25s ease",
                }}
              >
                {node.value}
              </div>
              {i < nodes.length - 1 && (
                <svg width="20" height="16" viewBox="0 0 20 16">
                  <line
                    x1="0"
                    y1="8"
                    x2="14"
                    y2="8"
                    stroke={STATE_COLORS[node.state]}
                    strokeWidth="2"
                    strokeOpacity={0.6}
                  />
                  <polygon
                    points="14,4 20,8 14,12"
                    fill={STATE_COLORS[node.state]}
                    opacity={0.6}
                  />
                </svg>
              )}
              {i === nodes.length - 1 && (
                <span className="ml-1 text-xs font-mono text-slate-400 font-bold">
                  null
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center overflow-hidden">
      <svg
        width="100%"
        viewBox={`0 0 ${totalWidth} ${svgHeight}`}
        style={{ maxHeight: "120px" }}
      >
        {/* Head label */}
        <text
          x={padding - 10}
          y={svgHeight / 2 + 5}
          textAnchor="end"
          fill="#94a3b8"
          fontSize="11"
          fontWeight="600"
          fontFamily="'JetBrains Mono', monospace"
        >
          head
        </text>
        {/* Head arrow */}
        <line
          x1={padding - 6}
          y1={svgHeight / 2}
          x2={padding + 2}
          y2={svgHeight / 2}
          stroke="#94a3b8"
          strokeWidth="2"
          markerEnd="url(#arrowhead-default)"
        />

        {nodes.map((node, i) => {
          const x = padding + i * (nodeWidth + gap);
          const y = svgHeight / 2 - nodeHeight / 2;
          const color = STATE_COLORS[node.state];

          return (
            <g key={i}>
              {/* Node rectangle */}
              <rect
                x={x}
                y={y}
                width={nodeWidth}
                height={nodeHeight}
                rx={10}
                fill={STATE_BG[node.state]}
                stroke={color}
                strokeWidth={2.5}
                style={{
                  filter:
                    STATE_GLOW[node.state] !== "none"
                      ? `drop-shadow(${STATE_GLOW[node.state]})`
                      : "none",
                  transition: "all 0.25s ease",
                }}
              />

              {/* Pointer box (right half) */}
              <line
                x1={x + nodeWidth - 18}
                y1={y + 4}
                x2={x + nodeWidth - 18}
                y2={y + nodeHeight - 4}
                stroke={color}
                strokeWidth={1}
                strokeOpacity={0.4}
                strokeDasharray="3,3"
              />

              {/* Pointer dot */}
              <circle
                cx={x + nodeWidth - 9}
                cy={svgHeight / 2}
                r={3}
                fill={node.hasArrow ? color : "transparent"}
                stroke={node.hasArrow ? color : "#94a3b8"}
                strokeWidth={1.5}
                strokeOpacity={node.hasArrow ? 1 : 0.3}
              />

              {/* Value text */}
              <text
                x={x + (nodeWidth - 18) / 2}
                y={svgHeight / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={color}
                fontSize="15"
                fontWeight="700"
                fontFamily="'JetBrains Mono', monospace"
                style={{ transition: "all 0.25s ease" }}
              >
                {node.value}
              </text>

              {/* Index label */}
              <text
                x={x + nodeWidth / 2}
                y={y + nodeHeight + 14}
                textAnchor="middle"
                fill="#64748b"
                fontSize="10"
                fontFamily="'JetBrains Mono', monospace"
              >
                [{i}]
              </text>

              {/* Arrow to next node */}
              {node.hasArrow && (
                <line
                  x1={x + nodeWidth + 2}
                  y1={svgHeight / 2}
                  x2={x + nodeWidth + arrowLen}
                  y2={svgHeight / 2}
                  stroke={color}
                  strokeWidth={2}
                  strokeOpacity={0.6}
                  style={{ transition: "all 0.25s ease" }}
                />
              )}

              {/* Arrow head */}
              {node.hasArrow && (
                <polygon
                  points={`${x + nodeWidth + arrowLen - 1},${svgHeight / 2 - 4} ${x + nodeWidth + arrowLen + 4},${svgHeight / 2} ${x + nodeWidth + arrowLen - 1},${svgHeight / 2 + 4}`}
                  fill={color}
                  opacity={0.6}
                  style={{ transition: "all 0.25s ease" }}
                />
              )}

              {/* null marker for last node */}
              {i === nodes.length - 1 && (
                <text
                  x={x + nodeWidth + 14}
                  y={svgHeight / 2 + 1}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fill="#94a3b8"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  null
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
