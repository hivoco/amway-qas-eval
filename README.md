# Amway QAS — Video Transcript Compliance Analyzer

A web application that analyzes video transcript files for compliance violations. Upload a `.txt` transcript and receive a detailed evaluation highlighting flagged content by category, severity, and detection source.

## Features

- **Drag-and-drop file upload** — Upload `.txt` transcript files via drag-and-drop or file browser
- **3-step processing pipeline** — Upload → Analyze → Results with real-time progress indicators
- **Compliance score gauge** — Visual percentage showing overall transcript compliance
- **Category breakdown** — Summary cards with animated counts for categories like Earnings, Lifestyle, and Job Demeaning
- **Highlighted transcript view** — Full transcript with color-coded flagged sentences (High / Medium / Low severity), filterable by severity level with hover tooltips
- **Flagged items table** — Sortable and filterable table of all detected issues with confidence scores
- **Dual detection sources** — Issues detected via both Regex pattern matching and LLM-based analysis
- **Responsive design** — Mobile-friendly layout with card-based views on smaller screens

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for build tooling and dev server
- **Tailwind CSS 4** with custom Amway brand theme
- **ESLint** with React-specific plugins

## Project Structure

```
src/
├── App.tsx                        # Main app with useReducer state machine
├── main.tsx                       # React entry point
├── index.css                      # Tailwind config + Amway brand theme
├── types/
│   └── index.ts                   # TypeScript interfaces (Hit, Sentence, EvaluationResult, etc.)
├── services/
│   └── api.ts                     # API client (upload, process, status polling, fetchEvaluation)
└── components/
    ├── Header.tsx                 # App header with Amway logo
    ├── FileUpload.tsx             # Drag-and-drop file upload
    ├── LoadingState.tsx           # Multi-step progress indicator with spinner
    ├── ErrorBanner.tsx            # Dismissible error banner with retry
    ├── ResultsPanel.tsx           # Results container with compliance gauge
    ├── SummaryCards.tsx            # Category summary cards with animated counts
    ├── FlaggedItemsTable.tsx       # Sortable/filterable flagged items table
    └── HighlightedText.tsx        # Transcript view with highlighted flags
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

The dev server starts with a proxy configured to forward `/qas/*` requests to the backend API.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## API Integration

The app communicates with a backend QAS service through four endpoints (proxied via Vite in development):

| Endpoint               | Method | Description                                                                              |
| ---------------------- | ------ | ---------------------------------------------------------------------------------------- |
| `/qas/upload`          | POST   | Upload a transcript file (multipart/form-data)                                           |
| `/qas/process`         | POST   | Trigger document processing (JSON: `doc_id`, `input_s3_url`)                             |
| `/qas/status/{doc_id}` | GET    | Poll processing status (returns `processing` or `completed` with `final_evaluation_url`) |
| Evaluation URL         | GET    | Fetch final evaluation results from the S3 URL returned by status endpoint               |

### Workflow

1. **Upload** — `POST /qas/upload` with the `.txt` file → returns `{ status, doc_id, input_s3_url }`
2. **Process** — `POST /qas/process` with `{ doc_id, input_s3_url }` → returns `{ doc_id, input_s3_url }` (kicks off backend analysis)
3. **Poll** — `GET /qas/status/{doc_id}` every 10 seconds → returns `{ status: "processing" }` until done, then `{ status: "completed", final_evaluation_url }`
4. **Fetch Results** — `GET final_evaluation_url` → returns the full evaluation JSON with flagged sentences, hits, and summary

## Severity Levels

| Level  | Color  | Description                    |
| ------ | ------ | ------------------------------ |
| HIGH   | Red    | Critical compliance violations |
| MEDIUM | Yellow | Moderate compliance concerns   |
| LOW    | Orange | Minor compliance notes         |
