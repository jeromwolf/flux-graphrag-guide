export interface SlideContent {
  id: string;
  tag: 'theory' | 'demo' | 'practice' | 'discussion';
  title: string;
  script: string;
  visual?: string;
  code?: { language: string; code: string };
  table?: {
    headers: string[];
    rows: {
      cells: {
        text: string;
        status?: 'pass' | 'fail' | 'warn';
        bold?: boolean
      }[]
    }[]
  };
  diagram?: {
    nodes: {
      text: string;
      type: 'entity' | 'relation' | 'fail' | 'dim'
    }[]
  };
  callout?: {
    type: 'key' | 'tip' | 'warn';
    text: string
  };
}

export interface SectionContent {
  sectionId: string;
  slides: SlideContent[];
}

export const part1Content: SectionContent[] = [
  // Section 1: 벡터 RAG의 한계
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '1-1',
        tag: 'theory',
        title: '오프닝 — "이 질문에 답할 수 있나요?"',
        script: '여러분, RAG 해보신 분 많으시죠? 그런데 이런 질문 한번 보세요. "삼성전자에 투자한 기관 중에서, 해당 기관이 투자한 다른 반도체 기업은 뭐가 있어?" 벡터 RAG로 이거 답 나오시나요? 안 나옵니다.',
        visual: '화면 중앙에 질문 큰 글씨. 아래에 "벡터 RAG: ???" 표시.',
      },
      {
        id: '1-2',
        tag: 'theory',
        title: '벡터 RAG의 구조적 한계 — 청크 기반 맥락 단절',
        script: '벡터 RAG는 문서를 청크로 잘라서 임베딩하잖아요. 근데 자르는 순간, 맥락이 끊깁니다. A 청크에 "삼성전자 — 국민연금 투자"가 있고, B 청크에 "국민연금 — SK하이닉스 투자"가 있으면, 이 둘을 연결할 수 있는 방법이 없어요. 청크 사이의 관계가 사라지는 거죠.',
        diagram: {
          nodes: [
            { text: 'Chunk A', type: 'entity' },
            { text: '삼성전자←국민연금', type: 'relation' },
            { text: '✂️', type: 'dim' },
            { text: 'Chunk B', type: 'entity' },
            { text: '국민연금→SK하이닉스', type: 'relation' },
            { text: '❌ 관계 단절', type: 'fail' },
          ]
        }
      },
      {
        id: '1-3',
        tag: 'theory',
        title: '핵심 판단 기준 — "1-hop이면 벡터로 충분하다"',
        script: '판단 기준 하나 드릴게요. "1-hop이면 벡터로 충분하다." Multi-hop 질문이 필요한지, 그게 첫 번째 판단 기준입니다.',
        table: {
          headers: ['질문 유형', '예시', '벡터 RAG', 'GraphRAG'],
          rows: [
            {
              cells: [
                { text: '1-hop 질문', bold: true },
                { text: '"삼성전자의 주요 제품은?"' },
                { text: '✅', status: 'pass' },
                { text: '⚠️ 오버 엔지니어링', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'Multi-hop 질문', bold: true },
                { text: '"A에 투자한 B가 투자한 C는?"' },
                { text: '❌', status: 'fail' },
                { text: '✅', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '시간 추적', bold: true },
                { text: '"최근 3년간 투자 변화는?"' },
                { text: '❌', status: 'fail' },
                { text: '✅', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '1-hop = 벡터 RAG로 충분 | Multi-hop = GraphRAG 고려'
        }
      },
      {
        id: '1-4',
        tag: 'demo',
        title: '벡터 RAG 실패 데모',
        script: '실제로 벡터 RAG에 multi-hop 질문을 던져보면 이렇게 됩니다.',
        code: {
          language: 'python',
          code: `# 벡터 RAG 검색 실패 예시
query = "삼성전자에 투자한 기관이 투자한 다른 반도체 기업은?"
results = vector_search(query, top_k=5)

# Result:
# [Chunk A: "국민연금이 삼성전자 지분 8.7% 보유"]
# [Chunk B: "SK하이닉스는 DRAM 점유율 30%"]
# ❌ 두 청크를 연결할 수 없음`
        },
        callout: {
          type: 'warn',
          text: '벡터 RAG는 청크를 독립적으로 검색합니다. 두 청크를 연결해서 추론하는 것은 구조적으로 불가능합니다.'
        }
      }
    ]
  },
  // Section 2: 전략적 관점
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '2-1',
        tag: 'theory',
        title: 'GraphRAG 도입 판단 5단계',
        script: 'GraphRAG를 도입할지 말지, 5단계로 판단하세요.',
        diagram: {
          nodes: [
            { text: '1️⃣ 초기 인터뷰', type: 'entity' },
            { text: 'Multi-hop 질문 필요?', type: 'relation' },
            { text: '2️⃣ 온톨로지 설계', type: 'entity' },
            { text: '엔티티/관계 정의', type: 'relation' },
            { text: '3️⃣ 데이터 파이프라인', type: 'entity' },
            { text: 'LLM 추출 → Graph 저장', type: 'relation' },
            { text: '4️⃣ 검색 전략', type: 'entity' },
            { text: 'Cypher 쿼리 생성', type: 'relation' },
            { text: '5️⃣ 검증', type: 'entity' },
            { text: '실제 비즈니스 질문 테스트', type: 'relation' }
          ]
        },
        callout: {
          type: 'key',
          text: '초기 인터뷰가 가장 중요합니다. Multi-hop 질문이 없으면 GraphRAG는 오버 엔지니어링입니다.'
        }
      },
      {
        id: '2-2',
        tag: 'theory',
        title: '3가지 GraphRAG 경험 유형',
        script: 'GraphRAG를 경험하는 방법은 크게 3가지입니다. 우리는 Type 2로 갑니다.',
        table: {
          headers: ['유형', '검색 방식', '핵심 과제', '우리 과정'],
          rows: [
            {
              cells: [
                { text: 'Type 1: MS GraphRAG', bold: true },
                { text: 'Community Summary 기반' },
                { text: '커뮤니티 탐지 최적화' },
                { text: '❌', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: 'Type 2: LPG + Cypher', bold: true },
                { text: 'Graph 쿼리 직접 실행' },
                { text: '온톨로지 + Cypher 생성' },
                { text: '✅ 우리 방식', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Type 3: Hybrid', bold: true },
                { text: 'Vector + Graph 결합' },
                { text: 'Reranking 전략' },
                { text: '⚠️ 고급', status: 'warn' }
              ]
            }
          ]
        }
      },
      {
        id: '2-3',
        tag: 'theory',
        title: '전체 아키텍처 맛보기',
        script: '11시간 후에 우리가 만들 최종 시스템은 이렇게 생겼습니다. 지금은 이해 안 돼도 됩니다. Part 7 끝날 때 다시 보세요.',
        visual: 'Server(FastAPI) | RAG Pipeline(LangGraph) | Client(Next.js) 3단 구조. 화살표로 데이터 흐름 표시.',
        callout: {
          type: 'tip',
          text: '지금은 큰 그림만 보세요. Part 4-7에서 하나씩 구현합니다.'
        }
      }
    ]
  },
  // Section 3: 온톨로지 핵심만
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '3-1',
        tag: 'theory',
        title: '"온톨로지 = 합의의 도구"',
        script: '온톨로지는 "이 도메인에서 무엇을 엔티티로 보고, 무엇을 관계로 볼 것인가"에 대한 합의입니다.',
        table: {
          headers: ['도메인', '합의 필요성', '난이도', '예시'],
          rows: [
            {
              cells: [
                { text: '금융/투자', bold: true },
                { text: '엔티티: 기관, 종목, 섹터' },
                { text: '⭐⭐', status: 'warn' },
                { text: 'INVESTED_IN, SECTOR_OF' }
              ]
            },
            {
              cells: [
                { text: '보험/계약', bold: true },
                { text: '엔티티: 계약자, 상품, 병원' },
                { text: '⭐⭐⭐', status: 'fail' },
                { text: 'CLAIMS, COVERS' }
              ]
            },
            {
              cells: [
                { text: '학술/논문', bold: true },
                { text: '엔티티: 저자, 논문, 기관' },
                { text: '⭐', status: 'pass' },
                { text: 'AUTHORED, CITES' }
              ]
            }
          ]
        }
      },
      {
        id: '3-2',
        tag: 'theory',
        title: 'DB 스키마 vs LPG',
        script: 'RDB 스키마와 LPG는 이렇게 다릅니다.',
        table: {
          headers: ['구분', 'RDB (스키마)', 'LPG (온톨로지)'],
          rows: [
            {
              cells: [
                { text: '관계 표현', bold: true },
                { text: 'JOIN (외래키)' },
                { text: 'EDGE (직접 연결)' }
              ]
            },
            {
              cells: [
                { text: 'Multi-hop', bold: true },
                { text: 'Nested JOIN (느림)' },
                { text: 'BFS/DFS (빠름)' }
              ]
            },
            {
              cells: [
                { text: '스키마 변경', bold: true },
                { text: 'ALTER TABLE' },
                { text: '새 Label/Property 추가' }
              ]
            },
            {
              cells: [
                { text: '쿼리 언어', bold: true },
                { text: 'SQL' },
                { text: 'Cypher' }
              ]
            },
            {
              cells: [
                { text: '최적 시나리오', bold: true },
                { text: '트랜잭션, 정형 데이터' },
                { text: 'Multi-hop, 관계 추론' }
              ]
            }
          ]
        },
        code: {
          language: 'sql',
          code: `-- SQL: 3-hop JOIN
SELECT c.name FROM company c
JOIN investment i1 ON c.id = i1.company_id
JOIN investor inv ON i1.investor_id = inv.id
JOIN investment i2 ON inv.id = i2.investor_id
JOIN company c2 ON i2.company_id = c2.id

-- Cypher: 3-hop PATH
MATCH (c:Company)<-[:INVESTED_IN]-(inv)-[:INVESTED_IN]->(c2)
RETURN c2.name`
        }
      },
      {
        id: '3-3',
        tag: 'theory',
        title: '문서 내 관계 vs 문서 간 관계',
        script: '온톨로지 설계할 때 이 두 가지를 구분해야 합니다.',
        diagram: {
          nodes: [
            { text: '📄 문서 A', type: 'entity' },
            { text: '삼성전자 ← 국민연금 투자', type: 'relation' },
            { text: '(문서 내 관계)', type: 'dim' },
            { text: '📄 문서 B', type: 'entity' },
            { text: '국민연금 → SK하이닉스 투자', type: 'relation' },
            { text: '(문서 내 관계)', type: 'dim' },
            { text: '🔗 국민연금', type: 'entity' },
            { text: 'A와 B를 연결하는 공통 엔티티', type: 'relation' },
            { text: '(문서 간 관계)', type: 'dim' }
          ]
        },
        callout: {
          type: 'tip',
          text: 'LLM 추출 시 같은 엔티티를 정규화(normalization)해야 문서 간 관계가 연결됩니다.'
        }
      },
      {
        id: '3-4',
        tag: 'theory',
        title: 'Heterogeneous Graph — 보험 예시',
        script: '실무에서는 여러 타입의 노드와 관계가 섞입니다. 이걸 Heterogeneous Graph라고 합니다.',
        diagram: {
          nodes: [
            { text: '👤 계약자:Person', type: 'entity' },
            { text: 'PURCHASED', type: 'relation' },
            { text: '📋 보험상품:Product', type: 'entity' },
            { text: 'COVERS', type: 'relation' },
            { text: '🏥 병원:Hospital', type: 'entity' },
            { text: 'CLAIMS', type: 'relation' },
            { text: '💰 청구:Claim', type: 'entity' },
            { text: 'APPROVED_BY', type: 'relation' },
            { text: '👔 심사역:Agent', type: 'entity' }
          ]
        },
        callout: {
          type: 'tip',
          text: 'Heterogeneous Graph에서는 노드 타입별로 다른 임베딩 전략을 적용할 수 있습니다 (Part 5).'
        }
      }
    ]
  },
  // Section 4: 6레이어 프레임워크
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '4-1',
        tag: 'theory',
        title: '프레임워크 전체 흐름',
        script: '우리가 Part 1-7에서 배울 내용을 6개 Layer로 정리하면 이렇습니다.',
        diagram: {
          nodes: [
            { text: 'L1: Infra', type: 'entity' },
            { text: 'Neo4j + Docker', type: 'dim' },
            { text: 'L2: Ontology', type: 'entity' },
            { text: '엔티티/관계 정의', type: 'dim' },
            { text: 'L3: Extraction', type: 'entity' },
            { text: 'LLM → JSON → Graph', type: 'dim' },
            { text: 'L4: Retrieval', type: 'entity' },
            { text: 'Cypher 쿼리 생성', type: 'dim' },
            { text: 'L5: Advanced', type: 'entity' },
            { text: 'Hybrid, Temporal, HeteroRAG', type: 'dim' }
          ]
        },
        table: {
          headers: ['Layer', '핵심 내용', '담당 Part'],
          rows: [
            {
              cells: [
                { text: 'L1: Infra', bold: true },
                { text: 'Neo4j, Docker, Cypher 실습' },
                { text: 'Part 1' }
              ]
            },
            {
              cells: [
                { text: 'L2: Ontology', bold: true },
                { text: '온톨로지 설계, 스키마 정의' },
                { text: 'Part 2' }
              ]
            },
            {
              cells: [
                { text: 'L3: Extraction', bold: true },
                { text: 'LLM 기반 추출, JSON → Graph' },
                { text: 'Part 3' }
              ]
            },
            {
              cells: [
                { text: 'L4: Retrieval', bold: true },
                { text: 'Cypher 쿼리 생성, RAG 파이프라인' },
                { text: 'Part 4-5' }
              ]
            },
            {
              cells: [
                { text: 'L5: Advanced', bold: true },
                { text: 'Hybrid, Temporal, Heterogeneous' },
                { text: 'Part 6' }
              ]
            }
          ]
        }
      }
    ]
  },
  // Section 5: 인프라 — Why Neo4j
  {
    sectionId: 'sec5',
    slides: [
      {
        id: '5-1',
        tag: 'theory',
        title: '"왜 Neo4j인가" 한 줄 요약',
        script: 'Graph DB는 여러 가지가 있습니다. Neptune, TigerGraph, ArangoDB 등등. 우리가 Neo4j를 쓰는 이유는 딱 하나입니다. Neo4j = Cypher 쿼리 언어 + LLM 친화적 + 커뮤니티 + 무료 Docker 이미지. 실무에서는 AWS Neptune (Gremlin)이나 클라우드 Graph DB를 쓸 수도 있습니다. 하지만 학습 목적으로는 Neo4j가 가장 직관적입니다.',
        callout: {
          type: 'key',
          text: 'Neo4j의 Cypher 문법은 SQL과 비슷해서 배우기 쉽고, LLM이 이해하기 좋습니다.'
        }
      }
    ]
  },
  // Section 6: Neo4j + Cypher 실습
  {
    sectionId: 'sec6',
    slides: [
      {
        id: '6-1',
        tag: 'practice',
        title: 'Docker로 Neo4j 띄우기',
        script: '먼저 Neo4j를 로컬에서 띄워봅시다. Docker Compose 파일 하나면 됩니다.',
        code: {
          language: 'yaml',
          code: `# docker-compose.yml
version: '3.8'
services:
  neo4j:
    image: neo4j:5.15-community
    ports:
      - "7474:7474"  # Browser
      - "7687:7687"  # Bolt
    environment:
      NEO4J_AUTH: neo4j/password123
    volumes:
      - ./data:/data

# 실행
docker-compose up -d

# 브라우저에서 http://localhost:7474 접속`
        }
      },
      {
        id: '6-2',
        tag: 'practice',
        title: 'Cypher CREATE — 노드와 관계 생성',
        script: '이제 Cypher로 데이터를 만들어봅시다.',
        code: {
          language: 'cypher',
          code: `// 1. 노드 생성
CREATE (samsung:Company {name: "삼성전자", sector: "반도체"})
CREATE (nhpension:Investor {name: "국민연금", type: "기관"})
CREATE (sk:Company {name: "SK하이닉스", sector: "반도체"})

// 2. 관계 생성
MATCH (samsung:Company {name: "삼성전자"})
MATCH (nhpension:Investor {name: "국민연금"})
CREATE (nhpension)-[:INVESTED_IN {amount: 8.7, unit: "%"}]->(samsung)

MATCH (nhpension:Investor {name: "국민연금"})
MATCH (sk:Company {name: "SK하이닉스"})
CREATE (nhpension)-[:INVESTED_IN {amount: 5.2, unit: "%"}]->(sk)`
        }
      },
      {
        id: '6-3',
        tag: 'practice',
        title: 'Cypher MATCH — Multi-hop 쿼리',
        script: '이제 벡터 RAG가 못하던 질문을 해봅시다.',
        code: {
          language: 'cypher',
          code: `// "삼성전자에 투자한 기관이 투자한 다른 반도체 기업은?"
MATCH (samsung:Company {name: "삼성전자"})
      <-[:INVESTED_IN]-(investor:Investor)
      -[:INVESTED_IN]->(other:Company)
WHERE other.sector = "반도체" AND other <> samsung
RETURN investor.name, other.name

// Result:
// investor.name | other.name
// 국민연금      | SK하이닉스`
        },
        callout: {
          type: 'key',
          text: '이게 GraphRAG의 핵심입니다. Multi-hop 쿼리를 한 줄로 표현할 수 있습니다.'
        }
      },
      {
        id: '6-4',
        tag: 'practice',
        title: 'Neo4j Browser 시각화',
        script: 'Neo4j Browser에서 그래프를 시각화하면 관계가 한눈에 보입니다.',
        visual: 'Neo4j Browser 스크린샷: 국민연금 노드에서 삼성전자, SK하이닉스로 화살표가 뻗어나가는 그래프.',
        callout: {
          type: 'tip',
          text: '실무에서는 이 시각화로 온톨로지를 검증하고, 데이터 품질을 확인합니다.'
        }
      }
    ]
  }
];
