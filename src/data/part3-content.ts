import type { SectionContent, SlideContent } from './part1-content';

export const part3Content: SectionContent[] = [
  // Section 1: LLM 추출 프롬프트 설계
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '1-1',
        tag: 'theory',
        title: 'PathRAG 프롬프트 구조 분석',
        script: 'LLM으로 엔티티와 관계를 자동 추출하려면 프롬프트를 잘 설계해야 합니다. PathRAG 같은 GraphRAG 시스템들은 프롬프트를 여러 단계로 나눠서 구성해요. 첫 번째는 System Prompt입니다. LLM의 역할을 정의하는 거죠. "너는 엔티티/관계 추출 전문가야" 이런 식이에요. 두 번째는 Schema Definition입니다. 어떤 엔티티 타입과 관계 타입을 추출할지 명시하는 거죠. 세 번째는 Few-shot Examples입니다. 실제 예시를 보여주는 거예요. "이런 문장에서는 이렇게 추출해" 이런 식으로요. 네 번째는 User Query입니다. 실제 추출할 텍스트를 넣는 거죠. 이렇게 각 단계마다 명확한 역할을 정의해야 LLM이 정확하게 추출합니다.',
        diagram: {
          nodes: [
            { text: 'System Prompt', type: 'entity' },
            { text: '역할 정의', type: 'dim' },
            { text: 'Schema Definition', type: 'entity' },
            { text: '엔티티/관계 타입', type: 'dim' },
            { text: 'Few-shot Examples', type: 'entity' },
            { text: '실제 예시', type: 'dim' },
            { text: 'User Query', type: 'entity' },
            { text: '추출할 텍스트', type: 'dim' },
            { text: 'LLM', type: 'entity' },
            { text: 'Structured Output', type: 'entity' }
          ]
        },
        callout: {
          type: 'key',
          text: '각 단계마다 명확한 역할 정의 필요. 모호하면 LLM이 임의로 추출합니다.'
        }
      },
      {
        id: '1-2',
        tag: 'theory',
        title: '구체화 > 일반화 원칙',
        script: 'LLM 프롬프트에서 가장 중요한 원칙은 "구체화"입니다. 일반화된 지시는 LLM을 헷갈리게 해요. 예를 들어 "관계를 추출해줘"라고만 하면 어떻게 될까요? LLM이 임의로 RELATED_TO, HAS, IS_PART_OF 같은 관계를 만들어냅니다. 온톨로지가 완전히 무너지는 거죠. 대신 "INVESTED_IN, WORKS_AT 관계만 추출해"라고 구체적으로 지시하면 어떻게 될까요? LLM이 정의된 관계만 추출합니다. 온톨로지 일관성이 유지되는 거죠. 그래서 우리는 Part 2에서 만든 Meta-Dictionary를 프롬프트에 넣어줄 겁니다. "이 9가지 관계만 추출해" 이런 식으로요.',
        table: {
          headers: ['접근 방식', '지시 내용', '결과', '문제/장점'],
          rows: [
            {
              cells: [
                { text: '일반화 (❌)', bold: true, status: 'fail' },
                { text: '"관계를 추출해줘"' },
                { text: 'RELATED_TO, HAS, IS_PART_OF...' },
                { text: '온톨로지 불일치' }
              ]
            },
            {
              cells: [
                { text: '구체화 (✅)', bold: true, status: 'pass' },
                { text: '"INVESTED_IN, WORKS_AT만 추출"' },
                { text: 'INVESTED_IN, WORKS_AT' },
                { text: '온톨로지 일관성 유지' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: '일반화된 지시 = 온톨로지 붕괴. 항상 구체적으로 지시하세요.'
        }
      },
      {
        id: '1-3',
        tag: 'practice',
        title: 'Meta-Dictionary를 프롬프트에 반영',
        script: '이제 Part 2에서 만든 Meta-Dictionary를 LLM 프롬프트에 반영해봅시다. Python 코드로 보여드릴게요. meta_dict 변수에 우리가 만든 Dictionary를 넣습니다. INVESTED_IN, PRODUCES 같은 관계들이죠. 그리고 system_prompt를 만들 때 이 Dictionary를 JSON으로 변환해서 넣어줍니다. "허용된 관계: {JSON}" 이런 식으로요. 그러면 LLM이 이 Dictionary를 보고 "아, INVESTED_IN 관계는 투자, 지분, 보유 같은 키워드가 나오면 추출하면 되겠구나"라고 이해합니다. OpenAI API를 호출할 때 이 system_prompt를 넣어주면 됩니다. 이렇게 하면 LLM이 우리가 원하는 관계만 정확하게 추출해요.',
        code: {
          language: 'python',
          code: `import json
from openai import OpenAI

# Part 2에서 만든 Meta-Dictionary
meta_dict = {
  "INVESTED_IN": {
    "keywords": ["투자", "지분", "보유", "매입"],
    "source_type": "Fund",
    "target_type": "Company"
  },
  "PRODUCES": {
    "keywords": ["제조", "출시", "생산", "개발"],
    "source_type": "Company",
    "target_type": "Product"
  }
}

# System Prompt에 Dictionary 반영
system_prompt = f"""
엔티티/관계를 추출하세요.
허용된 관계: {json.dumps(meta_dict, ensure_ascii=False)}
출력 형식: JSON
"""

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": article_text}
    ],
    response_format={"type": "json_object"}
)`
        },
        callout: {
          type: 'tip',
          text: 'Meta-Dictionary로 LLM 추출 범위 제한 → 정확도 향상 + 온톨로지 일관성 유지'
        }
      },
      {
        id: '1-4',
        tag: 'theory',
        title: '문제정의 ↔ 엔티티 추출 alignment',
        script: 'LLM 추출을 시작하기 전에 가장 중요한 질문을 하나 던져야 합니다. "우리가 추출할 엔티티/관계가 우리의 질문에 답할 수 있는가?" 이걸 alignment라고 해요. 예를 들어 우리 질문이 "삼성전자 투자 기관의 다른 투자처는?"이라면, 필요한 엔티티는 Fund와 Company입니다. 필요한 관계는 INVESTED_IN이죠. 만약 우리가 PRODUCES, USES_TECH 같은 관계만 추출한다면 어떻게 될까요? 질문에 답할 수 없습니다. 추출 대상과 질문이 정렬되지 않은 거죠. 그래서 추출을 시작하기 전에 반드시 "우리 질문에 답하려면 어떤 엔티티/관계가 필요한가?"를 먼저 정의해야 합니다.',
        diagram: {
          nodes: [
            { text: '질문', type: 'entity' },
            { text: '삼성 투자 기관의 다른 투자처는?', type: 'dim' },
            { text: '필요 엔티티', type: 'entity' },
            { text: 'Fund, Company', type: 'relation' },
            { text: '필요 관계', type: 'entity' },
            { text: 'INVESTED_IN', type: 'relation' },
            { text: '추출 대상', type: 'entity' },
            { text: 'Fund, Company, INVESTED_IN', type: 'dim' },
            { text: '✅ Aligned', type: 'entity' }
          ]
        },
        callout: {
          type: 'key',
          text: '질문과 추출 대상이 정렬되지 않으면 아무리 많은 데이터를 추출해도 쓸모없습니다.'
        }
      }
    ]
  },
  // Section 2: 자동 추출 실행
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '2-1',
        tag: 'practice',
        title: 'GPT-4o로 엔티티/관계 추출',
        script: '이제 실제로 GPT-4o를 사용해서 엔티티와 관계를 추출해봅시다. OpenAI Python 라이브러리를 import하고, client를 만듭니다. chat.completions.create로 API를 호출하는데, model은 gpt-4o로 설정하고, messages에 system과 user 메시지를 넣어줍니다. 여기서 중요한 건 response_format입니다. {"type": "json_object"}로 설정하면 LLM이 무조건 JSON 형식으로 답변합니다. 파싱 안정성이 훨씬 좋아지죠. 결과를 json.loads로 파싱하면 entities와 relationships 배열이 나옵니다. entities에는 {name, type} 형태의 객체들이 들어있고, relationships에는 {source, relation, target} 형태의 객체들이 들어있어요.',
        code: {
          language: 'python',
          code: `from openai import OpenAI
import json

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": article_text}
    ],
    response_format={"type": "json_object"}
)

extracted = json.loads(response.choices[0].message.content)
print(extracted["entities"])
# [{"name": "삼성전자", "type": "Company"},
#  {"name": "국민연금", "type": "Fund"}, ...]
print(extracted["relationships"])
# [{"source": "국민연금", "relation": "INVESTED_IN",
#   "target": "삼성전자"}, ...]`
        },
        callout: {
          type: 'tip',
          text: 'response_format으로 JSON 강제 → 파싱 안정성 향상. 이게 없으면 LLM이 markdown이나 일반 텍스트로 답변할 수 있습니다.'
        }
      },
      {
        id: '2-2',
        tag: 'practice',
        title: 'Claude로 엔티티/관계 추출',
        script: 'Claude도 사용해봅시다. Claude는 긴 컨텍스트 처리에 강점이 있어서 복잡한 문서에 유리합니다. Anthropic Python 라이브러리를 import하고, client를 만듭니다. messages.create로 API를 호출하는데, model은 claude-3-5-sonnet으로 설정합니다. Claude는 OpenAI와 다르게 system 메시지를 messages 배열에 넣지 않고, user 메시지에 합쳐서 넣습니다. 그리고 max_tokens를 설정해야 해요. 응답 길이를 제한하는 거죠. 결과는 response.content[0].text에서 가져와서 json.loads로 파싱하면 됩니다.',
        code: {
          language: 'python',
          code: `from anthropic import Anthropic
import json

client = Anthropic()

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": f"{system_prompt}\\n\\n{article_text}"
        }
    ]
)

extracted = json.loads(response.content[0].text)
print(extracted["entities"])
print(extracted["relationships"])`
        },
        callout: {
          type: 'tip',
          text: 'Claude는 긴 컨텍스트 처리에 강점 → 복잡한 문서, 여러 문서를 한 번에 처리할 때 유리'
        }
      },
      {
        id: '2-3',
        tag: 'practice',
        title: '추출 결과 검증',
        script: 'LLM이 추출한 결과를 무조건 믿으면 안 됩니다. 반드시 검증해야 해요. 첫 번째, 엔티티 타입이 우리가 정의한 5가지(Company, Person, Product, Fund, Technology) 중 하나인지 확인하세요. 두 번째, 관계 타입이 우리가 정의한 9가지 중 하나인지 확인하세요. 세 번째, source와 target이 실제로 entities 배열에 존재하는지 확인하세요. 네 번째, 관계 방향이 맞는지 확인하세요. INVESTED_IN은 Fund→Company 방향이어야 하는데 Company→Fund로 되어있으면 틀린 거죠. 다섯 번째, 환각(hallucination)이 없는지 확인하세요. 실제 문서에 없는 관계를 LLM이 만들어내는 경우가 있습니다.',
        table: {
          headers: ['검증 항목', '확인 내용', '실패 시 조치'],
          rows: [
            { cells: [{ text: '엔티티 타입', bold: true }, { text: '5가지 중 하나인가?' }, { text: '제외 또는 수정' }] },
            { cells: [{ text: '관계 타입', bold: true }, { text: '9가지 중 하나인가?' }, { text: '제외 또는 수정' }] },
            { cells: [{ text: '엔티티 존재', bold: true }, { text: 'source/target이 entities에 있나?' }, { text: '관계 제외' }] },
            { cells: [{ text: '관계 방향', bold: true }, { text: 'source_type→target_type 맞나?' }, { text: '방향 수정' }] },
            { cells: [{ text: '환각 검증', bold: true }, { text: '문서에 실제로 있나?' }, { text: '제외' }] }
          ]
        },
        callout: {
          type: 'warn',
          text: 'LLM 결과를 무조건 믿지 마세요. 항상 검증 단계가 필요합니다.'
        }
      },
      {
        id: '2-4',
        tag: 'practice',
        title: '추출 결과 Neo4j 적재',
        script: '검증이 끝난 결과를 Neo4j에 적재해봅시다. neo4j Python 드라이버를 사용합니다. GraphDatabase.driver로 연결하고, session을 열어서 트랜잭션을 실행합니다. insert_entities 함수에서는 각 엔티티를 MERGE 문으로 넣습니다. MERGE는 중복을 방지해줘요. 이미 있으면 무시하고, 없으면 생성하는 거죠. insert_relationships 함수에서는 MATCH로 source와 target을 찾고, MERGE로 관계를 연결합니다. 이렇게 하면 같은 관계를 여러 번 넣어도 중복이 생기지 않습니다.',
        code: {
          language: 'python',
          code: `from neo4j import GraphDatabase

driver = GraphDatabase.driver(
    "bolt://localhost:7687",
    auth=("neo4j", "password")
)

def insert_entities(tx, entities):
    for e in entities:
        tx.run(
            f"MERGE (n:{e['type']} {{name: $name}})",
            name=e['name']
        )

def insert_relationships(tx, relationships):
    for r in relationships:
        tx.run(f"""
            MATCH (a {{name: $source}}), (b {{name: $target}})
            MERGE (a)-[:{r['relation']}]->(b)
        """, source=r['source'], target=r['target'])

with driver.session() as session:
    session.execute_write(insert_entities, extracted["entities"])
    session.execute_write(insert_relationships, extracted["relationships"])`
        },
        callout: {
          type: 'tip',
          text: 'MERGE 사용 → 중복 방지. CREATE를 쓰면 같은 노드/관계가 여러 번 생성됩니다.'
        }
      }
    ]
  },
  // Section 3: 수작업 vs LLM 비교
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '3-1',
        tag: 'discussion',
        title: '나란히 비교 — 3메트릭',
        script: '이제 Part 2의 수작업 결과와 Part 3의 LLM 자동화 결과를 비교해봅시다. 세 가지 메트릭으로 평가할 거예요. 첫 번째는 Variety, 다양성입니다. 얼마나 많은 노드와 관계를 추출했는가? 수작업은 2시간에 15개 노드, 20개 관계를 만들었습니다. GPT-4o는 5분에 25개 이상의 노드, 40개 이상의 관계를 만들었어요. Claude는 30개 이상의 노드, 45개 이상의 관계를 만들었습니다. 두 번째는 Accuracy, 정확도입니다. 수작업은 100%죠. 우리가 직접 확인하면서 넣었으니까요. GPT-4o는 약 85%, Claude는 약 88%입니다. 세 번째는 Relationship 정확도입니다. 관계 방향과 타입이 맞는가? 수작업은 100%, GPT-4o는 약 75%, Claude는 약 80%입니다. LLM은 속도는 빠르지만 정확도는 낮습니다.',
        table: {
          headers: ['메트릭', '수작업 (Part 2)', 'GPT-4o', 'Claude'],
          rows: [
            { cells: [{ text: 'Variety (다양성)', bold: true }, { text: '15노드/20관계' }, { text: '25+/40+', status: 'pass' }, { text: '30+/45+', status: 'pass' }] },
            { cells: [{ text: 'Accuracy (정확도)', bold: true }, { text: '100% (기준)', status: 'pass' }, { text: '~85%', status: 'warn' }, { text: '~88%', status: 'warn' }] },
            { cells: [{ text: 'Relationship (관계)', bold: true }, { text: '100% (기준)', status: 'pass' }, { text: '~75%', status: 'fail' }, { text: '~80%', status: 'warn' }] }
          ]
        },
        callout: {
          type: 'warn',
          text: 'LLM은 속도는 빠르지만 정확도는 낮습니다. 자동화와 품질 사이의 트레이드오프를 이해해야 합니다.'
        }
      },
      {
        id: '3-2',
        tag: 'discussion',
        title: 'LLM이 틀리는 패턴',
        script: 'LLM이 어떻게 틀리는지 패턴을 분석해봅시다. 첫 번째는 환각 관계(Hallucination)입니다. 실제 문서에 없는 관계를 LLM이 만들어내요. 예를 들어 문서에는 "삼성전자"와 "SK하이닉스"가 각각 언급되지만 둘의 관계는 없는데, LLM이 "COMPETES_WITH" 관계를 임의로 추가하는 거죠. 두 번째는 누락된 엔티티(Omission)입니다. 중요한 엔티티를 놓치는 거예요. 세 번째는 관계 방향 오류(Direction Error)입니다. A→B를 B→A로 잘못 추출하는 거죠. 네 번째는 동의어 혼용(Synonym Confusion)입니다. "삼성전자", "삼성", "Samsung"을 별개의 엔티티로 처리하는 거예요. 이건 Part 4에서 Entity Resolution으로 해결합니다.',
        diagram: {
          nodes: [
            { text: '1. 환각 관계', type: 'fail' },
            { text: '문서에 없는 관계 생성', type: 'dim' },
            { text: '2. 누락된 엔티티', type: 'fail' },
            { text: '중요한 엔티티를 놓침', type: 'dim' },
            { text: '3. 관계 방향 오류', type: 'fail' },
            { text: 'A→B를 B→A로 추출', type: 'dim' },
            { text: '4. 동의어 혼용', type: 'fail' },
            { text: '삼성전자, 삼성, Samsung 별개 처리', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: 'Part 4에서 Entity Resolution으로 동의어 문제를 해결합니다. 나머지는 프롬프트 개선과 검증 로직으로 완화할 수 있습니다.'
        }
      },
      {
        id: '3-3',
        tag: 'discussion',
        title: 'LLM 평가 바이어스 주의',
        script: '여기서 정말 중요한 함정이 하나 있습니다. LLM으로 LLM 결과를 평가하면 바이어스가 발생합니다. 무슨 말이냐면, GPT-4o로 추출한 결과를 GPT-4o로 평가하면 어떻게 될까요? 자기가 만든 결과니까 "이거 맞아"라고 판단할 가능성이 높아요. 실제로는 틀렸는데 말이죠. 그래서 교차 평가를 해야 합니다. GPT로 Claude 결과를 평가하고, Claude로 GPT 결과를 평가하는 거죠. 또는 인간 검수를 샘플링으로 해야 합니다. 전체의 10% 이상은 사람이 직접 확인하는 거예요. 가장 좋은 건 정답 레이블 데이터셋을 구축하는 겁니다. 100개 정도의 샘플을 사람이 직접 레이블링해서, 이걸 기준으로 LLM 성능을 평가하는 거죠.',
        visual: '화면에 "LLM으로 LLM 결과를 평가하면 바이어스 발생" 큰 글씨로 강조',
        callout: {
          type: 'warn',
          text: '자동화해도 검수는 필수입니다. 인간 검수 없는 자동화는 품질 붕괴로 이어집니다.'
        }
      }
    ]
  },
  // Section 4: Neo4j 자동 적재
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '4-1',
        tag: 'practice',
        title: 'Python 스크립트로 일괄 적재',
        script: '이제 여러 문서를 한 번에 처리하는 스크립트를 만들어봅시다. articles 리스트에 뉴스 기사들을 로드하고, for 루프로 하나씩 처리합니다. 각 article을 extract_with_llm 함수로 LLM 추출하고, 결과를 Neo4j에 적재하는 거죠. 이렇게 하면 100개 문서도 5분 내에 처리할 수 있습니다. Part 2에서는 15개 노드 만드는데 2시간 걸렸는데, 이제는 100개 문서를 5분에 처리할 수 있어요. 속도가 24배 빨라진 겁니다.',
        code: {
          language: 'python',
          code: `import json
from neo4j import GraphDatabase

# 뉴스 기사 로드 (예: JSON 파일에서)
articles = load_articles()
driver = GraphDatabase.driver(
    "bolt://localhost:7687",
    auth=("neo4j", "password")
)

for article in articles:
    # LLM 추출
    extracted = extract_with_llm(article)

    # 검증 (옵션)
    validated = validate_extraction(extracted)

    # Neo4j 적재
    with driver.session() as session:
        session.execute_write(insert_entities, validated["entities"])
        session.execute_write(insert_relationships, validated["relationships"])

print(f"총 {len(articles)}개 기사 처리 완료")`
        },
        callout: {
          type: 'tip',
          text: '100개 문서도 5분 내 처리 가능. 단, API 비용과 Rate Limit에 주의하세요.'
        }
      },
      {
        id: '4-2',
        tag: 'practice',
        title: '수작업 vs 자동 — 속도 비교',
        script: '수작업과 자동화를 속도로 비교해봅시다. Part 2 수작업은 2시간에 15개 노드, 20개 관계를 만들었습니다. 손가락이 정말 아팠죠. Part 3 LLM 자동화는 5분에 30개 이상의 노드, 45개 이상의 관계를 만들었습니다. 손가락은 거의 안 아파요. 속도는 24배 빨라졌습니다. 하지만 정확도는 낮아졌죠. 수작업은 100%, LLM은 85-88%입니다. 이게 바로 자동화의 트레이드오프입니다. 속도 vs 품질. 실무에서는 이 둘의 균형을 맞춰야 해요. 예를 들어 프로토타입 단계에서는 LLM 자동화로 빠르게 만들고, 프로덕션 단계에서는 인간 검수를 추가하는 거죠.',
        table: {
          headers: ['항목', '수작업 (Part 2)', 'LLM 자동화 (Part 3)'],
          rows: [
            { cells: [{ text: '시간', bold: true }, { text: '2시간' }, { text: '5분', status: 'pass' }] },
            { cells: [{ text: '처리량', bold: true }, { text: '15노드' }, { text: '30+노드', status: 'pass' }] },
            { cells: [{ text: '관계', bold: true }, { text: '20개' }, { text: '45+개', status: 'pass' }] },
            { cells: [{ text: '정확도', bold: true }, { text: '100%', status: 'pass' }, { text: '85-88%', status: 'warn' }] },
            { cells: [{ text: '손가락 아픔', bold: true }, { text: '⭐⭐⭐⭐⭐', status: 'fail' }, { text: '⭐ (거의 없음)', status: 'pass' }] }
          ]
        }
      },
      {
        id: '4-3',
        tag: 'discussion',
        title: '자동화의 가치',
        script: '속도가 24배 향상되었습니다. 2시간이 5분으로 줄었어요. 이게 자동화의 가치입니다. 하지만 정확도는 여전히 과제죠. 15% 정도의 오류가 있습니다. 그래서 Part 4에서 Entity Resolution을 배우고, 중복/유사 엔티티를 통합하는 방법을 익힙니다. 그리고 Part 6에서는 품질 평가 방법을 배워서, "우리 KG의 품질이 실제로 얼마나 좋은가?"를 측정할 수 있게 됩니다. 자동화는 시작일 뿐이에요. 품질 개선이 진짜 과제입니다.',
        visual: '화면에 "속도 24배 향상 (2시간 → 5분)" 큰 글씨로 강조',
        callout: {
          type: 'key',
          text: '자동화는 시작일 뿐입니다. 품질 개선이 진짜 과제입니다. Part 4-6에서 이 문제를 해결합니다.'
        }
      },
      {
        id: '4-4',
        tag: 'discussion',
        title: '하지만 정확도는 여전히 과제',
        script: 'LLM 자동화로 속도는 빨라졌지만, 정확도는 85-88%입니다. 15%의 오류가 있다는 거죠. 이 오류가 누적되면 어떻게 될까요? 100개 문서를 처리하면 15개 정도는 잘못된 엔티티/관계가 들어갑니다. 1000개라면 150개죠. 이 오류들이 쌓이면 KG 품질이 떨어집니다. 그래서 우리는 Part 4에서 Entity Resolution을 배웁니다. 중복/유사 엔티티를 통합해서 품질을 높이는 거죠. 그리고 Part 5에서는 멀티모달 VLM을 배워서, 표와 이미지에서도 엔티티를 추출합니다. Part 6에서는 품질 평가 방법을 배워서, 우리 KG가 실제로 얼마나 좋은지 측정합니다. 자동화는 첫 걸음일 뿐이에요.',
        callout: {
          type: 'warn',
          text: '15% 오류 × 1000개 문서 = 150개 잘못된 엔티티. 품질 개선 없는 자동화는 위험합니다.'
        }
      }
    ]
  }
];
