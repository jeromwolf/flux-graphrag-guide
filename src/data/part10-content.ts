import type { SectionContent } from './part1-content';

export const part10Content: SectionContent[] = [
  // Section 1: Part 9 연결 + Agentic RAG 개념 (20min) - 5 slides
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '10-1',
        tag: 'discussion',
        title: 'Part 9 리캡 — 수동 파이프라인의 한계',
        script: 'Part 9에서 graphrag_pipeline_v2를 만들었습니다 -- RRF + PageRank 리랭킹 + 경로 증거. 그런데 이 파이프라인은 "어떤 알고리즘을 쓸지" 개발자가 수동으로 결정합니다. "접착 박리 원인 추적"에는 경로 알고리즘을, "전체 불량 트렌드"에는 Global Search를 -- 이 선택을 에이전트가 자율적으로 하면? 그것이 Part 10의 Agentic GraphRAG입니다.',
        diagram: {
          nodes: [
            { text: 'Part 9: graphrag_pipeline_v2', type: 'entity' },
            { text: 'RRF + PageRank + 경로', type: 'dim' },
            { text: '개발자가 수동 선택', type: 'fail' },
            { text: '→ 진화', type: 'relation' },
            { text: 'Part 10: Agentic GraphRAG', type: 'entity' },
            { text: 'Agent가 자율 선택', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: 'Part 9의 알고리즘(Leiden, PageRank, 경로)을 Agent Tool로 변환하여, 질문 유형에 따라 에이전트가 자동 선택하는 시스템을 구축합니다.'
        }
      },
      {
        id: '10-2',
        tag: 'theory',
        title: '단일 Agent의 한계 — Part 6에서 느꼈던 것',
        script: 'Part 6에서 우리는 Text2Cypher Agent를 만들었죠. 사용자 질문을 받아서 Cypher 쿼리를 생성하고, Neo4j에서 실행해서 답을 주는. 근데 이거 한계가 뭔지 아세요? "한 번에 하나의 동작만 한다"는 겁니다. "접착 박리의 근본 원인 공정과 해당 설비의 정비 이력은?" 이런 복합 질문이 오면? 경로 알고리즘으로 원인을 추적하고, 정비 이력을 조회하고, 결과를 종합해야 합니다. 단일 Agent로는 답이 안 나옵니다.',
        diagram: {
          nodes: [
            { text: '접착 박리 원인 + 정비 이력?', type: 'entity' },
            { text: '→', type: 'relation' },
            { text: 'Text2Cypher Agent', type: 'entity' },
            { text: '→', type: 'relation' },
            { text: 'Cypher 1개만 생성', type: 'fail' },
            { text: '경로 추적 + 이력 조회 = 불가', type: 'dim' }
          ]
        },
        callout: {
          type: 'warn',
          text: '단일 Agent는 one-shot execution만 가능합니다. 다단계 추론(경로 추적 + Cypher 조회 + 검증)을 수행할 수 없습니다.'
        }
      },
      {
        id: '10-3',
        tag: 'theory',
        title: 'ReAct 패러다임 — Reasoning + Acting',
        script: '그래서 나온 게 ReAct 패러다임입니다. Reasoning + Acting. 생각하고(Thought), 행동하고(Action), 관찰하고(Observation), 다시 생각하고... 이걸 반복하는 겁니다. 예를 들어볼게요. "접착 박리의 근본 원인 공정과 해당 설비의 정비 이력은?" → Thought: "먼저 스키마를 봐야겠다" → Action: Schema Tool → Observation: "CAUSED_BY, MAINTAINED_ON 관계가 있네" → Thought: "경로로 원인을 추적하자" → Action: Path Tool → Observation: "접착 도포 → 접착기 A-3" → Thought: "정비 이력을 조회하자" → Action: Cypher Tool → Observation: "last_maintenance: 2024-01-15". 이렇게 여러 단계를 거치는 거죠.',
        diagram: {
          nodes: [
            { text: 'Thought', type: 'entity' },
            { text: '무엇을 해야 할까?', type: 'dim' },
            { text: 'Action', type: 'entity' },
            { text: 'Tool 실행', type: 'dim' },
            { text: 'Observation', type: 'entity' },
            { text: '결과 확인', type: 'dim' },
            { text: '다시 Thought', type: 'relation' },
            { text: '반복...', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: 'ReAct = Thought -> Action -> Observation 사이클을 반복해서 복잡한 질문을 단계별로 해결합니다.'
        }
      },
      {
        id: '10-4',
        tag: 'theory',
        title: 'Supervisor vs Peer 패턴',
        script: '멀티 Agent 구조는 크게 두 가지 패턴이 있습니다. Supervisor 패턴과 Peer 패턴. Supervisor는 조율자가 있는 거죠. "너는 스키마 조회해", "너는 경로 추적해", "너는 결과 검증해" 이렇게 작업을 배분하는 겁니다. Peer 패턴은 Agent들이 동등하게 토론하면서 합의하는 거고요. 우리는 Supervisor 패턴으로 갑니다. 왜냐하면 GraphRAG는 "탐색 -> 추론 -> 검증"처럼 단계가 명확하거든요.',
        table: {
          headers: ['패턴', '구조', '장점', '단점', '적합한 시나리오'],
          rows: [
            {
              cells: [
                { text: 'Supervisor', bold: true },
                { text: '중앙 조율자 + 전문 Agent들' },
                { text: '명확한 작업 분배, 추적 용이' },
                { text: 'Supervisor가 병목' },
                { text: '단계가 명확한 작업 (GraphRAG)' }
              ]
            },
            {
              cells: [
                { text: 'Peer', bold: true },
                { text: 'Agent들이 대등하게 토론' },
                { text: '창의적 해결책, 합의 기반' },
                { text: '수렴 느림, 추적 어려움' },
                { text: '열린 문제 해결 (기획, 디자인)' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '우리는 Supervisor 패턴으로 Explorer(스키마 조회) -> Reasoner(Cypher/알고리즘 실행) -> Validator(검증)를 구축합니다.'
        }
      },
      {
        id: '10-5',
        tag: 'theory',
        title: 'Supervisor 질문 분류기 — 4가지 질문 유형',
        script: 'Supervisor의 핵심 역할은 질문을 분류해서 최적의 Tool 조합을 선택하는 겁니다. 제조 도메인 질문을 4가지로 분류합니다. SIMPLE: "접착기 A-3의 사양은?" -- Cypher Tool만으로 충분. MULTI_HOP: "접착 박리의 근본 원인 공정과 해당 설비의 정비 이력은?" -- Cypher Tool + Path Tool 조합. GLOBAL: "전체 불량 트렌드는?" -- Community Tool로 커뮤니티 요약 검색. PATH: "접착 박리와 가장 관련된 설비는?" -- Algorithm Tool로 Personalized PageRank 실행.',
        table: {
          headers: ['질문 유형', '예시 (제조)', '선택 Tool', '판단 기준'],
          rows: [
            {
              cells: [
                { text: 'SIMPLE', bold: true },
                { text: '접착기 A-3의 사양은?' },
                { text: 'Cypher Tool', status: 'pass' },
                { text: '단일 노드/속성 조회' }
              ]
            },
            {
              cells: [
                { text: 'MULTI_HOP', bold: true },
                { text: '접착 박리 원인 공정의 설비 정비 이력?' },
                { text: 'Cypher + Path Tool', status: 'pass' },
                { text: '2+ 관계 추적 필요' }
              ]
            },
            {
              cells: [
                { text: 'GLOBAL', bold: true },
                { text: '전체 불량 트렌드는?' },
                { text: 'Community Tool', status: 'pass' },
                { text: '"전체", "트렌드", "요약"' }
              ]
            },
            {
              cells: [
                { text: 'PATH', bold: true },
                { text: '접착 박리와 가장 관련된 설비는?' },
                { text: 'Algorithm Tool', status: 'pass' },
                { text: '"가장 관련", "영향력"' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'Part 10의 핵심: 질문 유형에 따라 5개 Tool 중 최적 조합을 에이전트가 자율 선택합니다.'
        }
      }
    ]
  },

  // Section 2: Graph Tools 설계 — 5종 세트 (25min) - 5 slides
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '10-6',
        tag: 'theory',
        title: '그래프용 Tool 5종 세트 — Part 9 알고리즘 통합',
        script: 'Part 9에서 3종(Schema, Cypher, Path)으로는 부족했습니다. Part 9의 커뮤니티 요약(Global Search)과 Personalized PageRank를 Tool로 추가합니다. 총 5개 Tool이 Part 10의 Agent 무기입니다. Schema Tool은 스키마 조회, Cypher Tool은 Part 9의 PageRank 리랭킹을 통합한 쿼리 실행, Path Tool은 Part 9의 방향 있는 CAUSED_BY 경로 탐색, Community Tool은 Part 9의 Global Search(커뮤니티 요약 검색), Algorithm Tool은 Personalized PageRank 실행입니다.',
        diagram: {
          nodes: [
            { text: 'Schema Tool', type: 'entity' },
            { text: 'Label, Relationship 조회', type: 'dim' },
            { text: 'Cypher Tool', type: 'entity' },
            { text: 'Cypher + PageRank 리랭킹', type: 'dim' },
            { text: 'Path Tool', type: 'entity' },
            { text: 'CAUSED_BY 경로 탐색', type: 'dim' },
            { text: 'Community Tool (NEW)', type: 'entity' },
            { text: 'Part 9 Global Search', type: 'dim' },
            { text: 'Algorithm Tool (NEW)', type: 'entity' },
            { text: 'Personalized PageRank', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: '5종 Tool = Part 6(Cypher) + Part 9(PageRank, 경로, 커뮤니티, PPR). 이전 Part의 성과를 Agent Tool로 결합합니다.'
        }
      },
      {
        id: '10-7',
        tag: 'practice',
        title: 'Schema Tool + Cypher Tool 구현',
        script: 'LangChain에서 Tool을 만들 때는 @tool 데코레이터를 씁니다. 각 Tool은 함수로 정의하고, docstring으로 설명을 달아주면 LLM이 언제 이 Tool을 써야 할지 판단합니다. 중요한 건 Neo4j 인증 정보는 반드시 os.getenv로 가져오고, Cypher 쿼리에는 절대 f-string을 쓰면 안 됩니다. 파라미터 바인딩을 사용하세요.',
        code: {
          language: 'python',
          code: `import os
from neo4j import GraphDatabase
from langchain_core.tools import tool  # langchain.tools (X)
# langgraph >= 0.2.0 기준

# Neo4j 드라이버 (os.getenv 필수 — 하드코딩 금지)
driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(
        os.getenv("NEO4J_USER", "neo4j"),
        os.getenv("NEO4J_PASSWORD")
    )
)

# 1. Schema Tool
@tool
def get_graph_schema() -> str:
    """제조 KG의 스키마를 조회합니다.
    노드 Label(Process, Equipment, Defect 등)과
    Relationship 타입(CAUSED_BY, USES_EQUIPMENT 등)을 반환합니다."""
    with driver.session() as session:
        labels = session.run("CALL db.labels()").data()
        rels = session.run(
            "CALL db.relationshipTypes()"
        ).data()
    return f"Labels: {labels}\\nRelationships: {rels}"

# 2. Cypher Tool (파라미터 바인딩 필수)
@tool
def execute_cypher(query: str, params: dict = {}) -> list:
    """Cypher 쿼리를 Neo4j에서 실행합니다.
    반드시 파라미터 바인딩($name 등)을 사용하세요.

    Args:
        query: 실행할 Cypher 쿼리
          예: MATCH (n:Process {name: $name}) RETURN n
        params: 쿼리 파라미터 딕셔너리
          예: {"name": "접착 도포"}
    """
    # Cypher 인젝션 방지: f-string 사용 금지
    # BAD:  f"MATCH (n {{name: '{entity}'}}) RETURN n"
    # GOOD: "MATCH (n {name: $name}) RETURN n"
    with driver.session() as session:
        result = session.run(query, **params).data()
    return result`
        },
        callout: {
          type: 'warn',
          text: 'Cypher 인젝션 취약점 주의! f-string으로 쿼리를 조립하면 공격에 노출됩니다. 반드시 $param 바인딩을 사용하세요.'
        }
      },
      {
        id: '10-8',
        tag: 'practice',
        title: 'Path Tool + Community Tool 구현',
        script: 'Path Tool은 Part 9에서 배운 방향 있는 CAUSED_BY 경로 탐색을 Agent가 자동으로 실행하게 만듭니다. Community Tool은 Part 9의 Global Search를 그대로 Tool로 감싸서, 커뮤니티 요약 기반 검색을 합니다. 둘 다 파라미터 바인딩을 사용합니다.',
        code: {
          language: 'python',
          code: `# 3. Path Tool — Part 9 방향 있는 원인 추적
@tool
def find_causal_path(
    start_name: str, end_name: str
) -> dict:
    """두 노드 사이의 인과 경로를 탐색합니다.
    CAUSED_BY, USES_EQUIPMENT 등 방향 있는 관계를 추적합니다.

    Args:
        start_name: 시작 노드 이름 (예: 접착 박리)
        end_name: 끝 노드 이름 (예: 접착기 A-3)
    """
    query = """
    MATCH (a {name: $start}), (b {name: $end})
    MATCH path = shortestPath((a)-[*..5]-(b))
    RETURN [n IN nodes(path) | n.name] AS nodes,
           [r IN relationships(path) | type(r)] AS rels,
           length(path) AS hops
    """
    with driver.session() as session:
        result = session.run(
            query, start=start_name, end=end_name
        ).data()
    return result

# 4. Community Tool — Part 9 Global Search
@tool
def search_communities(query: str) -> str:
    """커뮤니티 요약 기반 Global Search입니다.
    전체 트렌드, 패턴, 요약 질문에 적합합니다.
    Part 9의 Leiden 커뮤니티 요약을 검색합니다.

    Args:
        query: 검색 질문 (예: 전체 불량 트렌드)
    """
    with driver.session() as session:
        result = session.run("""
            MATCH (c:Community)
            RETURN c.id AS id, c.summary AS summary
            ORDER BY c.id
        """)
        summaries = "\\n".join([
            f"[커뮤니티 {r['id']}] {r['summary']}"
            for r in result
        ])
    return summaries if summaries else "커뮤니티 요약 없음"`
        },
        callout: {
          type: 'tip',
          text: 'Community Tool = Part 9의 global_search() 함수를 @tool로 감싼 것. 에이전트가 "전체" 질문 시 자동 선택합니다.'
        }
      },
      {
        id: '10-9',
        tag: 'practice',
        title: 'Algorithm Tool — Personalized PageRank',
        script: 'Algorithm Tool은 Part 9의 Personalized PageRank를 Agent가 직접 실행하게 만듭니다. "접착 박리와 가장 관련된 설비는?" 같은 질문에 에이전트가 이 Tool을 선택합니다. GDS 프로젝션이 필요하므로, Tool 내부에서 임시 프로젝션을 생성하고, 알고리즘을 실행한 뒤, 프로젝션을 삭제합니다.',
        code: {
          language: 'python',
          code: `# 5. Algorithm Tool — Personalized PageRank
@tool
def run_personalized_pagerank(
    source_name: str, top_k: int = 5
) -> list:
    """특정 노드에서 가장 관련 있는 노드를 찾습니다.
    Part 9의 Personalized PageRank를 실행합니다.

    Args:
        source_name: 시작 노드 이름 (예: 접착 박리)
        top_k: 반환할 상위 노드 수 (기본 5)
    """
    with driver.session() as session:
        # 임시 프로젝션 생성
        session.run("""
            CALL gds.graph.project(
                'temp_ppr',
                ['Process','Equipment','Defect',
                 'Material','Product','Spec'],
                ['USES_EQUIPMENT','CAUSED_BY',
                 'USES_MATERIAL','HAS_DEFECT',
                 'CONFORMS_TO','MAINTAINED_ON']
            )
        """)

        # Personalized PageRank 실행
        result = session.run("""
            MATCH (source {name: $name})
            CALL gds.pageRank.stream('temp_ppr', {
                sourceNodes: [source],
                dampingFactor: 0.85
            })
            YIELD nodeId, score
            RETURN gds.util.asNode(nodeId).name AS name,
                   labels(gds.util.asNode(nodeId))[0]
                     AS type,
                   round(score, 4) AS score
            ORDER BY score DESC LIMIT $top_k
        """, name=source_name, top_k=top_k).data()

        # 프로젝션 삭제
        session.run(
            "CALL gds.graph.drop('temp_ppr', false)"
        )
    return result

# 전체 5개 Tool 목록
tools = [
    get_graph_schema,       # Schema Tool
    execute_cypher,         # Cypher Tool
    find_causal_path,       # Path Tool
    search_communities,     # Community Tool (NEW)
    run_personalized_pagerank  # Algorithm Tool (NEW)
]`
        },
        callout: {
          type: 'key',
          text: '5개 Tool 완성! Schema + Cypher + Path + Community(Part 9 Global Search) + Algorithm(Part 9 PPR). Agent의 무기고입니다.'
        }
      },
      {
        id: '10-10',
        tag: 'theory',
        title: 'Tool 라우팅 전략 — Supervisor 자동 선택',
        script: 'Agent가 질문을 받으면 어떤 Tool을 써야 할까요? 이걸 라우팅이라고 합니다. 제조 도메인 예시를 봅시다. "접착기 A-3을 사용하는 모든 공정은?" -- 이건 단순 쿼리니까 Cypher Tool. "접착 박리의 근본 원인 공정과 해당 설비의 정비 이력은?" -- 이건 Path Tool + Cypher Tool 조합. "전체 불량 트렌드는?" -- Community Tool. "접착 박리와 가장 관련된 설비는?" -- Algorithm Tool. Supervisor Agent가 질문 유형을 분류해서 적절한 Tool을 선택하는 겁니다.',
        diagram: {
          nodes: [
            { text: '질문 입력', type: 'entity' },
            { text: '→', type: 'relation' },
            { text: 'Supervisor', type: 'entity' },
            { text: '질문 유형 분류', type: 'dim' },
            { text: 'SIMPLE → Cypher Tool', type: 'relation' },
            { text: 'MULTI_HOP → Path + Cypher', type: 'relation' },
            { text: 'GLOBAL → Community Tool', type: 'relation' },
            { text: 'PATH → Algorithm Tool', type: 'relation' }
          ]
        },
        callout: {
          type: 'tip',
          text: 'Tool docstring이 핵심입니다. LLM은 docstring을 읽고 어떤 Tool을 언제 사용할지 판단합니다. 제조 도메인 맥락을 docstring에 포함하세요.'
        }
      }
    ]
  },

  // Section 3: LangGraph 멀티에이전트 구축 (40min) - 7 slides
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '10-11',
        tag: 'practice',
        title: 'LangGraph StateGraph 설계 — 재시도 카운트 포함',
        script: 'LangGraph는 Agent 흐름을 그래프로 표현하는 라이브러리입니다. StateGraph를 만들고, 노드(Agent)와 엣지(연결)를 정의합니다. 중요한 개선점은 retry_count와 max_retries를 State에 추가하는 겁니다. Part 6의 단일 Agent는 재시도가 불가능했지만, 여기서는 최대 3회까지 재시도하고, 그래도 안 되면 fallback 답변을 반환합니다.',
        code: {
          language: 'python',
          code: `from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
from operator import add
# langgraph >= 0.2.0 기준

# 1. State 정의 (재시도 카운트 포함)
class AgentState(TypedDict):
    query: str              # 사용자 질문
    schema: str             # 조회된 스키마
    question_type: str      # SIMPLE/MULTI_HOP/GLOBAL/PATH
    cypher: str             # 생성된 Cypher
    result: list[dict]      # 실행 결과
    path_evidence: str      # 경로 증거
    community_summary: str  # 커뮤니티 요약
    ppr_result: list[dict]  # PPR 결과
    is_valid: bool          # 검증 통과 여부
    error: str              # 에러 메시지
    retry_count: int        # 재시도 횟수
    max_retries: int        # 최대 3회
    final_answer: str       # 최종 답변

# 2. Graph 생성
workflow = StateGraph(AgentState)

# 3. 노드 추가
workflow.add_node("explorer", explorer_node)
workflow.add_node("reasoner", reasoner_node)
workflow.add_node("validator", validator_node)
workflow.add_node("fallback", fallback_node)

# 4. 엣지 연결
workflow.add_edge("explorer", "reasoner")
workflow.add_edge("reasoner", "validator")

# 5. 조건부 라우팅 (재시도 제한)
def route_after_validation(state: AgentState):
    if state["is_valid"]:
        return END
    if state["retry_count"] >= state["max_retries"]:
        return "fallback"
    return "reasoner"

workflow.add_conditional_edges(
    "validator", route_after_validation
)
workflow.add_edge("fallback", END)

# 6. 시작점 설정
workflow.set_entry_point("explorer")`
        },
        diagram: {
          nodes: [
            { text: 'START', type: 'entity' },
            { text: '→', type: 'relation' },
            { text: 'Explorer', type: 'entity' },
            { text: '스키마 + 질문 분류', type: 'dim' },
            { text: '→', type: 'relation' },
            { text: 'Reasoner', type: 'entity' },
            { text: '5 Tools 실행', type: 'dim' },
            { text: '→', type: 'relation' },
            { text: 'Validator', type: 'entity' },
            { text: '검증', type: 'dim' },
            { text: 'Valid → END', type: 'entity' },
            { text: 'retry < 3 → Reasoner', type: 'fail' },
            { text: 'retry >= 3 → Fallback', type: 'fail' }
          ]
        }
      },
      {
        id: '10-12',
        tag: 'practice',
        title: 'Explorer Node — 스키마 조회 + 질문 분류',
        script: 'Explorer는 두 가지를 합니다. 첫째, Schema Tool로 KG 스키마를 조회합니다. 둘째, 질문을 SIMPLE/MULTI_HOP/GLOBAL/PATH 중 하나로 분류합니다. 이 분류 결과에 따라 Reasoner가 어떤 Tool을 사용할지 결정됩니다. 프롬프트는 반드시 한국어로 작성하고, 제조 도메인 스키마(7개 엔티티, 9개 관계)를 포함합니다.',
        code: {
          language: 'python',
          code: `from langchain_openai import ChatOpenAI
# Claude 옵션: from langchain_anthropic import ChatAnthropic
# langgraph >= 0.2.0 기준

llm = ChatOpenAI(model="gpt-4o", temperature=0)

def explorer_node(state: AgentState) -> AgentState:
    """스키마 조회 + 질문 유형 분류"""
    # 1. 스키마 조회
    schema = get_graph_schema.invoke({})
    state["schema"] = schema

    # 2. 질문 분류 (한국어 프롬프트)
    classify_prompt = f"""당신은 제조 KG 질문 분류기입니다.

제조 KG 스키마:
- 엔티티: Process, Equipment, Defect, Material,
  Product, Spec, Maintenance
- 관계: CAUSED_BY, USES_EQUIPMENT, USES_MATERIAL,
  CONFORMS_TO, MAINTAINED_ON, PRODUCES,
  NEXT_PROCESS, DETECTED_IN, INSPECTED_BY

질문: {state['query']}

다음 중 하나로 분류하세요:
- SIMPLE: 단일 노드/속성 조회
  (예: 접착기 A-3의 사양은?)
- MULTI_HOP: 2개 이상 관계 추적 필요
  (예: 접착 박리 원인 공정의 설비 정비 이력?)
- GLOBAL: 전체 트렌드/요약 질문
  (예: 전체 불량 트렌드는?)
- PATH: 관련성/영향력 분석
  (예: 접착 박리와 가장 관련된 설비는?)

분류 결과만 출력하세요 (SIMPLE/MULTI_HOP/GLOBAL/PATH):"""

    response = llm.invoke(classify_prompt)
    q_type = response.content.strip().upper()
    if q_type not in [
        "SIMPLE", "MULTI_HOP", "GLOBAL", "PATH"
    ]:
        q_type = "SIMPLE"  # fallback
    state["question_type"] = q_type
    return state`
        },
        callout: {
          type: 'tip',
          text: '프롬프트는 반드시 한국어 + 제조 도메인 컨텍스트를 포함하세요. 영어 프롬프트는 도메인 이해도를 떨어뜨립니다.'
        }
      },
      {
        id: '10-13',
        tag: 'practice',
        title: 'Reasoner Node — 질문 유형별 Tool 실행',
        script: 'Reasoner는 Explorer가 분류한 질문 유형에 따라 적절한 Tool을 실행합니다. SIMPLE이면 Cypher Tool만, MULTI_HOP이면 Cypher + Path Tool, GLOBAL이면 Community Tool, PATH이면 Algorithm Tool. 모든 Cypher 쿼리는 파라미터 바인딩을 사용합니다. 이전 에러가 있으면 에러 메시지를 참고해서 수정된 쿼리를 생성합니다.',
        code: {
          language: 'python',
          code: `def reasoner_node(state: AgentState) -> AgentState:
    """질문 유형에 따라 적절한 Tool 실행"""
    q_type = state["question_type"]
    query = state["query"]
    schema = state["schema"]

    # 이전 에러 참고 (재시도 시)
    error_ctx = ""
    if state.get("error"):
        error_ctx = f"""
이전 시도 에러: {state['error']}
이 에러를 참고하여 수정된 쿼리를 생성하세요.
"""

    # 한국어 프롬프트 + 제조 도메인 스키마
    cypher_prompt = f"""당신은 제조 KG Cypher 전문가입니다.

스키마: {schema}
질문: {query}
{error_ctx}
규칙:
1. 파라미터 바인딩 사용 ($name, $value 등)
2. f-string 절대 금지
3. 제조 엔티티: Process, Equipment, Defect,
   Material, Product, Spec
4. 제조 관계: CAUSED_BY, USES_EQUIPMENT,
   USES_MATERIAL, CONFORMS_TO, MAINTAINED_ON

Cypher 쿼리와 파라미터를 JSON으로 반환하세요:
{{"cypher": "MATCH ...", "params": {{...}}}}"""

    if q_type == "SIMPLE":
        resp = llm.invoke(cypher_prompt)
        parsed = parse_cypher_response(resp.content)
        result = execute_cypher.invoke({
            "query": parsed["cypher"],
            "params": parsed["params"]
        })
        state["result"] = result

    elif q_type == "MULTI_HOP":
        resp = llm.invoke(cypher_prompt)
        parsed = parse_cypher_response(resp.content)
        result = execute_cypher.invoke({
            "query": parsed["cypher"],
            "params": parsed["params"]
        })
        state["result"] = result
        # 경로 증거 추가
        if result and len(result) >= 2:
            path = find_causal_path.invoke({
                "start_name": result[0].get("name",""),
                "end_name": result[-1].get("name","")
            })
            state["path_evidence"] = str(path)

    elif q_type == "GLOBAL":
        summaries = search_communities.invoke(
            {"query": query}
        )
        state["community_summary"] = summaries
        state["result"] = [{"summary": summaries}]

    elif q_type == "PATH":
        # 질문에서 시작 엔티티 추출
        entity = extract_entity_from_query(
            query, llm
        )
        ppr = run_personalized_pagerank.invoke({
            "source_name": entity, "top_k": 5
        })
        state["ppr_result"] = ppr
        state["result"] = ppr

    state["retry_count"] = state.get(
        "retry_count", 0
    ) + 1
    return state`
        },
        callout: {
          type: 'key',
          text: '질문 유형별로 다른 Tool을 실행하는 것이 Agentic GraphRAG의 핵심입니다. Part 9의 수동 선택을 자동화했습니다.'
        }
      },
      {
        id: '10-14',
        tag: 'practice',
        title: 'Validator Node — KG 기반 Hallucination 검증',
        script: 'Validator는 결과를 검증합니다. 핵심은 Hallucination 감지입니다. 답변에 나온 엔티티가 실제로 KG에 존재하는지 확인합니다. 엔티티 추출은 LLM 기반으로 수행하고, 각 엔티티를 KG에서 조회합니다. 여기서도 Cypher 인젝션을 방지하기 위해 파라미터 바인딩을 사용합니다.',
        code: {
          language: 'python',
          code: `def extract_entities(text: str) -> list[str]:
    """LLM 기반 엔티티 추출"""
    prompt = f"""다음 텍스트에서 제조 도메인 엔티티를 추출하세요.
엔티티 유형: 공정명, 설비명, 불량명, 자재명, 제품명

텍스트: {text}

엔티티 이름만 쉼표로 구분하여 반환하세요:"""
    response = llm.invoke(prompt)
    entities = [
        e.strip() for e in response.content.split(",")
        if e.strip()
    ]
    return entities

def validate_against_kg(
    answer: str, state: AgentState
) -> tuple[bool, str]:
    """답변의 엔티티가 실제 KG에 존재하는지 검증"""
    entities = extract_entities(answer)
    missing = []

    for entity in entities:
        # 파라미터 바인딩 (인젝션 방지)
        query = "MATCH (n {name: $name}) RETURN n"
        result = execute_cypher.invoke({
            "query": query,
            "params": {"name": entity}
        })
        if not result:
            missing.append(entity)

    if missing:
        return False, (
            f"KG에 없는 엔티티: {missing}. "
            "Hallucination 가능성."
        )
    return True, ""

def validator_node(state: AgentState) -> AgentState:
    """결과 검증 + Hallucination 감지"""
    if not state["result"]:
        state["is_valid"] = False
        state["error"] = (
            "쿼리 결과가 비어있습니다. "
            "Cypher를 수정하세요."
        )
        return state

    # 중간 답변 생성
    answer_prompt = f"""제조 KG 검색 결과를 바탕으로 답변하세요.

질문: {state['query']}
결과: {state['result'][:10]}
경로 증거: {state.get('path_evidence', '없음')}
커뮤니티 요약: {state.get('community_summary', '없음')[:500]}

간결하게 답변하세요. KG에 있는 정보만 사용하세요."""

    response = llm.invoke(answer_prompt)
    answer = response.content

    # Hallucination 검증
    is_valid, error_msg = validate_against_kg(
        answer, state
    )
    state["is_valid"] = is_valid
    if not is_valid:
        state["error"] = error_msg
    else:
        state["final_answer"] = answer
    return state`
        },
        callout: {
          type: 'warn',
          text: 'Hallucination 검증은 필수입니다. 특히 제조, 의료 등 정확도가 중요한 도메인에서는 반드시 KG 기반 검증을 추가하세요.'
        }
      },
      {
        id: '10-15',
        tag: 'practice',
        title: 'Fallback Node — 재시도 한계 시 안전한 응답',
        script: '3회 재시도에도 검증을 통과하지 못하면 Fallback 노드가 실행됩니다. "답변을 생성할 수 없습니다"라고 솔직하게 말하고, 시도한 내역과 실패 원인을 함께 반환합니다. 무한 루프를 방지하는 핵심 메커니즘입니다.',
        code: {
          language: 'python',
          code: `def fallback_node(state: AgentState) -> AgentState:
    """재시도 한계 도달 시 안전한 응답 생성"""
    state["final_answer"] = (
        f"질문 '{state['query']}'에 대해 "
        f"{state['max_retries']}회 시도했으나 "
        "신뢰할 수 있는 답변을 생성하지 못했습니다.\\n\\n"
        f"마지막 에러: {state.get('error', '알 수 없음')}\\n"
        f"질문 유형: {state.get('question_type', '미분류')}\\n\\n"
        "권장 조치:\\n"
        "1. 질문을 더 구체적으로 변경해보세요\\n"
        "2. KG에 해당 데이터가 있는지 확인하세요\\n"
        "3. 스키마를 직접 조회해보세요"
    )
    state["is_valid"] = True  # 루프 탈출
    return state

def extract_entity_from_query(
    query: str, llm
) -> str:
    """질문에서 핵심 엔티티 추출 (PPR 시작점)"""
    prompt = f"""다음 질문에서 분석 시작점이 될
제조 엔티티를 하나만 추출하세요.

질문: {query}

엔티티 이름만 반환하세요:"""
    resp = llm.invoke(prompt)
    return resp.content.strip()

def parse_cypher_response(text: str) -> dict:
    """LLM 응답에서 Cypher + params 파싱"""
    import json
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # JSON 파싱 실패 시 텍스트에서 추출
        return {"cypher": text, "params": {}}`
        },
        callout: {
          type: 'tip',
          text: 'Fallback 노드 = 무한 루프 방지의 핵심. max_retries(기본 3회)를 반드시 설정하세요.'
        }
      },
      {
        id: '10-16',
        tag: 'practice',
        title: 'Graph 컴파일 + LangGraph 시각화',
        script: 'LangGraph의 강력한 기능 중 하나가 그래프 시각화입니다. app.get_graph().draw_mermaid()를 호출하면 Mermaid 형식으로 Agent 흐름을 시각화할 수 있습니다. 실제 노드 간 연결을 눈으로 확인할 수 있어서 디버깅에 매우 유용합니다.',
        code: {
          language: 'python',
          code: `# Graph 컴파일
app = workflow.compile()

# LangGraph 시각화 (Mermaid 다이어그램)
mermaid_code = app.get_graph().draw_mermaid()
print(mermaid_code)
# 출력:
# graph TD
#   __start__ --> explorer
#   explorer --> reasoner
#   reasoner --> validator
#   validator -. "is_valid=True" .-> __end__
#   validator -. "retry < max" .-> reasoner
#   validator -. "retry >= max" .-> fallback
#   fallback --> __end__

# PNG로 저장 (선택)
from IPython.display import Image, display
img = app.get_graph().draw_mermaid_png()
display(Image(img))

# Jupyter Notebook에서 바로 시각화
# app.get_graph().draw_mermaid_png() 로 확인`
        },
        callout: {
          type: 'tip',
          text: 'app.get_graph().draw_mermaid()로 Agent 흐름을 시각화하세요. 디버깅과 문서화에 필수적인 도구입니다.'
        }
      },
      {
        id: '10-17',
        tag: 'practice',
        title: '제조 도메인 실행 데모',
        script: '이제 컴파일된 Agent를 실행해봅시다. 4가지 질문 유형별로 테스트합니다. 각 질문에 대해 어떤 Tool이 선택되고, 어떤 경로로 진행되는지 확인합니다.',
        code: {
          language: 'python',
          code: `# 테스트 질문 4종 (질문 유형별)
test_questions = [
    # SIMPLE: 단일 조회
    "접착기 A-3을 사용하는 모든 공정은?",
    # MULTI_HOP: 다단계 추론
    "접착 박리의 근본 원인 공정과 해당 설비의 정비 이력은?",
    # GLOBAL: 전체 트렌드
    "전체 공정에서 가장 자주 발생하는 불량 패턴은?",
    # PATH: 관련성 분석
    "접착 박리와 가장 관련된 설비는?",
]

for q in test_questions:
    initial_state = {
        "query": q,
        "schema": "",
        "question_type": "",
        "cypher": "",
        "result": [],
        "path_evidence": "",
        "community_summary": "",
        "ppr_result": [],
        "is_valid": False,
        "error": "",
        "retry_count": 0,
        "max_retries": 3,
        "final_answer": ""
    }

    final = app.invoke(initial_state)
    print(f"\\n질문: {q}")
    print(f"유형: {final['question_type']}")
    print(f"재시도: {final['retry_count']}회")
    print(f"답변: {final['final_answer'][:200]}")
    print("-" * 50)

# 예상 출력:
# 질문: 접착기 A-3을 사용하는 모든 공정은?
# 유형: SIMPLE
# 재시도: 1회
# 답변: 접착 도포 공정이 접착기 A-3을 사용합니다.
# --------------------------------------------------
# 질문: 접착 박리와 가장 관련된 설비는?
# 유형: PATH
# 재시도: 1회
# 답변: Personalized PageRank 결과, 접착기 A-3
#       (0.4821), 접착 도포(0.3156) 순으로 관련...`
        },
        callout: {
          type: 'key',
          text: '4가지 질문 유형 -> 4가지 Tool 조합 -> 자율 선택. 이것이 Part 10 Agentic GraphRAG의 핵심 가치입니다.'
        }
      }
    ]
  },

  // Section 4: 자기 수정 파이프라인 + Hallucination 검증 (20min) - 4 slides
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '10-18',
        tag: 'practice',
        title: '자기 수정 흐름 — 실패 감지 + 재시도 + 대안 경로',
        script: 'Agent가 실패할 수 있습니다. Cypher 쿼리가 잘못됐거나, 결과가 비어있거나, Hallucination이 감지되거나. 이럴 때 자동으로 재시도하되, retry_count로 횟수를 제한합니다. 3회를 초과하면 Fallback으로 이동합니다.',
        diagram: {
          nodes: [
            { text: 'START: 질문', type: 'entity' },
            { text: '→', type: 'relation' },
            { text: 'Explorer', type: 'entity' },
            { text: '스키마 + 분류', type: 'dim' },
            { text: '→', type: 'relation' },
            { text: 'Reasoner', type: 'entity' },
            { text: '5 Tools 실행', type: 'dim' },
            { text: '→', type: 'relation' },
            { text: 'Validator', type: 'entity' },
            { text: 'KG 검증', type: 'dim' },
            { text: 'Valid → END', type: 'entity' },
            { text: 'retry < 3 → Reasoner', type: 'fail' },
            { text: 'retry >= 3 → Fallback', type: 'fail' }
          ]
        },
        callout: {
          type: 'key',
          text: '자기 수정 파이프라인: 실패 감지 -> 에러 컨텍스트 전달 -> Reasoner 재시도 -> 최대 3회 -> Fallback. 무한 루프를 방지합니다.'
        }
      },
      {
        id: '10-19',
        tag: 'practice',
        title: 'E2E 실행 코드 — 복사해서 바로 실행',
        script: '여기까지 배운 내용을 하나의 실행 가능한 코드로 정리합니다. 이 코드를 복사해서 바로 실행할 수 있습니다. Neo4j와 OpenAI API 키만 환경변수로 설정하면 됩니다.',
        code: {
          language: 'python',
          code: `"""Agentic GraphRAG — 완전한 E2E 실행 코드
필요: pip install langchain-openai langgraph neo4j
환경변수: NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD,
         OPENAI_API_KEY
"""
import os, json
from typing import TypedDict
from neo4j import GraphDatabase
from langchain_openai import ChatOpenAI
# Claude 옵션: from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END
# langgraph >= 0.2.0 기준

# --- 설정 ---
llm = ChatOpenAI(model="gpt-4o", temperature=0)
driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(
        os.getenv("NEO4J_USER", "neo4j"),
        os.getenv("NEO4J_PASSWORD")
    )
)

# --- State ---
class AgentState(TypedDict):
    query: str
    schema: str
    question_type: str
    result: list[dict]
    path_evidence: str
    community_summary: str
    is_valid: bool
    error: str
    retry_count: int
    max_retries: int
    final_answer: str

# --- Tools (5종) ---
@tool
def get_graph_schema() -> str:
    """제조 KG 스키마 조회"""
    with driver.session() as s:
        labels = s.run("CALL db.labels()").data()
        rels = s.run(
            "CALL db.relationshipTypes()"
        ).data()
    return f"Labels: {labels}\\nRels: {rels}"

@tool
def execute_cypher(
    query: str, params: dict = {}
) -> list:
    """Cypher 실행 (파라미터 바인딩 필수)"""
    with driver.session() as s:
        return s.run(query, **params).data()

@tool
def find_causal_path(
    start_name: str, end_name: str
) -> dict:
    """인과 경로 탐색"""
    q = """MATCH (a {name:$start}),(b {name:$end})
    MATCH p=shortestPath((a)-[*..5]-(b))
    RETURN [n IN nodes(p)|n.name] AS nodes,
           [r IN relationships(p)|type(r)] AS rels"""
    with driver.session() as s:
        return s.run(
            q, start=start_name, end=end_name
        ).data()

@tool
def search_communities(query: str) -> str:
    """커뮤니티 요약 검색 (Global Search)"""
    with driver.session() as s:
        r = s.run(
            "MATCH (c:Community) "
            "RETURN c.id AS id, c.summary AS summary"
        )
        return "\\n".join([
            f"[{row['id']}] {row['summary']}"
            for row in r
        ]) or "요약 없음"

@tool
def run_ppr(
    source_name: str, top_k: int = 5
) -> list:
    """Personalized PageRank 실행"""
    with driver.session() as s:
        s.run("CALL gds.graph.drop('ppr',false)")
        s.run("""CALL gds.graph.project('ppr',
            ['Process','Equipment','Defect',
             'Material','Product','Spec'],
            ['USES_EQUIPMENT','CAUSED_BY',
             'USES_MATERIAL','HAS_DEFECT',
             'CONFORMS_TO','MAINTAINED_ON'])""")
        result = s.run("""
            MATCH (src {name:$name})
            CALL gds.pageRank.stream('ppr',{
                sourceNodes:[src],dampingFactor:0.85
            }) YIELD nodeId,score
            RETURN gds.util.asNode(nodeId).name AS n,
                   round(score,4) AS s
            ORDER BY score DESC LIMIT $k
        """, name=source_name, k=top_k).data()
        s.run("CALL gds.graph.drop('ppr',false)")
    return result

# --- Nodes ---
# (explorer_node, reasoner_node,
#  validator_node, fallback_node
#  은 이전 슬라이드 코드 참조)

# --- 실행 ---
workflow = StateGraph(AgentState)
workflow.add_node("explorer", explorer_node)
workflow.add_node("reasoner", reasoner_node)
workflow.add_node("validator", validator_node)
workflow.add_node("fallback", fallback_node)
workflow.set_entry_point("explorer")
workflow.add_edge("explorer", "reasoner")
workflow.add_edge("reasoner", "validator")
workflow.add_conditional_edges(
    "validator", route_after_validation
)
workflow.add_edge("fallback", END)
app = workflow.compile()

# 실행
result = app.invoke({
    "query": "접착 박리의 근본 원인 공정과 "
             "해당 설비의 정비 이력은?",
    "schema": "", "question_type": "",
    "result": [], "path_evidence": "",
    "community_summary": "",
    "is_valid": False, "error": "",
    "retry_count": 0, "max_retries": 3,
    "final_answer": ""
})
print(result["final_answer"])`
        },
        callout: {
          type: 'tip',
          text: '이 코드를 복사해서 바로 실행할 수 있습니다. Neo4j + GDS + OpenAI API 키만 환경변수로 설정하세요.'
        }
      },
      {
        id: '10-20',
        tag: 'practice',
        title: 'Part 7 RAGAS 통합 — 멀티에이전트 정확도 측정',
        script: 'Part 7에서 만든 RAGAS 데이터셋(20개 질문)으로 단일 Agent(Part 6) vs 멀티 Agent(Part 10)를 비교합니다. 각 질문에 대해 faithfulness와 answer_relevancy를 측정하고, 질문 유형별로 어디서 개선이 되는지 확인합니다.',
        code: {
          language: 'python',
          code: `from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy
import json

# Part 7에서 만든 평가 데이터셋
with open("ragas_eval_dataset.json") as f:
    eval_data = json.load(f)

def benchmark_agents(eval_data: dict) -> dict:
    """단일 Agent vs 멀티 Agent 비교 벤치마크

    측정: Part 7의 RAGAS 데이터셋(20개 질문)으로
    단일 Agent(Part 6) vs 멀티 Agent(Part 10)를
    비교합니다.
    """
    questions = eval_data["questions"][:20]
    ground_truths = eval_data["ground_truths"][:20]

    # 1. 단일 Agent (Part 6 방식)
    single_answers = [
        single_agent_pipeline(q)
        for q in questions
    ]

    # 2. 멀티 Agent (Part 10)
    multi_answers = []
    for q in questions:
        result = app.invoke({
            "query": q,
            "schema": "", "question_type": "",
            "result": [], "path_evidence": "",
            "community_summary": "",
            "is_valid": False, "error": "",
            "retry_count": 0, "max_retries": 3,
            "final_answer": ""
        })
        multi_answers.append(result["final_answer"])

    # 3. RAGAS 평가
    single_scores = evaluate(
        questions=questions,
        answers=single_answers,
        ground_truths=ground_truths,
        metrics=[faithfulness, answer_relevancy]
    )
    multi_scores = evaluate(
        questions=questions,
        answers=multi_answers,
        ground_truths=ground_truths,
        metrics=[faithfulness, answer_relevancy]
    )

    return {
        "single": single_scores,
        "multi": multi_scores
    }

results = benchmark_agents(eval_data)
print("단일 Agent:", results["single"])
print("멀티 Agent:", results["multi"])`
        },
        callout: {
          type: 'warn',
          text: '위 수치는 예시이며, 실제 성능은 질문 유형과 KG 규모에 따라 달라집니다. 반드시 자체 벤치마크를 수행하세요.'
        }
      },
      {
        id: '10-21',
        tag: 'discussion',
        title: '자기 수정 파이프라인 전체 흐름 정리',
        script: '전체 흐름을 정리합시다. 질문이 들어오면 Explorer가 스키마를 조회하고 질문을 분류합니다. Reasoner가 분류에 따라 5개 Tool 중 적절한 것을 실행합니다. Validator가 결과를 검증하고, Hallucination을 감지합니다. 실패하면 최대 3회까지 Reasoner로 돌아가서 에러 컨텍스트를 참고해 수정합니다. 3회 실패 시 Fallback이 안전한 응답을 반환합니다.',
        table: {
          headers: ['단계', '역할', 'Tool 사용', '실패 시'],
          rows: [
            {
              cells: [
                { text: 'Explorer', bold: true },
                { text: '스키마 조회 + 질문 분류' },
                { text: 'Schema Tool', status: 'pass' },
                { text: '-' }
              ]
            },
            {
              cells: [
                { text: 'Reasoner', bold: true },
                { text: '질문 유형별 Tool 실행' },
                { text: '5종 Tool 선택', status: 'pass' },
                { text: '에러 컨텍스트로 재시도' }
              ]
            },
            {
              cells: [
                { text: 'Validator', bold: true },
                { text: '결과 검증 + Hallucination 감지' },
                { text: 'Cypher Tool (KG 조회)', status: 'warn' },
                { text: 'retry_count 증가' }
              ]
            },
            {
              cells: [
                { text: 'Fallback', bold: true },
                { text: '안전한 응답 반환' },
                { text: '-' },
                { text: '3회 초과 시 실행', status: 'fail' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '자율 시스템의 핵심은 검증 + 재시도 제한입니다. Agent가 스스로 판단하되, 반드시 KG 기반 검증과 retry 한계가 있어야 합니다.'
        }
      }
    ]
  },

  // Section 5: 벤치마크 + 비교 + 정리 (15min) - 5 slides
  {
    sectionId: 'sec5',
    slides: [
      {
        id: '10-22',
        tag: 'discussion',
        title: '단일 Agent vs 멀티 Agent 정확도 비교',
        script: 'Part 6에서 만든 단일 Text2Cypher Agent와 Part 10의 멀티 Agent를 비교해봅시다. 단순 질문은 거의 비슷합니다. 하지만 복잡한 Multi-hop 질문에서는 멀티 Agent가 훨씬 낫습니다. 왜냐하면 자기 수정이 가능하거든요. 위 수치는 예시이며, 실제 성능은 질문 유형과 KG 규모에 따라 달라집니다. 측정: Part 7의 RAGAS 데이터셋(20개 질문)으로 단일 Agent(Part 6) vs 멀티 Agent(Part 10)를 비교합니다.',
        table: {
          headers: ['질문 유형', '단일 Agent (Part 6)', '멀티 Agent (Part 10)', '비고'],
          rows: [
            {
              cells: [
                { text: 'SIMPLE (단순 쿼리)', bold: true },
                { text: '85%', status: 'pass' },
                { text: '87%', status: 'pass' },
                { text: '거의 차이 없음' }
              ]
            },
            {
              cells: [
                { text: 'MULTI_HOP (2-hop)', bold: true },
                { text: '60%', status: 'warn' },
                { text: '78%', status: 'pass' },
                { text: 'Path Tool + 재시도로 개선' }
              ]
            },
            {
              cells: [
                { text: 'GLOBAL (전체 트렌드)', bold: true },
                { text: '30%', status: 'fail' },
                { text: '72%', status: 'pass' },
                { text: 'Community Tool 효과' }
              ]
            },
            {
              cells: [
                { text: 'PATH (관련성 분석)', bold: true },
                { text: '40%', status: 'fail' },
                { text: '75%', status: 'pass' },
                { text: 'Algorithm Tool (PPR) 효과' }
              ]
            },
            {
              cells: [
                { text: 'Hallucination 감지', bold: true },
                { text: '없음', status: 'fail' },
                { text: 'KG 검증', status: 'pass' },
                { text: '멀티 Agent만 가능' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: '위 수치는 예시이며, 실제 성능은 질문 유형과 KG 규모에 따라 달라집니다. 측정: Part 7의 RAGAS 데이터셋(20개 질문)으로 단일 Agent(Part 6) vs 멀티 Agent(Part 10)를 비교합니다.'
        }
      },
      {
        id: '10-23',
        tag: 'discussion',
        title: '비용 대비 효과 분석',
        script: '멀티 Agent는 비용이 더 듭니다. Agent가 3개면 LLM 호출도 3배가 되니까요. 재시도까지 하면 더 늘어나고요. 제 경험상, 복잡한 질문이 전체의 20% 이상이면 멀티 Agent가 가치 있습니다. 위 수치는 예시이며, 실제 비용은 모델과 호출 빈도에 따라 달라집니다.',
        table: {
          headers: ['항목', '단일 Agent (Part 6)', '멀티 Agent (Part 10)', '차이'],
          rows: [
            {
              cells: [
                { text: 'LLM 호출 횟수', bold: true },
                { text: '1회' },
                { text: '3-5회 (재시도 포함)' },
                { text: '3-5배' }
              ]
            },
            {
              cells: [
                { text: '응답 시간', bold: true },
                { text: '1-2초' },
                { text: '3-8초' },
                { text: '3-4배' }
              ]
            },
            {
              cells: [
                { text: '비용 (gpt-4o 기준)', bold: true },
                { text: '$0.01/질문' },
                { text: '$0.03-0.05/질문' },
                { text: '3-5배' }
              ]
            },
            {
              cells: [
                { text: '복잡한 질문 정확도', bold: true },
                { text: '35%', status: 'fail' },
                { text: '75%', status: 'pass' },
                { text: '+40%p 개선' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '위 수치는 예시입니다. 복잡한 질문이 많은 도메인(제조, 법률, 의료)이라면 비용을 들여도 멀티 Agent가 가치 있습니다.'
        }
      },
      {
        id: '10-24',
        tag: 'theory',
        title: 'Part 10 핵심 정리 — 7가지 포인트',
        script: 'Part 10에서 배운 걸 정리하겠습니다. 첫째, 단일 Agent는 한계가 있습니다. 복잡한 제조 도메인 질문은 못 푸는 게 당연합니다. 둘째, ReAct 패러다임으로 Thought-Action-Observation 사이클을 반복합니다. 셋째, Part 9의 알고리즘(커뮤니티, PageRank, 경로)을 5개 Tool로 변환했습니다. 넷째, Supervisor가 질문을 SIMPLE/MULTI_HOP/GLOBAL/PATH로 분류해서 최적 Tool을 선택합니다. 다섯째, LangGraph StateGraph로 Explorer-Reasoner-Validator를 구축하고, retry_count로 재시도를 제한합니다. 여섯째, Hallucination은 반드시 KG 기반으로 검증합니다. 일곱째, Part 7의 RAGAS로 정확도를 측정합니다.',
        diagram: {
          nodes: [
            { text: '1. 단일 Agent 한계 인지', type: 'entity' },
            { text: '2. ReAct 패러다임', type: 'entity' },
            { text: 'Thought-Action-Observation', type: 'dim' },
            { text: '3. 5개 Tool (Part 9 통합)', type: 'entity' },
            { text: 'Schema+Cypher+Path+Community+PPR', type: 'dim' },
            { text: '4. Supervisor 질문 분류', type: 'entity' },
            { text: 'SIMPLE/MULTI_HOP/GLOBAL/PATH', type: 'dim' },
            { text: '5. LangGraph + retry 제한', type: 'entity' },
            { text: 'Explorer-Reasoner-Validator-Fallback', type: 'dim' },
            { text: '6. KG Hallucination 검증', type: 'entity' },
            { text: '7. RAGAS 벤치마크', type: 'entity' }
          ]
        },
        callout: {
          type: 'key',
          text: 'Part 10 핵심: Part 9의 알고리즘을 Agent Tool로 변환 -> Supervisor가 자율 선택 -> 검증 + 재시도 제한 -> RAGAS 측정.'
        }
      },
      {
        id: '10-25',
        tag: 'discussion',
        title: 'Part 10 아키텍처 총정리',
        script: 'Part 10의 전체 아키텍처를 한눈에 봅시다. Part 6의 Text2Cypher에서 시작해서, Part 9의 알고리즘(Leiden, PageRank, 경로)을 통합하고, Part 10에서 이를 자율 에이전트로 만들었습니다. 각 Part의 성과가 쌓여서 하나의 시스템이 됩니다.',
        table: {
          headers: ['계층', '구성 요소', '출처'],
          rows: [
            {
              cells: [
                { text: 'Agent 프레임워크', bold: true },
                { text: 'LangGraph StateGraph + Supervisor 패턴' },
                { text: 'Part 10', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '5 Tools', bold: true },
                { text: 'Schema, Cypher, Path, Community, Algorithm' },
                { text: 'Part 6 + Part 9', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '알고리즘', bold: true },
                { text: 'Leiden, PageRank, PPR, 경로 탐색' },
                { text: 'Part 9', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '파이프라인', bold: true },
                { text: 'RRF 융합 + PageRank 리랭킹' },
                { text: 'Part 6 + Part 9', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '품질 평가', bold: true },
                { text: 'RAGAS (faithfulness, relevancy)' },
                { text: 'Part 7', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '검증', bold: true },
                { text: 'Hallucination 감지 + retry 제한' },
                { text: 'Part 10', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'Agentic GraphRAG = Part 6(검색) + Part 7(평가) + Part 9(알고리즘) + Part 10(자율 에이전트). 커리큘럼이 하나로 통합됩니다.'
        }
      },
      {
        id: '10-26',
        tag: 'discussion',
        title: 'Part 11 예고 — 디버깅 & 비용 최적화',
        script: 'Part 10의 멀티에이전트는 LLM 호출이 3-5배입니다. Part 11에서 비용을 1/3로 줄이고, "왜 이상한 답이 나오는지" 디버깅하는 방법을 다룹니다. Agent의 Thought-Action-Observation 로그를 추적하고, 어디서 비용이 폭발하는지 식별하고, 캐싱/배치 전략으로 최적화합니다.',
        diagram: {
          nodes: [
            { text: 'Part 10: 멀티에이전트', type: 'entity' },
            { text: 'LLM 호출 3-5배', type: 'fail' },
            { text: '→', type: 'relation' },
            { text: 'Part 11: 디버깅 & 최적화', type: 'entity' },
            { text: '비용 1/3 절감 + 추적 파이프라인', type: 'dim' }
          ]
        },
        callout: {
          type: 'tip',
          text: 'Part 11 키워드: Agent 로그 추적 + 비용 폭발 구간 식별 + 캐싱/배치 전략. Part 10의 멀티에이전트를 프로덕션에 넣으려면 필수입니다.'
        }
      }
    ]
  }
];
