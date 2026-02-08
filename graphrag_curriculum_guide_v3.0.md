# 온톨로지 + GraphRAG 실무 과정 (11시간) - 커리큘럼 가이드 v3.0

> 📌 **참고**: 정이태님 GraphRAG 강의 (테디노트) 전체 반영
> 📅 **v3.0 업데이트**: 2026-02-07
> 📝 **v3.0 변경**: 학습 경험 최적화
> - Part 1 이론 과부하 해소 → GDBMS 심화를 Part 7로 이동
> - Part별 결과물(Milestone) 명확화 → "이 시간 끝나면 이것을 만든다"
> - Part 6 난이도 곡선 완화 → 기본 Text2Cypher 먼저 → Agent 심화
> - 선수 지식 및 난이도 곡선 명시

---

## 📚 목차

1. [수강 안내](#1-수강-안내)
2. [핵심 철학](#2-핵심-철학)
3. [프레임워크 6개 레이어](#3-프레임워크-6개-레이어)
4. [상세 커리큘럼 (11시간)](#4-상세-커리큘럼-11시간)
5. [학습 로드맵 & 난이도 곡선](#5-학습-로드맵--난이도-곡선)
6. [경쟁사 대비 차별화](#6-경쟁사-대비-차별화)
7. [제공 자료 목록](#7-제공-자료-목록)

---

## 1. 수강 안내

### 이런 분께 추천합니다

```
✅ 벡터 RAG를 해봤는데 한계를 느낀 분
✅ Knowledge Graph에 관심 있지만 시작이 어려운 분
✅ GraphRAG를 도입할지 말지 판단 기준이 필요한 분
✅ LLM 기반 데이터 파이프라인에 관심 있는 분
```

### 선수 지식

| 항목 | 수준 | 필수 여부 |
|------|------|----------|
| **Python** | 기본 문법, 함수, 패키지 설치 | ✅ 필수 |
| **LLM API** | OpenAI/Claude API 호출 경험 | ✅ 필수 |
| **RAG 기초** | 벡터 임베딩 + 유사도 검색 개념 이해 | ✅ 필수 |
| Neo4j | 설치/사용 경험 | ❌ 선택 (Part 1에서 배움) |
| LangChain | 사용 경험 | ❌ 선택 (실습 중 설명) |
| 그래프 이론 | 노드/엣지 개념 | ❌ 선택 (Part 1에서 배움) |

### 수강 후 할 수 있는 것

```
1. GraphRAG 도입 여부를 스스로 판단할 수 있다
2. 도메인 문서에서 Knowledge Graph를 구축할 수 있다
3. LLM으로 엔티티/관계를 자동 추출할 수 있다
4. 표/이미지 포함 문서를 그래프로 변환할 수 있다
5. Text2Cypher로 자연어 그래프 검색을 구현할 수 있다
6. GraphRAG 품질을 평가하고 개선할 수 있다
```

---

## 2. 핵심 철학

### GraphRAG 도입 판단 프로세스

```
Step 1: 도메인 특성 파악 (보험/법률 = 관계 중요, ROI 검토)
Step 2: 문서 분류 (단순 임베딩 vs 관계 중요 → 선별적 적용)
Step 3: 기획/문제정의 ("원인"과 "관계"가 우선인지 확인)
Step 4: 실패 케이스 추적 (벡터 RAG 리트리벌 실패 → 그래프 시각화)
Step 5: 스키마 셋업 (문제 명확 → 온톨로지 설계)

⭐ "초기 인터뷰가 가장 중요"
⭐ "GraphRAG부터 시작하지 마라. 문제 정의부터 하라"
⭐ "1-hop이면 벡터로 충분. Multi-hop이 필요하니까 GraphRAG를 쓰는 것"
```

### 온톨로지 = 합의의 도구

| 도메인 | 합의 필요성 | 난이도 |
|--------|----------|--------|
| 소셜네트워크 | 거의 없음 | ⭐ |
| 제조/통신 | 높음 | ⭐⭐⭐⭐ |
| 금융/보험/법률 | 매우 높음 | ⭐⭐⭐⭐⭐ |

### 3번의 GraphRAG 경험 유형

| 유형 | 검색 방식 | 핵심 과제 |
|------|---------|---------|
| Public Domain | Vector & Graph | Infrastructure, Domain to Graph |
| Enterprise Domain | Graph only | Why graph?, Prompt Engineering |
| Enterprise Document | Vector & Graph | **Evaluation, Reranking** |

---

## 3. 프레임워크 6개 레이어

```
L1 Strategy → L2 Data(Baseline) → L3 Infra → L4 Processing → L5 Deployment(평가)
     ↑                                                              │
     └────────── 유의미하지 않으면 L1으로 재검토 ←──────────────────┘
```

### Layer 1: Strategy
- 폐쇄망 → 오픈 모델 / 클라우드 → 상용 모델
- 코스트와 라우팅 직결

### Layer 2: Data
- 레퍼런스 설정 (메타데이터, 유저쿼리, 골든데이터셋)
- KG Build: Document(Lexical) vs Domain(Semantic)
- 엔티티 추출: 비용 큼, 구체화 > 일반화, 문제정의와 alignment

### Layer 3: Infrastructure
- 그래프 표현: Matrix / Edge List / Linked List / CSR
- GDBMS 선정 3기준: 생태계 + 성능(LDBC) + 적합성
- Neo4j가 GraphRAG 최적 (get_neighbors O(d), 생태계 1위)

### Layer 4: Processing
- Hard Prompting: CoT, IRCoT, Routing, Text2Cypher
- Soft Prompting: KG Embedding, Heterogeneous Graph Embedding
- Prompt Routing: Query → Task → Prompt Pool

### Layer 5: Deployment
- Text2Cypher Agent (generate→validate→correct→execute)
- 평가: Multi-hop + Common Knowledge
- 모니터링: LangSmith/LangFuse/Opik

---

## 4. 상세 커리큘럼 (11시간)

### 전체 구조 + 난이도 흐름

```
Part 1: 기초 (2h)       ⭐      ← "왜?" 이해 + Neo4j 첫 경험
Part 2: 수작업 KG (2h)   ⭐⭐    ← 손으로 직접 해보기 (체감)
Part 3: LLM 자동화 (2h)  ⭐⭐⭐   ← "자동화의 한계" 체감
Part 4: ER (1h)          ⭐⭐⭐   ← 실무 난관 체험
Part 5: VLM (2h)         ⭐⭐⭐   ← 멀티모달 확장
Part 6: 검색 (1.5h)      ⭐⭐⭐⭐ ← 기본→심화 단계적 진입
Part 7: 실무 (1h)        ⭐⭐⭐⭐ ← 평가 + 최적화 + 아키텍처
```

---

### Part 1: 기초 — "왜 GraphRAG인가?" (2시간) ⭐

> 🎯 **목표**: GraphRAG가 왜 필요한지 이해하고, Neo4j에 첫 데이터를 넣어본다
> 💡 **설계 의도**: 이론을 가볍게, 실습을 빠르게 — "일단 해보기"

| 시간 | 내용 | 형식 |
|------|------|------|
| 20min | **벡터 RAG 한계** | 이론 |
| | - 청크 기반 맥락 단절 데모 | |
| | - "1-hop이면 벡터로 충분" 기준 제시 | |
| | - 실패하는 질문 예시 보여주기 | |
| 15min | **전략적 관점 (가볍게)** | 이론 |
| | - 도입 판단 5단계 (개요만) | |
| | - 3가지 경험 유형 소개 | |
| | - 전체 아키텍처 다이어그램 맛보기 | |
| | ※ GDBMS 선정, 성능 최적화는 Part 7에서 심화 | |
| 25min | **온톨로지 핵심만** | 이론 |
| | - "합의의 도구"라는 것만 이해 | |
| | - DB 스키마 vs LPG (차이점만) | |
| | - 문서내 관계 vs 문서간 관계 | |
| | - Heterogeneous Graph 개념 (보험 예시) | |
| 15min | **6개 레이어 프레임워크** | 이론 |
| | - 전체 흐름만 빠르게 | |
| | - "각 Part에서 어떤 레이어를 다루는지" 로드맵 | |
| 5min | **인프라 (최소한만)** | 이론 |
| | - "왜 Neo4j인가" 한 줄 요약 | |
| | - 나머지는 Part 7에서 | |
| 40min | **Neo4j + Cypher 실습** | 실습 |
| | - Docker로 Neo4j 띄우기 | |
| | - CREATE/MATCH/WHERE 기초 | |
| | - 간단한 노드 5개 + 관계 만들기 | |
| | - Neo4j Browser에서 시각화 확인 | |

```
🏆 Milestone: Neo4j에 첫 그래프 생성 완료
   - 노드 5개, 관계 5개의 미니 그래프
   - "나도 그래프 DB를 쓸 수 있구나!" 자신감
```

---

### Part 2: 수작업 KG — "직접 해봐야 안다" (2시간) ⭐⭐

> 🎯 **목표**: 도메인 문서에서 엔티티/관계를 손으로 추출하고, KG를 구축한다
> 💡 **설계 의도**: Part 3 자동화의 가치를 체감하기 위한 "고통의 시간"

| 시간 | 내용 | 형식 |
|------|------|------|
| 30min | **온톨로지 설계 워크숍** | 토론 |
| | - 한국 IT 기업 도메인 | |
| | - Node Labels / Relationship Types 정의 | |
| | - ⭐ Relationship Prefix 9가지 학습 | |
| | - (can be found in → Reference 등) | |
| 20min | **Meta-Dictionary 만들기** | 실습 |
| | - 도메인 문서에서 관계 키워드 추출 | |
| | - JSON 구조로 패턴 정의 | |
| | - "도메인 전문가의 암묵지 → 체계화" | |
| 20min | **데이터 정제** | 실습 |
| | - 뉴스 기사 5~10개에서 엔티티/관계 수작업 추출 | |
| | - 엑셀에 정리 | |
| 30min | **Neo4j 직접 입력** | 실습 |
| | - CREATE 문으로 하나하나 입력 | |
| | - "이거 100개 문서면 어떻게 하지?" 체감 | |
| 20min | **쿼리 실습 + 시각화** | 실습 |
| | - Multi-hop 질문 직접 해보기 | |
| | - 벡터로 안 되는 질문이 그래프로 되는 순간 체험 | |

```
🏆 Milestone: 수작업 KG 완성
   - 노드 15개, 관계 20개의 정확한 KG
   - Meta-Dictionary (관계 패턴 JSON)
   - "이걸 수작업으로 하면 죽겠다" → Part 3 동기부여
```

---

### Part 3: LLM 자동화 — "자동화해도 완벽하지 않다" (2시간) ⭐⭐⭐

> 🎯 **목표**: LLM으로 엔티티/관계를 자동 추출하고, 수작업 대비 품질을 비교한다
> 💡 **설계 의도**: 자동화의 편리함 + 한계를 동시에 체감

| 시간 | 내용 | 형식 |
|------|------|------|
| 30min | **LLM 추출 프롬프트 설계** | 이론+실습 |
| | - PathRAG 프롬프트 구조 분석 | |
| | - Part 2 Meta-Dictionary를 프롬프트에 반영 | |
| | - ⭐ 구체화 > 일반화 원칙 | |
| | - 문제정의 ↔ 엔티티 추출 alignment | |
| | - 프롬프트 접근법: 논문 참고 → 비교 → 튜닝 | |
| 40min | **자동 추출 실행** | 실습 |
| | - Part 2와 같은 뉴스 기사로 LLM 추출 | |
| | - 최소 2개 모델 비교 (예: GPT-4o + Claude) | |
| 30min | **⭐ 수작업 vs LLM 비교 (하이라이트)** | 토론 |
| | - Part 2 결과물과 나란히 비교 | |
| | - 3메트릭 평가 (Variety/Accuracy/Relationship) | |
| | - LLM 평가 바이어스 주의 → 교차 평가 | |
| | - "어디가 틀렸는지" 오류 분석 | |
| 20min | **Neo4j 자동 적재** | 실습 |
| | - Python 스크립트로 일괄 적재 | |
| | - Part 2 수작업 대비 속도 비교 | |

```
🏆 Milestone: 자동 추출 KG + 품질 리포트
   - LLM이 만든 KG (노드 30+, 관계 50+)
   - 수작업 vs 자동 비교표
   - 모델별 강약점 정리
   - "자동화해도 검수는 필수구나" 깨달음
```

---

### Part 4: Entity Resolution — "같은 건데 다르게 들어갔다" (1시간) ⭐⭐⭐

> 🎯 **목표**: 중복/유사 엔티티를 통합하여 KG 품질을 높인다
> 💡 **설계 의도**: 실무에서 가장 고통스러운 부분을 미리 체험

| 시간 | 내용 | 형식 |
|------|------|------|
| 15min | **ER 개념 + 중요성** | 이론 |
| | - "삼성전자" vs "Samsung Electronics" vs "삼성" | |
| | - Entity 출처 추적의 중요성 | |
| | - LightRAG: 엔티티 관리용 KV Store | |
| 15min | **방법론 비교** | 이론 |
| | - Fuzzy Matching / 임베딩 유사도 / LLM / Senzing | |
| 30min | **실습: Part 3 KG의 중복 엔티티 통합** | 실습 |
| | - 실제 중복 찾기 → 통합 → KG 정리 | |

```
🏆 Milestone: 정제된 KG
   - 중복 제거 완료된 깨끗한 KG
   - ER 전후 노드 수 비교 (예: 45개 → 30개)
```

---

### Part 5: 멀티모달 VLM — "표와 이미지도 그래프로" (2시간) ⭐⭐⭐

> 🎯 **목표**: 표/이미지를 포함한 실무 문서를 그래프로 변환한다
> 💡 **설계 의도**: 텍스트만이 아닌 "진짜 문서"를 다루는 역량

| 시간 | 내용 | 형식 |
|------|------|------|
| 20min | **VLM 개념** | 이론 |
| | - OCR vs VLM 차이, 주요 모델 | |
| 20min | **표→그래프 두 가지 접근** | 이론 |
| | - 연관성 특화: 엔티티/관계 추출 → 그래프 | |
| | - 구조&텍스트 특화: LLM 요약 → 벡터화 + 그래프 | |
| | - 보험 도메인 실무 사례 | |
| 10min | **문서→그래프 계층 구조** | 이론 |
| | - Document→Chapter→Section→Chunk→Entity | |
| | - 개정 문서 관리 / "표는 SQL" — Pinterest 아이디어 | |
| 30min | **표 이미지 → 구조화 데이터** | 실습 |
| | - 보험 운영현황 표 / 재무제표 | |
| | - VLM API 호출 → 구조화 | |
| | - Table Summary Prompt (Pinterest 스타일) | |
| 30min | **구조화 데이터 → KG 적재** | 실습 |
| | - 연관성 특화 방식으로 엔티티/관계 매핑 | |
| | - 구조&텍스트 특화 방식으로 요약 노드 생성 | |
| | - Neo4j 적재 + Part 3 KG와 통합 | |
| 10min | **중간 점검** | 토론 |
| | - 지금까지 만든 KG 전체 시각화 | |
| | - 텍스트 + 표가 합쳐진 그래프 확인 | |

```
🏆 Milestone: 멀티모달 통합 KG
   - 텍스트(Part 3) + 표(Part 5) 통합 KG
   - 두 가지 표→그래프 방식 비교 결과
   - "진짜 문서도 그래프로 만들 수 있구나"
```

---

### Part 6: 통합 + 검색 — "자연어로 그래프를 검색한다" (1.5시간) ⭐⭐⭐⭐

> 🎯 **목표**: 자연어 질문 → 그래프 검색 → 답변 생성 파이프라인을 구축한다
> 💡 **설계 의도**: 기본 Text2Cypher부터 시작 → Agent로 심화 (난이도 곡선 완화)

| 시간 | 내용 | 형식 |
|------|------|------|
| 15min | **파이프라인 통합** | 실습 |
| | - 벡터 임베딩 추가 (하이브리드 준비) | |
| 25min | **⭐ 기본 Text2Cypher (입문)** | 실습 |
| | - 가장 단순한 형태부터 시작 | |
| | - LLM에 스키마 + 질문 → Cypher 생성 | |
| | - "잘 되는 것도 있고, 안 되는 것도 있다" 체험 | |
| | - Schema Tuning (include/exclude) | |
| | - ❓ "이걸 어떻게 개선하지?" → Agent로 전환 동기부여 | |
| 30min | **⭐ Text2Cypher Agent (심화)** | 실습 |
| | - LangGraph 파이프라인: generate → validate → correct → execute | |
| | - SemanticSimilarityExampleSelector (유사 few-shot 자동 선택) | |
| | - validate_cypher (6가지 체크 + 에러 예시) | |
| | - CypherQueryCorrector (규칙 기반 교정) | |
| | - correct_cypher (LLM 기반 교정) | |
| | - 기본 vs Agent 결과 비교 | |
| 20min | **하이브리드 검색 + 데모** | 실습 |
| | - 벡터 + Graph + RRF 통합 | |
| | - Prompt Routing (Query→Task→Prompt Pool) | |
| | - 메타 필터링 + 가지치기 | |
| | - RERANKER 적용 | |
| | - Streamlit 데모 UI | |

```
🏆 Milestone: 완성된 GraphRAG 시스템
   - 자연어 → 그래프 검색 → 답변 생성
   - 기본 Text2Cypher vs Agent 비교 체험
   - 하이브리드 검색 (벡터+그래프) 동작
   - Streamlit 데모에서 직접 질문해보기
```

---

### Part 7: 실무 적용 가이드 — "프로덕션으로 가는 길" (1시간) ⭐⭐⭐⭐

> 🎯 **목표**: 품질 평가, 성능 최적화, 운영 방법을 학습한다
> 💡 **설계 의도**: Part 1에서 맛보기로 넘긴 심화 이론 + 실무 가이드

| 시간 | 내용 | 형식 |
|------|------|------|
| 15min | **품질 평가** | 이론+데모 |
| | - RAGAS (Faithfulness, Relevancy) | |
| | - Multi-hop / Common Knowledge 메트릭 | |
| | - Baseline 비교 (벡터RAG vs GraphRAG) | |
| | - 질문 난이도 3단계 (Easy/Medium/Hard) | |
| | - Multi-hop 추론 4유형 | |
| | - 평가 데이터셋 설계 방법 | |
| | - LLM 평가 바이어스 → 교차 평가 | |
| 10min | **실패 케이스 + 트러블슈팅** | 이론 |
| | - LLM 잘못 추출 / VLM 표 못 읽음 | |
| | - Text2Cypher 삽질 사례 | |
| | - 문서 계층 검색 비용 폭발 / "좌절 금지" | |
| 15min | **⭐ GDBMS + 성능 최적화 (심화)** | 이론 |
| | - Part 1에서 넘긴 GDBMS 선정 3기준 상세 | |
| | -   생태계: DB-engines 랭킹, LangChain 연동 | |
| | -   성능: LDBC 벤치마크, 연산 복잡도 비교 | |
| | -   적합성: 저장 방식별 GDBMS (Neo4j/Kùzu/FalkorDB) | |
| | - Graph Query Languages (Cypher/Gremlin/GSQL/GQL) | |
| | - Neo4j 성능 최적화 7가지 | |
| | - GraphScope Flex 아키텍처 소개 | |
| | - ※ Part 1에서 Neo4j를 써봤으니 이제 "왜 이걸 선택했는지" 이해 | |
| 10min | **모니터링 + CI/CD** | 이론 |
| | - LangSmith / LangFuse / Opik | |
| | - 서브그래프 관리 (캐싱/정리/갱신) | |
| | - 개정 문서 증분 업데이트 | |
| 10min | **전체 아키텍처 복습 + 확장 방향** | 이론 |
| | - Server/RAG/Client 전체 그림 (Part 1 맛보기 → 지금은 다 이해) | |
| | - Palantir OAG 확장 방향 | |

```
🏆 Milestone: 실무 적용 체크리스트
   - GDBMS 선정 체크리스트 (내 프로젝트에 맞는 DB 판단)
   - Neo4j 성능 최적화 체크리스트
   - 품질 평가 기준 + 데이터셋 설계 가이드
   - "이제 내 프로젝트에 적용해볼 수 있겠다"
```

---

## 5. 학습 로드맵 & 난이도 곡선

### Part별 역할 — "왜 이 순서인가"

```
Part 1 (기초)          "왜?" → 동기부여 + 첫 경험
   ↓
Part 2 (수작업)        "어렵다!" → 수작업의 고통 체감
   ↓
Part 3 (LLM 자동화)    "편하다! 근데..." → 자동화의 한계 체감
   ↓
Part 4 (ER)            "같은 건데 다르다?!" → 실무 난관
   ↓
Part 5 (VLM)           "표도 된다!" → 확장감
   ↓
Part 6 (검색)          "진짜 작동한다!" → 기본→심화 단계적 성취
   ↓
Part 7 (실무)          "이제 내 프로젝트에!" → 자신감 + 실무 가이드
```

### 난이도 곡선

```
난이도
  ⭐⭐⭐⭐ │                                    ┌── Part 7
           │                               ┌──┘   (심화 이론)
  ⭐⭐⭐   │              ┌── Part 4 ── Part 5
           │         ┌──┘    ┌── Part 6a (기본)
  ⭐⭐     │    Part 2 ──── Part 3        Part 6b (Agent)
           │   ┌──┘
  ⭐       │ Part 1
           └──────────────────────────────────────────→ 시간
           
           초반: 완만한 상승 (자신감 확보)
           중반: 점진적 도전 (역량 축적)  
           후반: 심화 진입 (실무 준비)
```

### Part 6 난이도 분리 상세

```
기존 v2.2:
Part 6 전체가 Text2Cypher Agent → 갑자기 어려움 ⚠️

v3.0 개선:
Part 6a: 기본 Text2Cypher (25min)
  └── "스키마 넣고 LLM에 Cypher 만들어줘" → 간단!
  └── "어? 잘 안 되는 것도 있네" → 동기부여
       ↓
Part 6b: Text2Cypher Agent (30min)  
  └── "그래서 Agent가 필요하구나" → 자연스러운 전환
  └── generate→validate→correct→execute
```

### v2.2 대비 주요 변경 요약

| 변경 사항 | 이유 |
|----------|------|
| Part 1 이론 축소 (GDBMS 심화 → Part 7 이동) | 초보자 첫 2시간 이론 과부하 방지 |
| Part 1 Neo4j 실습 40min으로 확대 | "일단 해보기" 경험 강화 |
| Part 6 기본→심화 2단계 분리 | 급격한 난이도 상승 방지 |
| Part 7 GDBMS 심화 추가 (15min) | Neo4j 경험 후 "왜 이걸 선택했는지" 설명 |
| 전체 Part별 Milestone 추가 | 학습 동기 + 성취감 명확화 |
| 선수 지식 섹션 추가 | 수강 전 자기 판단 가능 |
| 난이도 곡선 시각화 | 전체 학습 흐름 이해 |

---

## 6. 경쟁사 대비 차별화 (30개 항목)

| 항목 | 패캠 | 우리 |
|------|:---:|:---:|
| 벡터 RAG 한계 설명 | ❌ | ✅ |
| GraphRAG 도입 판단 프로세스 | ❌ | ✅ |
| Meta-Dictionary (관계 추출 치트시트) | ❌ | ✅ |
| Relationship Prefix 9가지 | ❌ | ✅ |
| 수작업 → 자동화 비교 (체감형) | ❌ | ✅ |
| PathRAG 프롬프트 분석 | ❌ | ✅ |
| LLM 4종 비교 벤치마크 | ❌ | ✅ |
| 구체화 > 일반화 원칙 | ❌ | ✅ |
| Entity Resolution 심화 | ❌ | ✅ |
| VLM 멀티모달 | ❌ | ✅ |
| 표→그래프 두 가지 접근 | ❌ | ✅ |
| Pinterest Text2SQL 차용 | ❌ | ✅ |
| 보험 도메인 실무 사례 | ❌ | ✅ |
| Text2Cypher Agent (LangGraph) | ❌ | ✅ |
| CypherQueryCorrector | ❌ | ✅ |
| SemanticSimilarityExampleSelector | ❌ | ✅ |
| Schema Tuning (include/exclude) | ❌ | ✅ |
| **기본→심화 단계적 Text2Cypher** | ❌ | ✅ ← v3.0 |
| Prompt Routing 아키텍처 | ❌ | ✅ |
| 메타 필터링 + 가지치기 | ❌ | ✅ |
| Soft/Hard Prompting 체계 | ❌ | ✅ |
| RAGAS 평가 | ❌ | ✅ |
| Multi-hop / Common Knowledge 메트릭 | ❌ | ✅ |
| 질문 난이도 3단계 + 추론 4유형 | ❌ | ✅ |
| 평가 데이터셋 설계 방법 | ❌ | ✅ |
| LLM 평가 바이어스 교차 평가 | ❌ | ✅ |
| GDBMS 선정 가이드 (3기준 + 벤치마크) | ❌ | ✅ |
| Neo4j 성능 최적화 7가지 | ❌ | ✅ |
| 전체 아키텍처 다이어그램 | ❌ | ✅ |
| **Part별 Milestone + 난이도 곡선** | ❌ | ✅ ← v3.0 |
| 트러블슈팅 | ❌ | ✅ |
| Palantir OAG 관점 | ❌ | ✅ |

---

## 7. 제공 자료 목록

### 실습 자료

| 자료 | 용도 | Part |
|------|------|------|
| GitHub 레포 (전체 코드) | 실습 | 전체 |
| 샘플 데이터 (뉴스 + 표 + 보험) | 실습 | 2,3,5 |
| Docker Compose (Neo4j) | 환경 | 1 |
| Meta-Dictionary 템플릿 (9가지 관계 JSON) | 실습 | 2 |
| PathRAG 프롬프트 템플릿 | 실습 | 3 |
| Table Summary Prompt (Pinterest 스타일) | 실습 | 5 |
| Upstage API 가이드 | 실습 | 5 |
| Text2Cypher Agent 코드 (LangGraph) | 실습 | 6 |
| CypherQueryCorrector | 실습 | 6 |
| validate/correct 프롬프트 템플릿 | 실습 | 6 |
| RAGAS 평가 코드 | 실습 | 7 |
| LLM 비교 평가 코드 | 실습 | 3,7 |

### 참고 자료

| 자료 | 용도 | Part |
|------|------|------|
| 온톨로지 YAML (도메인별) | 참고 | 2 |
| 보험 도메인 온톨로지 (5노드/4관계) | 참고 | 5 |
| GDBMS 선정 체크리스트 | 참고 | 7 |
| Neo4j 성능 최적화 체크리스트 | 참고 | 7 |
| 전체 아키텍처 다이어그램 | 참고 | 1,7 |
| 트러블슈팅 가이드 | 참고 | 7 |
| Text2Cypher 템플릿 (도메인별) | 참고 | 6 |

---

## 🔗 참고 리소스

| 리소스 | URL |
|--------|-----|
| 정이태님 영상 | https://www.youtube.com/watch?v=zHN2jDZHvI0 |
| 정리글 | https://velog.io/@looa0807/GraphRAG-유튜브-영상-정리 |
| 금융감독원 보험 비교 | https://www.fsc.go.kr/po010103/84182 |
| Pinterest Text2SQL | https://medium.com/pinterest-engineering/how-we-built-text-to-sql-at-pinterest-30bad30dabff |
| LangChain Example Selectors | https://python.langchain.com/docs/how_to/#example-selectors |
| LangGraph Text2Cypher | https://python.langchain.com/docs/tutorials/graph/ |
| graphrag.com Text2Cypher | https://graphrag.com/reference/graphrag/text2cypher/ |
| CypherQueryCorrector | https://github.com/sakusaku-rich/cypher-direction-competition |
| DB-engines Graph 랭킹 | https://db-engines.com/en/ranking/graph+dbms |

**논문**: Graph-CoT (arXiv:2404.07103), Multi-hop QA (arXiv:2011.01060), COSMO (SIGMOD 2024), GraphScope Flex (SIGMOD 2024)

---

## 📅 버전 히스토리

| 날짜 | 버전 | 변경 |
|------|------|------|
| 2026-02-06 | v1.0 | 초안 |
| 2026-02-06 | v2.0 | Soft/Hard Prompting, 평가 메트릭, 3가지 경험 유형 |
| 2026-02-06 | v2.1 | 표/문서→그래프, Meta-Dictionary, Prompt Routing, LLM 벤치마크 |
| 2026-02-07 | v2.2 | Text2Cypher Agent, 평가 데이터셋, GDBMS 선정, 전체 아키텍처 |
| 2026-02-07 | **v3.0** | **학습 경험 최적화: Part 1 이론 경량화, Part별 Milestone, Part 6 난이도 곡선, 선수 지식, 수강 안내** |

---

> 💡 **핵심 메시지 7줄**
> 1. 문제 정의가 먼저 — "GraphRAG부터 시작하지 마라"
> 2. 암묵지를 Meta-Dictionary로 체계화
> 3. 표는 SQL, 문서는 계층 — 각각 다르게 접근
> 4. 가중치 싸움이 디자인을 결정
> 5. Text2Cypher = 삽질의 연속 → Agent로 해결
> 6. 1-hop이면 벡터로 충분 — Multi-hop이 존재 이유
> 7. 정답은 없다 — PoC, 상황별 선택, 교차 평가
>
> 🎓 **우리 강의 컨셉**: "어려운 것을 쉽게 설명한다"
