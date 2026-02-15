import { useMemo } from "react";
import type { EvaluationResult, Hit } from "../types/index.ts";
import SummaryCards from "./SummaryCards.tsx";
import HighlightedText from "./HighlightedText.tsx";
import FlaggedItemsTable from "./FlaggedItemsTable.tsx";

interface ResultsPanelProps {
  result: EvaluationResult;
  fileName: string;
  onReset: () => void;
}

function ComplianceGauge({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#8DC63F" : score >= 50 ? "#FDD835" : "#E53935";

  return (
    <div className="flex flex-col items-center gap-1 ">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="8"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="animate-gauge-fill"
            style={{ "--gauge-offset": offset } as React.CSSProperties}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-800">{score}%</span>
        </div>
      </div>
      <span className="text-xs font-medium text-gray-500">Compliance</span>
    </div>
  );
}

const ResultsPanel = ({ result, fileName, onReset }: ResultsPanelProps) => {
  const allHits = useMemo(
    () =>
      [...(result.regex_hits ?? []), ...(result.llm_hits ?? [])].sort(
        (a, b) => a.sentence_idx - b.sentence_idx,
      ),
    [result.regex_hits, result.llm_hits],
  );

  const hitMap = useMemo(() => {
    const map = new Map<number, Hit[]>();
    for (const hit of allHits) {
      const existing = map.get(hit.sentence_idx);
      if (existing) {
        existing.push(hit);
      } else {
        map.set(hit.sentence_idx, [hit]);
      }
    }
    return map;
  }, [allHits]);

  const totalHits = allHits.length;
  const totalSentences = result.processed?.sentences?.length ?? 0;

  const complianceScore = useMemo(() => {
    if (totalSentences === 0) return 100;
    const flaggedSentences = hitMap.size;
    return Math.round(
      ((totalSentences - flaggedSentences) / totalSentences) * 100,
    );
  }, [totalSentences, hitMap.size]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-amway flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-5">
          <ComplianceGauge score={complianceScore} />
          <div>
            <h2 className="heading-amway text-2xl">Analysis Results</h2>
            <p className="text-body-amway text-sm mt-1">
              {fileName} &middot; {totalSentences} sentences analyzed
            </p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="btn-amway-outline text-sm px-4! py-2!"
        >
          Upload Another File
        </button>
      </div>

      <SummaryCards summary={result.summary ?? {}} totalHits={totalHits} />
      <FlaggedItemsTable hits={allHits} />
      <HighlightedText
        sentences={result.processed?.sentences ?? []}
        hitMap={hitMap}
      />
    </div>
  );
};

export default ResultsPanel;
