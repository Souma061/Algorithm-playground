import type { ArrayBar } from "../algoritms/types";

const STATE_COLORS: Record<ArrayBar["state"], string> = {
  default: "#6366f1",
  comparing: "#f59e0b",
  swapping: "#ef4444",
  sorted: "#22c55e",
};

const STATE_GLOW: Record<ArrayBar["state"], string> = {
  default: "none",
  comparing: "0 0 12px rgba(245, 158, 11, 0.5)",
  swapping: "0 0 12px rgba(239, 68, 68, 0.5)",
  sorted: "0 0 12px rgba(34, 197, 94, 0.3)",
};

interface ArrayBoxesProps {
  bars: ArrayBar[];
}

export function ArrayBoxes({ bars }: ArrayBoxesProps) {
  const showValues = bars.length <= 25;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: bars.length > 30 ? "2px" : "6px",
          flexWrap: "wrap",
          padding: "24px 16px",
          minHeight: "180px",
        }}
      >
        {bars.map((bar, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <div
              style={{
                width:
                  bars.length > 30
                    ? "28px"
                    : bars.length > 20
                      ? "36px"
                      : "48px",
                height:
                  bars.length > 30
                    ? "28px"
                    : bars.length > 20
                      ? "36px"
                      : "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                border: `2px solid ${STATE_COLORS[bar.state]}`,
                backgroundColor:
                  bar.state === "default"
                    ? "rgba(99, 102, 241, 0.1)"
                    : `${STATE_COLORS[bar.state]}22`,
                color: STATE_COLORS[bar.state],
                fontSize:
                  bars.length > 30
                    ? "0.65rem"
                    : bars.length > 20
                      ? "0.75rem"
                      : "0.9rem",
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: STATE_GLOW[bar.state],
                transform:
                  bar.state === "swapping"
                    ? "scale(1.15)"
                    : bar.state === "comparing"
                      ? "scale(1.08)"
                      : "scale(1)",
              }}
            >
              {showValues && bar.value}
            </div>
            <span
              style={{
                fontSize: "0.6rem",
                color: "var(--text-tertiary)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {i}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
