// API Response Types

export interface UploadResponse {
  status: string;
  doc_id: string;
  input_s3_url: string;
}

export interface ProcessRequest {
  doc_id: string;
  input_s3_url: string;
}

export interface ProcessApiResponse {
  doc_id: string;
  input_s3_url: string;
}

export interface StatusResponse {
  status: "processing" | "completed";
  final_evaluation_url?: string;
}

export interface Sentence {
  idx: number;
  text: string;
}

export interface Hit {
  sentence_idx: number;
  text: string;
  category: string;
  fault_level: "HIGH" | "MEDIUM" | "LOW";
  confidence_score: number;
  source: "regex" | "llm";
}

export interface EvaluationResult {
  processed: {
    full_text: string;
    sentences: Sentence[];
  };
  regex_hits: Hit[];
  llm_hits: Hit[];
  summary: Record<string, number>;
}
