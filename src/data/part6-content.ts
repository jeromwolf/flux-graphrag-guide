import type { SectionContent, SlideContent } from './part1-content';

export const part6Content: SectionContent[] = [
  // Section 1: 파이프라인 통합
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '1-1',
        tag: 'theory',
        title: 'Part 5 멀티모달 KG → "이제 검색이다"',
        script: 'Part 5에서 텍스트(Part 2~4)와 검사 성적표, 공정 파라미터 기록표를 통합한 멀티모달 KG를 만들었습니다. 7개 엔티티 타입(Process, Equipment, Defect, Material, Product, Spec, Maintenance)에 InspectionTable, TableSummary까지 추가되었고, hybrid_search() 함수로 벡터+그래프 검색의 가능성도 확인했습니다. 그런데 실제 사용자가 "접착기 A-3을 사용하는 공정에서 발생한 결함이 있는 제품의 규격 미달 항목은?"이라고 물으면, 지금 KG로 답할 수 있을까요? 자연어 질문을 Cypher 쿼리로 바꾸고, 검색하고, 답변을 생성하는 파이프라인이 필요합니다. 이것이 Part 6의 주제입니다.',
        visual: 'Part 5 멀티모달 KG 다이어그램 + "자연어 → Cypher → 답변" 파이프라인 화살표',
        callout: {
          type: 'key',
          text: 'Part 5의 멀티모달 KG 위에 자연어 검색 파이프라인을 구축합니다'
        }
      },
      {
        id: '1-2',
        tag: 'practice',
        title: '벡터 임베딩 추가 — 하이브리드 준비',
        script: 'Part 5에서 만든 hybrid_search() 함수를 확장합니다. 먼저 기존 노드에 벡터 임베딩을 추가해야 합니다. 임베딩 모델은 두 가지 선택지가 있습니다. 오픈소스로는 paraphrase-multilingual-MiniLM-L12-v2(Part 4~5에서 사용, 384차원, 한영 혼용 지원)가 있고, OpenAI의 text-embedding-3-small(1536차원, API 비용 발생)도 사용할 수 있습니다. 제조 도메인 한국어 문서에는 multilingual 모델을 권장합니다.',
        code: {
          language: 'python',
          code: `import os
from sentence_transformers import SentenceTransformer
from neo4j import GraphDatabase

# 선택지 1: 오픈소스 다국어 모델 (Part 4-5 연속, 무료)
embedder = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
# 선택지 2: OpenAI (유료, 1536차원)
# from openai import OpenAI
# client = OpenAI()  # OPENAI_API_KEY 환경변수 자동 로드

driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(os.getenv("NEO4J_USER", "neo4j"),
          os.getenv("NEO4J_PASSWORD"))
)

# 기존 노드에 임베딩 추가
with driver.session() as session:
    nodes = session.run("MATCH (n) WHERE n.name IS NOT NULL RETURN n.name AS name, id(n) AS id")
    for record in nodes:
        emb = embedder.encode(record["name"])
        session.run(
            "MATCH (n) WHERE id(n)=$id SET n.embedding=$emb",
            {"id": record["id"], "emb": emb.tolist()}
        )`
        },
        callout: {
          type: 'tip',
          text: '환경변수로 인증 — os.getenv 패턴 (Part 3~5 동일). 비밀번호 하드코딩 금지!'
        }
      },
      {
        id: '1-3',
        tag: 'theory',
        title: '전체 파이프라인 아키텍처',
        script: 'GraphRAG 시스템의 전체 흐름을 보겠습니다. 사용자 질문이 들어오면, Router가 "벡터 검색으로 갈까? 그래프 검색으로 갈까?"를 판단합니다. 두 검색 결과를 RRF(Reciprocal Rank Fusion)로 통합하고, Reranker로 재정렬하고, LLM이 최종 답변을 생성합니다.',
        diagram: {
          nodes: [
            { text: '질문', type: 'entity' },
            { text: 'Router 분기', type: 'relation' },
            { text: '벡터 검색 / 그래프 검색', type: 'entity' },
            { text: 'RRF + Reranker 통합', type: 'relation' },
            { text: 'LLM 답변 생성', type: 'entity' },
            { text: '답변', type: 'relation' }
          ]
        },
        callout: {
          type: 'key',
          text: 'Router → [Vector | Graph] → RRF Fusion → Reranker → LLM 답변 생성'
        }
      },
      {
        id: '1-4',
        tag: 'practice',
        title: 'LangChain 통합 — GraphCypherQAChain',
        script: 'LangChain의 GraphCypherQAChain을 사용하면, 자연어 질문을 Cypher 쿼리로 변환하고 실행하는 파이프라인을 쉽게 만들 수 있습니다. 주의: langchain_neo4j 패키지를 사용하세요. 기존 langchain_community.graphs는 deprecated입니다.',
        code: {
          language: 'python',
          code: `import os
# langchain_neo4j >= 0.1.0 (2024.12~)
# pip install langchain-neo4j langchain-openai
from langchain_neo4j import GraphCypherQAChain, Neo4jGraph
from langchain_openai import ChatOpenAI

graph = Neo4jGraph(
    url=os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    username=os.getenv("NEO4J_USER", "neo4j"),
    password=os.getenv("NEO4J_PASSWORD")
)

chain = GraphCypherQAChain.from_llm(
    llm=ChatOpenAI(model="gpt-4o", temperature=0),
    graph=graph,
    verbose=True
)

response = chain.invoke({"query": "접착 박리의 원인 공정은?"})`
        },
        callout: {
          type: 'warn',
          text: 'from langchain_neo4j import GraphCypherQAChain (신규). langchain_community.graphs.Neo4jGraph는 deprecated.'
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
        title: 'graph_schema 정의 — 제조 도메인 (Part 5 연속)',
        script: 'Text2Cypher에서 가장 중요한 것은 정확한 스키마 정의입니다. Part 1~5에서 구축한 제조 KG의 전체 스키마를 정의합니다. Part 5에서 추가한 InspectionTable, TableSummary와 MENTIONS, HAS_TABLE 관계까지 포함해야 합니다. 이 스키마가 LLM에게 전달되어 Cypher를 생성하는 기반이 됩니다.',
        code: {
          language: 'python',
          code: `graph_schema = """
Node Labels & Properties:
- Process: name (접착 도포, 열압착, 성형, 연삭)
- Equipment: name (접착기 A-3, 열프레스 HP-01)
- Defect: name, item, measured, criteria
- Material: name (접착제 EP-200, 마찰재 FM-100)
- Product: name (BP-100)
- Spec: name (KS M 6613, ISO 6310)
- Maintenance: date, type
- InspectionTable: source, date
- TableSummary: text, embedding, source, process

Relationships:
- (Defect)-[:CAUSED_BY]->(Process)
- (Process)-[:USES_EQUIPMENT]->(Equipment)
- (Process)-[:USES_MATERIAL]->(Material)
- (Product)-[:CONFORMS_TO {item, criteria, measured, judgment}]->(Spec)
- (Equipment)-[:MAINTAINED_ON]->(Maintenance)
- (Process)-[:PRODUCES]->(Product)
- (Process)-[:NEXT_PROCESS]->(Process)
- (Product)-[:HAS_DEFECT]->(Defect)
- (InspectionTable)-[:MENTIONS]->(Product|Spec|Defect)
- (QualityReport)-[:HAS_TABLE]->(InspectionTable)
"""`
        },
        callout: {
          type: 'key',
          text: 'Part 1~5 전체 스키마 — 7개 엔티티 + Part 5 표 노드 + 11개 관계. 이 스키마가 Text2Cypher의 기반'
        }
      },
      {
        id: '2-3',
        tag: 'practice',
        title: '기본 Text2Cypher 구현',
        script: '기본 구현은 시스템 프롬프트에 그래프 스키마와 규칙을 명시하고, LLM이 Cypher를 생성하도록 합니다. OpenAI 외에 Claude도 Text2Cypher에 사용할 수 있습니다. Claude는 긴 스키마 컨텍스트 처리에 강점이 있어 복잡한 도메인에 적합합니다.',
        code: {
          language: 'python',
          code: `# 선택지 1: OpenAI
from openai import OpenAI
client = OpenAI()  # OPENAI_API_KEY 환경변수 자동 로드

system = f"""당신은 Cypher 쿼리 전문가입니다.
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
cypher = response.choices[0].message.content

# 선택지 2: Claude (긴 스키마 컨텍스트에 강점)
# import anthropic
# client = anthropic.Anthropic()  # ANTHROPIC_API_KEY 환경변수 자동 로드
# response = client.messages.create(
#     model="claude-sonnet-4-5-20250514",
#     max_tokens=1024,
#     temperature=0,
#     system=system,
#     messages=[{"role": "user", "content": question}]
# )
# cypher = response.content[0].text`
        }
      },
      {
        id: '2-4',
        tag: 'practice',
        title: '잘 되는 질문 vs 안 되는 질문',
        script: '실제로 테스트해보면, 간단하고 명확한 질문은 잘 됩니다. 하지만 복잡한 Multi-hop 질문이나 추론이 필요한 질문은 실패합니다. 특히 Part 5에서 추가한 텍스트-표 교차 검색("검사 성적표에서 불합격 항목의 원인 공정 설비 점검 이력은?")은 3-hop + 표/텍스트 교차라서 기본 Text2Cypher로는 실패합니다.',
        table: {
          headers: ['질문', '결과', '이유'],
          rows: [
            {
              cells: [
                { text: '접착 박리의 원인 공정은?', bold: true },
                { text: '\u2705 성공', status: 'pass' },
                { text: '1-hop, 직접적 스키마 매핑' }
              ]
            },
            {
              cells: [
                { text: '전체 공정 순서를 보여줘', bold: true },
                { text: '\u2705 성공', status: 'pass' },
                { text: 'NEXT_PROCESS 관계 따라가기' }
              ]
            },
            {
              cells: [
                { text: 'HP-01 고장 시 영향받는 공정과 결함은?', bold: true },
                { text: '\u26A0\uFE0F 애매', status: 'warn' },
                { text: '2-hop, LLM 해석에 의존' }
              ]
            },
            {
              cells: [
                { text: '마찰재 문제 → 결함 예측', bold: true },
                { text: '\u274C 실패', status: 'fail' },
                { text: 'Multi-hop + 추론 필요' }
              ]
            },
            {
              cells: [
                { text: '검사 성적표에서 불합격 항목의 원인 공정 설비 점검 이력은?', bold: true },
                { text: '\u274C 실패', status: 'fail' },
                { text: '3-hop + 표/텍스트 교차 (Part 5 데이터)' }
              ]
            }
          ]
        }
      },
      {
        id: '2-5',
        tag: 'theory',
        title: 'Schema Tuning — include/exclude',
        script: '스키마를 LLM에 전부 주면 혼란스러워합니다. 관련 없는 노드 라벨이나 관계를 제외하고, 질문과 관련된 부분만 선별해서 주면 정확도가 올라갑니다. 제조 도메인에서 결함 분석 질문이면 Process, Equipment, Defect, CAUSED_BY에 집중합니다. 하지만 이것도 한계가 있습니다. 이 한계를 극복하려면? Agent가 필요합니다.',
        code: {
          language: 'python',
          code: `# 스키마 필터링 예시 — 제조 도메인 결함 분석
chain = GraphCypherQAChain.from_llm(
    llm=llm,
    graph=graph,
    include_types=["Process", "Equipment", "Defect", "CAUSED_BY",
                   "USES_EQUIPMENT"],
    exclude_types=["InspectionTable", "TableSummary",
                   "MENTIONS"]  # 표 관련 타입 제외
)`
        },
        callout: {
          type: 'warn',
          text: '이 한계를 극복하려면? → Agent가 필요합니다'
        }
      },
      {
        id: '2-6',
        tag: 'theory',
        title: '"이걸 어떻게 더 개선하지?" — Agent 전환',
        script: 'Schema Tuning으로 좀 나아졌지만, 여전히 복잡한 질문에서는 실패합니다. 생성된 Cypher에 문법 오류가 있어도, 지금 구조에서는 그냥 실행되거나 에러가 납니다. 검증도 없고, 교정도 없어요. 만약에 생성 → 검증 → 교정 → 실행 단계를 만들면? 이게 바로 Text2Cypher Agent입니다.',
        diagram: {
          nodes: [
            { text: '기본 Text2Cypher', type: 'fail' },
            { text: '검증 없음, 교정 없음', type: 'dim' },
            { text: 'Agent 파이프라인', type: 'entity' },
            { text: 'generate \u2192 validate \u2192 correct \u2192 execute', type: 'dim' }
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
          text: 'LangGraph로 구현하는 자가 교정 Agent \u2014 generate \u2192 validate \u2192 correct \u2192 execute'
        }
      },
      {
        id: '3-2',
        tag: 'practice',
        title: 'generate \u2014 Cypher 생성 + Few-shot',
        script: 'generate 단계에서는 SemanticSimilarityExampleSelector를 사용합니다. 유사한 질문-쿼리 쌍을 자동으로 선택해서 few-shot 예시로 프롬프트에 포함합니다. 제조 도메인의 Few-shot 예시는 결함 추적, 설비-공정 관계, 규격 검사 세 가지를 포함합니다.',
        code: {
          language: 'python',
          code: `from langchain.prompts import SemanticSimilarityExampleSelector
from langchain_openai import OpenAIEmbeddings

# Few-shot 예시 데이터 — 제조 도메인 3가지 패턴
few_shot_examples = [
    {
        "question": "접착 박리의 원인 공정은?",
        "cypher": "MATCH (d:Defect {name:'접착 박리'})-[:CAUSED_BY]->(p:Process) RETURN p.name"
    },
    {
        "question": "접착기 A-3을 사용하는 공정에서 발생한 결함은?",
        "cypher": "MATCH (e:Equipment {name:'접착기 A-3'})<-[:USES_EQUIPMENT]-(p:Process)<-[:CAUSED_BY]-(d:Defect) RETURN d.name, p.name"
    },
    {
        "question": "KS M 6613 규격을 미달한 제품의 불합격 항목은?",
        "cypher": "MATCH (p:Product)-[c:CONFORMS_TO]->(s:Spec {name:'KS M 6613'}) WHERE c.judgment = '불합격' RETURN p.name, c.item, c.measured"
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
        title: 'validate \u2014 6가지 체크',
        script: 'validate 단계에서는 생성된 Cypher 쿼리를 6가지 측면에서 검증합니다. 문법 오류, 존재하지 않는 노드 라벨, 잘못된 관계 타입, 프로퍼티 이름 오류, 관계 방향 문제, 집계 함수 오류까지 체크합니다.',
        table: {
          headers: ['Check', '\uC124\uBA85', '\uC5D0\uB7EC \uC608\uC2DC'],
          rows: [
            {
              cells: [
                { text: '\uBB38\uBC95 \uAC80\uC0AC', bold: true },
                { text: 'Cypher \uD30C\uC2F1 \uAC00\uB2A5 \uC5EC\uBD80' },
                { text: 'MTACH \u2192 MATCH' }
              ]
            },
            {
              cells: [
                { text: '\uB178\uB4DC \uB77C\uBCA8', bold: true },
                { text: '\uC2A4\uD0A4\uB9C8\uC5D0 \uC874\uC7AC\uD558\uB294\uAC00' },
                { text: ':Equip \u2192 :Equipment (\uC5C6\uC74C)' }
              ]
            },
            {
              cells: [
                { text: '\uAD00\uACC4 \uD0C0\uC785', bold: true },
                { text: '\uC2A4\uD0A4\uB9C8\uC5D0 \uC874\uC7AC\uD558\uB294\uAC00' },
                { text: ':USES \u2192 :USES_EQUIPMENT' }
              ]
            },
            {
              cells: [
                { text: '\uD504\uB85C\uD37C\uD2F0', bold: true },
                { text: '\uB178\uB4DC/\uAD00\uACC4\uC5D0 \uC874\uC7AC\uD558\uB294\uAC00' },
                { text: 'n.names \u2192 n.name' }
              ]
            },
            {
              cells: [
                { text: '\uBC29\uD5A5', bold: true },
                { text: '\uAD00\uACC4 \uBC29\uD5A5 \uC62C\uBC14\uB978\uAC00' },
                { text: '(Defect)\u2192[:CAUSED_BY]\u2192(Process) \uD655\uC778' }
              ]
            },
            {
              cells: [
                { text: '\uC9D1\uACC4', bold: true },
                { text: 'GROUP BY \uD544\uC694\uD55C\uAC00' },
                { text: 'COUNT/SUM \uC720\uD6A8\uC131' }
              ]
            }
          ]
        }
      },
      {
        id: '3-3b',
        tag: 'practice',
        title: 'validate_cypher \u2014 \uAD6C\uD604 \uCF54\uB4DC (5\uBC88 \uBC29\uD5A5 \uAC80\uC0AC \uD3EC\uD568)',
        script: 'validate_cypher \uD568\uC218\uB97C \uC9C1\uC811 \uAD6C\uD604\uD574\uBD05\uC2DC\uB2E4. \uC2A4\uD0A4\uB9C8 \uC815\uBCF4\uB97C \uBC1B\uC544\uC11C 6\uAC00\uC9C0 \uCCB4\uD06C\uB97C \uC218\uD589\uD569\uB2C8\uB2E4. \uD2B9\uD788 5\uBC88 \uAD00\uACC4 \uBC29\uD5A5 \uAC80\uC0AC\uB97C \uC2E4\uC81C\uB85C \uAD6C\uD604\uD569\uB2C8\uB2E4. \uC2A4\uD0A4\uB9C8\uC5D0 \uC815\uC758\uB41C (source)-[:REL]->(target) \uBC29\uD5A5\uACFC \uCFFC\uB9AC\uC758 \uBC29\uD5A5\uC774 \uB2E4\uB974\uBA74 \uC5D0\uB7EC\uB97C \uBCF4\uACE0\uD569\uB2C8\uB2E4. \uC608\uB97C \uB4E4\uC5B4 (Process)-[:CAUSED_BY]->(Defect)\uB85C \uC798\uBABB \uC4F0\uBA74, \uC2A4\uD0A4\uB9C8\uC0C1 (Defect)-[:CAUSED_BY]->(Process)\uC774\uBBC0\uB85C \uBC29\uD5A5 \uC624\uB958\uB97C \uAC10\uC9C0\uD569\uB2C8\uB2E4.',
        code: {
          language: 'python',
          code: `def validate_cypher(cypher: str, schema: dict) -> list[str]:
    """Cypher \uCFFC\uB9AC\uB97C 6\uAC00\uC9C0 \uCE21\uBA74\uC5D0\uC11C \uAC80\uC99D"""
    errors = []

    # 1. \uBB38\uBC95 \uAC80\uC0AC \u2014 EXPLAIN\uC73C\uB85C \uD30C\uC2F1 \uD14C\uC2A4\uD2B8
    try:
        driver.execute_query(f"EXPLAIN {cypher}")
    except Exception as e:
        errors.append(f"\uBB38\uBC95 \uC624\uB958: {e}")
        return errors  # \uBB38\uBC95 \uC624\uB958\uBA74 \uB098\uBA38\uC9C0 \uCCB4\uD06C \uBD88\uAC00

    import re

    # 2. \uB178\uB4DC \uB77C\uBCA8 \uAC80\uC0AC
    labels_in_query = re.findall(r':\\\\s*(\\\\w+)', cypher)
    valid_labels = schema.get("node_labels", [])
    for label in labels_in_query:
        if label not in valid_labels:
            errors.append(f"\uC874\uC7AC\uD558\uC9C0 \uC54A\uB294 \uB77C\uBCA8: {label}")

    # 3. \uAD00\uACC4 \uD0C0\uC785 \uAC80\uC0AC
    rels_in_query = re.findall(r'\\\\[:\\\\s*(\\\\w+)', cypher)
    valid_rels = schema.get("relationship_types", [])
    for rel in rels_in_query:
        if rel not in valid_rels:
            errors.append(f"\uC874\uC7AC\uD558\uC9C0 \uC54A\uB294 \uAD00\uACC4: {rel}")

    # 4. \uD504\uB85C\uD37C\uD2F0 \uAC80\uC0AC
    props_in_query = re.findall(r'(\\\\w+)\\\\.(\\\\w+)', cypher)
    for alias, prop in props_in_query:
        if prop not in schema.get("properties", []):
            errors.append(f"\uC874\uC7AC\uD558\uC9C0 \uC54A\uB294 \uD504\uB85C\uD37C\uD2F0: {prop}")

    # 5. \uAD00\uACC4 \uBC29\uD5A5 \uAC80\uC0AC \u2014 \uC2A4\uD0A4\uB9C8 \uBC29\uD5A5\uACFC \uCFFC\uB9AC \uBC29\uD5A5 \uBE44\uAD50
    for rel_def in schema.get("rel_directions", []):
        src = rel_def["source"]
        rel_type = rel_def["rel"]
        tgt = rel_def["target"]
        # \uC798\uBABB\uB41C \uBC29\uD5A5 \uD328\uD134 \uAC10\uC9C0: (target)-[:REL]->(source)
        wrong_pattern = rf'\\(\\w*:{tgt}\\s*\\{{?[^)]*\\}}?\\)\\s*-\\[\\w*:{rel_type}[^]]*\\]->\\s*\\(\\w*:{src}'
        if re.search(wrong_pattern, cypher):
            errors.append(
                f"\uBC29\uD5A5 \uC624\uB958: (:{tgt})-[:{rel_type}]->(:{src}) "
                f"\u2192 \uC62C\uBC14\uB978 \uBC29\uD5A5: (:{src})-[:{rel_type}]->(:{tgt})"
            )

    # 6. \uC9D1\uACC4 \uD568\uC218 \uAC80\uC0AC
    if re.search(r'count|sum|avg', cypher, re.I):
        if 'RETURN' not in cypher.upper():
            errors.append("\uC9D1\uACC4 \uD568\uC218\uC5D0 RETURN \uB204\uB77D")

    return errors  # \uBE48 \uB9AC\uC2A4\uD2B8 = \uD1B5\uACFC`
        },
        callout: {
          type: 'key',
          text: 'validate_cypher 5\uBC88 \uBC29\uD5A5 \uAC80\uC0AC: \uC2A4\uD0A4\uB9C8\uC758 (source)-[:REL]->(target)\uACFC \uCFFC\uB9AC \uBC29\uD5A5\uC744 \uC815\uADDC\uC2DD\uC73C\uB85C \uBE44\uAD50'
        }
      },
      {
        id: '3-3c',
        tag: 'practice',
        title: 'CypherQueryCorrector \u2014 \uADDC\uCE59 \uAE30\uBC18 \uAD50\uC815',
        script: 'CypherQueryCorrector\uB294 LLM \uC5C6\uC774 \uADDC\uCE59\uB9CC\uC73C\uB85C \uAD50\uC815\uD558\uB294 \uB3C4\uAD6C\uC785\uB2C8\uB2E4. \uC81C\uC870 \uB3C4\uBA54\uC778\uC758 \uAD00\uACC4 \uBC29\uD5A5\uC744 \uC2A4\uD0A4\uB9C8\uC5D0 \uB9DE\uCDB0 \uC790\uB3D9 \uAD50\uC815\uD569\uB2C8\uB2E4. \uC608\uB97C \uB4E4\uC5B4 \uC2A4\uD0A4\uB9C8\uC5D0 (Defect)-[:CAUSED_BY]->(Process)\uB85C \uC815\uC758\uB418\uC5B4 \uC788\uB294\uB370, \uCFFC\uB9AC\uC5D0\uC11C (Process)-[:CAUSED_BY]->(Defect)\uB85C \uC798\uBABB \uC4F0\uBA74, \uC790\uB3D9\uC73C\uB85C (Process)<-[:CAUSED_BY]-(Defect)\uB85C \uAD50\uC815\uD569\uB2C8\uB2E4. LLM \uD638\uCD9C \uC5C6\uC774 \uBE60\uB974\uAC8C \uAD50\uC815\uD560 \uC218 \uC788\uC5B4\uC11C, LLM \uAE30\uBC18 \uAD50\uC815 \uC804\uC5D0 \uBA3C\uC800 \uC2E4\uD589\uD569\uB2C8\uB2E4.',
        code: {
          language: 'python',
          code: `class CypherQueryCorrector:
    """\uADDC\uCE59 \uAE30\uBC18 Cypher \uCFFC\uB9AC \uAD50\uC815\uAE30"""

    def __init__(self, schema_relations: list[dict]):
        # \uC2A4\uD0A4\uB9C8\uC5D0 \uC815\uC758\uB41C \uAD00\uACC4 \uBC29\uD5A5
        self.relations = schema_relations

    def correct(self, cypher: str) -> str:
        """\uAD00\uACC4 \uBC29\uD5A5 \uC624\uB958\uB97C \uADDC\uCE59 \uAE30\uBC18\uC73C\uB85C \uAD50\uC815"""
        corrected = cypher

        for rel_def in self.relations:
            src = rel_def["source"]
            rel = rel_def["rel"]
            tgt = rel_def["target"]

            # \uC798\uBABB\uB41C \uBC29\uD5A5 \uAC10\uC9C0: (target)-[:REL]->(source)
            wrong = f"(:{tgt})-[:{rel}]->(:{src})"
            right = f"(:{tgt})<-[:{rel}]-(:{src})"

            if wrong in corrected:
                corrected = corrected.replace(wrong, right)

        return corrected

# \uC81C\uC870 \uB3C4\uBA54\uC778 \uC2A4\uD0A4\uB9C8 \uAD00\uACC4
corrector = CypherQueryCorrector([
    {"source": "Process", "rel": "USES_EQUIPMENT", "target": "Equipment"},
    {"source": "Process", "rel": "USES_MATERIAL", "target": "Material"},
    {"source": "Defect", "rel": "CAUSED_BY", "target": "Process"},
    {"source": "Process", "rel": "PRODUCES", "target": "Product"},
    {"source": "Product", "rel": "CONFORMS_TO", "target": "Spec"},
    {"source": "Equipment", "rel": "MAINTAINED_ON", "target": "Maintenance"},
    {"source": "Process", "rel": "NEXT_PROCESS", "target": "Process"},
])

# \uC798\uBABB\uB41C \uCFFC\uB9AC \u2192 \uC790\uB3D9 \uAD50\uC815
bad = "MATCH (p:Process)-[:CAUSED_BY]->(d:Defect) RETURN d"
fixed = corrector.correct(bad)
# \u2192 MATCH (p:Process)<-[:CAUSED_BY]-(d:Defect) RETURN d`
        },
        callout: {
          type: 'tip',
          text: 'CypherQueryCorrector: LLM \uD638\uCD9C \uC5C6\uC774 \uADDC\uCE59 \uAE30\uBC18 \uAD50\uC815 \u2192 \uBE60\uB974\uACE0 \uC815\uD655. LLM \uAD50\uC815 \uC804\uC5D0 \uBA3C\uC800 \uC2E4\uD589'
        }
      },
      {
        id: '3-4',
        tag: 'practice',
        title: 'CypherQueryCorrector + correct_cypher \u2014 \uC774\uC911 \uAD50\uC815',
        script: 'validate\uC5D0\uC11C \uC624\uB958\uAC00 \uBC1C\uACAC\uB418\uBA74 correct \uB2E8\uACC4\uB85C \uAC11\uB2C8\uB2E4. \uC774\uC911 \uAD50\uC815\uC774\uC5D0\uC694. CypherQueryCorrector\uB294 \uADDC\uCE59 \uAE30\uBC18\uC73C\uB85C \uAD00\uACC4 \uBC29\uD5A5 \uC624\uB958 \uAC19\uC740 \uAE30\uACC4\uC801 \uAD50\uC815\uC744 \uD569\uB2C8\uB2E4. correct_cypher\uB294 LLM \uAE30\uBC18\uC73C\uB85C \uADDC\uCE59\uC73C\uB85C \uBABB \uACE0\uCE58\uB294 \uAC83\uC744 LLM\uC5D0\uAC8C \uAD50\uC815 \uC694\uCCAD\uD569\uB2C8\uB2E4. \uC5D0\uB7EC \uC815\uBCF4\uB97C \uD568\uAED8 \uC8FC\uBA74 LLM\uC774 \uD6E8\uC52C \uC815\uD655\uD558\uAC8C \uACE0\uCE69\uB2C8\uB2E4.',
        code: {
          language: 'python',
          code: `# correct: LLM\uC774 \uC5D0\uB7EC \uBA54\uC2DC\uC9C0 \uBCF4\uACE0 \uC218\uC815
def correct_cypher(cypher: str, error_msg: str) -> str:
    corrected = llm.invoke(f"""
\uC5D0\uB7EC\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4:
{error_msg}

\uC6D0\uBCF8 \uCFFC\uB9AC:
{cypher}

\uC5D0\uB7EC\uB97C \uC218\uC815\uD55C Cypher \uCFFC\uB9AC\uB9CC \uBC18\uD658\uD558\uC138\uC694.
""")
    return corrected

# execute: Neo4j\uC5D0\uC11C \uC2E4\uD589
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
        title: '\uAE30\uBCF8 vs Agent \u2014 \uACB0\uACFC \uBE44\uAD50',
        script: '\uAE30\uBCF8 Text2Cypher\uC640 Agent\uC758 \uCC28\uC774\uB294 \uBA85\uD655\uD569\uB2C8\uB2E4. \uAE30\uBCF8\uC740 \uAC04\uB2E8\uD55C \uC9C8\uBB38\uB9CC \uCC98\uB9AC\uD558\uACE0 \uC5D0\uB7EC \uCC98\uB9AC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. Agent\uB294 \uC790\uAC00 \uAD50\uC815 \uB2A5\uB825\uC774 \uC788\uC5B4\uC11C \uBCF5\uC7A1\uD55C \uC9C8\uBB38\uB3C4 \uCC98\uB9AC\uD569\uB2C8\uB2E4. \uCC38\uACE0: \uC544\uB798 \uC815\uD655\uB3C4 \uC218\uCE58\uB294 \uC608\uC2DC\uC774\uBA70, \uC2E4\uC81C \uC218\uCE58\uB294 \uB3C4\uBA54\uC778\uACFC \uC9C8\uBB38 \uBCF5\uC7A1\uB3C4\uC5D0 \uB530\uB77C \uB2EC\uB77C\uC9D1\uB2C8\uB2E4. \uCE21\uC815 \uBC29\uBC95: \uBBF8\uB9AC \uC900\uBE44\uD55C \uC9C8\uBB38 20\uAC1C\uC5D0 \uB300\uD574 \uC0DD\uC131\uB41C Cypher\uC758 \uC815\uD655\uC131\uACFC \uC2E4\uD589 \uACB0\uACFC\uB97C \uC218\uB3D9 \uAC80\uC99D\uD569\uB2C8\uB2E4.',
        table: {
          headers: ['\uD56D\uBAA9', '\uAE30\uBCF8 Text2Cypher', 'Agent'],
          rows: [
            {
              cells: [
                { text: '\uAC04\uB2E8\uD55C \uC9C8\uBB38', bold: true },
                { text: '\u2705 OK', status: 'pass' },
                { text: '\u2705 OK', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '\uBCF5\uC7A1\uD55C \uC9C8\uBB38', bold: true },
                { text: '\u274C \uC2E4\uD328', status: 'fail' },
                { text: '\u2705 \uCC98\uB9AC', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '\uC5D0\uB7EC \uCC98\uB9AC', bold: true },
                { text: '\u274C \uC5C6\uC74C', status: 'fail' },
                { text: '\u2705 \uC790\uAC00 \uAD50\uC815', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '\uAC80\uC99D \uB2E8\uACC4', bold: true },
                { text: '\uC5C6\uC74C' },
                { text: '6\uB2E8\uACC4 \uAC80\uC99D' }
              ]
            },
            {
              cells: [
                { text: '\uC815\uD655\uB3C4 (\uC608\uC2DC*)', bold: true },
                { text: '\uB0AE\uC74C' },
                { text: '\uB192\uC74C' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: '* \uC815\uD655\uB3C4\uB294 \uC608\uC2DC\uC785\uB2C8\uB2E4. \uC2E4\uC81C \uC218\uCE58\uB294 \uB3C4\uBA54\uC778\uACFC \uC9C8\uBB38 \uBCF5\uC7A1\uB3C4\uC5D0 \uB530\uB77C \uB2EC\uB77C\uC9D1\uB2C8\uB2E4. \uCE21\uC815: 20\uAC1C \uD14C\uC2A4\uD2B8 \uC9C8\uBB38\uC73C\uB85C Cypher \uC815\uD655\uC131+\uC2E4\uD589 \uACB0\uACFC \uC218\uB3D9 \uAC80\uC99D'
        }
      }
    ]
  },
  // Section 4: \uD558\uC774\uBE0C\uB9AC\uB4DC \uAC80\uC0C9 + \uB370\uBAA8
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '4-1',
        tag: 'theory',
        title: '\uBCA1\uD130 + Graph + RRF \uD1B5\uD569',
        script: '\uD558\uC774\uBE0C\uB9AC\uB4DC \uAC80\uC0C9\uC740 Part 5\uC5D0\uC11C \uB9CC\uB4E0 hybrid_search() \uD568\uC218\uB97C \uD655\uC7A5\uD569\uB2C8\uB2E4. \uBCA1\uD130 \uAC80\uC0C9\uACFC \uADF8\uB798\uD504 \uAC80\uC0C9\uC744 \uB3D9\uC2DC\uC5D0 \uC218\uD589\uD558\uACE0, RRF(Reciprocal Rank Fusion)\uB85C \uACB0\uACFC\uB97C \uD1B5\uD569\uD569\uB2C8\uB2E4. \uADF8 \uB2E4\uC74C Reranker\uB85C \uC7AC\uC815\uB82C\uD558\uACE0, LLM\uC774 \uCD5C\uC885 \uB2F5\uBCC0\uC744 \uC0DD\uC131\uD569\uB2C8\uB2E4.',
        diagram: {
          nodes: [
            { text: 'Query', type: 'entity' },
            { text: '\uBCD1\uB82C \uAC80\uC0C9', type: 'relation' },
            { text: 'Vector Search', type: 'entity' },
            { text: 'Graph Search', type: 'entity' },
            { text: 'RRF Fusion', type: 'relation' },
            { text: 'Reranker', type: 'entity' },
            { text: 'LLM \uB2F5\uBCC0', type: 'relation' }
          ]
        },
        callout: {
          type: 'key',
          text: 'RRF: \uBCA1\uD130\uC640 \uADF8\uB798\uD504 \uAC80\uC0C9 \uACB0\uACFC\uB97C \uC21C\uC704 \uAE30\uBC18\uC73C\uB85C \uD1B5\uD569\uD558\uB294 \uC54C\uACE0\uB9AC\uC998'
        }
      },
      {
        id: '4-1b',
        tag: 'practice',
        title: 'RRF \uAD6C\uD604 \u2014 Reciprocal Rank Fusion',
        script: 'RRF\uB294 \uBCA1\uD130 \uAC80\uC0C9\uACFC \uADF8\uB798\uD504 \uAC80\uC0C9 \uACB0\uACFC\uB97C \uC21C\uC704 \uAE30\uBC18\uC73C\uB85C \uD1B5\uD569\uD558\uB294 \uC54C\uACE0\uB9AC\uC998\uC785\uB2C8\uB2E4. \uAC01 \uACB0\uACFC\uC758 \uC21C\uC704\uC5D0 1/(k+rank+1) \uC810\uC218\uB97C \uBD80\uC5EC\uD558\uACE0, \uB450 \uAC80\uC0C9\uC5D0 \uBAA8\uB450 \uB098\uD0C0\uB09C \uACB0\uACFC\uB294 \uC810\uC218\uAC00 \uD569\uC0B0\uB418\uC5B4 \uC0C1\uC704\uB85C \uC62C\uB77C\uAC11\uB2C8\uB2E4. k=60\uC774 \uC77C\uBC18\uC801\uC778 \uAE30\uBCF8\uAC12\uC785\uB2C8\uB2E4. Part 5\uC758 hybrid_search()\uAC00 \uBC18\uD658\uD558\uB294 vector/graph \uACB0\uACFC\uB97C \uC5EC\uAE30\uC11C \uD1B5\uD569\uD569\uB2C8\uB2E4.',
        code: {
          language: 'python',
          code: `def rrf_fusion(vector_results: list, graph_results: list, k: int = 60) -> list:
    """Reciprocal Rank Fusion \u2014 \uBCA1\uD130+\uADF8\uB798\uD504 \uACB0\uACFC \uD1B5\uD569"""
    scores = {}
    for rank, item in enumerate(vector_results):
        key = item.get("id") or item.get("name")
        scores[key] = scores.get(key, 0) + 1 / (k + rank + 1)
    for rank, item in enumerate(graph_results):
        key = item.get("id") or item.get("name")
        scores[key] = scores.get(key, 0) + 1 / (k + rank + 1)
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)

# Part 5 hybrid_search() \uACB0\uACFC\uB97C RRF\uB85C \uD1B5\uD569
search_result = hybrid_search("\uC811\uCC29 \uB3C4\uD3EC \uACF5\uC815\uC758 \uBD88\uD569\uACA9 \uD56D\uBAA9\uC740?")
fused = rrf_fusion(search_result["vector"], search_result["graph"])
# fused: [("BP-100 \uACBD\uB3C4 \uBBF8\uB2EC", 0.032), ("\uC811\uCC29 \uBC15\uB9AC", 0.016), ...]`
        },
        callout: {
          type: 'tip',
          text: 'RRF k=60 \uAE30\uBCF8\uAC12. \uBCA1\uD130/\uADF8\uB798\uD504 \uC591\uCABD\uC5D0 \uB098\uD0C0\uB09C \uACB0\uACFC\uAC00 \uC810\uC218 \uD569\uC0B0\uC73C\uB85C \uC0C1\uC704\uB85C'
        }
      },
      {
        id: '4-2',
        tag: 'theory',
        title: 'Prompt Routing \u2014 \uC9C8\uBB38 \uC720\uD615 \uBD84\uB958',
        script: 'Router\uB294 \uC9C8\uBB38 \uC720\uD615\uC744 \uBD84\uC11D\uD574\uC11C \uCD5C\uC801\uC758 \uAC80\uC0C9 \uBC29\uBC95\uC744 \uC120\uD0DD\uD569\uB2C8\uB2E4. \uC0AC\uC2E4 \uD655\uC778\uC740 \uBCA1\uD130 \uAC80\uC0C9, \uAD00\uACC4 \uCD94\uC801\uC740 \uADF8\uB798\uD504 \uAC80\uC0C9, \uBCF5\uD569 \uC9C8\uBB38\uC740 \uD558\uC774\uBE0C\uB9AC\uB4DC \uAC80\uC0C9\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4.',
        table: {
          headers: ['Query Type', 'Route', '\uC608\uC2DC'],
          rows: [
            {
              cells: [
                { text: '\uC0AC\uC2E4 \uD655\uC778', bold: true },
                { text: 'Vector' },
                { text: '\uC811\uCC29 \uB3C4\uD3EC \uACF5\uC815\uC758 \uD3C9\uADE0 \uC628\uB3C4\uB294?' }
              ]
            },
            {
              cells: [
                { text: '\uAD00\uACC4 \uCD94\uC801', bold: true },
                { text: 'Graph' },
                { text: '\uC811\uCC29\uAE30 A-3 \uACE0\uC7A5 \uC2DC \uC601\uD5A5\uBC1B\uB294 \uACF5\uC815\uACFC \uACB0\uD568\uC740?' }
              ]
            },
            {
              cells: [
                { text: '\uBCF5\uD569', bold: true },
                { text: 'Hybrid' },
                { text: '\uBD88\uD569\uACA9 \uD310\uC815\uB41C \uC81C\uD488\uC758 \uC6D0\uC778 \uACF5\uC815\uC5D0\uC11C \uC0AC\uC6A9\uB41C \uC124\uBE44 \uC810\uAC80 \uC774\uB825\uC740?' }
              ]
            }
          ]
        }
      },
      {
        id: '4-2b',
        tag: 'theory',
        title: 'Prompt Routing \uC544\uD0A4\uD14D\uCC98 \u2014 Query \u2192 Task \u2192 Prompt Pool',
        script: 'Prompt Routing\uC744 \uB354 \uC790\uC138\uD788 \uBCF4\uACA0\uC2B5\uB2C8\uB2E4. \uC9C8\uBB38\uC774 \uB4E4\uC5B4\uC624\uBA74 \uBA3C\uC800 Task \uBD84\uB958\uB97C \uD569\uB2C8\uB2E4. "\uC774 \uC9C8\uBB38\uC774 \uC0AC\uC2E4 \uD655\uC778\uC778\uAC00, \uAD00\uACC4 \uCD94\uC801\uC778\uAC00, \uBE44\uAD50\uC778\uAC00?" \uBD84\uB958\uB41C Task\uC5D0 \uB530\uB77C \uCD5C\uC801\uD654\uB41C Prompt Pool\uC5D0\uC11C \uD504\uB86C\uD504\uD2B8\uB97C \uC120\uD0DD\uD569\uB2C8\uB2E4. \uC0AC\uC2E4 \uD655\uC778\uC774\uBA74 \uBCA1\uD130 \uAC80\uC0C9 \uD504\uB86C\uD504\uD2B8\uB97C, \uAD00\uACC4 \uCD94\uC801\uC774\uBA74 Cypher \uC0DD\uC131 \uD504\uB86C\uD504\uD2B8\uB97C, \uBE44\uAD50\uBA74 \uD558\uC774\uBE0C\uB9AC\uB4DC \uD504\uB86C\uD504\uD2B8\uB97C \uC0AC\uC6A9\uD569\uB2C8\uB2E4.',
        diagram: {
          nodes: [
            { text: 'User Query', type: 'entity' },
            { text: 'Task \uBD84\uB958\uAE30', type: 'relation' },
            { text: 'Task: \uC0AC\uC2E4 \uD655\uC778', type: 'entity' },
            { text: 'Task: \uAD00\uACC4 \uCD94\uC801', type: 'entity' },
            { text: 'Task: \uBE44\uAD50/\uBD84\uC11D', type: 'entity' },
            { text: 'Prompt Pool', type: 'relation' },
            { text: '\uBCA1\uD130 \uAC80\uC0C9', type: 'dim' },
            { text: 'Cypher \uC0DD\uC131', type: 'dim' },
            { text: '\uD558\uC774\uBE0C\uB9AC\uB4DC', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: 'Query \u2192 Task \uBD84\uB958 \u2192 Prompt Pool\uC5D0\uC11C \uCD5C\uC801 \uD504\uB86C\uD504\uD2B8 \uC120\uD0DD \u2192 \uC815\uD655\uB3C4 \uD5A5\uC0C1'
        }
      },
      {
        id: '4-2c',
        tag: 'theory',
        title: 'Hard Prompting vs Soft Prompting',
        script: 'GraphRAG\uC5D0\uC11C \uD504\uB86C\uD504\uD305\uC740 \uD06C\uAC8C \uB450 \uAC00\uC9C0\uB85C \uB098\uB261\uB2C8\uB2E4. Hard Prompting\uC740 \uD14D\uC2A4\uD2B8 \uAE30\uBC18 \uD504\uB86C\uD504\uD2B8\uC785\uB2C8\uB2E4. CoT(Chain of Thought)\uB294 \uCD94\uB860 \uACFC\uC815\uC744 \uB2E8\uACC4\uBCC4\uB85C \uBA85\uC2DC\uD569\uB2C8\uB2E4. IRCoT\uB294 \uAC80\uC0C9 \uACB0\uACFC\uB97C \uCD94\uB860 \uCCB4\uC778\uC5D0 \uD1B5\uD569\uD569\uB2C8\uB2E4. Text2Cypher\uB294 \uC790\uC5F0\uC5B4\uB97C Cypher\uB85C \uBCC0\uD658\uD569\uB2C8\uB2E4. Routing\uC740 \uC9C8\uBB38 \uC720\uD615\uC5D0 \uB530\uB77C \uACBD\uB85C\uB97C \uBD84\uAE30\uD569\uB2C8\uB2E4. Soft Prompting\uC740 \uC784\uBCA0\uB529 \uAE30\uBC18\uC785\uB2C8\uB2E4. KG Embedding\uC740 TransE, DistMult \uAC19\uC740 \uBAA8\uB378\uB85C \uADF8\uB798\uD504\uB97C \uBCA1\uD130\uD654\uD569\uB2C8\uB2E4. Heterogeneous Graph Embedding\uC740 \uC11C\uB85C \uB2E4\uB978 \uD0C0\uC785\uC758 \uB178\uB4DC/\uC5E3\uC9C0\uB97C \uD1B5\uD569 \uC784\uBCA0\uB529\uD569\uB2C8\uB2E4.',
        table: {
          headers: ['\uAD6C\uBD84', '\uBC29\uBC95', '\uD2B9\uC9D5'],
          rows: [
            {
              cells: [
                { text: 'Hard Prompting', bold: true },
                { text: 'CoT, IRCoT, Text2Cypher, Routing' },
                { text: '\uD14D\uC2A4\uD2B8 \uAE30\uBC18, \uD574\uC11D \uAC00\uB2A5', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Soft Prompting', bold: true },
                { text: 'KG Embedding, HetGraph Embedding' },
                { text: '\uC784\uBCA0\uB529 \uAE30\uBC18, \uD559\uC2B5 \uD544\uC694', status: 'warn' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '\uC2E4\uBB34\uC5D0\uC11C\uB294 Hard Prompting\uBD80\uD130 \uC2DC\uC791\uD558\uC138\uC694. Soft Prompting\uC740 \uB370\uC774\uD130\uAC00 \uCDA9\uBD84\uD560 \uB54C \uACE0\uB824'
        }
      },
      {
        id: '4-3',
        tag: 'theory',
        title: '\uBA54\uD0C0 \uD544\uD130\uB9C1 + \uAC00\uC9C0\uCE58\uAE30 + RERANKER',
        script: '\uAC80\uC0C9 \uACB0\uACFC\uB97C \uADF8\uB300\uB85C \uC4F0\uBA74 \uC548 \uB429\uB2C8\uB2E4. \uD6C4\uCC98\uB9AC\uAC00 \uD544\uC694\uD574\uC694. \uBA54\uD0C0 \uD544\uD130\uB9C1\uC740 \uB0A0\uC9DC, \uCD9C\uCC98, \uCE74\uD14C\uACE0\uB9AC\uB85C \uBD88\uD544\uC694\uD55C \uACB0\uACFC\uB97C \uC81C\uC678\uD569\uB2C8\uB2E4. \uAC00\uC9C0\uCE58\uAE30\uB294 \uAD00\uB828\uC131 \uB0AE\uC740 \uACB0\uACFC\uB97C \uC798\uB77C\uB0C5\uB2C8\uB2E4. RERANKER\uB294 Cross-encoder\uB85C \uCD5C\uC885 \uC7AC\uC21C\uC704\uB97C \uB9E4\uAE41\uB2C8\uB2E4. \uC774\uAC8C \uB2F5\uBCC0 \uD488\uC9C8\uC744 \uD06C\uAC8C \uC62C\uB9BD\uB2C8\uB2E4.',
        diagram: {
          nodes: [
            { text: '\uAC80\uC0C9 \uACB0\uACFC', type: 'entity' },
            { text: '\uBA54\uD0C0 \uD544\uD130\uB9C1', type: 'relation' },
            { text: '\uAC00\uC9C0\uCE58\uAE30', type: 'relation' },
            { text: 'RERANKER', type: 'entity' },
            { text: 'LLM \uB2F5\uBCC0 \uC0DD\uC131', type: 'relation' }
          ]
        },
        callout: {
          type: 'key',
          text: '\uAC80\uC0C9 \u2192 \uD544\uD130\uB9C1 \u2192 \uAC00\uC9C0\uCE58\uAE30 \u2192 Reranking \u2192 LLM \uB2F5\uBCC0 \uC0DD\uC131'
        }
      },
      {
        id: '4-4',
        tag: 'practice',
        title: 'graphrag_pipeline \u2014 \uC804\uCCB4 \uD30C\uC774\uD504\uB77C\uC778 \uAD6C\uD604',
        script: '\uC9C0\uAE08\uAE4C\uC9C0 \uB9CC\uB4E0 \uAD6C\uC131\uC694\uC18C\uB97C \uD558\uB098\uC758 \uD30C\uC774\uD504\uB77C\uC778\uC73C\uB85C \uD1B5\uD569\uD569\uB2C8\uB2E4. graphrag_pipeline \uD568\uC218\uB294 Router\uB85C \uC9C8\uBB38 \uC720\uD615\uC744 \uBD84\uB958\uD558\uACE0, Text2Cypher Agent\uB85C \uADF8\uB798\uD504 \uAC80\uC0C9\uC744 \uC218\uD589\uD558\uACE0, Part 5\uC758 hybrid_search\uB97C \uD655\uC7A5\uD55C RRF \uD1B5\uD569\uC744 \uC218\uD589\uD558\uACE0, Reranker \uD6C4\uCC98\uB9AC \uD6C4 LLM\uC774 \uCD5C\uC885 \uB2F5\uBCC0\uC744 \uC0DD\uC131\uD569\uB2C8\uB2E4.',
        code: {
          language: 'python',
          code: `def graphrag_pipeline(question: str) -> dict:
    """GraphRAG \uC804\uCCB4 \uD30C\uC774\uD504\uB77C\uC778 \u2014 Router + Text2Cypher Agent + RRF"""

    # 1. Router \u2014 \uC9C8\uBB38 \uC720\uD615 \uBD84\uB958
    route = classify_question(question)  # "vector" | "graph" | "hybrid"

    # 2. \uAC80\uC0C9 \uC2E4\uD589
    vector_results, graph_results = [], []
    if route in ("vector", "hybrid"):
        vector_results = vector_search(question)
    if route in ("graph", "hybrid"):
        # Text2Cypher Agent: generate \u2192 validate \u2192 correct \u2192 execute
        cypher = generate_cypher(question, graph_schema, few_shot_examples)
        errors = validate_cypher(cypher, schema_dict)
        if errors:
            cypher = corrector.correct(cypher)
            errors = validate_cypher(cypher, schema_dict)
            if errors:
                cypher = correct_cypher(cypher, str(errors))
        graph_results = execute_cypher(cypher)

    # 3. RRF \uD1B5\uD569
    if vector_results and graph_results:
        fused = rrf_fusion(vector_results, graph_results)
    else:
        fused = vector_results or graph_results

    # 4. Reranker \uD6C4\uCC98\uB9AC + LLM \uB2F5\uBCC0 \uC0DD\uC131
    context = rerank_results(fused, question)
    answer = llm.invoke(
        f"\uCEE8\uD14D\uC2A4\uD2B8:\\n{context}\\n\\n\uC9C8\uBB38: {question}\\n\\n\uCEE8\uD14D\uC2A4\uD2B8\uB97C \uAE30\uBC18\uC73C\uB85C \uC815\uD655\uD558\uAC8C \uB2F5\uBCC0\uD558\uC138\uC694."
    )

    return {
        "answer": answer,
        "cypher": cypher if route != "vector" else None,
        "route": route,
        "subgraph": graph_results
    }`
        },
        callout: {
          type: 'key',
          text: 'graphrag_pipeline: Router + Text2Cypher Agent + RRF + Reranker + LLM \uD1B5\uD569 \uD30C\uC774\uD504\uB77C\uC778'
        }
      },
      {
        id: '4-5',
        tag: 'practice',
        title: 'Streamlit \uB370\uBAA8 UI',
        script: '\uC644\uC131\uB41C GraphRAG \uC2DC\uC2A4\uD15C\uC744 Streamlit\uC73C\uB85C \uB370\uBAA8\uD574\uBD05\uC2DC\uB2E4. \uC9C8\uBB38\uC744 \uC785\uB825\uD558\uBA74, \uB2F5\uBCC0\uACFC \uD568\uAED8 \uC0DD\uC131\uB41C Cypher \uCFFC\uB9AC, \uAC80\uC0C9\uB41C \uC11C\uBE0C\uADF8\uB798\uD504\uB97C \uBCF4\uC5EC\uC90D\uB2C8\uB2E4.',
        code: {
          language: 'python',
          code: `import streamlit as st

st.title("GraphRAG \uB370\uBAA8 \u2014 \uC81C\uC870 \uD488\uC9C8 \uBD84\uC11D")

query = st.text_input(
    "\uC9C8\uBB38\uC744 \uC785\uB825\uD558\uC138\uC694",
    placeholder="\uC811\uCC29\uAE30 A-3\uC744 \uC0AC\uC6A9\uD558\uB294 \uACF5\uC815\uC5D0\uC11C \uBC1C\uC0DD\uD55C \uACB0\uD568\uC740?"
)

if query:
    with st.spinner("\uAC80\uC0C9 \uC911..."):
        result = graphrag_pipeline(query)

    st.success("\uB2F5\uBCC0:")
    st.write(result["answer"])

    col1, col2 = st.columns(2)
    with col1:
        st.metric("Route", result["route"])
    with col2:
        st.metric("Cypher \uC0DD\uC131", "\u2705" if result["cypher"] else "\u2014")

    with st.expander("\uC0DD\uC131\uB41C Cypher \uCFFC\uB9AC"):
        if result["cypher"]:
            st.code(result["cypher"], language="cypher")
        else:
            st.info("\uBCA1\uD130 \uAC80\uC0C9\uB9CC \uC0AC\uC6A9\uB418\uC5C8\uC2B5\uB2C8\uB2E4.")

    with st.expander("\uAC80\uC0C9\uB41C \uC11C\uBE0C\uADF8\uB798\uD504"):
        st.json(result["subgraph"])`
        },
        callout: {
          type: 'tip',
          text: '\uC644\uC131\uB41C GraphRAG \uC2DC\uC2A4\uD15C\uC744 Streamlit\uC73C\uB85C \uB370\uBAA8 \u2014 \uC9C8\uBB38 \u2192 \uB2F5\uBCC0 + Cypher + \uC11C\uBE0C\uADF8\uB798\uD504'
        }
      },
      {
        id: '4-6',
        tag: 'demo',
        title: '\uC2E4\uC81C \uC9C8\uBB38 \uD14C\uC2A4\uD2B8',
        script: '\uC2E4\uC81C\uB85C \uC9C8\uBB38\uC744 \uB358\uC838\uBD05\uC2DC\uB2E4. "\uC811\uCC29\uAE30 A-3\uC744 \uC0AC\uC6A9\uD558\uB294 \uACF5\uC815\uC5D0\uC11C \uBC1C\uC0DD\uD55C \uACB0\uD568\uC774 \uC788\uB294 \uC81C\uD488\uC758 \uADDC\uACA9 \uBBF8\uB2EC \uD56D\uBAA9\uC740?" \uC774 \uC9C8\uBB38\uC740 \uBCA1\uD130 RAG\uB85C\uB294 \uBD88\uAC00\uB2A5\uD588\uC9C0\uB9CC, GraphRAG\uB294 \uC815\uD655\uD788 \uB2F5\uD569\uB2C8\uB2E4. "BP-100\uC758 \uACBD\uB3C4 \uBBF8\uB2EC (HRS 42, \uAE30\uC900 HRS 45-65)" \u2014 Equipment(\uC811\uCC29\uAE30 A-3) \u2192 Process(\uC811\uCC29 \uB3C4\uD3EC) \u2192 Defect(\uC811\uCC29 \uBC15\uB9AC) \u2192 Product(BP-100) \u2192 CONFORMS_TO(\uACBD\uB3C4 \uBBF8\uB2EC)\uB85C 4-hop\uC744 \uC815\uD655\uD558\uAC8C \uCD94\uC801\uD569\uB2C8\uB2E4.',
        visual: 'Streamlit \uB370\uBAA8 \uD654\uBA74: \uC9C8\uBB38 \uC785\uB825 \u2192 \uB2F5\uBCC0 "BP-100\uC758 \uACBD\uB3C4 \uBBF8\uB2EC (HRS 42)" + Cypher \uCFFC\uB9AC + \uADF8\uB798\uD504 \uC2DC\uAC01\uD654',
        callout: {
          type: 'key',
          text: '4-hop Multi-hop \uC9C8\uBB38\uC5D0 \uC815\uD655\uD788 \uB2F5\uD558\uB294 GraphRAG \uC2DC\uC2A4\uD15C \uC644\uC131!'
        }
      },
      {
        id: '4-7',
        tag: 'discussion',
        title: 'Part 7 \uC608\uACE0 \u2014 \uD504\uB85C\uB355\uC158\uC73C\uB85C \uAC00\uB294 \uAE38',
        script: 'Part 6\uC5D0\uC11C \uB9CC\uB4E0 GraphRAG \uD30C\uC774\uD504\uB77C\uC778\uC758 Text2Cypher \uC815\uD655\uB3C4\uB294 \uBA87 %\uC77C\uAE4C\uC694? RAGAS\uB85C \uCE21\uC815\uD558\uACE0, GDBMS \uC120\uC815 \uAE30\uC900\uACFC \uC131\uB2A5 \uCD5C\uC801\uD654\uB97C \uB2E4\uB8F9\uB2C8\uB2E4. \uAD6C\uCCB4\uC801\uC73C\uB85C\uB294: RAGAS faithfulness, answer_relevancy, context_precision \uBA54\uD2B8\uB9AD\uC73C\uB85C \uD30C\uC774\uD504\uB77C\uC778 \uD488\uC9C8\uC744 \uC815\uB7C9\uC801\uC73C\uB85C \uD3C9\uAC00\uD558\uACE0, Neo4j vs Amazon Neptune vs TigerGraph \uC911 \uC81C\uC870 \uB3C4\uBA54\uC778\uC5D0 \uCD5C\uC801\uC778 GDBMS\uB97C \uC120\uC815\uD558\uACE0, \uC778\uB371\uC2A4 \uCD5C\uC801\uD654, \uCFFC\uB9AC \uCE90\uC2F1, \uBC30\uCE58 \uCC98\uB9AC\uB85C \uC2E4\uBB34 \uC131\uB2A5\uC744 \uAC1C\uC120\uD569\uB2C8\uB2E4.',
        callout: {
          type: 'tip',
          text: 'Part 7: RAGAS \uD3C9\uAC00 + GDBMS \uC120\uC815 + \uC131\uB2A5 \uCD5C\uC801\uD654 \u2192 \uD504\uB85C\uB355\uC158\uC73C\uB85C \uAC00\uB294 \uAE38'
        }
      }
    ]
  }
];
