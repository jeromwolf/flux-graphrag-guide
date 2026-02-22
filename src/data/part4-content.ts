import type { SectionContent, SlideContent } from './part1-content';

export const part4Content: SectionContent[] = [
  // Section 1: ER 개념 + 중요성 (Part 3 연결 오프닝, 5가지 ER 유형, 출처 추적)
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '1-1',
        tag: 'theory',
        title: '"접착기 A-3" vs "A-3 접착기" — 같은 설비인데 2개 노드',
        script: 'Part 3에서 LLM으로 품질 보고서 3개를 자동 추출했더니 약 25~30개 노드가 나왔습니다. 추가 문서까지 포함하면 대략 45개 노드가 됩니다. 그런데 문제가 있어요. "접착기 A-3"과 "A-3 접착기"가 별개 노드로 들어갔습니다. 같은 설비인데요. "접착제 EP-200"과 "EP-200 에폭시 접착제"도 따로 있고, "KS M 6613"과 "한국산업규격 M 6613"도 별개입니다. 이게 Entity Resolution 문제입니다.',
        visual: '화면 중앙에 중복 노드 쌍 표시: "접착기 A-3" ↔ "A-3 접착기", "접착제 EP-200" ↔ "EP-200 에폭시 접착제"',
        callout: {
          type: 'warn',
          text: '같은 엔티티가 여러 노드로 중복되면 관계가 분산되고, Multi-hop 쿼리가 실패합니다.'
        }
      },
      {
        id: '1-2',
        tag: 'theory',
        title: 'Entity Resolution이 중요한 이유',
        script: 'ER이 안 되면 어떻게 되는지 보세요. "접착기 A-3"에 연결된 관계와 "A-3 접착기"에 연결된 관계가 분산됩니다. "접착기 A-3의 마지막 정비일은?"이라고 물으면, MAINTAINED_ON 관계가 "A-3 접착기" 쪽에만 있으면 답을 못 찾아요. "접착 박리 결함의 원인 공정에서 사용한 설비의 정비 이력은?" 같은 Multi-hop 쿼리는 완전히 실패합니다.',
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
          text: 'ER 없이는 KG 품질을 보장할 수 없다 — 중복 노드 1개가 전체 쿼리 체인을 끊는다'
        }
      },
      {
        id: '1-3',
        tag: 'theory',
        title: '제조 도메인 ER 문제 유형 5가지',
        script: '제조 도메인에서 발생하는 ER 문제를 5가지 유형으로 분류할 수 있습니다. 첫째, 표기 변형 — "접착기 A-3"과 "A-3 접착기"처럼 어순만 다른 경우. Fuzzy Matching으로 쉽게 잡힙니다. 둘째, 약어/정식명 — "EP-200"과 "접착제 EP-200", "EP-200 에폭시 접착제"처럼 이름의 상세 수준이 다른 경우. 임베딩으로 잡아야 합니다. 셋째, 한영 혼용 — "KS M 6613"과 "한국산업규격 M 6613"처럼 표기 체계가 다른 경우. 넷째, 공정명 변형 — "접착 도포"와 "접착제 도포 공정", "도포"처럼 의미는 같지만 표현이 다른 경우. LLM 판단이 필요합니다. 다섯째, 문맥 의존 — "A-3"만 단독으로 출현하면 접착기인지 연삭기인지 알 수 없어요. 출처 문서를 추적해야 합니다.',
        table: {
          headers: ['ER 유형', '예시', '난이도', '해결 방법'],
          rows: [
            {
              cells: [
                { text: '표기 변형', bold: true },
                { text: '"접착기 A-3" vs "A-3 접착기"' },
                { text: '쉬움', status: 'pass' },
                { text: 'Fuzzy Matching' }
              ]
            },
            {
              cells: [
                { text: '약어/정식명', bold: true },
                { text: '"EP-200" vs "EP-200 에폭시 접착제"' },
                { text: '중간', status: 'warn' },
                { text: '임베딩 유사도' }
              ]
            },
            {
              cells: [
                { text: '한영 혼용', bold: true },
                { text: '"KS M 6613" vs "한국산업규격 M 6613"' },
                { text: '중간', status: 'warn' },
                { text: '임베딩 유사도' }
              ]
            },
            {
              cells: [
                { text: '공정명 변형', bold: true },
                { text: '"접착 도포" vs "접착제 도포 공정" vs "도포"' },
                { text: '어려움', status: 'fail' },
                { text: 'LLM 판단' }
              ]
            },
            {
              cells: [
                { text: '문맥 의존', bold: true },
                { text: '"A-3"만 단독 출현 — 접착기? 연삭기?' },
                { text: '매우 어려움', status: 'fail' },
                { text: '출처 추적' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '쉬운 건 Fuzzy로, 어려운 건 LLM으로, 문맥 의존은 출처 추적으로 — 단계별 접근이 핵심'
        }
      },
      {
        id: '1-4',
        tag: 'theory',
        title: 'Entity 출처 추적 — 판단의 근거를 남겨라',
        script: 'LightRAG 프레임워크에서는 엔티티 관리용 KV Store를 씁니다. 각 엔티티마다 "어느 문서에서 왔는지" 출처를 기록하는 거죠. 제조 도메인에서도 마찬가지입니다. "접착기 A-3"이 품질검사보고서에서 나왔는지, 공정이상보고서에서 나왔는지에 따라 ER 판단이 달라질 수 있어요. Neo4j에서 출처를 기록하는 방법을 봅시다.',
        code: {
          language: 'cypher',
          code: `// 엔티티에 출처 문서 기록
MERGE (n:Equipment {name: '접착기 A-3'})
ON CREATE SET n.sources = ['품질검사보고서_2025-01-15']
ON MATCH SET n.sources = n.sources + '공정이상보고서_2025-01-20'

// 출처 기반 ER 판단 — 같은 문서 출처면 동일 엔티티일 가능성 높음
MATCH (a:Equipment), (b:Equipment)
WHERE a.name <> b.name
  AND ANY(s IN a.sources WHERE s IN b.sources)
RETURN a.name, b.name,
  [s IN a.sources WHERE s IN b.sources] AS shared_sources`
        },
        callout: {
          type: 'tip',
          text: '출처 추적 → ER 판단 정확도 향상 → 답변 신뢰도 향상. "왜 합쳤는지"를 항상 설명할 수 있어야 한다.'
        }
      },
      {
        id: '1-5',
        tag: 'theory',
        title: '45노드 → 30노드 — Part 3에서 Part 4로',
        script: 'Part 3에서 품질 보고서 3개를 LLM으로 추출하면 약 25~30개 노드가 나오는데, 추가 문서까지 포함하면 약 45개 노드가 됩니다. ER을 거치면 중복이 제거되어 약 30개 노드로 정제됩니다. 노드가 33% 줄어들지만, 관계는 오히려 더 풍부해집니다. 분산되어 있던 관계가 하나의 정규 노드에 집중되니까요. 이게 Part 4의 목표입니다.',
        diagram: {
          nodes: [
            { text: 'Part 3 추출', type: 'entity' },
            { text: '~45 노드 (중복 포함)', type: 'dim' },
            { text: 'Part 4 ER', type: 'entity' },
            { text: '중복 탐지 + 통합', type: 'relation' },
            { text: '정제된 KG', type: 'entity' },
            { text: '~30 노드 (중복 제거)', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: '노드는 줄고, 관계 밀도는 높아진다 — ER은 KG 품질의 핵심 단계'
        }
      }
    ]
  },
  // Section 2: 방법론 비교 (4방법론 + 하이브리드 + 비교표 + 애매한 케이스)
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '2-1',
        tag: 'theory',
        title: 'ER 방법론 4가지',
        script: 'ER 방법론은 크게 4가지입니다. Fuzzy Matching은 문자열 유사도로 판단하는 거라 빠르지만, "접착 도포"와 "도포 공정"처럼 의미는 같지만 글자가 다른 건 못 잡아요. 임베딩 유사도는 의미를 파악하지만, 임계값 튜닝이 필요합니다. LLM 판단은 맥락까지 이해하지만, 비용이 비싸고 느립니다. Senzing 같은 전문 엔진은 정확도가 높지만, 셋업이 복잡합니다.',
        table: {
          headers: ['방법', '원리', '장점', '단점'],
          rows: [
            {
              cells: [
                { text: 'Fuzzy Matching', bold: true },
                { text: '문자열 유사도 (Levenshtein)' },
                { text: '빠름, 구현 쉬움', status: 'pass' },
                { text: '의미 파악 불가', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: '임베딩 유사도', bold: true },
                { text: '의미 벡터 비교' },
                { text: '다국어/동의어 파악', status: 'pass' },
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
                { text: '셋업 복잡, 라이선스', status: 'warn' }
              ]
            }
          ]
        }
      },
      {
        id: '2-2',
        tag: 'theory',
        title: '실무 권장 — 하이브리드 접근',
        script: '실무에서는 하이브리드로 가세요. 0차로 부품번호 정규식 매칭으로 확실한 것들을 먼저 잡고, 1차로 Fuzzy Matching으로 표기 변형을 걸러내고, 2차로 임베딩 유사도로 약어/한영 혼용을 비교하고, 3차로 애매한 것들만 LLM한테 물어보는 거죠. 비용 효율 최고입니다.',
        diagram: {
          nodes: [
            { text: '0차: 정규식 매칭', type: 'entity' },
            { text: '부품번호/규격 확정', type: 'dim' },
            { text: '1차: Fuzzy Matching', type: 'entity' },
            { text: '표기 변형 제거', type: 'dim' },
            { text: '2차: 임베딩 유사도', type: 'entity' },
            { text: '약어/한영 혼용', type: 'dim' },
            { text: '3차: LLM 판단', type: 'entity' },
            { text: '공정명 변형/문맥 의존', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: '비용 효율: 확실한 건 정규식으로, 쉬운 건 Fuzzy로, 어려운 건 LLM으로'
        }
      },
      {
        id: '2-3',
        tag: 'demo',
        title: 'Fuzzy Matching vs 임베딩 유사도 비교 — 제조 도메인',
        script: 'Fuzzy Matching은 "접착기 A-3"과 "A-3 접착기"를 0.62 정도로 잡습니다. 어순만 다르니까요. 하지만 "EP-200"과 "EP-200 에폭시 접착제"는 0.48밖에 안 나옵니다. 임베딩은 의미를 파악해서 0.91로 잡아요. "KS M 6613"과 "한국산업규격 M 6613"은 Fuzzy로는 거의 안 잡히지만 임베딩은 0.88로 잡습니다.',
        table: {
          headers: ['Entity A', 'Entity B', 'Fuzzy Score', '임베딩 유사도'],
          rows: [
            {
              cells: [
                { text: '접착기 A-3' },
                { text: 'A-3 접착기' },
                { text: '0.62', status: 'warn' },
                { text: '0.96', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'EP-200' },
                { text: 'EP-200 에폭시 접착제' },
                { text: '0.48', status: 'fail' },
                { text: '0.91', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'KS M 6613' },
                { text: '한국산업규격 M 6613' },
                { text: '0.35', status: 'fail' },
                { text: '0.88', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '접착 도포' },
                { text: '접착제 도포 공정' },
                { text: '0.55', status: 'warn' },
                { text: '0.93', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '위 수치는 예시입니다. 실습에서 직접 측정하세요. 모델과 도메인에 따라 달라집니다.'
        }
      },
      {
        id: '2-4',
        tag: 'theory',
        title: '판단이 애매한 경우 — "A-3"의 정체',
        script: 'ER에서 가장 어려운 건 문맥 의존 케이스입니다. "A-3"이 단독으로 출현하면 접착기 A-3인지, 연삭기 A-3인지, 아니면 완전히 다른 장비인지 알 수 없어요. 이럴 때 출처 문서를 확인해야 합니다. 품질검사보고서의 "접착 도포" 섹션에서 나왔다면 접착기일 가능성이 높겠죠. 그래서 아까 말한 source 추적이 중요한 거예요. 답이 안 나오면? 보수적으로 — 합치지 않는 게 낫습니다. 잘못 합치면 데이터가 오염돼요.',
        diagram: {
          nodes: [
            { text: 'A-3', type: 'entity' },
            { text: '접착기 A-3?', type: 'dim' },
            { text: '연삭기 A-3?', type: 'dim' },
            { text: '기타 장비?', type: 'dim' },
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
  // Section 3: 실습 (Fuzzy, 임베딩, LLM, 하이브리드 통합, 부품번호, MERGE, 전후 비교)
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '3-1',
        tag: 'practice',
        title: '0차 필터 — 부품번호 정규식 매칭',
        script: '제조 도메인에서는 부품번호, 자재번호, 규격번호 패턴이 명확합니다. 정규식으로 먼저 확실한 매칭을 잡아냅니다. Equipment는 "A-3", "HP-01" 같은 알파벳-숫자 패턴, Material은 "EP-200", "FM-100" 같은 3자리 숫자 패턴, Product는 "BP-100" 패턴, Spec은 "KS M 6613" 패턴입니다. 정규식 매칭으로 확실한 것들을 먼저 걸러내면, 후속 단계의 부하를 크게 줄일 수 있습니다.',
        code: {
          language: 'python',
          code: `import re

# 제조 도메인 부품번호 패턴 — 0차 필터
patterns = {
    "Equipment": r"[A-Z]+-\\d+",       # A-3, HP-01, GR-05
    "Material":  r"[A-Z]+-\\d{3}",     # EP-200, FM-100
    "Product":   r"BP-\\d{3}",         # BP-100
    "Spec":      r"KS\\s*[A-Z]\\s*\\d{4}",  # KS M 6613
}

def extract_part_numbers(entity_name: str) -> dict:
    """엔티티 이름에서 부품번호 패턴 추출"""
    for etype, pattern in patterns.items():
        match = re.search(pattern, entity_name)
        if match:
            return {"code": match.group(), "type": etype}
    return {}

# 같은 부품번호면 동일 엔티티로 확정
candidates = ["접착기 A-3", "A-3 접착기", "A-3", "EP-200 에폭시 접착제"]
for name in candidates:
    result = extract_part_numbers(name)
    if result:
        print(f"{name} → {result}")
# 접착기 A-3   → {'code': 'A-3', 'type': 'Equipment'}
# A-3 접착기   → {'code': 'A-3', 'type': 'Equipment'}
# A-3          → {'code': 'A-3', 'type': 'Equipment'}
# EP-200 에폭시 접착제 → {'code': 'EP-200', 'type': 'Material'}`
        },
        callout: {
          type: 'tip',
          text: '부품번호가 같으면 같은 레이블 내에서 동일 엔티티로 확정. 가장 빠르고 확실한 0차 필터.'
        }
      },
      {
        id: '3-2',
        tag: 'practice',
        title: '1차 — Fuzzy Matching (같은 레이블 내 비교)',
        script: 'Neo4j의 APOC 라이브러리를 써서 문자열 유사도를 확인합니다. 중요한 포인트: MATCH (a), (b)로 전체를 비교하면 O(N²)으로 매우 느립니다. 반드시 같은 레이블 내에서만 비교하세요. Equipment끼리, Material끼리만 비교하면 성능이 훨씬 좋습니다.',
        code: {
          language: 'cypher',
          code: `// ✅ 성능 최적화 — 같은 레이블 내에서만 비교
// Equipment 레이블 내 유사 엔티티 탐지
MATCH (a:Equipment), (b:Equipment)
WHERE id(a) < id(b)
RETURN a.name, b.name,
  apoc.text.levenshteinSimilarity(
    a.name, b.name
  ) AS similarity
ORDER BY similarity DESC

// Result:
// a.name       | b.name       | similarity
// 접착기 A-3   | A-3 접착기   | 0.62
// 열프레스 HP-01| HP-01 프레스  | 0.55

// ❌ 안티패턴 — 전체 노드 비교 (성능 폭발)
// MATCH (a), (b)   ← 레이블 없이 전체 비교 = O(N²)`
        },
        callout: {
          type: 'tip',
          text: 'APOC 플러그인 필요. docker-compose.yml에서 NEO4JLABS_PLUGINS=["apoc"] 설정. 반드시 같은 레이블 내에서만 비교하세요.'
        }
      },
      {
        id: '3-3',
        tag: 'practice',
        title: '2차 — 임베딩 기반 유사도 비교',
        script: 'sentence-transformers로 의미 기반 유사도를 계산합니다. 다국어 모델인 paraphrase-multilingual-MiniLM-L12-v2를 사용합니다. 한국어와 영어가 혼용되는 제조 도메인에서는 다국어 모델이 필수입니다. all-MiniLM-L6-v2는 영어 전용이라 "KS M 6613"과 "한국산업규격 M 6613" 같은 한영 혼용 케이스를 제대로 처리하지 못합니다.',
        code: {
          language: 'python',
          code: `from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# 다국어 모델 사용 — 한영 혼용 제조 도메인 필수
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

entities = [
    "접착기 A-3", "A-3 접착기",
    "접착제 EP-200", "EP-200 에폭시 접착제",
    "KS M 6613", "한국산업규격 M 6613",
    "접착 도포", "접착제 도포 공정",
]
embeddings = model.encode(entities)

# 유사도 계산 — 임계값 0.85 이상 = 동일 엔티티 후보
similarity_matrix = cosine_similarity(embeddings)
for i in range(len(entities)):
    for j in range(i+1, len(entities)):
        score = similarity_matrix[i][j]
        if score > 0.85:
            print(f"{entities[i]} ≈ {entities[j]}: {score:.2f}")`
        },
        callout: {
          type: 'tip',
          text: 'paraphrase-multilingual-MiniLM-L12-v2 = 다국어 지원. 한영 혼용 도메인에서는 all-MiniLM-L6-v2(영어 전용) 대신 이 모델을 사용하세요.'
        }
      },
      {
        id: '3-4',
        tag: 'practice',
        title: '3차 — LLM 기반 판단 (temperature=0 + json_object)',
        script: '임베딩도 확신하기 애매한 경우는 LLM한테 물어봅니다. Part 3에서 강조한 것과 동일하게 temperature=0과 response_format json_object를 사용합니다. 추출 작업이든 판단 작업이든, 일관성이 중요한 작업에는 temperature=0이 필수입니다. context_a와 context_b를 함께 전달하는 것도 중요합니다. 엔티티 이름만으로는 판단이 어렵지만, "이 엔티티가 어떤 문맥에서 등장했는지"를 함께 알려주면 정확도가 크게 올라갑니다.',
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

JSON으로 답하세요:
{{"decision": "SAME"|"DIFFERENT"|"UNCERTAIN", "reason": "..."}}
"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0,             # 일관성 우선 (Part 3과 동일)
        response_format={"type": "json_object"},  # 구조화 출력
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# 예시: 공정명 변형
result = llm_entity_resolution(
    "접착 도포", "접착제 도포 공정",
    "접착 도포 공정에서 접착기 A-3을 사용",
    "접착제 도포 공정의 온도는 80°C"
)
# {"decision": "SAME", "reason": "동일 접착 공정을 지칭"}`
        },
        callout: {
          type: 'warn',
          text: 'LLM 판단은 비용이 높으므로 3차 방어선으로만 사용. temperature=0 + json_object로 일관성을 확보하세요.'
        }
      },
      {
        id: '3-5',
        tag: 'practice',
        title: '하이브리드 파이프라인 통합 — resolve_entities()',
        script: '지금까지 배운 4단계를 하나의 파이프라인으로 통합합니다. resolve_entities 함수가 0차(정규식) → 1차(Fuzzy) → 2차(임베딩) → 3차(LLM) 순서로 실행하면서, 각 단계에서 확정된 쌍은 다음 단계로 넘기지 않습니다. 이렇게 하면 LLM 호출을 최소화하면서도 정확도를 유지할 수 있습니다.',
        code: {
          language: 'python',
          code: `def resolve_entities(entities: list[dict]) -> list[tuple]:
    """하이브리드 ER 파이프라인: 정규식 → Fuzzy → 임베딩 → LLM"""
    merged_pairs = []
    remaining = list(entities)

    # 0차: 부품번호 정규식 매칭
    regex_matches = match_by_part_number(remaining)
    merged_pairs.extend(regex_matches)
    remaining = remove_matched(remaining, regex_matches)

    # 1차: Fuzzy Matching (threshold=0.7)
    fuzzy_matches = fuzzy_match(remaining, threshold=0.7)
    merged_pairs.extend(fuzzy_matches)
    remaining = remove_matched(remaining, fuzzy_matches)

    # 2차: 임베딩 유사도 (threshold=0.85)
    embedding_matches = embedding_match(remaining, threshold=0.85)
    merged_pairs.extend(embedding_matches)
    remaining = remove_matched(remaining, embedding_matches)

    # 3차: LLM 판단 (남은 후보만)
    for pair in get_candidate_pairs(remaining):
        decision = llm_entity_resolution(*pair)
        if decision["decision"] == "SAME":
            merged_pairs.append(pair)

    return merged_pairs

# 실행
pairs = resolve_entities(all_entities)
print(f"통합 대상: {len(pairs)}쌍")
# 통합 대상: 8쌍 (정규식 3, Fuzzy 2, 임베딩 2, LLM 1)`
        },
        callout: {
          type: 'key',
          text: '단계별로 확정 → 다음 단계 부하 감소. LLM 호출은 최소한으로.'
        }
      },
      {
        id: '3-6',
        tag: 'practice',
        title: 'MERGE로 엔티티 통합 — APOC 동적 관계 이전',
        script: '중복을 확인했으면 이제 통합합니다. 제조 KG에는 CAUSED_BY, USES_EQUIPMENT, MAINTAINED_ON 등 다양한 관계 타입이 있습니다. 관계 타입을 하드코딩하면 누락이 생겨요. APOC의 apoc.create.relationship를 사용하면 동적으로 관계 타입을 처리할 수 있습니다. outgoing 관계와 incoming 관계를 모두 이전해야 정보 손실이 없습니다.',
        code: {
          language: 'cypher',
          code: `// ✅ APOC로 동적 관계 타입 이전
MATCH (old {name: 'A-3 접착기'})
MATCH (canonical {name: '접착기 A-3'})

// outgoing 관계 이전 (old → target  ⇒  canonical → target)
CALL {
  WITH old, canonical
  MATCH (old)-[r]->(target)
  CALL apoc.create.relationship(
    canonical, type(r), properties(r), target
  ) YIELD rel
  DELETE r
}

// incoming 관계 이전 (source → old  ⇒  source → canonical)
CALL {
  WITH old, canonical
  MATCH (source)-[r]->(old)
  CALL apoc.create.relationship(
    source, type(r), properties(r), canonical
  ) YIELD rel
  DELETE r
}

// old 노드 삭제
DETACH DELETE old

// 통합 확인
MATCH (n {name: '접착기 A-3'})-[r]-(m)
RETURN n.name, type(r), m.name`
        },
        callout: {
          type: 'key',
          text: 'APOC 동적 관계 이전 = 관계 타입 하드코딩 불필요. outgoing + incoming 모두 이전해야 정보 손실 없음.'
        }
      },
      {
        id: '3-7',
        tag: 'practice',
        title: 'ER 전후 비교 — 제조 KG 품질 측정',
        script: 'ER 전후를 비교합니다. 노드가 45개에서 30개로 33% 줄어들었고, 중복 엔티티가 완전히 해소되었습니다. 관계 분산도 통합 완료되어 Multi-hop 쿼리가 정상 동작합니다. 아래 수치는 예시이며, 실습에서 직접 측정하는 것을 권장합니다. 측정 방법: "접착 박리 결함의 원인 공정에서 사용한 설비의 정비 이력은?" 같은 제조 도메인 Multi-hop 질문 10개를 만들어서, ER 전후로 쿼리 성공률을 비교하면 됩니다.',
        table: {
          headers: ['지표', 'Before ER', 'After ER', '개선율'],
          rows: [
            {
              cells: [
                { text: '노드 수', bold: true },
                { text: '~45개' },
                { text: '~30개', status: 'pass' },
                { text: '~33% 감소' }
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
                { text: '~60%', status: 'warn' },
                { text: '~92%', status: 'pass' },
                { text: '+32%p' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: '위 수치는 예시입니다. 측정법: 제조 도메인 Multi-hop 질문 10개로 ER 전후 쿼리 성공률을 비교하세요.'
        }
      },
      {
        id: '3-8',
        tag: 'discussion',
        title: 'Part 4 마무리 — Part 5 VLM 예고',
        script: 'Entity Resolution으로 Part 3에서 추출한 45개 노드를 30개로 정제했습니다. 중복이 제거되고 관계가 통합되어 Multi-hop 쿼리가 정상 동작합니다. 하지만 아직 과제가 남아 있어요. 품질 보고서에 표와 이미지가 포함되어 있다면? 텍스트만 추출하면 검사 성적표의 수치, 공정 흐름도의 정보를 놓치게 됩니다. Part 5에서는 VLM(Vision Language Model)을 사용해서 표와 이미지도 그래프로 변환하는 방법을 배웁니다.',
        callout: {
          type: 'key',
          text: 'Part 5 예고: 표/이미지도 그래프로 — VLM으로 멀티모달 문서를 처리합니다.'
        }
      }
    ]
  }
];
