# 🚀 0단계: 미니 데모 — "5분 만에 시작하기"
# Stage 0: Mini Demo — "Get Started in 5 Minutes"

> **목표**: 노드 7개로 GraphRAG의 핵심 가치를 체험한다
> **소요 시간**: 5~10분
> **선수 지식**: 없음 (Neo4j 설치만 되어 있으면 OK)
> **커리큘럼 연동**: Part 1 (기초 — "왜 GraphRAG인가?")

---

## 이 데모에서 체험하는 것

```
❓ 질문: "접착 박리 결함의 원인 공정과 설비는?"

벡터 RAG: "접착 박리는 마찰재와 백플레이트의 분리입니다..." 
          → 정의만 나옴, 원인을 못 찾음 ❌

GraphRAG: 결함 → 검사 → 공정 → 설비 (3-hop 추적)
          → "열압착 공정의 열압착 프레스 HP-01이 원인입니다" ✅
```

## 그래프 구조 (노드 7개, 관계 8개)

```
[마찰재] ──USES_MATERIAL──▶ [혼합] ──NEXT──▶ [열압착] ──NEXT──▶ [연마]
                                               │   │
                                    USES_EQUIPMENT  CAUSED_BY_PROCESS
                                               │   │
                                               ▼   │
                                          [HP-01]   │
                                               ▲    │
                                    CAUSED_BY_EQUIPMENT
                                               │
                              [전단강도 시험] ◀──DETECTED_AT── [접착 박리]
                                    │
                                 INSPECTS
                                    │
                                    ▼
                                 [열압착]
```

## 실행 순서

| 순서 | 파일 | 할 일 | 소요 |
|------|------|-------|------|
| 1 | `00_mini_schema.yaml` | 온톨로지 구조 확인 (읽기만) | 1분 |
| 2 | `01_mini_data.json` | 샘플 데이터 확인 (읽기만) | 1분 |
| 3 | `02_neo4j_load.cypher` | Neo4j Browser에 복붙 실행 | 1분 |
| 4 | `03_first_query.cypher` | 핵심 질의 실행 → 결과 확인! | 1분 |
| 5 | `04_basic_text2cypher.py` | 자연어→Cypher 변환 체험 | 2분 |

---

## 🏆 Milestone

```
이 데모를 끝내면:
  ✅ Neo4j에 그래프가 들어가 있다
  ✅ 결함 → 검사 → 공정 → 설비 3-hop 추적이 된다
  ✅ "아, GraphRAG가 이런 거구나!" 이해
  ✅ 다음 단계(1단계)로 갈 동기부여 확보

다음 단계 (1단계 교육용 데모):
  → 노드 35개로 확장
  → 수작업 vs LLM 자동화 비교
  → ../stage-1-education/ 참조
```
