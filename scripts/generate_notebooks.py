#!/usr/bin/env python3
"""Part 8-13 Jupyter Notebook Generator
기존 Part 1-7 패턴을 따라 Advanced Track 노트북 6개를 생성합니다.
"""
import json
import os

NOTEBOOKS_DIR = os.path.join(os.path.dirname(__file__), "..", "notebooks")

def md(source: str) -> dict:
    """Markdown cell"""
    return {"cell_type": "markdown", "metadata": {}, "source": source.split("\n")}

def code(source: str) -> dict:
    """Code cell"""
    return {"cell_type": "code", "execution_count": None, "metadata": {}, "outputs": [], "source": source.split("\n")}

def notebook(cells: list) -> dict:
    """Complete notebook"""
    return {
        "cells": cells,
        "metadata": {
            "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
            "language_info": {
                "codemirror_mode": {"name": "ipython", "version": 3},
                "file_extension": ".py", "mimetype": "text/x-python",
                "name": "python", "nbconvert_exporter": "python",
                "pygments_lexer": "ipython3", "version": "3.11.0"
            }
        },
        "nbformat": 4, "nbformat_minor": 4
    }

def save(name: str, cells: list):
    path = os.path.join(NOTEBOOKS_DIR, name)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(notebook(cells), f, ensure_ascii=False, indent=1)
    print(f"  [OK] {name} ({len(cells)} cells)")


# ============================================================
# 공통 셀
# ============================================================
ENV_SETUP_MD = md("""---
## 1. 환경 설정

### 패키지 설치 및 Neo4j 연결""")

ENV_SETUP_CODE = code("""import os, json, time
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()
load_dotenv(dotenv_path="../.env")

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

try:
    driver.verify_connectivity()
    print("[OK] Neo4j 연결 성공!")
except Exception as e:
    print(f"[ERROR] 연결 실패: {e}")

def run_query(query, parameters=None, print_result=True):
    with driver.session() as session:
        result = session.run(query, parameters or {})
        records = [record.data() for record in result]
        if print_result:
            for i, rec in enumerate(records, 1):
                print(f"  [{i}] {rec}")
            if not records:
                print("  (결과 없음)")
        return records

print("[OK] 환경 설정 완료")""")

CLEANUP_CODE = code("""# 세션 정리
# driver.close()
# print("[OK] Neo4j 드라이버 종료 완료")

print("실습을 마칩니다. 수고하셨습니다!")""")


# ============================================================
# Part 8: 프레임워크 비교 분석
# ============================================================
def gen_part8():
    cells = [
        md("""# Part 8: 프레임워크 비교 분석

**소요 시간**: 약 1.5시간
**난이도**: ⭐⭐⭐ (중급)
**목표**: MS GraphRAG, LightRAG, fast-graphrag, LlamaIndex를 비교하고, 프로젝트에 맞는 프레임워크를 선택할 수 있다.

---

## 학습 순서

1. 환경 설정
2. MS GraphRAG 아키텍처
3. LightRAG / fast-graphrag
4. LlamaIndex PropertyGraph v2
5. 프레임워크별 벤치마크
6. 선택 가이드 + 하이브리드 전략
7. 연습 문제"""),
        ENV_SETUP_MD,
        ENV_SETUP_CODE,

        # Section 2: MS GraphRAG
        md("""---
## 2. MS GraphRAG 아키텍처

Microsoft GraphRAG는 **Leiden 커뮤니티 탐지 + 계층적 요약**을 결합한 프레임워크입니다.

### 핵심 구조

```
문서 → 엔티티 추출 → 그래프 구축 → Leiden 커뮤니티
                                         ↓
                              커뮤니티별 요약 생성
                                         ↓
                              Global / Local / DRIFT Search
```

### 3가지 검색 모드

| 모드 | 설명 | 적합한 질문 |
|------|------|------------|
| **Local Search** | 관련 엔티티 주변 탐색 | "삼성전자 CEO는?" |
| **Global Search** | 전체 커뮤니티 요약 활용 | "반도체 산업 트렌드는?" |
| **DRIFT Search** | Local + 커뮤니티 컨텍스트 | "삼성의 AI 전략은?" |

> **핵심**: Global Search가 MS GraphRAG의 차별점. 다른 프레임워크에는 없는 기능."""),

        code("""# MS GraphRAG 설치 및 사용 예시 (의사 코드)

ms_graphrag_example = '''
# 설치
pip install graphrag

# 초기화
graphrag init --root ./my-project

# 인덱싱 (시간 + 비용 소모)
graphrag index --root ./my-project

# 검색
graphrag query --root ./my-project --method local "삼성전자 CEO는?"
graphrag query --root ./my-project --method global "반도체 산업 트렌드는?"
'''

print("=== MS GraphRAG 사용 예시 ===")
print(ms_graphrag_example)
print("[주의] 인덱싱에 시간과 비용이 많이 듭니다.")
print("  50개 문서 기준: ~18분, ~$12 (GPT-4 사용 시)")"""),

        # Section 3: LightRAG / fast-graphrag
        md("""---
## 3. LightRAG / fast-graphrag

### 3.1 LightRAG — 1/100 비용

LightRAG는 MS GraphRAG의 **경량화 버전**입니다.

| 비교 | MS GraphRAG | LightRAG |
|------|-------------|----------|
| 인덱싱 비용 | $11.77 | **$0.12** |
| 인덱싱 시간 | 18분 | **2분** |
| 쿼리 속도 | 3.2초 | **0.8초** |
| 정확도 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 커뮤니티 요약 | O | X |

### 3.2 fast-graphrag — PageRank 기반

fast-graphrag는 **Personalized PageRank**를 활용해 검색 속도를 극대화합니다.

- MS GraphRAG 대비 **27배 빠른** 쿼리 응답
- 커뮤니티 탐지 없이 PageRank로 중요도 계산
- 비용: MS GraphRAG의 1/5 수준"""),

        code("""# 프레임워크별 코드 비교

lightrag_example = '''
from lightrag import LightRAG
engine = LightRAG(model="gpt-3.5-turbo")
engine.index_directory("./data")
result = engine.query("삼성전자 투자 기관은?")
'''

fast_graphrag_example = '''
from fast_graphrag import FastGraphRAG
engine = FastGraphRAG(model="gpt-4-turbo")
engine.index("./data")
result = engine.query("삼성전자 투자 기관은?")
'''

print("=== LightRAG 예시 ===")
print(lightrag_example)
print("\\n=== fast-graphrag 예시 ===")
print(fast_graphrag_example)"""),

        # Section 4: LlamaIndex
        md("""---
## 4. LlamaIndex PropertyGraph v2

LlamaIndex 0.11+에서 지원하는 PropertyGraph는 **Neo4j 통합**이 잘 되어 있습니다.

**장점:**
- 10줄 코드로 프로토타입 가능
- Neo4j + 벡터 스토어 통합
- LlamaIndex 에코시스템 활용

**단점:**
- 온톨로지 커스터마이징 제한
- 디버깅이 어려움 (블랙박스)

> **실무 팁**: POC는 LlamaIndex로 빠르게 만들고, 프로덕션은 직접 구현으로 마이그레이션"""),

        code("""# LlamaIndex PropertyGraph 사용 예시 (의사 코드)

llamaindex_example = '''
from llama_index.core import PropertyGraphIndex, SimpleDirectoryReader
from llama_index.graph_stores.neo4j import Neo4jPropertyGraphStore

# Neo4j 연결
graph_store = Neo4jPropertyGraphStore(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password123"
)

# 문서 로드 + 인덱스 생성 (단 3줄!)
documents = SimpleDirectoryReader("./data").load_data()
index = PropertyGraphIndex.from_documents(
    documents,
    property_graph_store=graph_store,
    show_progress=True
)

# 검색
query_engine = index.as_query_engine()
response = query_engine.query("삼성전자에 투자한 기관은?")
print(response)
'''

print("=== LlamaIndex PropertyGraph v2 ===")
print(llamaindex_example)
print("\\n[주의] llama-index-graph-stores-neo4j 패키지 필요")"""),

        # Section 5: 벤치마크
        md("""---
## 5. 프레임워크별 벤치마크

### 벤치마크 결과 (50개 문서 기준)

| 프레임워크 | 인덱싱 시간 | 인덱싱 비용 | 쿼리 속도 | 정확도 |
|-----------|------------|------------|----------|--------|
| **MS GraphRAG** | 18m 32s | $11.77 | 3.2초 | ⭐⭐⭐⭐⭐ |
| **LightRAG** | 2m 15s | $1.20 | 0.8초 | ⭐⭐⭐ |
| **fast-graphrag** | 3m 40s | $2.05 | 0.4초 | ⭐⭐⭐⭐ |
| **LlamaIndex** | 5m 10s | $3.50 | 1.2초 | ⭐⭐⭐⭐ |
| **직접 구현** | 수동 | $0 | 0.1초 | 도메인 의존 |

> **핵심**: 프레임워크 선택은 기술적 문제가 아니라 비즈니스 우선순위 문제"""),

        code("""# 벤치마크 결과 시각화
benchmark = {
    "MS GraphRAG": {"cost": 11.77, "speed": 3.2, "accuracy": 5},
    "LightRAG":    {"cost": 1.20,  "speed": 0.8, "accuracy": 3},
    "fast-graphrag":{"cost": 2.05, "speed": 0.4, "accuracy": 4},
    "LlamaIndex":  {"cost": 3.50,  "speed": 1.2, "accuracy": 4},
}

print("=== 벤치마크 결과 (50개 문서 기준) ===")
print(f"{'프레임워크':<18} {'비용($)':<10} {'쿼리속도(초)':<14} {'정확도'}")
print("-" * 60)
for name, data in benchmark.items():
    stars = "★" * data["accuracy"] + "☆" * (5 - data["accuracy"])
    print(f"{name:<18} ${data['cost']:<8.2f} {data['speed']:<12.1f}  {stars}")"""),

        # Section 6: 선택 가이드
        md("""---
## 6. 선택 가이드 + 의사결정 트리

### 의사결정 트리

```
❓ Multi-hop 질문 필요?
  ├─ NO → 벡터 RAG로 충분
  └─ YES ↓
      ❓ 온톨로지 맞춤 설계 필요?
        ├─ YES → 직접 구현 (Part 1-7)
        └─ NO ↓
            ❓ 비용 제약 있음?
              ├─ YES → LightRAG
              └─ NO ↓
                  ❓ 정확도 vs 속도?
                    ├─ 정확도 → MS GraphRAG
                    └─ 속도 → fast-graphrag
```

### 하이브리드 전략 (실무 권장)

| Phase | 기간 | 프레임워크 | 목표 |
|-------|------|----------|------|
| Phase 1 | 2주 | LlamaIndex | 빠른 POC |
| Phase 2 | 2개월 | 직접 구현 | 프로덕션 마이그레이션 |
| Phase 3 | 지속 | 최적화 | 인덱스 튜닝, 비용 절감 |"""),

        code("""# 대화형 프레임워크 추천기
def recommend_framework():
    print("=== GraphRAG 프레임워크 선택 가이드 ===\\n")

    q1 = input("1. Multi-hop 질문이 필요한가요? (y/n) ").strip().lower()
    if q1 != 'y':
        return "Vector RAG (FAISS + LangChain)로 충분합니다."

    q2 = input("2. 온톨로지를 직접 설계해야 하나요? (y/n) ").strip().lower()
    if q2 == 'y':
        return "직접 구현 (Part 1-7 방식) - Neo4j + Cypher 완전 제어"

    q3 = input("3. 비용 제약이 강한가요? (y/n) ").strip().lower()
    if q3 == 'y':
        return "LightRAG - 1/100 비용"

    q4 = input("4. 정확도 vs 속도? (accuracy/speed) ").strip().lower()
    if q4 == 'accuracy':
        return "MS GraphRAG - Global Search 최고 정확도"
    return "fast-graphrag - 27배 빠른 Personalized PageRank"

# 주석 해제 후 실행
# print(recommend_framework())
print("[대화형 추천기] 위 함수의 주석을 해제하고 실행하세요.")"""),

        # 연습 문제
        md("""---
## 7. 연습 문제

### 문제 1: 프레임워크 선택 시나리오

다음 3가지 시나리오에서 어떤 프레임워크를 선택할지 이유와 함께 작성하세요.

**시나리오 A**: 스타트업 POC (예산 $500, 기간 2주, 100개 문서)
**시나리오 B**: 대기업 프로덕션 (예산 $10K/월, 100만 문서, 맞춤 온톨로지)
**시나리오 C**: 실시간 챗봇 (예산 $2K/월, 1만 문서, 200ms 응답)"""),

        code("""# [연습 1] 시나리오별 프레임워크 선택
scenario_a = "시나리오 A 선택: ???  이유: "
scenario_b = "시나리오 B 선택: ???  이유: "
scenario_c = "시나리오 C 선택: ???  이유: "

print(scenario_a)
print(scenario_b)
print(scenario_c)"""),

        md("""### 문제 2: 하이브리드 전략 설계

"POC는 LlamaIndex, 프로덕션은 직접 구현"으로 마이그레이션하는 전략을 설계하세요."""),

        code("""# [연습 2] 하이브리드 전략
migration_plan = {
    "phase1_poc": {"framework": "???", "duration": "2주", "features": []},
    "phase2_migration": {"custom_impl": [], "keep_from_poc": [], "risks": []},
    "phase3_production": {"monitoring": [], "optimization": []},
}
# TODO: 위 템플릿을 채우세요
print("하이브리드 전략을 설계해보세요!")"""),

        # 정리
        md("""---
## 8. 정리

| 프레임워크 | 핵심 | 선택 기준 |
|-----------|------|----------|
| MS GraphRAG | Leiden + Global Search | 정확도 > 비용 |
| LightRAG | 1/100 비용 | 비용 제약 강함 |
| fast-graphrag | PageRank 27배 빠름 | 속도 우선 |
| LlamaIndex | 10줄 프로토타입 | 빠른 POC |
| 직접 구현 | 완전 제어 | 프로덕션, 맞춤 온톨로지 |

### 다음 Part 9 미리보기: 그래프 알고리즘 + RAG 고도화

Part 9에서는 Neo4j GDS로 PageRank, 커뮤니티 탐지를 실행하고 RAG 파이프라인에 통합합니다."""),
        CLEANUP_CODE,
    ]
    save("part8_framework_comparison.ipynb", cells)


# ============================================================
# Part 9: 그래프 알고리즘 + RAG 고도화
# ============================================================
def gen_part9():
    cells = [
        md("""# Part 9: 그래프 알고리즘 + RAG 고도화

**소요 시간**: 약 2시간
**난이도**: ⭐⭐⭐⭐ (중상급)
**목표**: Neo4j GDS로 PageRank, 커뮤니티 탐지를 실행하고 RAG 파이프라인에 통합한다.

---

## 학습 순서

1. 환경 설정
2. Neo4j GDS 소개 + 그래프 프로젝션
3. 중심성 알고리즘 (PageRank, Betweenness)
4. 커뮤니티 탐지 (Leiden, Louvain)
5. RAG 파이프라인 통합 (리랭킹, 커뮤니티 요약)
6. 실전 프로젝트: Before/After 벤치마크
7. 연습 문제"""),
        ENV_SETUP_MD,
        code("""import os, json, time
import numpy as np
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()
load_dotenv(dotenv_path="../.env")

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

try:
    driver.verify_connectivity()
    print("[OK] Neo4j 연결 성공!")
except Exception as e:
    print(f"[ERROR] 연결 실패: {e}")

def run_query(query, parameters=None, print_result=True):
    with driver.session() as session:
        result = session.run(query, parameters or {})
        records = [record.data() for record in result]
        if print_result:
            for i, rec in enumerate(records, 1):
                print(f"  [{i}] {rec}")
            if not records:
                print("  (결과 없음)")
        return records

print("[OK] 환경 설정 완료")"""),

        md("""---
## 2. Neo4j GDS (Graph Data Science)

Neo4j GDS는 그래프 알고리즘 라이브러리입니다.

### GDS 워크플로우

```
Neo4j DB → Graph Projection (인메모리) → 알고리즘 실행 → 결과 저장/스트림
```

### 주요 알고리즘 카테고리

| 카테고리 | 알고리즘 | 용도 |
|---------|---------|------|
| 중심성 | PageRank, Betweenness | 중요한 노드 찾기 |
| 커뮤니티 | Leiden, Louvain | 그룹/클러스터 발견 |
| 유사도 | Node Similarity | 비슷한 노드 매칭 |
| 경로 | Shortest Path, A* | 최적 경로 찾기 |"""),

        code("""# GDS 사용 가능 여부 확인
try:
    result = run_query("RETURN gds.version() AS version", print_result=False)
    print(f"[OK] GDS 버전: {result[0]['version']}")
except Exception as e:
    print(f"[WARN] GDS 미설치: {e}")
    print("docker-compose.yml에서 NEO4J_PLUGINS: '[\"graph-data-science\"]' 확인")

# 샘플 그래프 생성 (제조 장비 네트워크)
run_query("MATCH (n) DETACH DELETE n", print_result=False)

# 장비 30개 + 관계 생성
for i in range(1, 6):
    for j in range(1, 7):
        name = f"장비_{i}-{j}"
        line = f"Line-{i}"
        run_query(f'''
            CREATE (:Equipment {{name: "{name}", line: "{line}",
                                 status: "{'active' if j < 5 else 'warning'}"}})
        ''', print_result=False)

# 같은 라인 내 연결
for i in range(1, 6):
    for j in range(1, 6):
        run_query(f'''
            MATCH (a:Equipment {{name: "장비_{i}-{j}"}}),
                  (b:Equipment {{name: "장비_{i}-{j+1}"}})
            CREATE (a)-[:CONNECTED_TO]->(b)
        ''', print_result=False)

# 라인 간 연결 (브리지)
bridges = [(1,3,2,1), (2,4,3,2), (3,5,4,3), (4,2,5,1)]
for a1,a2,b1,b2 in bridges:
    run_query(f'''
        MATCH (a:Equipment {{name: "장비_{a1}-{a2}"}}),
              (b:Equipment {{name: "장비_{b1}-{b2}"}})
        CREATE (a)-[:CONNECTED_TO]->(b)
    ''', print_result=False)

result = run_query("MATCH (n) RETURN count(n) AS nodes", print_result=False)
result2 = run_query("MATCH ()-[r]->() RETURN count(r) AS rels", print_result=False)
print(f"[OK] 샘플 그래프: 노드 {result[0]['nodes']}개, 관계 {result2[0]['rels']}개")"""),

        md("""---
## 3. 중심성 알고리즘

### 3.1 PageRank — "많이 참조되는 노드가 중요하다"

PageRank는 Google 검색의 핵심 알고리즘입니다.
GraphRAG에서는 **중요한 엔티티를 상위로 올리는 리랭킹**에 활용합니다."""),

        code("""# Graph Projection 생성
try:
    run_query("CALL gds.graph.drop('equipmentGraph')", print_result=False)
except:
    pass

run_query('''
    CALL gds.graph.project('equipmentGraph', 'Equipment', 'CONNECTED_TO')
    YIELD graphName, nodeCount, relationshipCount
    RETURN graphName, nodeCount, relationshipCount
''')

# PageRank 실행
print("\\n=== PageRank 결과 (상위 10) ===")
run_query('''
    CALL gds.pageRank.stream('equipmentGraph')
    YIELD nodeId, score
    WITH gds.util.asNode(nodeId) AS node, score
    RETURN node.name AS 장비, node.line AS 라인, round(score, 4) AS PageRank
    ORDER BY score DESC LIMIT 10
''')"""),

        code("""# Betweenness Centrality — "브리지 역할 노드 찾기"
print("=== Betweenness Centrality (상위 10) ===")
run_query('''
    CALL gds.betweenness.stream('equipmentGraph')
    YIELD nodeId, score
    WITH gds.util.asNode(nodeId) AS node, score
    RETURN node.name AS 장비, node.line AS 라인, round(score, 2) AS Betweenness
    ORDER BY score DESC LIMIT 10
''')

print("\\n→ Betweenness가 높은 노드 = 라인 간 연결의 핵심 (브리지)")"""),

        md("""---
## 4. 커뮤니티 탐지

### Leiden vs Louvain

| 알고리즘 | 특징 | MS GraphRAG |
|---------|------|-------------|
| **Leiden** | 더 정확한 커뮤니티, 해상도 조절 가능 | ✅ 사용 |
| **Louvain** | 빠르지만 덜 정확 | ❌ 미사용 |

> Leiden이 Louvain보다 정확도가 높아 MS GraphRAG의 기본 알고리즘으로 채택되었습니다."""),

        code("""# Leiden 커뮤니티 탐지
print("=== Leiden 커뮤니티 탐지 ===")
run_query('''
    CALL gds.leiden.write('equipmentGraph', {
        writeProperty: 'community',
        includeIntermediateCommunities: false
    })
    YIELD communityCount, modularity
    RETURN communityCount AS 커뮤니티수, round(modularity, 4) AS 모듈러리티
''')

# 커뮤니티별 노드 확인
print("\\n=== 커뮤니티별 노드 수 ===")
run_query('''
    MATCH (n:Equipment)
    RETURN n.community AS 커뮤니티, count(n) AS 노드수, collect(n.line)[0] AS 대표라인
    ORDER BY 노드수 DESC
''')"""),

        md("""---
## 5. RAG 파이프라인 통합

### 5.1 PageRank 리랭킹

벡터 검색 결과를 PageRank로 재정렬합니다.

```
final_score = α × vector_similarity + (1-α) × pagerank_normalized
```

- α = 0.7: 벡터 우선 (사실 정확도 중요)
- α = 0.3: PageRank 우선 (전문성 중요)"""),

        code("""# PageRank 하이브리드 리랭킹 시뮬레이션
def hybrid_rerank(query, top_k=5, alpha=0.7):
    with driver.session() as session:
        result = session.run('''
            MATCH (e:Equipment)
            WHERE e.pagerank IS NOT NULL
            RETURN e.name AS name, e.line AS line, e.pagerank AS pagerank
            LIMIT 30
        ''')
        nodes = [r.data() for r in result]

    # 벡터 유사도 시뮬레이션 (실제로는 임베딩 코사인 유사도)
    for n in nodes:
        n['vector_score'] = np.random.uniform(0.5, 1.0)

    # PageRank 정규화
    pr_vals = [n['pagerank'] for n in nodes]
    pr_min, pr_max = min(pr_vals), max(pr_vals)
    for n in nodes:
        n['pr_norm'] = (n['pagerank'] - pr_min) / (pr_max - pr_min) if pr_max > pr_min else 0.5
        n['final'] = alpha * n['vector_score'] + (1 - alpha) * n['pr_norm']

    nodes.sort(key=lambda x: x['final'], reverse=True)
    return nodes[:top_k]

# PageRank를 노드에 저장
run_query('''
    CALL gds.pageRank.write('equipmentGraph', {writeProperty: 'pagerank'})
    YIELD nodePropertiesWritten
    RETURN nodePropertiesWritten
''', print_result=False)

print("=== PageRank 리랭킹 시뮬레이션 (α=0.7) ===")
results = hybrid_rerank("프레스 불량", top_k=5)
for i, r in enumerate(results, 1):
    print(f"{i}. {r['name']} ({r['line']})")
    print(f"   벡터: {r['vector_score']:.3f}, PR: {r['pr_norm']:.3f}, 최종: {r['final']:.3f}")"""),

        md("""---
## 6. Before/After 벤치마크

| 지표 | Before (벡터만) | + PageRank 리랭킹 | + 커뮤니티 요약 |
|------|----------------|-------------------|------------------|
| 정답률 | 72% | 81% | 89% (Global) |
| 지연시간 | 120ms | 180ms | 200ms |
| 비용/쿼리 | 800 토큰 | 900 토큰 | 1200 토큰 |

> **실무 권장**: Local Search = PageRank 리랭킹, Global Search = 커뮤니티 요약"""),

        md("""---
## 7. 연습 문제

### 문제 1: Louvain vs Leiden 비교
같은 그래프에 두 알고리즘을 실행하고 커뮤니티 수, Modularity를 비교하세요.

### 문제 2: α 파라미터 튜닝
α를 0.1~0.9로 변화시키면서 상위 5개 노드가 어떻게 바뀌는지 관찰하세요.

### 문제 3: 경로 기반 추론
두 장비 사이 최단 경로를 찾고 LLM으로 해석하는 함수를 작성하세요."""),

        code("""# [연습 1] Louvain vs Leiden
# louvain_result = gds.louvain.write(G, writeProperty='louvain_community')
# leiden_result = gds.leiden.write(G, writeProperty='leiden_community')
print("Louvain vs Leiden 비교를 실행해보세요.")"""),

        code("""# [연습 2] α 파라미터 튜닝
# for alpha in [0.1, 0.3, 0.5, 0.7, 0.9]:
#     results = hybrid_rerank("질문", top_k=5, alpha=alpha)
#     print(f"α={alpha}: {[r['name'] for r in results]}")
print("α 파라미터 튜닝을 실행해보세요.")"""),

        md("""---
## 8. 정리

| 알고리즘 | 용도 | GraphRAG 활용 |
|---------|------|-------------|
| PageRank | 중요 노드 | 리랭킹 (Local Search) |
| Betweenness | 브리지 노드 | 핵심 연결점 발견 |
| Leiden | 커뮤니티 | Global Search 요약 |
| Shortest Path | 경로 | Multi-hop 추론 |

> **"GraphRAG = 벡터 검색 + 그래프 알고리즘. 둘 다 써야 진정한 성능이 나온다."**

### 다음 Part 10: Agentic GraphRAG
Part 10에서는 LangGraph로 멀티에이전트 GraphRAG 시스템을 구축합니다."""),

        code("""# 정리
try:
    run_query("CALL gds.graph.drop('equipmentGraph')", print_result=False)
except:
    pass

# driver.close()
print("Part 9 실습을 마칩니다. 수고하셨습니다!")"""),
    ]
    save("part9_graph_algorithms.ipynb", cells)


# ============================================================
# Part 10: Agentic GraphRAG
# ============================================================
def gen_part10():
    cells = [
        md("""# Part 10: Agentic GraphRAG

**소요 시간**: 약 2시간
**난이도**: ⭐⭐⭐⭐ (중상급)
**목표**: LangGraph로 자율적으로 판단하고 실행하는 GraphRAG Agent를 구축한다.

---

## 학습 순서

1. 환경 설정
2. Agentic RAG 패러다임
3. Graph Tool-calling 에이전트
4. LangGraph 멀티에이전트
5. 환각 감지 + 자가 수정
6. 프로덕션 에이전트 아키텍처
7. 연습 문제"""),
        ENV_SETUP_MD,
        code("""import os, json, time
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()
load_dotenv(dotenv_path="../.env")

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
driver.verify_connectivity()
print("[OK] Neo4j 연결 성공!")

def run_query(query, parameters=None, print_result=True):
    with driver.session() as session:
        result = session.run(query, parameters or {})
        records = [record.data() for record in result]
        if print_result:
            for i, rec in enumerate(records, 1):
                print(f"  [{i}] {rec}")
        return records

print("[OK] 환경 설정 완료")"""),

        md("""---
## 2. Agentic RAG 패러다임

### 기존 RAG vs Agentic RAG

| 항목 | 기존 RAG | Agentic RAG |
|------|---------|-------------|
| 흐름 | 고정 파이프라인 | 동적 판단 |
| 검색 | 1회 검색 | 반복 검색 가능 |
| 오류 처리 | 없음 | 자가 수정 |
| 도구 | 없음 | Tool-calling |

### ReAct 패턴

```
사용자 질문 → Thought → Action → Observation → Thought → ... → Final Answer
```

> **핵심**: Agent가 "어떤 도구를 쓸지" 스스로 판단하고, 결과를 보고 다시 판단"""),

        md("""---
## 3. Graph Tool-calling 에이전트

### 3가지 핵심 Tool

| Tool | 입력 | 출력 | 용도 |
|------|------|------|------|
| `schema_tool` | 없음 | 스키마 정보 | 어떤 노드/관계가 있는지 파악 |
| `cypher_tool` | Cypher 쿼리 | 쿼리 결과 | 정확한 그래프 탐색 |
| `path_tool` | 시작/끝 노드 | 경로 | Multi-hop 추론 |"""),

        code("""# Tool 정의
def schema_tool():
    \"\"\"Neo4j 스키마 조회\"\"\"
    labels = run_query("CALL db.labels() YIELD label RETURN collect(label) AS labels", print_result=False)
    rels = run_query("CALL db.relationshipTypes() YIELD relationshipType RETURN collect(relationshipType) AS types", print_result=False)
    return {
        "labels": labels[0]["labels"] if labels else [],
        "relationship_types": rels[0]["types"] if rels else []
    }

def cypher_tool(query: str):
    \"\"\"Cypher 쿼리 실행\"\"\"
    try:
        return run_query(query, print_result=False)
    except Exception as e:
        return {"error": str(e)}

def path_tool(start: str, end: str, max_depth: int = 3):
    \"\"\"두 노드 사이 최단 경로\"\"\"
    return run_query(f'''
        MATCH path = shortestPath(
            (a {{name: $start}})-[*..{max_depth}]-(b {{name: $end}})
        )
        RETURN [n IN nodes(path) | n.name] AS nodes,
               [r IN relationships(path) | type(r)] AS relations,
               length(path) AS hops
    ''', parameters={"start": start, "end": end}, print_result=False)

print("[OK] 3개 Tool 정의 완료")
print(f"스키마: {schema_tool()}")"""),

        md("""---
## 4. LangGraph 멀티에이전트

### Explorer-Reasoner-Validator 아키텍처

```
질문 → Explorer (그래프 탐색)
          ↓
       Reasoner (추론 + 답변 생성)
          ↓
       Validator (KG 기반 검증)
          ↓
       ✅ 통과 → 최종 답변
       ❌ 실패 → Explorer로 재탐색 (최대 3회)
```"""),

        code("""# LangGraph 멀티에이전트 (의사 코드)

agent_code = '''
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Annotated

class AgentState(TypedDict):
    question: str
    search_results: list
    answer: str
    is_valid: bool
    retry_count: int

def explorer(state: AgentState):
    # 그래프 탐색 에이전트
    schema = schema_tool()
    # LLM으로 Cypher 생성 → 실행
    cypher = generate_cypher(state["question"], schema)
    results = cypher_tool(cypher)
    return {"search_results": results}

def reasoner(state: AgentState):
    # 추론 + 답변 생성
    context = format_results(state["search_results"])
    answer = llm.invoke(f"Context: {context}\\nQuestion: {state['question']}")
    return {"answer": answer}

def validator(state: AgentState):
    # KG 기반 검증
    entities = extract_entities(state["answer"])
    for entity in entities:
        exists = cypher_tool(f"MATCH (n {{name: '{entity}'}}) RETURN n LIMIT 1")
        if not exists:
            return {"is_valid": False, "retry_count": state["retry_count"] + 1}
    return {"is_valid": True}

# StateGraph 구성
workflow = StateGraph(AgentState)
workflow.add_node("explorer", explorer)
workflow.add_node("reasoner", reasoner)
workflow.add_node("validator", validator)

workflow.add_edge(START, "explorer")
workflow.add_edge("explorer", "reasoner")
workflow.add_edge("reasoner", "validator")

# 조건부 라우팅: 검증 실패 시 재탐색
workflow.add_conditional_edges("validator", lambda s:
    "explorer" if not s["is_valid"] and s["retry_count"] < 3 else END)

app = workflow.compile()
'''

print("=== LangGraph 멀티에이전트 아키텍처 ===")
print(agent_code)
print("\\n[주의] 실행하려면 langgraph, openai 패키지가 필요합니다.")"""),

        md("""---
## 5. 환각 감지 + 자가 수정

### 환각 감지 전략

| 전략 | 방법 | 정확도 |
|------|------|--------|
| Entity 검증 | 답변의 엔티티가 KG에 존재하는지 확인 | 높음 |
| Relation 검증 | 답변의 관계가 KG에 존재하는지 확인 | 매우 높음 |
| Confidence 임계값 | LLM의 confidence < 0.7이면 재검색 | 중간 |

> **핵심**: KG가 있으면 환각 감지가 쉬워진다. 벡터 RAG에서는 불가능한 기능."""),

        code("""# 환각 감지 함수
def detect_hallucination(answer: str, kg_entities: list) -> dict:
    \"\"\"답변에서 KG에 없는 엔티티를 찾아 환각을 감지합니다.\"\"\"
    # 간단한 예시: 답변에 언급된 엔티티가 KG에 있는지 확인
    mentioned = []  # 실제로는 NER이나 LLM으로 추출
    hallucinated = [e for e in mentioned if e not in kg_entities]

    return {
        "is_hallucinated": len(hallucinated) > 0,
        "hallucinated_entities": hallucinated,
        "confidence": 1.0 - (len(hallucinated) / max(len(mentioned), 1))
    }

# KG 엔티티 목록 가져오기
kg_entities = run_query("MATCH (n) RETURN collect(n.name) AS names", print_result=False)
print(f"KG 엔티티 수: {len(kg_entities[0]['names']) if kg_entities else 0}개")
print("\\n환각 감지 함수가 준비되었습니다.")"""),

        md("""---
## 6. 연습 문제

### 문제 1: Tool 추가
`vector_tool`을 추가하세요 — 벡터 유사도 검색 결과를 반환하는 도구.

### 문제 2: 재시도 로직
Validator가 실패했을 때 Explorer에 "이전 쿼리가 왜 실패했는지" 피드백을 전달하는 로직을 설계하세요.

### 문제 3: Supervisor 패턴
Explorer, Reasoner, Validator 위에 Supervisor 노드를 추가하여 어떤 에이전트를 호출할지 결정하는 아키텍처를 설계하세요."""),

        code("""# [연습] 여기에 코드를 작성하세요
print("Agentic GraphRAG 연습 문제를 풀어보세요!")"""),

        md("""---
## 7. 정리

| 개념 | 설명 |
|------|------|
| Agentic RAG | 자율적 판단 + 반복 검색 |
| Tool-calling | schema/cypher/path 도구 |
| LangGraph | StateGraph 기반 워크플로우 |
| 환각 감지 | KG 엔티티로 검증 |
| 자가 수정 | 실패 → 재탐색 (최대 3회) |

> **"Agent의 가치는 '실패해도 스스로 수정'하는 능력에 있다."**

### 다음 Part 11: 디버깅 & 최적화"""),
        CLEANUP_CODE,
    ]
    save("part10_agentic_graphrag.ipynb", cells)


# ============================================================
# Part 11: 디버깅 & 최적화
# ============================================================
def gen_part11():
    cells = [
        md("""# Part 11: 디버깅 & 최적화

**소요 시간**: 약 1.5시간
**난이도**: ⭐⭐⭐⭐ (중상급)
**목표**: GraphRAG 실패 패턴을 분류하고, LangSmith 추적 + 프롬프트/인프라 최적화를 적용한다.

---

## 학습 순서

1. 환경 설정
2. 실패 패턴 분류학 (5가지 실패 유형)
3. LangSmith 추적 파이프라인
4. 프롬프트 최적화 (Few-shot, Chain-of-Thought)
5. 인프라 최적화 (캐싱, 인덱스, 배치)
6. 종합 트러블슈팅 워크숍
7. 연습 문제"""),
        ENV_SETUP_MD,
        ENV_SETUP_CODE,

        md("""---
## 2. 실패 패턴 분류학

GraphRAG 파이프라인의 5가지 대표 실패 유형:

| # | 실패 유형 | 증상 | 해결 |
|---|----------|------|------|
| 1 | **스키마 불일치** | "Property not found" | 온톨로지 재검토 |
| 2 | **Cypher 문법 오류** | "SyntaxError" | Few-shot 프롬프트 |
| 3 | **빈 결과** | 답변이 "모르겠습니다" | 검색 범위 확대 |
| 4 | **환각** | KG에 없는 엔티티 언급 | Entity 검증 |
| 5 | **성능 저하** | 응답 > 5초 | 인덱스/캐싱 |

> **핵심**: 80%의 실패는 1-3번(검색 실패)에서 발생. 검색부터 디버깅하라."""),

        code("""# 실패 패턴 진단 함수
def diagnose_failure(query: str, cypher: str, result: list, answer: str) -> dict:
    \"\"\"GraphRAG 실패 패턴을 진단합니다.\"\"\"
    diagnosis = {"query": query, "issues": []}

    # 1. Cypher 문법 오류 체크
    if isinstance(result, dict) and "error" in result:
        diagnosis["issues"].append({
            "type": "CYPHER_SYNTAX_ERROR",
            "severity": "HIGH",
            "fix": "Few-shot 프롬프트에 올바른 Cypher 예시 추가"
        })

    # 2. 빈 결과 체크
    elif not result:
        diagnosis["issues"].append({
            "type": "EMPTY_RESULT",
            "severity": "MEDIUM",
            "fix": "검색 범위 확대 (depth 증가, 관계 타입 추가)"
        })

    # 3. 답변 품질 체크
    elif "모르겠" in answer or "없습니다" in answer:
        diagnosis["issues"].append({
            "type": "LOW_QUALITY_ANSWER",
            "severity": "MEDIUM",
            "fix": "Context 보강 또는 프롬프트 개선"
        })

    return diagnosis

print("[OK] 진단 함수 준비 완료")"""),

        md("""---
## 3. LangSmith 추적 파이프라인

LangSmith를 사용하면 LLM 호출의 전 과정을 추적할 수 있습니다.

### 셋업

```python
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "ls-..."
os.environ["LANGCHAIN_PROJECT"] = "graphrag-debug"
```

### 추적 대상

| 구간 | 측정 항목 |
|------|----------|
| Cypher 생성 | 프롬프트 → 생성된 Cypher |
| Neo4j 실행 | 쿼리 시간, 결과 수 |
| 답변 생성 | 컨텍스트 크기, 토큰 수 |
| 전체 | End-to-end 지연시간, 비용 |"""),

        code("""# 간단한 추적 데코레이터 (LangSmith 없이도 사용 가능)
import functools

query_log = []

def trace(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        try:
            result = func(*args, **kwargs)
            duration = time.time() - start
            query_log.append({
                "function": func.__name__,
                "duration_s": round(duration, 3),
                "status": "success",
                "timestamp": time.strftime("%H:%M:%S")
            })
            return result
        except Exception as e:
            duration = time.time() - start
            query_log.append({
                "function": func.__name__,
                "duration_s": round(duration, 3),
                "status": "error",
                "error": str(e)
            })
            raise
    return wrapper

@trace
def traced_query(cypher):
    return run_query(cypher, print_result=False)

# 테스트
traced_query("MATCH (n) RETURN count(n) AS cnt")
print(f"추적 로그: {query_log}")"""),

        md("""---
## 4. 프롬프트 최적화

### Few-shot 프롬프트

Text2Cypher의 정확도를 높이는 가장 효과적인 방법:

```
시스템 프롬프트:
  스키마: (Company)-[:INVESTS_IN]->(Company)

  예시 1:
    질문: "삼성전자에 투자한 기관은?"
    Cypher: MATCH (i)-[:INVESTS_IN]->(c:Company {name: '삼성전자'}) RETURN i

  예시 2:
    질문: "국민연금이 투자한 기업이 개발한 제품은?"
    Cypher: MATCH (i {name: '국민연금'})-[:INVESTS_IN]->(c)-[:DEVELOPS]->(p) RETURN p

사용자 질문: {user_question}
```"""),

        code("""# Few-shot 프롬프트 템플릿
FEW_SHOT_TEMPLATE = '''
당신은 Neo4j Cypher 쿼리 생성 전문가입니다.

### 스키마
{schema}

### 예시
질문: "삼성전자에 투자한 기관은?"
Cypher: MATCH (i)-[:INVESTS_IN]->(c:Company {{name: '삼성전자'}}) RETURN i.name

질문: "국민연금이 투자한 기업이 개발한 제품은?"
Cypher: MATCH (i {{name: '국민연금'}})-[:INVESTS_IN]->(c)-[:DEVELOPS]->(p) RETURN c.name, p.name

### 규칙
1. 항상 RETURN 절에 .name 속성을 포함하세요
2. 문자열 비교 시 정확한 이름을 사용하세요
3. 관계 방향에 주의하세요

### 질문
{question}

### Cypher
'''

print("=== Few-shot 프롬프트 템플릿 ===")
print(FEW_SHOT_TEMPLATE[:300] + "...")"""),

        md("""---
## 5. 인프라 최적화

### 7가지 최적화 기법

| # | 기법 | 효과 | 난이도 |
|---|------|------|--------|
| 1 | 인덱스 추가 | 쿼리 10배 빠름 | 쉬움 |
| 2 | 쿼리 캐싱 | 반복 쿼리 즉시 응답 | 쉬움 |
| 3 | Connection Pool | 연결 오버헤드 감소 | 보통 |
| 4 | 배치 UNWIND | 대량 적재 10배 빠름 | 보통 |
| 5 | APOC 프로시저 | 복잡 쿼리 최적화 | 보통 |
| 6 | 메모리 튜닝 | 전체 성능 향상 | 어려움 |
| 7 | Read Replica | 읽기 확장성 | 어려움 |"""),

        code("""# 최적화 1: 인덱스 추가
print("=== 인덱스 추가 ===")
index_queries = [
    "CREATE INDEX IF NOT EXISTS FOR (c:Company) ON (c.name)",
    "CREATE INDEX IF NOT EXISTS FOR (p:Person) ON (p.name)",
    "CREATE INDEX IF NOT EXISTS FOR (e:Equipment) ON (e.name)",
]
for q in index_queries:
    try:
        run_query(q, print_result=False)
        print(f"  [OK] {q.split('FOR')[1].strip()}")
    except Exception as e:
        print(f"  [SKIP] {e}")

# 최적화 2: 쿼리 캐싱
from functools import lru_cache

@lru_cache(maxsize=128)
def cached_query(cypher: str) -> str:
    result = run_query(cypher, print_result=False)
    return json.dumps(result, ensure_ascii=False)

print("\\n[OK] LRU 캐시 (128개) 설정 완료")"""),

        md("""---
## 6. 연습 문제

### 문제 1: 실패 쿼리 10개 디버깅
의도적으로 잘못된 Cypher 10개를 준비하고, 각각 어떤 실패 패턴인지 진단하세요.

### 문제 2: EXPLAIN/PROFILE 분석
`PROFILE MATCH (c:Company {name: '삼성전자'})-[*1..3]-(n) RETURN n` 실행 후 실행 계획을 분석하세요.

### 문제 3: 캐시 히트율 측정
100개 쿼리를 실행하면서 캐시 히트율을 측정하세요."""),

        code("""# [연습] 여기에 코드를 작성하세요
print("디버깅 & 최적화 연습 문제를 풀어보세요!")"""),

        md("""---
## 7. 정리

| 영역 | 핵심 기법 |
|------|----------|
| 실패 진단 | 5가지 패턴 분류 |
| 추적 | LangSmith 또는 커스텀 데코레이터 |
| 프롬프트 | Few-shot + Chain-of-Thought |
| 인프라 | 인덱스, 캐싱, Connection Pool |

> **"디버깅의 80%는 검색 실패에서 시작된다. 검색부터 고쳐라."**

### 다음 Part 12: 엔터프라이즈 GraphRAG"""),
        CLEANUP_CODE,
    ]
    save("part11_debugging_optimization.ipynb", cells)


# ============================================================
# Part 12: 엔터프라이즈 GraphRAG
# ============================================================
def gen_part12():
    cells = [
        md("""# Part 12: 엔터프라이즈 GraphRAG

**소요 시간**: 약 1.5시간
**난이도**: ⭐⭐⭐⭐⭐ (고급)
**목표**: ROI 분석, PoC→프로덕션 전환, 보안/컴플라이언스, CI/CD 운영 자동화를 설계할 수 있다.

---

## 학습 순서

1. 환경 설정
2. ROI 분석 + 비즈니스 케이스
3. PoC → 프로덕션 전환
4. 보안 & 컴플라이언스
5. CI/CD + 운영 자동화
6. 확장 전략
7. 연습 문제"""),
        ENV_SETUP_MD,
        ENV_SETUP_CODE,

        md("""---
## 2. ROI 분석 + 비즈니스 케이스

### GraphRAG 도입 비용 구조

| 항목 | 초기 비용 | 월 운영비 | 비고 |
|------|---------|----------|------|
| Neo4j (Community) | $0 | $0 | 오픈소스 |
| Neo4j (Enterprise) | - | $2K~$50K | 클러스터, 보안 |
| LLM API | - | $500~$5K | GPT-4 기준 |
| 인프라 (클라우드) | - | $200~$2K | GPU 불필요 |
| 개발 인력 | $20K~$50K | - | 1-2명, 3개월 |

### ROI 계산 공식

```
ROI = (연간 절감액 - 연간 비용) / 연간 비용 × 100%

예시:
  절감: 고객 응답 자동화로 연 $120K 절감
  비용: $60K (개발 $30K + 운영 $30K)
  ROI = (120K - 60K) / 60K × 100% = 100%
```"""),

        code("""# ROI 계산기
def calculate_roi(annual_savings, initial_cost, monthly_cost):
    annual_cost = initial_cost + (monthly_cost * 12)
    roi = (annual_savings - annual_cost) / annual_cost * 100
    payback_months = initial_cost / (annual_savings / 12 - monthly_cost)

    print("=== GraphRAG ROI 분석 ===")
    print(f"  연간 절감액: ${annual_savings:,.0f}")
    print(f"  초기 비용:   ${initial_cost:,.0f}")
    print(f"  월 운영비:   ${monthly_cost:,.0f}")
    print(f"  연간 총비용: ${annual_cost:,.0f}")
    print(f"  ROI: {roi:.1f}%")
    print(f"  손익분기: {payback_months:.1f}개월")
    return roi

# 예시: 고객 응답 자동화
calculate_roi(
    annual_savings=120000,
    initial_cost=30000,
    monthly_cost=2500
)"""),

        md("""---
## 3. PoC → 프로덕션 전환

### 5단계 전환 프로세스

| 단계 | 기간 | 목표 | 성공 기준 |
|------|------|------|----------|
| 1. PoC | 2주 | 기술 검증 | 3-hop 쿼리 작동 |
| 2. 파일럿 | 1개월 | 실사용자 테스트 | RAGAS > 0.7 |
| 3. 베타 | 2개월 | 안정성 검증 | P99 < 3초 |
| 4. GA | 1개월 | 전사 배포 | SLA 99.5% |
| 5. 운영 | 지속 | 모니터링 + 개선 | 월간 리뷰 |

> **실패하는 PoC의 90%**: 데이터 품질 문제 (온톨로지 미정의, ER 미수행)"""),

        md("""---
## 4. 보안 & 컴플라이언스

### PII 처리

```python
def mask_pii(text: str) -> str:
    # 이름 → Person_A, Person_B
    # 전화번호 → XXX-XXXX-XXXX
    # 주민번호 → 완전 삭제
    pass
```

### Neo4j RBAC (Enterprise)

```cypher
CREATE ROLE consultant;
GRANT MATCH {*} ON GRAPH * NODES Product TO consultant;
DENY MATCH {*} ON GRAPH * NODES Person TO consultant;
```

### 감사 로그

| 로그 항목 | 용도 |
|----------|------|
| 쿼리 로그 | 누가 어떤 쿼리를 실행했는지 |
| 변경 로그 | 노드/관계 생성/수정/삭제 추적 |
| API 호출 로그 | LLM API 사용량 추적 |"""),

        code("""# PII 마스킹 함수
import re

def mask_pii(text: str) -> str:
    # 전화번호 마스킹
    text = re.sub(r'\\d{3}-\\d{4}-\\d{4}', 'XXX-XXXX-XXXX', text)
    # 이메일 마스킹
    text = re.sub(r'[\\w.-]+@[\\w.-]+', '***@***.***', text)
    return text

# 테스트
sample = "김철수 (010-1234-5678, kim@example.com)에게 연락하세요."
print(f"원본: {sample}")
print(f"마스킹: {mask_pii(sample)}")"""),

        md("""---
## 5. CI/CD + 운영 자동화

### GitHub Actions 파이프라인

```yaml
name: GraphRAG CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      neo4j:
        image: neo4j:5-community
        env:
          NEO4J_AUTH: neo4j/testpassword
          NEO4J_PLUGINS: '["apoc"]'
        ports: ["7687:7687"]
    steps:
      - uses: actions/checkout@v4
      - run: pip install -r requirements.txt
      - run: python -m pytest tests/ -v
      - run: python eval/run_ragas.py --threshold 0.7
```

### Quality Gate

| 체크 | 임계값 | 실패 시 |
|------|--------|--------|
| RAGAS 평균 | > 0.7 | 배포 차단 |
| P99 응답시간 | < 3초 | 경고 |
| 에러율 | < 1% | 배포 차단 |"""),

        code("""# 프로덕션 체크리스트 자가진단
def production_checklist():
    checks = []

    # 1. Neo4j 연결
    try:
        driver.verify_connectivity()
        checks.append(("Neo4j 연결", "PASS"))
    except:
        checks.append(("Neo4j 연결", "FAIL"))

    # 2. 인덱스 확인
    try:
        result = run_query("SHOW INDEXES YIELD name RETURN count(*) AS cnt", print_result=False)
        cnt = result[0]["cnt"]
        checks.append(("인덱스", "PASS" if cnt >= 3 else "WARN"))
    except:
        checks.append(("인덱스", "FAIL"))

    # 3. 데이터 존재
    result = run_query("MATCH (n) RETURN count(n) AS cnt", print_result=False)
    cnt = result[0]["cnt"] if result else 0
    checks.append(("그래프 데이터", "PASS" if cnt > 0 else "FAIL"))

    # 4. API 키
    api_key = os.getenv("OPENAI_API_KEY", "")
    checks.append(("OpenAI API 키", "PASS" if len(api_key) > 10 else "FAIL"))

    print("=" * 50)
    print("  프로덕션 체크리스트")
    print("=" * 50)
    for name, status in checks:
        icon = {"PASS": "[OK]", "WARN": "[!!]", "FAIL": "[XX]"}[status]
        print(f"  {icon} {name}")
    print(f"\\n  결과: {sum(1 for _,s in checks if s=='PASS')}/{len(checks)} 통과")

production_checklist()"""),

        md("""---
## 6. 연습 문제

### 문제 1: ROI 계산
본인 도메인에서 GraphRAG 도입 시 ROI를 계산하세요.

### 문제 2: CI/CD 파이프라인
GitHub Actions 워크플로우 YAML을 작성하세요.

### 문제 3: 보안 정책
PII 마스킹 규칙을 3개 이상 추가하세요."""),

        code("""# [연습] 여기에 코드를 작성하세요
print("엔터프라이즈 GraphRAG 연습 문제를 풀어보세요!")"""),

        md("""---
## 7. 정리

| 영역 | 핵심 |
|------|------|
| ROI | 절감액 vs 비용, 손익분기점 |
| PoC 전환 | 5단계 (PoC→파일럿→베타→GA→운영) |
| 보안 | PII 마스킹, RBAC, 감사 로그 |
| CI/CD | Quality Gate, 자동 테스트 |

> **"GraphRAG 도입의 80%는 기술이 아니라 조직과 프로세스 문제다."**

### 다음 Part 13: 캡스톤 프로젝트"""),
        CLEANUP_CODE,
    ]
    save("part12_enterprise.ipynb", cells)


# ============================================================
# Part 13: 캡스톤 프로젝트
# ============================================================
def gen_part13():
    cells = [
        md("""# Part 13: 캡스톤 프로젝트

**소요 시간**: 약 2.5시간
**난이도**: ⭐⭐⭐⭐⭐ (고급)
**형태**: 워크숍 (튜토리얼이 아닌 실습 가이드)
**목표**: Part 1-12에서 배운 모든 기술을 통합하여 나만의 GraphRAG 시스템을 엔드투엔드로 구축한다.

---

> **이 노트북은 대부분 TODO입니다.** 여러분이 직접 코드를 작성해야 합니다.
> Part 1-12의 코드를 참고하면서 진행하세요.

---

## 워크숍 구조

| 섹션 | 시간 | 내용 |
|------|------|------|
| 1. 킥오프 | 20분 | 도메인 선택, 아키텍처 설계, 예산 추정 |
| 2. 구축 | 70분 | 데이터 수집 → 온톨로지 → 추출 → 적재 → 검색 |
| 3. 평가 | 30분 | RAGAS 평가, 비용/속도/정확도 리포트 |
| 4. 발표 | 30분 | 라이브 데모, 아키텍처 설명, 회고 |"""),
        ENV_SETUP_MD,
        code("""import os, json, time
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()
load_dotenv(dotenv_path="../.env")

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
driver.verify_connectivity()
print("[OK] 환경 준비 완료")

def run_query(query, parameters=None, print_result=True):
    with driver.session() as session:
        result = session.run(query, parameters or {})
        records = [record.data() for record in result]
        if print_result:
            for i, rec in enumerate(records, 1):
                print(f"  [{i}] {rec}")
        return records"""),

        md("""---
---
# Section 1: 프로젝트 킥오프 (20분)

## 1.1 도메인 선택

아래 도메인 중 하나를 선택하거나, 본인 도메인을 직접 정의하세요.

| 도메인 | 데이터 소스 | 난이도 | 핵심 관계 |
|--------|-----------|--------|----------|
| 금융/투자 | 뉴스, 공시 | ⭐⭐⭐ | 투자, 경쟁, 인수 |
| 법률 | 판례, 법령 | ⭐⭐⭐⭐ | 인용, 적용, 해석 |
| 의료 | 논문, 가이드라인 | ⭐⭐⭐⭐⭐ | 치료, 부작용, 상호작용 |
| IT/통신 | 기술 문서 | ⭐⭐⭐ | 의존, 호환, 대체 |
| 자유 선택 | - | - | - |"""),

        code("""# TODO: 도메인 정의
MY_DOMAIN = ""  # 예: "금융/투자"
DATA_SOURCE = ""  # 예: "한국 IT 기업 뉴스 기사 20개"
KEY_QUESTION = ""  # 예: "삼성전자에 투자한 기관이 투자한 다른 기업은?"

print("=== 프로젝트 도메인 ===")
print(f"  도메인: {MY_DOMAIN or '미정'}")
print(f"  데이터: {DATA_SOURCE or '미정'}")
print(f"  핵심 질문: {KEY_QUESTION or '미정'}")

if all([MY_DOMAIN, DATA_SOURCE, KEY_QUESTION]):
    print("\\n[OK] 도메인 정의 완료!")
else:
    print("\\n[TODO] 위 변수를 채우세요!")"""),

        md("""## 1.2 아키텍처 설계

### TODO: 5-Layer 아키텍처를 설계하세요

```
L1 Strategy   : 도메인 특성 → GraphRAG 도입 판단
L2 Data       : 데이터 수집 → 전처리 → Baseline
L3 Infra      : Neo4j 설정, 인덱스, 메모리
L4 Processing : 온톨로지 → LLM 추출 → ER → 적재 → 검색
L5 Deployment : 평가, 최적화, 모니터링
```"""),

        code("""# TODO: 아키텍처 정의
architecture = {
    "L1_strategy": {
        "domain": MY_DOMAIN,
        "why_graphrag": "",  # 예: "Multi-hop 투자 관계 추적 필요"
    },
    "L2_data": {
        "source": DATA_SOURCE,
        "doc_count": 0,
        "preprocessing": [],  # 예: ["PDF→텍스트", "청크 분할"]
    },
    "L3_infra": {
        "neo4j_version": "5-community",
        "plugins": ["apoc"],
    },
    "L4_processing": {
        "ontology_entities": [],   # 예: ["Company", "Person", "Product"]
        "ontology_relations": [],  # 예: ["INVESTS_IN", "DEVELOPS"]
        "llm_model": "gpt-4o",
        "search_type": "hybrid",   # text2cypher, vector, hybrid
    },
    "L5_deployment": {
        "eval_method": "RAGAS",
        "target_accuracy": 0.7,
    }
}

# TODO: 위 딕셔너리를 채우세요
print("아키텍처를 설계해주세요!")"""),

        code("""# TODO: 예산 추정
def estimate_budget(num_docs, num_queries_per_day, model="gpt-4o"):
    prices = {
        "gpt-4o": {"input": 0.005, "output": 0.015},
        "gpt-4o-mini": {"input": 0.00015, "output": 0.0006},
    }
    p = prices.get(model, prices["gpt-4o"])

    # 인덱싱 비용 (1회)
    tokens_per_doc = 2000
    indexing_cost = num_docs * tokens_per_doc / 1000 * (p["input"] + p["output"])

    # 월간 쿼리 비용
    tokens_per_query = 3000
    monthly_queries = num_queries_per_day * 30
    query_cost = monthly_queries * tokens_per_query / 1000 * (p["input"] + p["output"])

    print(f"=== 예산 추정 ({model}) ===")
    print(f"  문서 수: {num_docs}개")
    print(f"  일일 쿼리: {num_queries_per_day}회")
    print(f"  인덱싱 비용 (1회): ${indexing_cost:.2f}")
    print(f"  월간 쿼리 비용: ${query_cost:.2f}")
    print(f"  월간 총비용: ${indexing_cost + query_cost:.2f}")

# TODO: 본인 프로젝트에 맞게 수정
# estimate_budget(num_docs=50, num_queries_per_day=100, model="gpt-4o-mini")
print("예산 추정 함수를 실행해보세요!")"""),

        md("""---
---
# Section 2: 엔드투엔드 구축 (70분)

## TODO: 각 단계를 구현하세요

| 단계 | 참고 Part | 예상 시간 |
|------|----------|----------|
| 데이터 수집 | Part 2 | 10분 |
| 온톨로지 설계 | Part 2 | 10분 |
| LLM 추출 | Part 3 | 15분 |
| Entity Resolution | Part 4 | 10분 |
| Neo4j 적재 | Part 1-2 | 10분 |
| 검색 파이프라인 | Part 6, 10 | 15분 |"""),

        code("""# TODO: 1. 데이터 수집 (Part 2 참고)
# documents = load_documents("./data/my_docs/")
print("[TODO] 데이터를 수집하세요")"""),

        code("""# TODO: 2. 온톨로지 설계 (Part 2 참고)
ontology = {
    "entity_types": [
        # {"name": "Company", "description": "기업"},
    ],
    "relation_types": [
        # {"name": "INVESTS_IN", "source": "Investor", "target": "Company"},
    ]
}
print("[TODO] 온톨로지를 정의하세요")"""),

        code("""# TODO: 3. LLM 추출 (Part 3 참고)
# from openai import OpenAI
# client = OpenAI()
# extracted = extract_entities_relations(text, ontology)
print("[TODO] LLM으로 엔티티/관계를 추출하세요")"""),

        code("""# TODO: 4. Entity Resolution (Part 4 참고)
# from rapidfuzz import fuzz
# duplicates = find_duplicates(entities, threshold=0.85)
print("[TODO] 중복 엔티티를 해소하세요")"""),

        code("""# TODO: 5. Neo4j 적재 (Part 1-2 참고)
# for entity in entities:
#     run_query("MERGE (n:Entity {name: $name}) SET n.type = $type",
#               {"name": entity["name"], "type": entity["type"]})
print("[TODO] Neo4j에 적재하세요")"""),

        code("""# TODO: 6. 검색 파이프라인 (Part 6, 10 참고)
# def graphrag_search(question: str):
#     cypher = generate_cypher(question, schema)
#     results = run_query(cypher)
#     answer = generate_answer(question, results)
#     return answer
print("[TODO] 검색 파이프라인을 구현하세요")"""),

        md("""---
---
# Section 3: 평가 + 벤치마크 (30분)"""),

        code("""# TODO: RAGAS 평가 데이터셋 (30개 질문)
eval_data = [
    # Easy (1-hop) - 10개
    # {"question": "???", "ground_truth": "???", "difficulty": "easy"},

    # Medium (2-hop) - 10개
    # {"question": "???", "ground_truth": "???", "difficulty": "medium"},

    # Hard (Multi-hop) - 10개
    # {"question": "???", "ground_truth": "???", "difficulty": "hard"},
]

print(f"평가 데이터: {len(eval_data)}개")
print("[TODO] 30개 질문을 작성하세요!")"""),

        code("""# TODO: RAGAS 평가 실행
# from ragas import evaluate
# from ragas.metrics import faithfulness, answer_relevancy
# results = evaluate(dataset, metrics=[faithfulness, answer_relevancy])
print("[TODO] RAGAS 평가를 실행하세요 (Part 7 참고)")"""),

        code("""# TODO: 비용/속도/정확도 리포트
# print("=== 벤치마크 리포트 ===")
# print(f"정확도: {accuracy:.1%}")
# print(f"평균 응답시간: {avg_latency:.2f}초")
# print(f"질문당 비용: ${cost_per_query:.4f}")
print("[TODO] 벤치마크 리포트를 생성하세요")"""),

        md("""---
---
# Section 4: 발표 + 피드백 (30분)

## 데모 체크리스트

| 항목 | 체크 |
|------|------|
| Neo4j 실행 확인 | [ ] |
| 데이터 로드 확인 | [ ] |
| API 키 확인 | [ ] |
| Easy 질문 테스트 | [ ] |
| Medium 질문 테스트 | [ ] |
| Hard 질문 테스트 | [ ] |

## 발표 구조 (15분)

1. **문제 정의** (2분): 도메인, GraphRAG 필요성
2. **아키텍처** (3분): 5-Layer 다이어그램
3. **라이브 데모** (3분): Easy/Medium/Hard 질문
4. **벤치마크** (2분): 정확도/속도/비용
5. **Q&A** (5분)"""),

        code("""# TODO: 데모 질문 선정
demo_queries = {
    "easy": "",     # 1-hop 질문
    "medium": "",   # 2-hop 질문
    "hard": "",     # Multi-hop 질문
}

for difficulty, query in demo_queries.items():
    print(f"{difficulty.upper():10} : {query or '미정'}")

if all(demo_queries.values()):
    print("\\n[OK] 데모 준비 완료!")
else:
    print("\\n[TODO] 데모 질문을 선정하세요!")"""),

        md("""---
## 회고

### 캡스톤 프로젝트를 마치며

1. **가장 어려웠던 부분은?**
   -

2. **가장 인상 깊었던 기법은?**
   -

3. **실무에 적용할 아이디어는?**
   -

4. **추가 학습하고 싶은 주제는?**
   -

---

### Part 1-13 전체 여정

| Part | 주제 | Milestone |
|------|------|----------|
| 1-7 | 기초 GraphRAG | 온톨로지 → LLM 추출 → 검색 → 평가 |
| 8-11 | 고급 주제 | 프레임워크, 알고리즘, Agent, 디버깅 |
| 12 | 엔터프라이즈 | PoC, 보안, CI/CD |
| **13** | **캡스톤** | **엔드투엔드 시스템 완성** |

> **이제 여러분은 GraphRAG를 리드할 수 있습니다.**
> 깊이가 곧 가치입니다. 실무에 적용하고, 커뮤니티에 기여하세요!"""),

        code("""# 세션 정리
# driver.close()

print("=" * 60)
print("  Part 13 캡스톤 프로젝트를 마칩니다.")
print("  수고하셨습니다! GraphRAG 여정을 계속 이어가세요!")
print("=" * 60)"""),
    ]
    save("part13_capstone.ipynb", cells)


# ============================================================
# MAIN
# ============================================================
if __name__ == "__main__":
    print("=== Part 8-13 노트북 생성 시작 ===\n")
    gen_part8()
    gen_part9()
    gen_part10()
    gen_part11()
    gen_part12()
    gen_part13()
    print("\n=== 완료! 6개 노트북 생성됨 ===")
