import type { SectionContent, SlideContent } from './part1-content';

export const part7Content: SectionContent[] = [
  // Section 1: 품질 평가
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '1-0',
        tag: 'theory',
        title: 'Part 6 리캡 — 파이프라인은 완성됐다, 그런데...',
        script: 'Part 6에서 GraphRAG 파이프라인을 완성했습니다 — Router + Text2Cypher Agent + RRF 하이브리드 검색 + Reranker. 그런데 이 파이프라인의 Text2Cypher 정확도는 몇 %일까요? "접착 박리의 원인 공정은?"은 맞추는데, "불합격 제품의 설비 점검 이력은?"은 틀립니다. 어디가 병목인지 RAGAS로 측정하고, 성능을 최적화하는 것이 Part 7의 주제입니다.',
        diagram: {
          nodes: [
            { text: 'Part 6 파이프라인', type: 'entity' },
            { text: 'Router + Text2Cypher + RRF + Reranker', type: 'dim' },
            { text: '1-hop: "접착 박리 원인은?"', type: 'entity' },
            { text: 'OK', type: 'relation' },
            { text: '4-hop: "불합격 제품 설비 점검 이력?"', type: 'entity' },
            { text: 'FAIL', type: 'fail' }
          ]
        },
        callout: {
          type: 'key',
          text: 'Part 7 목표: RAGAS로 병목을 측정하고, Neo4j 최적화 + 운영 파이프라인까지 구축'
        }
      },
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
        script: '평가 데이터셋을 만들 때, 질문 난이도를 3단계로 나눕니다. Easy는 1-hop 질문으로 "접착 박리의 원인 공정은?"처럼 직접 답변 가능한 것. Medium은 2-hop 질문으로 "접착기 A-3을 사용하는 공정에서 발생한 결함은?"처럼 한 단계 관계 추적. Hard는 Multi-hop 질문으로 "불합격 판정된 제품의 원인 공정에서 사용된 설비의 점검 이력은?"처럼 여러 단계 추론이 필요한 것. Hard 질문에서 GraphRAG의 진가가 발휘됩니다.',
        table: {
          headers: ['난이도', '예시', '벡터 RAG', 'GraphRAG'],
          rows: [
            {
              cells: [
                { text: 'Easy (1-hop)', bold: true },
                { text: '접착 박리의 원인 공정은?' },
                { text: '\u2705', status: 'pass' },
                { text: '\u2705', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Medium (2-hop)', bold: true },
                { text: '접착기 A-3을 사용하는 공정에서 발생한 결함은?' },
                { text: '\u26A0\uFE0F', status: 'warn' },
                { text: '\u2705', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Hard (Multi-hop)', bold: true },
                { text: '불합격 제품의 원인 공정 설비 점검 이력은?' },
                { text: '\u274C', status: 'fail' },
                { text: '\u2705', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: 'Hard 질문에서 GraphRAG 진가 발휘 — 벡터 RAG는 Multi-hop 추론 불가'
        }
      },
      {
        id: '1-3',
        tag: 'theory',
        title: 'Multi-hop 추론 4유형',
        script: 'Multi-hop 질문도 유형이 있습니다. Bridge는 A\u2192B\u2192C 순차 이동으로 "Equipment(접착기 A-3)\u2192Process(접착 도포)\u2192Defect(접착 박리)". Comparison은 A와 B를 비교로 "열압착과 성형 중 어느 공정에서 결함이 더 많이 발생?". Intersection은 A와 B의 교집합으로 "접착 박리와 두께 불균일의 공통 원인 공정은?". Composition은 여러 관계를 조합으로 "불합격률 상위 3개 공정의 사용 설비와 자재 목록은?".',
        table: {
          headers: ['유형', '설명', '제조 도메인 예시'],
          rows: [
            {
              cells: [
                { text: 'Bridge', bold: true },
                { text: 'A\u2192B\u2192C 순차 이동' },
                { text: 'Equipment(접착기 A-3)\u2192Process(접착 도포)\u2192Defect(접착 박리)' }
              ]
            },
            {
              cells: [
                { text: 'Comparison', bold: true },
                { text: 'A와 B를 비교' },
                { text: '열압착 vs 성형 — 어느 공정에서 결함이 더 많이 발생?' }
              ]
            },
            {
              cells: [
                { text: 'Intersection', bold: true },
                { text: 'A와 B의 교집합' },
                { text: '접착 박리와 두께 불균일의 공통 원인 공정은?' }
              ]
            },
            {
              cells: [
                { text: 'Composition', bold: true },
                { text: '여러 관계를 조합' },
                { text: '불합격률 상위 3개 공정의 사용 설비와 자재 목록은?' }
              ]
            }
          ]
        }
      },
      {
        id: '1-3b',
        tag: 'theory',
        title: 'Multi-hop + Common Knowledge 메트릭',
        script: '평가에서 흔히 놓치는 게 Common Knowledge 메트릭입니다. Multi-hop 질문은 여러 관계를 따라가야 하는 질문이고, Common Knowledge는 그래프에 명시되지 않은 일반 상식이 필요한 질문입니다. 예를 들어 "브레이크 패드 경도 시험에 사용되는 표준 장비는?"은 Common Knowledge입니다. 그래프에 "경도 시험 장비" 관계가 없어도 상식적으로 답할 수 있어야 해요. Multi-hop은 그래프 구조가 잘 되어있으면 잘 답할 수 있지만, Common Knowledge는 LLM의 사전 지식에 의존합니다. 그래서 평가할 때 두 유형을 분리해서 측정해야 합니다. Multi-hop 성능이 높은데 Common Knowledge가 낮으면, LLM의 일반 지식 활용을 개선해야 하는 거죠.',
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
        title: '평가 데이터셋 설계 + RAGAS 실행',
        script: '평가 데이터셋은 난이도별로 균형 있게 구성해야 합니다. 각 질문마다 ground_truth(정답)을 반드시 포함하세요. RAGAS v0.1+ 기준으로 Dataset 객체를 사용하고, Part 6의 graphrag_pipeline 함수 결과를 연동합니다. contexts는 서브그래프를 문자열로 변환한 값입니다.',
        code: {
          language: 'python',
          code: `from ragas import evaluate
from ragas.metrics import (
    faithfulness, answer_relevancy,
    context_precision, context_recall
)
from datasets import Dataset

# Part 6에서 구현한 graphrag_pipeline 함수 import
from graphrag_pipeline import graphrag_pipeline

# 제조 도메인 평가 데이터셋
test_questions = [
    {"question": "접착 박리의 원인 공정은?",
     "ground_truth": "접착 도포", "difficulty": "easy", "hops": 1},
    {"question": "접착기 A-3을 사용하는 공정에서 발생한 결함은?",
     "ground_truth": "접착 박리", "difficulty": "medium", "hops": 2},
    {"question": "불합격 판정된 제품의 원인 공정에서 사용된 설비의 점검 이력은?",
     "ground_truth": "접착기 A-3, 2025-01-15 정기 점검",
     "difficulty": "hard", "hops": 4},
]

# Part 6 파이프라인으로 답변 생성 + RAGAS Dataset 구성
results_data = []
for item in test_questions:
    result = graphrag_pipeline(item["question"])
    results_data.append({
        "question": item["question"],
        "answer": result["answer"],
        "contexts": [str(result["subgraph"])],
        "ground_truth": item["ground_truth"],
    })

dataset = Dataset.from_list(results_data)
score = evaluate(
    dataset=dataset,
    metrics=[faithfulness, answer_relevancy,
             context_precision, context_recall]
)
print(score)  # {faithfulness: 0.xx, ...}`
        },
        callout: {
          type: 'tip',
          text: '난이도별 균형 있게 구성, ground_truth 필수 — RAGAS v0.1+는 Dataset 객체 사용'
        }
      },
      {
        id: '1-4b',
        tag: 'theory',
        title: 'Baseline 비교 — 벡터 RAG vs GraphRAG',
        script: 'GraphRAG가 정말 좋은지 판단하려면 Baseline 비교가 필수입니다. 벡터 RAG를 Baseline으로 설정하고, 같은 질문셋으로 두 시스템을 비교합니다. Easy 질문에서는 벡터 RAG도 잘 합니다. Medium 질문에서부터 차이가 나기 시작합니다. 벡터 RAG는 관련 청크를 찾지만 관계를 추론하지 못합니다. Hard 질문에서 GraphRAG의 가치가 드러납니다. 아래 수치는 예시이며, 실제 수치는 도메인/질문셋/LLM에 따라 달라집니다. 실제 측정: Part 6의 graphrag_pipeline으로 20개 테스트 질문 실행, 동일 질문을 벡터 RAG로도 실행하여 비교하세요.',
        table: {
          headers: ['난이도', '벡터 RAG (Baseline)', 'GraphRAG', '차이'],
          rows: [
            {
              cells: [
                { text: 'Easy (1-hop)', bold: true },
                { text: '~90% (예시)', status: 'pass' },
                { text: '~92% (예시)', status: 'pass' },
                { text: '+2% (미미)' }
              ]
            },
            {
              cells: [
                { text: 'Medium (2-hop)', bold: true },
                { text: '~65% (예시)', status: 'warn' },
                { text: '~85% (예시)', status: 'pass' },
                { text: '+20% (유의미)' }
              ]
            },
            {
              cells: [
                { text: 'Hard (Multi-hop)', bold: true },
                { text: '~30% (예시)', status: 'fail' },
                { text: '~80% (예시)', status: 'pass' },
                { text: '+50% (압도적)' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: '위 수치는 예시입니다. 실제 정확도는 도메인, 질문셋, LLM 모델에 따라 달라지므로 반드시 직접 측정하세요.'
        }
      },
      {
        id: '1-4c',
        tag: 'practice',
        title: '벡터 RAG Baseline 구현',
        script: 'Baseline으로 사용할 벡터 RAG 코드입니다. Part 5에서 생성한 text_chunks를 FAISS에 임베딩하고, 동일한 질문셋으로 답변을 생성합니다. 이 결과를 GraphRAG 결과와 나란히 비교하면 정량적 판단이 가능합니다.',
        code: {
          language: 'python',
          code: `from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import RetrievalQA

# Part 5에서 생성한 텍스트 청크 사용
vectorstore = FAISS.from_texts(text_chunks, OpenAIEmbeddings())
vector_rag = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model="gpt-4o", temperature=0),
    retriever=vectorstore.as_retriever(search_kwargs={"k": 5})
)

# 동일 질문셋으로 벡터 RAG 답변 생성
for item in test_questions:
    vector_answer = vector_rag.invoke(item["question"])
    graph_answer = graphrag_pipeline(item["question"])
    print(f"Q: {item['question']}")
    print(f"  Vector RAG: {vector_answer['result']}")
    print(f"  GraphRAG:   {graph_answer['answer']}")
    print(f"  정답:        {item['ground_truth']}")`
        },
        callout: {
          type: 'tip',
          text: '동일 질문셋으로 두 시스템을 비교해야 공정한 Baseline 비교가 가능합니다'
        }
      },
      {
        id: '1-5',
        tag: 'theory',
        title: 'LLM 평가 바이어스 \u2192 교차 평가',
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
        script: 'GraphRAG는 만능이 아닙니다. 완벽한 KG는 없습니다. 도메인에 맞는 "적절한 기대치"를 설정하고, 지속적으로 개선하는 것이 핵심입니다. 아래 정확도 수치는 예시이며, 실제 프로젝트에서는 도메인과 데이터 품질에 따라 달라집니다. 첫 시도에서 100% 정확도를 기대하지 마세요. 점진적으로 개선하세요.',
        diagram: {
          nodes: [
            { text: '1차 시도', type: 'entity' },
            { text: '프롬프트 개선', type: 'relation' },
            { text: '2차 시도', type: 'entity' },
            { text: 'Schema Tuning', type: 'relation' },
            { text: '3차 시도', type: 'entity' },
            { text: '점진적 개선 (예시 수치 — 실제는 도메인에 따라 다름)', type: 'dim' }
          ]
        },
        callout: {
          type: 'warn',
          text: '완벽한 KG는 없다. 지속적으로 개선하는 것이 핵심. 수치는 참고용 예시입니다.'
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
                { text: 'O(d) \u2014 인접 리스트', status: 'pass' },
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
          text: 'get_neighbors O(d) vs O(V) \u2014 GraphRAG에서 가장 중요한 성능 지표. 인접 리스트 기반이 필수'
        }
      },
      {
        id: '3-1d',
        tag: 'theory',
        title: '제조 도메인에서 왜 Neo4j인가?',
        script: '우리 제조 도메인에서 Neo4j를 선택하는 구체적 이유를 정리합시다. Part 1~6에서 만든 KG는 약 30노드, 7개 엔티티 타입(Process, Equipment, Defect, Material, Product, Spec, Maintenance), 9개 관계 타입입니다. 이 규모는 Neo4j Community Edition으로 충분합니다. Part 6에서 사용한 LangChain GraphCypherQAChain은 Neo4j만 공식 지원합니다. Part 5에서 벡터 인덱스를 사용했는데, Neo4j 5.x에 네이티브 벡터 인덱스가 포함되어 별도 벡터 DB 없이 하이브리드 검색이 가능합니다.',
        table: {
          headers: ['근거', '상세', '해당 Part'],
          rows: [
            {
              cells: [
                { text: 'KG 규모', bold: true },
                { text: '~30노드, 7타입, 9관계 \u2192 Community Edition 충분' },
                { text: 'Part 1~6' }
              ]
            },
            {
              cells: [
                { text: 'LangChain 연동', bold: true },
                { text: 'GraphCypherQAChain이 Neo4j만 공식 지원' },
                { text: 'Part 6' }
              ]
            },
            {
              cells: [
                { text: '벡터 인덱스', bold: true },
                { text: 'Neo4j 5.x 네이티브 벡터 \u2192 별도 DB 불필요' },
                { text: 'Part 5' }
              ]
            },
            {
              cells: [
                { text: '규모별 권장', bold: true },
                { text: 'PoC(~10만): Community / 프로덕션(~1000만): Enterprise / 대규모(~10억): GraphScope Flex' },
                { text: '-' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '제조 PoC \u2192 Neo4j Community, 프로덕션 \u2192 Enterprise, 10억 노드+ \u2192 GraphScope Flex'
        }
      },
      {
        id: '3-1c',
        tag: 'theory',
        title: '그래프 표현 방식과 성능 차이',
        script: '그래프를 저장하는 방법에 따라 성능이 크게 달라집니다. 4가지 표현 방식이 있습니다. Adjacency Matrix는 노드 x 노드 행렬로, 공간은 O(V\u00B2)이고 이웃 탐색은 O(V)입니다. Edge List는 (source, target) 쌍의 리스트로, 공간은 O(E)이고 이웃 탐색은 O(E)입니다. Adjacency List(연결 리스트)는 각 노드별 이웃 목록으로, 공간은 O(V+E)이고 이웃 탐색은 O(d)입니다. CSR(Compressed Sparse Row)은 압축된 행 표현으로, 공간은 O(V+E)이고 이웃 탐색은 O(d)입니다. Neo4j는 Adjacency List 기반의 Native Graph Storage를 사용해서 get_neighbors가 O(d)입니다. GraphRAG에서 서브그래프 탐색이 핵심이므로, 이 O(d) 특성이 결정적입니다.',
        table: {
          headers: ['표현 방식', '공간', 'get_neighbors', 'GraphRAG 적합성'],
          rows: [
            {
              cells: [
                { text: 'Adjacency Matrix', bold: true },
                { text: 'O(V\u00B2)' },
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
          text: 'O(d) vs O(V) \u2014 100만 노드, 평균 degree 10이면: O(10) vs O(1,000,000). 10만 배 차이'
        }
      },
      {
        id: '3-2',
        tag: 'theory',
        title: 'GDBMS 비교 \u2014 Neo4j vs K\u00F9zu vs FalkorDB',
        script: 'Neo4j는 Native Graph로 생태계가 1위이고 검증된 성능을 가지고 있습니다. GraphRAG에 최적입니다. K\u00F9zu는 Embedded 방식으로 인메모리라 빠르지만 생태계가 작습니다. 분석에 최적화되어 있습니다. FalkorDB는 Redis 기반으로 빠르지만 생태계가 작습니다. 캐시에 최적화되어 있습니다.',
        table: {
          headers: ['항목', 'Neo4j', 'K\u00F9zu', 'FalkorDB'],
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
                { text: '\u2705 검증됨', status: 'pass' },
                { text: '\u2705 빠름 (인메모리)', status: 'pass' },
                { text: '\u2705 빠름', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '생태계', bold: true },
                { text: '\u2705 1위', status: 'pass' },
                { text: '\u26A0\uFE0F 작음', status: 'warn' },
                { text: '\u26A0\uFE0F 작음', status: 'warn' }
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
          text: 'Neo4j: GraphRAG 최적 선택 \u2014 생태계 1위, 검증된 성능, LangChain 공식 지원'
        }
      },
      {
        id: '3-3',
        tag: 'theory',
        title: 'Graph Query Languages',
        script: 'Graph 쿼리 언어도 여러 가지가 있습니다. Cypher는 Neo4j에서 사용하고 패턴 매칭이 직관적입니다. Gremlin은 JanusGraph, Neptune에서 사용하고 순회 기반으로 범용적입니다. GSQL은 TigerGraph에서 사용하고 SQL 유사 문법으로 분석에 강점이 있습니다. GQL은 ISO 표준(2024)으로 Cypher를 계승한 차세대 표준입니다. Neo4j 5.x부터 GQL 지원이 시작되었으며, 기존 Cypher 쿼리와 호환됩니다. 장기적으로 GQL이 업계 표준이 될 전망이므로 주시할 필요가 있습니다.',
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
                { text: 'GQL (ISO 39075:2024)', bold: true },
                { text: 'Neo4j 5.x+, 차세대 표준' },
                { text: 'Cypher 계승, ISO 표준 \u2014 Neo4j 5.x에서 지원 시작' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: 'GQL(ISO 39075:2024)은 Cypher를 계승한 국제 표준 \u2014 Neo4j 5.x부터 지원 시작, 기존 Cypher와 호환'
        }
      },
      {
        id: '3-4',
        tag: 'practice',
        title: 'Neo4j 성능 최적화 7가지 \u2014 제조 도메인',
        script: 'Neo4j 성능 최적화는 7가지 방법이 있습니다. 1) 인덱스 생성(노드 라벨, 프로퍼티). 2) 쿼리 프로파일링(PROFILE, EXPLAIN). 3) APOC 활용(병렬 처리, 배치). 4) 배치 처리(UNWIND, APOC Batch). 5) 읽기 트랜잭션(READ 명시). 6) 파라미터화(쿼리 캐싱). 7) 캐싱(애플리케이션 레벨). 아래 코드는 Part 1~6에서 사용한 제조 도메인 엔티티(Process, Equipment, Defect)에 맞춘 예시입니다.',
        code: {
          language: 'cypher',
          code: `// 1. 인덱스 생성 — 제조 도메인 엔티티
CREATE INDEX process_name IF NOT EXISTS FOR (p:Process) ON (p.name)
CREATE INDEX equipment_name IF NOT EXISTS FOR (e:Equipment) ON (e.name)
CREATE INDEX defect_name IF NOT EXISTS FOR (d:Defect) ON (d.name)

// 2. 쿼리 프로파일링
PROFILE MATCH (d:Defect {name: "접착 박리"})-[:CAUSED_BY]->(p:Process) RETURN p

// 3. APOC 병렬 처리
CALL apoc.periodic.iterate(
  "MATCH (p:Process) RETURN p",
  "SET p.processed = true",
  {batchSize:1000, parallel:true}
)

// 4. 배치 처리
UNWIND $batch AS row
MERGE (p:Process {name: row.name})

// 5. 읽기 트랜잭션
MATCH (e:Equipment)-[:MAINTAINED_ON]->(m:Maintenance) RETURN e, m // READ`
        }
      },
      {
        id: '3-5',
        tag: 'theory',
        title: 'GraphScope Flex \u2014 대규모 그래프',
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
                { text: '\u26A0\uFE0F 성장 중', status: 'warn' },
                { text: '\u2705 1위', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '프로덕션 \u2192 Neo4j / 대규모 분석 \u2192 GraphScope Flex'
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
        id: '4-1b',
        tag: 'practice',
        title: 'LangSmith 연동 \u2014 최소 설정',
        script: 'Part 6에서 만든 graphrag_pipeline에 LangSmith 추적을 붙이는 최소 코드입니다. 환경 변수 3개만 설정하면 LangChain 호출이 자동으로 LangSmith에 기록됩니다. LangSmith 대시보드에서 각 호출의 입력/출력, 토큰 수, 지연시간을 확인할 수 있습니다.',
        code: {
          language: 'python',
          code: `import os

# LangSmith 추적 활성화 (환경 변수 3개)
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGSMITH_API_KEY")
os.environ["LANGCHAIN_PROJECT"] = "graphrag-manufacturing"

# 이후 Part 6의 graphrag_pipeline 호출은 자동으로 추적됨
from graphrag_pipeline import graphrag_pipeline
result = graphrag_pipeline("접착 박리의 원인 공정은?")
# -> LangSmith 대시보드에서 호출 트레이스 확인 가능`
        },
        callout: {
          type: 'tip',
          text: '환경 변수 3개로 LangSmith 연동 완료 \u2014 LangChain 호출이 자동 추적됩니다'
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
        id: '4-2b',
        tag: 'practice',
        title: 'Redis 캐싱 \u2014 서브그래프 캐시 구현',
        script: '자주 조회되는 질문의 서브그래프 결과를 Redis에 캐싱하는 예시입니다. 질문을 MD5 해시로 변환하여 캐시 키로 사용합니다. TTL(Time To Live)을 설정하여 캐시 만료를 관리합니다. 동일 질문이 반복될 때 Neo4j 조회 없이 캐시에서 즉시 반환됩니다.',
        code: {
          language: 'python',
          code: `import redis, hashlib, json
from graphrag_pipeline import graphrag_pipeline

cache = redis.Redis(host='localhost', port=6379, db=0)

def cached_graph_search(question: str, ttl: int = 3600):
    """서브그래프 검색 결과를 Redis에 캐싱"""
    cache_key = f"graphrag:{hashlib.md5(question.encode()).hexdigest()}"
    cached = cache.get(cache_key)
    if cached:
        return json.loads(cached)
    result = graphrag_pipeline(question)
    cache.setex(cache_key, ttl, json.dumps(result, default=str))
    return result

# 사용 예시
answer = cached_graph_search("접착 박리의 원인 공정은?")
# 첫 호출: Neo4j 조회 -> 결과 캐싱 (TTL 1시간)
# 이후 동일 질문: 캐시에서 즉시 반환`
        },
        callout: {
          type: 'tip',
          text: 'Redis 캐싱으로 동일 질문 반복 조회 시 Neo4j 부하를 줄일 수 있습니다'
        }
      },
      {
        id: '4-3',
        tag: 'practice',
        title: 'CI/CD 파이프라인',
        script: 'GraphRAG도 CI/CD를 적용할 수 있습니다. GitHub Actions로 자동화하세요. Neo4j 인증 정보는 반드시 GitHub Secrets에서 관리합니다.',
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
        # neo4j:5-community (마이너 자동 업데이트)
        image: neo4j:5-community
        env:
          # CI 테스트 전용 — 프로덕션에서는 반드시 Secrets 사용
          NEO4J_AUTH: \${{ secrets.NEO4J_AUTH }}
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
        title: '전체 그림 \u2014 Part 1 맛보기가 완성됐다',
        script: 'Part 1에서 본 전체 그림을 다시 보겠습니다. 이제 모든 부분이 완성됐습니다. Server는 Neo4j, 벡터 인덱스, LLM API가 있습니다. RAG Pipeline은 Text2Cypher, 하이브리드 검색이 있습니다. Client는 Streamlit, 모니터링이 있습니다.',
        diagram: {
          nodes: [
            { text: 'Server', type: 'entity' },
            { text: 'Neo4j, 벡터 인덱스, LLM API', type: 'dim' },
            { text: 'RAG Pipeline', type: 'entity' },
            { text: 'Text2Cypher, 하이브리드 검색', type: 'dim' },
            { text: 'Client', type: 'entity' },
            { text: 'Streamlit, 모니터링', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: 'Part 1 맛보기가 완성됐다 \u2014 모든 레이어 구현 완료!'
        }
      },
      {
        id: '5-2',
        tag: 'theory',
        title: '확장 방향 \u2014 Palantir OAG',
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
                { text: '도메인 문서 \u2192 엔티티/관계 추출' }
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
                { text: '표/이미지 \u2192 그래프' }
              ]
            },
            {
              cells: [
                { text: 'Text2Cypher', bold: true },
                { text: '자연어 \u2192 Cypher \u2192 답변' }
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
        script: '마지막으로 실무 적용 체크리스트입니다. 프로젝트 시작 전에 이 체크리스트를 확인하세요. 각 항목이 어느 Part에서 다뤄졌는지 함께 표시했습니다.',
        table: {
          headers: ['단계', '체크 항목', '해당 Part'],
          rows: [
            {
              cells: [
                { text: '1. 도입 판단', bold: true },
                { text: 'Multi-hop 질문 필요성 확인' },
                { text: 'Part 1' }
              ]
            },
            {
              cells: [
                { text: '2. 온톨로지 설계', bold: true },
                { text: '엔티티/관계 정의 + Meta-Dictionary' },
                { text: 'Part 2' }
              ]
            },
            {
              cells: [
                { text: '3. 데이터 파이프라인', bold: true },
                { text: 'LLM 추출 \u2192 ER \u2192 Neo4j 적재' },
                { text: 'Part 3~4' }
              ]
            },
            {
              cells: [
                { text: '4. 멀티모달', bold: true },
                { text: '표/이미지 \u2192 KG 통합' },
                { text: 'Part 5' }
              ]
            },
            {
              cells: [
                { text: '5. 검색 구현', bold: true },
                { text: 'Text2Cypher Agent + 하이브리드' },
                { text: 'Part 6' }
              ]
            },
            {
              cells: [
                { text: '6. 품질 평가', bold: true },
                { text: 'RAGAS 평가 + Baseline 비교' },
                { text: 'Part 7' }
              ]
            },
            {
              cells: [
                { text: '7. 최적화', bold: true },
                { text: 'Neo4j 인덱스 + 쿼리 튜닝' },
                { text: 'Part 7' }
              ]
            },
            {
              cells: [
                { text: '8. 운영', bold: true },
                { text: '모니터링 + CI/CD' },
                { text: 'Part 7' }
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
        title: 'Part 1~7 기초 과정 회고 (약 11.5시간)',
        script: 'Part 1~7 기초 과정(약 11.5시간)을 돌아봅시다. Part 1: 왜 GraphRAG인가? \u2014 동기부여 + 첫 Neo4j. Part 2: 수작업의 고통 \u2014 온톨로지, Meta-Dictionary. Part 3: LLM 자동화 \u2014 편리함과 한계. Part 4: ER \u2014 실무의 어려움. Part 5: 멀티모달 \u2014 진짜 문서를 다루는 역량. Part 6: 검색 \u2014 Text2Cypher Agent + 하이브리드. Part 7: 실무 \u2014 평가, 최적화, 프로덕션. 여러분은 이제 GraphRAG 도입 여부를 스스로 판단할 수 있고, KG를 구축하고 검색 시스템을 만들 수 있습니다. 그런데 이것은 기초 과정입니다. Part 8부터는 심화 과정이 시작됩니다.',
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
          text: 'Part 1~7 기초 과정 완료 \u2014 Part 8부터 심화 과정이 시작됩니다!'
        }
      },
      {
        id: '6-1b',
        tag: 'discussion',
        title: 'Part 8~13 심화 과정 예고',
        script: 'Part 8부터는 심화 과정입니다. Part 8: MS GraphRAG, LightRAG, fast-graphrag 3개 프레임워크를 직접 비교합니다. 우리가 직접 만든 것과 프레임워크의 차이를 체감하게 됩니다. Part 9: 커뮤니티 탐지, PageRank 등 그래프 알고리즘으로 KG의 숨겨진 구조를 발견합니다. Part 10: LangGraph로 멀티에이전트 GraphRAG를 구축합니다. Part 11: "왜 이상한 답이 나오지?" \u2014 디버깅 플로우차트와 API 비용 최적화. Part 12: 엔터프라이즈 도입 \u2014 PoC 계획서, 보안, CI/CD. Part 13: 캡스톤 프로젝트 \u2014 Part 1~12를 총동원한 엔드투엔드 시스템 구축.',
        table: {
          headers: ['Part', '주제', '핵심 산출물'],
          rows: [
            {
              cells: [
                { text: 'Part 8', bold: true },
                { text: '프레임워크 비교' },
                { text: '3개 프레임워크 벤치마크' }
              ]
            },
            {
              cells: [
                { text: 'Part 9', bold: true },
                { text: '그래프 알고리즘' },
                { text: '커뮤니티 탐지 + PageRank 리랭킹' }
              ]
            },
            {
              cells: [
                { text: 'Part 10', bold: true },
                { text: 'Agentic GraphRAG' },
                { text: '멀티에이전트 자율 검색' }
              ]
            },
            {
              cells: [
                { text: 'Part 11', bold: true },
                { text: '디버깅 & 비용 최적화' },
                { text: '장애 플로우차트 + 비용 50% 절감' }
              ]
            },
            {
              cells: [
                { text: 'Part 12', bold: true },
                { text: '엔터프라이즈 실전' },
                { text: 'PoC 계획서 + 보안 체크리스트' }
              ]
            },
            {
              cells: [
                { text: 'Part 13', bold: true },
                { text: '캡스톤 프로젝트' },
                { text: '엔드투엔드 시스템 + 포트폴리오' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: 'Part 8에서 계속됩니다 \u2014 직접 만든 것과 프레임워크를 비교해봅시다!'
        }
      },
      {
        id: '6-2',
        tag: 'discussion',
        title: 'Part 1~7 핵심 메시지 7줄',
        script: '마지막. 7줄만 기억하세요. 1. 문제 정의가 먼저 \u2014 GraphRAG부터 시작하지 마라. 2. 암묵지를 Meta-Dictionary로 체계화. 3. 표는 SQL, 문서는 계층 \u2014 각각 다르게 접근. 4. 가중치 싸움이 디자인을 결정. 5. Text2Cypher = 삽질의 연속 \u2192 Agent로 해결. 6. 1-hop이면 벡터로 충분 \u2014 Multi-hop이 존재 이유. 7. 정답은 없다 \u2014 PoC, 상황별 선택, 교차 평가. Part 8에서 계속됩니다 \u2014 직접 만든 것과 프레임워크를 비교해봅시다!',
        table: {
          headers: ['#', '핵심 메시지'],
          rows: [
            { cells: [{ text: '1', bold: true }, { text: '문제 정의가 먼저 \u2014 GraphRAG부터 시작하지 마라' }] },
            { cells: [{ text: '2', bold: true }, { text: '암묵지를 Meta-Dictionary로 체계화' }] },
            { cells: [{ text: '3', bold: true }, { text: '표는 SQL, 문서는 계층 \u2014 각각 다르게 접근' }] },
            { cells: [{ text: '4', bold: true }, { text: '가중치 싸움이 디자인을 결정' }] },
            { cells: [{ text: '5', bold: true }, { text: 'Text2Cypher = 삽질의 연속 \u2192 Agent로 해결' }] },
            { cells: [{ text: '6', bold: true }, { text: '1-hop이면 벡터로 충분 \u2014 Multi-hop이 존재 이유' }] },
            { cells: [{ text: '7', bold: true }, { text: '정답은 없다 \u2014 PoC, 상황별 선택, 교차 평가' }] }
          ]
        },
        callout: {
          type: 'key',
          text: 'Part 8에서 계속됩니다 \u2014 직접 만든 것과 프레임워크를 비교해봅시다!'
        }
      }
    ]
  }
];
