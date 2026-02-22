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
        script: '여러분, RAG 해보신 분 많으시죠? 그런데 이런 질문 한번 보세요. 금융 쪽: "삼성전자에 투자한 기관이 투자한 다른 반도체 기업은?" 제조 쪽: "접착 박리 결함이 발생한 공정의 설비가 마지막으로 정비받은 날짜는?" 벡터 RAG로 이거 답 나오시나요? 안 나옵니다. 둘 다 정보가 여러 문서에 흩어져 있어서, 청크 검색으로는 연결이 안 돼요.',
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
          text: '1-hop = 벡터 RAG로 충분 | Multi-hop = GraphRAG 고려 | 데이터 100건 이하 = 프롬프트에 직접 넣기 | 실시간 트랜잭션 중심 = RDB 유지'
        }
      },
      {
        id: '1-4',
        tag: 'demo',
        title: '벡터 RAG 실패 데모',
        script: '실제로 벡터 RAG에 multi-hop 질문을 던져보면 이렇게 됩니다.',
        code: {
          language: 'python',
          code: `# ⚠️ 개념 설명용 의사코드 (실제 API는 Part 6에서)
# 벡터 RAG: 청크 단위 유사도 검색
query = "접착 박리 결함이 발생한 공정의 설비 정비 이력은?"
results = vector_store.similarity_search(query, k=5)

# 검색 결과 (유사한 청크 5개):
# [Chunk 1: "접착 박리는 브레이크 패드의 대표 결함이다"]
# [Chunk 2: "열압착 공정은 180도에서 진행된다"]
# [Chunk 3: "HP-01 설비는 월 1회 정비를 받는다"]
# ❌ 3개 청크가 각각 검색되지만, 연결이 안 됨
# → 결함→공정→설비→정비 경로를 추론할 수 없음`
        },
        callout: {
          type: 'warn',
          text: '벡터 RAG는 청크를 독립적으로 검색합니다. 두 청크를 연결해서 추론하는 것은 매우 어렵고 비효율적입니다. 이것이 GraphRAG가 필요한 이유입니다.'
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
        script: '실제로 GraphRAG 도입을 검토할 때 거치는 단계입니다. 처음엔 "일단 해보자"로 시작했다가 실패하고, 이 5단계가 만들어졌어요. 핵심은 Step 1 초기 인터뷰입니다. 현업 담당자에게 "평소에 어떤 질문을 하세요?"를 물어보세요. 예: "이 결함의 원인 공정은?" "이 설비가 영향 준 다른 제품은?" — 이런 질문이 3개 이상 나오면 GraphRAG를 고려할 가치가 있습니다.',
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
          text: '초기 인터뷰가 가장 중요합니다. Multi-hop 질문이 없으면 GraphRAG는 오버 엔지니어링입니다. 참고: PoC 기준 약 2주, Neo4j Community(무료) + OpenAI API(~$50/월) 수준입니다.'
        }
      },
      {
        id: '2-2',
        tag: 'theory',
        title: '3가지 GraphRAG 경험 유형',
        script: 'GraphRAG를 구현하는 방식이 여러 개인데, 실무에서 부딪혀보니 3가지로 나뉘더라고요. 우리는 Type 2(LPG + Cypher)를 선택했습니다. 이유가 있어요 — Type 1(MS GraphRAG)은 커뮤니티 요약 방식이라 Cypher를 안 써요. 근데 실무에서 "왜 이 답이 나왔지?" 디버깅하려면 Cypher 쿼리를 직접 볼 수 있어야 합니다.',
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
        script: '기초 과정(Part 1-7, 11시간) 후에 우리가 만들 시스템은 이렇게 생겼습니다. 지금은 이해 안 돼도 됩니다. Part 7 끝날 때 다시 보세요.',
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
        script: '온톨로지가 뭐냐 — 한마디로 "우리 팀이 합의한 데이터 사전"입니다. 쉬워 보이지만, 실제로 해보면 팀원 3명이 각각 다르게 뽑아요. 예를 들어 제조에서 "열압착 공정"이 하나의 엔티티인지, "열"과 "압착"이 각각 엔티티인지 — 이런 거 합의하는 데 보통 2-3일 걸립니다.',
        table: {
          headers: ['도메인', '합의 필요성', '난이도', '예시'],
          rows: [
            {
              cells: [
                { text: '제조/품질', bold: true },
                { text: '엔티티: 공정, 설비, 결함, 부품' },
                { text: '⭐⭐⭐⭐', status: 'fail' },
                { text: 'CAUSED_BY, INSPECTS' }
              ]
            },
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
                { text: 'N-1 JOIN 필요 (테이블 풀스캔 위험)' },
                { text: '인접 노드 탐색 O(degree) — JOIN 불필요' }
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
          text: '이렇게 여러 타입이 섞인 그래프를 Part 5에서 더 깊게 다룹니다.'
        }
      }
    ]
  },
  // Section 4: 5-Layer 프레임워크
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '4-1',
        tag: 'theory',
        title: '프레임워크 전체 흐름',
        script: '우리가 Part 1-7에서 배울 내용을 5개 Layer로 정리하면 이렇습니다. 핵심은 순환 구조입니다. 예를 들어, Text2Cypher 정확도가 60% 이하면 온톨로지 설계(L2)가 잘못된 겁니다. RAGAS 점수가 0.5 이하면 문제 정의(L1)부터 다시 봐야 합니다.',
        diagram: {
          nodes: [
            { text: 'L1: Strategy', type: 'entity' },
            { text: '도입 판단 + 문제 정의', type: 'dim' },
            { text: 'L2: Data', type: 'entity' },
            { text: '온톨로지 + KG 구축', type: 'dim' },
            { text: 'L3: Infra', type: 'entity' },
            { text: 'Neo4j + 파이프라인', type: 'dim' },
            { text: 'L4: Processing', type: 'entity' },
            { text: 'Text2Cypher + 검색', type: 'dim' },
            { text: 'L5: Deployment', type: 'entity' },
            { text: '평가 + 모니터링', type: 'dim' }
          ]
        },
        table: {
          headers: ['Layer', '핵심 내용', '담당 Part'],
          rows: [
            {
              cells: [
                { text: 'L1: Strategy', bold: true },
                { text: '도입 판단, 문제 정의, ROI 검토' },
                { text: 'Part 1' }
              ]
            },
            {
              cells: [
                { text: 'L2: Data', bold: true },
                { text: '온톨로지 설계, 수작업/자동 KG 구축' },
                { text: 'Part 2-4' }
              ]
            },
            {
              cells: [
                { text: 'L3: Infra', bold: true },
                { text: 'Neo4j, Docker, 멀티모달 파이프라인' },
                { text: 'Part 1, 5' }
              ]
            },
            {
              cells: [
                { text: 'L4: Processing', bold: true },
                { text: 'Text2Cypher, 하이브리드 검색' },
                { text: 'Part 6' }
              ]
            },
            {
              cells: [
                { text: 'L5: Deployment', bold: true },
                { text: '평가(RAGAS), 최적화, 모니터링' },
                { text: 'Part 7' }
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
        title: '이 과정에서 Neo4j를 쓰는 3가지 이유',
        script: 'Graph DB는 Neo4j 말고도 Neptune, TigerGraph, Kùzu 등 많습니다. GDBMS 비교는 Part 7에서 깊게 하고, 지금은 이 과정에서 Neo4j를 선택한 이유 3가지만 말씀드릴게요.',
        table: {
          headers: ['이유', '설명', '실무 영향'],
          rows: [
            {
              cells: [
                { text: '1. Cypher 문법', bold: true },
                { text: 'SQL과 유사하여 러닝커브 낮음' },
                { text: 'LLM이 Cypher를 잘 생성함 (Text2Cypher 핵심)' }
              ]
            },
            {
              cells: [
                { text: '2. LangChain 1급 지원', bold: true },
                { text: 'Neo4jGraph, Neo4jVector 공식 클래스' },
                { text: '10줄 코드로 GraphRAG 파이프라인 구축' }
              ]
            },
            {
              cells: [
                { text: '3. DB-engines 1위', bold: true },
                { text: '그래프 DB 분야 점유율 부동의 1위' },
                { text: '커뮤니티, 문서, 사례가 가장 풍부' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '다른 GDBMS와의 상세 비교(성능 벤치마크, 저장 방식, 비용)는 Part 7에서 다룹니다.'
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
services:
  neo4j:
    image: neo4j:5-community
    ports:
      - "7474:7474"  # Browser UI
      - "7687:7687"  # Bolt 프로토콜 (Python 연결용)
    environment:
      NEO4J_AUTH: neo4j/password123
    volumes:
      - neo4j_data:/data

volumes:
  neo4j_data:

# 실행: docker compose up -d
# 접속: http://localhost:7474 (ID: neo4j / PW: password123)
# ⚠️ 실무에서는 비밀번호를 .env 파일로 분리하세요`
        }
      },
      {
        id: '6-2',
        tag: 'practice',
        title: 'Cypher CREATE — 제조 도메인 그래프 생성',
        script: '이제 Cypher로 제조 도메인 데이터를 만들어봅시다. 브레이크 패드 품질 관리에 필요한 7개 노드와 5개 관계를 생성합니다.',
        code: {
          language: 'cypher',
          code: `// 1. 노드 7개 생성
CREATE (defect:Defect {name: "접착 박리", severity: "Critical"})
CREATE (process:Process {name: "접착 도포", temp: 80, unit: "°C"})
CREATE (equip:Equipment {name: "접착기 A-3", location: "2공장"})
CREATE (material:Material {name: "접착제 EP-200", vendor: "한국접착"})
CREATE (product:Product {name: "브레이크 패드 BP-100"})
CREATE (spec:Spec {name: "KS M 6613", type: "접착 강도"})
CREATE (maint:Maintenance {date: "2025-01-15", type: "정기 점검"})

// 2. 관계 5개 생성
CREATE (defect)-[:CAUSED_BY]->(process)
CREATE (process)-[:USES_EQUIPMENT]->(equip)
CREATE (process)-[:USES_MATERIAL]->(material)
CREATE (material)-[:CONFORMS_TO]->(spec)
CREATE (equip)-[:MAINTAINED_ON]->(maint)`
        }
      },
      {
        id: '6-3',
        tag: 'practice',
        title: 'Cypher MATCH — 4-hop 제조 질의',
        script: '이제 벡터 RAG가 못하던 질문을 해봅시다. "접착 박리 결함의 원인 공정에서 사용하는 설비의 마지막 정비 일자는?" — 이게 4-hop이고, 벡터 RAG로는 절대 불가능한 질의입니다.',
        code: {
          language: 'cypher',
          code: `// "접착 박리 결함 → 원인 공정 → 사용 설비 → 정비 이력"
MATCH (d:Defect {name: "접착 박리"})
      -[:CAUSED_BY]->(p:Process)
      -[:USES_EQUIPMENT]->(e:Equipment)
      -[:MAINTAINED_ON]->(m:Maintenance)
RETURN d.name, p.name, e.name, m.date

// Result:
// d.name    | p.name    | e.name      | m.date
// 접착 박리  | 접착 도포  | 접착기 A-3  | 2025-01-15`
        },
        callout: {
          type: 'key',
          text: '이게 GraphRAG의 핵심입니다. 4-hop 질의를 Cypher 한 줄로 표현하고, 벡터 RAG와의 차이를 체감하세요.'
        }
      },
      {
        id: '6-4',
        tag: 'practice',
        title: 'Neo4j Browser 시각화',
        script: 'Neo4j Browser에서 그래프를 시각화하면 결함→공정→설비→정비의 관계가 한눈에 보입니다.',
        visual: 'Neo4j Browser 스크린샷: Defect(접착 박리) → Process(접착 도포) → Equipment(접착기 A-3) → Maintenance(2025-01-15) 경로가 시각화된 그래프. Material과 Spec 노드도 연결되어 총 7노드 5관계.',
        callout: {
          type: 'tip',
          text: '실무에서는 이 시각화로 온톨로지를 검증하고, 데이터 품질을 확인합니다.'
        }
      },
      {
        id: '6-5',
        tag: 'practice',
        title: 'Part 1 실습 체크리스트',
        script: '여기까지 잘 따라오셨으면, 아래 검증 쿼리를 실행해보세요. 전부 통과하면 Part 1 실습 완료입니다.',
        code: {
          language: 'cypher',
          code: `// ✅ 검증 1: 노드 수 확인 (7개면 정상)
MATCH (n) RETURN count(n) AS total_nodes
// → 7

// ✅ 검증 2: 관계 수 확인 (5개면 정상)
MATCH ()-[r]->() RETURN count(r) AS total_rels
// → 5

// ✅ 검증 3: 4-hop 경로 확인
MATCH (d:Defect)-[:CAUSED_BY]->(p)-[:USES_EQUIPMENT]->(e)-[:MAINTAINED_ON]->(m)
RETURN d.name, p.name, e.name, m.date
// → 1행이 반환되면 성공`
        },
        callout: {
          type: 'key',
          text: 'Part 2에서는 제조 도메인 문서에서 직접 엔티티와 관계를 추출합니다. 수작업의 고통을 체감하면 Part 3의 LLM 자동화가 왜 필요한지 절로 이해됩니다.'
        }
      }
    ]
  }
];
