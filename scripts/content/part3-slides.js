/**
 * Part 3: "LLM 자동화" — "자동화해도 완벽하지 않다"
 * Total: 15 slides + title + milestone + next preview = 18 slides
 * Duration: 2시간
 * Difficulty: 3/5
 */

module.exports = async function buildPart3(pres, base) {
  const meta = {
    part: 3,
    title: '자동화해도 완벽하지 않다',
    subtitle: 'LLM 자동화',
    duration: '2시간',
    difficulty: 3,
    totalSlides: 15,
    milestone: '자동 추출 KG + 품질 리포트 — 수작업 vs LLM 비교표',
    nextPreview: {
      title: 'Part 4: "같은 건데 다르게 들어갔다" — Entity Resolution',
      description: '중복/유사 엔티티를 통합하여 KG 품질을 높인다.'
    }
  };

  // Title slide
  base.addTitleSlide(pres, meta);

  // ============================================================
  // Section 1: LLM 추출 프롬프트 설계 (30min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 1,
    sectionTitle: 'LLM 추출 프롬프트 설계',
    sectionDuration: '30min',
    sectionColor: base.colors.sectionColors[1] // cyan
  });

  // Slide 1-1: PathRAG 프롬프트 구조 분석
  base.addFlowDiagram(pres, {
    title: 'PathRAG 프롬프트 구조 분석',
    slideType: 'theory',
    steps: [
      { text: 'System\nPrompt', color: base.colors.primary },
      { text: 'Schema\nDefinition', color: base.colors.secondary },
      { text: 'Few-shot\nExamples', color: base.colors.accent },
      { text: 'User\nQuery', color: base.colors.warning },
      { text: 'LLM', color: base.colors.success },
      { text: 'Structured\nOutput', color: base.colors.primary }
    ],
    callout: '각 단계마다 명확한 역할 정의 필요'
  });

  // Slide 1-2: 구체화 > 일반화 원칙
  base.addTwoColumnCards(pres, {
    title: '구체화 > 일반화 원칙',
    slideType: 'theory',
    leftTitle: '일반화 (❌)',
    leftItems: [
      '"관계를 추출해줘"',
      '',
      '결과: 임의의 관계 생성',
      'RELATED_TO, HAS, IS_PART_OF...',
      '',
      '문제: 온톨로지 불일치'
    ],
    rightTitle: '구체화 (✅)',
    rightItems: [
      '"INVESTED_IN, WORKS_AT 관계만 추출"',
      '',
      '결과: 정의된 관계만 추출',
      'INVESTED_IN, WORKS_AT',
      '',
      '장점: 온톨로지 일관성 유지'
    ]
  });

  // Slide 1-3: Meta-Dictionary를 프롬프트에 반영
  base.addCodeSlide(pres, {
    title: 'Meta-Dictionary를 프롬프트에 반영',
    slideType: 'practice',
    language: 'python',
    code: `import json

meta_dict = {
  "INVESTED_IN": {
    "keywords": ["투자", "지분", "보유"],
    "source_type": "Fund",
    "target_type": "Company"
  }
}

system_prompt = f"""
엔티티/관계를 추출하세요.
허용된 관계: {json.dumps(meta_dict, ensure_ascii=False)}
출력 형식: JSON
"""

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role":"system","content":system_prompt},
        {"role":"user","content":article_text}
    ]
)`,
    notes: 'Part 2에서 만든 Meta-Dictionary로 LLM 추출 범위 제한 → 정확도 향상'
  });

  // Slide 1-4: 문제정의 ↔ 엔티티 추출 alignment
  base.addContentSlide(pres, {
    title: '문제정의 ↔ 엔티티 추출 alignment',
    slideType: 'theory',
    content: [
      {
        type: 'text',
        text: '핵심 질문:',
        fontSize: 20,
        bold: true,
        y: 1.5
      },
      {
        type: 'text',
        text: '"우리가 추출할 엔티티/관계가 우리의 질문에 답할 수 있는가?"',
        fontSize: 18,
        color: base.colors.accent,
        y: 2.0
      },
      {
        type: 'text',
        text: '예시:\n• 질문: "삼성전자 투자 기관의 다른 투자처는?"\n• 필요 엔티티: Fund, Company\n• 필요 관계: INVESTED_IN\n\n→ 추출 대상과 질문이 정렬되어야 함',
        fontSize: 16,
        y: 2.8
      }
    ]
  });

  // ============================================================
  // Section 2: 자동 추출 실행 (40min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 2,
    sectionTitle: '자동 추출 실행',
    sectionDuration: '40min',
    sectionColor: base.colors.sectionColors[2] // blue
  });

  // Slide 2-1: GPT-4o로 엔티티/관계 추출
  base.addCodeSlide(pres, {
    title: 'GPT-4o로 엔티티/관계 추출',
    slideType: 'practice',
    language: 'python',
    code: `from openai import OpenAI

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
print(extracted["entities"])  # [{"name": "삼성전자", "type": "Company"}, ...]
print(extracted["relationships"])  # [{"source": "국민연금", "relation": "INVESTED_IN", "target": "삼성전자"}, ...]`,
    notes: 'response_format으로 JSON 강제 → 파싱 안정성 향상'
  });

  // Slide 2-2: Claude로 엔티티/관계 추출
  base.addCodeSlide(pres, {
    title: 'Claude로 엔티티/관계 추출',
    slideType: 'practice',
    language: 'python',
    code: `from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=2048,
    messages=[
        {"role": "user", "content": f"{system_prompt}\\n\\n{article_text}"}
    ]
)

extracted = json.loads(response.content[0].text)`,
    notes: 'Claude는 긴 컨텍스트 처리에 강점 → 복잡한 문서에 유리'
  });

  // Slide 2-3: 추출 결과 Neo4j 적재
  base.addCodeSlide(pres, {
    title: '추출 결과 Neo4j 적재',
    slideType: 'practice',
    language: 'python',
    code: `from neo4j import GraphDatabase

driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "password"))

def insert_entities(tx, entities):
    for e in entities:
        tx.run(f"MERGE (n:{e['type']} {{name: $name}})", name=e['name'])

def insert_relationships(tx, relationships):
    for r in relationships:
        tx.run(f"""
            MATCH (a {{name: $source}}), (b {{name: $target}})
            MERGE (a)-[:{r['relation']}]->(b)
        """, source=r['source'], target=r['target'])

with driver.session() as session:
    session.execute_write(insert_entities, extracted["entities"])
    session.execute_write(insert_relationships, extracted["relationships"])`,
    notes: 'MERGE 사용 → 중복 방지'
  });

  // ============================================================
  // Section 3: 수작업 vs LLM 비교 (30min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 3,
    sectionTitle: '수작업 vs LLM 비교',
    sectionDuration: '30min',
    sectionColor: base.colors.sectionColors[3] // purple
  });

  // Slide 3-1: 나란히 비교 — 3메트릭
  base.addComparisonTable(pres, {
    title: '나란히 비교 — 3메트릭',
    slideType: 'discussion',
    headers: ['메트릭', '수작업 (Part 2)', 'GPT-4o', 'Claude'],
    rows: [
      ['Variety (다양성)', '15노드/20관계', '25+/40+', '30+/45+'],
      ['Accuracy (정확도)', '100% (기준)', '~85%', '~88%'],
      ['Relationship (관계 정확도)', '100% (기준)', '~75%', '~80%']
    ],
    callout: '⚠️ LLM은 속도는 빠르지만 정확도는 낮다'
  });

  // Slide 3-2: LLM이 틀리는 패턴
  base.addContentSlide(pres, {
    title: 'LLM이 틀리는 패턴',
    slideType: 'discussion',
    content: [
      {
        type: 'text',
        text: '1. 환각 관계 (Hallucination)\n   → 실제 문서에 없는 관계 생성\n\n2. 누락된 엔티티 (Omission)\n   → 중요한 엔티티를 놓침\n\n3. 관계 방향 오류 (Direction Error)\n   → A→B를 B→A로 잘못 추출\n\n4. 동의어 혼용 (Synonym Confusion)\n   → "삼성전자", "삼성", "Samsung"을 별개 엔티티로 처리',
        fontSize: 16,
        y: 1.5
      },
      {
        type: 'callout',
        text: '💡 Part 4에서 Entity Resolution으로 해결',
        color: base.colors.accent,
        y: 4.0
      }
    ]
  });

  // Slide 3-3: LLM 평가 바이어스 주의
  base.addContentSlide(pres, {
    title: 'LLM 평가 바이어스 주의',
    slideType: 'discussion',
    content: [
      {
        type: 'large_text',
        text: 'LLM으로 LLM 결과를\n평가하면 바이어스 발생',
        fontSize: 28,
        bold: true,
        color: base.colors.danger,
        y: 1.8
      },
      {
        type: 'text',
        text: '해결책:\n• 교차 평가 (GPT로 Claude 결과 평가, Claude로 GPT 결과 평가)\n• 인간 검수 샘플링 (10% 이상)\n• 정답 레이블 데이터셋 구축',
        fontSize: 16,
        y: 3.2
      },
      {
        type: 'callout',
        text: '⚠️ 자동화해도 검수는 필수',
        color: base.colors.warning,
        y: 4.5
      }
    ]
  });

  // ============================================================
  // Section 4: Neo4j 자동 적재 (20min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 4,
    sectionTitle: 'Neo4j 자동 적재',
    sectionDuration: '20min',
    sectionColor: base.colors.sectionColors[4] // orange
  });

  // Slide 4-1: Python 스크립트로 일괄 적재
  base.addCodeSlide(pres, {
    title: 'Python 스크립트로 일괄 적재',
    slideType: 'practice',
    language: 'python',
    code: `import json
from neo4j import GraphDatabase

articles = load_articles()  # 뉴스 기사 로드
driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "password"))

for article in articles:
    # LLM 추출
    extracted = extract_with_llm(article)

    # Neo4j 적재
    with driver.session() as session:
        session.execute_write(insert_entities, extracted["entities"])
        session.execute_write(insert_relationships, extracted["relationships"])

print(f"총 {len(articles)}개 기사 처리 완료")`,
    notes: '100개 문서도 5분 내 처리 가능'
  });

  // Slide 4-2: 수작업 vs 자동 — 속도 비교
  base.addTwoColumnCards(pres, {
    title: '수작업 vs 자동 — 속도 비교',
    slideType: 'practice',
    leftTitle: '수작업 (Part 2)',
    leftItems: [
      '시간: 2시간',
      '처리량: 15노드',
      '관계: 20개',
      '',
      '손가락 아픔: ⭐⭐⭐⭐⭐'
    ],
    rightTitle: 'LLM 자동화 (Part 3)',
    rightItems: [
      '시간: 5분',
      '처리량: 30+노드',
      '관계: 45+개',
      '',
      '손가락 아픔: ⭐ (거의 없음)'
    ]
  });

  // Slide 4-3: 자동화의 가치
  base.addContentSlide(pres, {
    title: '🚀 자동화의 가치',
    slideType: 'discussion',
    content: [
      {
        type: 'large_text',
        text: '속도 24배 향상\n(2시간 → 5분)',
        fontSize: 32,
        bold: true,
        color: base.colors.success,
        y: 2.0
      },
      {
        type: 'callout',
        text: '💡 하지만 정확도는 여전히 과제 → Part 4에서 품질 개선',
        color: base.colors.warning,
        y: 3.8
      }
    ]
  });

  // ============================================================
  // Milestone & Next Preview
  // ============================================================
  base.addMilestoneSlide(pres, meta);
  base.addNextPreviewSlide(pres, meta);
};
