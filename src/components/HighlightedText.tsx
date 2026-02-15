import { useState, useCallback, useRef } from "react";
import type { Sentence, Hit } from "../types/index.ts";
import { formatCategory } from "../utils/formatCategory.ts";

interface HighlightedTextProps {
  sentences: Sentence[];
  hitMap: Map<number, Hit[]>;
}

type SeverityLevel = "HIGH" | "MEDIUM" | "LOW";

function getHighestSeverity(hits: Hit[]): SeverityLevel {
  if (hits.some((h) => h.fault_level === "HIGH")) return "HIGH";
  if (hits.some((h) => h.fault_level === "MEDIUM")) return "MEDIUM";
  return "LOW";
}

const severityStyles: Record<SeverityLevel, string> = {
  HIGH: "bg-amway-red-light border-l-4 border-amway-red text-amway-red-dark",
  MEDIUM:
    "bg-amway-yellow-light border-l-4 border-amway-yellow text-amway-yellow-dark",
  LOW: "bg-amway-orange-light border-l-4 border-amway-orange text-amway-orange-dark",
};

const severityConfig: {
  level: SeverityLevel;
  color: string;
  bg: string;
  border: string;
  label: string;
}[] = [
  {
    level: "HIGH",
    color: "text-amway-red-dark",
    bg: "bg-amway-red-light",
    border: "border-amway-red/40",
    label: "High",
  },
  {
    level: "MEDIUM",
    color: "text-amway-yellow-dark",
    bg: "bg-amway-yellow-light",
    border: "border-amway-yellow/50",
    label: "Medium",
  },
  {
    level: "LOW",
    color: "text-amway-orange-dark",
    bg: "bg-amway-orange-light",
    border: "border-amway-orange/40",
    label: "Low",
  },
];

const HighlightedText = ({ sentences, hitMap }: HighlightedTextProps) => {
  const [activeFilters, setActiveFilters] = useState<Set<SeverityLevel>>(
    new Set(["HIGH", "MEDIUM", "LOW"]),
  );
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const toggleFilter = useCallback((level: SeverityLevel) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(level)) {
        if (next.size > 1) next.delete(level);
      } else {
        next.add(level);
      }
      return next;
    });
  }, []);

  const scrollToHit = useCallback((idx: number) => {
    const el = document.getElementById(`hit-${idx}`);
    if (!el) return;

    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
    }

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ring-2", "ring-amway-dark");
    highlightTimerRef.current = setTimeout(
      () => el.classList.remove("ring-2", "ring-amway-dark"),
      2000,
    );
  }, []);

  const flaggedCount = hitMap.size;

  return (
    <div
      className="card-amway p-0! overflow-hidden animate-fade-in-up"
      style={{ animationDelay: "200ms" }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="heading-amway text-lg">Full Transcript</h3>
          <span className="text-xs text-gray-400">
            {sentences.length} sentences &middot; {flaggedCount} flagged
          </span>
        </div>

        {/* Severity filter toggles */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 mr-1">Filter:</span>
          {severityConfig.map(({ level, color, bg, border, label }) => {
            const isActive = activeFilters.has(level);
            return (
              <button
                key={level}
                onClick={() => toggleFilter(level)}
                className={`
                  px-2.5 py-1 rounded-full text-xs font-medium border transition-all
                  ${isActive ? `${bg} ${color} ${border}` : "bg-gray-100 text-gray-400 border-gray-200 opacity-50"}
                `}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transcript body */}
      <div className="max-h-72 overflow-y-auto px-6 py-4 text-body-amway leading-loose text-[15px]">
        {sentences.map((sentence) => {
          const hits = hitMap.get(sentence.idx);

          if (!hits) {
            return (
              <span key={sentence.idx} className="inline">
                {sentence.text}{" "}
              </span>
            );
          }

          const severity = getHighestSeverity(hits);
          const isFiltered = activeFilters.has(severity);
          const categories = [...new Set(hits.map((h) => h.category))]
            .map((c) => formatCategory(c))
            .join(", ");

          if (!isFiltered) {
            return (
              <span key={sentence.idx} className="inline">
                {sentence.text}{" "}
              </span>
            );
          }

          return (
            <span
              key={sentence.idx}
              className="relative inline-block my-1"
              onMouseEnter={() => setHoveredIdx(sentence.idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <span
                className={`${severityStyles[severity]} rounded px-2 py-1 cursor-pointer transition-all hover:shadow-sm inline-block`}
                onClick={() => scrollToHit(sentence.idx)}
              >
                <span className="text-[10px] font-mono opacity-50 mr-1.5">
                  S{sentence.idx + 1}
                </span>
                {sentence.text}
              </span>

              {/* Tooltip */}
              {hoveredIdx === sentence.idx && (
                <span className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap animate-fade-in pointer-events-none">
                  <span className="font-semibold">{severity}</span>
                  <span className="mx-1.5 opacity-40">|</span>
                  {categories}
                  <span className="mx-1.5 opacity-40">|</span>
                  {hits
                    .map((h) => `${Math.round(h.confidence_score * 100)}%`)
                    .join(", ")}{" "}
                  Confidence
                  <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-gray-900" />
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default HighlightedText;
