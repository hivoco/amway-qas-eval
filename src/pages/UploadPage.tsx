import { useReducer, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { EvaluationResult } from "../types/index.ts";
import {
  uploadFile,
  processDocument,
  pollUntilComplete,
  fetchEvaluation,
} from "../services/api.ts";
import FileUpload from "../components/FileUpload.tsx";
import LoadingState from "../components/LoadingState.tsx";
import ErrorBanner from "../components/ErrorBanner.tsx";

type Phase = "idle" | "uploading" | "processing" | "fetching" | "error";

interface State {
  phase: Phase;
  fileName: string;
  error: string;
}

type Action =
  | { type: "START_UPLOAD"; fileName: string }
  | { type: "START_PROCESSING" }
  | { type: "START_FETCHING" }
  | { type: "ERROR"; error: string }
  | { type: "DISMISS_ERROR" };

const initialState: State = { phase: "idle", fileName: "", error: "" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START_UPLOAD":
      return { phase: "uploading", fileName: action.fileName, error: "" };
    case "START_PROCESSING":
      return { ...state, phase: "processing" };
    case "START_FETCHING":
      return { ...state, phase: "fetching" };
    case "ERROR":
      return { ...state, phase: "error", error: action.error };
    case "DISMISS_ERROR":
      return { ...state, phase: "idle", error: "" };
    default:
      return state;
  }
}

const UploadPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const lastFileRef = useRef<File | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleFileSelected = useCallback(
    async (file: File) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      lastFileRef.current = file;
      dispatch({ type: "START_UPLOAD", fileName: file.name });
      try {
        const uploadResult = await uploadFile(file);

        dispatch({ type: "START_PROCESSING" });
        const processResult = await processDocument({
          doc_id: uploadResult.doc_id,
          input_s3_url: uploadResult.input_s3_url,
        });

        // Poll /qas/status/{doc_id} every 10s until completed
        const finalEvaluationUrl = await pollUntilComplete(
          processResult.doc_id,
          controller.signal,
        );

        dispatch({ type: "START_FETCHING" });
        const evaluation: EvaluationResult =
          await fetchEvaluation(finalEvaluationUrl);

        navigate("/results", {
          state: { result: evaluation, fileName: file.name },
        });
      } catch (err) {
        if (controller.signal.aborted) return;
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        dispatch({ type: "ERROR", error: message });
      }
    },
    [navigate],
  );

  const handleRetry = useCallback(() => {
    if (lastFileRef.current) {
      handleFileSelected(lastFileRef.current);
    }
  }, [handleFileSelected]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {state.phase === "error" && (
        <div className="mb-6">
          <ErrorBanner
            message={state.error}
            onDismiss={() => dispatch({ type: "DISMISS_ERROR" })}
            onRetry={handleRetry}
          />
        </div>
      )}

      {(state.phase === "idle" || state.phase === "error") && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="heading-amway text-2xl sm:text-3xl mb-2">
              Video Transcript Analysis
            </h2>
            <p className="text-body-amway">
              Upload a transcript file to check for compliance issues
            </p>
          </div>
          <FileUpload onFileSelected={handleFileSelected} disabled={false} />
        </div>
      )}

      {state.phase === "uploading" && (
        <div className="max-w-md mx-auto">
          <LoadingState step={1} message="Uploading transcript..." />
        </div>
      )}

      {state.phase === "processing" && (
        <div className="max-w-md mx-auto">
          <LoadingState
            step={2}
            message="Analyzing content for compliance issues..."
          />
        </div>
      )}

      {state.phase === "fetching" && (
        <div className="max-w-md mx-auto">
          <LoadingState step={3} message="Loading evaluation results..." />
        </div>
      )}
    </main>
  );
};

export default UploadPage;
