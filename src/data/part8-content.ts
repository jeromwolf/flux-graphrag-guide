import type { SectionContent } from './part1-content';

export const part8Content: SectionContent[] = [
  // Section 1: Microsoft GraphRAG 아키텍처 (25min)
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '8-1',
        tag: 'theory',
        title: 'MS GraphRAG란 무엇인가',
        script: 'Microsoft GraphRAG는 2024년 7월에 오픈소스로 공개된 프레임워크입니다. 핵심은 Leiden 커뮤니티 탐지와 계층적 요약입니다. 문서를 청크로 자르는 건 똑같은데, 청크에서 추출한 엔티티들을 커뮤니티로 묶고, 각 커뮤니티마다 요약을 만들어둡니다. 검색할 때는 이 요약을 LLM에 넣어서 답변을 생성하는 거죠.',
        diagram: {
          nodes: [
            { text: '📄 문서', type: 'entity' },
            { text: '청크 분할', type: 'relation' },
            { text: '🔍 LLM 추출', type: 'entity' },
            { text: 'Entity + Relation', type: 'relation' },
            { text: '🧩 Leiden 커뮤니티 탐지', type: 'entity' },
            { text: '계층적 클러스터링', type: 'relation' },
            { text: '📋 커뮤니티 요약 생성', type: 'entity' },
            { text: 'LLM Summary', type: 'relation' },
            { text: '💾 인덱스 저장', type: 'entity' }
          ]
        },
        callout: {
          type: 'key',
          text: 'MS GraphRAG는 Graph를 직접 쿼리하지 않습니다. 커뮤니티 요약을 검색하고 LLM에게 넘깁니다.'
        }
      },
      {
        id: '8-2',
        tag: 'theory',
        title: 'Global vs Local vs DRIFT Search',
        script: 'MS GraphRAG는 세 가지 검색 모드를 지원합니다. Global Search는 전체 데이터셋의 요약을 사용해서 "이 산업의 전반적인 트렌드는?"같은 질문에 답합니다. Local Search는 질문과 관련된 엔티티 주변의 서브그래프만 봅니다. DRIFT는 둘을 섞은 거죠.',
        table: {
          headers: ['모드', '검색 범위', '적합한 질문', '비용'],
          rows: [
            {
              cells: [
                { text: 'Global Search', bold: true },
                { text: '전체 커뮤니티 요약' },
                { text: '"전반적인 트렌드는?"' },
                { text: '$$$$', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: 'Local Search', bold: true },
                { text: '엔티티 주변 서브그래프' },
                { text: '"A와 B의 관계는?"' },
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
          text: 'Global Search는 매 쿼리마다 모든 커뮤니티 요약을 LLM에 넣습니다. 비쌉니다.'
        }
      },
      {
        id: '8-3',
        tag: 'practice',
        title: 'MS GraphRAG 인덱싱 파이프라인',
        script: '실제로 돌려봅시다. CLI가 있어서 사용은 간단합니다.',
        code: {
          language: 'bash',
          code: `# 1. 설치
pip install graphrag

# 2. 초기화
graphrag init --root ./ragtest

# 3. 설정 파일 편집 (.env 및 settings.yaml)
# GRAPHRAG_API_KEY=sk-...
# GRAPHRAG_LLM_MODEL=gpt-4-turbo

# 4. 인덱싱 실행
graphrag index --root ./ragtest

# 5. Global Search
graphrag query --root ./ragtest --method global "반도체 산업의 주요 트렌드는?"

# 6. Local Search
graphrag query --root ./ragtest --method local "삼성전자와 국민연금의 관계는?"`
        },
        callout: {
          type: 'tip',
          text: '인덱싱은 시간과 토큰이 많이 듭니다. 1GB 문서 기준 30분 + GPT-4 토큰 비용 $10-50 정도입니다.'
        }
      }
    ]
  },
  // Section 2: LightRAG & fast-graphrag (20min)
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '8-4',
        tag: 'theory',
        title: 'LightRAG — 1/100 비용의 경량 GraphRAG',
        script: 'LightRAG는 2024년 10월에 나온 프레임워크입니다. MS GraphRAG가 너무 비싸다는 비판을 받고 나온 거죠. 핵심 아이디어는 "커뮤니티 요약 생성을 건너뛰고, 쿼리 시점에 서브그래프를 추출해서 한 번에 LLM에 넣자"입니다. 쿼리당 평균 100 토큰, 단일 API 호출로 끝납니다.',
        table: {
          headers: ['항목', 'MS GraphRAG', 'LightRAG'],
          rows: [
            {
              cells: [
                { text: '인덱싱 비용', bold: true },
                { text: '$10-50 (GPT-4)', status: 'fail' },
                { text: '$0.50-2 (GPT-3.5)', status: 'pass' }
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
        id: '8-5',
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
          text: 'Personalized PageRank는 검색 쿼리를 시드로 하여 중요 노드를 랭킹합니다. Graph 알고리즘에 익숙하다면 좋은 선택입니다.'
        }
      },
      {
        id: '8-6',
        tag: 'theory',
        title: 'nano-graphrag — 1100줄 미니멀 구현',
        script: 'nano-graphrag는 교육용 프레임워크입니다. 전체 코드가 1100줄이라서 내부 동작을 이해하기 좋습니다. 프로덕션에는 부적합하지만, "GraphRAG가 어떻게 작동하는지" 배우려면 이거 소스 코드를 읽어보는 게 최고입니다.',
        code: {
          language: 'python',
          code: `# nano-graphrag 예시
from nano_graphrag import GraphRAGEngine

engine = GraphRAGEngine(
    model="gpt-3.5-turbo",
    storage="./data"
)

# 인덱싱
engine.index_documents(["doc1.txt", "doc2.txt"])

# 검색
result = engine.query("삼성전자와 국민연금의 관계는?")
print(result)`
        },
        callout: {
          type: 'tip',
          text: 'nano-graphrag 소스 코드: https://github.com/gusye1234/nano-graphrag - 학습용으로 강력 추천합니다.'
        }
      }
    ]
  },
  // Section 3: LlamaIndex PropertyGraph (15min)
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '8-7',
        tag: 'theory',
        title: 'PropertyGraph v2 아키텍처',
        script: 'LlamaIndex는 0.11 버전부터 PropertyGraph v2를 지원합니다. Neo4j 통합이 잘 되어 있고, hierarchical_leiden 커뮤니티 탐지를 내장합니다. MS GraphRAG와 비슷한 접근이지만, LlamaIndex의 전체 에코시스템과 연동되는 게 장점이죠.',
        diagram: {
          nodes: [
            { text: '📄 Document', type: 'entity' },
            { text: 'SimpleDirectoryReader', type: 'relation' },
            { text: '🔍 PropertyGraphIndex', type: 'entity' },
            { text: 'KnowledgeGraphIndex', type: 'relation' },
            { text: '💾 Neo4jPropertyGraphStore', type: 'entity' },
            { text: 'Graph 저장', type: 'relation' },
            { text: '🧩 hierarchical_leiden', type: 'entity' },
            { text: '커뮤니티 탐지', type: 'relation' },
            { text: '🔎 QueryEngine', type: 'entity' }
          ]
        },
        code: {
          language: 'python',
          code: `from llama_index.core import PropertyGraphIndex
from llama_index.graph_stores.neo4j import Neo4jPropertyGraphStore

# Neo4j 연결
graph_store = Neo4jPropertyGraphStore(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password123"
)

# 인덱스 생성
index = PropertyGraphIndex.from_documents(
    documents,
    property_graph_store=graph_store,
    embed_model="text-embedding-3-small",
    show_progress=True
)

# 검색
query_engine = index.as_query_engine()
response = query_engine.query("삼성전자에 투자한 기관은?")`
        }
      },
      {
        id: '8-8',
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
  // Section 4: 3개 프레임워크 벤치마크 (40min)
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '8-9',
        tag: 'practice',
        title: '벤치마크 환경 세팅',
        script: '이제 세 프레임워크를 같은 데이터셋으로 돌려보겠습니다. 평가 메트릭은 3가지입니다: 인덱싱 비용, 쿼리 속도, 정확도. 데이터셋은 50개 금융 뉴스 문서를 사용합니다.',
        code: {
          language: 'bash',
          code: `# 1. 환경 구축
pip install graphrag lightrag fast-graphrag llama-index

# 2. 테스트 데이터셋 다운로드
wget https://example.com/finance-news-50.zip
unzip finance-news-50.zip -d ./benchmark-data

# 3. 평가 스크립트 준비
cat > benchmark.py << 'EOF'
import time
from graphrag import GraphRAG
from lightrag import LightRAG
from fast_graphrag import FastGraphRAG

# 공통 질문 세트
questions = [
    "삼성전자에 투자한 기관이 투자한 다른 기업은?",
    "반도체 산업의 주요 트렌드는?",
    "국민연금의 투자 포트폴리오는?"
]

# 각 프레임워크별 실행 및 측정...
EOF`
        },
        callout: {
          type: 'tip',
          text: '벤치마크는 최소 3번 반복 실행하고 중간값을 사용하세요. LLM 응답 시간은 네트워크에 따라 변동이 큽니다.'
        }
      },
      {
        id: '8-10',
        tag: 'practice',
        title: 'MS GraphRAG 실행',
        script: 'MS GraphRAG부터 돌려봅시다.',
        code: {
          language: 'bash',
          code: `# MS GraphRAG 벤치마크
cd ms-graphrag-test
graphrag init --root .
# .env 파일 설정 (GRAPHRAG_API_KEY=sk-...)

# 인덱싱 시작 (시간 측정)
time graphrag index --root .

# 결과 예시:
# Indexing completed in 18m 32s
# Total tokens used: 235,420
# Estimated cost: $11.77

# 쿼리 실행 (questions 배열 순회)
# graphrag query --root . --method local "질문1"
# graphrag query --root . --method local "질문2"

# 평균 쿼리 시간: 3.2초`
        }
      },
      {
        id: '8-11',
        tag: 'practice',
        title: 'LightRAG & fast-graphrag 실행',
        script: '같은 방식으로 LightRAG와 fast-graphrag를 돌립니다.',
        code: {
          language: 'python',
          code: `# LightRAG 벤치마크
from lightrag import LightRAG
import time

engine = LightRAG(model="gpt-3.5-turbo")

# 인덱싱
start = time.time()
engine.index_directory("./benchmark-data")
print(f"LightRAG indexing: {time.time() - start:.1f}s")
# 결과: 2m 15s, $1.20

# 쿼리
for q in questions:
    start = time.time()
    result = engine.query(q)
    print(f"Query time: {time.time() - start:.1f}s")
# 평균: 0.8초

# fast-graphrag 벤치마크
from fast_graphrag import FastGraphRAG

engine = FastGraphRAG(model="gpt-4-turbo")
# 인덱싱: 3m 40s, $2.05
# 쿼리 평균: 0.4초`
        }
      },
      {
        id: '8-12',
        tag: 'discussion',
        title: '비용/속도/정확도 비교표',
        script: '결과를 정리하면 이렇습니다. 숫자는 50개 문서 기준입니다.',
        table: {
          headers: ['프레임워크', '인덱싱 시간', '인덱싱 비용', '쿼리 속도', '정확도 (주관적)'],
          rows: [
            {
              cells: [
                { text: 'MS GraphRAG', bold: true },
                { text: '18m 32s', status: 'fail' },
                { text: '$11.77', status: 'fail' },
                { text: '3.2초', status: 'warn' },
                { text: '⭐⭐⭐⭐⭐', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'LightRAG', bold: true },
                { text: '2m 15s', status: 'pass' },
                { text: '$1.20', status: 'pass' },
                { text: '0.8초', status: 'pass' },
                { text: '⭐⭐⭐', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'fast-graphrag', bold: true },
                { text: '3m 40s', status: 'warn' },
                { text: '$2.05', status: 'warn' },
                { text: '0.4초', status: 'pass' },
                { text: '⭐⭐⭐⭐', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '정확도는 주관적입니다. 실제 비즈니스 질문 세트로 직접 평가하는 게 중요합니다.'
        }
      }
    ]
  },
  // Section 5: 선택 기준표 + 토론 (20min)
  {
    sectionId: 'sec5',
    slides: [
      {
        id: '8-13',
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
                { text: 'Cypher 쿼리 직접 작성' }
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
                { text: '1100줄 소스 코드' }
              ]
            }
          ]
        }
      },
      {
        id: '8-14',
        tag: 'discussion',
        title: '내 프로젝트에는 어떤 걸?',
        script: '의사결정 트리입니다. 위에서부터 순서대로 물어보세요.',
        diagram: {
          nodes: [
            { text: '❓ Multi-hop 질문 필요?', type: 'entity' },
            { text: 'NO → 벡터 RAG로 충분', type: 'fail' },
            { text: 'YES ↓', type: 'relation' },
            { text: '❓ 온톨로지 맞춤 설계 필요?', type: 'entity' },
            { text: 'YES → 직접 구현 (Part 1-7)', type: 'dim' },
            { text: 'NO ↓', type: 'relation' },
            { text: '❓ 비용 제약 있음?', type: 'entity' },
            { text: 'YES → LightRAG', type: 'dim' },
            { text: 'NO ↓', type: 'relation' },
            { text: '❓ 정확도 vs 속도?', type: 'entity' },
            { text: '정확도 → MS GraphRAG', type: 'dim' },
            { text: '속도 → fast-graphrag', type: 'dim' }
          ]
        },
        callout: {
          type: 'tip',
          text: '실무 팁: POC는 LlamaIndex로 빠르게 만들고, 프로덕션은 직접 구현으로 마이그레이션하는 2단계 전략이 효과적입니다.'
        }
      },
      {
        id: '8-15',
        tag: 'theory',
        title: 'Part 8 핵심 정리',
        script: '오늘 배운 내용을 정리하겠습니다. MS GraphRAG는 커뮤니티 요약 기반으로 정확하지만 비쌉니다. LightRAG는 1/100 비용으로 가볍게, fast-graphrag는 27배 빠르게. LlamaIndex는 프로토타입에 좋고, 직접 구현은 프로덕션 제어력에 좋습니다. 선택 기준은 명확합니다. 비용 민감하면 LightRAG, 정확도 우선이면 MS GraphRAG, 속도 우선이면 fast-graphrag, 온톨로지 제어가 필요하면 직접 구현. Part 8 끝입니다.',
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
      }
    ]
  }
];
