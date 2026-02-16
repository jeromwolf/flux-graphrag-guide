import type { SectionContent } from './part1-content';

export const part10Content: SectionContent[] = [
  // Section 1: Agentic RAG 개념 (20min)
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '10-1',
        tag: 'theory',
        title: '단일 Agent의 한계 — Part 6에서 느꼈던 것',
        script: 'Part 6에서 우리는 Text2Cypher Agent를 만들었죠. 사용자 질문을 받아서 Cypher 쿼리를 생성하고, Neo4j에서 실행해서 답을 주는. 근데 이거 한계가 뭔지 아세요? "한 번에 하나의 동작만 한다"는 겁니다. 질문이 복잡하면? 예를 들어 "A와 B의 관계를 먼저 찾고, 그 다음에 C와의 경로를 탐색해서, 최종적으로 통계를 내줘" 이런 질문이 오면? 단일 Agent로는 답이 안 나옵니다.',
        diagram: {
          nodes: [
            { text: '👤 사용자 질문', type: 'entity' },
            { text: '→', type: 'relation' },
            { text: '🤖 Text2Cypher Agent', type: 'entity' },
            { text: '→', type: 'relation' },
            { text: '📊 결과 반환', type: 'entity' },
            { text: '❌ 복잡한 질문은?', type: 'fail' },
            { text: '다단계 추론 불가', type: 'dim' }
          ]
        },
        callout: {
          type: 'warn',
          text: '단일 Agent는 one-shot execution만 가능합니다. 추론을 반복하거나 중간 결과를 검증할 수 없습니다.'
        }
      },
      {
        id: '10-2',
        tag: 'theory',
        title: 'ReAct 패러다임 — Reasoning + Acting',
        script: '그래서 나온 게 ReAct 패러다임입니다. Reasoning + Acting. 생각하고(Thought), 행동하고(Action), 관찰하고(Observation), 다시 생각하고... 이걸 반복하는 겁니다. 예를 들어볼게요. "삼성전자에 투자한 기관 중 가장 큰 곳은?" → Thought: "먼저 스키마를 봐야겠다" → Action: GET_SCHEMA → Observation: "INVESTED_IN 관계가 있네" → Thought: "그럼 Cypher 쿼리를 만들자" → Action: GENERATE_CYPHER → Observation: "결과가 나왔다" → Thought: "답을 줄 수 있겠다". 이렇게 여러 단계를 거치는 거죠.',
        diagram: {
          nodes: [
            { text: '💭 Thought', type: 'entity' },
            { text: '무엇을 해야 할까?', type: 'dim' },
            { text: '⚡ Action', type: 'entity' },
            { text: 'Tool 실행', type: 'dim' },
            { text: '👀 Observation', type: 'entity' },
            { text: '결과 확인', type: 'dim' },
            { text: '🔄 다시 Thought', type: 'relation' },
            { text: '반복...', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: 'ReAct = Thought → Action → Observation 사이클을 반복해서 복잡한 질문을 단계별로 해결합니다.'
        }
      },
      {
        id: '10-3',
        tag: 'theory',
        title: 'Supervisor vs Peer 패턴',
        script: '멀티 Agent 구조는 크게 두 가지 패턴이 있습니다. Supervisor 패턴과 Peer 패턴. Supervisor는 조율자가 있는 거죠. "너는 스키마 조회해", "너는 Cypher 생성해", "너는 결과 검증해" 이렇게 작업을 배분하는 겁니다. Peer 패턴은 Agent들이 동등하게 토론하면서 합의하는 거고요. 우리는 Supervisor 패턴으로 갑니다. 왜냐하면 GraphRAG는 "탐색 → 추론 → 검증"처럼 단계가 명확하거든요.',
        table: {
          headers: ['패턴', '구조', '장점', '단점', '적합한 시나리오'],
          rows: [
            {
              cells: [
                { text: 'Supervisor', bold: true },
                { text: '중앙 조율자 + 전문 Agent들' },
                { text: '명확한 작업 분배, 추적 용이' },
                { text: 'Supervisor가 병목' },
                { text: '단계가 명확한 작업 (GraphRAG ✅)' }
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
          text: '우리는 Supervisor 패턴으로 Explorer(스키마 조회) → Reasoner(Cypher 생성) → Validator(검증)를 구축합니다.'
        }
      }
    ]
  },

  // Section 2: Graph Tools 설계 (20min)
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '10-4',
        tag: 'theory',
        title: '그래프용 Tool 3종 세트',
        script: 'Agent가 그래프를 다루려면 Tool이 필요합니다. 우리는 3가지 Tool을 만들 겁니다. 첫째, **Schema Tool**: Neo4j 스키마를 조회하는 Tool. 어떤 노드 Label이 있고, 어떤 관계가 있는지 알려줍니다. 둘째, **Cypher Tool**: Cypher 쿼리를 생성하고 실행하는 Tool. 질문을 받아서 Cypher로 변환하고, Neo4j에서 실행한 결과를 반환합니다. 셋째, **Path Tool**: 두 노드 사이의 경로를 탐색하는 Tool. "A와 B를 연결하는 최단 경로는?" 같은 질문에 답합니다.',
        diagram: {
          nodes: [
            { text: '🔍 Schema Tool', type: 'entity' },
            { text: 'Label, Relationship 조회', type: 'dim' },
            { text: '⚙️ Cypher Tool', type: 'entity' },
            { text: 'Cypher 생성 + 실행', type: 'dim' },
            { text: '🛤️ Path Tool', type: 'entity' },
            { text: '경로 탐색 (shortest path)', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: '3종 세트만 있으면 대부분의 GraphRAG 질문을 처리할 수 있습니다.'
        }
      },
      {
        id: '10-5',
        tag: 'practice',
        title: 'Tool 정의 실습',
        script: 'LangChain에서 Tool을 만들 때는 @tool 데코레이터를 씁니다. 각 Tool은 함수로 정의하고, docstring으로 설명을 달아주면 LLM이 언제 이 Tool을 써야 할지 판단합니다.',
        code: {
          language: 'python',
          code: `from langchain.tools import tool
from neo4j import GraphDatabase

# 1️⃣ Schema Tool
@tool
def get_graph_schema() -> str:
    """Neo4j 그래프의 스키마를 조회합니다.
    노드 Label과 Relationship 타입을 반환합니다."""
    with driver.session() as session:
        labels = session.run("CALL db.labels()").data()
        rels = session.run("CALL db.relationshipTypes()").data()
    return f"Labels: {labels}\\nRelationships: {rels}"

# 2️⃣ Cypher Tool
@tool
def execute_cypher(query: str) -> list:
    """Cypher 쿼리를 Neo4j에서 실행하고 결과를 반환합니다.

    Args:
        query: 실행할 Cypher 쿼리 (예: MATCH (n:Company) RETURN n.name)
    """
    with driver.session() as session:
        result = session.run(query).data()
    return result

# 3️⃣ Path Tool
@tool
def find_shortest_path(start: str, end: str) -> dict:
    """두 노드 사이의 최단 경로를 찾습니다.

    Args:
        start: 시작 노드 이름
        end: 끝 노드 이름
    """
    query = """
    MATCH (a {name: $start}), (b {name: $end})
    MATCH path = shortestPath((a)-[*]-(b))
    RETURN path
    """
    with driver.session() as session:
        result = session.run(query, start=start, end=end).data()
    return result`
        },
        callout: {
          type: 'tip',
          text: 'Tool의 docstring이 중요합니다. LLM은 이 설명을 읽고 어떤 Tool을 언제 사용할지 판단합니다.'
        }
      },
      {
        id: '10-6',
        tag: 'theory',
        title: 'Tool 라우팅 전략',
        script: 'Agent가 질문을 받으면 어떤 Tool을 써야 할까요? 이걸 라우팅이라고 합니다. 예를 들어볼게요. "삼성전자와 관련된 모든 투자자는?" → 이건 단순 쿼리니까 Cypher Tool 바로 사용. "삼성전자와 SK하이닉스를 연결하는 경로는?" → 이건 Path Tool 사용. "이 그래프에는 어떤 노드 타입이 있어?" → 이건 Schema Tool 사용. Supervisor Agent가 질문 유형을 분류해서 적절한 Tool을 선택하는 겁니다.',
        diagram: {
          nodes: [
            { text: '👤 질문', type: 'entity' },
            { text: '→', type: 'relation' },
            { text: '🧠 Supervisor', type: 'entity' },
            { text: '질문 유형 분류', type: 'dim' },
            { text: '단순 쿼리?', type: 'relation' },
            { text: '→ Cypher Tool', type: 'entity' },
            { text: '경로 탐색?', type: 'relation' },
            { text: '→ Path Tool', type: 'entity' },
            { text: '스키마 확인?', type: 'relation' },
            { text: '→ Schema Tool', type: 'entity' }
          ]
        },
        callout: {
          type: 'tip',
          text: 'Tool 선택을 LLM에게 맡기면 됩니다. Tool docstring만 잘 작성하면 LLM이 알아서 적절한 Tool을 고릅니다.'
        }
      }
    ]
  },

  // Section 3: LangGraph 멀티에이전트 (40min)
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '10-7',
        tag: 'practice',
        title: 'LangGraph StateGraph 설계',
        script: 'LangGraph는 Agent 흐름을 그래프로 표현하는 라이브러리입니다. StateGraph를 만들고, 노드(Agent)와 엣지(연결)를 정의합니다. 먼저 State를 정의하고, 각 노드가 State를 읽고 쓰도록 합니다.',
        code: {
          language: 'python',
          code: `from langgraph.graph import StateGraph, END
from typing import TypedDict, List

# 1️⃣ State 정의
class AgentState(TypedDict):
    query: str              # 사용자 질문
    schema: str             # 조회된 스키마
    cypher: str             # 생성된 Cypher
    result: List[dict]      # 실행 결과
    is_valid: bool          # 검증 통과 여부
    final_answer: str       # 최종 답변

# 2️⃣ Graph 생성
workflow = StateGraph(AgentState)

# 3️⃣ 노드 추가
workflow.add_node("explorer", explorer_node)
workflow.add_node("reasoner", reasoner_node)
workflow.add_node("validator", validator_node)

# 4️⃣ 엣지 연결
workflow.add_edge("explorer", "reasoner")
workflow.add_edge("reasoner", "validator")
workflow.add_conditional_edges(
    "validator",
    lambda state: "reasoner" if not state["is_valid"] else END
)

# 5️⃣ 시작점 설정
workflow.set_entry_point("explorer")`
        },
        diagram: {
          nodes: [
            { text: 'START', type: 'entity' },
            { text: '→', type: 'relation' },
            { text: '🔍 Explorer', type: 'entity' },
            { text: '스키마 조회', type: 'dim' },
            { text: '→', type: 'relation' },
            { text: '🧠 Reasoner', type: 'entity' },
            { text: 'Cypher 생성', type: 'dim' },
            { text: '→', type: 'relation' },
            { text: '✅ Validator', type: 'entity' },
            { text: '검증', type: 'dim' },
            { text: 'Valid?', type: 'relation' },
            { text: '→ END', type: 'entity' },
            { text: '❌ → Reasoner', type: 'fail' }
          ]
        }
      },
      {
        id: '10-8',
        tag: 'practice',
        title: 'Explorer + Reasoner + Validator 구축',
        script: '이제 각 노드의 실제 구현을 봅시다. Explorer는 스키마를 조회하고, Reasoner는 Cypher를 생성하고, Validator는 결과를 검증합니다.',
        code: {
          language: 'python',
          code: `from langchain.chat_models import ChatOpenAI

llm = ChatOpenAI(model="gpt-4", temperature=0)

# 1️⃣ Explorer Node
def explorer_node(state: AgentState) -> AgentState:
    """스키마를 조회해서 State에 저장"""
    schema = get_graph_schema()  # Tool 호출
    state["schema"] = schema
    return state

# 2️⃣ Reasoner Node
def reasoner_node(state: AgentState) -> AgentState:
    """질문 + 스키마를 받아서 Cypher 생성"""
    prompt = f"""
    Graph Schema:
    {state['schema']}

    User Question: {state['query']}

    Generate a Cypher query to answer this question.
    """
    response = llm.invoke(prompt)
    state["cypher"] = response.content

    # Cypher 실행
    result = execute_cypher(state["cypher"])  # Tool 호출
    state["result"] = result
    return state

# 3️⃣ Validator Node
def validator_node(state: AgentState) -> AgentState:
    """결과를 검증하고, 실패 시 재시도"""
    if not state["result"]:
        state["is_valid"] = False
        state["final_answer"] = "재시도 필요"
    else:
        state["is_valid"] = True
        state["final_answer"] = f"결과: {state['result']}"
    return state`
        }
      },
      {
        id: '10-9',
        tag: 'practice',
        title: 'Supervisor 조율 로직',
        script: 'Supervisor는 Agent들 사이에서 작업을 조율합니다. 여기서는 간단하게 Validator가 실패하면 Reasoner로 돌아가도록 했습니다.',
        code: {
          language: 'python',
          code: `# Graph 컴파일
app = workflow.compile()

# 실행
initial_state = {
    "query": "삼성전자에 투자한 기관 중 가장 큰 곳은?",
    "schema": "",
    "cypher": "",
    "result": [],
    "is_valid": False,
    "final_answer": ""
}

# Run
final_state = app.invoke(initial_state)

print(final_state["final_answer"])

# 출력 예시:
# 결과: [{"name": "국민연금", "amount": 8.7}]`
        },
        callout: {
          type: 'key',
          text: 'LangGraph의 핵심은 State를 중심으로 Agent들이 협업한다는 겁니다. 각 Agent는 State를 읽고 쓰면서 작업을 이어갑니다.'
        }
      }
    ]
  },

  // Section 4: 자기 수정 파이프라인 (20min)
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '10-10',
        tag: 'practice',
        title: '실패 감지 → 재시도 → 대안 경로',
        script: 'Agent가 실패할 수 있습니다. Cypher 쿼리가 잘못됐거나, 결과가 비어있거나. 이럴 때 자동으로 재시도하도록 만들 수 있습니다.',
        code: {
          language: 'python',
          code: `def validator_node_with_retry(state: AgentState) -> AgentState:
    """결과 검증 + 실패 시 에러 메시지 추가"""
    if not state["result"]:
        state["is_valid"] = False
        state["error"] = "쿼리 결과가 비어있습니다. Cypher를 수정하세요."
    elif "error" in state["result"][0]:
        state["is_valid"] = False
        state["error"] = f"Cypher 실행 에러: {state['result'][0]['error']}"
    else:
        state["is_valid"] = True
        state["final_answer"] = f"결과: {state['result']}"
    return state

def reasoner_node_with_feedback(state: AgentState) -> AgentState:
    """이전 에러를 참고해서 Cypher 재생성"""
    if "error" in state:
        prompt = f"""
        Previous Cypher failed with error: {state['error']}

        Schema: {state['schema']}
        Question: {state['query']}

        Generate a corrected Cypher query.
        """
    else:
        prompt = f"Schema: {state['schema']}\\nQuestion: {state['query']}"

    response = llm.invoke(prompt)
    state["cypher"] = response.content
    result = execute_cypher(state["cypher"])
    state["result"] = result
    return state`
        },
        callout: {
          type: 'tip',
          text: '에러 메시지를 State에 저장하고, 다음 Agent가 이를 참고하도록 하면 자기 수정이 가능합니다.'
        }
      },
      {
        id: '10-11',
        tag: 'theory',
        title: 'Hallucination 감지 + KG 기반 검증',
        script: 'LLM이 답을 만들어낼 때, Knowledge Graph에 없는 정보를 지어낼 수 있습니다. 이걸 Hallucination이라고 하죠. 이걸 감지하려면 "답변에 나온 엔티티가 실제로 그래프에 있는가?"를 확인하면 됩니다.',
        code: {
          language: 'python',
          code: `def validate_against_kg(answer: str, state: AgentState) -> bool:
    """답변에 나온 엔티티가 실제로 KG에 존재하는지 검증"""
    # 1. 답변에서 엔티티 추출 (간단한 예시)
    mentioned_entities = extract_entities(answer)

    # 2. KG에서 각 엔티티 존재 여부 확인
    for entity in mentioned_entities:
        query = f"MATCH (n {{name: '{entity}'}}) RETURN n"
        result = execute_cypher(query)
        if not result:
            return False  # KG에 없는 엔티티 발견

    return True  # 모든 엔티티가 KG에 존재

# Validator에 추가
def validator_node_with_hallucination_check(state: AgentState) -> AgentState:
    if not validate_against_kg(state["final_answer"], state):
        state["is_valid"] = False
        state["error"] = "Hallucination 감지: KG에 없는 정보가 포함됨"
    else:
        state["is_valid"] = True
    return state`
        },
        callout: {
          type: 'warn',
          text: 'Hallucination 검증은 필수입니다. 특히 금융, 의료 등 정확도가 중요한 도메인에서는 반드시 KG 기반 검증을 추가하세요.'
        }
      },
      {
        id: '10-12',
        tag: 'demo',
        title: '자기 수정 파이프라인 전체 흐름',
        script: '이제 전체 흐름을 봅시다. 질문이 들어오면 Explorer → Reasoner → Validator 순으로 진행하고, Validator가 실패하면 다시 Reasoner로 돌아가서 수정된 Cypher를 생성합니다. 최대 3번까지 재시도하고, 그래도 안 되면 "답변 불가"를 반환합니다.',
        diagram: {
          nodes: [
            { text: 'START: 질문', type: 'entity' },
            { text: '→', type: 'relation' },
            { text: '🔍 Explorer', type: 'entity' },
            { text: 'Schema 조회', type: 'dim' },
            { text: '→', type: 'relation' },
            { text: '🧠 Reasoner', type: 'entity' },
            { text: 'Cypher 생성 + 실행', type: 'dim' },
            { text: '→', type: 'relation' },
            { text: '✅ Validator', type: 'entity' },
            { text: '검증', type: 'dim' },
            { text: 'Valid?', type: 'relation' },
            { text: '✅ → 답변 반환', type: 'entity' },
            { text: '❌ → 재시도 (max 3회)', type: 'fail' },
            { text: '→ Reasoner', type: 'relation' },
            { text: '3회 실패 → 답변 불가', type: 'fail' }
          ]
        },
        callout: {
          type: 'key',
          text: '자기 수정 파이프라인은 실패를 인정하고, 재시도하고, 그래도 안 되면 포기하는 구조입니다. 무한 루프를 방지하세요.'
        }
      }
    ]
  },

  // Section 5: 벤치마크 + 비교 (20min)
  {
    sectionId: 'sec5',
    slides: [
      {
        id: '10-13',
        tag: 'discussion',
        title: '단일 Agent vs 멀티 Agent 정확도 비교',
        script: 'Part 6에서 만든 단일 Text2Cypher Agent와 Part 10의 멀티 Agent를 비교해봅시다. 단순 질문은 거의 비슷합니다. 하지만 복잡한 Multi-hop 질문에서는 멀티 Agent가 훨씬 낫습니다. 왜냐하면 자기 수정이 가능하거든요.',
        table: {
          headers: ['질문 유형', '단일 Agent 정확도', '멀티 Agent 정확도', '비고'],
          rows: [
            {
              cells: [
                { text: '단순 쿼리', bold: true },
                { text: '85%', status: 'pass' },
                { text: '87%', status: 'pass' },
                { text: '거의 차이 없음' }
              ]
            },
            {
              cells: [
                { text: '2-hop 질문', bold: true },
                { text: '60%', status: 'warn' },
                { text: '78%', status: 'pass' },
                { text: '멀티 Agent가 재시도로 개선' }
              ]
            },
            {
              cells: [
                { text: '3-hop 이상', bold: true },
                { text: '35%', status: 'fail' },
                { text: '65%', status: 'warn' },
                { text: '복잡한 질문은 멀티 Agent 필수' }
              ]
            },
            {
              cells: [
                { text: 'Hallucination 감지', bold: true },
                { text: '❌ 없음', status: 'fail' },
                { text: '✅ KG 검증', status: 'pass' },
                { text: '멀티 Agent만 가능' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '멀티 Agent의 가장 큰 장점은 "자기 수정"입니다. 한 번 실패해도 다시 시도할 수 있습니다.'
        }
      },
      {
        id: '10-14',
        tag: 'discussion',
        title: '비용 대비 효과 분석',
        script: '그런데 멀티 Agent는 비용이 더 듭니다. Agent가 3개면 LLM 호출도 3배가 되니까요. 재시도까지 하면 더 늘어나고요. 그럼 그만큼 가치가 있을까요? 제 경험상, **복잡한 질문이 전체의 20% 이상이면** 멀티 Agent가 가치 있습니다. 단순 질문만 80% 이상이면 단일 Agent로 충분하고요.',
        table: {
          headers: ['항목', '단일 Agent', '멀티 Agent', '차이'],
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
                { text: '3-6초' },
                { text: '3배' }
              ]
            },
            {
              cells: [
                { text: '비용 (GPT-4 기준)', bold: true },
                { text: '$0.01/질문' },
                { text: '$0.03-0.05/질문' },
                { text: '3-5배' }
              ]
            },
            {
              cells: [
                { text: '복잡한 질문 정확도', bold: true },
                { text: '35%', status: 'fail' },
                { text: '65%', status: 'warn' },
                { text: '+30%p 개선' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '복잡한 질문이 많은 도메인(금융, 법률, 의료)이라면 비용을 들여도 멀티 Agent가 가치 있습니다.'
        }
      },
      {
        id: '10-15',
        tag: 'theory',
        title: 'Part 10 핵심 정리',
        script: 'Part 10에서 배운 걸 정리하겠습니다. 첫째, 단일 Agent는 한계가 있습니다. 복잡한 질문은 못 푸는 게 당연합니다. 둘째, ReAct 패러다임으로 Thought-Action-Observation 사이클을 반복하면 복잡한 질문을 단계별로 해결할 수 있습니다. 셋째, LangGraph StateGraph로 멀티 Agent를 구축하고, Supervisor가 조율하게 만듭니다. 넷째, 자기 수정 파이프라인으로 실패를 감지하고 재시도합니다. 다섯째, Hallucination은 반드시 KG 기반으로 검증하세요. 마지막으로, 비용 대비 효과를 따져보고 멀티 Agent를 도입하세요.',
        diagram: {
          nodes: [
            { text: '1️⃣ 단일 Agent 한계 인지', type: 'entity' },
            { text: '2️⃣ ReAct 패러다임', type: 'entity' },
            { text: 'Thought-Action-Observation', type: 'dim' },
            { text: '3️⃣ LangGraph 멀티 Agent', type: 'entity' },
            { text: 'Explorer-Reasoner-Validator', type: 'dim' },
            { text: '4️⃣ 자기 수정 파이프라인', type: 'entity' },
            { text: '실패 감지 → 재시도', type: 'dim' },
            { text: '5️⃣ Hallucination 검증', type: 'entity' },
            { text: 'KG 기반 검증 필수', type: 'dim' },
            { text: '6️⃣ 비용 대비 효과 분석', type: 'entity' },
            { text: '복잡한 질문 20% 이상이면 도입', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: '자율 시스템의 핵심은 검증입니다. Agent가 스스로 판단할 수 있지만, 반드시 검증 메커니즘이 있어야 합니다.'
        }
      }
    ]
  }
];
