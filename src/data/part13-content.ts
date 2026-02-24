import type { SectionContent, SlideContent } from './part1-content';

export const part13Content: SectionContent[] = [
  // ═══════════════════════════════════════════════════════════════
  // Section 1: 프로젝트 킥오프 — Part 1~12 통합 설계 (25min) — 5 slides
  // ═══════════════════════════════════════════════════════════════
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '13-1',
        tag: 'discussion',
        title: '도메인 선택 — 제조 ⭐⭐⭐⭐⭐ 추천',
        script: '캡스톤 프로젝트를 시작합니다. 도메인을 선택하세요. 핵심 기준은 "Multi-hop 질문이 존재하는가?"입니다. 없으면 벡터 RAG로 충분합니다. 제조 도메인을 강력히 추천합니다. 왜냐하면 Part 2에서 온톨로지를 설계하고, Part 3에서 LLM 추출을 하고, Part 4에서 Entity Resolution을 하고, Part 5에서 VLM으로 검사 성적표를 처리하고, Part 6에서 Text2Cypher Agent를 만들고, Part 9에서 Leiden + PageRank를 적용하고, Part 10에서 5개 Tool + Supervisor를 구축했습니다. 이 모든 것이 제조 도메인으로 되어 있어서, 캡스톤에서 바로 통합할 수 있습니다. 다른 도메인을 선택하면 온톨로지부터 다시 설계해야 합니다.',
        table: {
          headers: ['도메인', '난이도', '데이터 출처', '추천 이유', 'Multi-hop 예시'],
          rows: [
            {
              cells: [
                { text: '제조/품질 ⭐', bold: true },
                { text: '⭐⭐⭐⭐⭐' },
                { text: '제조 품질 보고서, 정비 이력' },
                { text: 'Part 2~10에서 이미 구축한 제조 KG를 확장', status: 'pass' },
                { text: '접착 박리 원인 설비의 정비 이력은?' }
              ]
            },
            {
              cells: [
                { text: '법률/판례', bold: true },
                { text: '⭐⭐⭐⭐' },
                { text: '대법원 판례 크롤링' },
                { text: '판례 인용 관계가 명확' },
                { text: '판례 A를 인용한 판례의 인용 판례는?' }
              ]
            },
            {
              cells: [
                { text: 'IT/텔레콤', bold: true },
                { text: '⭐⭐⭐' },
                { text: '장애 로그, 네트워크 토폴로지' },
                { text: '장애 전파 체인 추적' },
                { text: '서버 A 장애가 영향 준 서비스 체인은?' }
              ]
            },
            {
              cells: [
                { text: '자유 주제', bold: true },
                { text: '⭐⭐' },
                { text: '본인 관심 분야' },
                { text: 'Multi-hop 존재 여부 확인 필수' },
                { text: '직접 정의' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '제조 도메인을 추천합니다 — Part 2~10에서 이미 구축한 KG를 그대로 활용하여 캡스톤 시간을 절약하세요'
        }
      },
      {
        id: '13-2',
        tag: 'theory',
        title: 'Part 1~12 전체 아키텍처 맵핑 — 8 레이어 통합',
        script: '캡스톤의 핵심은 Part 1~12를 하나의 시스템으로 통합하는 것입니다. 8개 레이어로 정리하면 이렇습니다. Data Layer는 Part 2의 제조 품질 보고서와 Part 5의 VLM 표 처리를 담당합니다. KG Layer는 Part 2의 온톨로지 + Meta-Dictionary, Part 3의 LLM 추출, Part 4의 Entity Resolution, Neo4j 적재를 담당합니다. Algorithm Layer는 Part 9의 Leiden 커뮤니티 탐지, PageRank, Personalized PageRank, RRF 융합을 담당합니다. Agent Layer는 Part 10의 5개 Tool + Supervisor + retry + Fallback을 담당합니다. Search Layer는 Part 6의 하이브리드 검색 + Text2Cypher Agent를 담당합니다. Eval Layer는 Part 7의 RAGAS 데이터셋 + 교차 평가를 담당합니다. Optimization Layer는 Part 11의 7가지 최적화 기법 + LangSmith 추적을 담당합니다. Enterprise Layer는 Part 12의 보안 RBAC + CI/CD + Grafana 모니터링을 담당합니다. 이 8개 레이어가 캡스톤의 전체 구조입니다.',
        table: {
          headers: ['Layer', 'Components', 'Source Part', '핵심 산출물'],
          rows: [
            {
              cells: [
                { text: 'Data Layer', bold: true },
                { text: '제조 품질 보고서 + VLM 표 처리' },
                { text: 'Part 2, 5' },
                { text: '원본 문서 + 구조화 데이터' }
              ]
            },
            {
              cells: [
                { text: 'KG Layer', bold: true },
                { text: '온톨로지 + Meta-Dict + ER + Neo4j' },
                { text: 'Part 2, 3, 4' },
                { text: '7 엔티티, 9 관계, 정제된 KG' }
              ]
            },
            {
              cells: [
                { text: 'Algorithm Layer', bold: true },
                { text: 'Leiden + PageRank + PPR + RRF 융합' },
                { text: 'Part 9' },
                { text: '커뮤니티 요약 + 리랭킹' }
              ]
            },
            {
              cells: [
                { text: 'Agent Layer', bold: true },
                { text: '5 Tools + Supervisor + retry + Fallback' },
                { text: 'Part 10' },
                { text: '자율 선택 멀티에이전트' }
              ]
            },
            {
              cells: [
                { text: 'Search Layer', bold: true },
                { text: '하이브리드 검색 + Text2Cypher' },
                { text: 'Part 6' },
                { text: 'RRF 통합 검색' }
              ]
            },
            {
              cells: [
                { text: 'Eval Layer', bold: true },
                { text: 'RAGAS 데이터셋 + 교차 평가' },
                { text: 'Part 7' },
                { text: '난이도별 30개 질문 + 4 메트릭' }
              ]
            },
            {
              cells: [
                { text: 'Optimization', bold: true },
                { text: '7가지 최적화 + LangSmith 추적' },
                { text: 'Part 11' },
                { text: '비용 50% 절감 + 장애 플로우차트' }
              ]
            },
            {
              cells: [
                { text: 'Enterprise', bold: true },
                { text: '보안 RBAC + CI/CD + Grafana' },
                { text: 'Part 12' },
                { text: '프로덕션 운영 체계' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '캡스톤 = Part 1~12의 8개 레이어를 하나의 프로덕션 시스템으로 통합하는 것. 빠진 레이어가 없는지 반드시 확인하세요.'
        }
      },
      {
        id: '13-3',
        tag: 'practice',
        title: '아키텍처 다이어그램 — 8 레이어 설계',
        script: '프로젝트 아키텍처를 8개 레이어 다이어그램으로 작성하세요. Part 1~12를 모두 포함해야 합니다. 각 레이어에서 어떤 기술을 쓸지 명시하세요. Data Layer는 제조 품질 보고서 PDF + VLM(GPT-4o Vision). KG Layer는 Neo4j 5.x + 온톨로지 7 엔티티, 9 관계. Algorithm Layer는 Neo4j GDS(Leiden, PageRank, PPR). Agent Layer는 LangGraph Supervisor + 5 Tools. Search Layer는 Text2Cypher + 벡터 검색 + RRF. Eval Layer는 RAGAS 4 메트릭 + 교차 평가. Optimization은 LangSmith + 캐싱 + 모델 라우팅. Enterprise는 RBAC + GitHub Actions + Grafana. 다이어그램에 데이터 흐름을 화살표로 표시하세요.',
        diagram: {
          nodes: [
            { text: '1. Data Layer', type: 'entity' },
            { text: '품질 보고서 + VLM (Part 2,5)', type: 'dim' },
            { text: '→', type: 'relation' },
            { text: '2. KG Layer', type: 'entity' },
            { text: 'Neo4j + 온톨로지 (Part 2,3,4)', type: 'dim' },
            { text: '→', type: 'relation' },
            { text: '3. Algorithm Layer', type: 'entity' },
            { text: 'Leiden + PageRank (Part 9)', type: 'dim' },
            { text: '→', type: 'relation' },
            { text: '4. Agent Layer', type: 'entity' },
            { text: '5 Tools + Supervisor (Part 10)', type: 'dim' },
            { text: '→', type: 'relation' },
            { text: '5. Search + Eval + Opt + Enterprise', type: 'entity' },
            { text: 'Part 6,7,11,12', type: 'dim' }
          ]
        },
        callout: {
          type: 'tip',
          text: '아키텍처 다이어그램은 발표의 핵심 자료 — 8 레이어 + Source Part를 명시하세요'
        }
      },
      {
        id: '13-4',
        tag: 'practice',
        title: '비용 예산 산정 — gpt-4o / gpt-4o-mini 기준',
        script: '프로젝트 비용을 미리 산정하세요. 2025년 기준 gpt-4o와 gpt-4o-mini 가격으로 계산합니다. gpt-4o는 입력 $2.50/1M 토큰, 출력 $10.00/1M 토큰입니다. gpt-4o-mini는 입력 $0.15/1M 토큰, 출력 $0.60/1M 토큰입니다. KG 구축에 LLM 추출을 gpt-4o로 하면 문서 100개 기준 약 $8입니다. 이전에는 GPT-4 기준 $20이었는데 많이 저렴해졌죠. Text2Cypher에 gpt-4o를 쓰면 질문 100개 기준 약 $3입니다. RAGAS 평가에 gpt-4o를 쓰면 질문 50개 기준 약 $5입니다. 비용을 더 줄이려면 Part 11에서 배운 모델 라우팅을 적용하세요. SIMPLE 질문은 gpt-4o-mini로, MULTI_HOP 이상만 gpt-4o로 보내면 비용이 60% 이상 절감됩니다. 가격은 수시 변동됩니다. 최신 가격은 OpenAI Pricing 페이지를 확인하세요.',
        table: {
          headers: ['단계', '항목', '예상 API 비용', '인프라 비용', '비고'],
          rows: [
            {
              cells: [
                { text: 'KG 구축', bold: true },
                { text: 'LLM 추출 (100 문서)' },
                { text: '~$8 (gpt-4o)' },
                { text: '$0 (로컬 Neo4j)' },
                { text: 'gpt-4o-mini로 $1.5 절감 가능' }
              ]
            },
            {
              cells: [
                { text: '검색', bold: true },
                { text: 'Text2Cypher + Agent (100 질문)' },
                { text: '~$3 (gpt-4o)' },
                { text: '-' },
                { text: 'SIMPLE → gpt-4o-mini 라우팅' }
              ]
            },
            {
              cells: [
                { text: '평가', bold: true },
                { text: 'RAGAS (50 질문)' },
                { text: '~$5 (gpt-4o)' },
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
                { text: '~$16', status: 'pass' },
                { text: '$0~$65', status: 'pass' },
                { text: '총 $16~$81 (Part 11 라우팅 시 $10 이하)' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: 'gpt-4o 기준 총 ~$16 — Part 11의 모델 라우팅(SIMPLE → gpt-4o-mini)을 적용하면 $10 이하로 가능. 가격은 수시 변동되므로 최신 가격은 OpenAI Pricing 페이지를 확인하세요.'
        }
      },
      {
        id: '13-5',
        tag: 'practice',
        title: '포트폴리오 GitHub 구조 — Part별 디렉토리',
        script: '캡스톤 프로젝트를 포트폴리오로 만들려면 GitHub 구조가 중요합니다. Part별로 디렉토리를 나누고, 각 디렉토리에 노트북과 README를 넣으세요. 최상위 README.md에는 프로젝트 소개, 아키텍처 다이어그램, 실행 방법, 벤치마크 결과를 포함하세요. 면접관이 30초 안에 "이 사람이 뭘 만들었는지" 파악할 수 있어야 합니다. README에 8개 레이어 아키텍처 다이어그램을 Mermaid로 넣으면 효과적입니다.',
        code: {
          language: 'bash',
          code: `# 포트폴리오 GitHub 구조
manufacturing-graphrag/
├── README.md                # 프로젝트 소개 + 아키텍처 다이어그램 (Mermaid)
├── requirements.txt         # Python 의존성
├── .env.example             # NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD (값 없이)
│
├── ontology/                # Part 2: 온톨로지 + Meta-Dictionary
│   ├── manufacturing_ontology.json
│   └── meta_dictionary.json
│
├── extraction/              # Part 3: LLM 추출 + Part 5: VLM
│   ├── llm_extractor.py
│   └── vlm_table_processor.py
│
├── kg/                      # Part 4: Entity Resolution + Neo4j 적재
│   ├── entity_resolution.py
│   └── neo4j_loader.py
│
├── search/                  # Part 6: 하이브리드 검색 + Part 10: Agent
│   ├── text2cypher_agent.py
│   └── agentic_graphrag.py  # 5 Tools + Supervisor
│
├── eval/                    # Part 7: RAGAS 평가
│   ├── ragas_evaluation.py
│   └── eval_dataset.json    # 난이도별 30개 질문
│
├── optimize/                # Part 11: 캐싱 + 모델 라우팅
│   └── cost_optimizer.py
│
└── deploy/                  # Part 12: CI/CD + 보안
    ├── docker-compose.yml
    ├── .github/workflows/kg-ci.yml
    └── rbac_config.json`
        },
        callout: {
          type: 'tip',
          text: 'README.md가 포트폴리오의 첫인상 — 아키텍처 다이어그램 + 벤치마크 결과를 반드시 포함하세요. .env 파일은 절대 커밋하지 마세요.'
        }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // Section 2: E2E 구축 — 제조 도메인 (30min) — 5 slides
  // ═══════════════════════════════════════════════════════════════
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '13-6',
        tag: 'practice',
        title: '데이터 수집 → KG 구축 — 제조 도메인',
        script: '엔드투엔드 시스템의 첫 단계입니다. Part 2~5의 기법을 통합합니다. 데이터 수집은 제조 품질 보고서 PDF를 준비합니다. Part 2의 온톨로지(Process, Equipment, Defect, Material, Product, Spec, Maintenance)와 Meta-Dictionary를 로드합니다. Part 3의 LLM 추출로 엔티티와 관계를 자동 추출합니다. Part 5의 VLM으로 검사 성적표의 표를 그래프로 변환합니다. Part 4의 Entity Resolution으로 중복을 제거합니다. 그리고 Neo4j에 적재합니다. 중요한 것은 Neo4j 인증 정보를 반드시 os.getenv로 가져오는 것입니다. 절대 비밀번호를 코드에 하드코딩하지 마세요.',
        code: {
          language: 'python',
          code: `# 엔드투엔드 GraphRAG — 데이터 수집 → KG 구축
# langchain >= 0.2.0, langchain-openai >= 0.1.0
import os
from neo4j import GraphDatabase
from langchain_openai import ChatOpenAI
# Claude 옵션: from langchain_anthropic import ChatAnthropic

# Neo4j 드라이버 (os.getenv 필수 — 하드코딩 금지)
driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(
        os.getenv("NEO4J_USER", "neo4j"),
        os.getenv("NEO4J_PASSWORD")
    )
)

llm = ChatOpenAI(model="gpt-4o", temperature=0)
# Claude 옵션: llm = ChatAnthropic(model="claude-sonnet-4-20250514")

# 1. 온톨로지 + Meta-Dictionary 로드 (Part 2)
ontology = load_ontology("ontology/manufacturing_ontology.json")
meta_dict = load_meta_dictionary("ontology/meta_dictionary.json")

# 2. LLM 추출 (Part 3)
docs = load_quality_reports("data/quality_reports/")
entities = []
for doc in docs:
    ents = extract_entities_relations(doc, ontology, meta_dict, llm)
    entities.extend(ents)

# 3. VLM 표 처리 (Part 5)
table_entities = extract_table_to_graph(
    "data/inspection_sheets/", ontology, model="gpt-4o"
)
entities.extend(table_entities)

# 4. Entity Resolution (Part 4)
entities = deduplicate_entities(entities, threshold=0.85)

# 5. Neo4j 적재 — 파라미터 바인딩 필수
with driver.session() as session:
    for ent in entities:
        session.run("""
            MERGE (e:\`{label}\` {{id: $id}})
            SET e.name = $name, e.type = $type
        """.replace("{label}", ent.label),
        id=ent.id, name=ent.name, type=ent.type)

    for rel in relations:
        session.run("""
            MATCH (a {{id: $src}}), (b {{id: $tgt}})
            MERGE (a)-[r:\`{rel_type}\`]->(b)
        """.replace("{rel_type}", rel.type),
        src=rel.source_id, tgt=rel.target_id)

print(f"적재 완료: 노드 {len(entities)}개, 관계 {len(relations)}개")`
        },
        callout: {
          type: 'warn',
          text: 'Neo4j 인증: os.getenv("NEO4J_PASSWORD") 필수 — 절대 auth=("neo4j", "password")로 하드코딩하지 마세요'
        }
      },
      {
        id: '13-7',
        tag: 'practice',
        title: 'Part 9 알고리즘 적용 — Leiden + PageRank',
        script: 'KG가 구축되면 Part 9의 그래프 알고리즘을 적용합니다. Leiden 커뮤니티 탐지로 공정 그룹을 자동으로 발견합니다. 예를 들어 접착 도포 공정, 접착기 A-3, 접착 박리가 하나의 커뮤니티로 묶이면, "접착 관련 전체 불량 트렌드는?"이라는 Global 질문에 커뮤니티 요약으로 답할 수 있습니다. PageRank로 가장 영향력 있는 노드를 찾습니다. "가장 많은 불량에 관련된 설비는?"이라는 질문에 PageRank 점수 기반으로 답할 수 있습니다. Personalized PageRank는 특정 불량에서 출발해서 가장 관련 있는 노드를 찾습니다.',
        code: {
          language: 'python',
          code: `# Part 9 알고리즘 적용 — Leiden + PageRank + PPR
import os
from neo4j import GraphDatabase

driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(
        os.getenv("NEO4J_USER", "neo4j"),
        os.getenv("NEO4J_PASSWORD")
    )
)

with driver.session() as session:
    # 1. GDS 프로젝션 생성
    session.run("""
        CALL gds.graph.project(
            'mfg_graph',
            ['Process','Equipment','Defect',
             'Material','Product','Spec'],
            ['USES_EQUIPMENT','CAUSED_BY',
             'USES_MATERIAL','HAS_DEFECT',
             'CONFORMS_TO','MAINTAINED_ON']
        )
    """)

    # 2. Leiden 커뮤니티 탐지 (Part 9)
    session.run("""
        CALL gds.leiden.write('mfg_graph', {
            writeProperty: 'community_id',
            maxLevels: 3,
            gamma: 1.0
        })
    """)
    communities = session.run("""
        MATCH (n) WHERE n.community_id IS NOT NULL
        RETURN n.community_id AS cid, collect(n.name) AS members
        ORDER BY size(members) DESC LIMIT 5
    """).data()
    print("상위 5개 커뮤니티:", communities)

    # 3. PageRank — 가장 영향력 있는 노드
    session.run("""
        CALL gds.pageRank.write('mfg_graph', {
            writeProperty: 'pagerank',
            dampingFactor: 0.85,
            maxIterations: 20
        })
    """)
    top_nodes = session.run("""
        MATCH (n) WHERE n.pagerank IS NOT NULL
        RETURN n.name, labels(n)[0] AS type,
               round(n.pagerank, 4) AS score
        ORDER BY score DESC LIMIT 10
    """).data()
    print("PageRank Top 10:", top_nodes)

    # 4. 커뮤니티 요약 생성 (Part 10 Community Tool용)
    for comm in communities:
        summary = llm.invoke(
            f"다음 노드들의 공통 주제를 한 문장으로: {comm['members']}"
        ).content
        session.run("""
            MERGE (c:Community {id: $cid})
            SET c.summary = $summary
        """, cid=comm["cid"], summary=summary)

    # 5. 프로젝션 삭제
    session.run("CALL gds.graph.drop('mfg_graph', false)")`
        },
        callout: {
          type: 'key',
          text: 'Leiden으로 커뮤니티 요약(Part 10 Community Tool용) + PageRank로 리랭킹 점수 — Part 9의 모든 알고리즘을 KG에 적용'
        }
      },
      {
        id: '13-8',
        tag: 'practice',
        title: 'Part 10 Agent 통합 — 5 Tools + Supervisor',
        script: 'Part 10에서 만든 5개 Tool과 Supervisor를 캡스톤에 통합합니다. 5개 Tool은 get_graph_schema, execute_cypher, find_causal_path, search_communities, run_personalized_pagerank입니다. Supervisor는 질문을 4가지 유형으로 분류합니다. SIMPLE은 Cypher Tool만, MULTI_HOP은 Cypher + Path Tool, GLOBAL은 Community Tool, PATH는 Algorithm Tool을 선택합니다. LangGraph StateGraph로 Explorer → Reasoner → Validator 흐름을 만들고, 검증 실패 시 최대 3회 재시도 후 Fallback으로 빠집니다.',
        code: {
          language: 'python',
          code: `# Part 10 Agent 통합 — 5 Tools + Supervisor + LangGraph
# langgraph >= 0.2.0, langchain >= 0.2.0
import os
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
# Claude 옵션: from langchain_anthropic import ChatAnthropic
from typing import TypedDict
from neo4j import GraphDatabase

driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(
        os.getenv("NEO4J_USER", "neo4j"),
        os.getenv("NEO4J_PASSWORD")
    )
)

llm = ChatOpenAI(model="gpt-4o", temperature=0)

# ── Part 10의 5개 Tool (get_graph_schema, execute_cypher,
#    find_causal_path, search_communities,
#    run_personalized_pagerank)
# → 상세 구현은 Part 10 슬라이드 7~9 참고

tools = [
    get_graph_schema,
    execute_cypher,
    find_causal_path,
    search_communities,
    run_personalized_pagerank
]

# ── State 정의 (Part 10 슬라이드 11)
class AgentState(TypedDict):
    query: str
    schema: str
    question_type: str  # SIMPLE/MULTI_HOP/GLOBAL/PATH
    result: list[dict]
    path_evidence: str
    community_summary: str
    ppr_result: list[dict]
    is_valid: bool
    error: str
    retry_count: int
    max_retries: int       # 3
    final_answer: str

# ── Supervisor 질문 분류 (Part 10 슬라이드 5)
def explorer_node(state: AgentState) -> AgentState:
    schema = get_graph_schema.invoke({})
    state["schema"] = schema
    classify = llm.invoke(f"""질문 유형을 분류하세요.
질문: {state["query"]}
유형: SIMPLE, MULTI_HOP, GLOBAL, PATH
한 단어만 답하세요.""").content.strip()
    state["question_type"] = classify
    return state

# ── LangGraph 구성
workflow = StateGraph(AgentState)
workflow.add_node("explorer", explorer_node)
workflow.add_node("reasoner", reasoner_node)
workflow.add_node("validator", validator_node)
workflow.add_node("fallback", fallback_node)

workflow.set_entry_point("explorer")
workflow.add_edge("explorer", "reasoner")
workflow.add_edge("reasoner", "validator")

def route(state):
    if state["is_valid"]:
        return END
    if state["retry_count"] >= state["max_retries"]:
        return "fallback"
    return "reasoner"

workflow.add_conditional_edges("validator", route)
workflow.add_edge("fallback", END)
graph = workflow.compile()`
        },
        callout: {
          type: 'key',
          text: '5 Tools + Supervisor + retry(3회) + Fallback — Part 10의 전체 구조를 그대로 캡스톤에 통합'
        }
      },
      {
        id: '13-9',
        tag: 'practice',
        title: 'Part 11 최적화 적용 — 캐싱 + 모델 라우팅',
        script: 'Part 11에서 배운 7가지 최적화 기법 중 캡스톤에 바로 적용할 수 있는 것들입니다. 첫째, 시맨틱 캐싱. 유사한 질문이 반복되면 LLM을 다시 호출하지 않고 캐시된 답변을 반환합니다. 둘째, 모델 라우팅. SIMPLE 질문은 gpt-4o-mini로, MULTI_HOP/GLOBAL/PATH는 gpt-4o로 보냅니다. 이것만으로 API 비용이 60% 이상 줄어듭니다. 셋째, LangSmith 추적. Agent의 Thought-Action-Observation을 추적하면 디버깅 시간이 10배 줄어듭니다.',
        code: {
          language: 'python',
          code: `# Part 11 최적화 — 캐싱 + 모델 라우팅 + LangSmith
# langchain >= 0.2.0, langsmith >= 0.1.0
import os
import hashlib
import json
from langchain_openai import ChatOpenAI
# Claude 옵션: from langchain_anthropic import ChatAnthropic

# 1. 시맨틱 캐싱 (Part 11 기법 3)
cache = {}  # 프로덕션에서는 Redis 사용

def cached_query(query: str, graph_app):
    key = hashlib.sha256(query.encode()).hexdigest()
    if key in cache:
        return cache[key]  # 캐시 히트
    result = graph_app.invoke({
        "query": query,
        "retry_count": 0,
        "max_retries": 3
    })
    cache[key] = result["final_answer"]
    return result["final_answer"]

# 2. 모델 라우팅 (Part 11 기법 5)
# SIMPLE → gpt-4o-mini ($0.15/1M input)
# MULTI_HOP/GLOBAL/PATH → gpt-4o ($2.50/1M input)
def get_routed_llm(question_type: str):
    if question_type == "SIMPLE":
        return ChatOpenAI(model="gpt-4o-mini", temperature=0)
    else:
        return ChatOpenAI(model="gpt-4o", temperature=0)

# 3. LangSmith 추적 (Part 11 기법 1)
# 환경 변수 설정만으로 자동 추적
# export LANGCHAIN_TRACING_V2=true
# export LANGCHAIN_API_KEY=your_langsmith_key
# export LANGCHAIN_PROJECT="capstone-mfg-graphrag"

# 4. 최적화 전/후 비교
# | 항목         | 최적화 전     | 최적화 후     |
# |-------------|-------------|-------------|
# | SIMPLE 비용  | $0.025/질문  | $0.002/질문  |
# | 캐시 히트율   | 0%          | ~40%        |
# | 월간 1000질문 | $25         | $8          |`
        },
        callout: {
          type: 'tip',
          text: '캐싱 + 모델 라우팅만으로 API 비용 60%+ 절감 — Part 11의 7가지 기법 중 가장 효과적인 3가지를 적용'
        }
      },
      {
        id: '13-10',
        tag: 'practice',
        title: 'Part 12 보안 체크리스트 — RBAC + 감사 로그',
        script: 'Part 12에서 배운 엔터프라이즈 체크리스트를 적용합니다. 보안은 3가지입니다. 첫째, RBAC(Role-Based Access Control). Neo4j의 역할별 접근 제어를 설정합니다. 읽기 전용 사용자, 쿼리 실행 사용자, 관리자를 분리합니다. 둘째, 감사 로그. 누가 어떤 쿼리를 실행했는지 기록합니다. 셋째, 환경 변수 관리. .env 파일은 .gitignore에 반드시 추가하고, .env.example만 커밋합니다. CI/CD는 GitHub Actions로 KG 품질 테스트를 자동화하고, Grafana로 노드 수, 쿼리 시간, API 비용을 모니터링합니다.',
        code: {
          language: 'python',
          code: `# Part 12 보안 + 운영 체크리스트

# 1. RBAC — Neo4j 역할 분리
# Cypher (Neo4j Browser에서 실행)
# CREATE ROLE reader;
# GRANT MATCH {*} ON GRAPH * TO reader;
# CREATE USER readonly_user SET PASSWORD $password
#   CHANGE NOT REQUIRED;
# GRANT ROLE reader TO readonly_user;

# 2. 감사 로그 — 쿼리 실행 기록
import logging
from datetime import datetime

audit_logger = logging.getLogger("audit")
audit_logger.setLevel(logging.INFO)
handler = logging.FileHandler("audit.log")
audit_logger.addHandler(handler)

def audited_query(query: str, user: str, session):
    audit_logger.info(json.dumps({
        "timestamp": datetime.now().isoformat(),
        "user": user,
        "query": query[:200],  # 쿼리 앞부분만
        "action": "CYPHER_EXEC"
    }))
    return session.run(query)

# 3. 환경 변수 관리 — .env.example
# NEO4J_URI=bolt://localhost:7687
# NEO4J_USER=neo4j
# NEO4J_PASSWORD=           # <-- 값 없이!
# OPENAI_API_KEY=
# LANGCHAIN_API_KEY=

# 4. CI/CD — GitHub Actions (Part 12)
# .github/workflows/kg-ci.yml
# - 매 PR마다 KG 스키마 검증
# - RAGAS 평가 30개 질문 자동 실행
# - 결과를 PR 코멘트로 게시

# 5. Grafana 모니터링 (Part 12)
# - 패널 1: 노드 수 추이 (시계열)
# - 패널 2: 평균 쿼리 시간 (게이지)
# - 패널 3: 일간 API 비용 (막대)
# - 알림: 쿼리 시간 > 10초 → Slack 알림`
        },
        callout: {
          type: 'warn',
          text: '.env 파일은 절대 Git에 커밋하지 마세요 — .gitignore 확인 필수. .env.example만 커밋하세요.'
        }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // Section 3: E2E 완성 코드 (20min) — 2 slides
  // ═══════════════════════════════════════════════════════════════
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '13-11',
        tag: 'practice',
        title: '제조 GraphRAG E2E — 복사 실행 가능 코드',
        script: '지금까지 조각들을 합쳐서 하나의 복사-실행 가능한 코드를 보겠습니다. Part 10의 슬라이드 19와 같은 형식입니다. 이 코드를 복사해서 바로 실행할 수 있습니다. 환경 변수만 설정하면 됩니다. NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD, OPENAI_API_KEY 4개만 설정하세요. 코드는 5개 Tool 정의, Supervisor 질문 분류, LangGraph 워크플로우, 캐싱, 모델 라우팅까지 모두 포함됩니다.',
        code: {
          language: 'python',
          code: `#!/usr/bin/env python3
"""제조 GraphRAG E2E — 캡스톤 완성 코드
Part 1~12 통합: 5 Tools + Supervisor + 캐싱 + 모델 라우팅

실행 전 환경 변수 설정:
  export NEO4J_URI=bolt://localhost:7687
  export NEO4J_USER=neo4j
  export NEO4J_PASSWORD=your_password
  export OPENAI_API_KEY=your_key
  # 선택: export LANGCHAIN_TRACING_V2=true
"""
# langchain >= 0.2.0, langgraph >= 0.2.0
# langchain-openai >= 0.1.0, neo4j >= 5.0
import os, hashlib
from neo4j import GraphDatabase
from langchain_openai import ChatOpenAI
# Claude 옵션: from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END
from typing import TypedDict

# ── 1. 인프라 연결 ──
driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(
        os.getenv("NEO4J_USER", "neo4j"),
        os.getenv("NEO4J_PASSWORD")
    )
)
llm_strong = ChatOpenAI(model="gpt-4o", temperature=0)
llm_fast = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# ── 2. 5개 Tool (Part 10) ──
@tool
def get_graph_schema() -> str:
    """제조 KG 스키마 조회 (Label + Relationship)"""
    with driver.session() as s:
        labels = s.run("CALL db.labels()").data()
        rels = s.run("CALL db.relationshipTypes()").data()
    return f"Labels: {labels}\\nRels: {rels}"

@tool
def execute_cypher(query: str, params: dict = {}) -> list:
    """Cypher 실행 — 반드시 $param 바인딩 사용"""
    with driver.session() as s:
        return s.run(query, **params).data()

@tool
def find_causal_path(start: str, end: str) -> dict:
    """두 노드 간 인과 경로 탐색 (CAUSED_BY 체인)"""
    q = \"\"\"
    MATCH (a {name: $s}), (b {name: $e})
    MATCH p = shortestPath((a)-[*..5]-(b))
    RETURN [n IN nodes(p) | n.name] AS nodes,
           [r IN relationships(p) | type(r)] AS rels
    \"\"\"
    with driver.session() as s:
        return s.run(q, s=start, e=end).data()

@tool
def search_communities(query: str) -> str:
    """Leiden 커뮤니티 요약 검색 (Global 질문용)"""
    with driver.session() as s:
        r = s.run(
            "MATCH (c:Community) RETURN c.id, c.summary"
        ).data()
    return "\\n".join(
        f"[{x['c.id']}] {x['c.summary']}" for x in r
    ) or "커뮤니티 없음"

@tool
def run_personalized_pagerank(
    source: str, top_k: int = 5
) -> list:
    """PPR로 특정 노드와 가장 관련 있는 노드 탐색"""
    with driver.session() as s:
        s.run(\"\"\"CALL gds.graph.project(
            'tmp', ['Process','Equipment','Defect',
            'Material','Product','Spec'],
            ['USES_EQUIPMENT','CAUSED_BY','USES_MATERIAL',
            'HAS_DEFECT','CONFORMS_TO','MAINTAINED_ON'])
        \"\"\")
        result = s.run(\"\"\"
            MATCH (src {name: $name})
            CALL gds.pageRank.stream('tmp', {
                sourceNodes: [src], dampingFactor: 0.85
            }) YIELD nodeId, score
            RETURN gds.util.asNode(nodeId).name AS name,
                   round(score, 4) AS score
            ORDER BY score DESC LIMIT $k
        \"\"\", name=source, k=top_k).data()
        s.run("CALL gds.graph.drop('tmp', false)")
    return result

# ── 3. State + LangGraph ──
class S(TypedDict):
    query: str; schema: str; qtype: str
    result: list; answer: str
    valid: bool; error: str
    retries: int; max_r: int

def explorer(st):
    st["schema"] = get_graph_schema.invoke({})
    st["qtype"] = llm_strong.invoke(
        f"분류(SIMPLE/MULTI_HOP/GLOBAL/PATH): {st['query']}"
    ).content.strip()
    return st

def reasoner(st):
    llm = llm_fast if st["qtype"] == "SIMPLE" else llm_strong
    # 질문 유형별 Tool 선택 (Part 10 패턴)
    try:
        if st["qtype"] == "GLOBAL":
            ctx = search_communities.invoke(st["query"])
        elif st["qtype"] == "PATH":
            ctx = run_personalized_pagerank.invoke(
                {"source": st["query"][:10], "top_k": 5})
        else:
            ctx = execute_cypher.invoke({
                "query": "MATCH (n) WHERE n.name CONTAINS $q "
                         "RETURN n LIMIT 10",
                "params": {"q": st["query"][:20]}
            })
        st["result"] = ctx if isinstance(ctx, list) else [ctx]
        st["answer"] = llm.invoke(
            f"질문: {st['query']}\\n컨텍스트: {ctx}\\n답변:"
        ).content
    except Exception as e:
        st["error"] = str(e)
    return st

wf = StateGraph(S)
wf.add_node("explorer", explorer)
wf.add_node("reasoner", reasoner)
wf.set_entry_point("explorer")
wf.add_edge("explorer", "reasoner")
wf.add_edge("reasoner", END)
app = wf.compile()

# ── 4. 캐싱 (Part 11) ──
cache = {}
def ask(q):
    k = hashlib.sha256(q.encode()).hexdigest()
    if k in cache: return cache[k]
    r = app.invoke({"query":q,"retries":0,"max_r":3})
    cache[k] = r["answer"]
    return r["answer"]

# ── 5. 테스트 (제조 도메인) ──
if __name__ == "__main__":
    questions = [
        "접착기 A-3의 사양은?",                    # SIMPLE
        "접착 박리의 원인 공정은?",                   # MULTI_HOP
        "전체 불량 트렌드는?",                       # GLOBAL
        "접착 박리와 가장 관련된 설비는?",              # PATH
    ]
    for q in questions:
        print(f"Q: {q}\\nA: {ask(q)}\\n")`
        },
        callout: {
          type: 'key',
          text: '이 코드를 복사해서 환경 변수(NEO4J_URI, NEO4J_PASSWORD, OPENAI_API_KEY)만 설정하면 바로 실행 가능합니다'
        }
      },
      {
        id: '13-12',
        tag: 'practice',
        title: '디버깅 + 최적화 + 모니터링 적용 — 제조 도메인',
        script: '시스템이 구축됐으면 Part 11~12의 기법으로 디버깅, 최적화, 모니터링을 적용합니다. 디버깅은 LangSmith로 Agent의 Thought-Action-Observation 로그를 추적합니다. 접착 박리 원인 추적 질문에서 Cypher 쿼리가 잘못 생성되면 LangSmith에서 바로 확인할 수 있습니다. 최적화는 Neo4j 인덱스를 추가합니다. CREATE INDEX FOR (d:Defect) ON (d.name). Process, Equipment에도 인덱스를 생성하세요. 모니터링은 Grafana 대시보드를 구축합니다. 노드 수, 쿼리 시간, API 비용, RAGAS 점수를 추적합니다.',
        table: {
          headers: ['영역', '기법', '도구', 'Source Part', '제조 적용 예시'],
          rows: [
            {
              cells: [
                { text: '디버깅', bold: true },
                { text: 'Agent 로그 추적' },
                { text: 'LangSmith' },
                { text: 'Part 11' },
                { text: '접착 박리 Cypher 오류 추적' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: '실패 유형 분류' },
                { text: 'Retrieval/Generation/Schema' },
                { text: 'Part 11' },
                { text: '엔티티 이름 불일치 탐지' }
              ]
            },
            {
              cells: [
                { text: '최적화', bold: true },
                { text: 'Neo4j 인덱스' },
                { text: 'CREATE INDEX' },
                { text: 'Part 7, 11' },
                { text: 'Defect.name, Process.name 인덱스' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: '모델 라우팅 + 캐싱' },
                { text: 'gpt-4o / gpt-4o-mini' },
                { text: 'Part 11' },
                { text: 'SIMPLE → gpt-4o-mini' }
              ]
            },
            {
              cells: [
                { text: '모니터링', bold: true },
                { text: 'Grafana 대시보드' },
                { text: 'Prometheus + Grafana' },
                { text: 'Part 12' },
                { text: '노드 수, 쿼리 시간, API 비용' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'Slack 알림' },
                { text: 'Grafana Alert' },
                { text: 'Part 12' },
                { text: '쿼리 시간 > 10초 알림' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '디버깅(Part 11) + 최적화(Part 11) + 모니터링(Part 12) = 프로덕션 수준 시스템'
        }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // Section 4: 평가 + 벤치마크 (20min) — 3 slides
  // ═══════════════════════════════════════════════════════════════
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '13-13',
        tag: 'practice',
        title: 'RAGAS 평가 — 제조 도메인 질문 20개',
        script: 'Part 7에서 배운 RAGAS로 캡스톤 시스템을 평가합니다. 제조 도메인 질문을 난이도별로 구성합니다. Easy 질문 7개, Medium 질문 7개, Hard 질문 6개, 총 20개입니다. Easy는 1-hop 질문으로 "접착기 A-3의 사양은?" 같은 것입니다. Medium은 2-hop으로 "접착 박리의 원인 공정은?" 같은 것입니다. Hard는 Multi-hop + 조건으로 "접착 박리 원인 설비의 정비 이력과 관련 불량 패턴은?" 같은 것입니다. RAGAS 메트릭 4가지를 측정합니다. 교차 평가도 실행하세요. gpt-4o 답변은 Claude로, Claude 답변은 gpt-4o로 평가합니다.',
        code: {
          language: 'python',
          code: `# RAGAS 평가 — 제조 도메인 (Part 7 패턴 재사용)
# ragas >= 0.1.0, datasets >= 2.0
import os
from ragas import evaluate
from ragas.metrics import (
    faithfulness, answer_relevancy,
    context_precision, context_recall
)
from datasets import Dataset

# 1. 제조 도메인 평가 데이터셋 (난이도별)
eval_data = [
    # Easy (1-hop) — 7개
    {"question": "접착기 A-3의 사양은?",
     "ground_truth": "최대 압력 150bar, 온도 범위 60~180도",
     "difficulty": "easy"},
    {"question": "브레이크 패드 BP-100의 재질은?",
     "ground_truth": "세라믹 복합 소재",
     "difficulty": "easy"},
    {"question": "접착 도포 공정에서 사용하는 설비는?",
     "ground_truth": "접착기 A-3",
     "difficulty": "easy"},
    # ... 총 7개

    # Medium (2-hop) — 7개
    {"question": "접착 박리의 원인 공정은?",
     "ground_truth": "접착 도포 공정",
     "difficulty": "medium"},
    {"question": "접착기 A-3의 마지막 정비 날짜는?",
     "ground_truth": "2024-01-15",
     "difficulty": "medium"},
    {"question": "BP-100 불합격의 관련 검사 항목은?",
     "ground_truth": "접착력 검사, 두께 검사",
     "difficulty": "medium"},
    # ... 총 7개

    # Hard (Multi-hop) — 6개
    {"question": "접착 박리 원인 설비의 정비 이력과 관련 불량 패턴은?",
     "ground_truth": "접착기 A-3, 정비 2024-01-15, 접착 박리+기포 발생",
     "difficulty": "hard"},
    {"question": "가장 많은 불량이 발생한 공정의 설비와 사용 재료는?",
     "ground_truth": "접착 도포, 접착기 A-3, 에폭시 수지 EP-200",
     "difficulty": "hard"},
    {"question": "브레이크 패드 불량률이 가장 높은 공정 체인은?",
     "ground_truth": "프레스 성형 → 접착 도포 → 경화",
     "difficulty": "hard"},
    # ... 총 6개
]

# 2. 시스템으로 답변 생성
for item in eval_data:
    result = app.invoke({
        "query": item["question"],
        "retries": 0, "max_r": 3
    })
    item["answer"] = result.get("answer", "")
    item["contexts"] = [str(result.get("result", []))]

# 3. RAGAS 평가 실행
dataset = Dataset.from_list(eval_data)
results = evaluate(
    dataset,
    metrics=[faithfulness, answer_relevancy,
             context_precision, context_recall]
)
print("RAGAS 결과:", results)

# 4. 난이도별 집계
import numpy as np
for diff in ["easy", "medium", "hard"]:
    subset = [r for r in eval_data if r["difficulty"] == diff]
    print(f"{diff}: {len(subset)}개 질문")`
        },
        callout: {
          type: 'tip',
          text: '난이도별 평가 + JSON 저장 — 개선 후 재평가로 진전 확인. 교차 평가(gpt-4o ↔ Claude) 상관계수 0.7+ 이면 신뢰 가능'
        }
      },
      {
        id: '13-14',
        tag: 'practice',
        title: '비용/속도/정확도 리포트 — gpt-4o 기준',
        script: '벤치마크 결과를 종합 리포트로 정리합니다. 정확도는 Easy, Medium, Hard별로 측정합니다. 속도는 평균 응답 시간, P95, P99를 측정합니다. 비용은 gpt-4o 기준 질문당 API 비용을 계산합니다. gpt-4o는 입력 $2.50/1M 토큰, 출력 $10.00/1M 토큰입니다. gpt-4o-mini는 입력 $0.15/1M 토큰, 출력 $0.60/1M 토큰입니다. 모델 라우팅을 적용하면 질문당 비용이 $0.03에서 $0.01로 줄어듭니다. 이 리포트를 바탕으로 개선 포인트를 결정합니다.',
        table: {
          headers: ['메트릭', '측정값', '목표', '상태', '개선 방향'],
          rows: [
            {
              cells: [
                { text: 'Easy 정확도', bold: true },
                { text: '92%' },
                { text: '90%+', status: 'pass' },
                { text: '달성', status: 'pass' },
                { text: '-' }
              ]
            },
            {
              cells: [
                { text: 'Medium 정확도', bold: true },
                { text: '78%' },
                { text: '75%+', status: 'pass' },
                { text: '달성', status: 'pass' },
                { text: 'Few-shot 예시 추가' }
              ]
            },
            {
              cells: [
                { text: 'Hard 정확도', bold: true },
                { text: '65%' },
                { text: '70%+', status: 'warn' },
                { text: '미달', status: 'warn' },
                { text: 'Meta-Dictionary 강화 + Path Tool 개선' }
              ]
            },
            {
              cells: [
                { text: 'RAGAS Faithfulness', bold: true },
                { text: '0.85' },
                { text: '0.8+', status: 'pass' },
                { text: '달성', status: 'pass' },
                { text: '-' }
              ]
            },
            {
              cells: [
                { text: '평균 응답 시간', bold: true },
                { text: '2.5초' },
                { text: '3초 이내', status: 'pass' },
                { text: '달성', status: 'pass' },
                { text: '-' }
              ]
            },
            {
              cells: [
                { text: 'P99 응답 시간', bold: true },
                { text: '11초' },
                { text: '10초 이내', status: 'warn' },
                { text: '미달', status: 'warn' },
                { text: 'Neo4j 인덱스 + GDS 프로젝션 캐시' }
              ]
            },
            {
              cells: [
                { text: '질문당 API 비용', bold: true },
                { text: '$0.01 (라우팅 후)' },
                { text: '$0.05 이하', status: 'pass' },
                { text: '달성', status: 'pass' },
                { text: 'gpt-4o: $2.50/1M in, gpt-4o-mini: $0.15/1M in' }
              ]
            },
            {
              cells: [
                { text: '월간 예상 비용', bold: true },
                { text: '$10 (1000 질문)' },
                { text: '$50 이하', status: 'pass' },
                { text: '달성', status: 'pass' },
                { text: '캐싱 40% 히트율 반영' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '정확도/속도/비용 종합 리포트 — 개선 우선순위 결정의 근거. 가격은 수시 변동되므로 최신 가격은 OpenAI Pricing 페이지를 확인하세요.'
        }
      },
      {
        id: '13-15',
        tag: 'discussion',
        title: '개선 포인트 3개 도출 — 제조 도메인',
        script: '벤치마크 결과를 바탕으로 개선 포인트 3개를 도출하세요. 첫 번째 개선: Hard 질문 정확도 향상. 65%로 목표(70%) 미달입니다. Part 2의 Meta-Dictionary를 강화하세요. 접착 관련 엔티티 정의를 더 구체적으로 작성하고, Part 10의 Path Tool에 Few-shot 예시를 추가하세요. 두 번째 개선: P99 속도 최적화. 11초로 목표(10초) 초과입니다. Neo4j 인덱스를 추가하세요. Defect.name, Process.name, Equipment.name에 인덱스를 생성하세요. GDS 프로젝션을 캐시하면 PPR 실행 시간이 줄어듭니다. 세 번째 개선: Agent 재시도 효율화. 현재 최대 3회 재시도하는데, 첫 번째 재시도에서 에러 유형을 분석해서 프롬프트를 보정하면 재시도 성공률이 올라갑니다.',
        table: {
          headers: ['개선 포인트', '현재 문제', '해결 방법 (Source Part)', '예상 효과'],
          rows: [
            {
              cells: [
                { text: '1. Hard 정확도 향상', bold: true },
                { text: 'Hard 65% (목표 70%)' },
                { text: 'Meta-Dictionary 강화 (Part 2) + Path Tool Few-shot (Part 10)' },
                { text: '정확도 +7% → 72%' }
              ]
            },
            {
              cells: [
                { text: '2. P99 속도 최적화', bold: true },
                { text: 'P99 11초 (목표 10초)' },
                { text: 'Neo4j 인덱스 (Part 7) + GDS 프로젝션 캐시 (Part 9)' },
                { text: 'P99 → 7초 (36% 개선)' }
              ]
            },
            {
              cells: [
                { text: '3. 재시도 효율화', bold: true },
                { text: '재시도 시 같은 실수 반복' },
                { text: '에러 유형별 프롬프트 보정 (Part 11 디버깅)' },
                { text: '재시도 성공률 50% → 80%' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '개선 3개: 정확도 +7%, 속도 -36%, 재시도 성공률 +30% — Part 2,7,9,10,11의 기법을 조합해서 개선'
        }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // Section 5: 발표 + 회고 + 수료 (25min) — 5 slides
  // ═══════════════════════════════════════════════════════════════
  {
    sectionId: 'sec5',
    slides: [
      {
        id: '13-16',
        tag: 'discussion',
        title: '시스템 라이브 데모 체크리스트 — 제조 도메인',
        script: '캡스톤 프로젝트 발표를 준비합니다. 라이브 데모 체크리스트입니다. 환경 준비는 Neo4j 실행, 데이터 로드, API 키 확인을 발표 30분 전에 하세요. 데모 시나리오는 3개 질문을 준비합니다. Easy: "접착기 A-3의 사양은?" — SIMPLE 유형, Cypher Tool만 사용. Medium: "접착 박리의 원인 공정은?" — MULTI_HOP, Path Tool 사용. Hard: "접착 박리 원인 설비의 정비 이력과 관련 불량 패턴은?" — MULTI_HOP + 여러 Tool 조합. 핵심 인사이트는 "이 Hard 질문은 벡터 RAG로 불가능합니다. 3-hop 관계 추적이 필요하기 때문입니다"라고 강조하세요.',
        table: {
          headers: ['단계', '체크 항목', '비고'],
          rows: [
            {
              cells: [
                { text: '환경 준비', bold: true },
                { text: 'Neo4j 실행 + 데이터 로드 + API 키 확인' },
                { text: '발표 30분 전 체크' }
              ]
            },
            {
              cells: [
                { text: 'Easy 데모', bold: true },
                { text: '"접착기 A-3의 사양은?" (SIMPLE → Cypher Tool)' },
                { text: '예상 답변 미리 확인' }
              ]
            },
            {
              cells: [
                { text: 'Medium 데모', bold: true },
                { text: '"접착 박리의 원인 공정은?" (MULTI_HOP → Path Tool)' },
                { text: 'Supervisor 분류 과정 설명' }
              ]
            },
            {
              cells: [
                { text: 'Hard 데모', bold: true },
                { text: '"접착 박리 원인 설비 정비 이력 + 불량 패턴은?"' },
                { text: '벡터 RAG로 불가능한 이유 강조' }
              ]
            },
            {
              cells: [
                { text: '실패 대비', bold: true },
                { text: '스크린샷 준비 + 네트워크 오류 대응' },
                { text: '백업 플랜 필수' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '데모는 5분 이내, Hard 질문으로 Multi-hop 추론 능력 강조 — "벡터 RAG로 불가능한 이유"를 명확히 설명하세요'
        }
      },
      {
        id: '13-17',
        tag: 'discussion',
        title: '발표 템플릿 — 아키텍처 + 벤치마크',
        script: '발표 구조는 4부로 나눕니다. 1부 문제 정의 2분. 제조 도메인 소개, 접착 박리 품질 추적의 어려움, GraphRAG가 필요한 이유. "접착 박리 원인 설비의 정비 이력 추적은 벡터 RAG로 30% 정확도. GraphRAG로 85%까지 향상." 2부 아키텍처 3분. 8개 레이어 다이어그램을 보여주세요. 각 레이어의 Source Part를 명시하세요. 3부 라이브 데모 3분. Easy, Medium, Hard 질문을 순서대로 시연하세요. 4부 벤치마크 2분. 정확도, 속도, 비용 리포트를 표로 보여주세요. 개선 포인트 3개를 발표하세요. 총 10분 발표, 5분 질의응답입니다.',
        table: {
          headers: ['순서', '주제', '시간', '핵심 내용'],
          rows: [
            {
              cells: [
                { text: '1', bold: true },
                { text: '문제 정의' },
                { text: '2분' },
                { text: '제조 품질 추적, 벡터 RAG 한계, GraphRAG 필요성' }
              ]
            },
            {
              cells: [
                { text: '2', bold: true },
                { text: '아키텍처' },
                { text: '3분' },
                { text: '8개 레이어, Part 1~12 통합, 기술 스택' }
              ]
            },
            {
              cells: [
                { text: '3', bold: true },
                { text: '라이브 데모' },
                { text: '3분' },
                { text: 'Easy/Medium/Hard 질문 시연 (제조 도메인)' }
              ]
            },
            {
              cells: [
                { text: '4', bold: true },
                { text: '벤치마크 + 개선' },
                { text: '2분' },
                { text: '정확도/속도/비용 리포트 + 개선 포인트 3개' }
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
          text: '발표 10분 + 질의응답 5분 — 8 레이어 아키텍처 다이어그램과 벤치마크 표가 핵심 자료'
        }
      },
      {
        id: '13-18',
        tag: 'theory',
        title: '전체 과정 회고 — Part 1~13 정확한 설명',
        script: '13개 Part의 여정을 돌아봅시다. Part 1: 왜 GraphRAG인가. 벡터 RAG의 한계를 보고 Multi-hop 추론의 가치를 배웠습니다. Part 2: 수작업 KG. 온톨로지 설계와 Meta-Dictionary의 중요성을 체감했습니다. Part 3: LLM 자동화. 편리함과 환각의 양면을 경험했습니다. Part 4: Entity Resolution. 중복 제거의 어려움과 가중치 싸움을 배웠습니다. Part 5: 멀티모달 VLM. 검사 성적표와 공정 흐름도를 그래프로 변환했습니다. Part 6: 통합 + 검색. Text2Cypher Agent와 하이브리드 검색으로 GraphRAG 시스템을 완성했습니다. Part 7: 실무 적용 가이드. RAGAS 평가와 GDBMS 선정 기준을 배웠습니다. Part 8: 프레임워크 비교. MS GraphRAG, LightRAG, fast-graphrag, nano-graphrag를 직접 비교했습니다. Part 9: 그래프 알고리즘. Leiden 커뮤니티, PageRank, 경로 탐색, graphrag_pipeline_v2를 구축했습니다. Part 10: Agentic GraphRAG. 5개 Tool + Supervisor 분류 + LangGraph 멀티에이전트를 만들었습니다. Part 11: 디버깅 & 비용 최적화. LangSmith 추적, 7가지 최적화 기법을 학습했습니다. Part 12: 엔터프라이즈 실전. PoC 2주 계획, 보안 RBAC, CI/CD, Grafana 모니터링을 배웠습니다. Part 13: 캡스톤 프로젝트. 지금 여러분은 처음부터 끝까지 프로덕션급 GraphRAG 시스템을 구축할 수 있습니다.',
        table: {
          headers: ['Part', '주제', '핵심 산출물'],
          rows: [
            {
              cells: [
                { text: 'Part 1', bold: true },
                { text: '왜 GraphRAG인가 — Multi-hop 동기부여' },
                { text: 'Neo4j 첫 그래프 (7노드)', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 2', bold: true },
                { text: '수작업 KG — 온톨로지 + Meta-Dictionary' },
                { text: '수작업 KG (15노드, 20관계)', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 3', bold: true },
                { text: 'LLM 자동화 — 추출 + 품질 비교' },
                { text: '자동 추출 KG + 비교표', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 4', bold: true },
                { text: 'Entity Resolution — 중복 제거' },
                { text: '정제된 KG (45→30노드)', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 5', bold: true },
                { text: '멀티모달 VLM — 표/이미지 → 그래프' },
                { text: '멀티모달 통합 KG', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 6', bold: true },
                { text: '통합 + 검색 — Text2Cypher + 하이브리드' },
                { text: '완성된 GraphRAG 시스템', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 7', bold: true },
                { text: '실무 적용 — RAGAS + GDBMS + 최적화' },
                { text: '실무 적용 체크리스트', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 8', bold: true },
                { text: '프레임워크 비교 — MS GraphRAG, LightRAG, fast-graphrag' },
                { text: '프레임워크 선택 가이드', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 9', bold: true },
                { text: '그래프 알고리즘 — Leiden, PageRank, 경로, PPR' },
                { text: 'graphrag_pipeline_v2', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 10', bold: true },
                { text: 'Agentic GraphRAG — 5 Tools + Supervisor + LangGraph' },
                { text: '멀티에이전트 시스템', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 11', bold: true },
                { text: '디버깅 & 비용 최적화 — LangSmith + 7가지 기법' },
                { text: '비용 50% 절감 체크리스트', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 12', bold: true },
                { text: '엔터프라이즈 — PoC 2주, RBAC, CI/CD, Grafana' },
                { text: '도입 계획서', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 13', bold: true },
                { text: '캡스톤 — Part 1~12 통합 E2E 시스템' },
                { text: '프로덕션급 GraphRAG + 포트폴리오', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '13 Parts, 23시간, 271 슬라이드 — 벡터 RAG의 한계부터 프로덕션급 멀티에이전트 GraphRAG까지 완주했습니다'
        }
      },
      {
        id: '13-19',
        tag: 'theory',
        title: '포트폴리오 완성 + 수료 — GraphRAG Expert',
        script: '축하합니다! 여러분은 GraphRAG Expert 과정을 완주했습니다. 13 Parts, 23시간, 271 슬라이드. Part 1에서 "접착 박리 원인 설비의 정비 이력은?"이라는 질문을 처음 봤을 때를 기억하시나요? 그때는 벡터 RAG로 안 된다는 것만 알았습니다. 지금은 온톨로지를 설계하고, LLM으로 추출하고, Entity Resolution으로 정제하고, VLM으로 표를 변환하고, Text2Cypher로 검색하고, RAGAS로 평가하고, Leiden + PageRank로 알고리즘을 적용하고, 5개 Tool + Supervisor로 Agent를 구축하고, LangSmith로 디버깅하고, 비용을 최적화하고, RBAC과 CI/CD로 프로덕션에 배포할 수 있습니다. 포트폴리오 GitHub에 이 모든 것을 정리하세요. README에 8개 레이어 아키텍처 다이어그램과 벤치마크 결과를 넣으세요. 면접에서 "GraphRAG 해보셨나요?"라는 질문에 자신 있게 답할 수 있습니다.',
        diagram: {
          nodes: [
            { text: 'Part 1: 동기부여', type: 'entity' },
            { text: '→', type: 'relation' },
            { text: 'Part 2~5: KG 구축', type: 'entity' },
            { text: '→', type: 'relation' },
            { text: 'Part 6~7: 검색 + 평가', type: 'entity' },
            { text: '→', type: 'relation' },
            { text: 'Part 8~12: 고급 + 운영', type: 'entity' },
            { text: '→', type: 'relation' },
            { text: 'Part 13: E2E 캡스톤', type: 'entity' },
            { text: 'GraphRAG Expert', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: 'GraphRAG Expert — 13 Parts, 23시간, 271 슬라이드 완주. 깊이가 곧 가치입니다.'
        }
      },
      {
        id: '13-20',
        tag: 'theory',
        title: '다음 단계 + 커뮤니티',
        script: '과정을 마쳤지만, GraphRAG는 빠르게 발전하는 분야입니다. 다음 단계를 제안합니다. 첫째, 실무 프로젝트 적용. 회사나 개인 프로젝트에서 GraphRAG를 도입해보세요. Part 12의 2주 PoC 템플릿을 활용하세요. 둘째, 커뮤니티 참여. Neo4j 포럼, LangChain Discord, LlamaIndex Discord에서 다른 사람들과 교류하세요. 셋째, 최신 연구 추적. GraphRAG는 2024년부터 폭발적으로 성장하고 있습니다. arXiv에서 "GraphRAG", "Knowledge Graph + LLM" 논문을 주기적으로 확인하세요. 넷째, 오픈소스 기여. 여러분이 만든 도구, 프롬프트 템플릿, 평가 데이터셋을 공유하세요. GitHub Star가 쌓이면 그것 자체가 포트폴리오입니다. 다섯째, 새로운 도메인 도전. 제조 외에 법률, 의료, 금융 도메인에도 GraphRAG를 적용해보세요. 도메인이 바뀌어도 8개 레이어 아키텍처는 동일합니다.',
        table: {
          headers: ['다음 단계', '행동', '리소스'],
          rows: [
            {
              cells: [
                { text: '1. 실무 적용', bold: true },
                { text: '회사/개인 프로젝트에 GraphRAG 도입' },
                { text: 'Part 12 PoC 템플릿' }
              ]
            },
            {
              cells: [
                { text: '2. 커뮤니티', bold: true },
                { text: 'Neo4j 포럼, LangChain/LlamaIndex Discord' },
                { text: 'community.neo4j.com' }
              ]
            },
            {
              cells: [
                { text: '3. 연구 추적', bold: true },
                { text: 'arXiv "GraphRAG", "KG + LLM" 논문' },
                { text: 'arxiv.org, paperswithcode.com' }
              ]
            },
            {
              cells: [
                { text: '4. 오픈소스 기여', bold: true },
                { text: '도구, 프롬프트 템플릿, 데이터셋 공유' },
                { text: 'GitHub' }
              ]
            },
            {
              cells: [
                { text: '5. 새 도메인 도전', bold: true },
                { text: '법률, 의료, 금융에 동일 아키텍처 적용' },
                { text: '8 레이어 프레임워크 재사용' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '깊이가 곧 가치 — 실무에 적용하고, 커뮤니티에 기여하고, 새로운 도메인에 도전하세요!'
        }
      }
    ]
  }
];
