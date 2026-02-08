import type { SectionContent, SlideContent } from './part1-content';

export const part6Content: SectionContent[] = [
  // Section 1: 파이프라인 통합
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '1-1',
        tag: 'practice',
        title: '벡터 임베딩 추가 — 하이브리드 준비',
        script: '이제 우리가 만든 그래프에 벡터 임베딩을 추가해봅시다. 하이브리드 검색을 위해서는 각 노드에 벡터 표현이 필요합니다. OpenAI의 text-embedding-3-small 모델을 사용하면, 노드 이름이나 설명을 벡터로 변환할 수 있어요.',
        code: {
          language: 'python',
          code: `from neo4j_graphrag.embeddings import OpenAIEmbeddings
embedder = OpenAIEmbeddings(model="text-embedding-3-small")

# 기존 노드에 임베딩 추가
for node in nodes:
    emb = embedder.embed_query(node["name"])
    driver.execute_query(
      "MATCH (n {id:$id}) SET n.embedding=$emb",
      {"id": node["id"], "emb": emb})`
        },
        callout: {
          type: 'tip',
          text: '기존 KG 노드에 벡터 임베딩을 추가하여 하이브리드 검색(벡터 + 그래프) 준비 완료'
        }
      },
      {
        id: '1-2',
        tag: 'theory',
        title: '전체 파이프라인 아키텍처',
        script: 'GraphRAG 시스템의 전체 흐름을 보겠습니다. 사용자 질문이 들어오면, Router가 "벡터 검색으로 갈까? 그래프 검색으로 갈까?"를 판단합니다. 두 검색 결과를 Reranker로 재정렬하고, LLM이 최종 답변을 생성합니다.',
        diagram: {
          nodes: [
            { text: '질문', type: 'entity' },
            { text: 'Router 분기', type: 'relation' },
            { text: '벡터 검색 / 그래프 검색', type: 'entity' },
            { text: 'Reranker 통합', type: 'relation' },
            { text: 'LLM 답변 생성', type: 'entity' },
            { text: '답변', type: 'relation' }
          ]
        },
        callout: {
          type: 'key',
          text: 'Router → [Vector | Graph] → Reranker → LLM 답변 생성'
        }
      },
      {
        id: '1-3',
        tag: 'theory',
        title: 'LangChain 통합 — GraphCypherQAChain',
        script: 'LangChain의 GraphCypherQAChain을 사용하면, 자연어 질문을 Cypher 쿼리로 변환하고 실행하는 파이프라인을 쉽게 만들 수 있습니다.',
        code: {
          language: 'python',
          code: `from langchain.chains import GraphCypherQAChain
from langchain_openai import ChatOpenAI
from langchain_community.graphs import Neo4jGraph

graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password123"
)

chain = GraphCypherQAChain.from_llm(
    llm=ChatOpenAI(model="gpt-4o", temperature=0),
    graph=graph,
    verbose=True
)

response = chain.invoke({"query": "삼성전자에 투자한 기관은?"})`
        }
      }
    ]
  },
  // Section 2: 기본 Text2Cypher
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '2-1',
        tag: 'theory',
        title: '가장 단순한 형태 — 스키마 + 질문 → Cypher',
        script: 'Text2Cypher의 가장 기본 형태는 간단합니다. 그래프 스키마와 질문을 LLM에 주면, Cypher 쿼리를 생성해줍니다. 하지만 잘 되는 것도 있고, 안 되는 것도 있습니다.',
        diagram: {
          nodes: [
            { text: '스키마 + 질문', type: 'entity' },
            { text: 'LLM 프롬프트', type: 'relation' },
            { text: 'Cypher 생성', type: 'entity' },
            { text: 'Neo4j 실행', type: 'relation' },
            { text: '결과 반환', type: 'entity' }
          ]
        },
        callout: {
          type: 'warn',
          text: '잘 되는 것도 있고, 안 되는 것도 있다. 복잡한 질문은 실패할 수 있습니다.'
        }
      },
      {
        id: '2-2',
        tag: 'practice',
        title: '기본 Text2Cypher 구현',
        script: '기본 구현은 Part 0의 미니 데모와 동일한 패턴입니다. 시스템 프롬프트에 그래프 스키마와 규칙을 명시하고, LLM이 Cypher를 생성하도록 합니다.',
        code: {
          language: 'python',
          code: `system = f"""당신은 Cypher 쿼리 전문가입니다.
스키마: {graph_schema}
규칙:
- Cypher 쿼리만 반환하세요
- 문자열 매칭은 CONTAINS를 사용하세요
- 노드 라벨과 관계 타입을 정확히 사용하세요
"""

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": system},
        {"role": "user", "content": question}
    ],
    temperature=0
)

cypher = response.choices[0].message.content`
        }
      },
      {
        id: '2-3',
        tag: 'practice',
        title: '잘 되는 질문 vs 안 되는 질문',
        script: '실제로 테스트해보면, 간단하고 명확한 질문은 잘 됩니다. 하지만 복잡한 Multi-hop 질문이나 추론이 필요한 질문은 실패합니다.',
        table: {
          headers: ['질문', '결과', '이유'],
          rows: [
            {
              cells: [
                { text: '접착 박리의 원인 공정은?', bold: true },
                { text: '✅ 성공', status: 'pass' },
                { text: '직접적, 명확한 스키마 매핑' }
              ]
            },
            {
              cells: [
                { text: '전체 공정 순서를 보여줘', bold: true },
                { text: '✅ 성공', status: 'pass' },
                { text: 'NEXT 관계 따라가기' }
              ]
            },
            {
              cells: [
                { text: 'HP-01 고장 시 영향은?', bold: true },
                { text: '⚠️ 애매', status: 'warn' },
                { text: 'LLM 해석 필요' }
              ]
            },
            {
              cells: [
                { text: '마찰재 문제 → 결함 예측', bold: true },
                { text: '❌ 실패', status: 'fail' },
                { text: 'Multi-hop + 추론 필요' }
              ]
            }
          ]
        }
      },
      {
        id: '2-4',
        tag: 'theory',
        title: 'Schema Tuning — include/exclude',
        script: '스키마를 LLM에 전부 주면 혼란스러워합니다. 관련 없는 노드 라벨이나 관계를 제외하고, 질문과 관련된 부분만 선별해서 주면 정확도가 올라갑니다. 하지만 이것도 한계가 있습니다. 이 한계를 극복하려면? Agent가 필요합니다.',
        code: {
          language: 'python',
          code: `# 스키마 필터링 예시
chain = GraphCypherQAChain.from_llm(
    llm=llm,
    graph=graph,
    include_types=["Company", "Investor", "INVESTED_IN"],
    exclude_types=["Product", "Person"]  # 불필요한 타입 제거
)`
        },
        callout: {
          type: 'warn',
          text: '이 한계를 극복하려면? → Agent가 필요합니다'
        }
      },
      {
        id: '2-5',
        tag: 'theory',
        title: '"이걸 어떻게 더 개선하지?" — Agent 전환',
        script: 'Schema Tuning으로 좀 나아졌지만, 여전히 복잡한 질문에서는 실패합니다. 생성된 Cypher에 문법 오류가 있어도, 지금 구조에서는 그냥 실행되거나 에러가 납니다. 검증도 없고, 교정도 없어요. 만약에 — 생성 → 검증 → 교정 → 실행 단계를 만들면? 이게 바로 Text2Cypher Agent입니다.',
        diagram: {
          nodes: [
            { text: '기본 Text2Cypher', type: 'fail' },
            { text: '검증 없음, 교정 없음', type: 'dim' },
            { text: 'Agent 파이프라인', type: 'entity' },
            { text: 'generate → validate → correct → execute', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: '기본 Text2Cypher의 한계 → Agent로 자가 교정 능력 확보'
        }
      }
    ]
  },
  // Section 3: Text2Cypher Agent
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '3-1',
        tag: 'theory',
        title: 'Agent 파이프라인 — 4단계',
        script: 'Text2Cypher Agent는 자가 교정 능력을 가진 파이프라인입니다. generate로 Cypher를 생성하고, validate로 6가지 체크를 수행하고, correct로 에러를 수정하고, execute로 실행합니다. LangGraph로 구현하면 이 흐름을 명확하게 표현할 수 있습니다.',
        diagram: {
          nodes: [
            { text: '1. generate', type: 'entity' },
            { text: 'Cypher 생성', type: 'dim' },
            { text: '2. validate', type: 'entity' },
            { text: '6가지 체크', type: 'dim' },
            { text: '3. correct', type: 'entity' },
            { text: '에러 수정', type: 'dim' },
            { text: '4. execute', type: 'entity' },
            { text: 'Neo4j 실행', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: 'LangGraph로 구현하는 자가 교정 Agent — generate → validate → correct → execute'
        }
      },
      {
        id: '3-2',
        tag: 'practice',
        title: 'generate — Cypher 생성 + Few-shot',
        script: 'generate 단계에서는 SemanticSimilarityExampleSelector를 사용합니다. 유사한 질문-쿼리 쌍을 자동으로 선택해서 few-shot 예시로 프롬프트에 포함합니다. 이렇게 하면 LLM이 더 정확한 Cypher를 생성합니다.',
        code: {
          language: 'python',
          code: `from langchain.prompts import SemanticSimilarityExampleSelector

# Few-shot 예시 데이터
few_shot_examples = [
    {
        "question": "삼성전자에 투자한 기관은?",
        "cypher": "MATCH (c:Company {name:'삼성전자'})<-[:INVESTED_IN]-(i:Investor) RETURN i.name"
    },
    {
        "question": "국민연금이 투자한 반도체 기업은?",
        "cypher": "MATCH (i:Investor {name:'국민연금'})-[:INVESTED_IN]->(c:Company {sector:'반도체'}) RETURN c.name"
    }
]

selector = SemanticSimilarityExampleSelector(
    examples=few_shot_examples,
    embeddings=OpenAIEmbeddings(),
    k=3  # 유사한 3개 예시 선택
)

# 질문과 유사한 예시를 자동으로 프롬프트에 추가
selected = selector.select_examples({"question": user_question})`
        }
      },
      {
        id: '3-3',
        tag: 'practice',
        title: 'validate — 6가지 체크',
        script: 'validate 단계에서는 생성된 Cypher 쿼리를 6가지 측면에서 검증합니다. 문법 오류, 존재하지 않는 노드 라벨, 잘못된 관계 타입, 프로퍼티 이름 오류, 관계 방향 문제, 집계 함수 오류까지 체크합니다.',
        table: {
          headers: ['Check', '설명', '에러 예시'],
          rows: [
            {
              cells: [
                { text: '문법 검사', bold: true },
                { text: 'Cypher 파싱 가능 여부' },
                { text: 'MTACH → MATCH' }
              ]
            },
            {
              cells: [
                { text: '노드 라벨', bold: true },
                { text: '스키마에 존재하는가' },
                { text: ':Company → :Corp (없음)' }
              ]
            },
            {
              cells: [
                { text: '관계 타입', bold: true },
                { text: '스키마에 존재하는가' },
                { text: ':WORKS → :WORKS_AT' }
              ]
            },
            {
              cells: [
                { text: '프로퍼티', bold: true },
                { text: '노드/관계에 존재하는가' },
                { text: 'n.names → n.name' }
              ]
            },
            {
              cells: [
                { text: '방향', bold: true },
                { text: '관계 방향 올바른가' },
                { text: '(a)<-[:REL]-(b) 확인' }
              ]
            },
            {
              cells: [
                { text: '집계', bold: true },
                { text: 'GROUP BY 필요한가' },
                { text: 'COUNT/SUM 유효성' }
              ]
            }
          ]
        }
      },
      {
        id: '3-4',
        tag: 'practice',
        title: 'CypherQueryCorrector + correct_cypher — 이중 교정',
        script: 'validate에서 오류가 발견되면 correct 단계로 갑니다. 이중 교정이에요. CypherQueryCorrector는 규칙 기반으로 관계 방향 오류 같은 기계적 교정을 합니다. correct_cypher는 LLM 기반으로 규칙으로 못 고치는 것을 LLM에게 교정 요청합니다. 이렇게 오류 정보를 함께 주면 LLM이 훨씬 정확하게 고칩니다.',
        code: {
          language: 'python',
          code: `# correct: LLM이 에러 메시지 보고 수정
def correct_cypher(cypher: str, error_msg: str) -> str:
    corrected = llm.invoke(f"""
에러가 발생했습니다:
{error_msg}

원본 쿼리:
{cypher}

에러를 수정한 Cypher 쿼리만 반환하세요.
""")
    return corrected

# execute: Neo4j에서 실행
def execute_cypher(cypher: str):
    try:
        result = driver.execute_query(cypher)
        return result
    except Exception as e:
        return correct_cypher(cypher, str(e))`
        }
      },
      {
        id: '3-5',
        tag: 'practice',
        title: '기본 vs Agent — 결과 비교',
        script: '기본 Text2Cypher와 Agent의 차이는 명확합니다. 기본은 간단한 질문만 처리하고 에러 처리가 없어서 정확도가 60~70%입니다. Agent는 자가 교정 능력이 있어서 복잡한 질문도 처리하고 정확도가 85~95%까지 올라갑니다.',
        table: {
          headers: ['항목', '기본 Text2Cypher', 'Agent'],
          rows: [
            {
              cells: [
                { text: '간단한 질문', bold: true },
                { text: '✅ OK', status: 'pass' },
                { text: '✅ OK', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '복잡한 질문', bold: true },
                { text: '❌ 실패', status: 'fail' },
                { text: '✅ 처리', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '에러 처리', bold: true },
                { text: '❌ 없음', status: 'fail' },
                { text: '✅ 자가 교정', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '검증 단계', bold: true },
                { text: '없음' },
                { text: '6단계 검증' }
              ]
            },
            {
              cells: [
                { text: '정확도', bold: true },
                { text: '60~70%' },
                { text: '85~95%' }
              ]
            }
          ]
        }
      }
    ]
  },
  // Section 4: 하이브리드 검색 + 데모
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '4-1',
        tag: 'theory',
        title: '벡터 + Graph + RRF 통합',
        script: '하이브리드 검색은 벡터 검색과 그래프 검색을 동시에 수행하고, RRF(Reciprocal Rank Fusion)로 결과를 통합합니다. 그 다음 Reranker로 재정렬하고, LLM이 최종 답변을 생성합니다.',
        diagram: {
          nodes: [
            { text: 'Query', type: 'entity' },
            { text: '병렬 검색', type: 'relation' },
            { text: 'Vector Search', type: 'entity' },
            { text: 'Graph Search', type: 'entity' },
            { text: 'RRF Fusion', type: 'relation' },
            { text: 'Reranker', type: 'entity' },
            { text: 'LLM 답변', type: 'relation' }
          ]
        },
        callout: {
          type: 'key',
          text: 'RRF: 벡터와 그래프 검색 결과를 순위 기반으로 통합하는 알고리즘'
        }
      },
      {
        id: '4-2',
        tag: 'theory',
        title: 'Prompt Routing — 질문 유형 분류',
        script: 'Router는 질문 유형을 분석해서 최적의 검색 방법을 선택합니다. 사실 확인은 벡터 검색, 관계 추적은 그래프 검색, 복합 질문은 하이브리드 검색을 사용합니다.',
        table: {
          headers: ['Query Type', 'Route', '예시'],
          rows: [
            {
              cells: [
                { text: '사실 확인', bold: true },
                { text: 'Vector' },
                { text: '삼성전자 매출은?' }
              ]
            },
            {
              cells: [
                { text: '관계 추적', bold: true },
                { text: 'Graph' },
                { text: '삼성 투자기관의 투자처?' }
              ]
            },
            {
              cells: [
                { text: '복합', bold: true },
                { text: 'Hybrid' },
                { text: '고매출 기업의 공통 투자자?' }
              ]
            }
          ]
        }
      },
      {
        id: '4-3',
        tag: 'theory',
        title: '메타 필터링 + 가지치기 + RERANKER',
        script: '검색 결과를 그대로 쓰면 안 됩니다. 후처리가 필요해요. 메타 필터링은 날짜, 출처, 카테고리로 불필요한 결과를 제외합니다. 가지치기는 관련성 낮은 결과를 잘라냅니다. RERANKER는 Cross-encoder로 최종 재순위를 매깁니다. 이게 답변 품질을 크게 올립니다.',
        diagram: {
          nodes: [
            { text: '검색 결과', type: 'entity' },
            { text: '메타 필터링', type: 'relation' },
            { text: '가지치기', type: 'relation' },
            { text: 'RERANKER', type: 'entity' },
            { text: 'LLM 답변 생성', type: 'relation' }
          ]
        },
        callout: {
          type: 'key',
          text: '검색 → 필터링 → 가지치기 → Reranking → LLM 답변 생성'
        }
      },
      {
        id: '4-4',
        tag: 'practice',
        title: 'Streamlit 데모 UI',
        script: '완성된 GraphRAG 시스템을 Streamlit으로 데모해봅시다. 질문을 입력하면, 답변과 함께 생성된 Cypher 쿼리, 검색된 서브그래프를 보여줍니다.',
        code: {
          language: 'python',
          code: `import streamlit as st

st.title("GraphRAG 데모")

query = st.text_input("질문을 입력하세요")

if query:
    with st.spinner("검색 중..."):
        result = graphrag_pipeline(query)

    st.success("답변:")
    st.write(result["answer"])

    with st.expander("생성된 Cypher 쿼리"):
        st.code(result["cypher"], language="cypher")

    with st.expander("검색된 서브그래프"):
        st.json(result["subgraph"])`
        },
        callout: {
          type: 'tip',
          text: '완성된 GraphRAG 시스템을 Streamlit으로 데모 — 질문 → 답변 + Cypher + 서브그래프'
        }
      },
      {
        id: '4-5',
        tag: 'demo',
        title: '실제 질문 테스트',
        script: '실제로 질문을 던져봅시다. "삼성전자에 투자한 기관이 투자한 다른 반도체 기업은?" 이 질문은 벡터 RAG로는 불가능했지만, GraphRAG는 정확히 답합니다.',
        visual: 'Streamlit 데모 화면 스크린샷: 질문 입력 → 답변 "SK하이닉스" + Cypher 쿼리 + 그래프 시각화',
        callout: {
          type: 'key',
          text: 'Multi-hop 질문에 정확히 답하는 GraphRAG 시스템 완성!'
        }
      }
    ]
  }
];
