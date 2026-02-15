import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { EvaluationResult } from "../types/index.ts";
import ResultsPanel from "../components/ResultsPanel.tsx";

interface LocationState {
  result: EvaluationResult;
  fileName: string;
}

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  useEffect(() => {
    if (!state?.result) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.result) {
    return null;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <ResultsPanel
        result={state.result}
        fileName={state.fileName}
        onReset={() => navigate("/")}
      />
    </main>
  );
};

export default ResultsPage;
