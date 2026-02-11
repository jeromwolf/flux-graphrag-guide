import type { SectionContent, SlideContent } from './part1-content';

export const part7Content: SectionContent[] = [
  // Section 1: 품질 평가
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '1-1',
        tag: 'theory',
        title: 'RAGAS 평가 프레임워크',
        script: 'GraphRAG 시스템의 품질을 어떻게 측정할까요? RAGAS는 RAG 시스템을 평가하는 표준 프레임워크입니다. 4가지 메트릭으로 구성됩니다. Faithfulness는 답변이 검색 결과에 근거하는지(환각 방지), Answer Relevancy는 답변이 질문에 적절한지, Context Precision은 검색된 문맥이 정확한지, Context Recall은 필요한 정보가 모두 검색됐는지를 측정합니다.',
        table: {
          headers: ['메트릭', '설명', '측정 대상'],
          rows: [
            {
              cells: [
                { text: 'Faithfulness', bold: true },
                { text: '답변이 검색 결과에 근거하는가' },
                { text: '환각 방지' }
              ]
            },
            {
              cells: [
                { text: 'Answer Relevancy', bold: true },
                { text: '답변이 질문에 적절한가' },
                { text: '관련성' }
              ]
            },
            {
              cells: [
                { text: 'Context Precision', bold: true },
                { text: '검색된 문맥이 정확한가' },
                { text: '검색 품질' }
              ]
            },
            {
              cells: [
                { text: 'Context Recall', bold: true },
                { text: '필요한 정보가 모두 검색됐는가' },
                { text: '완전성' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'RAGAS: RAG 시스템 평가의 표준 — Faithfulness, Relevancy, Precision, Recall'
        }
      },
      {
        id: '1-2',
        tag: 'theory',
        title: '질문 난이도 3단계',
        script: '평가 데이터셋을 만들 때, 질문 난이도를 3단계로 나눕니다. Easy는 1-hop 질문으로 "삼성전자 CEO는?"처럼 직접 답변 가능한 것. Medium은 2-hop 질문으로 "삼성 투자기관은?"처럼 한 단계 관계 추적. Hard는 Multi-hop 질문으로 "삼성 투자기관의 다른 투자처는?"처럼 여러 단계 추론이 필요한 것. Hard 질문에서 GraphRAG의 진가가 발휘됩니다.',
        table: {
          headers: ['난이도', '예시', '벡터 RAG', 'GraphRAG'],
          rows: [
            {
              cells: [
                { text: 'Easy (1-hop)', bold: true },
                { text: '삼성전자 CEO는?' },
                { text: '✅', status: 'pass' },
                { text: '✅', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Medium (2-hop)', bold: true },
                { text: '삼성 투자기관은?' },
                { text: '⚠️', status: 'warn' },
                { text: '✅', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Hard (Multi-hop)', bold: true },
                { text: '삼성 투자기관의 다른 투자처는?' },
                { text: '❌', status: 'fail' },
                { text: '✅', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: 'Hard 질문에서 GraphRAG 진가 발휘 — 벡터 RAG는 불가능'
        }
      },
      {
        id: '1-3',
        tag: 'theory',
        title: 'Multi-hop 추론 4유형',
        script: 'Multi-hop 질문도 유형이 있습니다. Bridge는 A→B→C 순차 이동으로 "투자자→기업→제품". Comparison은 A와 B를 비교로 "어느 기업이 더 많이 투자?". Intersection은 A와 B의 교집합으로 "두 기업의 공통 투자자". Composition은 여러 관계를 조합으로 "투자자 Top 3의 포트폴리오".',
        table: {
          headers: ['유형', '설명', '예시'],
          rows: [
            {
              cells: [
                { text: 'Bridge', bold: true },
                { text: 'A→B→C 순차 이동' },
                { text: '투자자→기업→제품' }
              ]
            },
            {
              cells: [
                { text: 'Comparison', bold: true },
                { text: 'A와 B를 비교' },
                { text: '어느 기업이 더 많이 투자?' }
              ]
            },
            {
              cells: [
                { text: 'Intersection', bold: true },
                { text: 'A와 B의 교집합' },
                { text: '두 기업의 공통 투자자' }
              ]
            },
            {
              cells: [
                { text: 'Composition', bold: true },
                { text: '여러 관계를 조합' },
                { text: '투자자 Top 3의 포트폴리오' }
              ]
            }
          ]
        }
      },
      {
        id: '1-3b',
        tag: 'theory',
        title: 'Multi-hop + Common Knowledge 메트릭',
        script: '평가에서 흔히 놓치는 게 Common Knowledge 메트릭입니다. Multi-hop 질문은 여러 관계를 따라가야 하는 질문이고, Common Knowledge는 그래프에 명시되지 않은 일반 상식이 필요한 질문입니다. 예를 들어 "반도체를 만드는 한국 기업은?"은 Common Knowledge입니다. 그래프에 "반도체 제조 기업" 관계가 없어도 상식적으로 답할 수 있어야 해요. Multi-hop은 그래프 구조가 잘 되어있으면 잘 답할 수 있지만, Common Knowledge는 LLM의 사전 지식에 의존합니다. 그래서 평가할 때 두 유형을 분리해서 측정해야 합니다. Multi-hop 성능이 높은데 Common Knowledge가 낮으면, LLM의 일반 지식 활용을 개선해야 하는 거죠.',
        table: {
          headers: ['메트릭', '정의', '의존 대상', '개선 방법'],
          rows: [
            {
              cells: [
                { text: 'Multi-hop', bold: true },
                { text: '여러 관계를 따라가는 추론' },
                { text: '그래프 구조', status: 'pass' },
                { text: '온톨로지 + 관계 품질' }
              ]
            },
            {
              cells: [
                { text: 'Common Knowledge', bold: true },
                { text: '그래프에 없는 일반 상식 활용' },
                { text: 'LLM 사전 지식', status: 'warn' },
                { text: 'LLM 선택 + 프롬프트' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '평가 시 Multi-hop과 Common Knowledge를 분리 측정해야 정확한 병목 파악 가능'
        }
      },
      {
        id: '1-4',
        tag: 'practice',
        title: '평가 데이터셋 설계',
        script: '평가 데이터셋은 난이도별로 균형 있게 구성해야 합니다. 각 질문마다 Golden answer(정답)을 반드시 포함하세요. 난이도와 hop 수를 명시하면 나중에 분석할 때 유용합니다.',
        code: {
          language: 'python',
          code: `from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy

eval_dataset = [
    {
        "question": "삼성전자 CEO는?",
        "answer": "이재용",
        "difficulty": "easy",
        "hops": 1
    },
    {
        "question": "삼성 투자기관의 투자처?",
        "answer": "SK하이닉스",
        "difficulty": "hard",
        "hops": 3
    },
]

# RAGAS 평가 실행
results = evaluate(
    dataset=eval_dataset,
    metrics=[faithfulness, answer_relevancy]
)`
        },
        callout: {
          type: 'tip',
          text: '난이도별 균형 있게 구성, Golden answer 필수'
        }
      },
      {
        id: '1-4b',
        tag: 'theory',
        title: 'Baseline 비교 — 벡터 RAG vs GraphRAG',
        script: 'GraphRAG가 정말 좋은지 판단하려면 Baseline 비교가 필수입니다. 벡터 RAG를 Baseline으로 설정하고, 같은 질문셋으로 두 시스템을 비교합니다. Easy 질문에서는 벡터 RAG도 잘 합니다. 정확도 차이가 5% 이내일 수 있어요. Medium 질문에서부터 차이가 나기 시작합니다. 벡터 RAG는 관련 청크를 찾지만 관계를 추론하지 못합니다. Hard 질문에서 GraphRAG의 가치가 드러납니다. 벡터 RAG는 거의 불가능한 Multi-hop 추론을 GraphRAG는 처리합니다. 이 비교 데이터가 있어야 "우리 프로젝트에 GraphRAG가 필요한가?"를 데이터로 판단할 수 있습니다.',
        table: {
          headers: ['난이도', '벡터 RAG (Baseline)', 'GraphRAG', '차이'],
          rows: [
            {
              cells: [
                { text: 'Easy (1-hop)', bold: true },
                { text: '~90%', status: 'pass' },
                { text: '~92%', status: 'pass' },
                { text: '+2% (미미)' }
              ]
            },
            {
              cells: [
                { text: 'Medium (2-hop)', bold: true },
                { text: '~65%', status: 'warn' },
                { text: '~85%', status: 'pass' },
                { text: '+20% (유의미)' }
              ]
            },
            {
              cells: [
                { text: 'Hard (Multi-hop)', bold: true },
                { text: '~30%', status: 'fail' },
                { text: '~80%', status: 'pass' },
                { text: '+50% (압도적)' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'Baseline 비교 필수 — Hard 질문이 많은 도메인일수록 GraphRAG ROI가 높음'
        }
      },
      {
        id: '1-5',
        tag: 'theory',
        title: 'LLM 평가 바이어스 → 교차 평가',
        script: 'LLM-as-Judge를 쓸 때 주의하세요. 자기 모델 편향이 있습니다. GPT-4로 GPT-4 답변을 평가하면 점수가 높게 나와요. 해결책은 교차 평가입니다. GPT-4 답변은 Claude로, Claude 답변은 GPT-4로 평가합니다. 그리고 인간 평가 샘플 10~20개를 확보해서 LLM 평가와 상관계수를 구합니다. 상관계수 0.7 이상이면 LLM 평가를 신뢰할 수 있습니다.',
        table: {
          headers: ['평가 방식', '장점', '주의점'],
          rows: [
            {
              cells: [
                { text: '단일 LLM 평가', bold: true },
                { text: '빠르고 저렴' },
                { text: '자기 모델 편향', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: '교차 평가', bold: true },
                { text: '편향 감소' },
                { text: '비용 2배', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: '인간 + LLM', bold: true },
                { text: '신뢰도 검증 가능', status: 'pass' },
                { text: '샘플 10~20개 필요' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '상관계수 0.7 이상이면 LLM 평가를 신뢰할 수 있다'
        }
      }
    ]
  },
  // Section 2: 실패 케이스 + 트러블슈팅
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '2-1',
        tag: 'theory',
        title: '자주 만나는 실패 패턴',
        script: '실무에서 자주 만나는 실패 패턴 4가지를 보겠습니다. LLM 환각 관계는 프롬프트가 부족해서 발생하므로 Meta-Dictionary를 강화하세요. VLM 표 오독은 복잡한 셀 병합 때문이므로 전처리와 검증 단계를 추가하세요. Text2Cypher 실패는 스키마 불일치 때문이므로 Schema Tuning을 하세요. 검색 비용 폭발은 깊은 Multi-hop 때문이므로 depth 제한과 가지치기를 적용하세요.',
        table: {
          headers: ['실패 패턴', '원인', '해결책'],
          rows: [
            {
              cells: [
                { text: 'LLM 환각 관계', bold: true },
                { text: '프롬프트 부족' },
                { text: 'Meta-Dictionary 강화' }
              ]
            },
            {
              cells: [
                { text: 'VLM 표 오독', bold: true },
                { text: '복잡한 셀 병합' },
                { text: '전처리 + 검증 단계' }
              ]
            },
            {
              cells: [
                { text: 'Text2Cypher 실패', bold: true },
                { text: '스키마 불일치' },
                { text: 'Schema Tuning' }
              ]
            },
            {
              cells: [
                { text: '검색 비용 폭발', bold: true },
                { text: '깊은 Multi-hop' },
                { text: 'depth 제한 + 가지치기' }
              ]
            }
          ]
        }
      },
      {
        id: '2-2',
        tag: 'theory',
        title: '좌절 금지 — 현실적 기대치',
        script: 'GraphRAG는 만능이 아닙니다. 완벽한 KG는 없습니다. 도메인에 맞는 "적절한 기대치"를 설정하고, 지속적으로 개선하는 것이 핵심입니다. 첫 시도에서 100% 정확도를 기대하지 마세요. 80%부터 시작해서 점진적으로 개선하세요.',
        diagram: {
          nodes: [
            { text: '1차 시도', type: 'entity' },
            { text: '정확도 60-70%', type: 'dim' },
            { text: '프롬프트 개선', type: 'relation' },
            { text: '2차 시도', type: 'entity' },
            { text: '정확도 75-85%', type: 'dim' },
            { text: 'Schema Tuning', type: 'relation' },
            { text: '3차 시도', type: 'entity' },
            { text: '정확도 85-95%', type: 'dim' }
          ]
        },
        callout: {
          type: 'warn',
          text: '완벽한 KG는 없다. 지속적으로 개선하는 것이 핵심'
        }
      }
    ]
  },
  // Section 3: GDBMS + 성능 최적화
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '3-1',
        tag: 'theory',
        title: 'GDBMS 선정 3기준',
        script: 'Graph Database를 선정할 때 3가지 기준을 보세요. 생태계는 DB-engines 랭킹과 커뮤니티를 확인하고, LangChain/LlamaIndex 연동이 되는지 체크하세요. 성능은 LDBC 벤치마크와 연산 복잡도를 보세요. get_neighbors가 O(d)인지 O(V)인지 확인하세요. 적합성은 저장 방식과 쿼리 언어를 보세요. LPG vs RDF, Cypher vs SPARQL.',
        table: {
          headers: ['기준', '설명', '체크 포인트'],
          rows: [
            {
              cells: [
                { text: '생태계', bold: true },
                { text: 'DB-engines 랭킹, 커뮤니티' },
                { text: 'LangChain/LlamaIndex 연동' }
              ]
            },
            {
              cells: [
                { text: '성능', bold: true },
                { text: 'LDBC 벤치마크, 연산 복잡도' },
                { text: 'get_neighbors O(d) vs O(V)' }
              ]
            },
            {
              cells: [
                { text: '적합성', bold: true },
                { text: '저장 방식, 쿼리 언어' },
                { text: 'LPG vs RDF, Cypher vs SPARQL' }
              ]
            }
          ]
        }
      },
      {
        id: '3-1b',
        tag: 'theory',
        title: 'GDBMS 선정 — 상세 기준 분석',
        script: '각 기준을 더 자세히 살펴봅시다. 생태계에서는 DB-engines 랭킹을 확인하세요. Neo4j가 2024년 기준 1위이고 2위와 격차가 큽니다. LangChain, LlamaIndex와의 공식 연동도 중요합니다. Neo4j는 공식 패키지가 있지만 다른 GDBMS는 커뮤니티 수준인 경우가 많아요. 성능에서는 LDBC 벤치마크가 표준입니다. 특히 GraphRAG에서 중요한 연산인 get_neighbors의 복잡도를 보세요. Neo4j는 인접 리스트 기반이라 O(d)입니다. d는 해당 노드의 degree(연결 수)예요. 반면 매트릭스 기반 저장소는 O(V)로, 전체 노드 수에 비례합니다. 노드가 100만 개인데 연결이 10개면 O(10) vs O(100만)이니 엄청난 차이죠. 적합성에서는 저장 방식을 보세요. LPG(Labeled Property Graph) vs RDF, Cypher vs SPARQL. GraphRAG에는 LPG + Cypher 조합이 가장 자연스럽습니다.',
        table: {
          headers: ['기준', '세부 항목', 'Neo4j', '비고'],
          rows: [
            {
              cells: [
                { text: '생태계', bold: true },
                { text: 'DB-engines 랭킹' },
                { text: '1위 (격차 큼)', status: 'pass' },
                { text: '2위 대비 점수 2배+' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'LangChain 연동' },
                { text: '공식 패키지', status: 'pass' },
                { text: 'langchain-neo4j' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'LlamaIndex 연동' },
                { text: '공식 지원', status: 'pass' },
                { text: 'PropertyGraphIndex' }
              ]
            },
            {
              cells: [
                { text: '성능', bold: true },
                { text: 'LDBC 벤치마크' },
                { text: '검증 완료', status: 'pass' },
                { text: 'SNB Interactive' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'get_neighbors 복잡도' },
                { text: 'O(d) — 인접 리스트', status: 'pass' },
                { text: 'd=degree, 매트릭스는 O(V)' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: '그래프 표현 방식' },
                { text: 'Native Graph Storage' },
                { text: 'Index-free adjacency' }
              ]
            },
            {
              cells: [
                { text: '적합성', bold: true },
                { text: '데이터 모델' },
                { text: 'LPG (Labeled Property Graph)', status: 'pass' },
                { text: 'RDF보다 직관적' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: '쿼리 언어' },
                { text: 'Cypher', status: 'pass' },
                { text: '패턴 매칭에 최적' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'get_neighbors O(d) vs O(V) — GraphRAG에서 가장 중요한 성능 지표. 인접 리스트 기반이 필수'
        }
      },
      {
        id: '3-1c',
        tag: 'theory',
        title: '그래프 표현 방식과 성능 차이',
        script: '그래프를 저장하는 방법에 따라 성능이 크게 달라집니다. 4가지 표현 방식이 있습니다. Adjacency Matrix는 노드 x 노드 행렬로, 공간은 O(V²)이고 이웃 탐색은 O(V)입니다. Edge List는 (source, target) 쌍의 리스트로, 공간은 O(E)이고 이웃 탐색은 O(E)입니다. Adjacency List(연결 리스트)는 각 노드별 이웃 목록으로, 공간은 O(V+E)이고 이웃 탐색은 O(d)입니다. CSR(Compressed Sparse Row)은 압축된 행 표현으로, 공간은 O(V+E)이고 이웃 탐색은 O(d)입니다. Neo4j는 Adjacency List 기반의 Native Graph Storage를 사용해서 get_neighbors가 O(d)입니다. GraphRAG에서 서브그래프 탐색이 핵심이므로, 이 O(d) 특성이 결정적입니다.',
        table: {
          headers: ['표현 방식', '공간', 'get_neighbors', 'GraphRAG 적합성'],
          rows: [
            {
              cells: [
                { text: 'Adjacency Matrix', bold: true },
                { text: 'O(V²)' },
                { text: 'O(V)', status: 'fail' },
                { text: '부적합 (대규모 불가)' }
              ]
            },
            {
              cells: [
                { text: 'Edge List', bold: true },
                { text: 'O(E)' },
                { text: 'O(E)', status: 'warn' },
                { text: '단순하지만 느림' }
              ]
            },
            {
              cells: [
                { text: 'Adjacency List', bold: true },
                { text: 'O(V+E)' },
                { text: 'O(d)', status: 'pass' },
                { text: '최적 (Neo4j)' }
              ]
            },
            {
              cells: [
                { text: 'CSR', bold: true },
                { text: 'O(V+E)' },
                { text: 'O(d)', status: 'pass' },
                { text: '분석용 최적' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'O(d) vs O(V) — 100만 노드, 평균 degree 10이면: O(10) vs O(1,000,000). 10만 배 차이'
        }
      },
      {
        id: '3-2',
        tag: 'theory',
        title: 'GDBMS 비교 — Neo4j vs Kùzu vs FalkorDB',
        script: 'Neo4j는 Native Graph로 생태계가 1위이고 검증된 성능을 가지고 있습니다. GraphRAG에 최적입니다. Kùzu는 Embedded 방식으로 인메모리라 빠르지만 생태계가 작습니다. 분석에 최적화되어 있습니다. FalkorDB는 Redis 기반으로 빠르지만 생태계가 작습니다. 캐시에 최적화되어 있습니다.',
        table: {
          headers: ['항목', 'Neo4j', 'Kùzu', 'FalkorDB'],
          rows: [
            {
              cells: [
                { text: '유형', bold: true },
                { text: 'Native Graph' },
                { text: 'Embedded' },
                { text: 'Redis-based' }
              ]
            },
            {
              cells: [
                { text: '라이선스', bold: true },
                { text: 'Community/Enterprise' },
                { text: 'MIT' },
                { text: 'Redis Source' }
              ]
            },
            {
              cells: [
                { text: '성능', bold: true },
                { text: '✅ 검증됨', status: 'pass' },
                { text: '✅ 빠름 (인메모리)', status: 'pass' },
                { text: '✅ 빠름', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '생태계', bold: true },
                { text: '✅ 1위', status: 'pass' },
                { text: '⚠️ 작음', status: 'warn' },
                { text: '⚠️ 작음', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: '적합성', bold: true },
                { text: 'GraphRAG 최적' },
                { text: '분석 최적' },
                { text: '캐시 최적' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'Neo4j: GraphRAG 최적 선택 — 생태계 1위, 검증된 성능, LangChain 공식 지원'
        }
      },
      {
        id: '3-3',
        tag: 'theory',
        title: 'Graph Query Languages',
        script: 'Graph 쿼리 언어도 여러 가지가 있습니다. Cypher는 Neo4j에서 사용하고 패턴 매칭이 직관적입니다. Gremlin은 JanusGraph, Neptune에서 사용하고 순회 기반으로 범용적입니다. GSQL은 TigerGraph에서 사용하고 SQL 유사 문법으로 분석에 강점이 있습니다. GQL은 ISO 표준(2024)으로 Cypher를 계승한 차세대 표준입니다.',
        table: {
          headers: ['언어', 'GDBMS', '특징'],
          rows: [
            {
              cells: [
                { text: 'Cypher', bold: true },
                { text: 'Neo4j' },
                { text: '패턴 매칭, 직관적' }
              ]
            },
            {
              cells: [
                { text: 'Gremlin', bold: true },
                { text: 'JanusGraph, Neptune' },
                { text: '순회 기반, 범용' }
              ]
            },
            {
              cells: [
                { text: 'GSQL', bold: true },
                { text: 'TigerGraph' },
                { text: 'SQL 유사, 분석 강점' }
              ]
            },
            {
              cells: [
                { text: 'GQL', bold: true },
                { text: 'ISO 표준 (2024)' },
                { text: 'Cypher 계승, 차세대 표준' }
              ]
            }
          ]
        }
      },
      {
        id: '3-4',
        tag: 'theory',
        title: 'Neo4j 성능 최적화 7가지',
        script: 'Neo4j 성능 최적화는 7가지 방법이 있습니다. 1) 인덱스 생성(노드 라벨, 프로퍼티). 2) 쿼리 프로파일링(PROFILE, EXPLAIN). 3) APOC 활용(병렬 처리, 배치). 4) 배치 처리(UNWIND, APOC Batch). 5) 읽기 트랜잭션(READ 명시). 6) 파라미터화(쿼리 캐싱). 7) 캐싱(애플리케이션 레벨).',
        code: {
          language: 'cypher',
          code: `// 1. 인덱스 생성
CREATE INDEX company_name IF NOT EXISTS FOR (c:Company) ON (c.name)

// 2. 쿼리 프로파일링
PROFILE MATCH (c:Company {name: "삼성전자"}) RETURN c

// 3. APOC 병렬 처리
CALL apoc.periodic.iterate(
  "MATCH (c:Company) RETURN c",
  "SET c.processed = true",
  {batchSize:1000, parallel:true}
)

// 4. 배치 처리
UNWIND $batch AS row
MERGE (c:Company {name: row.name})

// 5. 읽기 트랜잭션
MATCH (c:Company) RETURN c // READ`
        }
      },
      {
        id: '3-5',
        tag: 'theory',
        title: 'GraphScope Flex — 대규모 그래프',
        script: '대규모 그래프라면 GraphScope Flex도 참고하세요. 알리바바 오픈소스이고, SIGMOD 2024 논문으로 발표됐습니다. 그래프 저장, 쿼리, 분석을 모듈화해서 유연하게 조합합니다. 수십억 노드 규모에서 고려할 아키텍처입니다.',
        table: {
          headers: ['항목', 'GraphScope Flex', 'Neo4j'],
          rows: [
            {
              cells: [
                { text: '대상 규모', bold: true },
                { text: '수십억 노드', status: 'pass' },
                { text: '수백만 노드' }
              ]
            },
            {
              cells: [
                { text: '아키텍처', bold: true },
                { text: '모듈화 (저장/쿼리/분석 분리)' },
                { text: '통합 (All-in-one)' }
              ]
            },
            {
              cells: [
                { text: '출처', bold: true },
                { text: '알리바바, SIGMOD 2024' },
                { text: 'Neo4j Inc.' }
              ]
            },
            {
              cells: [
                { text: '생태계', bold: true },
                { text: '⚠️ 성장 중', status: 'warn' },
                { text: '✅ 1위', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '프로덕션 → Neo4j / 대규모 분석 → GraphScope Flex'
        }
      }
    ]
  },
  // Section 4: 모니터링 + CI/CD
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '4-1',
        tag: 'theory',
        title: '모니터링 도구',
        script: 'LLM 호출을 추적하는 모니터링 도구는 3가지가 있습니다. LangSmith는 LangChain 공식 도구입니다. LangFuse는 오픈소스 대안으로 Self-hosted 가능합니다. Opik는 Comet ML의 경량 추적 도구입니다.',
        table: {
          headers: ['도구', '용도', '특징'],
          rows: [
            {
              cells: [
                { text: 'LangSmith', bold: true },
                { text: 'LLM 호출 추적' },
                { text: 'LangChain 공식' }
              ]
            },
            {
              cells: [
                { text: 'LangFuse', bold: true },
                { text: '오픈소스 대안' },
                { text: 'Self-hosted 가능' }
              ]
            },
            {
              cells: [
                { text: 'Opik', bold: true },
                { text: '경량 추적' },
                { text: 'Comet ML' }
              ]
            }
          ]
        }
      },
      {
        id: '4-2',
        tag: 'theory',
        title: '서브그래프 관리',
        script: '서브그래프 관리도 중요합니다. 캐싱 전략은 Redis/Memcached로 자주 조회되는 서브그래프를 캐싱합니다. 정리(pruning) 주기는 사용되지 않는 노드/엣지를 주기적으로 정리합니다. 증분 업데이트는 전체 재생성 대신 변경분만 업데이트합니다.',
        diagram: {
          nodes: [
            { text: '캐싱 전략', type: 'entity' },
            { text: 'Redis/Memcached', type: 'dim' },
            { text: '정리 주기', type: 'entity' },
            { text: '사용되지 않는 노드 제거', type: 'dim' },
            { text: '증분 업데이트', type: 'entity' },
            { text: '변경분만 반영', type: 'dim' }
          ]
        },
        callout: {
          type: 'tip',
          text: '캐싱 + 정리 + 증분 업데이트로 서브그래프 효율 관리'
        }
      },
      {
        id: '4-3',
        tag: 'practice',
        title: 'CI/CD 파이프라인',
        script: 'GraphRAG도 CI/CD를 적용할 수 있습니다. GitHub Actions로 자동화하세요.',
        code: {
          language: 'yaml',
          code: `# .github/workflows/graphrag-test.yml
name: GraphRAG Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      neo4j:
        image: neo4j:5.15-community
        env:
          NEO4J_AUTH: neo4j/password123
        ports:
          - 7687:7687

    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run tests
        run: pytest tests/
      - name: Run RAGAS evaluation
        run: python eval.py`
        }
      }
    ]
  },
  // Section 5: 전체 아키텍처 복습 + 확장
  {
    sectionId: 'sec5',
    slides: [
      {
        id: '5-1',
        tag: 'theory',
        title: '전체 그림 — Part 1 맛보기가 완성됐다',
        script: 'Part 1에서 본 전체 그림을 다시 보겠습니다. 이제 모든 부분이 완성됐습니다. Server는 Neo4j, 벡터 인덱스, LLM API가 있습니다. RAG Pipeline은 Text2Cypher, 하이브리드 검색이 있습니다. Client는 Streamlit, 모니터링이 있습니다.',
        diagram: {
          nodes: [
            { text: '📦 Server', type: 'entity' },
            { text: 'Neo4j, 벡터 인덱스, LLM API', type: 'dim' },
            { text: '⚙️ RAG Pipeline', type: 'entity' },
            { text: 'Text2Cypher, 하이브리드 검색', type: 'dim' },
            { text: '💻 Client', type: 'entity' },
            { text: 'Streamlit, 모니터링', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: 'Part 1 맛보기가 완성됐다 — 모든 레이어 구현 완료!'
        }
      },
      {
        id: '5-2',
        tag: 'theory',
        title: '확장 방향 — Palantir OAG',
        script: '확장 방향을 보겠습니다. Palantir의 OAG(Ontology Application Graph)는 대규모 엔터프라이즈 적용 사례입니다. 멀티 도메인 통합으로 여러 도메인 그래프를 통합하여 전사 지식 그래프를 구축합니다. 실시간 업데이트로 변경 사항을 실시간으로 그래프에 반영합니다.',
        diagram: {
          nodes: [
            { text: 'Domain A Graph', type: 'entity' },
            { text: 'Domain B Graph', type: 'entity' },
            { text: 'Domain C Graph', type: 'entity' },
            { text: '통합 레이어', type: 'relation' },
            { text: '전사 지식 그래프 (OAG)', type: 'entity' },
            { text: '실시간 업데이트', type: 'relation' }
          ]
        }
      },
      {
        id: '5-3',
        tag: 'theory',
        title: '수강 후 할 수 있는 것',
        script: '이 과정을 마치면 여러분은 이런 것을 할 수 있습니다. GraphRAG 도입 여부를 스스로 판단할 수 있습니다. 도메인 문서에서 KG를 구축할 수 있습니다. LLM으로 엔티티/관계를 자동 추출할 수 있습니다. 표/이미지 문서를 그래프로 변환할 수 있습니다. Text2Cypher로 자연어 검색을 구현할 수 있습니다. GraphRAG 품질을 평가하고 개선할 수 있습니다.',
        table: {
          headers: ['역량', '설명'],
          rows: [
            {
              cells: [
                { text: 'GraphRAG 도입 판단', bold: true },
                { text: 'Multi-hop 질문 필요성 분석' }
              ]
            },
            {
              cells: [
                { text: 'KG 구축', bold: true },
                { text: '도메인 문서 → 엔티티/관계 추출' }
              ]
            },
            {
              cells: [
                { text: 'LLM 자동화', bold: true },
                { text: '자동 추출 + 검증' }
              ]
            },
            {
              cells: [
                { text: '멀티모달 처리', bold: true },
                { text: '표/이미지 → 그래프' }
              ]
            },
            {
              cells: [
                { text: 'Text2Cypher', bold: true },
                { text: '자연어 → Cypher → 답변' }
              ]
            },
            {
              cells: [
                { text: '품질 평가', bold: true },
                { text: 'RAGAS 평가 + 개선' }
              ]
            }
          ]
        }
      },
      {
        id: '5-4',
        tag: 'discussion',
        title: '실무 적용 체크리스트',
        script: '마지막으로 실무 적용 체크리스트입니다. 프로젝트 시작 전에 이 체크리스트를 확인하세요.',
        table: {
          headers: ['단계', '체크 항목', '완료'],
          rows: [
            {
              cells: [
                { text: '1. 도입 판단', bold: true },
                { text: 'Multi-hop 질문 필요성 확인' },
                { text: '☐' }
              ]
            },
            {
              cells: [
                { text: '2. 온톨로지 설계', bold: true },
                { text: '엔티티/관계 정의 + Meta-Dictionary' },
                { text: '☐' }
              ]
            },
            {
              cells: [
                { text: '3. 데이터 파이프라인', bold: true },
                { text: 'LLM 추출 → Neo4j 적재' },
                { text: '☐' }
              ]
            },
            {
              cells: [
                { text: '4. 검색 구현', bold: true },
                { text: 'Text2Cypher Agent + 하이브리드' },
                { text: '☐' }
              ]
            },
            {
              cells: [
                { text: '5. 품질 평가', bold: true },
                { text: 'RAGAS 평가 + 개선' },
                { text: '☐' }
              ]
            },
            {
              cells: [
                { text: '6. 최적화', bold: true },
                { text: 'Neo4j 인덱스 + 쿼리 튜닝' },
                { text: '☐' }
              ]
            },
            {
              cells: [
                { text: '7. 운영', bold: true },
                { text: '모니터링 + CI/CD' },
                { text: '☐' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '이 체크리스트를 따라가면 GraphRAG 프로젝트를 성공적으로 완료할 수 있습니다!'
        }
      }
    ]
  },
  // Section 6: 클로징
  {
    sectionId: 'sec6',
    slides: [
      {
        id: '6-1',
        tag: 'discussion',
        title: '11시간 여정 회고',
        script: '11시간의 여정을 돌아봅시다. Part 1: 왜 GraphRAG인가? — 동기부여 + 첫 Neo4j. Part 2: 수작업의 고통 — 온톨로지, Meta-Dictionary. Part 3: LLM 자동화 — 편리함과 한계. Part 4: ER — 실무의 어려움. Part 5: 멀티모달 — 진짜 문서를 다루는 역량. Part 6: 검색 — Text2Cypher Agent + 하이브리드. Part 7: 실무 — 평가, 최적화, 프로덕션. 여러분은 이제 GraphRAG 도입 여부를 스스로 판단할 수 있고, KG를 구축하고 검색 시스템을 만들 수 있습니다.',
        table: {
          headers: ['Part', '주제', 'Milestone'],
          rows: [
            {
              cells: [
                { text: 'Part 1', bold: true },
                { text: '왜 GraphRAG인가?' },
                { text: '첫 Neo4j 체험', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 2', bold: true },
                { text: '수작업 KG 구축' },
                { text: '온톨로지 + Meta-Dictionary', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 3', bold: true },
                { text: 'LLM 자동 추출' },
                { text: '자동 KG 생성', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 4', bold: true },
                { text: 'Entity Resolution' },
                { text: '중복 제거 완료', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 5', bold: true },
                { text: '멀티모달 VLM' },
                { text: '텍스트 + 표 통합 KG', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 6', bold: true },
                { text: '통합 + 검색' },
                { text: 'GraphRAG 시스템 완성', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Part 7', bold: true },
                { text: '실무 적용' },
                { text: '프로덕션 체크리스트', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'Part 1 회색 아키텍처가 이제 전부 컬러로 채워졌습니다!'
        }
      },
      {
        id: '6-2',
        tag: 'discussion',
        title: '핵심 메시지 7줄',
        script: '마지막. 7줄만 기억하세요. 1. 문제 정의가 먼저 — GraphRAG부터 시작하지 마라. 2. 암묵지를 Meta-Dictionary로 체계화. 3. 표는 SQL, 문서는 계층 — 각각 다르게 접근. 4. 가중치 싸움이 디자인을 결정. 5. Text2Cypher = 삽질의 연속 → Agent로 해결. 6. 1-hop이면 벡터로 충분 — Multi-hop이 존재 이유. 7. 정답은 없다 — PoC, 상황별 선택, 교차 평가. 수고하셨습니다. 이제 여러분의 프로젝트에 적용해보세요.',
        table: {
          headers: ['#', '핵심 메시지'],
          rows: [
            { cells: [{ text: '1', bold: true }, { text: '문제 정의가 먼저 — GraphRAG부터 시작하지 마라' }] },
            { cells: [{ text: '2', bold: true }, { text: '암묵지를 Meta-Dictionary로 체계화' }] },
            { cells: [{ text: '3', bold: true }, { text: '표는 SQL, 문서는 계층 — 각각 다르게 접근' }] },
            { cells: [{ text: '4', bold: true }, { text: '가중치 싸움이 디자인을 결정' }] },
            { cells: [{ text: '5', bold: true }, { text: 'Text2Cypher = 삽질의 연속 → Agent로 해결' }] },
            { cells: [{ text: '6', bold: true }, { text: '1-hop이면 벡터로 충분 — Multi-hop이 존재 이유' }] },
            { cells: [{ text: '7', bold: true }, { text: '정답은 없다 — PoC, 상황별 선택, 교차 평가' }] }
          ]
        },
        callout: {
          type: 'key',
          text: '깊이가 곧 가치. 이제 여러분의 프로젝트에 적용해보세요.'
        }
      }
    ]
  }
];
