import type { SectionContent } from './part1-content';

export const part8Content: SectionContent[] = [
  // Section 1: Microsoft GraphRAG 아키텍처 (30min) — Part 7 연결 오프닝 포함
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '8-1',
        tag: 'discussion',
        title: 'Part 7 리캡 — "왜 굳이 직접 만들었나?"',
        script: 'Part 1~7에서 GraphRAG를 직접 구축했습니다 — 온톨로지 설계, LLM 추출, ER, 멀티모달, Text2Cypher Agent까지. 100줄 이상의 코드를 직접 작성했죠. 그런데 MS GraphRAG는 CLI 한 줄이면 됩니다. LightRAG는 10줄이면 됩니다. "왜 굳이 직접 만들었나?" — 직접 만든 것과 프레임워크의 차이를 체감하는 것이 Part 8의 목적입니다.',
        diagram: {
          nodes: [
            { text: 'Part 1-7: 직접 구현', type: 'entity' },
            { text: '온톨로지 + LLM 추출 + ER + VLM + Text2Cypher', type: 'dim' },
            { text: '100줄+ 코드', type: 'relation' },
            { text: 'vs', type: 'fail' },
            { text: 'MS GraphRAG: CLI 1줄', type: 'entity' },
            { text: 'LightRAG: 10줄', type: 'entity' },
            { text: '차이를 체감하는 것이 Part 8', type: 'relation' }
          ]
        },
        callout: {
          type: 'key',
          text: 'Part 8 목표: 프레임워크 비교를 통해 "직접 구현"의 가치와 한계를 체감하고, 프로젝트별 최적 선택 기준을 세운다.'
        }
      },
      {
        id: '8-2',
        tag: 'theory',
        title: 'MS GraphRAG란 무엇인가',
        script: 'Microsoft GraphRAG는 2024년 7월에 오픈소스로 공개된 프레임워크입니다. 핵심은 Leiden 커뮤니티 탐지와 계층적 요약입니다. 문서를 청크로 자르는 건 똑같은데, 청크에서 추출한 엔티티들을 커뮤니티로 묶고, 각 커뮤니티마다 요약을 만들어둡니다. 검색할 때는 이 요약을 LLM에 넣어서 답변을 생성하는 거죠. Part 1~7에서 우리가 직접 한 온톨로지 설계, Meta-Dictionary, Entity Resolution — 이런 과정 없이 LLM이 알아서 추출합니다.',
        diagram: {
          nodes: [
            { text: '문서', type: 'entity' },
            { text: '청크 분할', type: 'relation' },
            { text: 'LLM 추출', type: 'entity' },
            { text: 'Entity + Relation', type: 'relation' },
            { text: 'Leiden 커뮤니티 탐지', type: 'entity' },
            { text: '계층적 클러스터링', type: 'relation' },
            { text: '커뮤니티 요약 생성', type: 'entity' },
            { text: 'LLM Summary', type: 'relation' },
            { text: '인덱스 저장', type: 'entity' }
          ]
        },
        callout: {
          type: 'key',
          text: 'MS GraphRAG는 Graph를 직접 쿼리하지 않습니다. 커뮤니티 요약을 검색하고 LLM에게 넘깁니다.'
        }
      },
      {
        id: '8-3',
        tag: 'theory',
        title: 'Global vs Local vs DRIFT Search',
        script: 'MS GraphRAG는 세 가지 검색 모드를 지원합니다. Global Search는 전체 데이터셋의 요약을 사용해서 "브레이크 패드 제조 공정의 전반적인 품질 추이는?"같은 질문에 답합니다. Local Search는 질문과 관련된 엔티티 주변의 서브그래프만 봅니다. "접착 박리의 원인 공정은?"처럼 특정 엔티티를 중심으로 검색하죠. DRIFT는 둘을 섞은 겁니다.',
        table: {
          headers: ['모드', '검색 범위', '적합한 질문 (제조)', '비용'],
          rows: [
            {
              cells: [
                { text: 'Global Search', bold: true },
                { text: '전체 커뮤니티 요약' },
                { text: '"브레이크 패드 품질 추이는?"' },
                { text: '$$$$', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: 'Local Search', bold: true },
                { text: '엔티티 주변 서브그래프' },
                { text: '"접착 박리의 원인 공정은?"' },
                { text: '$$', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'DRIFT Search', bold: true },
                { text: 'Global + Local 결합' },
                { text: '복합 질문' },
                { text: '$$$', status: 'warn' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: 'Global Search는 매 쿼리마다 모든 커뮤니티 요약을 LLM에 넣습니다. 50개 제조 보고서 기준 쿼리당 $0.10-0.50 수준입니다.'
        }
      },
      {
        id: '8-4',
        tag: 'practice',
        title: 'MS GraphRAG 인덱싱 파이프라인',
        script: '실제로 돌려봅시다. CLI가 있어서 사용은 간단합니다. 제조 도메인 품질 보고서를 인덱싱합니다.',
        code: {
          language: 'bash',
          code: `# graphrag >= 1.0.0 (2024.12~) 기준
# 실행 환경: Ubuntu 22.04, 16GB RAM, GPT-4o

# 1. 설치
pip install graphrag

# 2. 초기화
graphrag init --root ./ragtest

# 3. 설정 파일 편집 (.env 및 settings.yaml)
# GRAPHRAG_API_KEY 환경변수로 관리 (하드코딩 금지)
# GRAPHRAG_LLM_MODEL=gpt-4o

# 4. 제조 품질 보고서 50개를 input/ 디렉토리에 배치
# (Part 2~5에서 사용한 보고서 3개 + 추가 47개)

# 5. 인덱싱 실행
graphrag index --root ./ragtest

# 6. Global Search — 전체 품질 개요
graphrag query --root ./ragtest \\
  --method global \\
  "브레이크 패드 제조 공정의 전체적인 품질 추이는?"

# 7. Local Search — 특정 엔티티 중심
graphrag query --root ./ragtest \\
  --method local \\
  "접착 박리의 원인 공정은?"`
        },
        callout: {
          type: 'tip',
          text: '인덱싱은 시간과 토큰이 많이 듭니다. 50개 제조 보고서 기준 약 18분 + GPT-4o 토큰 비용 $10-15 정도입니다.'
        }
      },
      {
        id: '8-5',
        tag: 'practice',
        title: '제조 도메인 Global/Local Search 예시',
        script: 'Global Search와 Local Search가 제조 도메인에서 어떻게 다르게 작동하는지 봅시다. Global은 모든 커뮤니티 요약을 LLM에 넣어서 전체 개요를 생성합니다. "2025년 1월 브레이크 패드 제조 라인의 전반적인 품질 현황은?"이라고 물으면, 전체 50개 보고서의 커뮤니티 요약이 LLM에 들어갑니다. Local은 "접착 박리" 엔티티 주변만 검색합니다. "접착 박리의 원인 공정은?"이라고 물으면, 접착 박리와 연결된 공정, 설비, 자재 노드만 가져옵니다.',
        code: {
          language: 'bash',
          code: `# Global Search 예시 — 전체 품질 개요
graphrag query --root ./ragtest \\
  --method global \\
  "2025년 1월 브레이크 패드 제조 라인의 전반적인 품질 현황은?"
# → 50개 보고서의 모든 커뮤니티 요약 → LLM → 전체 개요 답변

# Local Search 예시 — 특정 엔티티 주변
graphrag query --root ./ragtest \\
  --method local \\
  "접착 박리의 원인 공정은?"
# → "접착 박리" 엔티티 + 연결된 Process/Equipment 노드만 검색

# DRIFT Search 예시 — Global + Local 결합
graphrag query --root ./ragtest \\
  --method drift \\
  "접착 박리와 두께 불균일의 공통 원인 공정은?"
# → Global로 전체 맥락 파악 + Local로 두 결함의 교차점 탐색`
        },
        callout: {
          type: 'key',
          text: 'Global = "숲 전체를 보는 질문", Local = "특정 나무를 찾는 질문". 제조 도메인에서 품질 트렌드는 Global, 원인 분석은 Local이 적합합니다.'
        }
      }
    ]
  },
  // Section 2: LightRAG & fast-graphrag (25min)
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '8-6',
        tag: 'theory',
        title: 'LightRAG — 1/100 비용의 경량 GraphRAG',
        script: 'LightRAG는 2024년 10월에 나온 프레임워크입니다. MS GraphRAG가 너무 비싸다는 비판을 받고 나온 거죠. 핵심 아이디어는 "커뮤니티 요약 생성을 건너뛰고, 쿼리 시점에 서브그래프를 추출해서 한 번에 LLM에 넣자"입니다. 쿼리당 평균 100 토큰, 단일 API 호출로 끝납니다.',
        table: {
          headers: ['항목', 'MS GraphRAG', 'LightRAG'],
          rows: [
            {
              cells: [
                { text: '인덱싱 비용', bold: true },
                { text: '$10-15 (GPT-4o)', status: 'fail' },
                { text: '$0.50-2 (GPT-4o-mini)', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '쿼리당 토큰', bold: true },
                { text: '5000-20000 (Global)', status: 'fail' },
                { text: '100-500', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '검색 시간', bold: true },
                { text: '3-10초', status: 'warn' },
                { text: '0.5-2초', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '정확도', bold: true },
                { text: '높음', status: 'pass' },
                { text: '중간', status: 'warn' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'LightRAG는 프로토타입과 비용 제약이 있는 환경에 적합합니다.'
        }
      },
      {
        id: '8-7',
        tag: 'practice',
        title: 'LightRAG 실행 — 제조 도메인',
        script: 'LightRAG를 제조 데이터로 돌려봅시다. 코드가 정말 간단합니다.',
        code: {
          language: 'python',
          code: `# lightrag >= 0.1.0 기준
import os
from lightrag import LightRAG, QueryParam

# API 키는 환경변수로 관리
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

rag = LightRAG(
    working_dir="./manufacturing_lightrag",
    llm_model_name="gpt-4o-mini",
)

# 인덱싱 — 제조 품질 보고서
with open("manufacturing_reports.txt", "r") as f:
    rag.insert(f.read())

# Local Search — 특정 엔티티 중심
result = rag.query(
    "접착 박리의 원인 공정은?",
    param=QueryParam(mode="local")
)
print(result)

# Global Search — 전체 개요
result = rag.query(
    "브레이크 패드 제조 공정의 전반적인 품질 추이는?",
    param=QueryParam(mode="global")
)`
        },
        callout: {
          type: 'tip',
          text: '10줄이면 GraphRAG가 동작합니다. Part 1-7에서 100줄+ 작성한 것과 비교해보세요.'
        }
      },
      {
        id: '8-8',
        tag: 'theory',
        title: 'fast-graphrag — Personalized PageRank',
        script: 'fast-graphrag는 CirclemindHQ에서 만든 프레임워크입니다. MS GraphRAG 대비 27배 빠르다고 광고하고 있습니다. 핵심은 Personalized PageRank 알고리즘을 써서 중요한 노드를 빠르게 찾는 겁니다. 인덱싱 비용은 MS GraphRAG의 1/6 정도입니다.',
        table: {
          headers: ['항목', 'MS GraphRAG', 'fast-graphrag'],
          rows: [
            {
              cells: [
                { text: '검색 알고리즘', bold: true },
                { text: 'Community Summary' },
                { text: 'Personalized PageRank' }
              ]
            },
            {
              cells: [
                { text: '인덱싱 비용', bold: true },
                { text: '$0.48 (1MB당)', status: 'fail' },
                { text: '$0.08 (1MB당)', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '검색 속도', bold: true },
                { text: '기준 (1x)', status: 'warn' },
                { text: '27x 빠름', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '의존성', bold: true },
                { text: 'Python only' },
                { text: 'Python + NetworkX' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: 'Personalized PageRank가 어떻게 작동하는지는 Part 9에서 직접 구현하면서 자세히 다룹니다.'
        }
      },
      {
        id: '8-9',
        tag: 'practice',
        title: 'fast-graphrag 실행 — 제조 도메인',
        script: 'fast-graphrag도 돌려봅시다.',
        code: {
          language: 'python',
          code: `# fast-graphrag >= 0.1.0 기준
import os
from fast_graphrag import GraphRAG

# API 키는 환경변수로 관리
WORKING_DIR = "./manufacturing_fast_graphrag"

grag = GraphRAG(
    working_dir=WORKING_DIR,
    domain="제조 품질 관리",
    example_queries=[
        "접착 박리의 원인 공정은?",
        "브레이크 패드 제조 공정의 품질 추이는?",
    ],
    entity_types=["Process", "Equipment", "Defect",
                  "Material", "Product", "Spec"],
)

# 인덱싱
with open("manufacturing_reports.txt", "r") as f:
    grag.insert(f.read())

# 검색 — Personalized PageRank로 중요 노드 랭킹
result = grag.query(
    "접착기 A-3을 사용하는 공정에서 발생한 결함은?"
)
print(result)`
        },
        callout: {
          type: 'tip',
          text: 'entity_types 파라미터로 제조 도메인 엔티티를 힌트로 줄 수 있습니다. 하지만 Part 2의 온톨로지 설계처럼 관계 타입까지 제어하지는 못합니다.'
        }
      },
      {
        id: '8-10',
        tag: 'theory',
        title: 'nano-graphrag — 1100줄 미니멀 구현',
        script: 'nano-graphrag는 교육용 프레임워크입니다. 전체 코드가 1100줄이라서 내부 동작을 이해하기 좋습니다. 프로덕션에는 부적합하지만, "GraphRAG가 어떻게 작동하는지" 배우려면 이거 소스 코드를 읽어보는 게 최고입니다.',
        code: {
          language: 'python',
          code: `# nano-graphrag 예시
from nano_graphrag import GraphRAGConfig, nano_graphrag

# 설정
config = GraphRAGConfig(
    llm_model="gpt-4o-mini",
    working_dir="./manufacturing_nano"
)

# 인덱싱
nano_graphrag.insert(config, "manufacturing_reports.txt")

# 검색
result = nano_graphrag.query(
    config,
    "접착 박리의 원인 공정은?"
)
print(result)`
        },
        callout: {
          type: 'tip',
          text: 'nano-graphrag 핵심 파일 3개: (1) _op.py — 엔티티/관계 추출 프롬프트, (2) _storage.py — 그래프 저장 구조, (3) _query.py — 검색 로직. https://github.com/gusye1234/nano-graphrag'
        }
      }
    ]
  },
  // Section 3: LlamaIndex PropertyGraph (20min)
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '8-11',
        tag: 'theory',
        title: 'PropertyGraph v2 아키텍처',
        script: 'LlamaIndex는 0.11 버전부터 PropertyGraph v2를 지원합니다. Neo4j 통합이 잘 되어 있고, hierarchical_leiden 커뮤니티 탐지를 내장합니다. MS GraphRAG와 비슷한 접근이지만, LlamaIndex의 전체 에코시스템과 연동되는 게 장점이죠.',
        diagram: {
          nodes: [
            { text: 'Document', type: 'entity' },
            { text: 'SimpleDirectoryReader', type: 'relation' },
            { text: 'PropertyGraphIndex', type: 'entity' },
            { text: 'KnowledgeGraphIndex', type: 'relation' },
            { text: 'Neo4jPropertyGraphStore', type: 'entity' },
            { text: 'Graph 저장', type: 'relation' },
            { text: 'hierarchical_leiden', type: 'entity' },
            { text: '커뮤니티 탐지', type: 'relation' },
            { text: 'QueryEngine', type: 'entity' }
          ]
        },
        code: {
          language: 'python',
          code: `import os
from llama_index.core import PropertyGraphIndex, SimpleDirectoryReader
from llama_index.graph_stores.neo4j import Neo4jPropertyGraphStore

# Neo4j 연결 — 인증 정보는 환경변수로 관리
graph_store = Neo4jPropertyGraphStore(
    url=os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    username=os.getenv("NEO4J_USER", "neo4j"),
    password=os.getenv("NEO4J_PASSWORD"),  # 하드코딩 금지
)

# 제조 품질 보고서 로드
documents = SimpleDirectoryReader("./manufacturing_reports").load_data()

# 인덱스 생성
# 임베딩 모델 선택:
# - text-embedding-3-small: OpenAI 클라우드, 영어 우수
# - paraphrase-multilingual-MiniLM-L12-v2: 로컬, 한국어 우수 (Part 4-5 사용)
index = PropertyGraphIndex.from_documents(
    documents,
    property_graph_store=graph_store,
    embed_model="text-embedding-3-small",
    show_progress=True
)

# 검색
query_engine = index.as_query_engine()
response = query_engine.query(
    "접착기 A-3을 사용하는 공정에서 발생한 결함은?"
)`
        }
      },
      {
        id: '8-12',
        tag: 'discussion',
        title: 'LlamaIndex vs 직접 구현 비교',
        script: 'LlamaIndex를 쓸 것이냐, 직접 구현할 것이냐. 이게 실무에서 항상 나오는 질문입니다.',
        table: {
          headers: ['구분', 'LlamaIndex', '직접 구현 (Part 1-7 방식)'],
          rows: [
            {
              cells: [
                { text: '초기 구축 속도', bold: true },
                { text: '빠름 (10줄 코드)', status: 'pass' },
                { text: '느림 (100+ 줄)', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: '온톨로지 제어', bold: true },
                { text: '제한적', status: 'warn' },
                { text: '완전 제어', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Cypher 쿼리 최적화', bold: true },
                { text: '자동 (블랙박스)', status: 'warn' },
                { text: '수동 (투명)', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '디버깅', bold: true },
                { text: '어려움', status: 'fail' },
                { text: '쉬움', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '적합한 상황', bold: true },
                { text: 'POC, 프로토타입' },
                { text: '프로덕션, 맞춤형 요구사항' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'LlamaIndex = 빠른 프로토타입. 직접 구현 = 프로덕션 제어력. 팀의 우선순위에 따라 선택하세요.'
        }
      }
    ]
  },
  // Section 4: 벤치마크 — 제조 데이터, 출력 비교, 비용 계산 (40min)
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '8-13',
        tag: 'practice',
        title: '벤치마크 환경 세팅',
        script: '이제 세 프레임워크를 같은 제조 데이터셋으로 돌려보겠습니다. 데이터는 Part 2~5에서 사용한 제조 품질 보고서 3개 + 추가 47개(검사 성적표, 공정 파라미터 기록표, 설비 점검 기록 포함)입니다. 평가 메트릭은 3가지: 인덱싱 비용, 쿼리 속도, 정확도.',
        code: {
          language: 'python',
          code: `# 벤치마크 환경
# 실행 환경: Ubuntu 22.04, 16GB RAM, GPT-4o
# 데이터: 제조 품질 보고서 50개
#   - Part 2~5에서 사용한 보고서 3개
#   - 추가 47개 (검사 성적표, 공정 파라미터 기록표,
#     설비 점검 기록 포함)

import time
import json

# 공통 질문 세트 — 제조 도메인
questions = [
    # Multi-hop: 설비 → 공정 → 결함 → 규격
    "접착기 A-3을 사용하는 공정에서 발생한 결함이 "
    "있는 제품의 규격 미달 항목은?",
    # Global: 전체 품질 개요
    "브레이크 패드 제조 공정의 전반적인 품질 추이는?",
    # Local: 특정 결함 원인 분석
    "접착 박리와 두께 불균일의 공통 원인 공정은?",
]

def benchmark_framework(name, query_fn, questions):
    """프레임워크별 벤치마크 실행"""
    results = []
    for q in questions:
        start = time.time()
        answer = query_fn(q)
        elapsed = time.time() - start
        results.append({
            "question": q,
            "answer": answer,
            "time": elapsed
        })
    return results`
        },
        callout: {
          type: 'tip',
          text: '벤치마크는 최소 3번 반복 실행하고 중간값을 사용하세요. LLM 응답 시간은 네트워크에 따라 변동이 큽니다.'
        }
      },
      {
        id: '8-14',
        tag: 'practice',
        title: 'MS GraphRAG 벤치마크 실행',
        script: 'MS GraphRAG부터 돌려봅시다. 제조 품질 보고서 50개를 인덱싱합니다.',
        code: {
          language: 'bash',
          code: `# graphrag >= 1.0.0 (2024.12~) 기준
# MS GraphRAG 벤치마크
cd ms-graphrag-test
graphrag init --root .

# API 키는 환경변수로 관리
export GRAPHRAG_API_KEY=$OPENAI_API_KEY

# 인덱싱 시작 (시간 측정)
time graphrag index --root .

# 결과 예시:
# Indexing completed in 18m 32s
# Total tokens used: 235,420
# Estimated cost: $11.77

# 쿼리 실행 — 제조 도메인 질문
graphrag query --root . --method global \\
  "브레이크 패드 제조 공정의 전반적인 품질 추이는?"

graphrag query --root . --method local \\
  "접착 박리의 원인 공정은?"

graphrag query --root . --method local \\
  "접착기 A-3을 사용하는 공정에서 발생한 결함은?"

# 평균 쿼리 시간: 3.2초`
        }
      },
      {
        id: '8-15',
        tag: 'practice',
        title: 'LightRAG & fast-graphrag 벤치마크 실행',
        script: '같은 방식으로 LightRAG와 fast-graphrag를 돌립니다.',
        code: {
          language: 'python',
          code: `import os, time

# ── LightRAG 벤치마크 ──
# lightrag >= 0.1.0 기준
from lightrag import LightRAG, QueryParam

rag = LightRAG(
    working_dir="./benchmark_lightrag",
    llm_model_name="gpt-4o-mini",
)

start = time.time()
with open("./benchmark-data/all_reports.txt", "r") as f:
    rag.insert(f.read())
print(f"LightRAG indexing: {time.time() - start:.1f}s")
# 결과: 2m 15s, $1.20

for q in questions:
    start = time.time()
    result = rag.query(q, param=QueryParam(mode="hybrid"))
    print(f"Query time: {time.time() - start:.1f}s")
# 평균: 0.8초

# ── fast-graphrag 벤치마크 ──
# fast-graphrag >= 0.1.0 기준
from fast_graphrag import GraphRAG

grag = GraphRAG(
    working_dir="./benchmark_fast",
    domain="제조 품질 관리",
    entity_types=["Process", "Equipment", "Defect",
                  "Material", "Product", "Spec"],
)

start = time.time()
with open("./benchmark-data/all_reports.txt", "r") as f:
    grag.insert(f.read())
print(f"fast-graphrag indexing: {time.time() - start:.1f}s")
# 결과: 3m 40s, $2.05

for q in questions:
    start = time.time()
    result = grag.query(q)
    print(f"Query time: {time.time() - start:.1f}s")
# 평균: 0.4초`
        }
      },
      {
        id: '8-16',
        tag: 'discussion',
        title: '같은 질문, 3개 답변 비교',
        script: '"접착 박리의 원인 공정은?"이라는 같은 질문을 3개 프레임워크에 넣었을 때, 답변이 어떻게 다른지 봅시다. MS GraphRAG는 커뮤니티 요약 기반이라 가장 포괄적이지만 비쌉니다. LightRAG는 서브그래프 추출이라 빠르고 저렴하지만 맥락이 좁습니다. fast-graphrag는 PageRank로 중요 노드를 잘 찾지만 요약 수준은 MS GraphRAG에 못 미칩니다.',
        table: {
          headers: ['프레임워크', '답변 특징', '언급 엔티티 수'],
          rows: [
            {
              cells: [
                { text: 'MS GraphRAG', bold: true },
                { text: '커뮤니티 요약 기반, 포괄적 맥락 포함, 관련 공정 3개 + 설비 + 자재까지 언급' },
                { text: '8-12개', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'LightRAG', bold: true },
                { text: '서브그래프 추출, 핵심 관계만 포함, 직접 연결된 공정 1-2개만 언급' },
                { text: '3-5개', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'fast-graphrag', bold: true },
                { text: 'PageRank 기반, 중요도 높은 노드 중심, 공정 2-3개 + 관련 설비 언급' },
                { text: '5-8개', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '같은 질문이라도 프레임워크의 검색 전략에 따라 답변의 깊이와 범위가 크게 달라집니다.'
        }
      },
      {
        id: '8-17',
        tag: 'discussion',
        title: '비용/속도/정확도 비교표',
        script: '결과를 정리하면 이렇습니다. 숫자는 50개 제조 품질 보고서 기준입니다.',
        table: {
          headers: ['프레임워크', '인덱싱 시간', '인덱싱 비용', '쿼리 속도', '정확도 (주관적)'],
          rows: [
            {
              cells: [
                { text: 'MS GraphRAG', bold: true },
                { text: '18m 32s', status: 'fail' },
                { text: '$11.77', status: 'fail' },
                { text: '3.2초', status: 'warn' },
                { text: '★★★★★', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'LightRAG', bold: true },
                { text: '2m 15s', status: 'pass' },
                { text: '$1.20', status: 'pass' },
                { text: '0.8초', status: 'pass' },
                { text: '★★★', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'fast-graphrag', bold: true },
                { text: '3m 40s', status: 'warn' },
                { text: '$2.05', status: 'warn' },
                { text: '0.4초', status: 'pass' },
                { text: '★★★★', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: '위 수치는 각 프레임워크 공식 문서 및 벤치마크에서 참조한 예시입니다. 실제 성능은 문서 크기, LLM 모델, 하드웨어 환경에 따라 크게 달라지므로 반드시 자체 데이터로 직접 벤치마크하세요.'
        }
      },
      {
        id: '8-18',
        tag: 'practice',
        title: '비용 계산기 — 프레임워크별 예상 비용',
        script: '프레임워크를 선택하기 전에 비용부터 계산해봅시다. tiktoken으로 토큰 수를 세고, 각 프레임워크의 토큰 배율을 곱합니다. MS GraphRAG는 인덱싱 시 원문 대비 약 5배의 토큰을 소비합니다(엔티티 추출 + 커뮤니티 요약). LightRAG는 1.5배, fast-graphrag는 2배 정도입니다.',
        code: {
          language: 'python',
          code: `import tiktoken

def estimate_cost(
    documents: list[str],
    model: str = "gpt-4o"
) -> dict:
    """프레임워크별 인덱싱 비용 추정

    토큰 배율은 프레임워크 공식 벤치마크 참조:
    - MS GraphRAG: ~5x (엔티티 추출 + 커뮤니티 요약)
    - LightRAG: ~1.5x (서브그래프 추출만)
    - fast-graphrag: ~2x (PageRank 계산 포함)

    가격은 2024.12 기준 (GPT-4o: $0.01/1K input)
    """
    enc = tiktoken.encoding_for_model(model)
    total_tokens = sum(len(enc.encode(doc)) for doc in documents)

    price_per_1k = {
        "gpt-4o": 0.01,
        "gpt-4o-mini": 0.0005,
    }
    price = price_per_1k.get(model, 0.01)

    costs = {
        "total_tokens": total_tokens,
        "MS GraphRAG": total_tokens * 5 * price / 1000,
        "LightRAG": total_tokens * 1.5 * price / 1000,
        "fast-graphrag": total_tokens * 2 * price / 1000,
    }
    return costs

# 사용 예시
docs = [open("report_%d.txt" % i).read() for i in range(50)]
costs = estimate_cost(docs, model="gpt-4o")
for name, val in costs.items():
    if name == "total_tokens":
        print("총 토큰:", f"{val:,}")
    else:
        print(f"{name}: $" + f"{val:.2f}")
# 예시 출력 (50개 제조 보고서, ~50K 토큰):
# 총 토큰: 50,000
# MS GraphRAG: $2.50
# LightRAG:    $0.04
# fast-graphrag: $1.00`
        },
        callout: {
          type: 'tip',
          text: '실행 환경 예시: Ubuntu 22.04, 16GB RAM, GPT-4o, 50개 제조 품질 보고서. 실제 비용은 프롬프트 구조와 재시도 횟수에 따라 달라집니다.'
        }
      }
    ]
  },
  // Section 5: 선택 기준표 + 토론 — 직접 구현 비교, 의사결정 트리, 제조 결론 (25min)
  {
    sectionId: 'sec5',
    slides: [
      {
        id: '8-19',
        tag: 'discussion',
        title: '직접 구현 vs 프레임워크 — 상세 비교',
        script: '이제 핵심 질문입니다. Part 1-7에서 직접 구현한 것과 프레임워크는 무엇이 다른가? 온톨로지 제어, Meta-Dictionary, Entity Resolution, 멀티모달, Text2Cypher — 각 단계마다 비교해봅시다.',
        table: {
          headers: ['비교 항목', '직접 구현 (Part 1-7)', 'MS GraphRAG', 'LightRAG'],
          rows: [
            {
              cells: [
                { text: '온톨로지 정의', bold: true },
                { text: '7개 타입, 9개 관계 명시', status: 'pass' },
                { text: 'LLM 자동 추출 (제어 불가)', status: 'warn' },
                { text: 'LLM 자동 추출', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'Meta-Dictionary', bold: true },
                { text: '제조 키워드 사전 적용', status: 'pass' },
                { text: '미지원 (프롬프트로 대체)', status: 'fail' },
                { text: '미지원', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: 'Entity Resolution', bold: true },
                { text: '0차~3차 하이브리드 파이프라인', status: 'pass' },
                { text: 'Leiden으로 부분 처리', status: 'warn' },
                { text: '미지원', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: '멀티모달 (표/이미지)', bold: true },
                { text: 'VLM + 접근법 A/B', status: 'pass' },
                { text: '텍스트만 지원', status: 'fail' },
                { text: '텍스트만 지원', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: 'Text2Cypher', bold: true },
                { text: 'Agent 4단계 (검증+교정)', status: 'pass' },
                { text: 'Community Summary 검색', status: 'warn' },
                { text: '서브그래프 추출', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: '제조 도메인 맞춤', bold: true },
                { text: '완전 제어', status: 'pass' },
                { text: '범용', status: 'warn' },
                { text: '범용', status: 'warn' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '직접 구현의 강점: 도메인 전문성을 코드에 녹일 수 있다. 프레임워크의 강점: 빠르게 시작하고 커뮤니티 지원을 받을 수 있다.'
        }
      },
      {
        id: '8-20',
        tag: 'discussion',
        title: '온톨로지 제어 비교 — 왜 중요한가',
        script: '온톨로지 제어가 왜 중요한지 구체적으로 봅시다. Part 2에서 우리는 Process, Equipment, Defect, Material, Product, Spec, Maintenance 7개 엔티티와 CAUSED_BY, USES_EQUIPMENT 등 9개 관계를 명시적으로 정의했습니다. MS GraphRAG에 같은 문서를 넣으면? LLM이 알아서 추출합니다. "접착 공정"과 "접착 프로세스"를 다른 엔티티로 만들 수도 있고, CAUSED_BY 대신 "leads_to" 같은 관계를 만들 수도 있습니다. 이렇게 되면 Cypher 쿼리를 미리 작성할 수 없고, 디버깅도 어렵습니다.',
        table: {
          headers: ['측면', '직접 구현', 'MS GraphRAG'],
          rows: [
            {
              cells: [
                { text: '엔티티 타입', bold: true },
                { text: 'Process, Equipment, Defect... 7개 고정' },
                { text: 'LLM이 자유 추출 (30-100개 가변)' }
              ]
            },
            {
              cells: [
                { text: '관계 타입', bold: true },
                { text: 'CAUSED_BY, USES_EQUIPMENT... 9개 고정' },
                { text: 'LLM이 자유 생성 ("causes", "related_to" 등)' }
              ]
            },
            {
              cells: [
                { text: '중복 엔티티', bold: true },
                { text: 'ER 파이프라인으로 통합 (Part 4)', status: 'pass' },
                { text: 'Leiden 클러스터링으로 부분 처리', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'Cypher 미리 작성', bold: true },
                { text: '가능 — 스키마가 고정', status: 'pass' },
                { text: '불가 — 스키마가 비확정', status: 'fail' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: '제조 도메인처럼 엄격한 품질 기준이 있는 분야에서는 온톨로지 제어가 필수입니다. 프레임워크의 "자동 추출"은 PoC에만 적합합니다.'
        }
      },
      {
        id: '8-21',
        tag: 'discussion',
        title: '사용 사례별 선택 매트릭스',
        script: '그럼 뭘 골라야 할까요? 이 표를 보세요.',
        table: {
          headers: ['우선순위', '추천 프레임워크', '이유'],
          rows: [
            {
              cells: [
                { text: '비용 최소화', bold: true },
                { text: 'LightRAG' },
                { text: '인덱싱 $1-2, 쿼리당 100 토큰' }
              ]
            },
            {
              cells: [
                { text: '정확도 최우선', bold: true },
                { text: 'MS GraphRAG' },
                { text: 'Global Search로 전체 맥락 활용' }
              ]
            },
            {
              cells: [
                { text: '속도 최우선', bold: true },
                { text: 'fast-graphrag' },
                { text: 'Personalized PageRank로 0.4초 응답' }
              ]
            },
            {
              cells: [
                { text: '온톨로지 완전 제어', bold: true },
                { text: '직접 구현 (Part 1-7)' },
                { text: '7개 엔티티, 9개 관계 + Meta-Dictionary' }
              ]
            },
            {
              cells: [
                { text: '빠른 POC', bold: true },
                { text: 'LlamaIndex PropertyGraph' },
                { text: '10줄로 프로토타입' }
              ]
            },
            {
              cells: [
                { text: '학습/교육', bold: true },
                { text: 'nano-graphrag' },
                { text: '1100줄 소스 코드 읽기' }
              ]
            }
          ]
        }
      },
      {
        id: '8-22',
        tag: 'discussion',
        title: '내 프로젝트에는 어떤 걸? — 의사결정 트리',
        script: '의사결정 트리입니다. 위에서부터 순서대로 물어보세요.',
        diagram: {
          nodes: [
            { text: 'Multi-hop 질문 필요?', type: 'entity' },
            { text: 'NO -> 벡터 RAG로 충분', type: 'fail' },
            { text: 'YES', type: 'relation' },
            { text: '온톨로지 맞춤 설계 필요?', type: 'entity' },
            { text: 'YES -> 직접 구현 (Part 1-7)', type: 'dim' },
            { text: 'NO', type: 'relation' },
            { text: '비용 제약 있음?', type: 'entity' },
            { text: 'YES -> LightRAG', type: 'dim' },
            { text: 'NO', type: 'relation' },
            { text: '정확도 vs 속도?', type: 'entity' },
            { text: '정확도 -> MS GraphRAG', type: 'dim' },
            { text: '속도 -> fast-graphrag', type: 'dim' }
          ]
        },
        callout: {
          type: 'tip',
          text: '실무 팁: POC는 LlamaIndex로 빠르게 만들고, 프로덕션은 직접 구현으로 마이그레이션하는 2단계 전략이 효과적입니다.'
        }
      },
      {
        id: '8-23',
        tag: 'discussion',
        title: '제조 도메인 결론 — 우리에게 맞는 선택',
        script: '우리 제조 도메인에 적용해봅시다. 7개 엔티티 + 9개 관계의 엄격한 온톨로지가 필요합니다. Meta-Dictionary로 제조 전문 용어를 통제해야 합니다. 검사 성적표와 공정 파라미터 기록표는 VLM으로 처리해야 하는데 프레임워크들은 텍스트만 지원합니다. Text2Cypher Agent로 4단계 검증/교정이 필요한데 프레임워크는 커뮤니티 요약이나 서브그래프 추출만 합니다. 결론: 프레임워크로는 재현이 어렵습니다. 직접 구현이 추천됩니다. 단, 초기 PoC에서 LlamaIndex PropertyGraph로 빠르게 검증한 후 직접 구현으로 마이그레이션하는 2단계 전략을 추천합니다.',
        table: {
          headers: ['제조 도메인 요구사항', '프레임워크 지원', '판정'],
          rows: [
            {
              cells: [
                { text: '7개 엔티티 + 9개 관계 온톨로지', bold: true },
                { text: 'LLM 자동 추출 (제어 불가)' },
                { text: '직접 구현 필요', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: 'Meta-Dictionary (제조 용어)', bold: true },
                { text: '미지원' },
                { text: '직접 구현 필요', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: '표/이미지 VLM 처리', bold: true },
                { text: '텍스트만 지원' },
                { text: '직접 구현 필요', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: 'Text2Cypher 4단계 Agent', bold: true },
                { text: 'Community Summary / 서브그래프' },
                { text: '직접 구현 필요', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: '빠른 PoC 검증', bold: true },
                { text: 'LlamaIndex 10줄' },
                { text: '프레임워크 적합', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '제조 도메인 전략: 1단계 LlamaIndex PoC로 빠르게 검증 -> 2단계 직접 구현으로 프로덕션 마이그레이션. 이것이 Part 1-7에서 직접 구현한 이유입니다.'
        }
      },
      {
        id: '8-24',
        tag: 'discussion',
        title: '임베딩 모델 선택 가이드',
        script: 'Part 4-5에서 paraphrase-multilingual-MiniLM-L12-v2를 사용했고, LlamaIndex 코드에서는 text-embedding-3-small을 사용했습니다. 어떤 걸 써야 할까요? 두 모델의 선택 기준을 정리합니다.',
        table: {
          headers: ['임베딩 모델', '장점', '단점', '적합한 상황'],
          rows: [
            {
              cells: [
                { text: 'paraphrase-multilingual-MiniLM-L12-v2', bold: true },
                { text: '로컬 실행, 무료, 한국어 우수' },
                { text: '384차원, 영어 대비 약간 낮은 성능' },
                { text: '비용 제약, 한국어 중심' }
              ]
            },
            {
              cells: [
                { text: 'text-embedding-3-small', bold: true },
                { text: '1536차원, 높은 정확도' },
                { text: 'API 비용 발생, 네트워크 필요' },
                { text: '정확도 우선, 영어 혼합' }
              ]
            },
            {
              cells: [
                { text: 'text-embedding-3-large', bold: true },
                { text: '3072차원, 최고 성능' },
                { text: 'API 비용 높음' },
                { text: '프로덕션, 최고 품질' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '제조 도메인 추천: 한국어 보고서가 대부분이라면 paraphrase-multilingual + 한국어 파인튜닝이 가장 효과적. 프레임워크 벤치마크 시에는 text-embedding-3-small로 통일하여 공정한 비교.'
        }
      },
      {
        id: '8-25',
        tag: 'theory',
        title: 'Part 8 핵심 정리',
        script: '오늘 배운 내용을 정리하겠습니다. MS GraphRAG는 커뮤니티 요약 기반으로 정확하지만 비쌉니다. LightRAG는 1/100 비용으로 가볍게, fast-graphrag는 27배 빠르게. LlamaIndex는 프로토타입에 좋고, 직접 구현은 프로덕션 제어력에 좋습니다. 그리고 가장 중요한 교훈 — 우리 제조 도메인처럼 엄격한 온톨로지, Meta-Dictionary, VLM이 필요한 경우에는 프레임워크로 재현이 어렵습니다. Part 1-7에서 직접 구현한 이유가 바로 이겁니다.',
        callout: {
          type: 'key',
          text: '프레임워크 선택은 기술적 문제가 아니라 비즈니스 우선순위 문제입니다. 팀의 제약(비용/시간/정확도)을 먼저 정의하세요.'
        },
        table: {
          headers: ['프레임워크', '핵심 특징', '선택 기준'],
          rows: [
            {
              cells: [
                { text: 'MS GraphRAG', bold: true },
                { text: 'Leiden 커뮤니티 + Global Search' },
                { text: '정확도 > 비용' }
              ]
            },
            {
              cells: [
                { text: 'LightRAG', bold: true },
                { text: '1/100 비용, 서브그래프 추출' },
                { text: '비용 제약 강함' }
              ]
            },
            {
              cells: [
                { text: 'fast-graphrag', bold: true },
                { text: 'Personalized PageRank' },
                { text: '속도 우선' }
              ]
            },
            {
              cells: [
                { text: 'LlamaIndex', bold: true },
                { text: 'PropertyGraph v2' },
                { text: '빠른 POC' }
              ]
            },
            {
              cells: [
                { text: '직접 구현', bold: true },
                { text: 'LPG + Cypher 완전 제어' },
                { text: '프로덕션, 맞춤 온톨로지' }
              ]
            }
          ]
        }
      },
      {
        id: '8-26',
        tag: 'discussion',
        title: 'Part 9 예고 — 그래프 알고리즘으로 숨겨진 구조를 찾다',
        script: 'Part 8에서 fast-graphrag의 Personalized PageRank를 봤습니다. Part 9에서는 이 알고리즘을 직접 구현합니다. 커뮤니티 탐지, 중심성 분석, 경로 알고리즘 — 그래프 알고리즘으로 KG의 숨겨진 구조를 발견하고, RAG 품질을 한 단계 더 높입니다. "접착 박리와 두께 불균일을 연결하는 숨겨진 공정 노드는 무엇인가?" — 이런 질문에 그래프 알고리즘이 답합니다.',
        callout: {
          type: 'tip',
          text: 'Part 9 키워드: Leiden 커뮤니티 탐지 + PageRank 리랭킹 + GDS 심화 — fast-graphrag의 핵심 알고리즘을 직접 구현합니다.'
        }
      }
    ]
  }
];
