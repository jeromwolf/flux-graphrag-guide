# flux-graphrag-guide

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38b2ac?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

Knowledge Graph + GraphRAG 실무 가이드 — 벡터 RAG의 한계를 넘어, 온톨로지 설계부터 프로덕션 배포까지

## 개요

**flux-graphrag-guide**는 Knowledge Graph와 GraphRAG 기술을 실무 수준에서 이해하고 적용할 수 있도록 설계된 한국어 인터랙티브 교육 플랫폼입니다. 이론부터 실제 프로덕션 배포까지 전 과정을 체계적으로 다루며, 제조업을 포함한 4개 도메인의 실제 유스케이스를 통해 학습합니다.

벡터 RAG의 한계를 인식하고, 구조화된 지식을 활용하는 GraphRAG로의 전환을 가이드합니다.

## 주요 기능

### 7개 Part 커리큘럼 (11시간)

| Part | 제목 | 시간 | 난이도 | 개요 |
|------|------|------|--------|------|
| 1 | 왜 GraphRAG인가? | 1h | ★ | 벡터 RAG의 한계와 GraphRAG의 필요성 |
| 2 | 직접 해봐야 안다 — 수작업 KG | 2h | ★★ | 처음부터 만드는 Knowledge Graph |
| 3 | 자동화해도 완벽하지 않다 — LLM 추출 | 1.5h | ★★★ | LLM 기반 자동 추출의 실제 |
| 4 | 같은 건데 다르게 들어갔다 — Entity Resolution | 1h | ★★★ | 개체 통합의 기술과 전략 |
| 5 | 표와 이미지도 그래프로 — 멀티모달 VLM | 2h | ★★★ | 비정형 데이터의 구조화 |
| 6 | 자연어로 그래프를 검색한다 — Text2Cypher | 1.5h | ★★★★ | 자연어 질의를 그래프 쿼리로 변환 |
| 7 | 프로덕션으로 가는 길 — 실무 적용 | 1h | ★★★★ | 프로덕션 배포 및 운영 |

### 4개 도메인 유스케이스

- **제조** (활성) - Stage 0~3 인터랙티브 데모 (7 nodes → 5K+ nodes)
- **금융** (개발 예정)
- **법률** (개발 예정)
- **IT/통신** (개발 예정)

### 5개 실전 가이드

1. **GraphRAG 도입 판단** - 조직에 필요한지 평가하는 체크리스트
2. **온톨로지 설계 패턴** - 도메인 특화 스키마 설계 방법론
3. **Text2Cypher 삽질 가이드** - 자주 하는 실수와 해결 방법
4. **Neo4j 최적화** - 성능 튜닝과 인덱싱 전략
5. **RAGAS 평가** - GraphRAG 품질 평가 및 측정

### 인터랙티브 데모

제조 도메인에서 단계적으로 복잡도를 높여가는 인터랙티브 시뮬레이션:

- **Stage 0**: 간단한 미니 데모 (7개 노드)
- **Stage 1**: 교육용 Knowledge Graph (35개 노드)
- **Stage 2**: 프로토타입 규모 (1K 노드)
- **Stage 3**: 프로덕션 규모 (5K+ 노드)

### 난이도 곡선 시각화

커리큘럼 진행에 따른 난이도 변화를 시각화하여 학습 목표 설정을 돕습니다.

## 기술 스택

| 분야 | 기술 |
|------|------|
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **UI Framework** | React 19 |
| **Styling** | Tailwind CSS 4 + CSS Variables (Scholar Light Theme) |
| **Typography** | Noto Sans KR, Playfair Display, JetBrains Mono |
| **Presentation** | pptxgenjs |
| **Language** | TypeScript 5.9 |

### 지원 기술 스택 (커리큘럼 콘텐츠)

![Neo4j](https://img.shields.io/badge/Neo4j-white?style=flat-square&logo=neo4j&logoColor=black)
![Python](https://img.shields.io/badge/Python-3.9+-blue?style=flat-square&logo=python)
![LangChain](https://img.shields.io/badge/LangChain-white?style=flat-square&logo=chainlink&logoColor=black)
![Cypher](https://img.shields.io/badge/Cypher-Query%20Language-green?style=flat-square)
![OpenAI](https://img.shields.io/badge/OpenAI-white?style=flat-square&logo=openai&logoColor=black)
![RAGAS](https://img.shields.io/badge/RAGAS-Evaluation-blue?style=flat-square)

## 설치 및 실행

### 요구사항

- Node.js 18+ 권장
- npm 또는 yarn

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 확인하세요.

### 프로덕션 빌드

```bash
npm run build
npm start
```

21개의 페이지가 포함된 정적 사이트로 빌드됩니다.

### PPTX 슬라이드 생성

각 Part별 PPTX 슬라이드를 생성할 수 있습니다.

```bash
# 모든 Part 슬라이드 생성
npm run build:pptx

# 특정 Part 슬라이드만 생성
npm run build:pptx:part1
npm run build:pptx:part2
# ... Part 7까지
```

생성된 PPTX 파일은 `public/slides/` 디렉토리에 저장됩니다.

### Lint 검사

```bash
npm run lint
```

## 프로젝트 구조

```
flux-graphrag-guide/
├── src/
│   ├── app/                          # Next.js App Router (21개 페이지)
│   │   ├── layout.tsx                # Root 레이아웃 (Navbar + Footer)
│   │   ├── page.tsx                  # 랜딩 페이지
│   │   ├── curriculum/
│   │   │   ├── page.tsx              # 7개 Part 개요 + 난이도 곡선
│   │   │   ├── layout.tsx            # Sidebar 레이아웃 (Client Component)
│   │   │   └── [part]/page.tsx       # Part 상세 페이지
│   │   ├── cases/
│   │   │   ├── page.tsx              # 도메인 목록
│   │   │   ├── [domain]/page.tsx     # 도메인 상세
│   │   │   └── [domain]/[stage]/
│   │   │       ├── page.tsx          # Stage 라우터
│   │   │       ├── ManufacturingStage0.tsx
│   │   │       ├── ManufacturingStage1.tsx
│   │   │       ├── ManufacturingStage2.tsx
│   │   │       └── ManufacturingStage3.tsx
│   │   └── guides/page.tsx           # 5개 실전 가이드
│   │
│   ├── components/
│   │   ├── ui/                       # 재사용 가능한 UI 컴포넌트
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── SlideCard.tsx
│   │   │   ├── FlowDiagram.tsx
│   │   │   ├── ComparisonTable.tsx
│   │   │   ├── Callout.tsx
│   │   │   ├── Milestone.tsx
│   │   │   ├── DifficultyCurve.tsx
│   │   │   ├── DifficultyBadge.tsx
│   │   │   ├── ScriptBlock.tsx
│   │   │   └── VisualBlock.tsx
│   │   ├── domain/                   # 도메인 특화 컴포넌트
│   │   │   ├── GraphViewer.tsx
│   │   │   ├── CypherRunner.tsx
│   │   │   └── StageProgress.tsx
│   │   └── guides/                   # 가이드 콘텐츠 컴포넌트
│   │
│   ├── data/
│   │   ├── curriculum-meta.ts        # 7개 Part 메타데이터
│   │   ├── domain-meta.ts            # 4개 도메인 메타데이터
│   │   ├── part1-content.ts
│   │   ├── part2-content.ts
│   │   ├── part3-content.ts
│   │   ├── part4-content.ts
│   │   ├── part5-content.ts
│   │   ├── part6-content.ts
│   │   ├── part7-content.ts
│   │   └── theme.ts                  # 디자인 토큰
│   │
│   └── styles/
│       └── globals.css               # CSS 변수 (Scholar Light Theme)
│
├── public/
│   ├── slides/                       # 생성된 PPTX 슬라이드
│   └── assets/                       # 정적 자산
│
├── scripts/
│   └── build-pptx.js                 # PPTX 생성 스크립트
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 디자인 시스템

### Scholar Light Theme

전문적이고 깔끔한 "Scholar Light" 테마를 사용합니다.

| 변수 | 값 | 용도 |
|------|-----|------|
| `--bg-primary` | `#ffffff` | 페이지 배경 |
| `--bg-secondary` | `#f8fafc` | 섹션/사이드바 배경 |
| `--bg-card` | `#ffffff` | 카드 배경 |
| `--bg-code` | `#f1f5f9` | 코드 블록 배경 |
| `--accent-cyan` | `#0ea5e9` | Primary 액센트 |
| `--accent-blue` | `#3b82f6` | Secondary 액센트 |
| `--accent-purple` | `#8b5cf6` | Tertiary 액센트 |
| `--text-primary` | `#0f172a` | 본문 텍스트 |
| `--text-secondary` | `#475569` | 보조 텍스트 |
| `--text-dim` | `#64748b` | 약한 텍스트 (레이블, 태그) |
| `--border` | `#e2e8f0` | 테두리 |

### 타이포그래피

- **본문**: Noto Sans KR (가변, 400-700)
- **제목**: Playfair Display (세리프, 고급스러움)
- **코드**: JetBrains Mono (고정폭, 기술성)

## 주요 개발 패턴

### 비동기 매개변수 처리

Next.js 16에서는 라우트 매개변수가 Promise로 제공됩니다:

```typescript
export default async function PartPage(props: {
  params: Promise<{ part: string }>;
}) {
  const params = await props.params;
  const partNumber = parseInt(params.part);
  // ...
}
```

### 동적 라우팅

도메인과 Stage는 메타데이터로 동적으로 라우팅됩니다:

```
/cases/manufacturing/stage-0
/cases/manufacturing/stage-1
/cases/manufacturing/stage-2
/cases/manufacturing/stage-3
```

### 콘텐츠 맵 패턴

각 Part의 콘텐츠는 `contentMap`을 통해 관리됩니다:

```typescript
const contentMap: Record<number, SectionContent[]> = {
  1: [/* Part 1 슬라이드 */],
  2: [/* Part 2 슬라이드 */],
  // ...
};
```

### CSS 변수 활용

컴포넌트에서 CSS 변수를 사용하여 일관된 테마를 유지합니다:

```typescript
<div style={{
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  borderColor: 'var(--border)'
}}>
```

## 환경 설정

**외부 API나 환경 변수가 필요하지 않습니다.** 이 프로젝트는 완전한 정적 콘텐츠 기반으로 동작합니다.

## 콘텐츠 상태

| 섹션 | 상태 |
|------|------|
| 커리큘럼 Part 1-7 | 완료 |
| 제조 Stage 0-3 | 완료 |
| 금융 / 법률 / IT-통신 | 개발 예정 (메타데이터 포함) |
| 5개 실전 가이드 | 완료 |
| PPTX 슬라이드 생성 | Part 1 완료 |

## 빌드 및 배포

### 정적 빌드

```bash
npm run build
```

21개의 페이지가 포함된 `out/` 디렉토리가 생성됩니다 (모두 HTML, CSS, JavaScript).

### Vercel 배포

Vercel에서 호스팅하는 경우 특별한 설정이 필요 없습니다. 리포지토리를 연결하면 자동으로 배포됩니다.

### 다른 플랫폼 배포

정적 호스팅을 지원하는 모든 플랫폼(GitHub Pages, Netlify, AWS S3 등)에서 배포 가능합니다.

## 개발 가이드

### 새로운 Part 추가

1. `src/data/part{N}-content.ts` 파일 생성
2. `src/data/curriculum-meta.ts`에 메타데이터 추가
3. `src/app/curriculum/[part]/page.tsx`에서 자동으로 라우팅됨

### 새로운 도메인 추가

1. `src/data/domain-meta.ts`에 도메인 정의
2. `src/app/cases/[domain]/page.tsx` 콘텐츠 작성
3. `src/app/cases/[domain]/[stage]/` 디렉토리에 Stage 컴포넌트 추가

### 색상 변경

테마 색상을 변경할 때:

1. `src/styles/globals.css`의 CSS 변수 수정
2. 컴포넌트 파일에 하드코딩된 `rgba()` 및 hex 값도 함께 수정

```bash
grep -r "rgba\|#[0-9a-fA-F]" src/ --include="*.tsx" --include="*.ts"
```

## 성능 최적화

- **SSG**: 모든 페이지가 빌드 시점에 정적 생성됨
- **이미지 최적화**: `next/image` 컴포넌트 사용
- **코드 스플리팅**: Next.js가 자동으로 청크 분할
- **CSS-in-JS**: Tailwind CSS 유틸리티 기반의 최소 번들 크기

## 라이센스

[라이센스 정보 추가 예정]

## 기여하기

이 프로젝트는 현재 Root Bricks Co., Ltd.에서 관리하고 있습니다.

## 문의 및 지원

문의사항이 있으신 경우 이슈를 등록해주세요.

---

**제작**: Root Bricks Co., Ltd. · FDE Academy

Knowledge Graph + GraphRAG 실무 가이드 — 벡터 RAG의 한계를 넘어, 온톨로지 설계부터 프로덕션 배포까지
