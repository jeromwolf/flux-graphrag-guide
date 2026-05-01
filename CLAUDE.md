# GraphRAG Guide Project

## Overview

Korean-language interactive educational platform for Knowledge Graph + GraphRAG.
Covers ontology design through production deployment across 13 curriculum parts (Foundation 1-7 + Advanced 8-13), 4 domain cases (1 active manufacturing + 3 coming-soon), and a companion YouTube series.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **React**: 19
- **Styling**: Tailwind CSS 4 + CSS Variables (Scholar Light Theme)
- **Fonts**: Noto Sans KR (body), Playfair Display (title), JetBrains Mono (code)
- **PPT Generation**: pptxgenjs
- **Path Alias**: `@/*` → `./src/*`

## Commands

```bash
npm run dev          # Dev server (default port 3000)
npm run build        # Production build (28 pages)
npm run lint         # ESLint
node scripts/build-pptx.js  # Generate PPTX slides
```

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Navbar + Footer)
│   ├── page.tsx                  # Landing page (글로벌 사례 + 트렌드 + YouTube 섹션 포함)
│   ├── overview/page.tsx         # GraphRAG 파이프라인 6단계 인포그래픽
│   ├── curriculum/
│   │   ├── page.tsx              # 13-part overview + difficulty curve
│   │   ├── layout.tsx            # Sidebar layout (client component)
│   │   └── [part]/page.tsx       # Part detail (imports part1-13 content)
│   ├── cases/
│   │   ├── page.tsx              # Domain list
│   │   ├── [domain]/page.tsx     # Domain detail
│   │   └── [domain]/[stage]/
│   │       ├── page.tsx          # Stage router
│   │       ├── ManufacturingStage0.tsx  # Mini demo (7 nodes)
│   │       ├── ManufacturingStage1.tsx  # Education (35 nodes)
│   │       ├── ManufacturingStage2.tsx  # Prototype (1K nodes)
│   │       └── ManufacturingStage3.tsx  # Production (5K+ nodes)
│   └── guides/page.tsx           # 5 practical guides (single page with expandable sections)
│
├── components/
│   ├── ui/           # CodeBlock, SlideCard, FlowDiagram, ComparisonTable,
│   │                 # Callout, Milestone, DifficultyCurve, DifficultyBadge,
│   │                 # ScriptBlock, VisualBlock, PdfDownloadButton
│   ├── domain/       # GraphViewer, CypherRunner, StageProgress
│   └── guides/       # GraphragDecisionGuide, OntologyDesignGuide,
│                     # Text2CypherGuide, Neo4jOptimizationGuide, RagasEvaluationGuide
│
├── data/
│   ├── curriculum-meta.ts    # 13 Part metadata (sections, duration, difficulty)
│   ├── domain-meta.ts        # 4 domains (1 active manufacturing + 3 coming-soon with full metadata)
│   ├── part1-content.ts ~ part13-content.ts  # Slide content per part
│   └── theme.ts              # Design token constants
│
└── styles/
    └── globals.css           # CSS variables (Scholar Light Theme)

scripts/
├── build-pptx.js             # PPTX generation entrypoint
├── pptx-base.js              # Shared PPTX utilities
├── content/part1~7-slides.js # Slide content (Parts 1-7 only)
├── generate_notebooks.py     # Jupyter notebook generation
└── ep1_script.md             # YouTube EP1 영상 대본

notebooks/
├── part1~13_*.ipynb           # 파트별 실습 노트북 (13개)
├── ep1_kg_building.ipynb      # YouTube EP1 실습 노트북
├── docker-compose.yml         # Neo4j 5 Community + APOC
├── requirements.txt           # Python dependencies
└── data/                      # 평가 데이터셋 (JSON)
```

## Design System

**Theme: Scholar Light** (white background, professional blue accents)

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg-primary` | `#ffffff` | Page background |
| `--bg-secondary` | `#f8fafc` | Section/sidebar background |
| `--bg-card` | `#ffffff` | Card background |
| `--bg-code` | `#f1f5f9` | Code block background |
| `--accent-cyan` | `#0ea5e9` | Primary accent |
| `--accent-blue` | `#3b82f6` | Secondary accent |
| `--accent-purple` | `#8b5cf6` | Tertiary accent |
| `--text-primary` | `#0f172a` | Main text |
| `--text-secondary` | `#475569` | Secondary text |
| `--text-dim` | `#64748b` | Muted text (labels, tags) |
| `--border` | `#e2e8f0` | Borders |

## Key Patterns

- **Async params**: Next.js 16 requires `params: Promise<{ slug: string }>` with `await params`
- **Tailwind v4**: Uses `@import "tailwindcss"` and `@layer base` for custom styles
- **Content map**: `curriculum/[part]/page.tsx` uses `contentMap: Record<number, SectionContent[]>` to map part numbers to slide content arrays
- **Dynamic routing**: `[domain]` resolves via `domainsMeta`, `[stage]` parses `stage-N` format
- **Inline styles**: Many components use inline `style={{}}` with CSS variables for theming. When changing colors, update BOTH `globals.css` variables AND hardcoded `rgba()` values in component files.

## Curriculum Structure

| Track | Parts | Hours | Description |
|-------|-------|-------|-------------|
| Foundation | Part 1-7 | 11.5h | Neo4j 기초 → LLM 자동화 → 통합 파이프라인 → 실무 적용 |
| Advanced | Part 8-13 | 11.5h | 프레임워크 비교 → 그래프 알고리즘 → Agentic → 캡스톤 |

## Content Status

| Section | Status |
|---------|--------|
| Curriculum Part 1-7 (Foundation) | Complete |
| Curriculum Part 8-13 (Advanced) | Complete |
| Pipeline Overview (/overview) | Complete |
| Manufacturing Stage 0-3 | Complete |
| Finance / Legal / IT-Telecom | Coming Soon (full metadata + stages + graph structure) |
| Guides (5 articles) | Complete |
| PPT Generation | Part 1-7 complete |
| Jupyter Notebooks | Part 1-13 구조 complete |
| Notebook: Part 2 (수작업 KG) | Runnable (제조 도메인, Run All 가능) |
| Notebook: Part 6 (Text2Cypher RAG) | Runnable (커리큘럼 표준, Run All 가능) |
| Notebook: Benchmark 20 (벤치마크) | Ready (Vector RAG vs GraphRAG, RAGAS 평가) |
| 평가 데이터셋 (eval_questions.json) | 20문항 (Easy 7 / Medium 7 / Hard 6), 커리큘럼 표준 |
| YouTube EP1 (노트북 + 대본) | Ready |
| Landing: 글로벌 KG 활용 사례 섹션 | Complete (Google, Amazon, LinkedIn, Netflix, Samsung, Naver) |
| Landing: 2025-2026 트렌드 섹션 | Complete (경량GraphRAG, Agentic KG, KG+LLM, 멀티모달 + 시장 전망) |
| Landing: YouTube 시리즈 섹션 | Complete (EP1 ready, EP2-3 coming soon) |
| Part 13 미래 전망 슬라이드 (sec6) | Complete (4 slides: GraphRAG 진화, Agentic KG, 멀티모달, 시장) |

## Important Notes

- No `.env` required (static content, no external APIs)
- Korean language throughout (UI, content, comments)
- Build must produce 28/28 pages with zero errors
- When changing theme colors: grep for hardcoded `rgba()` and hex values across all `src/` files
