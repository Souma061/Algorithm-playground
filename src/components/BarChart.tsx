import type { ArrayBar } from "../algoritms/types";

const STATE_COLORS: Record<ArrayBar["state"], string> = {
  default: "#6366f1",
  comparing: "#f59e0b",
  swapping: "#ef4444",
  sorted: "#22c55e",
};

const STATE_GLOW: Record<ArrayBar["state"], string> = {
  default: "none",
  comparing: "0 0 8px rgba(245, 158, 11, 0.4)",
  swapping: "0 0 8px rgba(239, 68, 68, 0.4)",
  sorted: "none",
};

interface BarChartProps {
  bars: ArrayBar[];
}

export function BarChart({ bars }: BarChartProps) {
  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="w-full flex-1 flex flex-col justify-end items-center">
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: bars.length > 50 ? "1px" : bars.length > 30 ? "2px" : "3px",
          height: "300px",
          padding: "20px 16px 16px",
        }}
      >
        {bars.map((bar, i) => (
          <div
            key={i}
            title={`Index ${i}: ${bar.value}`}
            style={{
              flex: 1,
              height: `${(bar.value / max) * 100}%`,
              background:
                bar.state === "default"
                  ? "linear-gradient(180deg, #818cf8 0%, #6366f1 100%)"
                  : bar.state === "comparing"
                    ? "linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)"
                    : bar.state === "swapping"
                      ? "linear-gradient(180deg, #f87171 0%, #ef4444 100%)"
                      : "linear-gradient(180deg, #4ade80 0%, #22c55e 100%)",
              borderRadius: "4px 4px 0 0",
              transition:
                "height 0.15s cubic-bezier(0.4, 0, 0.2, 1), background 0.15s ease",
              minWidth: "2px",
              boxShadow: STATE_GLOW[bar.state],
              position: "relative",
            }}
          >
            {bars.length <= 20 && (
              <span
                style={{
                  position: "absolute",
                  top: "-18px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  color: STATE_COLORS[bar.state],
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {bar.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
