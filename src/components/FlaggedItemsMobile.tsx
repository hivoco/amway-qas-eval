import type { Hit } from "../types/index.ts";
import { formatCategory } from "../utils/formatCategory.ts";

interface FlaggedItemsMobileProps {
  hits: Hit[];
  levelColors: Record<string, string>;
}

const FlaggedItemsMobile = ({ hits, levelColors }: FlaggedItemsMobileProps) => {
  return (
    <div className="md:hidden divide-y divide-gray-100">
      {hits.map((hit, i) => (
        <div
          key={`${hit.sentence_idx}-${hit.source}-${hit.category}-${i}`}
          id={`hit-mobile-${hit.sentence_idx}`}
          className="p-4 space-y-3 animate-fade-in"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-gray-800 leading-relaxed flex-1">
              {hit.text}
            </p>
            <span className="text-[10px] font-mono text-gray-400 shrink-0">
              S{hit.sentence_idx + 1}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${levelColors[hit.fault_level]}`}
            >
              {hit.fault_level}
            </span>
            <span className="badge-amway text-xs">
              {formatCategory(hit.category)}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${hit.source === "regex" ? "bg-amway-blue-light text-amway-blue-dark border border-amway-blue/30" : "bg-amway-purple-light text-amway-purple-dark border border-amway-purple/30"}`}
            >
              {hit.source === "regex" ? "Regex" : "LLM"}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              {Math.round(hit.confidence_score * 100)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlaggedItemsMobile;
