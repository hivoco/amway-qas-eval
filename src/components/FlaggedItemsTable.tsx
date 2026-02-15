import { useState, useMemo, useCallback } from "react";
import type { Hit } from "../types/index.ts";
import { formatCategory } from "../utils/formatCategory.ts";
import SortIcon, { type SortField, type SortDir } from "./SortIcon.tsx";
import FlaggedItemsMobile from "./FlaggedItemsMobile.tsx";
import { CheckCircleIcon } from "@phosphor-icons/react";

interface FlaggedItemsTableProps {
  hits: Hit[];
}

const levelColors: Record<string, string> = {
  HIGH: "bg-amway-red-light text-amway-red-dark border border-amway-red/30",
  MEDIUM:
    "bg-amway-yellow-light text-amway-yellow-dark border border-amway-yellow/40",
  LOW: "bg-amway-orange-light text-amway-orange-dark border border-amway-orange/30",
};

const levelWeight: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };

const FlaggedItemsTable = ({ hits }: FlaggedItemsTableProps) => {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("sentence_idx");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const categories = useMemo(
    () => [...new Set(hits.map((h) => h.category))],
    [hits],
  );

  const toggleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return field;
      }
      setSortDir("asc");
      return field;
    });
  }, []);

  const filteredHits = useMemo(() => {
    let result = hits;
    if (categoryFilter !== "all") {
      result = result.filter((h) => h.category === categoryFilter);
    }
    if (sourceFilter !== "all") {
      result = result.filter((h) => h.source === sourceFilter);
    }
    return [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === "sentence_idx") cmp = a.sentence_idx - b.sentence_idx;
      else if (sortField === "fault_level")
        cmp = levelWeight[b.fault_level] - levelWeight[a.fault_level];
      else cmp = b.confidence_score - a.confidence_score;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [hits, categoryFilter, sourceFilter, sortField, sortDir]);

  if (hits.length === 0) {
    return (
      <div className="card-amway text-center py-10 animate-fade-in">
        <CheckCircleIcon
          className="w-12 h-12 mx-auto text-amway-dark/20 mb-3"
          weight="duotone"
        />
        <p className="heading-amway text-lg">All Clear</p>
        <p className="text-body-amway text-sm mt-1">
          No compliance issues found in this transcript
        </p>
      </div>
    );
  }

  return (
    <div
      className="card-amway p-0! overflow-hidden animate-fade-in-up"
      style={{ animationDelay: "300ms" }}
    >
      {/* Header with filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="heading-amway text-lg">
            Flagged Items
            <span className="ml-2 text-sm font-normal text-gray-400">
              {filteredHits.length} of {hits.length}
            </span>
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-600 focus:border-amway-dark focus:ring-1 focus:ring-amway-dark/20 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {formatCategory(c)}
                </option>
              ))}
            </select>

            {/* Source filter */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-600 focus:border-amway-dark focus:ring-1 focus:ring-amway-dark/20 outline-none"
            >
              <option value="all">All Sources</option>
              <option value="regex">Regex</option>
              <option value="llm">LLM</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-amway-light/50">
            <tr>
              <th
                className="text-left px-5 py-3 font-medium text-amway-dark cursor-pointer hover:bg-amway-light/80 transition-colors select-none"
                onClick={() => toggleSort("sentence_idx")}
              >
                #{" "}
                <SortIcon
                  field="sentence_idx"
                  sortField={sortField}
                  sortDir={sortDir}
                />
              </th>
              <th className="text-left px-5 py-3 font-medium text-amway-dark">
                Sentence
              </th>
              <th className="text-left px-5 py-3 font-medium text-amway-dark">
                Category
              </th>
              <th
                className="text-left px-5 py-3 font-medium text-amway-dark cursor-pointer hover:bg-amway-light/80 transition-colors select-none"
                onClick={() => toggleSort("fault_level")}
              >
                Level{" "}
                <SortIcon
                  field="fault_level"
                  sortField={sortField}
                  sortDir={sortDir}
                />
              </th>
              <th
                className="text-left px-5 py-3 font-medium text-amway-dark cursor-pointer hover:bg-amway-light/80 transition-colors select-none"
                onClick={() => toggleSort("confidence_score")}
              >
                Confidence{" "}
                <SortIcon
                  field="confidence_score"
                  sortField={sortField}
                  sortDir={sortDir}
                />
              </th>
              <th className="text-left px-5 py-3 font-medium text-amway-dark">
                Source
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredHits.map((hit, i) => (
              <tr
                key={`${hit.sentence_idx}-${hit.source}-${hit.category}-${i}`}
                id={`hit-${hit.sentence_idx}`}
                className="hover:bg-amway-light/10 transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">
                  {hit.sentence_idx + 1}
                </td>
                <td className="px-5 py-3.5 text-gray-800 max-w-md leading-relaxed">
                  {hit.text}
                </td>
                <td className="px-5 py-3.5">
                  <span className="badge-amway text-xs">
                    {formatCategory(hit.category)}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${levelColors[hit.fault_level]}`}
                  >
                    {hit.fault_level}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amway-dark rounded-full transition-all duration-700"
                        style={{ width: `${hit.confidence_score * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-medium tabular-nums">
                      {Math.round(hit.confidence_score * 100)}%
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${hit.source === "regex" ? "bg-amway-blue-light text-amway-blue-dark border border-amway-blue/30" : "bg-amway-purple-light text-amway-purple-dark border border-amway-purple/30"}`}
                  >
                    {hit.source === "regex" ? "Regex" : "LLM"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <FlaggedItemsMobile hits={filteredHits} levelColors={levelColors} />

      {/* Empty filtered state */}
      {filteredHits.length === 0 && hits.length > 0 && (
        <div className="px-6 py-10 text-center">
          <p className="text-gray-400 text-sm">
            No items match the current filters
          </p>
          <button
            onClick={() => {
              setCategoryFilter("all");
              setSourceFilter("all");
            }}
            className="text-amway-dark text-sm font-medium mt-2 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FlaggedItemsTable;
