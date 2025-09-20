import React from "react";
import "./Legend.css";

const ITEMS = [
  { cls: "legend-compare", label: "Compare" },
  { cls: "legend-swap", label: "Swap" },
  { cls: "legend-final", label: "Finalized" },
  { cls: "legend-pivot", label: "Pivot" },
  { cls: "legend-gap", label: "Gap Focus" },
  { cls: "legend-bucket", label: "Bucket" },
  { cls: "legend-count", label: "Counting Digit" },
];

export default function Legend() {
  return (
    <div className="legend" aria-label="Visualization Legend">
      {ITEMS.map((i) => (
        <div key={i.cls} className="legend-item">
          <span className={`legend-chip ${i.cls}`} />
          <span className="legend-text">{i.label}</span>
        </div>
      ))}
    </div>
  );
}
