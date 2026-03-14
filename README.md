# TrustVault (Truthshade Finder)

TrustVault is an AI-assisted misinformation and manipulation detection system designed to process multi-channel inputs (text, images, documents, URLs, and audio/video) and produce a unified credibility assessment. The solution combines content ingestion, multilingual NLP, visual manipulation analysis, deepfake detection, and fact-check verification to generate an explainable trust score and auditable decision trail.

## Key Capabilities

- Multi-channel content ingestion (PDFs, images, text documents, URLs/web pages, voice/audio)
- Content pre-processing and extraction (text and audio extraction)
- Multilingual NLP and sentiment analysis with region-aware signals
- Fact-check coordination through external verification sources and APIs
- Visual manipulation detection (faces, pixels, artifacts)
- Deepfake detection (video and voice)
- WhatsApp forward analysis (forward identification, tracking, and verification)
- Unified credibility scoring with validation and review triggers
- Trusted knowledge base for verified evidence and references
- User-facing verification portal with simplified trust level
- Client analytics dashboard with detailed metrics and credibility score
- Administrative audit trail and forensic logs for full decision history

## Technical Architecture Overview

The system is organized into three primary layers:

### 1) Input Layer (Multi-Channel Content)

TrustVault accepts content through multiple channels:

- Upload content (PDF, image, text documents)
- Submit URL (web scraping)
- Type text input
- Voice/audio input (audio processing)

### 2) Content Ingestion and Pre-processing

Before analysis begins, the pipeline performs:

- Text extraction and normalization
- Audio extraction (where applicable)
- Format validation (rejecting unsupported or invalid inputs)
- Routing of valid content into the core processing hub

### 3) Core Processing Hub

The core processing hub is composed of specialized processing nodes:

**Left Inner Node**
- Multilingual NLP and sentiment analysis
- Regional language and geography signals (flags based on observed trends)

**Right Inner Node**
- Fact-check coordination
- API gateway integrations (e.g., verification/news APIs)

**Parallel Analysis Modules**
- Visual manipulation detection (faces, pixel-level artifacts)
- Deepfake detection (video and voice analysis)
- WhatsApp forward analysis (forward identification and tracking)
- External database synchronization (trusted fact databases and knowledge graphs)

### Unified Credibility Scoring Engine

Outputs from the processing hub are aggregated into a single credibility score. A validation step determines whether:

- The result is accepted and committed to the knowledge base, or
- The case requires additional review (for low-confidence or conflicting signals)

### Trusted Knowledge Base (Verified Storage)

Verified results are stored in a trusted knowledge base to support:

- Evidence retention and reuse
- Faster future verification
- Cross-referencing against previously validated content

Suggested storage options include:
- MongoDB Atlas
- Elasticsearch (for search and retrieval)

## Outputs and Interfaces

### User-Facing Verification Portal
A simplified view of:
- Credibility score
- Trust level and classification

### Client Analytics Dashboard
Detailed reporting including:
- Credibility score (example: 78/100)
- Positive/negative indicators
- Content authenticity signals and metrics

### Administrative Audit Trail and Forensic Logs
A complete, traceable history of:
- Decisions and scoring inputs
- Feedback loops
- Review actions and validation outcomes

## analyze-news Edge Function

### How it produces credibility scores

The `supabase/functions/analyze-news` Supabase Edge Function performs a two-phase
evidence-aware analysis:

**Phase 1 – Claim extraction (RAG step)**

1. Up to 5 key verifiable claims are extracted from the input text using the AI model.
2. For each extracted claim a set of **trusted reference source links** is constructed
   from reputable fact-checking and news organisations:
   - Google Fact Check Explorer
   - Reuters, AP News
   - Snopes, PolitiFact, FactCheck.org
   - Wikipedia, WHO, CDC

These links are injected into the model prompt as grounding context before scoring
begins.

**Phase 2 – Structured credibility scoring**

The model is asked to produce a `report_analysis` tool call containing:

| Field | Description |
|---|---|
| `overall_score` | 0–100 overall credibility |
| `source_score` | 0–100 source reliability |
| `claims_score` | 0–100 claims accuracy |
| `risk_level` | `"low"` / `"medium"` / `"high"` |
| `segments` | Per-sentence breakdown with `level`, `evidence[]`, `evidence_strength` |
| `findings` | 3–5 key observations with `type`, `evidence[]`, `evidence_strength` |
| `explanation` | Human-readable explainable-AI reasoning |
| `schema_version` | `2` (added in v2 for backwards-compatibility tracking) |

**Conservative evidence rule (server-enforced)**

After the model returns its response, the server post-processes the output and
**downgrades any segment or finding whose `level`/`type` is `"verified"` but whose
`evidence_strength` is `"weak"` or `"none"` to `"questionable"`**.

This rule is also enforced by the system prompt: the model is explicitly instructed
that `"verified"` is only allowed when `evidence_strength` is `"strong"` or `"medium"`
and the `evidence` array contains at least one reputable URL.

**Deterministic generation**

All AI requests from this function use `temperature: 0` and `top_p: 0.1` to produce
consistent, reproducible results suitable for fact-checking.

### Backwards compatibility

The response shape is fully backwards-compatible with schema v1:

- All v1 fields (`overall_score`, `source_score`, `claims_score`, `risk_level`,
  `segments`, `findings`, `explanation`) are preserved unchanged.
- New fields (`evidence`, `evidence_strength` inside each segment/finding, and
  the top-level `schema_version: 2`) are additive.

Frontend code that only reads v1 fields will continue to work without modification.

### Required secrets / environment variables

| Variable | Where to set | Purpose |
|---|---|---|
| `LOVABLE_API_KEY` | Supabase Edge Function secrets | Auth token for the Lovable AI Gateway (`https://ai.gateway.lovable.dev`) |

**Security notes:**
- `LOVABLE_API_KEY` is read exclusively inside the Edge Function via
  `Deno.env.get("LOVABLE_API_KEY")` and is **never** exposed to the client.
- The `.env` file at the repo root contains only Supabase publishable/project
  values (`VITE_SUPABASE_*`) which are safe for client-side use. Never add
  `LOVABLE_API_KEY` to `.env`.

## Technology Used (as per slides)

### Frontend and Interface
- React.js
- Next.js
- Chrome Extension API

### Backend and Database
- Node.js
- Python and FastAPI
- Model serving and orchestration
- MongoDB Atlas
- Vector databases

### Infrastructure and Services
- Cloud deployment (AWS / GCP)
- Fact-check APIs
- WhatsApp forward analysis integrations

## Team:Coding Divas

