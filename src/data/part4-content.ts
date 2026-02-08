import type { SectionContent, SlideContent } from './part1-content';

export const part4Content: SectionContent[] = [
  // Section 1: ER 개념 + 중요성
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '1-1',
        tag: 'theory',
        title: '"같은 건데 다르게 들어갔다"',
        script: '여러분, Part 3에서 LLM으로 엔티티를 자동 추출했죠? 근데 문제가 있습니다. "삼성전자", "Samsung Electronics", "삼성", "Samsung" 이게 다 같은 회사인데, KG에는 4개로 들어가 있어요. 이게 Entity Resolution 문제입니다.',
        visual: '화면 중앙에 4개의 노드 표시: "삼성전자" "Samsung Electronics" "삼성" "Samsung"',
        callout: {
          type: 'warn',
          text: '같은 엔티티가 여러 개로 중복되면 관계가 분산되고, Multi-hop 쿼리가 실패합니다.'
        }
      },
      {
        id: '1-2',
        tag: 'theory',
        title: 'Entity Resolution이 중요한 이유',
        script: 'ER이 안 되면 어떻게 되는지 보세요. 중복 엔티티 때문에 관계가 분산됩니다. "국민연금 → 삼성전자 투자"와 "국민연금 → Samsung 투자"가 별개로 들어가면, Multi-hop 쿼리가 실패해요. 결국 잘못된 답변을 내놓게 됩니다.',
        diagram: {
          nodes: [
            { text: '중복 엔티티', type: 'fail' },
            { text: '관계 분산', type: 'fail' },
            { text: 'Multi-hop 실패', type: 'fail' },
            { text: '잘못된 답변', type: 'fail' }
          ]
        },
        callout: {
          type: 'key',
          text: 'ER 없이는 KG 품질을 보장할 수 없다'
        }
      },
      {
        id: '1-3',
        tag: 'theory',
        title: 'Entity 출처 추적',
        script: 'LightRAG라는 프레임워크가 있는데, 거기서는 엔티티 관리용 KV Store를 씁니다. 각 엔티티마다 "어느 문서에서 왔는지" 출처를 기록하는 거죠. 이렇게 출처를 추적하면, ER 판단 정확도가 올라가고, 답변 신뢰도도 올라갑니다.',
        table: {
          headers: ['개념', '설명', '효과'],
          rows: [
            {
              cells: [
                { text: 'KV Store', bold: true },
                { text: '엔티티별 메타데이터 저장소' },
                { text: '출처 추적 가능', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '출처 ID', bold: true },
                { text: '어느 문서에서 추출되었는지' },
                { text: 'ER 정확도 향상', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '신뢰도', bold: true },
                { text: '답변의 근거 제시' },
                { text: '사용자 신뢰 증가', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '출처 추적 → ER 판단 정확도 향상 → 답변 신뢰도 향상'
        }
      }
    ]
  },
  // Section 2: 방법론 비교
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '2-1',
        tag: 'theory',
        title: 'ER 방법론 4가지',
        script: 'ER 방법론은 크게 4가지입니다. Fuzzy Matching은 문자열 유사도로 판단하는 거라 빠르지만, 동음이의어는 못 잡아요. 임베딩 유사도는 의미를 파악하지만, 임계값 튜닝이 필요합니다. LLM 판단은 맥락까지 이해하지만, 비용이 비싸고 느립니다. Senzing 같은 전문 엔진은 정확도가 높지만, 셋업이 복잡합니다.',
        table: {
          headers: ['방법', '원리', '장점', '단점'],
          rows: [
            {
              cells: [
                { text: 'Fuzzy Matching', bold: true },
                { text: '문자열 유사도 (Levenshtein)' },
                { text: '빠름', status: 'pass' },
                { text: '동음이의어 취약', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: '임베딩 유사도', bold: true },
                { text: '의미 벡터 비교' },
                { text: '의미 파악', status: 'pass' },
                { text: '임계값 튜닝 필요', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'LLM 판단', bold: true },
                { text: 'GPT/Claude에게 질문' },
                { text: '맥락 이해', status: 'pass' },
                { text: '비용 높음, 느림', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: 'Senzing', bold: true },
                { text: '전문 ER 엔진' },
                { text: '정확도 높음', status: 'pass' },
                { text: '셋업 복잡', status: 'warn' }
              ]
            }
          ]
        }
      },
      {
        id: '2-2',
        tag: 'theory',
        title: '실무 권장 — 하이브리드 접근',
        script: '실무에서는 하이브리드로 가세요. 1차로 Fuzzy Matching으로 쉬운 것들 걸러내고, 2차로 임베딩 유사도로 의미 비교하고, 3차로 애매한 것들만 LLM한테 물어보는 거죠. 비용 효율 최고입니다.',
        diagram: {
          nodes: [
            { text: '1차: Fuzzy Matching', type: 'entity' },
            { text: '쉬운 중복 제거', type: 'dim' },
            { text: '2차: 임베딩 유사도', type: 'entity' },
            { text: '의미 기반 비교', type: 'dim' },
            { text: '3차: LLM 판단', type: 'entity' },
            { text: '애매한 것만', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: '비용 효율: 쉬운 건 Fuzzy로, 어려운 건 LLM으로'
        }
      },
      {
        id: '2-3',
        tag: 'demo',
        title: 'Fuzzy Matching vs 임베딩 유사도 비교',
        script: 'Fuzzy Matching은 "삼성전자"와 "Samsung Electronics"를 다르다고 판단합니다. 문자열이 전혀 안 닮았으니까요. 하지만 임베딩 유사도는 의미를 파악해서 0.92 정도 나옵니다. 이게 ER의 핵심이에요.',
        table: {
          headers: ['Entity A', 'Entity B', 'Fuzzy Score', '임베딩 유사도'],
          rows: [
            {
              cells: [
                { text: '삼성전자' },
                { text: 'Samsung Electronics' },
                { text: '0.15', status: 'fail' },
                { text: '0.92', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '국민연금' },
                { text: 'National Pension Service' },
                { text: '0.08', status: 'fail' },
                { text: '0.89', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'SK하이닉스' },
                { text: 'SK Hynix' },
                { text: '0.45', status: 'warn' },
                { text: '0.94', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '임베딩 유사도는 다국어 엔티티 매칭에 특히 강력합니다.'
        }
      },
      {
        id: '2-4',
        tag: 'theory',
        title: '판단이 애매한 경우',
        script: 'ER에서 가장 어려운 건 애매한 경우입니다. "SK"가 "SK그룹"인지 "SK하이닉스"인지 "SK텔레콤"인지, 문맥에 따라 다르잖아요. 이럴 때 출처 문서를 확인해야 합니다. 그래서 아까 말한 source 추적이 중요한 거예요. 답이 안 나오면? 보수적으로 — 합치지 않는 게 낫습니다. 잘못 합치면 데이터가 오염돼요.',
        diagram: {
          nodes: [
            { text: 'SK', type: 'entity' },
            { text: 'SK그룹?', type: 'dim' },
            { text: 'SK하이닉스?', type: 'dim' },
            { text: 'SK텔레콤?', type: 'dim' },
            { text: '출처 문서 확인', type: 'relation' },
            { text: '판단 불가 → 합치지 않기', type: 'fail' }
          ]
        },
        callout: {
          type: 'warn',
          text: '애매하면 합치지 마라. 잘못된 통합은 잘못된 답변보다 위험하다.'
        }
      }
    ]
  },
  // Section 3: 실습 — 중복 엔티티 통합
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '3-1',
        tag: 'practice',
        title: 'Part 3 KG에서 중복 찾기 — Fuzzy Matching',
        script: '먼저 Neo4j의 APOC 라이브러리를 써서 문자열 유사도를 확인해봅시다. "삼성"이 들어간 엔티티들을 찾아서 Levenshtein 유사도를 계산합니다.',
        code: {
          language: 'cypher',
          code: `// APOC 라이브러리의 문자열 유사도 활용
MATCH (a), (b)
WHERE a.name CONTAINS '삼성'
  AND b.name CONTAINS '삼성'
  AND id(a) < id(b)
RETURN a.name, b.name,
  apoc.text.levenshteinSimilarity(
    a.name, b.name
  ) AS similarity
ORDER BY similarity DESC

// Result:
// a.name        | b.name               | similarity
// 삼성전자      | 삼성                 | 0.67
// 삼성전자      | 삼성 그룹            | 0.60`
        },
        callout: {
          type: 'tip',
          text: 'APOC 플러그인을 Neo4j에 설치해야 합니다. docker-compose.yml에서 NEO4JLABS_PLUGINS=["apoc"] 설정 필요.'
        }
      },
      {
        id: '3-2',
        tag: 'practice',
        title: '임베딩 기반 유사도 비교',
        script: '이번엔 sentence-transformers로 의미 기반 유사도를 계산합니다. 다국어 엔티티도 잘 잡습니다.',
        code: {
          language: 'python',
          code: `from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer('all-MiniLM-L6-v2')

entities = ["삼성전자", "Samsung Electronics",
            "삼성", "SK하이닉스"]
embeddings = model.encode(entities)

# 유사도 계산
similarity_matrix = cosine_similarity(embeddings)

# 임계값 0.85 이상 = 동일 엔티티 후보
for i in range(len(entities)):
    for j in range(i+1, len(entities)):
        if similarity_matrix[i][j] > 0.85:
            print(f"{entities[i]} ≈ {entities[j]}: {similarity_matrix[i][j]:.2f}")`
        },
        callout: {
          type: 'tip',
          text: '의미 기반 유사도로 동음이의어 구분 가능. "삼성전자" vs "삼성화재"는 낮은 점수가 나옵니다.'
        }
      },
      {
        id: '3-3',
        tag: 'practice',
        title: 'LLM 기반 판단 — 애매한 케이스',
        script: '임베딩도 확신하기 애매한 경우는 LLM한테 물어봅니다. 비용은 들지만 정확합니다.',
        code: {
          language: 'python',
          code: `from openai import OpenAI
client = OpenAI()

def llm_entity_resolution(entity_a, entity_b, context_a, context_b):
    prompt = f"""
다음 두 엔티티가 같은 것인지 판단하세요.

Entity A: {entity_a}
Context A: {context_a}

Entity B: {entity_b}
Context B: {context_b}

같은 엔티티면 "SAME", 다른 엔티티면 "DIFFERENT",
불확실하면 "UNCERTAIN"로 답하세요.
"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# 예시
result = llm_entity_resolution(
    "삼성", "Samsung Electronics",
    "삼성은 한국의 대표 기업이다",
    "Samsung Electronics is a semiconductor company"
)
# Result: "SAME"`
        },
        callout: {
          type: 'warn',
          text: 'LLM 판단은 비용이 높으므로 3차 방어선으로만 사용하세요.'
        }
      },
      {
        id: '3-4',
        tag: 'practice',
        title: 'MERGE로 엔티티 통합',
        script: '중복을 확인했으면 이제 통합합니다. 관계까지 함께 이전해야 정보 손실이 없어요.',
        code: {
          language: 'cypher',
          code: `// 1. 삼성전자로 통합 (정규 이름 결정)
MATCH (old {name: 'Samsung Electronics'})
MATCH (canonical {name: '삼성전자'})

// 2. old → target 관계를 canonical → target으로 이전
MATCH (old)-[r]->(target)
MERGE (canonical)-[r2:INVESTED_IN]->(target)
SET r2 = properties(r)

// 3. old 노드 삭제
DETACH DELETE old

// 4. 통합 확인
MATCH (n {name: '삼성전자'})-[r]->(m)
RETURN n.name, type(r), m.name`
        },
        callout: {
          type: 'key',
          text: '관계까지 함께 이전해야 정보 손실 없음. DETACH DELETE로 모든 관계를 정리합니다.'
        }
      },
      {
        id: '3-5',
        tag: 'practice',
        title: 'ER 전후 비교',
        script: 'ER 전후를 비교하면 이렇게 달라집니다. 노드가 33% 줄어들고, 관계가 통합되고, Multi-hop 정확도가 올라갑니다.',
        table: {
          headers: ['지표', 'Before ER', 'After ER', '개선율'],
          rows: [
            {
              cells: [
                { text: '노드 수', bold: true },
                { text: '45개' },
                { text: '30개', status: 'pass' },
                { text: '33% 감소' }
              ]
            },
            {
              cells: [
                { text: '중복 엔티티', bold: true },
                { text: '다수', status: 'fail' },
                { text: '0개', status: 'pass' },
                { text: '100% 해소' }
              ]
            },
            {
              cells: [
                { text: '관계 분산', bold: true },
                { text: '심각', status: 'fail' },
                { text: '통합 완료', status: 'pass' },
                { text: '완전 해소' }
              ]
            },
            {
              cells: [
                { text: 'Multi-hop 정확도', bold: true },
                { text: '60%', status: 'warn' },
                { text: '92%', status: 'pass' },
                { text: '+32%p' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'ER은 KG 품질의 핵심입니다. 중복 제거 없이는 GraphRAG의 장점을 살릴 수 없습니다.'
        }
      }
    ]
  }
];
