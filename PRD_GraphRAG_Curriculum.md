# PRD: Knowledge Graph + GraphRAG 실무 완성 과정
# YouTube 콘텐츠 제작 시스템

> **Version**: 1.0
> **Date**: 2026-02-07
> **Author**: Root Bricks Co., Ltd. (데이터공작소 TFT)
> **Status**: Ready for Development
> **Tool**: Claude Code

---

## 1. 프로젝트 개요

### 1.1 배경
"Knowledge Graph + GraphRAG 실무 완성 과정"은 총 7개 Part, 11시간 분량의 YouTube 교육 시리즈이다. 벡터 RAG의 한계를 인식한 엔지니어들이 GraphRAG를 실무에 도입할 수 있도록, 온톨로지 설계부터 프로덕션 배포까지 전체 파이프라인을 다룬다.

### 1.2 목적
이 PRD는 유튜브 콘텐츠 제작에 필요한 **모든 산출물**(PPT, HTML, 대본)을 일관된 품질로 대량 생산하기 위한 **빌드 시스템 요구사항**을 정의한다. Claude Code 환경에서 실행되며, `npm run build:all` 한 줄로 7개 Part × 3종 산출물 = 21개 파일을 생성한다.

### 1.3 핵심 원칙
- **깊이가 곧 가치**: 표면적 개요가 아닌 실무 수준의 디테일
- **투트랙 포맷**: PPT(시각적 임팩트) + HTML(코드 & 레퍼런스)
- **구어체 대본**: Vrew 음성 합성 최적화 (~거든요, ~잖아요 톤)
- **일관성 우선**: 7개 Part가 하나의 브랜드처럼 통일된 비주얼

---

## 2. 콘텐츠 스펙

### 2.1 시리즈 구조

| Part | 제목 | 시간 | 난이도 | 슬라이드(PPT) | 핵심 키워드 |
|------|------|------|--------|-------------|-----------|
| 1 | 왜 GraphRAG인가? | 2h | ⭐ | 14 | 벡터 RAG 한계, 1-hop 기준, Neo4j 첫 경험 |
| 2 | 수작업 KG | 2h | ⭐⭐ | 16 | 온톨로지 설계, Meta-Dictionary, Prefix 9가지 |
| 3 | LLM 자동화 | 2h | ⭐⭐⭐ | 15 | PathRAG 프롬프트, 구체화>일반화, 수작업 vs LLM 비교 |
| 4 | Entity Resolution | 1h | ⭐⭐⭐ | 11 | 중복 제거, 임베딩+LLM 조합, MERGE |
| 5 | 멀티모달 VLM | 2h | ⭐⭐⭐ | 18 | OCR vs VLM, 표→그래프 2가지, 문서 계층 |
| 6 | 통합 + 검색 | 1.5h | ⭐⭐⭐⭐ | 16 | Text2Cypher Agent, 하이브리드, Streamlit |
| 7 | 실무 적용 가이드 | 1h | ⭐⭐⭐⭐ | 20 | RAGAS, GDBMS 심화, 최적화 7가지, 클로징 |

### 2.2 Part별 산출물 (× 7 Parts = 21 파일)

| 산출물 | 포맷 | 역할 | 유튜브에서의 용도 |
|--------|------|------|----------------|
| **PPT** | .pptx | 시각적 임팩트 — 다이어그램, 비교표, 플로우차트 | 영상 중 슬라이드쇼 녹화 |
| **HTML** | .html | 코드 & 디테일 — 신택스 하이라이팅, 실행 가능 예제 | 영상 설명란 링크 (GitHub Pages) |
| **대본** | .md | Vrew 음성 합성용 구어체 스크립트 + 슬라이드 가이드 | 촬영 대본 + Vrew TTS 입력 |

### 2.3 촬영 워크플로우 (PPT + HTML 투트랙)

```
[영상 구간]          [화면 소스]         [산출물]
───────────────────────────────────────────────
개념 설명             PPT 슬라이드쇼      Part{N}.pptx
코드 시연             HTML 페이지          Part{N}.html (브라우저 화면 캡처)
라이브 데모           Neo4j Browser        실시간 화면
VS Code 실습         에디터               실시간 화면
───────────────────────────────────────────────
영상 설명란           "📚 전체 커리큘럼"    GitHub Pages 링크
```

---

## 3. 디자인 시스템

### 3.1 컬러 팔레트 (Deep Ocean + Cyan Accent)

```javascript
// config/theme.js
const COLORS = {
  bgDark:   "0A0E17",   // 배경 (진한)
  bgCard:   "111827",   // 카드 배경
  bgMid:    "1A2234",   // 중간 톤
  bgCode:   "0D1117",   // 코드 블록 배경

  accent:   "06D6A0",   // 메인 액센트 (시안-그린)
  blue:     "118AB2",   // 보조 (블루)
  purple:   "8338EC",   // 보조 (퍼플)
  orange:   "F77F00",   // 강조 (오렌지)
  red:      "EF476F",   // 경고/실패 (레드)
  yellow:   "FFD166",   // 하이라이트 (옐로)

  white:    "FFFFFF",
  textMain: "E8EDF5",   // 본문 텍스트
  textSub:  "8892A4",   // 보조 텍스트
  textDim:  "4A5568",   // 흐린 텍스트
  border:   "1E2D45",   // 테두리
};
```

### 3.2 타이포그래피

| 용도 | PPT 폰트 | HTML 폰트 | 사이즈 |
|------|---------|----------|--------|
| 슬라이드 제목 | Trebuchet MS | Playfair Display | 28~42pt / 2.5~3.8rem |
| 본문 | Calibri | Noto Sans KR | 11~14pt / 0.9~1rem |
| 코드 | Consolas | JetBrains Mono | 9~10pt / 0.82rem |
| 캡션/라벨 | Calibri | Noto Sans KR 300 | 9~10pt / 0.7~0.8rem |

### 3.3 PPT 디자인 규칙

- 다크 배경 (bgDark) 통일 — 라이트 슬라이드 없음
- 좌측 컬러 바 (Section별 색상 구분): Section 1 = cyan, 2 = blue, 3 = purple, 4 = orange, 5 = cyan, 6 = blue
- 상단 얇은 액센트 바 (타이틀 슬라이드만)
- 코드는 최대 8줄, 핵심만 — 상세 코드는 HTML로
- 카드 스타일 레이아웃 + shadow
- react-icons 아이콘 사용 (PNG 렌더링)
- **절대 금지**: 흰색 배경, 기본 불릿 리스트, 텍스트만 있는 슬라이드

### 3.4 HTML 디자인 규칙

- 스티키 타임라인 네비게이션 (Section 스크롤 스파이)
- 슬라이드별 카드: `🎤 대본` + `📺 화면 구성` + 코드 블록
- 코드 블록: 수동 신택스 하이라이팅 (CSS class 기반)
- 비교 테이블, 다이어그램, callout 박스
- 반응형 (모바일 대응)
- 하단 Footer: "깊이가 곧 가치 · Root Bricks Co., Ltd."

### 3.5 Section 컬러 매핑 (전 Part 공통)

```javascript
// Part 내 Section 순서별 좌측 바 컬러
const SECTION_COLORS = {
  1: COLORS.accent,   // 첫 번째 Section
  2: COLORS.blue,     // 두 번째
  3: COLORS.purple,   // 세 번째
  4: COLORS.orange,   // 네 번째
  5: COLORS.accent,   // 다섯 번째 (순환)
  6: COLORS.blue,     // 여섯 번째
};
```

---

## 4. 프로젝트 구조

### 4.1 디렉토리 레이아웃

```
graphrag-curriculum/
├── package.json
├── build.js                    # 전체 빌드 오케스트레이터
│
├── config/
│   ├── theme.js                # 컬러, 폰트, 공통 상수
│   ├── icons.js                # react-icons → PNG 렌더링 유틸
│   └── meta.js                 # Part별 메타데이터 (제목, 시간, 난이도, 섹션)
│
├── templates/
│   ├── pptx-base.js            # PPT 공통 헬퍼 (타이틀 슬라이드, 코드 블록, 테이블 등)
│   └── html-base.js            # HTML 공통 템플릿 (head, nav, footer, CSS)
│
├── content/
│   ├── part1/
│   │   ├── slides.js           # PPT 슬라이드 데이터 + 생성 로직
│   │   ├── page.js             # HTML 페이지 생성 로직
│   │   └── script.md           # 대본 뼈대 (이미 완성)
│   ├── part2/
│   │   ├── slides.js
│   │   ├── page.js
│   │   └── script.md
│   ├── ... (part3 ~ part7)
│
├── assets/
│   ├── icons/                  # 빌드 시 생성되는 아이콘 PNG 캐시
│   └── images/                 # 수동 추가 이미지 (필요 시)
│
├── output/
│   ├── pptx/                   # Part1~7.pptx
│   ├── html/                   # Part1~7.html
│   └── scripts/                # Part1~7_대본.md
│
└── docs/                       # GitHub Pages 배포용
    ├── index.html              # 커리큘럼 허브 페이지
    ├── part1.html
    ├── ... (part2 ~ part7)
    └── assets/
```

### 4.2 빌드 명령어

```bash
# 전체 빌드 (PPT 7개 + HTML 7개 + 대본 7개)
npm run build:all

# Part별 개별 빌드
npm run build:part1
npm run build:part3

# PPT만 / HTML만
npm run build:pptx
npm run build:html

# GitHub Pages 배포용 docs 폴더 생성
npm run build:docs

# QA: PPT → PDF → 이미지 변환 (시각 검수)
npm run qa:slides
```

### 4.3 package.json 스크립트

```json
{
  "name": "graphrag-curriculum",
  "version": "1.0.0",
  "scripts": {
    "build:all": "node build.js --all",
    "build:pptx": "node build.js --pptx",
    "build:html": "node build.js --html",
    "build:part1": "node build.js --part 1",
    "build:part2": "node build.js --part 2",
    "build:part3": "node build.js --part 3",
    "build:part4": "node build.js --part 4",
    "build:part5": "node build.js --part 5",
    "build:part6": "node build.js --part 6",
    "build:part7": "node build.js --part 7",
    "build:docs": "node build.js --docs",
    "qa:slides": "node build.js --qa"
  },
  "dependencies": {
    "pptxgenjs": "^4.0.1",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-icons": "^4.12.0",
    "sharp": "^0.33.0"
  }
}
```

---

## 5. 컴포넌트 상세 스펙

### 5.1 config/theme.js

전체 디자인 시스템의 단일 진실 공급원(Single Source of Truth).

```javascript
module.exports = {
  COLORS,                    // 3.1 컬러 팔레트
  FONTS: { title, body, code },
  SECTION_COLORS,            // 3.5 Section 컬러 매핑
  
  // PPT 전용
  PPT: {
    layout: "LAYOUT_16x9",
    shadow: () => ({...}),   // 매번 새 객체 반환 (pptxgenjs 뮤테이션 방지)
    fontSize: { title: 28, subtitle: 18, body: 12, code: 9, caption: 10 },
  },
  
  // HTML 전용
  HTML: {
    googleFonts: "Noto+Sans+KR:wght@300;400;500;700;900&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:wght@700;900",
  },
};
```

### 5.2 config/meta.js

Part별 메타데이터. 빌드 시 PPT 타이틀, HTML 헤더, 네비게이션에 자동 반영.

```javascript
module.exports = [
  {
    part: 1,
    title: "왜 GraphRAG인가?",
    subtitle: "기초",
    duration: "2시간",
    difficulty: 1,       // ⭐ 개수
    totalSlides: 14,
    milestone: "Neo4j에 첫 그래프 생성 완료 (노드 7개 + 관계 5개)",
    sections: [
      { id: "sec1", title: "벡터 RAG의 한계", time: "20min", color: "accent" },
      { id: "sec2", title: "전략적 관점", time: "15min", color: "blue" },
      { id: "sec3", title: "온톨로지 핵심", time: "25min", color: "purple" },
      { id: "sec4", title: "6레이어 프레임워크", time: "15min", color: "orange" },
      { id: "sec5", title: "인프라: Why Neo4j", time: "5min", color: "accent" },
      { id: "sec6", title: "Neo4j + Cypher 실습", time: "40min", color: "blue" },
    ],
    nextPreview: {
      title: "Part 2: \"직접 해봐야 안다\" — 수작업 KG",
      desc: "뉴스 기사 10개에서 노드 15개, 관계 20개를 손으로 직접 추출하는 '고통의 시간'"
    },
  },
  // ... part2 ~ part7
];
```

### 5.3 templates/pptx-base.js

PPT 슬라이드 공통 헬퍼 함수. 매 Part에서 import하여 사용.

```javascript
module.exports = {
  // 타이틀 슬라이드 (Part 표지)
  addTitleSlide(pres, meta, icons) { ... },
  
  // Section 헤더 슬라이드
  addSectionHeader(pres, { sectionNum, title, subtitle, time, color }) { ... },
  
  // 코드 블록 슬라이드 (좌: 코드, 우: 설명)
  addCodeSlide(pres, { title, codeLines, notes, color }) { ... },
  
  // 비교 테이블 슬라이드
  addComparisonTable(pres, { title, headers, rows, color }) { ... },
  
  // 플로우 다이어그램 슬라이드
  addFlowDiagram(pres, { title, nodes, color }) { ... },
  
  // 2-column 카드 슬라이드
  addTwoColumnCards(pres, { title, left, right, color }) { ... },
  
  // 3-column 카드 슬라이드
  addThreeColumnCards(pres, { title, cards, color }) { ... },
  
  // Milestone 슬라이드 (Part 마지막)
  addMilestoneSlide(pres, meta, icons) { ... },
  
  // Callout (키 메시지, 팁, 경고)
  addCallout(slide, { type, text, x, y, w }) { ... },
};
```

### 5.4 templates/html-base.js

HTML 공통 템플릿. 동적으로 Section 네비게이션과 콘텐츠를 삽입.

```javascript
module.exports = {
  // 전체 HTML 페이지 생성
  generatePage(meta, sections) {
    return `<!DOCTYPE html>...` // head + CSS + hero + nav + sections + footer + JS
  },
  
  // 슬라이드 카드 HTML
  slideCard({ tag, title, script, visual, code, callout, diagram, table }) { ... },
  
  // 코드 블록 HTML (신택스 하이라이팅)
  codeBlock(lang, lines) { ... },
  
  // 비교 테이블 HTML
  comparisonTable(headers, rows) { ... },
  
  // 다이어그램 HTML
  flowDiagram(nodes) { ... },
};
```

### 5.5 content/part{N}/slides.js

각 Part의 PPT 슬라이드 생성 로직. `pptx-base` 헬퍼를 조합하여 구성.

```javascript
// content/part1/slides.js
const base = require('../../templates/pptx-base');
const theme = require('../../config/theme');
const meta = require('../../config/meta')[0]; // Part 1

module.exports = async function buildPart1Slides(pres, icons) {
  base.addTitleSlide(pres, meta, icons);
  
  // Section 1: 벡터 RAG의 한계
  // Slide 1-1: 오프닝 질문
  // Slide 1-2: 청크 기반 맥락 단절
  // ...
  
  base.addMilestoneSlide(pres, meta, icons);
};
```

### 5.6 content/part{N}/page.js

각 Part의 HTML 페이지 생성 로직.

```javascript
// content/part1/page.js
const base = require('../../templates/html-base');
const meta = require('../../config/meta')[0];

module.exports = function buildPart1Page() {
  const sections = [
    {
      id: "sec1",
      slides: [
        {
          tag: "theory",
          title: "오프닝 — \"이 질문에 답할 수 있나요?\"",
          script: "여러분, RAG 해보신 분 많으시죠?...",
          visual: "화면 중앙에 질문 큰 글씨...",
        },
        // ...
      ]
    },
    // ...
  ];
  return base.generatePage(meta, sections);
};
```

---

## 6. 콘텐츠 컨벤션

### 6.1 대본 작성 규칙

```
[구어체 톤]
- ~거든요, ~잖아요, ~이에요 스타일
- "여러분" 호칭 사용
- 영어 키워드는 원어 유지 (GraphRAG, Multi-hop, Cypher)

[구조]
- 각 슬라이드마다: 핵심 멘트 + 화면 가이드 + Vrew 메모
- 강조 포인트: **굵게** 처리
- 호흡/정지: (1s), (0.5s) 등으로 표기

[Vrew 음성 합성 메모]
- 톤: Section별 분위기 지정 (진지, 유머, 격려 등)
- 강조: 반복해야 할 키워드 명시
- 호흡: 슬라이드 전환 시 pause 포인트
```

### 6.2 코드 예제 규칙

```
[PPT에서의 코드]
- 최대 8줄
- 핵심 문법만 (import, 설정 생략)
- 하이라이트: MATCH, CREATE, RETURN 등 키워드 강조
- 결과 주석 포함 (// → 국민연금 | SK하이닉스)

[HTML에서의 코드]
- 전체 실행 가능한 코드 (import부터 실행까지)
- 주석 풍부
- 예상 출력 결과 포함
- docker-compose, pip install 등 환경 설정 포함
```

### 6.3 다이어그램 컨벤션

```
[엔티티 노드]  → accent(cyan) 배경 + 텍스트
[관계 라벨]    → yellow 배경 + 둥근 모서리
[실패/경고]    → red 배경
[비활성]       → dim(회색) 배경
[화살표]       → textDim 색상
```

### 6.4 슬라이드 태그 (PPT + HTML 공통)

| 태그 | 색상 | 의미 |
|------|------|------|
| `theory` | blue | 이론/개념 |
| `demo` | red | 라이브 데모 |
| `practice` | cyan/accent | 실습 |
| `discussion` | purple | 토론/설계 |

---

## 7. 기존 산출물 (이미 완성)

### 7.1 대본 뼈대 (7개 완성)

| 파일 | 상태 | 위치 |
|------|------|------|
| Part1_대본_뼈대_v1.md | ✅ 완성 | content/part1/script.md |
| Part2_대본_뼈대_수작업KG.md | ✅ 완성 | content/part2/script.md |
| Part3_대본_뼈대_LLM자동화.md | ✅ 완성 | content/part3/script.md |
| Part4_대본_뼈대_EntityResolution.md | ✅ 완성 | content/part4/script.md |
| Part5_대본_뼈대_멀티모달VLM.md | ✅ 완성 | content/part5/script.md |
| Part6_대본_뼈대_통합검색.md | ✅ 완성 | content/part6/script.md |
| Part7_대본_뼈대_실무적용.md | ✅ 완성 | content/part7/script.md |

### 7.2 Part 1 완성본 (참조 구현)

| 파일 | 상태 | 용도 |
|------|------|------|
| Part1_왜_GraphRAG인가.pptx | ✅ 완성 | PPT 참조 구현 (14 슬라이드) |
| Part1_왜_GraphRAG인가.html | ✅ 완성 | HTML 참조 구현 (6 Section, 14 슬라이드) |

### 7.3 원본 커리큘럼 가이드

| 파일 | 용도 |
|------|------|
| graphrag_curriculum_guide_v3.0.md | 전체 커리큘럼의 원본 — 모든 콘텐츠의 Single Source of Truth |

---

## 8. 빌드 파이프라인 상세

### 8.1 build.js 메인 오케스트레이터

```
[Input]
  config/meta.js → Part별 메타데이터
  content/part{N}/slides.js → 슬라이드 데이터
  content/part{N}/page.js → HTML 콘텐츠
  content/part{N}/script.md → 대본

[Process]
  1. 아이콘 프리렌더링 (react-icons → PNG, 캐시)
  2. Part별 순회:
     a. slides.js → pptxgenjs → .pptx
     b. page.js → html-base → .html
     c. script.md → output/scripts/ 복사
  3. docs/ 폴더 생성 (GitHub Pages)
  4. 커리큘럼 허브 index.html 생성

[Output]
  output/pptx/Part{1-7}_*.pptx     (7개)
  output/html/Part{1-7}_*.html     (7개)
  output/scripts/Part{1-7}_대본.md  (7개)
  docs/index.html                  (허브)
  docs/part{1-7}.html              (7개)
```

### 8.2 QA 파이프라인

```
[PPT QA]
  1. pptx → PDF (LibreOffice headless)
  2. PDF → slide-{NN}.jpg (pdftoppm)
  3. markitdown으로 텍스트 추출 → 누락/오타 확인
  4. 이미지 시각 검수 (오버랩, 잘림, 여백)

[HTML QA]
  1. 파일 사이즈 확인
  2. 링크/앵커 유효성
  3. 브라우저 렌더링 스크린샷 (optional)
```

---

## 9. GitHub Pages 배포

### 9.1 구조

```
docs/
├── index.html          # 커리큘럼 허브
│                       # - 7개 Part 카드 나열
│                       # - 난이도 곡선 시각화
│                       # - 전체 아키텍처 다이어그램
│                       # - 시리즈 소개 + CTA
├── part1.html
├── part2.html
├── ...
├── part7.html
└── assets/
    └── style.css       # 공통 CSS (CDN 의존성 최소화)
```

### 9.2 허브 페이지 요구사항

- 시리즈 제목 + 부제
- 7개 Part 카드 (제목, 시간, 난이도, Milestone, 링크)
- 난이도 곡선 시각화 (⭐ → ⭐⭐⭐⭐)
- 전체 아키텍처 Before(회색) / After(컬러) 축소판
- YouTube 채널 링크 (AI ON, 온톨로지 랩)
- 브랜드: Root Bricks Co., Ltd. · 깊이가 곧 가치

---

## 10. 개발 순서 (Claude Code 작업 계획)

### Phase 1: 인프라 구축
```
1. package.json + 의존성 설치
2. config/theme.js — 디자인 시스템 상수
3. config/meta.js — 7개 Part 메타데이터
4. config/icons.js — 아이콘 렌더링 유틸
5. templates/pptx-base.js — PPT 공통 헬퍼
6. templates/html-base.js — HTML 공통 템플릿
7. build.js — 빌드 오케스트레이터
```

### Phase 2: Part 1 마이그레이션 + 검증
```
8. 기존 Part 1 PPT/HTML 코드를 새 구조로 리팩터링
9. content/part1/slides.js + page.js
10. npm run build:part1 → 출력 확인
11. 기존 Part 1과 비교 검증
```

### Phase 3: Part 2~7 콘텐츠 생성
```
12. content/part2/ ~ content/part7/ 순차 생성
    - 대본 뼈대(.md) 기반으로 slides.js, page.js 작성
    - 각 Part 빌드 + QA
13. npm run build:all → 전체 21개 파일 생성
```

### Phase 4: GitHub Pages 배포
```
14. docs/index.html (커리큘럼 허브)
15. npm run build:docs
16. GitHub Pages 배포 확인
```

---

## 11. 수용 기준 (Acceptance Criteria)

### 11.1 필수

- [ ] `npm run build:all` 실행 시 21개 파일 에러 없이 생성
- [ ] 7개 PPT가 동일한 디자인 시스템 (컬러, 폰트, 레이아웃) 적용
- [ ] 7개 HTML이 동일한 CSS/구조 적용 + 반응형 동작
- [ ] 모든 PPT에 코드는 최대 8줄 (상세 코드는 HTML에만)
- [ ] 모든 HTML에 실행 가능한 코드 예제 포함
- [ ] 대본 7개가 Vrew 음성 합성 메모 포함
- [ ] 각 Part 마지막에 Milestone + Next Part 예고 슬라이드 존재
- [ ] config/theme.js 수정 시 전체 PPT/HTML에 일괄 반영

### 11.2 권장

- [ ] GitHub Pages 허브 페이지 동작
- [ ] PPT → PDF → 이미지 QA 파이프라인 동작
- [ ] 각 Part HTML에 스크롤 스파이 네비게이션 동작
- [ ] 아이콘 캐시로 반복 빌드 시 속도 최적화

---

## 12. 참고 리소스

### 12.1 커리큘럼 원본
- `graphrag_curriculum_guide_v3.0.md` — 전체 11시간 커리큘럼 상세

### 12.2 외부 참고
| 리소스 | URL |
|--------|-----|
| 정이태님 GraphRAG 강의 | https://youtube.com/watch?v=zHN2jDZHvI0 |
| LangGraph Text2Cypher | https://python.langchain.com/docs/tutorials/graph/ |
| Pinterest Text2SQL | https://medium.com/pinterest-engineering/how-we-built-text-to-sql-at-pinterest-30bad30dabff |
| DB-engines Graph 랭킹 | https://db-engines.com/en/ranking/graph+dbms |
| GraphScope Flex (SIGMOD 2024) | 논문 |
| PathRAG | 논문 (arXiv) |

### 12.3 기술 스택
| 도구 | 용도 |
|------|------|
| pptxgenjs | PPT 생성 |
| react-icons + sharp | 아이콘 SVG → PNG |
| Node.js | 빌드 시스템 |
| LibreOffice (headless) | PPT → PDF 변환 (QA) |
| pdftoppm | PDF → 이미지 (QA) |
| GitHub Pages | HTML 배포 |

---

> **End of PRD v1.0**
>
> 이 문서는 Claude Code에서 프로젝트를 시작할 때 첫 번째로 읽어야 할 문서입니다.
> `graphrag_curriculum_guide_v3.0.md`와 함께 프로젝트의 두 축을 이룹니다.
> - **커리큘럼 가이드** = "무엇을 가르칠 것인가" (콘텐츠)
> - **이 PRD** = "어떻게 만들 것인가" (시스템)
