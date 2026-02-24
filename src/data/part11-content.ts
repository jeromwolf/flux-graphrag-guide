import type { SectionContent } from './part1-content';

export const part11Content: SectionContent[] = [
  // Section 1: Part 10 리캡 + 실패 유형 분류 (20min) — 5 slides
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '11-1',
        tag: 'discussion',
        title: 'Part 10 리캡 — 멀티에이전트의 디버깅 필요성',
        script: 'Part 10에서 5개 Tool + Supervisor + retry 시스템을 만들었습니다. LLM 호출이 3-5배로 늘어났죠. 이제 두 가지 문제를 풀어야 합니다. 첫째, "왜 이상한 답이 나오는지" -- Agent의 Thought-Action-Observation 로그를 추적해야 합니다. 둘째, "비용이 왜 이렇게 나오는지" -- 5개 Tool별 비용 분석 + 최적화가 필요합니다. Part 10의 멀티에이전트를 프로덕션에 넣으려면, 이 Part가 필수입니다.',
        diagram: {
          nodes: [
            { text: 'Part 10: 5개 Tool + Supervisor', type: 'entity' },
            { text: 'LLM 호출 3-5배 증가', type: 'fail' },
            { text: '문제 1: 왜 이상한 답?', type: 'entity' },
            { text: 'Agent 로그 추적', type: 'dim' },
            { text: '문제 2: 왜 비용 폭발?', type: 'entity' },
            { text: 'Tool별 비용 분석', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: 'Part 10의 멀티에이전트를 프로덕션에 넣으려면, 디버깅(Part 11 전반) + 비용 최적화(Part 11 후반)가 필수입니다.'
        }
      },
      {
        id: '11-2',
        tag: 'theory',
        title: '세 가지 실패 유형',
        script: 'GraphRAG가 이상한 답을 내놓는 이유는 크게 세 가지입니다. Retrieval 실패 -- 필요한 노드를 못 찾음. Generation 실패 -- 노드는 찾았는데 답이 이상함. Schema 실패 -- Cypher 쿼리가 틀렸거나 실행 불가. Part 10의 멀티에이전트에서는 Explorer가 Retrieval, Reasoner가 Generation, 그리고 Cypher 생성 과정이 Schema와 관련됩니다. 이 세 가지를 구분하지 못하면 디버깅 시간이 10배 걸립니다.',
        diagram: {
          nodes: [
            { text: 'Retrieval 실패', type: 'fail' },
            { text: 'Explorer가 관련 노드를 못 찾음', type: 'dim' },
            { text: 'Generation 실패', type: 'fail' },
            { text: 'Reasoner가 답을 이상하게 생성', type: 'dim' },
            { text: 'Schema 실패', type: 'fail' },
            { text: 'Cypher 쿼리가 틀림', type: 'dim' }
          ]
        }
      },
      {
        id: '11-3',
        tag: 'theory',
        title: '실패 유형별 디버깅 진입점',
        script: '각 실패 유형마다 확인할 곳이 다릅니다. Part 10의 Agent 구조에 맞춰서 정리하면 이렇습니다. Retrieval 실패는 Explorer 노드의 스키마 조회와 벡터 검색 결과를 확인합니다. Generation 실패는 Reasoner 노드의 LLM 프롬프트와 컨텍스트를 확인합니다. Schema 실패는 Cypher 생성 단계의 쿼리와 스키마 정의를 확인합니다. 이 표를 머릿속에 넣어두세요.',
        table: {
          headers: ['유형', '증상', '확인할 곳 (Part 10 노드)', '해결 방법'],
          rows: [
            {
              cells: [
                { text: 'Retrieval 실패', bold: true },
                { text: '결과가 빈 배열 []' },
                { text: 'Explorer 노드: 스키마 조회, 벡터 검색' },
                { text: '온톨로지 재검증, 엔티티 정규화' }
              ]
            },
            {
              cells: [
                { text: 'Generation 실패', bold: true },
                { text: '답이 질문과 무관' },
                { text: 'Reasoner 노드: LLM 프롬프트, 컨텍스트' },
                { text: '프롬프트 개선, 컨텍스트 요약' }
              ]
            },
            {
              cells: [
                { text: 'Schema 실패', bold: true },
                { text: 'Cypher 문법 에러' },
                { text: 'Cypher Tool: 생성된 쿼리, 스키마 정의' },
                { text: 'Few-shot 예시 추가, 스키마 단순화' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '실패 유형을 3초 안에 구분하는 것이 디버깅의 핵심입니다. Part 10의 LangGraph 노드별로 진입점이 다릅니다.'
        }
      },
      {
        id: '11-4',
        tag: 'practice',
        title: '제조 도메인 실패 사례 5가지 (1/2)',
        script: '현업에서 자주 발생하는 실패 패턴을 제조 도메인 코드로 직접 보겠습니다. 첫째, 엔티티 이름 불일치 -- LLM이 한글을 영어로 바꿔버리는 케이스. 둘째, 관계 방향 반대 -- CAUSED_BY를 CAUSES로 착각하는 케이스. 셋째, 프로퍼티 타입 불일치 -- 날짜를 문자열로 비교하는 케이스.',
        code: {
          language: 'python',
          code: `# langchain >= 0.2.0, langchain-openai >= 0.1.0, langgraph >= 0.2.0

# 실패 사례 1: 엔티티 이름 불일치
# 질문: "접착 박리의 원인 공정은?"
# ❌ LLM이 생성한 잘못된 Cypher
# MATCH (d:Defect {name: 'adhesion_peeling'})-[:CAUSED_BY]->(p:Process)
# RETURN p.name
# → 결과: [] (노드를 못 찾음)

# ✅ 올바른 Cypher — 한글 원문 사용 + 파라미터 바인딩
# MATCH (d:Defect {name: $defect_name})-[:CAUSED_BY]->(p:Process)
# RETURN p.name
# 파라미터: {defect_name: "접착 박리"}

# 실패 사례 2: 관계 방향 반대
# 질문: "접착기 A-3에서 발생한 결함은?"
# ❌ 방향이 반대
# MATCH (e:Equipment {name: $equip})-[:CAUSED_BY]->(d:Defect)
# RETURN d.name
# → 결과: [] (CAUSED_BY는 Defect→Process 방향)

# ✅ 올바른 Cypher — 관계 방향 확인
# MATCH (d:Defect)-[:OCCURRED_AT]->(e:Equipment {name: $equip})
# RETURN d.name
# 파라미터: {equip: "접착기 A-3"}

# 실패 사례 3: 프로퍼티 타입 불일치
# 질문: "2024년 1월 이후 정비된 설비는?"
# ❌ 날짜를 문자열로 비교
# MATCH (e:Equipment) WHERE e.last_maintenance > '2024-01-01'
# RETURN e.name
# → 문자열 비교로 잘못된 결과

# ✅ 올바른 Cypher — date() 함수 사용
# MATCH (e:Equipment)
# WHERE e.last_maintenance > date($since)
# RETURN e.name
# 파라미터: {since: "2024-01-01"}`
        },
        callout: {
          type: 'warn',
          text: '이 3가지 패턴만 체크해도 50% 이상의 Retrieval/Schema 실패를 예방할 수 있습니다. 반드시 파라미터 바인딩($name)을 사용하세요.'
        }
      },
      {
        id: '11-5',
        tag: 'practice',
        title: '제조 도메인 실패 사례 5가지 (2/2)',
        script: '넷째, Cypher 예약어 충돌 -- 노드 레이블이나 프로퍼티 이름이 Cypher 예약어와 겹치는 케이스. 다섯째, Multi-hop이 너무 깊어서 타임아웃 나는 케이스. 이 5가지 패턴만 체크해도 80%의 실패를 예방할 수 있습니다.',
        code: {
          language: 'python',
          code: `# 실패 사례 4: Cypher 예약어 충돌
# 질문: "Order 노드의 count는?"
# ❌ ORDER, COUNT는 Cypher 예약어
# MATCH (o:Order) RETURN o.count
# → SyntaxError

# ✅ 올바른 Cypher — 백틱으로 이스케이프
# MATCH (o:\`Order\`) RETURN o.\`count\`

# 실패 사례 5: Multi-hop 너무 깊음 (5-hop 이상)
# 질문: "접착 박리 → 원인 공정 → 사용 설비 → 정비 이력 → 정비 담당자 → 소속 팀?"
# ❌ 5-hop 이상은 탐색 공간 폭발
# MATCH (d:Defect {name: $name})-[:CAUSED_BY]->(p:Process)
#       -[:USES_EQUIPMENT]->(e:Equipment)
#       -[:MAINTAINED_BY]->(t:Technician)
#       -[:BELONGS_TO]->(team:Team)
#       -[:MANAGED_BY]->(m:Manager)
# RETURN m.name
# → 타임아웃 또는 메모리 초과

# ✅ 해결: 단계별 분리 + 중간 결과 캐싱
# Step 1: 원인 공정 찾기
# MATCH (d:Defect {name: $name})-[:CAUSED_BY]->(p:Process)
# RETURN p.name AS process_name

# Step 2: 설비 + 정비 담당자 (이전 결과 활용)
# MATCH (p:Process {name: $proc})-[:USES_EQUIPMENT]->(e:Equipment)
#       -[:MAINTAINED_BY]->(t:Technician)
# RETURN t.name, t.team
# 파라미터: {name: "접착 박리", proc: "접착 도포"}`
        },
        callout: {
          type: 'tip',
          text: '5가지 패턴 체크리스트: (1) 엔티티 이름 한글/영어 (2) 관계 방향 (3) 프로퍼티 타입 (4) 예약어 충돌 (5) Multi-hop 깊이. 이것만 기억하세요.'
        }
      }
    ]
  },

  // Section 2: 추적 파이프라인 — Part 10 LangGraph 디버깅 (25min) — 5 slides
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '11-6',
        tag: 'practice',
        title: 'LangSmith 셋업 — .env 패턴',
        script: 'LangSmith를 사용하면 Part 10에서 만든 LangGraph 멀티에이전트의 모든 단계를 추적할 수 있습니다. 먼저 셋업부터 합시다. API 키는 절대 코드에 하드코딩하지 마세요. .env 파일이나 환경변수로 설정하는 패턴을 씁니다.',
        code: {
          language: 'python',
          code: `# langchain >= 0.2.0, langchain-openai >= 0.1.0, langgraph >= 0.2.0
# pip install langsmith langchain-openai langgraph

import os
from dotenv import load_dotenv

# .env 파일에서 로드 (권장)
# .env 파일 내용:
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_API_KEY=lsv2_pt_xxxx
# LANGCHAIN_PROJECT=graphrag-agent-debug
# OPENAI_API_KEY=sk-xxxx

load_dotenv()

# 환경변수 확인 (하드코딩 금지)
assert os.getenv("LANGCHAIN_API_KEY"), "LANGCHAIN_API_KEY가 설정되지 않았습니다"
assert os.getenv("OPENAI_API_KEY"), "OPENAI_API_KEY가 설정되지 않았습니다"

# LangSmith 트레이싱 활성화
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = os.getenv(
    "LANGCHAIN_PROJECT", "graphrag-agent-debug"
)

from langchain_openai import ChatOpenAI

# Part 10에서 만든 LangGraph StateGraph와 함께 사용
# 모든 LLM 호출이 자동으로 LangSmith에 기록됨
llm = ChatOpenAI(model="gpt-4o", temperature=0)`
        },
        callout: {
          type: 'warn',
          text: 'API 키를 코드에 직접 넣지 마세요. .env 파일 또는 환경변수로 관리하고, .gitignore에 .env를 추가하세요.'
        }
      },
      {
        id: '11-7',
        tag: 'practice',
        title: 'Part 10 LangGraph 노드별 트레이싱',
        script: 'Part 10에서 만든 StateGraph의 각 노드 -- Explorer, Reasoner, Validator -- 에 LangSmith 콜백을 연결합니다. 이렇게 하면 각 노드가 언제 실행됐고, 어떤 입력을 받았고, 어떤 출력을 냈는지 전부 추적됩니다.',
        code: {
          language: 'python',
          code: `# langchain >= 0.2.0, langgraph >= 0.2.0
from langchain.callbacks import LangSmithCallbackHandler
from langgraph.graph import StateGraph, END
from typing import TypedDict, List

# LangSmith 콜백 핸들러
handler = LangSmithCallbackHandler(
    project_name="graphrag-agent-debug"
)

class AgentState(TypedDict):
    question: str
    schema_info: str
    cypher_query: str
    query_result: List[dict]
    answer: str
    retry_count: int

# Part 10에서 만든 각 노드에 콜백 전달
def explorer_node(state: AgentState, config: dict) -> AgentState:
    """Explorer: 스키마 조회 + 엔티티 탐색"""
    llm = ChatOpenAI(
        model="gpt-4o-mini",  # 스키마 조회는 경량 모델
        callbacks=[handler]
    )
    # ... Explorer 로직
    return {**state, "schema_info": schema_result}

def reasoner_node(state: AgentState, config: dict) -> AgentState:
    """Reasoner: Cypher 생성 + 실행"""
    llm = ChatOpenAI(
        model="gpt-4o",  # Cypher 생성은 고성능 모델
        callbacks=[handler]
    )
    # ... Reasoner 로직
    return {**state, "cypher_query": cypher, "query_result": result}

def validator_node(state: AgentState, config: dict) -> AgentState:
    """Validator: 결과 검증 + 답변 생성"""
    llm = ChatOpenAI(
        model="gpt-4o-mini",  # 검증은 경량 모델
        callbacks=[handler]
    )
    # ... Validator 로직
    return {**state, "answer": final_answer}

# StateGraph 구성
graph = StateGraph(AgentState)
graph.add_node("explorer", explorer_node)
graph.add_node("reasoner", reasoner_node)
graph.add_node("validator", validator_node)
graph.set_entry_point("explorer")
graph.add_edge("explorer", "reasoner")
graph.add_edge("reasoner", "validator")
graph.add_edge("validator", END)

app = graph.compile()`
        },
        callout: {
          type: 'key',
          text: 'LangSmith UI에서 Explorer → Reasoner → Validator 각 노드의 입력/출력, 실행 시간, 토큰 사용량을 한눈에 볼 수 있습니다.'
        }
      },
      {
        id: '11-8',
        tag: 'practice',
        title: '전 구간 트레이싱 — 제조 도메인 예시',
        script: 'LangSmith 대시보드에서 실패한 호출을 클릭하면 각 단계별로 뭐가 잘못됐는지 3분 안에 찾을 수 있습니다. 제조 도메인 예시로 직접 추적해봅시다.',
        code: {
          language: 'python',
          code: `# 제조 도메인 트레이싱 예시
# 질문: "접착 박리의 원인 설비는?"

result = app.invoke({
    "question": "접착 박리의 원인 설비는?",
    "schema_info": "",
    "cypher_query": "",
    "query_result": [],
    "answer": "",
    "retry_count": 0
})

# LangSmith에서 확인할 수 있는 정보:
# ─────────────────────────────────────
# [Explorer 노드]
#   Input:  "접착 박리의 원인 설비는?"
#   Action: Schema Tool 호출
#   Output: "Defect -[CAUSED_BY]-> Process -[USES_EQUIPMENT]-> Equipment"
#   Tokens: 입력 320, 출력 85
#   시간: 1.2초
#
# [Reasoner 노드]
#   Input:  스키마 + 질문
#   Action: Cypher 생성
#   Output: MATCH (d:Defect {name: $name})-[:CAUSED_BY]->(p:Process)
#                 -[:USES_EQUIPMENT]->(e:Equipment)
#           RETURN e.name
#           파라미터: {name: "접착 박리"}
#   ❌ 문제: 'adhesion_peel' 대신 '접착 박리' 원문 사용 필요
#   Tokens: 입력 580, 출력 120
#
# [Validator 노드]
#   Input:  쿼리 결과 []
#   Output: "정보가 없습니다"
#   ❌ 빈 컨텍스트로 답변 생성

# 해결: Few-shot 예시에 '접착 박리' 원문 사용 추가`
        },
        callout: {
          type: 'key',
          text: '각 노드의 입력/출력을 보면 정확히 어느 지점에서 잘못됐는지 바로 알 수 있습니다. 이 예시에서는 Reasoner의 엔티티 이름이 문제였습니다.'
        }
      },
      {
        id: '11-9',
        tag: 'practice',
        title: 'Explorer/Reasoner/Validator 각 노드별 실패 추적',
        script: 'Part 10의 세 노드 각각에서 발생할 수 있는 실패 패턴과 LangSmith에서 확인하는 방법을 정리합니다. Explorer는 스키마를 잘못 해석하는 경우, Reasoner는 Cypher를 잘못 생성하는 경우, Validator는 결과를 잘못 해석하는 경우입니다.',
        table: {
          headers: ['노드', '실패 패턴', 'LangSmith 확인 포인트', '해결 방법'],
          rows: [
            {
              cells: [
                { text: 'Explorer', bold: true },
                { text: '스키마에서 관련 노드/관계 누락' },
                { text: 'Schema Tool 출력에 필요한 레이블 있는지' },
                { text: '스키마 프루닝 범위 확대' }
              ]
            },
            {
              cells: [
                { text: 'Explorer', bold: true },
                { text: '벡터 검색 결과 무관한 노드' },
                { text: 'Vector Tool 출력의 유사도 점수' },
                { text: '임베딩 모델 교체, 청크 크기 조정' }
              ]
            },
            {
              cells: [
                { text: 'Reasoner', bold: true },
                { text: 'Cypher 문법 에러' },
                { text: 'Cypher Tool 에러 메시지' },
                { text: 'Few-shot 예시 추가, retry 로직' }
              ]
            },
            {
              cells: [
                { text: 'Reasoner', bold: true },
                { text: '엔티티 이름 불일치' },
                { text: '생성된 Cypher의 파라미터 값' },
                { text: '한글 원문 Few-shot, 정규화 함수' }
              ]
            },
            {
              cells: [
                { text: 'Validator', bold: true },
                { text: '빈 결과를 "정보 없음"으로 답변' },
                { text: 'Validator 입력의 query_result 필드' },
                { text: '빈 결과 시 폴백 전략(벡터 검색)' }
              ]
            },
            {
              cells: [
                { text: 'Validator', bold: true },
                { text: '결과를 환각으로 부풀림' },
                { text: 'Validator 출력 vs 실제 쿼리 결과 비교' },
                { text: 'Faithfulness 프롬프트 강화' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: 'LangSmith에서 각 노드를 클릭하면 입력/출력을 바로 비교할 수 있습니다. 실패한 run에 피드백 태그를 달아두면 패턴 분석이 쉬워집니다.'
        }
      },
      {
        id: '11-10',
        tag: 'practice',
        title: 'Tool별 비용 대시보드',
        script: 'Part 10의 5개 Tool이 각각 얼마나 비용을 쓰는지 실시간으로 추적하는 대시보드를 만들어봅시다. 이걸 만들어두면 어디서 비용이 터지는지 한눈에 보입니다.',
        code: {
          language: 'python',
          code: `# langchain >= 0.2.0, langchain-openai >= 0.1.0
from langchain_openai import ChatOpenAI
from langchain.callbacks import get_openai_callback
import json

# Part 10의 5개 Tool별 비용 추적기
tool_costs = {
    "schema_tool":    {"calls": 0, "input_tokens": 0, "output_tokens": 0, "cost": 0.0},
    "cypher_tool":    {"calls": 0, "input_tokens": 0, "output_tokens": 0, "cost": 0.0},
    "vector_tool":    {"calls": 0, "input_tokens": 0, "output_tokens": 0, "cost": 0.0},
    "community_tool": {"calls": 0, "input_tokens": 0, "output_tokens": 0, "cost": 0.0},
    "path_tool":      {"calls": 0, "input_tokens": 0, "output_tokens": 0, "cost": 0.0},
}

def track_tool_cost(tool_name: str, func):
    """Tool 실행을 감싸서 비용을 자동 추적"""
    def wrapper(*args, **kwargs):
        with get_openai_callback() as cb:
            result = func(*args, **kwargs)
        tool_costs[tool_name]["calls"] += 1
        tool_costs[tool_name]["input_tokens"] += cb.prompt_tokens
        tool_costs[tool_name]["output_tokens"] += cb.completion_tokens
        tool_costs[tool_name]["cost"] += cb.total_cost
        return result
    return wrapper

# 사용 예시
# schema_tool = track_tool_cost("schema_tool", original_schema_tool)
# cypher_tool = track_tool_cost("cypher_tool", original_cypher_tool)

def print_cost_dashboard():
    """비용 대시보드 출력"""
    print("=" * 60)
    print(f"{'Tool':<18} {'호출':<6} {'입력 토큰':<10} {'비용':<10}")
    print("-" * 60)
    total = 0.0
    for name, data in tool_costs.items():
        cost_str = "$" + f"{data['cost']:.4f}"
        print(f"{name:<18} {data['calls']:<6} "
              f"{data['input_tokens']:<10} "
              f"{cost_str}")
        total += data["cost"]
    print("-" * 60)
    total_str = "$" + f"{total:.4f}"
    print(f"{'합계':<18} {'':6} {'':10} {total_str}")
    print("=" * 60)`
        },
        callout: {
          type: 'tip',
          text: '이 대시보드를 10개 질문만 돌려봐도 어떤 Tool이 비용의 대부분을 차지하는지 바로 보입니다. 보통 cypher_tool과 community_tool이 70% 이상입니다.'
        }
      }
    ]
  },

  // Section 3: 비용 폭발 구간 식별 (20min) — 5 slides
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '11-11',
        tag: 'theory',
        title: '엔티티 추출 비용 — gpt-4o vs gpt-4o-mini',
        script: 'GraphRAG의 가장 큰 비용은 엔티티 추출 단계입니다. 문서를 LLM에 보내서 엔티티와 관계를 추출하는데, 문서가 길면 토큰이 기하급수적으로 늘어납니다. gpt-4o와 gpt-4o-mini의 가격 차이를 직접 비교해봅시다.',
        table: {
          headers: ['모델', '입력 (1M 토큰)', '출력 (1M 토큰)', '비고'],
          rows: [
            {
              cells: [
                { text: 'gpt-4o', bold: true },
                { text: '$2.50' },
                { text: '$10.00' },
                { text: '복잡한 추론 (Cypher 생성, 검증)' }
              ]
            },
            {
              cells: [
                { text: 'gpt-4o-mini', bold: true },
                { text: '$0.15' },
                { text: '$0.60' },
                { text: '단순 추출/분류 (스키마 조회, 엔티티 추출)', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: '가격은 2025년 기준입니다. 최신 가격은 OpenAI 공식 문서를 확인하세요. gpt-4o-mini는 gpt-4o 대비 입력 약 1/17, 출력 약 1/17 가격입니다.'
        }
      },
      {
        id: '11-12',
        tag: 'theory',
        title: 'Part 9 커뮤니티 요약 비용 — 실제 수치',
        script: 'Part 9에서 우리가 만든 Community Tool을 기억하세요. 커뮤니티 300개를 요약하면 gpt-4o로 약 $7.5, gpt-4o-mini로 약 $0.45. 우리의 직접 구현 방식 -- Cypher + 벡터 -- 은 커뮤니티 요약 없이도 작동하기 때문에 이 비용을 절감할 수 있습니다. MS GraphRAG 방식을 쓰면 이 비용이 필수적으로 발생한다는 점을 기억하세요.',
        diagram: {
          nodes: [
            { text: '1만 개 노드', type: 'entity' },
            { text: 'Leiden 알고리즘 (Part 9)', type: 'relation' },
            { text: '300개 커뮤니티', type: 'entity' },
            { text: 'LLM 요약 x 300', type: 'relation' },
            { text: 'gpt-4o: ~$7.5 / gpt-4o-mini: ~$0.45', type: 'fail' }
          ]
        },
        callout: {
          type: 'key',
          text: 'Part 9에서 구현한 Leiden 커뮤니티 탐지는 강력하지만, 요약 비용이 큽니다. 우리의 Cypher+벡터 방식은 요약 없이 작동하므로 비용 우위가 있습니다.'
        }
      },
      {
        id: '11-13',
        tag: 'theory',
        title: 'retry 루프 비용 — Part 10 retry_count 연동',
        script: 'Part 10에서 만든 retry 시스템을 기억하세요. Cypher 쿼리 생성에 실패하면 LLM에게 다시 요청합니다. retry_count가 3이면 토큰이 3배, 5면 5배로 늘어납니다. 그리고 retry할 때마다 이전 실패 기록까지 포함해서 보내니까, 실제로는 누적으로 더 많이 듭니다.',
        diagram: {
          nodes: [
            { text: 'Reasoner: Cypher 생성', type: 'entity' },
            { text: '실패 (retry_count=1)', type: 'fail' },
            { text: '재시도 + 이전 에러 포함', type: 'entity' },
            { text: '실패 (retry_count=2)', type: 'fail' },
            { text: '재시도 + 에러 2건 포함', type: 'entity' },
            { text: '누적 비용: 입력 토큰 1.0+1.3+1.6 = 3.9배', type: 'fail' }
          ]
        },
        callout: {
          type: 'warn',
          text: 'retry 횟수를 3회로 제한하고(Part 10에서 이미 설정), 3회 실패 시 벡터 검색 폴백으로 전환하세요. retry 루프는 비용의 블랙홀입니다.'
        }
      },
      {
        id: '11-14',
        tag: 'theory',
        title: '5개 Tool별 비용 분석표',
        script: 'Part 10의 5개 Tool을 100개 질문으로 돌렸을 때의 비용 분포입니다. Cypher Tool이 전체의 약 45%로 가장 큽니다. 그 다음이 Community Tool. Schema Tool과 Vector Tool은 상대적으로 저렴합니다.',
        table: {
          headers: ['Tool', '평균 호출/질문', '주로 사용 모델', '100Q 비용 (예상)', '비율'],
          rows: [
            {
              cells: [
                { text: 'Schema Tool', bold: true },
                { text: '1.0회' },
                { text: 'gpt-4o-mini' },
                { text: '$0.12' },
                { text: '3%' }
              ]
            },
            {
              cells: [
                { text: 'Cypher Tool', bold: true },
                { text: '1.8회 (retry 포함)' },
                { text: 'gpt-4o' },
                { text: '$1.80', status: 'fail' },
                { text: '45%' }
              ]
            },
            {
              cells: [
                { text: 'Vector Tool', bold: true },
                { text: '1.0회' },
                { text: '임베딩만' },
                { text: '$0.08' },
                { text: '2%' }
              ]
            },
            {
              cells: [
                { text: 'Community Tool', bold: true },
                { text: '0.6회' },
                { text: 'gpt-4o' },
                { text: '$1.20', status: 'warn' },
                { text: '30%' }
              ]
            },
            {
              cells: [
                { text: 'Path Tool', bold: true },
                { text: '0.4회' },
                { text: 'gpt-4o-mini' },
                { text: '$0.05' },
                { text: '1%' }
              ]
            },
            {
              cells: [
                { text: 'Supervisor + Validator', bold: true },
                { text: '2.0회' },
                { text: 'gpt-4o' },
                { text: '$0.75', status: 'warn' },
                { text: '19%' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'Cypher Tool(45%)과 Community Tool(30%)이 비용의 75%를 차지합니다. 이 두 Tool을 최적화하는 것이 핵심입니다.'
        }
      }
    ]
  },

  // Section 4: 비용 최적화 7가지 기법 (30min) — 6 slides
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '11-15',
        tag: 'practice',
        title: '기법 1: 시맨틱 캐싱 — 제조 도메인',
        script: '첫 번째 기법은 시맨틱 캐싱입니다. 비슷한 질문이 들어오면 LLM을 다시 호출하지 않고 캐시된 결과를 씁니다. "접착 박리의 원인은?"과 "접착 박리 결함의 발생 원인 공정은?" -- 이 두 질문은 의미가 같잖아요. 임베딩 유사도로 판단해서 캐시 히트를 시킵니다.',
        code: {
          language: 'python',
          code: `# langchain >= 0.2.0, langchain-openai >= 0.1.0
from langchain_community.cache import InMemoryCache
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
import hashlib
import numpy as np

# 시맨틱 캐시 구현
class SemanticCache:
    def __init__(self, threshold: float = 0.92):
        self.embeddings = OpenAIEmbeddings()
        self.cache: dict[str, dict] = {}  # key: question, value: {embedding, result}
        self.threshold = threshold

    def get(self, question: str):
        q_emb = self.embeddings.embed_query(question)
        for cached_q, data in self.cache.items():
            similarity = np.dot(q_emb, data["embedding"])
            if similarity >= self.threshold:
                print(f"Cache HIT: '{question}' ≈ '{cached_q}' "
                      f"(sim={similarity:.3f})")
                return data["result"]
        return None

    def set(self, question: str, result: dict):
        embedding = self.embeddings.embed_query(question)
        self.cache[question] = {"embedding": embedding, "result": result}

# 사용 예시 — 제조 도메인
cache = SemanticCache(threshold=0.92)

# 첫 번째 질문: LLM 호출
q1 = "접착 박리의 원인 공정은?"
result1 = app.invoke({"question": q1, ...})  # Part 10 LangGraph
cache.set(q1, result1)

# 두 번째 질문: 캐시 히트 (LLM 호출 안 함!)
q2 = "접착 박리 결함의 발생 원인 공정은?"
cached = cache.get(q2)  # Cache HIT (sim=0.96)
# → LLM 비용 $0`
        },
        callout: {
          type: 'key',
          text: '시맨틱 캐싱만으로도 반복 질문의 비용을 0에 가깝게 줄일 수 있습니다. threshold를 0.92~0.95로 설정하면 오탐 없이 높은 히트율을 얻습니다.'
        }
      },
      {
        id: '11-16',
        tag: 'practice',
        title: '기법 2-3: 배치 처리 + 증분 업데이트',
        script: '두 번째는 배치 처리 -- 여러 문서를 한 번에 처리해서 LLM 호출 오버헤드를 줄입니다. 세 번째는 증분 업데이트 -- 전체 KG를 재구축하지 말고 변경된 문서만 업데이트합니다.',
        code: {
          language: 'python',
          code: `# langchain >= 0.2.0, langchain-openai >= 0.1.0

# 기법 2: 배치 처리 — 엔티티 추출
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# ❌ 비효율: 문서 하나씩 LLM 호출
# for doc in documents:
#     entities = extract_entities(doc)  # LLM 호출 100회

# ✅ 효율: 10개씩 배치로 LLM 호출
batch_size = 10
for i in range(0, len(documents), batch_size):
    batch = documents[i:i+batch_size]
    batch_text = "\\n---\\n".join([d.page_content for d in batch])
    entities = extract_entities_batch(batch_text)
    # LLM 호출 10회 (100 → 10)

# 기법 3: 증분 업데이트
from datetime import datetime

def incremental_update(graph, last_update: datetime):
    """변경된 문서만 추출하여 KG 업데이트"""
    new_docs = get_documents_since(last_update)
    print(f"전체: {total_docs}개, 신규: {len(new_docs)}개")

    for doc in new_docs:
        entities = extract_entities(doc)
        # MERGE로 중복 자동 병합
        for entity in entities:
            graph.query(
                "MERGE (n:{label} {{name: $name}}) "
                "SET n += $props",
                params={"name": entity["name"], "props": entity["props"]}
            )
    return len(new_docs)`
        },
        callout: {
          type: 'tip',
          text: '배치 처리는 LLM 호출 횟수를 1/10로, 증분 업데이트는 재구축 비용을 90%+ 줄입니다. 두 기법 모두 구현이 간단합니다.'
        }
      },
      {
        id: '11-17',
        tag: 'practice',
        title: '기법 4: 모델 라우팅 — gpt-4o-mini/gpt-4o',
        script: '네 번째 기법은 모델 라우팅입니다. 간단한 질문은 gpt-4o-mini, 복잡한 질문만 gpt-4o를 씁니다. Part 10의 Supervisor에 라우팅 로직을 추가하면 됩니다. 이것만으로 비용이 40-60% 줄어듭니다.',
        code: {
          language: 'python',
          code: `# langchain >= 0.2.0, langchain-openai >= 0.1.0
from langchain_openai import ChatOpenAI

# 모델 라우팅 — 질문 복잡도에 따라 모델 선택
def classify_complexity(question: str) -> str:
    """질문 복잡도 분류 (gpt-4o-mini로 분류)"""
    classifier = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    result = classifier.invoke(
        f"다음 질문의 복잡도를 simple/complex로 분류하세요.\\n"
        f"simple: 1-hop, 단순 조회\\n"
        f"complex: multi-hop, 집계, 경로 추적\\n"
        f"질문: {question}\\n"
        f"답변(simple/complex만):"
    )
    return result.content.strip().lower()

def get_routed_llm(question: str) -> ChatOpenAI:
    """복잡도에 따라 적절한 모델 반환"""
    complexity = classify_complexity(question)
    if complexity == "simple":
        return ChatOpenAI(model="gpt-4o-mini", temperature=0)
    else:
        return ChatOpenAI(model="gpt-4o", temperature=0)

# 제조 도메인 예시
# simple → gpt-4o-mini ($0.15/1M)
q1 = "접착기 A-3의 마지막 정비 날짜는?"
llm1 = get_routed_llm(q1)  # gpt-4o-mini

# complex → gpt-4o ($2.50/1M)
q2 = "접착 박리의 근본 원인 공정과 해당 설비의 정비 이력은?"
llm2 = get_routed_llm(q2)  # gpt-4o

# 비용 절감 효과:
# 질문의 60%가 simple이라면
# 기존: 100% gpt-4o = $2.50 * 100Q
# 라우팅: 60% gpt-4o-mini + 40% gpt-4o
#       = ($0.15 * 60 + $2.50 * 40) / 100 = $1.09/Q
# → 56% 비용 절감`
        },
        callout: {
          type: 'key',
          text: '모델 라우팅은 분류 비용(gpt-4o-mini)이 추가되지만, 전체 비용은 40-60% 줄어듭니다. Part 10의 Supervisor에 이 로직을 추가하세요.'
        }
      },
      {
        id: '11-18',
        tag: 'practice',
        title: '기법 5: 스키마 프루닝 — 제조 KG',
        script: '다섯 번째는 스키마 프루닝입니다. LLM에게 전체 스키마를 보내지 말고 질문에 관련된 부분만 보냅니다. 제조 KG에 노드 타입이 10개, 관계 타입이 15개 있다면, "접착 박리의 원인 설비는?" 질문에는 Defect와 Equipment 관련 스키마만 보내면 됩니다. 프롬프트 토큰이 50% 줄어듭니다.',
        code: {
          language: 'python',
          code: `# langchain >= 0.2.0, langchain-openai >= 0.1.0
from langchain_openai import ChatOpenAI

# 전체 스키마 (제조 KG)
full_schema = """
Node labels: Process, Equipment, Defect, Product, Material,
             Technician, Team, Shift, QualityCheck, Sensor
Relationships: CAUSED_BY, USES_EQUIPMENT, PRODUCED_BY, MADE_FROM,
               MAINTAINED_BY, BELONGS_TO, WORKS_IN, CHECKED_BY,
               MEASURED_BY, OCCURRED_AT, FOLLOWS, SUPPLIES,
               INSPECTED, TRIGGERED, RESOLVED_BY
"""

def prune_schema(full_schema: str, question: str) -> str:
    """질문에 관련된 스키마만 추출"""
    pruner = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    result = pruner.invoke(
        f"다음 질문에 관련된 노드와 관계만 추출하세요.\\n"
        f"질문: {question}\\n"
        f"전체 스키마:\\n{full_schema}\\n"
        f"관련 스키마만 반환:"
    )
    return result.content

# 예시: "접착 박리의 원인 설비는?"
question = "접착 박리의 원인 설비는?"
pruned = prune_schema(full_schema, question)
# 결과: "Defect -[CAUSED_BY]-> Process -[USES_EQUIPMENT]-> Equipment"
# 전체 스키마 토큰: ~280 → 프루닝 후: ~45 (84% 감소)

# Part 10의 Explorer 노드에 적용
def explorer_with_pruning(state: AgentState, config: dict):
    pruned_schema = prune_schema(full_schema, state["question"])
    return {**state, "schema_info": pruned_schema}`
        },
        callout: {
          type: 'tip',
          text: '스키마 프루닝은 프롬프트 토큰을 50-80% 줄이고, Cypher 생성 정확도도 올립니다. 불필요한 스키마가 없으니 LLM이 덜 혼란스러워합니다.'
        }
      },
      {
        id: '11-19',
        tag: 'practice',
        title: '기법 6: 프롬프트 압축 + 결과 캐싱',
        script: '여섯 번째는 프롬프트 압축 -- LongLLMLingua 같은 도구로 프롬프트를 압축합니다. 일곱 번째는 결과 캐싱 -- Cypher 쿼리 결과를 Redis에 캐싱합니다. 동일한 Cypher는 Neo4j를 다시 호출하지 않습니다.',
        code: {
          language: 'python',
          code: `# 기법 6: 프롬프트 압축
from llmlingua import PromptCompressor

compressor = PromptCompressor()
compressed_prompt = compressor.compress_prompt(
    original_prompt,
    rate=0.5  # 50% 압축
)
# 원본 1,200 토큰 → 600 토큰

# 기법 7: Cypher 결과 캐싱 (Redis)
import redis
import json
import hashlib

cache = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", "6379"))
)

def cached_cypher_query(graph, cypher: str, params: dict):
    """Cypher 쿼리 결과를 Redis에 캐싱"""
    # 쿼리 + 파라미터를 키로 사용
    key_source = f"{cypher}:{json.dumps(params, sort_keys=True)}"
    cache_key = f"cypher:{hashlib.sha256(key_source.encode()).hexdigest()}"

    cached = cache.get(cache_key)
    if cached:
        print(f"Cypher Cache HIT")
        return json.loads(cached)

    result = graph.query(cypher, params=params)
    cache.setex(cache_key, 3600, json.dumps(result))  # 1시간 TTL
    return result

# 제조 도메인 사용 예시
cypher = "MATCH (d:Defect {name: $name})-[:CAUSED_BY]->(p:Process) RETURN p.name"
result = cached_cypher_query(graph, cypher, {"name": "접착 박리"})
# 첫 호출: Neo4j 실행 → 캐시 저장
# 이후 호출: Redis에서 즉시 반환`
        },
        callout: {
          type: 'key',
          text: '이 7가지 기법을 모두 적용하면 월 비용을 70-80% 줄일 수 있습니다. 비용 최적화의 80%는 캐싱(시맨틱 캐싱 + 결과 캐싱)에서 옵니다.'
        }
      },
      {
        id: '11-20',
        tag: 'practice',
        title: 'Hallucination 검증 캐싱 — extract_entities 최적화',
        script: 'Part 10의 Validator가 환각을 검증할 때 extract_entities를 호출합니다. 그런데 같은 답변에서 엔티티를 추출하는 건 한 번이면 충분합니다. 이 결과를 캐싱하면 Validator의 비용을 50% 이상 줄일 수 있습니다.',
        code: {
          language: 'python',
          code: `# langchain >= 0.2.0, langchain-openai >= 0.1.0
from langchain_openai import ChatOpenAI
from functools import lru_cache
import hashlib

# extract_entities 결과 캐싱
@lru_cache(maxsize=1000)
def extract_entities_cached(text_hash: str, text: str) -> list[str]:
    """엔티티 추출 결과를 메모리에 캐싱"""
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    result = llm.invoke(
        f"다음 텍스트에서 제조 도메인 엔티티를 추출하세요.\\n"
        f"(Defect, Process, Equipment, Product만)\\n"
        f"텍스트: {text}\\n"
        f"엔티티 목록 (쉼표 구분):"
    )
    return [e.strip() for e in result.content.split(",")]

def extract_entities(text: str) -> list[str]:
    """캐시 래퍼 — text의 해시를 키로 사용"""
    text_hash = hashlib.sha256(text.encode()).hexdigest()
    return extract_entities_cached(text_hash, text)

# Validator에서 활용
def validator_with_caching(state: AgentState, config: dict):
    answer = state["answer"]

    # 동일 답변의 엔티티 추출은 캐시에서 가져옴
    entities = extract_entities(answer)

    # 추출된 엔티티가 KG에 실제 존재하는지 검증
    for entity in entities:
        exists = graph.query(
            "MATCH (n) WHERE n.name = $name RETURN count(n) > 0 AS exists",
            params={"name": entity}
        )
        if not exists[0]["exists"]:
            state["answer"] += f"\\n[주의] '{entity}'는 KG에 없는 엔티티입니다."

    return state

# 효과: Validator가 같은 답변을 여러 번 검증해도
# extract_entities는 1번만 LLM 호출`
        },
        callout: {
          type: 'tip',
          text: 'extract_entities 캐싱은 구현이 간단하지만 Validator 비용을 50% 이상 줄입니다. @lru_cache로 메모리 캐싱, Redis로 영구 캐싱을 선택하세요.'
        }
      }
    ]
  },

  // Section 5: 벤치마크 + 정리 (25min) — 5 slides
  {
    sectionId: 'sec5',
    slides: [
      {
        id: '11-21',
        tag: 'practice',
        title: 'Part 7 RAGAS 연동 — 최적화 전후 비교',
        script: 'Part 7에서 배운 RAGAS를 사용해서 최적화 전후의 품질을 비교합니다. 비용을 줄이면서 품질이 떨어지면 안 되니까요. Part 10의 멀티에이전트 파이프라인에 RAGAS를 연동하는 코드입니다.',
        code: {
          language: 'python',
          code: `# langchain >= 0.2.0, langchain-openai >= 0.1.0
# pip install ragas>=0.1.0
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy
from ragas.metrics import context_precision, context_recall
from datasets import Dataset

# Part 7의 RAGAS 데이터셋 (제조 도메인)
eval_questions = [
    "접착 박리의 원인 공정은?",
    "접착기 A-3의 마지막 정비 날짜는?",
    "2024년 1월 불량률이 가장 높은 공정은?",
    # ... 총 50개 질문
]
ground_truths = [
    "접착 도포 공정",
    "2024-01-15",
    "접착 도포 공정 (불량률 3.2%)",
    # ... 총 50개 정답
]

def run_ragas_benchmark(pipeline_fn, label: str):
    """파이프라인 함수를 받아서 RAGAS 벤치마크 실행"""
    answers, contexts = [], []
    for q in eval_questions:
        result = pipeline_fn(q)
        answers.append(result["answer"])
        contexts.append([result.get("context", "")])

    dataset = Dataset.from_dict({
        "question": eval_questions,
        "answer": answers,
        "contexts": contexts,
        "ground_truth": ground_truths,
    })

    scores = evaluate(
        dataset,
        metrics=[faithfulness, answer_relevancy,
                 context_precision, context_recall],
    )
    print(f"\\n=== {label} ===")
    print(f"Faithfulness:      {scores['faithfulness']:.3f}")
    print(f"Answer Relevancy:  {scores['answer_relevancy']:.3f}")
    print(f"Context Precision: {scores['context_precision']:.3f}")
    print(f"Context Recall:    {scores['context_recall']:.3f}")
    return scores

# 최적화 전: Part 10 기본 멀티에이전트
scores_before = run_ragas_benchmark(baseline_pipeline, "최적화 전")

# 최적화 후: 캐싱 + 모델 라우팅 + 스키마 프루닝 적용
scores_after = run_ragas_benchmark(optimized_pipeline, "최적화 후")`
        },
        callout: {
          type: 'key',
          text: '비용 최적화 후에도 RAGAS 점수가 유지되는지 반드시 확인하세요. 비용은 70% 줄었는데 정확도가 10% 떨어지면 의미 없습니다.'
        }
      },
      {
        id: '11-22',
        tag: 'discussion',
        title: '100개 쿼리 벤치마크 — 최적화 전/후',
        script: '실제 프로덕션 환경에서 100개 쿼리를 처리하는 비용과 성능을 측정한 결과입니다. 7가지 최적화 기법을 모두 적용했을 때의 전후 비교입니다.',
        table: {
          headers: ['지표', '최적화 전', '최적화 후', '개선율'],
          rows: [
            {
              cells: [
                { text: '총 비용', bold: true },
                { text: '$4.00' },
                { text: '$1.20', status: 'pass' },
                { text: '-70%' }
              ]
            },
            {
              cells: [
                { text: '평균 응답 시간', bold: true },
                { text: '8.3초' },
                { text: '4.1초', status: 'pass' },
                { text: '-51%' }
              ]
            },
            {
              cells: [
                { text: 'LLM 호출 횟수', bold: true },
                { text: '437회' },
                { text: '178회', status: 'pass' },
                { text: '-59%' }
              ]
            },
            {
              cells: [
                { text: '캐시 히트율', bold: true },
                { text: '0%' },
                { text: '62%', status: 'pass' },
                { text: '+62%p' }
              ]
            },
            {
              cells: [
                { text: 'Faithfulness', bold: true },
                { text: '0.85' },
                { text: '0.87', status: 'pass' },
                { text: '+2%p' }
              ]
            },
            {
              cells: [
                { text: 'Answer Relevancy', bold: true },
                { text: '0.82' },
                { text: '0.84', status: 'pass' },
                { text: '+2%p' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: '위 수치는 예시이며, 실제 비용은 모델(gpt-4o vs gpt-4o-mini), 질문 복잡도, KG 규모에 따라 달라집니다. 측정: Part 7의 RAGAS 데이터셋 + Part 10의 멀티에이전트 파이프라인 기준. 반드시 자체 환경에서 벤치마크하세요.'
        }
      },
      {
        id: '11-23',
        tag: 'discussion',
        title: '최적화 기법별 효과 분석',
        script: '7가지 기법 각각이 얼마나 기여하는지 분석해봅시다. 결론부터 말하면, 비용 최적화의 80%는 캐싱에서 옵니다. 시맨틱 캐싱과 결과 캐싱 두 가지가 압도적입니다.',
        table: {
          headers: ['기법', '비용 절감', '정확도 영향', '구현 난이도', '우선순위'],
          rows: [
            {
              cells: [
                { text: '1. 시맨틱 캐싱', bold: true },
                { text: '-30~40%', status: 'pass' },
                { text: '변화 없음' },
                { text: '중' },
                { text: '1순위' }
              ]
            },
            {
              cells: [
                { text: '2. 배치 처리', bold: true },
                { text: '-10~15%' },
                { text: '변화 없음' },
                { text: '하' },
                { text: '3순위' }
              ]
            },
            {
              cells: [
                { text: '3. 증분 업데이트', bold: true },
                { text: '-20~30% (구축 시)' },
                { text: '변화 없음' },
                { text: '중' },
                { text: '4순위' }
              ]
            },
            {
              cells: [
                { text: '4. 모델 라우팅', bold: true },
                { text: '-40~60%', status: 'pass' },
                { text: '-1~2%p' },
                { text: '중' },
                { text: '2순위' }
              ]
            },
            {
              cells: [
                { text: '5. 스키마 프루닝', bold: true },
                { text: '-10~20%' },
                { text: '+1~2%p', status: 'pass' },
                { text: '하' },
                { text: '5순위' }
              ]
            },
            {
              cells: [
                { text: '6. 프롬프트 압축', bold: true },
                { text: '-5~15%' },
                { text: '-1%p' },
                { text: '중' },
                { text: '6순위' }
              ]
            },
            {
              cells: [
                { text: '7. 결과 캐싱', bold: true },
                { text: '-15~25%', status: 'pass' },
                { text: '변화 없음' },
                { text: '하' },
                { text: '3순위' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '우선순위: (1) 시맨틱 캐싱 (2) 모델 라우팅 (3) 결과 캐싱/배치 처리. 이 3가지만 적용해도 70% 이상 절감됩니다. 위 수치는 예시이며, 실제 효과는 워크로드에 따라 달라집니다.'
        }
      },
      {
        id: '11-24',
        tag: 'theory',
        title: 'Part 11 핵심 정리',
        script: 'Part 11 핵심 정리입니다. 첫째, GraphRAG 실패는 Retrieval/Generation/Schema 세 가지로 분류하고, Part 10의 Explorer/Reasoner/Validator에 매핑됩니다. 둘째, LangSmith로 LangGraph 노드별 트레이싱을 하면 3분 안에 문제를 찾을 수 있습니다. 셋째, 비용 폭발은 Cypher Tool(45%)과 Community Tool(30%)에서 발생합니다. 넷째, 7가지 최적화 기법으로 비용을 70% 줄일 수 있습니다. 다섯째, 비용 최적화의 80%는 캐싱에서 옵니다.',
        table: {
          headers: ['핵심 개념', '한 줄 요약'],
          rows: [
            {
              cells: [
                { text: '실패 유형 분류', bold: true },
                { text: 'Retrieval/Generation/Schema → Explorer/Reasoner/Validator' }
              ]
            },
            {
              cells: [
                { text: '추적 도구', bold: true },
                { text: 'LangSmith + LangGraph 노드별 콜백으로 3분 안에 원인 파악' }
              ]
            },
            {
              cells: [
                { text: '비용 폭발 구간', bold: true },
                { text: 'Cypher Tool(45%) + Community Tool(30%) = 75%' }
              ]
            },
            {
              cells: [
                { text: '최적화 기법', bold: true },
                { text: '7가지 기법으로 비용 70% 절감 (RAGAS 품질 유지)' }
              ]
            },
            {
              cells: [
                { text: '핵심 원칙', bold: true },
                { text: '캐싱이 80%, 나머지가 20%' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '비용 최적화의 80%는 캐싱에서 옵니다. 시맨틱 캐싱과 결과 캐싱을 반드시 적용하세요.'
        }
      },
      {
        id: '11-25',
        tag: 'discussion',
        title: 'Part 12 예고 — 엔터프라이즈 실전',
        script: 'Part 11에서 비용을 최적화했습니다. Part 12에서는 이 시스템을 팀과 조직에 도입할 때 필요한 인프라 설계, 권한 관리, 모니터링 대시보드를 다룹니다. 개인 노트북에서 회사 서버로 -- 엔터프라이즈 실전입니다.',
        diagram: {
          nodes: [
            { text: 'Part 11: 디버깅 + 비용 최적화', type: 'entity' },
            { text: '개인 환경에서 검증 완료', type: 'dim' },
            { text: '→ Part 12', type: 'relation' },
            { text: 'Part 12: 엔터프라이즈 배포', type: 'entity' },
            { text: '인프라 + 권한 + 모니터링', type: 'dim' }
          ]
        },
        callout: {
          type: 'tip',
          text: 'Part 12 미리보기: Docker 기반 배포, Neo4j Aura 운영, RBAC 권한 관리, Grafana 모니터링 대시보드. 실제 팀에서 운영하는 방법을 다룹니다.'
        }
      }
    ]
  }
];
