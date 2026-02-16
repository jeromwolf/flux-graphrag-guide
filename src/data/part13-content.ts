import type { SectionContent, SlideContent } from './part1-content';

export const part13Content: SectionContent[] = [
  // Section 1: 프로젝트 킥오프
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '13-1',
        tag: 'discussion',
        title: '도메인 선택 + 프레임워크 선택 근거',
        script: '캡스톤 프로젝트를 시작합니다. 먼저 도메인을 선택하세요. 금융, 법률, 제조, 또는 자유 주제 중 하나를 고르세요. 각 도메인마다 난이도와 데이터 특성이 다릅니다. 금융은 난이도 ⭐⭐⭐로, 투자 관계가 명확해서 온톨로지 설계가 비교적 쉽습니다. 데이터는 공개 금융 데이터(DART, FinanceDataReader)를 쓸 수 있습니다. 추천 프레임워크는 Neo4j + LangChain입니다. 법률은 난이도 ⭐⭐⭐⭐로, 판례 인용 관계가 복잡합니다. 데이터는 대법원 판례 사이트를 크롤링해야 합니다. 추천 프레임워크는 Neo4j + LlamaIndex입니다. 제조는 난이도 ⭐⭐⭐⭐⭐로, 설비-센서-고장 관계가 시간 의존적입니다. 데이터는 제조 로그(직접 생성 또는 UCI Machine Learning Repository)를 쓸 수 있습니다. 추천 프레임워크는 Neo4j + Custom Pipeline입니다. 자유 주제는 난이도 ⭐⭐로, 관심 분야를 정해서 시작하세요. 중요한 것은 "Multi-hop 질문이 존재하는가"를 먼저 확인하는 것입니다.',
        table: {
          headers: ['도메인', '난이도', '데이터 출처', '추천 프레임워크', 'Multi-hop 예시'],
          rows: [
            {
              cells: [
                { text: '금융/투자', bold: true },
                { text: '⭐⭐⭐' },
                { text: 'DART, FinanceDataReader' },
                { text: 'Neo4j + LangChain' },
                { text: 'A 투자자가 투자한 B의 경쟁사는?' }
              ]
            },
            {
              cells: [
                { text: '법률/판례', bold: true },
                { text: '⭐⭐⭐⭐' },
                { text: '대법원 판례 크롤링' },
                { text: 'Neo4j + LlamaIndex' },
                { text: '판례 A를 인용한 판례의 인용 판례는?' }
              ]
            },
            {
              cells: [
                { text: '제조/설비', bold: true },
                { text: '⭐⭐⭐⭐⭐' },
                { text: '제조 로그 (직접 생성/UCI)' },
                { text: 'Neo4j + Custom Pipeline' },
                { text: '고장 원인 체인 3-hop 추적' }
              ]
            },
            {
              cells: [
                { text: '자유 주제', bold: true },
                { text: '⭐⭐' },
                { text: '본인 관심 분야' },
                { text: '자유 선택' },
                { text: 'Multi-hop 존재 여부 확인 필수' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '도메인 선택 기준: Multi-hop 질문이 존재하는가? — 없으면 벡터 RAG로 충분'
        }
      },
      {
        id: '13-2',
        tag: 'practice',
        title: '아키텍처 다이어그램 작성',
        script: '프로젝트 아키텍처를 다이어그램으로 작성하세요. 5개 레이어로 구성합니다. 첫째, Data Layer. 원본 데이터 소스입니다. PDF, JSON, API 등. 둘째, KG Layer. Neo4j 데이터베이스입니다. 온톨로지, 노드, 관계를 저장합니다. 셋째, Algorithm Layer. Text2Cypher, 하이브리드 검색 알고리즘입니다. 넷째, Agent Layer. LangGraph 또는 LlamaIndex Agent입니다. 사용자 질문을 받아 검색 전략을 결정합니다. 다섯째, Search Layer. 최종 사용자 인터페이스입니다. Streamlit 또는 FastAPI + Next.js. 다이어그램에는 데이터 흐름을 화살표로 표시하세요. Data → KG → Algorithm → Agent → Search. 각 레이어에서 어떤 기술을 쓸지 명시하세요. 예: KG Layer = Neo4j 5.15, Algorithm Layer = LangChain Text2Cypher.',
        diagram: {
          nodes: [
            { text: '📄 Data Layer', type: 'entity' },
            { text: 'PDF, JSON, API', type: 'dim' },
            { text: '→ LLM 추출', type: 'relation' },
            { text: '🗃️ KG Layer', type: 'entity' },
            { text: 'Neo4j 5.15, 온톨로지', type: 'dim' },
            { text: '→ Cypher 쿼리', type: 'relation' },
            { text: '⚙️ Algorithm Layer', type: 'entity' },
            { text: 'Text2Cypher, 하이브리드 검색', type: 'dim' },
            { text: '→ Agent 호출', type: 'relation' },
            { text: '🤖 Agent Layer', type: 'entity' },
            { text: 'LangGraph Agent', type: 'dim' },
            { text: '→ 검색 결과', type: 'relation' },
            { text: '💻 Search Layer', type: 'entity' },
            { text: 'Streamlit UI', type: 'dim' }
          ]
        },
        callout: {
          type: 'tip',
          text: '아키텍처 다이어그램은 이해관계자와 소통하는 도구 — 기술 스택을 명시'
        }
      },
      {
        id: '13-3',
        tag: 'practice',
        title: '비용 예산 산정',
        script: '프로젝트 비용을 미리 산정하세요. 3가지 비용 항목이 있습니다. 첫째, API 비용. LLM 추출에 GPT-4를 쓴다면, 문서 100개 기준 약 $20입니다. Text2Cypher에 GPT-4를 쓴다면, 질문 100개 기준 약 $10입니다. RAGAS 평가에 GPT-4를 쓴다면, 질문 50개 기준 약 $15입니다. 총 API 비용은 약 $45입니다. 둘째, 인프라 비용. Neo4j Aura Free Tier는 무료지만 노드 수 제한이 있습니다. Neo4j Aura Pro는 월 $65부터 시작합니다. Docker 로컬 실행은 무료입니다. 셋째, 개발 시간. 2.5시간은 실습 시간이고, 실제 완성까지는 추가 10-20시간이 필요합니다. 총 예산은 API 비용 $50 + 인프라 $0(로컬) ~ $65(Aura) = $50~$115입니다. 비용을 줄이려면 GPT-3.5-turbo를 쓰거나, 로컬 LLM(Ollama)을 사용하세요.',
        table: {
          headers: ['단계', '항목', '예상 API 비용', '인프라 비용', '비고'],
          rows: [
            {
              cells: [
                { text: 'KG 구축', bold: true },
                { text: 'LLM 추출 (100 문서)' },
                { text: '~$20 (GPT-4)' },
                { text: '$0 (로컬 Neo4j)' },
                { text: 'GPT-3.5로 $5 절감 가능' }
              ]
            },
            {
              cells: [
                { text: '검색', bold: true },
                { text: 'Text2Cypher (100 질문)' },
                { text: '~$10 (GPT-4)' },
                { text: '-' },
                { text: 'Claude Haiku로 $3 절감' }
              ]
            },
            {
              cells: [
                { text: '평가', bold: true },
                { text: 'RAGAS (50 질문)' },
                { text: '~$15 (GPT-4)' },
                { text: '-' },
                { text: '교차 평가 시 2배' }
              ]
            },
            {
              cells: [
                { text: '인프라', bold: true },
                { text: 'Neo4j Aura Pro' },
                { text: '-' },
                { text: '$65/월 (선택)' },
                { text: '로컬 Docker는 무료' }
              ]
            },
            {
              cells: [
                { text: '합계', bold: true },
                { text: '-' },
                { text: '~$45', status: 'pass' },
                { text: '$0~$65', status: 'pass' },
                { text: '총 $45~$110' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '비용 절감: GPT-3.5-turbo 또는 로컬 LLM(Ollama) 사용 — API 비용 80% 절감 가능'
        }
      }
    ]
  },
  // Section 2: 엔드투엔드 구축
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '13-4',
        tag: 'practice',
        title: '데이터 수집 → KG 구축 → 알고리즘 적용',
        script: '이제 엔드투엔드로 시스템을 구축합니다. Part 2-9에서 배운 모든 기법을 통합합니다. 첫 번째 단계: 데이터 수집. 도메인에 맞는 데이터를 수집하세요. 금융이라면 DART API로 공시 문서를 다운로드합니다. 법률이라면 대법원 판례를 크롤링합니다. 제조라면 센서 로그를 생성합니다. 두 번째 단계: KG 구축. 온톨로지를 설계하고 Meta-Dictionary를 작성합니다. LLM으로 엔티티/관계를 추출합니다. VLM으로 표/이미지를 처리합니다. Entity Resolution으로 중복을 제거합니다. Neo4j에 적재하고 품질을 검증합니다. 세 번째 단계: 알고리즘 적용. Text2Cypher Agent를 구축합니다. 하이브리드 검색(그래프 + 벡터)을 적용합니다. Temporal 쿼리(시간 추적)를 추가합니다. 코드는 Part 2-9의 예제를 참고하세요. 핵심은 각 단계를 독립적으로 검증하는 것입니다. KG 구축이 완료되면 샘플 쿼리로 테스트하세요. 알고리즘 적용 후 벤치마크 질문으로 평가하세요.',
        code: {
          language: 'python',
          code: `# 엔드투엔드 GraphRAG 구축 — 통합 코드

# 1. 데이터 수집 (예: 금융 공시)
from finance_data_reader import get_dart_filings
docs = get_dart_filings(company="삼성전자", start_date="2023-01-01")

# 2. KG 구축
from llm_extractor import extract_entities_relations
from vlm_processor import extract_table_to_graph
from entity_resolution import deduplicate_entities
from neo4j import GraphDatabase

# 2-1. LLM 추출
ontology = load_ontology("finance_ontology.json")
meta_dict = load_meta_dictionary("finance_meta.json")
entities = []
for doc in docs:
    ents = extract_entities_relations(doc, ontology, meta_dict)
    entities.extend(ents)

# 2-2. VLM 표 처리 (문서에 표가 있으면)
table_entities = extract_table_to_graph(docs, ontology)
entities.extend(table_entities)

# 2-3. Entity Resolution
entities = deduplicate_entities(entities, threshold=0.85)

# 2-4. Neo4j 적재
driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "password"))
with driver.session() as session:
    for ent in entities:
        session.run("""
            MERGE (e:Entity {id: $id})
            SET e.name = $name, e.type = $type
        """, id=ent.id, name=ent.name, type=ent.type)

# 3. 알고리즘 적용 — Text2Cypher Agent
from langchain.agents import create_react_agent
from langchain_community.graphs import Neo4jGraph

graph = Neo4jGraph(url="bolt://localhost:7687", username="neo4j", password="password")
agent = create_react_agent(
    llm=ChatOpenAI(model="gpt-4"),
    tools=[Text2CypherTool(graph)],
    prompt=text2cypher_prompt
)

# 4. 하이브리드 검색 (Part 6 참고)
def hybrid_search(query):
    cypher_result = agent.invoke(query)
    vector_result = vector_store.similarity_search(query, k=5)
    return rerank(cypher_result, vector_result)

# 5. 샘플 질문 테스트
test_queries = [
    "삼성전자에 투자한 기관은?",
    "국민연금이 투자한 반도체 기업은?",
    "최근 3년간 투자 변화는?"
]
for q in test_queries:
    result = hybrid_search(q)
    print(f"Q: {q}\\nA: {result}\\n")`
        },
        callout: {
          type: 'key',
          text: '각 단계를 독립적으로 검증 — KG 구축 후 샘플 쿼리, 알고리즘 후 벤치마크'
        }
      },
      {
        id: '13-5',
        tag: 'practice',
        title: 'Agentic 검색 파이프라인 구축',
        script: 'Part 10에서 배운 LangGraph Agent를 구축합니다. Agentic 검색은 사용자 질문을 분석해서 최적의 검색 전략을 선택합니다. 파이프라인은 4단계로 구성됩니다. 첫째, Query Classification. 질문이 Multi-hop인지, 1-hop인지, Temporal인지 분류합니다. 둘째, Strategy Selection. Multi-hop이면 Text2Cypher, 1-hop이면 벡터 검색, Temporal이면 시간 쿼리를 선택합니다. 셋째, Execution. 선택된 전략으로 검색을 실행합니다. 넷째, Reranking. 여러 전략의 결과를 Rerank해서 최종 답변을 생성합니다. LangGraph로 이 파이프라인을 구성하면 Agent가 자동으로 의사결정합니다. 코드는 Part 10 슬라이드를 참고하세요.',
        code: {
          language: 'python',
          code: `# LangGraph Agentic 검색 파이프라인 (Part 10 참고)

from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Literal

class State(TypedDict):
    query: str
    query_type: Literal["multi_hop", "1_hop", "temporal"]
    results: list
    final_answer: str

# 1. Query Classification Node
def classify_query(state: State):
    query = state["query"]
    # LLM으로 질문 유형 분류
    classification = llm.invoke(f"Classify: {query}\\nOptions: multi_hop, 1_hop, temporal")
    state["query_type"] = classification
    return state

# 2. Strategy Selection Node
def select_strategy(state: State):
    if state["query_type"] == "multi_hop":
        results = text2cypher_search(state["query"])
    elif state["query_type"] == "1_hop":
        results = vector_search(state["query"])
    else:
        results = temporal_search(state["query"])
    state["results"] = results
    return state

# 3. Reranking Node
def rerank_results(state: State):
    # Cohere Rerank 또는 LLM Rerank
    reranked = rerank(state["results"], state["query"])
    state["final_answer"] = generate_answer(reranked, state["query"])
    return state

# LangGraph 구성
workflow = StateGraph(State)
workflow.add_node("classify", classify_query)
workflow.add_node("select", select_strategy)
workflow.add_node("rerank", rerank_results)

workflow.add_edge(START, "classify")
workflow.add_edge("classify", "select")
workflow.add_edge("select", "rerank")
workflow.add_edge("rerank", END)

graph = workflow.compile()

# 실행
result = graph.invoke({"query": "삼성전자 투자 기관의 다른 투자처는?"})
print(result["final_answer"])`
        },
        callout: {
          type: 'key',
          text: 'Agentic 검색: 질문 분류 → 전략 선택 → 실행 → Rerank — LangGraph로 자동화'
        }
      },
      {
        id: '13-6',
        tag: 'practice',
        title: '디버깅 + 최적화 + 모니터링',
        script: '시스템이 구축됐으면 Part 11-12 기법으로 디버깅, 최적화, 모니터링을 적용합니다. 디버깅: LangSmith로 LLM 호출을 추적하세요. Text2Cypher가 실패하면 생성된 Cypher 쿼리를 로그에서 확인하세요. Neo4j EXPLAIN으로 쿼리 성능을 분석하세요. 최적화: Neo4j 인덱스를 추가하세요. CREATE INDEX FOR (c:Company) ON (c.name). APOC으로 배치 처리를 적용하세요. 쿼리 캐싱으로 중복 쿼리를 방지하세요. 모니터링: Grafana 대시보드를 구축하세요. 노드 수, 쿼리 시간, API 비용을 추적하세요. 알림을 설정해서 품질 저하/비용 초과 시 Slack으로 알림받으세요. 이 3가지를 적용하면 프로덕션 수준의 시스템이 됩니다.',
        table: {
          headers: ['영역', '기법', '도구', 'Part 참고'],
          rows: [
            {
              cells: [
                { text: '디버깅', bold: true },
                { text: 'LLM 호출 추적' },
                { text: 'LangSmith' },
                { text: 'Part 11' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'Cypher 쿼리 로그' },
                { text: 'Neo4j query.log' },
                { text: 'Part 11' }
              ]
            },
            {
              cells: [
                { text: '최적화', bold: true },
                { text: 'Neo4j 인덱스' },
                { text: 'CREATE INDEX' },
                { text: 'Part 7' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'APOC 배치 처리' },
                { text: 'apoc.periodic.iterate' },
                { text: 'Part 7' }
              ]
            },
            {
              cells: [
                { text: '모니터링', bold: true },
                { text: 'Grafana 대시보드' },
                { text: 'Prometheus + Grafana' },
                { text: 'Part 12' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'Slack 알림' },
                { text: 'Grafana Alert' },
                { text: 'Part 12' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '디버깅 + 최적화 + 모니터링 = 프로덕션 수준 시스템'
        }
      }
    ]
  },
  // Section 3: 평가 + 벤치마크
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '13-7',
        tag: 'practice',
        title: 'RAGAS 평가 실행',
        script: 'RAGAS로 시스템을 평가합니다. Part 7에서 배운 평가 데이터셋을 사용하세요. 난이도별로 질문을 구성합니다. Easy 질문 10개, Medium 질문 10개, Hard 질문 10개. 총 30개 질문으로 평가합니다. RAGAS 메트릭 4가지를 측정합니다. Faithfulness, Answer Relevancy, Context Precision, Context Recall. 코드로 평가를 자동화하세요. 결과를 JSON으로 저장하면 나중에 비교할 수 있습니다. 교차 평가도 실행하세요. GPT-4 답변은 Claude로, Claude 답변은 GPT-4로 평가합니다. 상관계수 0.7 이상이면 LLM 평가를 신뢰할 수 있습니다.',
        code: {
          language: 'python',
          code: `# RAGAS 평가 실행 스크립트

from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision, context_recall
from datasets import Dataset

# 1. 평가 데이터셋 준비 (난이도별)
eval_data = [
    # Easy (1-hop)
    {"question": "삼성전자 CEO는?", "ground_truth": "이재용", "difficulty": "easy"},
    {"question": "국민연금 총 자산은?", "ground_truth": "900조원", "difficulty": "easy"},
    # ... 총 10개

    # Medium (2-hop)
    {"question": "삼성전자 투자 기관은?", "ground_truth": "국민연금", "difficulty": "medium"},
    # ... 총 10개

    # Hard (Multi-hop)
    {"question": "삼성 투자 기관의 다른 반도체 투자처는?", "ground_truth": "SK하이닉스", "difficulty": "hard"},
    # ... 총 10개
]

# 2. 시스템으로 답변 생성
for item in eval_data:
    result = graph_rag_system.query(item["question"])
    item["answer"] = result["answer"]
    item["contexts"] = result["contexts"]

# 3. RAGAS 평가
dataset = Dataset.from_list(eval_data)
results = evaluate(
    dataset,
    metrics=[faithfulness, answer_relevancy, context_precision, context_recall]
)

# 4. 난이도별 집계
easy_scores = [r for r in results if r["difficulty"] == "easy"]
medium_scores = [r for r in results if r["difficulty"] == "medium"]
hard_scores = [r for r in results if r["difficulty"] == "hard"]

print(f"Easy: {np.mean(easy_scores):.2f}")
print(f"Medium: {np.mean(medium_scores):.2f}")
print(f"Hard: {np.mean(hard_scores):.2f}")

# 5. 결과 저장
import json
with open("ragas_results.json", "w") as f:
    json.dump(results, f, indent=2)`
        },
        callout: {
          type: 'tip',
          text: '난이도별 평가 + 결과 저장 — 개선 후 재평가로 진전 확인'
        }
      },
      {
        id: '13-8',
        tag: 'practice',
        title: '비용/속도/정확도 리포트 생성',
        script: '벤치마크 결과를 종합 리포트로 정리합니다. 3가지 축을 측정합니다. 첫째, 정확도. Easy/Medium/Hard 질문별 정확도를 표로 정리합니다. RAGAS 메트릭 4가지도 포함합니다. 둘째, 속도. 평균 응답 시간, P95, P99를 측정합니다. 병목 지점을 분석합니다. LLM 호출 시간, Neo4j 쿼리 시간, Rerank 시간을 분리해서 측정하세요. 셋째, 비용. 질문당 API 비용을 계산합니다. GPT-4, GPT-3.5, Claude Haiku 비용을 비교합니다. 월간 예상 비용을 산출합니다. 이 리포트를 바탕으로 "어디를 개선할 것인가"를 결정합니다. 정확도가 낮으면 온톨로지를 개선합니다. 속도가 느리면 인덱스를 추가합니다. 비용이 높으면 모델을 교체합니다.',
        table: {
          headers: ['메트릭', '측정값', '목표', '상태', '개선 방향'],
          rows: [
            {
              cells: [
                { text: 'Easy 정확도', bold: true },
                { text: '92%' },
                { text: '90%+', status: 'pass' },
                { text: '✅', status: 'pass' },
                { text: '-' }
              ]
            },
            {
              cells: [
                { text: 'Hard 정확도', bold: true },
                { text: '68%' },
                { text: '70%+', status: 'warn' },
                { text: '⚠️', status: 'warn' },
                { text: 'Meta-Dictionary 강화' }
              ]
            },
            {
              cells: [
                { text: 'RAGAS Faithfulness', bold: true },
                { text: '0.82' },
                { text: '0.8+', status: 'pass' },
                { text: '✅', status: 'pass' },
                { text: '-' }
              ]
            },
            {
              cells: [
                { text: '평균 응답 시간', bold: true },
                { text: '2.8초' },
                { text: '3초 이내', status: 'pass' },
                { text: '✅', status: 'pass' },
                { text: '-' }
              ]
            },
            {
              cells: [
                { text: 'P99 응답 시간', bold: true },
                { text: '12초' },
                { text: '10초 이내', status: 'warn' },
                { text: '⚠️', status: 'warn' },
                { text: 'Neo4j 인덱스 추가' }
              ]
            },
            {
              cells: [
                { text: '질문당 API 비용', bold: true },
                { text: '$0.08' },
                { text: '$0.10 이하', status: 'pass' },
                { text: '✅', status: 'pass' },
                { text: '-' }
              ]
            },
            {
              cells: [
                { text: '월간 예상 비용', bold: true },
                { text: '$240 (1000 질문)' },
                { text: '$500 이하', status: 'pass' },
                { text: '✅', status: 'pass' },
                { text: '-' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '정확도/속도/비용 종합 리포트 — 개선 우선순위 결정의 근거'
        }
      },
      {
        id: '13-9',
        tag: 'discussion',
        title: '개선 포인트 3개 도출',
        script: '벤치마크 결과를 바탕으로 개선 포인트 3개를 도출하세요. 첫 번째 개선: 정확도 향상. Hard 질문 정확도가 68%로 목표(70%) 미달입니다. Meta-Dictionary를 강화하세요. 도메인 전문가와 협업해서 엔티티 정의를 더 명확히 하세요. 두 번째 개선: 속도 최적화. P99 응답 시간이 12초로 목표(10초) 초과입니다. Neo4j 인덱스를 추가하세요. Company.name, Investor.name에 인덱스를 생성하세요. APOC 병렬 처리를 적용하세요. 세 번째 개선: 비용 절감. 현재 GPT-4를 쓰고 있지만, Easy 질문은 GPT-3.5로 충분합니다. 질문 유형별 모델 라우팅을 구현하세요. Easy → GPT-3.5 ($0.001), Hard → GPT-4 ($0.03). 이렇게 3가지를 개선하면 프로덕션 준비가 완료됩니다.',
        table: {
          headers: ['개선 포인트', '현재 문제', '해결 방법', '예상 효과'],
          rows: [
            {
              cells: [
                { text: '1. 정확도 향상', bold: true },
                { text: 'Hard 질문 68% (목표 70%)' },
                { text: 'Meta-Dictionary 강화' },
                { text: '정확도 +5% → 73%' }
              ]
            },
            {
              cells: [
                { text: '2. 속도 최적화', bold: true },
                { text: 'P99 응답 12초 (목표 10초)' },
                { text: 'Neo4j 인덱스 + APOC' },
                { text: 'P99 → 8초 (20% 개선)' }
              ]
            },
            {
              cells: [
                { text: '3. 비용 절감', bold: true },
                { text: '질문당 $0.08 (GPT-4)' },
                { text: '질문별 모델 라우팅' },
                { text: '질문당 $0.04 (50% 절감)' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '개선 3개: 정확도 +5%, 속도 -20%, 비용 -50% — 프로덕션 준비 완료'
        }
      }
    ]
  },
  // Section 4: 발표 + 피드백
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '13-10',
        tag: 'discussion',
        title: '시스템 라이브 데모 체크리스트',
        script: '캡스톤 프로젝트 발표를 준비합니다. 라이브 데모 체크리스트를 보겠습니다. 첫째, 환경 준비. Neo4j가 실행 중인지 확인하세요. 데이터가 로드되어 있는지 확인하세요. LLM API 키가 유효한지 확인하세요. 둘째, 데모 시나리오. Easy 질문 1개, Medium 질문 1개, Hard 질문 1개를 준비하세요. 각 질문에 대해 예상 답변을 미리 확인하세요. 셋째, 실패 대비. 네트워크 오류 시 대비해서 스크린샷을 준비하세요. LLM 응답이 느리면 "지금 생각 중입니다"라고 설명하세요. 넷째, 인사이트 강조. "이 질문은 벡터 RAG로 불가능합니다"라고 명확히 설명하세요. "Multi-hop 추론으로 3단계 관계를 추적했습니다"라고 강조하세요. 데모는 5분 이내로 진행하세요. 핵심만 보여주세요.',
        table: {
          headers: ['단계', '체크 항목', '비고'],
          rows: [
            {
              cells: [
                { text: '환경 준비', bold: true },
                { text: 'Neo4j 실행, 데이터 로드, API 키 확인' },
                { text: '발표 30분 전 체크' }
              ]
            },
            {
              cells: [
                { text: '데모 시나리오', bold: true },
                { text: 'Easy 1개, Medium 1개, Hard 1개' },
                { text: '예상 답변 미리 확인' }
              ]
            },
            {
              cells: [
                { text: '실패 대비', bold: true },
                { text: '스크린샷, 네트워크 오류 대응' },
                { text: '백업 플랜 준비' }
              ]
            },
            {
              cells: [
                { text: '인사이트 강조', bold: true },
                { text: 'Multi-hop 추론 능력 강조' },
                { text: '벡터 RAG와 차별점' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '데모는 5분 이내, 핵심만 — Hard 질문으로 Multi-hop 추론 능력 강조'
        }
      },
      {
        id: '13-11',
        tag: 'discussion',
        title: '아키텍처 + 벤치마크 발표 템플릿',
        script: '발표 구조는 3부로 나눕니다. 첫째, 문제 정의 (2분). 도메인 소개, 기존 시스템의 한계, GraphRAG가 필요한 이유. 예: "보험 약관 비교 질문은 벡터 RAG로 30% 정확도. GraphRAG로 85%까지 향상." 둘째, 아키텍처 (3분). 5개 레이어 다이어그램을 보여주세요. Data → KG → Algorithm → Agent → Search. 각 레이어에서 어떤 기술을 썼는지 설명하세요. 예: "KG Layer는 Neo4j 5.15, Algorithm Layer는 LangChain Text2Cypher." 셋째, 벤치마크 (5분). 정확도/속도/비용 리포트를 표로 보여주세요. Easy/Medium/Hard 질문별 정확도를 비교하세요. 개선 포인트 3개를 발표하세요. 총 10분 발표, 5분 질의응답으로 구성하세요.',
        table: {
          headers: ['순서', '주제', '시간', '핵심 내용'],
          rows: [
            {
              cells: [
                { text: '1', bold: true },
                { text: '문제 정의' },
                { text: '2분' },
                { text: '도메인, 기존 한계, GraphRAG 필요성' }
              ]
            },
            {
              cells: [
                { text: '2', bold: true },
                { text: '아키텍처' },
                { text: '3분' },
                { text: '5개 레이어, 기술 스택, 데이터 흐름' }
              ]
            },
            {
              cells: [
                { text: '3', bold: true },
                { text: '라이브 데모' },
                { text: '3분' },
                { text: 'Easy/Medium/Hard 질문 시연' }
              ]
            },
            {
              cells: [
                { text: '4', bold: true },
                { text: '벤치마크' },
                { text: '2분' },
                { text: '정확도/속도/비용 리포트' }
              ]
            },
            {
              cells: [
                { text: '5', bold: true },
                { text: '질의응답' },
                { text: '5분' },
                { text: '청중 질문 대응' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '발표 10분 + 질의응답 5분 — 아키텍처 다이어그램과 벤치마크 표가 핵심'
        }
      },
      {
        id: '13-12',
        tag: 'theory',
        title: '전체 과정 회고 + 다음 단계',
        script: '13개 Part의 여정을 돌아봅시다. Part 1: GraphRAG 동기부여. 벡터 RAG의 한계를 보고 Multi-hop 추론의 가치를 배웠습니다. Part 2: 수작업 KG 구축. 온톨로지 설계와 Meta-Dictionary의 중요성을 체감했습니다. Part 3: LLM 자동화. 편리함과 환각의 양면을 경험했습니다. Part 4: Entity Resolution. 중복 제거의 어려움과 가중치 싸움을 배웠습니다. Part 5: 멀티모달 VLM. 표와 이미지를 그래프로 변환하는 실무 역량을 습득했습니다. Part 6: 통합 검색. Text2Cypher Agent와 하이브리드 검색으로 GraphRAG 시스템을 완성했습니다. Part 7: 실무 평가. RAGAS 평가와 GDBMS 선정 기준을 배웠습니다. Part 8-11: 고급 주제. Temporal 쿼리, Agentic 검색, 비용 최적화, 디버깅을 학습했습니다. Part 12: 엔터프라이즈 도입. PoC 설계, 보안, CI/CD, 모니터링을 실무 수준으로 배웠습니다. Part 13: 캡스톤 프로젝트. 지금 여러분은 처음부터 끝까지 GraphRAG 시스템을 구축할 수 있습니다. 다음 단계는 무엇일까요? 첫째, 실무 프로젝트 적용. 회사나 개인 프로젝트에서 GraphRAG를 도입해보세요. 둘째, 커뮤니티 참여. Neo4j 포럼, LangChain Discord에서 다른 사람들과 교류하세요. 셋째, 최신 연구 추적. GraphRAG는 빠르게 발전하는 분야입니다. arXiv, SIGMOD, NeurIPS 논문을 읽으세요. 넷째, 오픈소스 기여. 여러분이 만든 도구나 개선 사항을 공유하세요. 이제 여러분은 GraphRAG를 리드할 수 있습니다. 깊이가 곧 가치입니다. 수고하셨습니다!',
        table: {
          headers: ['Part', '주제', 'Milestone'],
          rows: [
            {
              cells: [
                { text: 'Part 1-7', bold: true },
                { text: '기본 GraphRAG 구축' },
                { text: '온톨로지 → LLM 추출 → 검색 → 평가', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 8-11', bold: true },
                { text: '고급 주제' },
                { text: 'Temporal, Agentic, 비용 최적화', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 12', bold: true },
                { text: '엔터프라이즈 실전' },
                { text: 'PoC, 보안, CI/CD, 모니터링', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 13', bold: true },
                { text: '캡스톤 프로젝트' },
                { text: '엔드투엔드 시스템 완성', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '이제 GraphRAG를 리드할 수 있다 — 깊이가 곧 가치. 실무에 적용하고, 커뮤니티에 기여하세요!'
        }
      }
    ]
  }
];
