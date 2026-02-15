import { WarningCircleIcon, XIcon } from "@phosphor-icons/react";

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

const ErrorBanner = ({ message, onDismiss, onRetry }: ErrorBannerProps) => {
  return (
    <div className="bg-amway-red-light border border-amway-red/20 rounded-xl p-5 flex items-start gap-4">
      <WarningCircleIcon
        className="w-6 h-6 text-amway-red shrink-0 mt-0.5"
        weight="bold"
      />
      <div className="flex-1 min-w-0">
        <p className="text-amway-red-dark font-medium text-sm">
          Something went wrong
        </p>
        <p className="text-amway-red text-sm mt-1 break-words">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 text-sm font-medium text-amway-red-dark hover:opacity-80 underline underline-offset-2"
          >
            Try Again
          </button>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="text-amway-red/60 hover:text-amway-red shrink-0"
        aria-label="Dismiss error"
      >
        <XIcon className="w-5 h-5" weight="bold" />
      </button>
    </div>
  );
};

export default ErrorBanner;
