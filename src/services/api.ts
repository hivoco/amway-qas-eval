import type {
  UploadResponse,
  ProcessRequest,
  ProcessApiResponse,
  StatusResponse,
  EvaluationResult,
} from "../types/index.ts";

const BASE_URL = "/qas";
const POLL_INTERVAL_MS = 10_000;

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<UploadResponse>;
}

export async function processDocument(
  req: ProcessRequest,
): Promise<ProcessApiResponse> {
  const res = await fetch(`${BASE_URL}/process`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Processing failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<ProcessApiResponse>;
}

export async function checkStatus(docId: string): Promise<StatusResponse> {
  const res = await fetch(`${BASE_URL}/status/${docId}`);

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Status check failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<StatusResponse>;
}

export async function pollUntilComplete(
  docId: string,
  signal?: AbortSignal,
): Promise<string> {
  while (true) {
    if (signal?.aborted) {
      throw new Error("Polling cancelled");
    }

    const status = await checkStatus(docId);

    if (status.status === "completed" && status.final_evaluation_url) {
      return status.final_evaluation_url;
    }

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, POLL_INTERVAL_MS);
      signal?.addEventListener(
        "abort",
        () => {
          clearTimeout(timer);
          reject(new Error("Polling cancelled"));
        },
        { once: true },
      );
    });
  }
}

export async function fetchEvaluation(url: string): Promise<EvaluationResult> {
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Failed to fetch evaluation (${res.status}): ${text}`);
  }

  return res.json() as Promise<EvaluationResult>;
}
