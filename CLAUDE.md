# GraphRAG Guide Project

## Overview

Korean-language interactive educational platform for Knowledge Graph + GraphRAG.
Covers ontology design through production deployment across 7 curriculum parts and 4 domain use cases.

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
npm run build        # Production build (21 pages)
npm run lint         # ESLint
node scripts/build-pptx.js  # Generate PPTX slides
```

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Navbar + Footer)
│   ├── page.tsx                  # Landing page
│   ├── curriculum/
│   │   ├── page.tsx              # 7-part overview + difficulty curve
│   │   ├── layout.tsx            # Sidebar layout (client component)
│   │   └── [part]/page.tsx       # Part detail (imports part1-7 content)
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
│   │                 # ScriptBlock, VisualBlock
│   └── domain/       # GraphViewer, CypherRunner, StageProgress
│
├── data/
│   ├── curriculum-meta.ts    # 7 Part metadata (sections, duration, difficulty)
│   ├── domain-meta.ts        # 4 domains (manufacturing active, 3 coming-soon)
│   ├── part1-content.ts ~ part7-content.ts  # Slide content per part
│   └── theme.ts              # Design token constants
│
└── styles/
    └── globals.css           # CSS variables (Scholar Light Theme)
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

## Content Status

| Section | Status |
|---------|--------|
| Curriculum Part 1-7 | Complete |
| Manufacturing Stage 0-3 | Complete |
| Finance / Legal / IT-Telecom | Coming Soon (metadata only) |
| Guides (5 articles) | Complete |
| PPT Generation | Part 1 complete |

## Important Notes

- No `.env` required (static content, no external APIs)
- Korean language throughout (UI, content, comments)
- Build must produce 21/21 pages with zero errors
- When changing theme colors: grep for hardcoded `rgba()` and hex values across all `src/` files
