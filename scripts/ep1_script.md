# EP1: 제조 데이터로 지식그래프 만들기

> **시리즈**: 제조 GraphRAG 실전
> **에피소드**: EP1 / 시즌1
> **길이**: ~20분
> **스타일**: 공연나연 스타일 (실습 중심, 대화체, 핵심 반복)
> **대상**: Python 기초 가능한 개발자/데이터 엔지니어 (지식그래프 입문)
> **촬영일**: TBD

---

## 제작 메타

| 항목 | 내용 |
|------|------|
| 도메인 | 자동차 브레이크패드 제조 |
| 엔티티 5종 | Component(마찰재), Process(혼합/열압착/연마), Equipment(HP-01), Inspection(전단강도 시험), Defect(접착 박리) |
| 관계 7종 | NEXT, USES_EQUIPMENT, USES_MATERIAL, DETECTED_AT, INSPECTS, CAUSED_BY_PROCESS, CAUSED_BY_EQUIPMENT |
| 그래프 규모 | 7 노드, 8 관계 |
| 킬러 쿼리 | 3-hop 근본원인 분석 (Defect -> Inspection -> Process -> Equipment) |
| 필요 소프트웨어 | Neo4j (Desktop 또는 AuraDB Free), Python 3.10+, Jupyter Notebook |
| 노트북 파일 | `notebooks/ep1_kg_building.ipynb` |

---

## 섬네일 제안

| 요소 | 내용 |
|------|------|
| 메인 텍스트 | **ChatGPT가 못 푸는 질문** |
| 서브 텍스트 | 지식그래프 20분 만에 만들기 |
| 배경 | Neo4j 그래프 시각화 (파란/보라 노드, 빛나는 경로) |
| 포인트 | 빨간 X 표시 (ChatGPT 로고 위) + 초록 체크 (그래프 위) |

---

## 영상 설명란 (Description) 템플릿

```
EP1: 제조 데이터로 지식그래프 만들기 | 제조 GraphRAG 실전

ChatGPT에게 "접착 박리 결함의 원인 설비는?"이라고 물으면 답을 못합니다.
하지만 지식그래프가 있으면 Cypher 한 줄로 답할 수 있습니다.
이 영상에서 브레이크패드 제조 데이터로 7노드 지식그래프를 직접 만들고, 3-hop 근본원인 분석까지 해봅니다.

----

타임스탬프:
00:00 미리보기 - ChatGPT가 못 푸는 질문
00:30 브레이크패드 제조 데이터 소개
02:00 온톨로지 설계 (엔티티 5종, 관계 7종)
05:00 [실습 1] Neo4j 환경 세팅 + 첫 노드 생성
08:00 [실습 2] 7노드 지식그래프 완성
12:00 [실습 3] Cypher 쿼리로 인사이트 발굴
16:00 3-hop 근본원인 분석 (핵심!)
19:00 정리 + 다음 에피소드 예고

----

GitHub: [REPO_LINK]
노트북 다운로드: [NOTEBOOK_LINK]
Neo4j Aura Free Tier: https://neo4j.com/cloud/aura-free/

----

다음 에피소드: EP2 - Text2Cypher로 자연어 질의 [LINK]

#GraphRAG #지식그래프 #Neo4j #제조AI #Python
```

---

## 편집 포인트 (Key Edit Points)

| 시간 | 포인트 | 편집 효과 |
|------|--------|-----------|
| 00:05 | Hook - ChatGPT 실패 장면 | 글리치 효과 + 경고음, 텍스트 강조 |
| 04:30 | 온톨로지 다이어그램 완성 순간 | 노드가 하나씩 나타나는 빌드업 애니메이션 |
| 07:30 | 첫 노드 Neo4j 브라우저 표시 | 축하 효과음 + 화면 확대 |
| 16:30 | 3-hop 경로 추적 (킬러 씬) | 경로 하이라이트 애니메이션, 슬로우 빌드업, 각 hop마다 효과음 |
| 18:30 | Vector RAG vs GraphRAG 비교 | 화면 분할, 좌/우 대비 |

---

## 스크립트 본문

---

### 00:00 - 00:30 | 영상 미리보기 (Hook)

**화면**: Neo4j 그래프 시각화 몽타주. Cypher 쿼리가 타이핑되는 장면. 3-hop 경로가 파란색으로 빛나며 연결되는 애니메이션. 마지막에 ChatGPT 화면에 "정확한 답변을 드리기 어렵습니다" 표시.

**대본**:

ChatGPT에게 이 질문을 했습니다.

*(화면에 질문 텍스트 타이핑)*

"접착 박리 결함의 원인 설비는 뭐고, 그 설비를 사용하는 공정의 원자재는?"

*(ChatGPT 답변: 모호한 일반론)*

답을 못합니다. 당연하죠. 정보가 4개 문서에 흩어져 있으니까요.

*(화면 전환: Neo4j 그래프에서 경로가 빛나며 연결)*

하지만 지식그래프가 있으면? Cypher 한 줄로 답할 수 있습니다.

오늘 여러분도 직접 만들어봅니다. 20분이면 됩니다.

**편집 노트**: 빠른 컷. 글리치 전환 효과. 질문 텍스트는 타이핑 애니메이션. ChatGPT 실패 → 짧은 경고음. Neo4j 성공 → 밝은 효과음. 전체 30초 이내로 타이트하게.

---

### 00:30 - 02:00 | 브레이크패드 제조 데이터 소개

**화면**: 브레이크패드 실물 사진 → 제조 공정 다이어그램 (혼합 → 열압착 → 연마) → 4개 시스템 아이콘

**대본**:

자, 오늘 다룰 데이터는 자동차 브레이크패드 제조입니다.

*(브레이크패드 사진)*

여러분 차에 달린 이거요. 마찰재를 섞고, 열로 눌러 붙이고, 갈아서 만듭니다. 단순해 보이죠?

근데 공장에서 문제가 생겼습니다.

*(화면: "접착 박리 불량 발생!" 경고 알림)*

접착 박리. 마찰재가 벌판에서 떨어져 나온 겁니다. 브레이크가 안 되면... 네, 큰일 나죠.

자, 원인을 찾아야 합니다. 그런데 정보가 어디에 있냐.

*(화면: 4개 아이콘이 하나씩 등장)*

품질보고서에 "접착 박리 결함 발생"이라고 적혀 있고요,
공정매뉴얼에 "열압착 공정에서 전단강도 시험"이라고 되어 있고요,
설비이력에 "HP-01 설비 사용"이라고 나오고요,
자재관리에 "마찰재 CMP-001 투입"이라고 기록되어 있습니다.

4개 시스템. 4개 문서. 사람은 이걸 읽고 머릿속에서 연결할 수 있습니다.

*(머리 위에 전구 아이콘)*

근데 AI는요?

*(물음표)*

문서를 쪼개서 벡터로 저장하는 RAG로는, 3개 문서에 걸쳐 있는 관계를 한 번에 찾을 수 없습니다. 이게 오늘의 핵심 문제입니다.

**편집 노트**: 브레이크패드 사진은 라이선스 프리 이미지 사용. 4개 시스템 아이콘은 하나씩 팝업 애니메이션. "AI는요?" 부분에서 잠깐 침묵 + 물음표 효과.

---

### 02:00 - 05:00 | 온톨로지 설계 (데이터 속 그래프 관계)

**화면**: 슬라이드 (검은 배경, 네온 노드 다이어그램이 단계별로 빌드업)

**대본**:

이 문제를 풀려면, 먼저 데이터의 설계도가 필요합니다. 이걸 온톨로지라고 부릅니다.

*(화면: "Ontology = 데이터의 설계도")*

쉽게 말하면 이겁니다. 우리 도메인에 어떤 것들이 있고, 그것들이 어떻게 연결되는지 정의하는 거예요.

자, 브레이크패드 제조에서 중요한 것(엔티티)은 5가지입니다.

*(노드가 하나씩 화면에 등장, 각각 다른 색상)*

첫 번째, **Component**. 마찰재요. 만드는 재료입니다.

*(초록 노드: "CMP-001 마찰재")*

두 번째, **Process**. 혼합, 열압착, 연마. 만드는 과정이에요.

*(주황 노드 3개: "혼합" → "열압착" → "연마", NEXT 화살표로 연결)*

세 번째, **Equipment**. HP-01 열압착기. 사용하는 설비입니다.

*(파란 노드: "HP-01")*

네 번째, **Inspection**. 전단강도 시험. 검사하는 방법이에요.

*(보라 노드: "전단강도 시험")*

다섯 번째, **Defect**. 접착 박리. 발생하는 문제.

*(빨간 노드: "접착 박리")*

좋습니다. 이제 이것들을 연결해볼게요. 관계는 7종류입니다.

*(관계 화살표가 하나씩 그려짐)*

혼합 다음에 열압착, 열압착 다음에 연마. **NEXT** 관계로 공정 순서가 됩니다.

*(NEXT 화살표 2개 강조)*

열압착 공정은 HP-01 설비를 사용하죠? **USES_EQUIPMENT**.

*(열압착 → HP-01 화살표)*

열압착 공정은 마찰재를 사용합니다. **USES_MATERIAL**.

*(열압착 → CMP-001 화살표)*

전단강도 시험은 열압착 공정을 검사합니다. **INSPECTS**.

*(전단강도 → 열압착 화살표)*

접착 박리 결함은 전단강도 시험에서 발견되었죠. **DETECTED_AT**.

*(접착 박리 → 전단강도 화살표)*

그리고 이 결함의 원인. 열압착 공정 때문이니까 **CAUSED_BY_PROCESS**.

*(접착 박리 → 열압착 화살표)*

설비 원인도 있습니다. **CAUSED_BY_EQUIPMENT**.

*(접착 박리 → HP-01 화살표)*

자, 이제 전체 그림이 보이시죠?

*(완성된 온톨로지 다이어그램 전체 표시)*

7개 노드, 8개 관계. 이게 우리 온톨로지입니다.

그리고 이 설계가 있어야 나중에 LLM이 구조화된 지식을 추출할 수 있습니다. 온톨로지 없이 "알아서 추출해줘"라고 하면... 엉망이 됩니다. 이건 다음 에피소드에서 직접 보여드릴게요.

**편집 노트**: 노드 등장은 0.5초 간격 페이드인. 관계 화살표는 그려지는 애니메이션. 완성 순간에 카메라 살짝 줌아웃 + 효과음. 색상 코드: Component=초록, Process=주황, Equipment=파랑, Inspection=보라, Defect=빨강.

---

### 05:00 - 08:00 | [실습 1] Neo4j 환경 세팅 + 첫 노드 생성

**화면**: Jupyter Notebook (`ep1_kg_building.ipynb`) 전체 화면. 오른쪽 상단에 작은 Neo4j Browser PIP.

**대본**:

자, 이제 직접 만들어봅시다. 노트북 열어주세요.

*(Jupyter Notebook 화면)*

링크는 설명란에 있습니다. 그대로 따라하시면 됩니다.

먼저 Neo4j를 띄워야 합니다. 두 가지 방법이 있어요.

*(화면: 2개 옵션 슬라이드)*

옵션 A, Docker. 로컬에서 돌리고 싶으면 이거.

```bash
docker run -d --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password123 \
  neo4j:5
```

옵션 B, Neo4j Aura Free Tier. 설치 없이 클라우드에서 바로 쓰고 싶으면 이거. 무료입니다. 링크 설명란에 있어요.

저는 Docker로 갈게요.

*(Docker 실행, Neo4j Browser 접속)*

`localhost:7474` 접속하면 Neo4j Browser가 나옵니다. 아직 아무것도 없죠.

이제 Python에서 연결합니다.

*(Jupyter Notebook으로 전환)*

```python
from neo4j import GraphDatabase

driver = GraphDatabase.driver(
    "bolt://localhost:7687",
    auth=("neo4j", "password123")
)
```

연결됐으면, 첫 번째 노드를 만들어볼게요. 아까 온톨로지에서 봤던 마찰재입니다.

```python
with driver.session() as session:
    session.run("""
        CREATE (c:Component {
            id: 'CMP-001',
            name: '마찰재',
            type: '유기질'
        })
    """)
```

실행!

*(셀 실행)*

잘 됐는지 Neo4j Browser에서 확인해볼까요?

*(Neo4j Browser로 전환)*

```cypher
MATCH (n) RETURN n
```

*(초록색 노드 하나가 화면에 표시됨)*

오, 나왔습니다! 첫 노드! 마찰재 CMP-001. 여러분의 첫 번째 지식그래프 노드입니다.

*(짧은 축하 효과음)*

별거 아닌 것 같지만, 이 한 걸음이 중요합니다. 이 노드에 관계를 연결하기 시작하면 그때부터 마법이 일어나거든요.

**편집 노트**: Docker 명령어 실행 부분은 2배속 편집. Neo4j Browser에서 첫 노드 나오는 순간 확대 + 효과음. "pip install neo4j" 도 빠르게 보여줄 것. 코드 셀은 폰트 크기 키워서 가독성 확보.

---

### 08:00 - 12:00 | [실습 2] 7노드 지식그래프 완성

**화면**: Jupyter Notebook (좌 60%) + Neo4j Browser (우 40%) 분할 화면

**대본**:

좋습니다. 이제 나머지 6개 노드도 만들고, 관계까지 연결해서 전체 그래프를 완성합시다.

먼저 공정 노드 3개.

```python
with driver.session() as session:
    # Process 노드 3개
    session.run("""
        CREATE (p1:Process {id: 'PRC-001', name: '혼합', order: 1}),
               (p2:Process {id: 'PRC-002', name: '열압착', order: 2}),
               (p3:Process {id: 'PRC-003', name: '연마', order: 3})
    """)
```

*(실행)*

다음, Equipment.

```python
    session.run("""
        CREATE (e:Equipment {
            id: 'EQP-001',
            name: 'HP-01',
            type: '열압착기'
        })
    """)
```

Inspection.

```python
    session.run("""
        CREATE (i:Inspection {
            id: 'INS-001',
            name: '전단강도 시험',
            standard: 'KS R 9212'
        })
    """)
```

마지막, Defect.

```python
    session.run("""
        CREATE (d:Defect {
            id: 'DEF-001',
            name: '접착 박리',
            severity: 'Critical'
        })
    """)
```

실행. 좋아요. Neo4j Browser에서 확인해볼까요?

*(Neo4j Browser: MATCH (n) RETURN n → 7개 노드가 흩어져 표시)*

7개 노드가 다 들어갔습니다. 근데 아직 연결이 안 되어 있죠? 그냥 점 7개. 이러면 그래프가 아니라 그냥 테이블이에요.

이제 관계를 만듭니다. 여기서부터 진짜 그래프가 됩니다.

```python
with driver.session() as session:
    session.run("""
        // 공정 순서: NEXT
        MATCH (p1:Process {id: 'PRC-001'}),
              (p2:Process {id: 'PRC-002'}),
              (p3:Process {id: 'PRC-003'})
        CREATE (p1)-[:NEXT]->(p2),
               (p2)-[:NEXT]->(p3)
    """)

    session.run("""
        // 열압착 → 설비, 원자재
        MATCH (p:Process {id: 'PRC-002'}),
              (e:Equipment {id: 'EQP-001'}),
              (c:Component {id: 'CMP-001'})
        CREATE (p)-[:USES_EQUIPMENT]->(e),
               (p)-[:USES_MATERIAL]->(c)
    """)

    session.run("""
        // 검사 → 공정
        MATCH (i:Inspection {id: 'INS-001'}),
              (p:Process {id: 'PRC-002'})
        CREATE (i)-[:INSPECTS]->(p)
    """)

    session.run("""
        // 결함 관계
        MATCH (d:Defect {id: 'DEF-001'}),
              (i:Inspection {id: 'INS-001'}),
              (p:Process {id: 'PRC-002'}),
              (e:Equipment {id: 'EQP-001'})
        CREATE (d)-[:DETECTED_AT]->(i),
               (d)-[:CAUSED_BY_PROCESS]->(p),
               (d)-[:CAUSED_BY_EQUIPMENT]->(e)
    """)
```

실행!

*(Neo4j Browser 새로고침: 관계가 연결된 전체 그래프 시각화)*

와.

*(잠깐 감탄 포즈)*

7개 노드인데 벌써 이렇게 복잡한 관계가 보이네요. 정리해볼게요.

*(화면에 카운트 오버레이)*

- 노드: 7개
- 관계: 8개
- 엔티티 타입: 5종
- 관계 타입: 7종

이게 우리의 미니 지식그래프입니다. 작지만, 이 안에 3-hop 추론이 가능한 구조가 들어 있습니다. 아까 온톨로지에서 설계했던 그대로죠.

**편집 노트**: 코드 입력 부분은 타이핑 효과가 아닌 블록 단위 하이라이트로 진행. Neo4j Browser에서 관계 연결 후 그래프 시각화 나오는 순간이 이 섹션의 하이라이트 - 카메라 줌인 후 줌아웃. 노드 색상은 온톨로지 섹션과 동일하게 맞출 것 (Neo4j Browser 설정). 카운트 오버레이는 우측 하단에 반투명 박스.

---

### 12:00 - 16:00 | [실습 3] Cypher 쿼리로 인사이트 발굴

**화면**: Jupyter Notebook 전체 화면. 쿼리 결과는 pandas DataFrame 또는 텍스트 출력.

**대본**:

그래프가 완성됐으니, 이제 질문을 해봅시다. 그래프에 질문하는 언어가 Cypher입니다.

SQL 아시죠? SQL이 테이블에 질문하는 언어라면, Cypher는 그래프에 질문하는 언어입니다.

문법이 직관적이에요. 한번 보시면 바로 이해됩니다.

**쿼리 1: 전체 그래프 조회**

```cypher
MATCH (n) RETURN n
```

*(실행 → 7개 노드 전체 반환)*

MATCH는 "찾아라", RETURN은 "보여달라". 끝. 전체 노드를 다 가져옵니다.

**쿼리 2: 공정 흐름 확인**

```cypher
MATCH (p1:Process)-[:NEXT]->(p2:Process)
RETURN p1.name AS 이전공정, p2.name AS 다음공정
```

*(실행 → 혼합→열압착, 열압착→연마)*

혼합 다음에 열압착, 열압착 다음에 연마. 공정 순서가 바로 보이죠. 이걸 테이블에서 하려면 JOIN을 걸어야 하는데, 그래프에서는 화살표 하나면 됩니다.

**쿼리 3: 특정 설비 조회 (1-hop)**

자, 이 질문을 해봅시다. "열압착 공정에서 사용하는 설비는?"

```cypher
MATCH (p:Process {name: '열압착'})-[:USES_EQUIPMENT]->(e:Equipment)
RETURN e.name AS 설비명, e.type AS 설비유형
```

*(실행 → HP-01, 열압착기)*

HP-01. 1-hop 질문이에요. 한 다리만 건너면 답이 나옵니다.

솔직히 이 정도는 ChatGPT한테 문서 하나 던져주면 답할 수 있습니다. 벡터 RAG로도 충분하고요.

**쿼리 4: 2-hop 질문**

그럼 한 단계 더 가볼까요. "열압착 공정에서 사용하는 설비와 원자재를 동시에 알려줘."

```cypher
MATCH (p:Process {name: '열압착'})-[:USES_EQUIPMENT]->(e:Equipment),
      (p)-[:USES_MATERIAL]->(c:Component)
RETURN e.name AS 설비, c.name AS 원자재
```

*(실행 → HP-01, 마찰재)*

두 방향으로 한 번에 조회. 이것도 뭐, 같은 문서에 있으면 벡터 RAG가 할 수 있어요.

*(살짝 뜸을 들이며)*

근데요. 진짜 어려운 질문은 다음입니다.

**편집 노트**: 각 쿼리마다 "난이도 게이지" 표시 (1-hop: 초록, 2-hop: 노랑). Cypher 문법 설명 시 해당 키워드(MATCH, RETURN, 화살표)를 형광 하이라이트. "진짜 어려운 질문" 전에 배경음 낮추고 잠깐 침묵 → 긴장감 조성.

---

### 16:00 - 19:00 | 3-hop 근본원인 분석 (핵심!)

**화면**: Neo4j Browser 전체 화면. 노드와 관계가 선명하게 보이도록 레이아웃 정리된 상태.

**대본**:

자, 이제 진짜 중요한 겁니다. 오늘 영상의 핵심이에요.

*(목소리 톤 살짝 낮추고, 진지하게)*

질문은 이겁니다.

*(화면에 텍스트 크게)*

**"접착 박리 결함은 어디서 발견되었고, 그 검사가 확인하는 공정은 뭐고, 그 공정에서 사용하는 설비는 뭔가?"**

이 질문에 답하려면, 3번 점프해야 합니다.

*(화면: 빈 그래프에서 경로가 하나씩 그려짐)*

**Step 1**: 접착 박리 → 어디서 발견됐나? → 전단강도 시험.

*(빨간 노드에서 보라 노드로 화살표: DETECTED_AT)*

**Step 2**: 전단강도 시험 → 뭘 검사하나? → 열압착 공정.

*(보라 노드에서 주황 노드로 화살표: INSPECTS)*

**Step 3**: 열압착 공정 → 어떤 설비 쓰나? → HP-01.

*(주황 노드에서 파란 노드로 화살표: USES_EQUIPMENT)*

이걸 Cypher로 쓰면 이렇습니다.

```cypher
MATCH (d:Defect {name: '접착 박리'})
      -[:DETECTED_AT]->(i:Inspection)
      -[:INSPECTS]->(p:Process)
      -[:USES_EQUIPMENT]->(e:Equipment)
RETURN d.name AS 결함,
       i.name AS 검사,
       p.name AS 공정,
       e.name AS 설비
```

한 줄입니다. 실행해볼게요.

*(Cypher 쿼리 실행)*

*(결과 테이블 표시)*

| 결함 | 검사 | 공정 | 설비 |
|------|------|------|------|
| 접착 박리 | 전단강도 시험 | 열압착 | HP-01 |

접착 박리, 전단강도 시험, 열압착, HP-01.

*(경로 시각화: 4개 노드가 빛나는 경로로 연결)*

4개 문서에 흩어져 있던 정보를, Cypher 한 줄로 연결했습니다.

*(잠깐 포즈)*

자, 이제 왜 벡터 RAG가 이걸 못하는지 설명드릴게요.

*(화면: 좌우 분할 - Vector RAG vs GraphRAG)*

**Vector RAG** 방식이라면요,

품질보고서 청크에 "접착 박리 발생"이 있고,
검사 매뉴얼 청크에 "전단강도 시험은 열압착 공정 검사"라고 있고,
설비 이력 청크에 "열압착은 HP-01 사용"이라고 있습니다.

3개의 서로 다른 청크입니다. 벡터 유사도 검색으로 "접착 박리"를 검색하면, 첫 번째 청크만 높은 점수를 받습니다. 두 번째, 세 번째 청크는 "접착 박리"라는 단어 자체가 없으니까 검색이 안 돼요.

*(좌측 Vector RAG에 빨간 X 표시)*

**GraphRAG**는요? 관계를 따라가니까 단어가 없어도 됩니다. 구조로 연결되어 있으니까요.

*(우측 GraphRAG에 초록 체크 표시)*

*(비교 테이블 표시)*

| 비교 항목 | Vector RAG | GraphRAG |
|-----------|-----------|----------|
| 1-hop 질문 | O 가능 | O 가능 |
| Multi-hop 질문 | X 어려움 | O 가능 |
| 정보가 여러 문서에 분산 | X 못 찾음 | O 관계 추적 |
| 추론 경로 설명 | X 불가 | O 경로 반환 |
| 구축 비용 | 낮음 | 높음 |
| 유지보수 | 쉬움 | 어려움 |

핵심은 이겁니다.

*(화면에 큰 텍스트)*

**"1-hop이면 벡터로 충분. Multi-hop이 필요하면 GraphRAG."**

둘 다 쓸 수도 있습니다. 실제로 실무에서는 벡터 + 그래프를 같이 쓰는 하이브리드가 많습니다. 그건 나중 에피소드에서 다룰게요.

**편집 노트**: 이 섹션이 영상의 핵심. 3-hop 경로 빌드업은 각 Step마다 1-2초 멈춤 + 효과음. Cypher 실행 결과 나오는 순간 확대 효과. 비교 테이블은 좌우에서 슬라이드인 애니메이션. 핵심 문구 "1-hop이면 벡터로 충분..."은 3초간 화면에 머무르게.

---

### 19:00 - 20:00 | 정리 + 다음 에피소드 예고

**화면**: 요약 슬라이드 (깔끔한 3단 정리)

**대본**:

오늘 정리해볼게요.

*(3단 정리 슬라이드)*

**첫째**, 온톨로지를 설계했습니다. 5종 엔티티, 7종 관계. 이게 지식그래프의 설계도입니다.

**둘째**, Neo4j에 7노드 그래프를 직접 만들었습니다. Python + Cypher로요.

**셋째**, 3-hop 근본원인 분석을 해봤습니다. 벡터 RAG가 못하는 걸, Cypher 한 줄로 해결했습니다.

*(화면 전환: EP2 예고)*

다음 에피소드에서는 이 그래프에 자연어로 질문하는 방법을 배웁니다.

*(화면: 자연어 질문이 Cypher로 변환되는 애니메이션)*

"접착 박리 원인이 뭐야?"라고 물으면, AI가 알아서 Cypher를 만들어줍니다. Text2Cypher Retriever라는 건데요, 이게 GraphRAG의 꽃입니다.

그리고 규모도 키워갑니다.

*(화면: 7 → 35 → 1,000 → 5,000+ 노드 스케일업 다이어그램)*

오늘 7개 노드로 시작했는데, 다음에는 35개, 그 다음은 1,000개, 최종적으로 5,000개 이상까지 키워가면서 진짜 실무 파이프라인을 만들어봅니다.

노트북은 GitHub에 올려뒀습니다. 링크는 설명란에 있고요, Neo4j Aura Free Tier 링크도 있으니까 바로 따라하실 수 있습니다.

*(카메라 정면)*

구독과 좋아요 부탁드리고요, 질문은 댓글로 남겨주세요. 다음 영상에서 만나겠습니다!

**편집 노트**: 요약 슬라이드는 체크마크와 함께 하나씩 등장. EP2 예고 부분은 다이나믹한 전환 효과. 스케일업 다이어그램은 숫자가 커지면서 그래프도 커지는 애니메이션. 마지막 인사는 밝은 톤 + 엔딩 BGM 페이드인. 구독/좋아요 버튼 그래픽 오버레이.

---

## 부록: 전체 Cypher 레퍼런스

영상에서 사용하는 모든 Cypher 쿼리를 순서대로 정리합니다.

### 노드 생성

```cypher
// Component
CREATE (c:Component {id: 'CMP-001', name: '마찰재', type: '유기질'})

// Process (3개)
CREATE (p1:Process {id: 'PRC-001', name: '혼합', order: 1}),
       (p2:Process {id: 'PRC-002', name: '열압착', order: 2}),
       (p3:Process {id: 'PRC-003', name: '연마', order: 3})

// Equipment
CREATE (e:Equipment {id: 'EQP-001', name: 'HP-01', type: '열압착기'})

// Inspection
CREATE (i:Inspection {id: 'INS-001', name: '전단강도 시험', standard: 'KS R 9212'})

// Defect
CREATE (d:Defect {id: 'DEF-001', name: '접착 박리', severity: 'Critical'})
```

### 관계 생성

```cypher
// 공정 순서
MATCH (p1:Process {id: 'PRC-001'}), (p2:Process {id: 'PRC-002'}), (p3:Process {id: 'PRC-003'})
CREATE (p1)-[:NEXT]->(p2), (p2)-[:NEXT]->(p3)

// 설비/자재 사용
MATCH (p:Process {id: 'PRC-002'}), (e:Equipment {id: 'EQP-001'}), (c:Component {id: 'CMP-001'})
CREATE (p)-[:USES_EQUIPMENT]->(e), (p)-[:USES_MATERIAL]->(c)

// 검사
MATCH (i:Inspection {id: 'INS-001'}), (p:Process {id: 'PRC-002'})
CREATE (i)-[:INSPECTS]->(p)

// 결함 관계
MATCH (d:Defect {id: 'DEF-001'}), (i:Inspection {id: 'INS-001'}),
      (p:Process {id: 'PRC-002'}), (e:Equipment {id: 'EQP-001'})
CREATE (d)-[:DETECTED_AT]->(i),
       (d)-[:CAUSED_BY_PROCESS]->(p),
       (d)-[:CAUSED_BY_EQUIPMENT]->(e)
```

### 조회 쿼리

```cypher
-- Q1: 전체 그래프
MATCH (n) RETURN n

-- Q2: 공정 흐름
MATCH (p1:Process)-[:NEXT]->(p2:Process)
RETURN p1.name AS 이전공정, p2.name AS 다음공정

-- Q3: 1-hop 설비 조회
MATCH (p:Process {name: '열압착'})-[:USES_EQUIPMENT]->(e:Equipment)
RETURN e.name AS 설비명, e.type AS 설비유형

-- Q4: 2-hop 설비+자재 동시 조회
MATCH (p:Process {name: '열압착'})-[:USES_EQUIPMENT]->(e:Equipment),
      (p)-[:USES_MATERIAL]->(c:Component)
RETURN e.name AS 설비, c.name AS 원자재

-- Q5: 3-hop 근본원인 분석 (킬러 쿼리)
MATCH (d:Defect {name: '접착 박리'})
      -[:DETECTED_AT]->(i:Inspection)
      -[:INSPECTS]->(p:Process)
      -[:USES_EQUIPMENT]->(e:Equipment)
RETURN d.name AS 결함, i.name AS 검사, p.name AS 공정, e.name AS 설비
```

---

## 부록: 촬영 체크리스트

- [ ] Neo4j Docker 컨테이너 미리 실행 확인
- [ ] Jupyter Notebook 셀 순서 및 실행 결과 사전 검증
- [ ] Neo4j Browser 노드 색상 설정 (Component=초록, Process=주황, Equipment=파랑, Inspection=보라, Defect=빨강)
- [ ] 온톨로지 다이어그램 슬라이드 준비
- [ ] 비교 테이블 (Vector RAG vs GraphRAG) 슬라이드 준비
- [ ] EP2 예고 슬라이드 / 텍스트 준비
- [ ] 마이크 + 화면 녹화 테스트
- [ ] 설명란 링크 확인 (GitHub, Aura, 노트북)
