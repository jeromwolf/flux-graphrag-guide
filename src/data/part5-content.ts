import type { SectionContent, SlideContent } from './part1-content';

export const part5Content: SectionContent[] = [
  // Section 1: VLM 개념
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '1-1',
        tag: 'theory',
        title: 'OCR vs VLM — 패러다임 전환',
        script: '실무에서 문서를 처리하면 표가 많이 나옵니다. 보험 약관, 재무제표, 통계 자료 등등. 이걸 OCR로 처리하면 문자는 인식하지만, 구조를 잃어버립니다. 셀 병합 처리도 못하고, 맥락도 이해 못해요. VLM은 다릅니다. 이미지를 이해하고, 표 구조를 보존하고, 맥락까지 파악합니다.',
        table: {
          headers: ['기능', 'OCR (구세대)', 'VLM (신세대)'],
          rows: [
            {
              cells: [
                { text: '인식 대상', bold: true },
                { text: '문자만', status: 'warn' },
                { text: '시각적 구조', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '구조 보존', bold: true },
                { text: '손실', status: 'fail' },
                { text: '보존', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '셀 병합 처리', bold: true },
                { text: '❌', status: 'fail' },
                { text: '✅', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '맥락 이해', bold: true },
                { text: '❌', status: 'fail' },
                { text: '✅', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'VLM은 표를 "이미지"가 아니라 "구조화된 데이터"로 이해합니다.'
        }
      },
      {
        id: '1-2',
        tag: 'theory',
        title: '주요 VLM 모델',
        script: 'VLM 모델도 여러 가지가 있습니다. GPT-4o는 범용이고 정확하지만 비싸요. Claude 3.5는 긴 문서 처리가 강력하고 정확합니다. Gemini Pro는 무료이고 멀티턴 대화가 좋습니다. Upstage Document AI는 한국어 문서에 특화되어 있어서, 한국어 표 인식 정확도가 높고 비용 효율적입니다.',
        table: {
          headers: ['모델', '개발사', '특징', '표 인식', '비용'],
          rows: [
            {
              cells: [
                { text: 'GPT-4o', bold: true },
                { text: 'OpenAI' },
                { text: '범용, 정확' },
                { text: '✅ 우수', status: 'pass' },
                { text: '$$$$', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'Claude 3.5 Sonnet', bold: true },
                { text: 'Anthropic' },
                { text: '긴 문서, 정확' },
                { text: '✅ 우수', status: 'pass' },
                { text: '$$$', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'Gemini 1.5 Pro', bold: true },
                { text: 'Google' },
                { text: '멀티턴, 무료 티어' },
                { text: '⚠️ 보통', status: 'warn' },
                { text: '$$', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Upstage Document AI', bold: true },
                { text: 'Upstage' },
                { text: '한국어 문서 특화' },
                { text: '✅ 우수', status: 'pass' },
                { text: '$$', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '실무에서는 GPT-4o 또는 Claude 3.5 Sonnet 추천. 한국어 문서는 Upstage Document AI도 고려하세요.'
        }
      }
    ]
  },
  // Section 2: 표→그래프 두 가지 접근
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '2-1',
        tag: 'theory',
        title: '접근법 A — 연관성 특화 (관계 중심)',
        script: '표를 그래프로 바꾸는 방법은 두 가지입니다. 첫 번째는 연관성 특화 접근법입니다. 표 이미지를 VLM에 넣고, 엔티티와 관계를 추출해서 바로 그래프에 적재하는 거죠. 조직도, 거래 내역처럼 관계가 명확한 표에 적합합니다.',
        diagram: {
          nodes: [
            { text: '표 이미지', type: 'entity' },
            { text: 'VLM', type: 'relation' },
            { text: '엔티티/관계 추출', type: 'entity' },
            { text: 'JSON 출력', type: 'dim' },
            { text: 'Neo4j 적재', type: 'entity' }
          ]
        },
        callout: {
          type: 'key',
          text: '관계가 명확한 표 → 접근법 A (예: 조직도, 거래 내역, 투자 관계)'
        }
      },
      {
        id: '2-2',
        tag: 'theory',
        title: '접근법 B — 구조&텍스트 특화 (정보 중심)',
        script: '두 번째는 구조와 텍스트 특화 접근법입니다. 표를 구조화 데이터로 변환하고, LLM으로 요약한 다음, 요약문을 벡터화해서 그래프에 넣습니다. 재무제표, 통계표처럼 수치 데이터가 많은 표에 적합합니다. Pinterest가 이 방식을 씁니다.',
        diagram: {
          nodes: [
            { text: '표 이미지', type: 'entity' },
            { text: 'VLM', type: 'relation' },
            { text: '구조화 데이터', type: 'entity' },
            { text: 'LLM 요약', type: 'relation' },
            { text: '요약문', type: 'entity' },
            { text: '벡터화 + 그래프', type: 'relation' }
          ]
        },
        callout: {
          type: 'key',
          text: '수치 데이터가 많은 표 → 접근법 B (예: 재무제표, 통계표, 성과 지표)'
        }
      },
      {
        id: '2-3',
        tag: 'theory',
        title: '보험 도메인 실무 사례 — 접근법 A',
        script: '보험 운영현황 표가 있다고 합시다. 보험사, 상품, 보장 내역이 있죠. 이건 관계가 명확하니까 접근법 A를 씁니다. VLM이 "삼성화재 — 운전자보험 — 대인배상"을 추출하고, 이걸 그래프로 만들면 됩니다.',
        table: {
          headers: ['보험사', '상품명', '보장내역', '월 보험료'],
          rows: [
            {
              cells: [
                { text: '삼성화재' },
                { text: '운전자보험' },
                { text: '대인배상' },
                { text: '45,000원' }
              ]
            },
            {
              cells: [
                { text: '현대해상' },
                { text: '실손보험' },
                { text: '입원비' },
                { text: '32,000원' }
              ]
            }
          ]
        },
        diagram: {
          nodes: [
            { text: '삼성화재:Company', type: 'entity' },
            { text: 'OFFERS', type: 'relation' },
            { text: '운전자보험:Product', type: 'entity' },
            { text: 'COVERS', type: 'relation' },
            { text: '대인배상:Coverage', type: 'entity' }
          ]
        },
        callout: {
          type: 'tip',
          text: '접근법 A: 엔티티/관계 중심 그래프 → Cypher 쿼리로 추론 가능'
        }
      },
      {
        id: '2-4',
        tag: 'theory',
        title: '재무제표 사례 — 접근법 B',
        script: '재무제표는 수치가 많습니다. 매출액, 영업이익, 당기순이익 등등. 이걸 일일이 엔티티로 만들면 너무 복잡해져요. 그래서 접근법 B를 씁니다. 표를 요약해서 "2024년 매출 10조, 영업이익 2조, 전년 대비 15% 증가"로 만들고, 이걸 벡터화합니다.',
        callout: {
          type: 'tip',
          text: '접근법 B: 정보 중심 → 벡터 검색 + 그래프 탐색 하이브리드'
        }
      }
    ]
  },
  // Section 3: 문서→그래프 계층 구조
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '3-1',
        tag: 'theory',
        title: 'Document→Chapter→Section→Chunk→Entity',
        script: '실무 문서는 계층 구조가 있습니다. 문서 → 챕터 → 섹션 → 청크 → 엔티티. 이 계층을 그래프에 반영하면 검색 정확도가 올라갑니다. "1장 3절에서 언급된 A 회사"처럼 맥락을 살릴 수 있거든요.',
        diagram: {
          nodes: [
            { text: 'Document', type: 'entity' },
            { text: 'HAS_CHAPTER', type: 'relation' },
            { text: 'Chapter', type: 'entity' },
            { text: 'HAS_SECTION', type: 'relation' },
            { text: 'Section', type: 'entity' },
            { text: 'HAS_CHUNK', type: 'relation' },
            { text: 'Chunk', type: 'entity' },
            { text: 'MENTIONS', type: 'relation' },
            { text: 'Entity', type: 'entity' }
          ]
        },
        callout: {
          type: 'key',
          text: '계층 구조를 그래프에 반영하면 검색 정확도 향상'
        }
      },
      {
        id: '3-2',
        tag: 'theory',
        title: '표는 SQL — Pinterest 아이디어',
        script: 'Pinterest는 표 데이터를 SQL로 처리합니다. 표를 DB에 넣고, SQL로 조회하고, 결과를 요약해서 벡터화합니다. 이렇게 하면 구조화 데이터의 장점과 자연어 검색의 장점을 동시에 얻을 수 있어요.',
        visual: '(표 → SQL DB → 쿼리 → 요약 → 벡터) 흐름도',
        callout: {
          type: 'tip',
          text: '구조화 데이터 + 자연어 검색의 하이브리드 접근'
        }
      }
    ]
  },
  // Section 4: 표 이미지 → 구조화 데이터
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '4-1',
        tag: 'practice',
        title: 'VLM API 호출 — 보험 운영현황 표',
        script: '이제 실습합니다. Claude API에 표 이미지를 base64로 인코딩해서 보내고, JSON으로 추출하라고 시킵니다.',
        code: {
          language: 'python',
          code: `import anthropic
import base64

# 이미지를 base64로 인코딩
with open("insurance_table.png", "rb") as f:
    img_b64 = base64.b64encode(f.read()).decode()

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=2048,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/png",
                    "data": img_b64
                }
            },
            {
                "type": "text",
                "text": "이 표를 JSON으로 변환하세요. 보험사, 상품명, 보장내역, 월 보험료 필드를 추출하세요."
            }
        ]
    }]
)

print(response.content[0].text)`
        },
        callout: {
          type: 'tip',
          text: 'base64 인코딩된 이미지를 VLM에 전달. GPT-4o도 동일한 방식입니다.'
        }
      },
      {
        id: '4-2',
        tag: 'practice',
        title: 'Table Summary Prompt (Pinterest 스타일)',
        script: 'Pinterest 스타일로 표를 요약하는 프롬프트입니다. 구조 보존을 명시적으로 요구하세요.',
        code: {
          language: 'text',
          code: `Extract key information from this table image:

1. Identify column headers and row labels
2. Summarize main trends/patterns in the data
3. Extract critical data points (top values, outliers)
4. Preserve hierarchical structure if exists
5. Handle merged cells appropriately
6. Note any missing or unclear values

Output format: JSON with nested structure
{
  "summary": "...",
  "headers": [...],
  "rows": [...],
  "key_insights": [...]
}`
        },
        callout: {
          type: 'key',
          text: 'VLM에게 구조 보존을 명시적으로 요구. 셀 병합 처리도 지시합니다.'
        }
      },
      {
        id: '4-3',
        tag: 'practice',
        title: '구조화 결과 검증',
        script: 'VLM 출력도 완벽하지 않습니다. 검증 포인트를 체크하세요.',
        table: {
          headers: ['검증 항목', '확인 방법', '중요도'],
          rows: [
            {
              cells: [
                { text: '셀 병합 정확도', bold: true },
                { text: '원본 이미지와 비교' },
                { text: '★★★', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: '수치 정확도', bold: true },
                { text: 'OCR 오류 확인' },
                { text: '★★★', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: '빈 셀 처리', bold: true },
                { text: 'null vs 0 구분' },
                { text: '★★', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: '헤더/데이터 구분', bold: true },
                { text: '컬럼명 정확성' },
                { text: '★★', status: 'warn' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: 'VLM도 완벽하지 않음 → 검증 필수. 특히 수치 정확도는 꼭 확인하세요.'
        }
      },
      {
        id: '4-4',
        tag: 'practice',
        title: 'GPT-4o vs Claude 3.5 비교',
        script: '실제로 두 모델을 비교해봤습니다. GPT-4o는 셀 병합 처리가 약간 더 좋고, Claude는 긴 표에서 강력합니다.',
        table: {
          headers: ['항목', 'GPT-4o', 'Claude 3.5 Sonnet'],
          rows: [
            {
              cells: [
                { text: '셀 병합 처리', bold: true },
                { text: '✅ 우수', status: 'pass' },
                { text: '✅ 우수', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '긴 표 처리', bold: true },
                { text: '⚠️ 보통', status: 'warn' },
                { text: '✅ 우수', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '수치 정확도', bold: true },
                { text: '✅ 우수', status: 'pass' },
                { text: '✅ 우수', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '비용 (1000 images)', bold: true },
                { text: '$50', status: 'warn' },
                { text: '$30', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '실무에서는 Claude 3.5 Sonnet 추천. 비용 대비 성능이 좋습니다.'
        }
      }
    ]
  },
  // Section 5: 구조화 데이터 → KG 적재
  {
    sectionId: 'sec5',
    slides: [
      {
        id: '5-1',
        tag: 'practice',
        title: '접근법 A — 엔티티/관계 매핑',
        script: 'VLM이 뽑은 JSON을 엔티티와 관계로 변환합니다. 보험 예시로 해봅시다.',
        code: {
          language: 'python',
          code: `# JSON → 엔티티/관계 추출
table_data = [
    {"보험사": "삼성화재", "상품명": "운전자보험", "보장내역": "대인배상", "월보험료": 45000},
    {"보험사": "현대해상", "상품명": "실손보험", "보장내역": "입원비", "월보험료": 32000}
]

from neo4j import GraphDatabase

driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "password"))

def create_insurance_graph(tx, row):
    query = """
    MERGE (company:Company {name: $company})
    MERGE (product:Product {name: $product})
    MERGE (coverage:Coverage {name: $coverage})
    MERGE (company)-[:OFFERS {premium: $premium}]->(product)
    MERGE (product)-[:COVERS]->(coverage)
    """
    tx.run(query,
           company=row["보험사"],
           product=row["상품명"],
           coverage=row["보장내역"],
           premium=row["월보험료"])

with driver.session() as session:
    for row in table_data:
        session.execute_write(create_insurance_graph, row)`
        },
        callout: {
          type: 'tip',
          text: '표 구조를 그래프 구조로 변환. MERGE로 중복 방지합니다.'
        }
      },
      {
        id: '5-2',
        tag: 'practice',
        title: '접근법 B — 요약 노드 생성',
        script: '이번엔 접근법 B입니다. 표를 요약하고, 벡터화해서 그래프에 넣습니다.',
        code: {
          language: 'python',
          code: `from openai import OpenAI
from sentence_transformers import SentenceTransformer

client = OpenAI()
embed_model = SentenceTransformer('all-MiniLM-L6-v2')

# 1. 표 요약 생성
table_json = """
[{"보험사": "삼성화재", "상품명": "운전자보험", ...}]
"""

summary_prompt = f"""
이 보험 운영현황 표를 요약하시오:
{table_json}

요약 요구사항:
- 주요 보험사와 상품
- 보험료 범위
- 주요 보장 내역
"""

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": summary_prompt}]
)
summary = response.choices[0].message.content

# 2. 요약 벡터화
embedding = embed_model.encode(summary)

# 3. Neo4j에 적재
def create_table_summary(tx, summary, embedding):
    query = """
    CREATE (ts:TableSummary {
        text: $summary,
        embedding: $embedding,
        source: 'insurance_table.png'
    })
    """
    tx.run(query, summary=summary, embedding=embedding.tolist())

with driver.session() as session:
    session.execute_write(create_table_summary, summary, embedding)`
        },
        callout: {
          type: 'tip',
          text: '요약 노드 → 벡터 검색으로 표 내용 검색 가능'
        }
      },
      {
        id: '5-3',
        tag: 'practice',
        title: 'Part 3 KG와 통합',
        script: 'Part 3에서 만든 텍스트 KG와 Part 5 표 KG를 연결합니다. MERGE로 동일 엔티티를 통합하고, MENTIONED_IN으로 텍스트와 표를 연결합니다.',
        code: {
          language: 'cypher',
          code: `// 1. 표에서 추출한 엔티티를 기존 KG와 MERGE
MERGE (c:Company {name: '삼성화재'})
SET c.source = coalesce(c.source, []) + 'table_insurance_2024.png'

// 2. 기존 텍스트 노드와 연결
MATCH (t:TextChunk)
WHERE t.text CONTAINS '삼성화재'
MATCH (c:Company {name: '삼성화재'})
MERGE (c)-[:MENTIONED_IN]->(t)

// 3. 표 요약 노드와 엔티티 연결
MATCH (ts:TableSummary {source: 'insurance_table.png'})
MATCH (c:Company {name: '삼성화재'})
MERGE (ts)-[:ABOUT]->(c)

// 4. 통합 확인
MATCH path = (c:Company)-[*1..2]-(n)
WHERE c.name = '삼성화재'
RETURN path LIMIT 50`
        },
        callout: {
          type: 'key',
          text: 'MERGE로 텍스트+표 통합 그래프 구축. 이제 Multi-hop 쿼리가 텍스트와 표를 넘나듭니다.'
        }
      },
      {
        id: '5-4',
        tag: 'practice',
        title: '하이브리드 검색 — 벡터 + 그래프',
        script: '이제 벡터 검색과 그래프 검색을 동시에 할 수 있습니다. 사용자 질문에 따라 적절한 방법을 선택합니다.',
        code: {
          language: 'python',
          code: `def hybrid_search(question):
    # 1. 질문 임베딩
    q_embedding = embed_model.encode(question)

    # 2. 벡터 검색 (요약 노드 찾기)
    vector_query = """
    MATCH (ts:TableSummary)
    RETURN ts.text, ts.source,
           gds.similarity.cosine($q_emb, ts.embedding) AS score
    ORDER BY score DESC LIMIT 5
    """

    # 3. 그래프 검색 (엔티티 관계 탐색)
    graph_query = """
    MATCH (c:Company)-[:OFFERS]->(p:Product)
    WHERE c.name CONTAINS $keyword
    RETURN c.name, collect(p.name) AS products
    """

    # 4. 결과 합치기
    with driver.session() as session:
        vector_results = session.run(vector_query, q_emb=q_embedding.tolist())
        graph_results = session.run(graph_query, keyword="삼성")

        return {
            "vector": list(vector_results),
            "graph": list(graph_results)
        }

# 예시
result = hybrid_search("삼성화재 보험 상품은 무엇이 있나요?")`
        },
        callout: {
          type: 'key',
          text: '하이브리드 검색: 벡터로 관련 표 찾고 + 그래프로 관계 탐색'
        }
      }
    ]
  },
  // Section 6: 중간 점검
  {
    sectionId: 'sec6',
    slides: [
      {
        id: '6-1',
        tag: 'discussion',
        title: '지금까지 만든 KG 전체 시각화',
        script: '이제 Neo4j Browser에서 전체 그래프를 확인해봅시다. 텍스트 노드(Part 3)와 표 요약 노드(Part 5)가 하나의 그래프로 통합되어 있습니다.',
        code: {
          language: 'cypher',
          code: `// 전체 그래프 확인 (샘플 100개)
MATCH (n)
RETURN n
LIMIT 100

// 노드 타입별 개수
MATCH (n)
RETURN labels(n) AS type, count(n) AS count
ORDER BY count DESC

// 텍스트-표 연결 확인
MATCH (c:Company)-[:MENTIONED_IN]->(t:TextChunk)
MATCH (c)-[:OFFERS]->(p:Product)
RETURN c.name, t.text, collect(p.name) AS products`
        },
        callout: {
          type: 'key',
          text: '텍스트(Part 3) + 표(Part 5)가 하나의 그래프로 통합!'
        }
      },
      {
        id: '6-2',
        tag: 'discussion',
        title: '두 가지 접근법 비교 결과',
        script: '접근법 A와 B를 비교해보면 각각 장단점이 있습니다. A는 관계 추론이 정확하고, B는 정보 손실이 적습니다. 실무에서는 도메인에 따라 선택하거나, 둘 다 쓸 수도 있습니다.',
        table: {
          headers: ['항목', '접근법 A (관계 중심)', '접근법 B (정보 중심)'],
          rows: [
            {
              cells: [
                { text: '엔티티/관계 명확성', bold: true },
                { text: '✅ 명확', status: 'pass' },
                { text: '⚠️ 모호', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: '그래프 추론 정확도', bold: true },
                { text: '✅ 높음', status: 'pass' },
                { text: '⚠️ 낮음', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'Cypher 쿼리 가능', bold: true },
                { text: '✅ 가능', status: 'pass' },
                { text: '⚠️ 제한적', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: '정보 손실', bold: true },
                { text: '⚠️ 있음', status: 'warn' },
                { text: '✅ 최소화', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '벡터 검색', bold: true },
                { text: '❌ 불가', status: 'fail' },
                { text: '✅ 가능', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '설계 복잡도', bold: true },
                { text: '⚠️ 높음 (온톨로지 필요)', status: 'warn' },
                { text: '✅ 낮음', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '실무 추천: 관계가 명확한 표는 A, 수치 데이터가 많은 표는 B'
        }
      }
    ]
  }
];
