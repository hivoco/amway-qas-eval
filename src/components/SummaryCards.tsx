import { useEffect, useState, type JSX } from "react";
import {
  BriefcaseIcon,
  CurrencyDollarIcon,
  RocketIcon,
  WarningIcon,
  FlagIcon,
} from "@phosphor-icons/react";
import { formatCategory } from "../utils/formatCategory.ts";

interface SummaryCardsProps {
  summary: Record<string, number>;
  totalHits: number;
}

const categoryIcons: Record<string, JSX.Element> = {
  job_demeaning: <BriefcaseIcon className="w-5 h-5" weight="duotone" />,
  earnings: <CurrencyDollarIcon className="w-5 h-5" weight="duotone" />,
  lifestyle: <RocketIcon className="w-5 h-5" weight="duotone" />,
};

const defaultIcon = <WarningIcon className="w-5 h-5" weight="duotone" />;

function AnimatedCount({ target }: { target: number }) {
  const [count, setCount] = useState(target);

  useEffect(() => {
    if (target === 0) return;
    const duration = 600;
    const steps = 20;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => {
      clearInterval(interval);
      setCount(0);
    };
  }, [target]);

  return <>{count}</>;
}

const SummaryCards = ({ summary, totalHits }: SummaryCardsProps) => {
  const categories = Object.entries(summary);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Flags */}
      <div className="gradient-amway text-white rounded-xl p-5 flex flex-col justify-between animate-scale-in relative overflow-hidden">
        <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/5 rounded-full" />
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full" />
        <div className="flex items-center gap-2">
          <FlagIcon className="w-4 h-4 text-white/70" weight="bold" />
          <p className="text-white/80 text-sm font-medium">Total Flags</p>
        </div>
        <p className="text-4xl font-bold mt-3 relative">
          <AnimatedCount target={totalHits} />
        </p>
      </div>

      {/* Category Cards */}
      {categories.map(([category, count], i) => (
        <div
          key={category}
          className="card-amway-accent flex flex-col justify-between animate-fade-in-up"
          style={{ animationDelay: `${(i + 1) * 100}ms` }}
        >
          <div className="flex items-center gap-2">
            <span className="text-amway-dark/60">
              {categoryIcons[category] ?? defaultIcon}
            </span>
            <span className="text-xs font-semibold text-amway-dark/70 uppercase tracking-wide">
              {formatCategory(category)}
            </span>
          </div>
          <p className="text-3xl font-bold text-amway-dark mt-3">
            <AnimatedCount target={count} />
          </p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
