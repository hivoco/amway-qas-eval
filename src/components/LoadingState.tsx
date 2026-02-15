import {
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  ClipboardTextIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";

interface LoadingStateProps {
  message: string;
  step?: number;
}

const steps: { label: string; Icon: ComponentType<IconProps> }[] = [
  { label: "Upload", Icon: CloudArrowUpIcon },
  { label: "Analyze", Icon: MagnifyingGlassIcon },
  { label: "Results", Icon: ClipboardTextIcon },
];

const LoadingState = ({ message, step = 1 }: LoadingStateProps) => {
  return (
    <div className="card-amway flex flex-col items-center justify-center py-14 gap-6 animate-scale-in">
      {/* Step indicators */}
      <div className="flex items-center gap-0 w-full max-w-xs">
        {steps.map((s, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === step;
          const isDone = stepNum < step;

          return (
            <div
              key={s.label}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300
                    ${isDone ? "bg-amway-dark text-white" : ""}
                    ${isActive ? "bg-amway-dark text-white ring-4 ring-amway-dark/20" : ""}
                    ${!isDone && !isActive ? "bg-gray-100 text-gray-400" : ""}
                  `}
                >
                  {isDone ? (
                    <CheckIcon className="w-4 h-4" weight="bold" />
                  ) : (
                    <s.Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium ${isActive || isDone ? "text-amway-dark" : "text-gray-400"}`}
                >
                  {s.label}
                </span>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-5 rounded-full overflow-hidden bg-gray-200">
                  <div
                    className="h-full bg-amway-dark rounded-full transition-all duration-500"
                    style={{ width: isDone ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Spinner */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-amway-light" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-amway-dark animate-spin" />
      </div>

      {/* Message */}
      <p className="text-body-amway text-base font-medium text-center">
        {message}
      </p>

      {/* Progress bar */}
      <div className="w-48 h-1.5 bg-amway-light rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-amway-dark rounded-full animate-progress-slide" />
      </div>
    </div>
  );
};

export default LoadingState;
