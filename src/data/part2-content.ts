import type { SectionContent, SlideContent } from './part1-content';

export const part2Content: SectionContent[] = [
  // Section 1: 온톨로지 설계 워크숍
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '1-1',
        tag: 'discussion',
        title: '도메인 선택 — 한국 IT 기업',
        script: '우리가 이번 Part 2에서 수작업 KG를 만들 도메인은 "한국 IT 기업"입니다. 왜 이걸 선택했을까요? 삼성전자, SK하이닉스, 네이버, 카카오... 여러분 모두가 잘 아는 도메인이죠. 친숙한 도메인을 선택하면 관계 추출 정확도가 올라갑니다. 왜냐하면 "이게 맞나? 틀렸나?"를 바로 판단할 수 있거든요. 만약 의료 도메인이었다면 "이 약이 저 병을 치료한다"라는 관계가 맞는지 판단하기 어렵겠죠. 하지만 "국민연금이 삼성전자에 투자했다"는 뉴스로 확인 가능합니다.',
        callout: {
          type: 'key',
          text: '친숙한 도메인 = 관계 추출 정확도 향상 + 빠른 검증'
        }
      },
      {
        id: '1-2',
        tag: 'discussion',
        title: 'Node Labels 정의',
        script: '이제 우리 도메인에서 어떤 엔티티 타입들이 있을지 정의해봅시다. 먼저 Company는 기업이죠. 삼성전자, SK하이닉스가 이에 해당합니다. Person은 인물입니다. 이재용 회장 같은 경우죠. Product는 제품입니다. 갤럭시 S24, 아이폰 같은 거요. Fund는 투자기관입니다. 국민연금, 블랙록 같은 곳들이죠. Technology는 기술입니다. HBM, Exynos 같은 거요. 이렇게 5개 타입으로 시작하면 충분합니다.',
        table: {
          headers: ['Entity Type', '예시', '설명'],
          rows: [
            { cells: [{ text: 'Company', bold: true }, { text: '삼성전자' }, { text: '기업' }] },
            { cells: [{ text: 'Person', bold: true }, { text: '이재용' }, { text: '인물' }] },
            { cells: [{ text: 'Product', bold: true }, { text: '갤럭시 S24' }, { text: '제품' }] },
            { cells: [{ text: 'Fund', bold: true }, { text: '국민연금' }, { text: '투자기관' }] },
            { cells: [{ text: 'Technology', bold: true }, { text: 'HBM' }, { text: '기술' }] }
          ]
        }
      },
      {
        id: '1-3',
        tag: 'theory',
        title: 'Relationship Prefix 9가지',
        script: '이제 관계를 정의해봅시다. Relationship Prefix는 관계의 이름입니다. 우리는 9가지를 정의했어요. INVESTED_IN은 투자 관계입니다. 국민연금이 삼성전자에 투자했다는 식이죠. WORKS_AT은 소속 관계입니다. 이재용이 삼성전자에서 일한다는 거요. PRODUCES는 생산 관계입니다. 삼성전자가 갤럭시를 만든다는 거죠. COMPETES_WITH는 경쟁 관계입니다. 삼성전자와 SK하이닉스가 경쟁한다는 거요. PARTNERS_WITH는 협력 관계입니다. SUBSIDIARY_OF는 자회사 관계입니다. 삼성SDI가 삼성전자의 자회사라는 식이죠. USES_TECH는 기술 사용 관계입니다. 갤럭시가 Exynos를 쓴다는 거요. REGULATES는 규제 관계입니다. 공정거래위원회가 삼성전자를 규제한다는 식이죠. SUPPLIES_TO는 공급 관계입니다. SK하이닉스가 NVIDIA에 메모리를 공급한다는 거요.',
        table: {
          headers: ['Prefix', '의미', '예시'],
          rows: [
            { cells: [{ text: 'INVESTED_IN', bold: true }, { text: '투자' }, { text: '국민연금→삼성전자' }] },
            { cells: [{ text: 'WORKS_AT', bold: true }, { text: '소속' }, { text: '이재용→삼성전자' }] },
            { cells: [{ text: 'PRODUCES', bold: true }, { text: '생산' }, { text: '삼성전자→갤럭시' }] },
            { cells: [{ text: 'COMPETES_WITH', bold: true }, { text: '경쟁' }, { text: '삼성전자↔SK하이닉스' }] },
            { cells: [{ text: 'PARTNERS_WITH', bold: true }, { text: '협력' }, { text: '삼성전자↔TSMC' }] },
            { cells: [{ text: 'SUBSIDIARY_OF', bold: true }, { text: '자회사' }, { text: '삼성SDI→삼성전자' }] },
            { cells: [{ text: 'USES_TECH', bold: true }, { text: '기술 사용' }, { text: '갤럭시→Exynos' }] },
            { cells: [{ text: 'REGULATES', bold: true }, { text: '규제' }, { text: '공정위→삼성전자' }] },
            { cells: [{ text: 'SUPPLIES_TO', bold: true }, { text: '공급' }, { text: 'SK하이닉스→NVIDIA' }] }
          ]
        },
        callout: {
          type: 'tip',
          text: '관계 방향이 중요합니다. A→B와 B→A는 완전히 다른 의미입니다.'
        }
      }
    ]
  },
  // Section 2: Meta-Dictionary 만들기
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '2-1',
        tag: 'practice',
        title: 'Meta-Dictionary란?',
        script: 'Meta-Dictionary는 도메인 전문가의 암묵지를 체계화한 관계 키워드 사전입니다. 무슨 말이냐면, 우리가 뉴스 기사를 읽을 때 "투자", "지분", "보유" 같은 단어를 보면 INVESTED_IN 관계를 떠올리잖아요. 이 암묵적인 지식을 JSON으로 정리하는 겁니다. Part 3에서 LLM으로 자동 추출할 때, 이 Dictionary를 프롬프트에 넣어주면 LLM이 더 정확하게 관계를 추출할 수 있어요.',
        diagram: {
          nodes: [
            { text: '도메인 문서', type: 'entity' },
            { text: '키워드 추출', type: 'relation' },
            { text: '패턴 정의', type: 'entity' },
            { text: 'JSON 구조화', type: 'relation' },
            { text: 'Meta-Dictionary', type: 'entity' }
          ]
        }
      },
      {
        id: '2-2',
        tag: 'practice',
        title: 'Meta-Dictionary JSON 구조',
        script: 'Meta-Dictionary의 JSON 구조는 이렇게 생겼습니다. 각 관계마다 keywords 필드에 관련 키워드를 배열로 넣어줍니다. INVESTED_IN이면 "투자", "지분", "보유" 같은 거죠. source_type과 target_type은 관계의 방향을 정의합니다. INVESTED_IN은 Fund에서 Company로 가는 관계니까 source_type이 Fund, target_type이 Company인 거죠. PRODUCES는 Company에서 Product로 가니까 source_type이 Company, target_type이 Product입니다. 이렇게 정리해두면 LLM이 "제조"라는 단어를 보고 PRODUCES 관계를 추출할 수 있어요.',
        code: {
          language: 'json',
          code: `{
  "INVESTED_IN": {
    "keywords": ["투자", "지분", "보유", "매입"],
    "source_type": "Fund",
    "target_type": "Company"
  },
  "PRODUCES": {
    "keywords": ["제조", "출시", "생산", "개발"],
    "source_type": "Company",
    "target_type": "Product"
  },
  "WORKS_AT": {
    "keywords": ["소속", "근무", "재직"],
    "source_type": "Person",
    "target_type": "Company"
  }
}`
        },
        callout: {
          type: 'tip',
          text: 'Part 3에서 이 Dictionary를 LLM 프롬프트에 반영하여 자동 추출 정확도를 높입니다.'
        }
      },
      {
        id: '2-3',
        tag: 'practice',
        title: 'Meta-Dictionary 작성 실습',
        script: '자, 이제 여러분이 직접 Meta-Dictionary를 작성해봅시다. 뉴스 기사 5개를 읽으면서 "이 문장에서 어떤 관계가 추출되나?" 생각해보세요. 그리고 그 관계를 나타내는 키워드를 찾아서 JSON에 추가하세요. 예를 들어 "삼성전자는 SK하이닉스와 경쟁한다"는 문장이 있으면 COMPETES_WITH 관계의 keywords에 "경쟁"을 추가하는 거죠. 10분 동안 작업해보세요.',
        callout: {
          type: 'warn',
          text: '키워드는 너무 많이 넣으면 LLM이 헷갈립니다. 핵심 키워드 3-5개만 선택하세요.'
        }
      }
    ]
  },
  // Section 3: 데이터 정제
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '3-1',
        tag: 'practice',
        title: '뉴스 기사에서 엔티티/관계 추출',
        script: '이제 실제 뉴스 기사에서 엔티티와 관계를 추출해봅시다. 예시 기사를 하나 볼게요. "국민연금은 삼성전자 지분 9.8%를 보유하고 있다. 삼성전자는 최신 갤럭시 S24를 출시했다." 이 기사에서 엔티티는 무엇인가요? 국민연금, 삼성전자, 갤럭시 S24 세 개입니다. 각각의 타입은? 국민연금은 Fund, 삼성전자는 Company, 갤럭시 S24는 Product죠. 관계는요? 국민연금이 삼성전자에 INVESTED_IN 관계입니다. 그리고 삼성전자가 갤럭시 S24를 PRODUCES 관계죠. 이렇게 밑줄 긋고, 화살표 그리면서 패턴을 익히세요.',
        visual: '뉴스 기사 화면에 엔티티는 형광펜으로 강조, 관계는 화살표로 표시',
        callout: {
          type: 'tip',
          text: '물리적으로 종이에 인쇄해서 밑줄 긋는 것도 좋은 학습 방법입니다.'
        }
      },
      {
        id: '3-2',
        tag: 'practice',
        title: '엑셀 정리 — 노드 & 관계 목록',
        script: '추출한 엔티티와 관계를 엑셀에 정리해봅시다. 노드 목록 시트를 하나 만들고, Entity, Label, Properties 컬럼을 만드세요. 예를 들어 첫 번째 행에 Entity는 "삼성전자", Label은 "Company", Properties는 "{name: 삼성전자, industry: 반도체}"로 적는 거죠. 관계 목록 시트도 만들어서 Source, Relation, Target 컬럼을 만드세요. "국민연금", "INVESTED_IN", "삼성전자" 이런 식으로 적으면 됩니다. 이렇게 정리하면 나중에 Neo4j에 넣을 때 편해요.',
        table: {
          headers: ['Entity', 'Label', 'Properties'],
          rows: [
            { cells: [{ text: '삼성전자' }, { text: 'Company' }, { text: '{name, industry}' }] },
            { cells: [{ text: '국민연금' }, { text: 'Fund' }, { text: '{name, type}' }] },
            { cells: [{ text: '갤럭시 S24' }, { text: 'Product' }, { text: '{name}' }] }
          ]
        }
      },
      {
        id: '3-3',
        tag: 'practice',
        title: '15개 노드, 20개 관계 추출 미션',
        script: '자, 이제 여러분의 미션입니다. 뉴스 기사 10개를 읽고, 최소 15개의 노드와 20개의 관계를 추출하세요. 시간은 30분 드릴게요. 노드는 5개 타입(Company, Person, Product, Fund, Technology) 골고루 섞어서 추출하세요. 관계는 9가지 타입 중에서 다양하게 써보세요. 엑셀에 정리하면서 진행하시면 됩니다. 손가락이 아프기 시작할 겁니다. 이게 수작업의 한계를 체감하는 순간이에요.',
        callout: {
          type: 'warn',
          text: '같은 엔티티가 여러 기사에 나오면 한 번만 추출하세요. 중복 제거가 중요합니다.'
        }
      }
    ]
  },
  // Section 4: Neo4j 직접 입력
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '4-1',
        tag: 'practice',
        title: 'CREATE 문으로 노드 생성',
        script: '이제 추출한 엔티티를 Neo4j에 넣어봅시다. Neo4j Browser를 여세요. CREATE 문을 사용합니다. 삼성전자 노드를 만들어볼게요. CREATE (samsung:Company {name: "삼성전자", industry: "반도체"}) 이렇게 쓰면 됩니다. samsung은 변수 이름이고, Company는 Label입니다. 중괄호 안은 Properties죠. 국민연금도 만들어볼게요. CREATE (npf:Fund {name: "국민연금", type: "공적연금"}) 이렇게요. 갤럭시 S24도 만들어봅시다. CREATE (galaxy:Product {name: "갤럭시 S24"}) 이렇게 하면 노드 3개가 생성됩니다.',
        code: {
          language: 'cypher',
          code: `CREATE (samsung:Company {
  name: '삼성전자',
  industry: '반도체'
})
CREATE (npf:Fund {
  name: '국민연금',
  type: '공적연금'
})
CREATE (galaxy:Product {
  name: '갤럭시 S24'
})`
        },
        callout: {
          type: 'tip',
          text: 'Neo4j Browser에서 실행하면 그래프 시각화가 바로 나옵니다.'
        }
      },
      {
        id: '4-2',
        tag: 'practice',
        title: 'CREATE 문으로 관계 생성',
        script: '이제 관계를 만들어봅시다. 관계를 만들 때는 먼저 MATCH로 노드를 찾고, CREATE로 관계를 연결합니다. 국민연금이 삼성전자에 투자한 관계를 만들어볼게요. MATCH (npf:Fund {name: "국민연금"}) MATCH (samsung:Company {name: "삼성전자"}) CREATE (npf)-[:INVESTED_IN {stake: "9.8%"}]->(samsung) 이렇게 쓰면 됩니다. 관계에도 프로퍼티를 추가할 수 있어요. stake: "9.8%" 이런 식으로요. 삼성전자가 갤럭시를 생산하는 관계도 만들어봅시다. MATCH (samsung:Company {name: "삼성전자"}) MATCH (galaxy:Product {name: "갤럭시 S24"}) CREATE (samsung)-[:PRODUCES]->(galaxy) 이렇게 하면 됩니다.',
        code: {
          language: 'cypher',
          code: `MATCH (npf:Fund {name: '국민연금'})
MATCH (samsung:Company {name: '삼성전자'})
CREATE (npf)-[:INVESTED_IN {
  stake: '9.8%'
}]->(samsung)

MATCH (samsung:Company {name: '삼성전자'})
MATCH (galaxy:Product {name: '갤럭시 S24'})
CREATE (samsung)-[:PRODUCES]->(galaxy)`
        }
      },
      {
        id: '4-3',
        tag: 'practice',
        title: '15개 노드, 20개 관계 일괄 입력',
        script: '이제 여러분이 추출한 15개 노드와 20개 관계를 모두 Neo4j에 넣어보세요. CREATE 문을 15개, MATCH-CREATE 문을 20개 작성해야 합니다. 손가락이 더 아파질 겁니다. 이게 수작업의 한계예요. 만약 100개 문서라면 어떻게 하겠습니까? 1000개라면요? 이 고통을 체감하는 게 중요합니다. 왜냐하면 Part 3에서 LLM 자동화를 배울 때 "아, 자동화가 정말 필요하구나"라고 느낄 수 있거든요.',
        callout: {
          type: 'warn',
          text: '수작업의 한계 체감 → Part 3 자동화 동기부여'
        }
      },
      {
        id: '4-4',
        tag: 'discussion',
        title: '이거 100개 문서면 어떻게 하지?',
        script: '15개 노드, 20개 관계 넣는데 얼마나 걸렸나요? 30분? 1시간? 만약 문서가 100개라면 몇 시간이 걸릴까요? 10시간? 20시간? 그리고 실수도 많이 생기겠죠. 오타, 중복, 관계 방향 실수... 이게 바로 수작업의 한계입니다. 하지만 이 경험이 중요해요. 왜냐하면 이제 Part 3에서 LLM으로 자동화할 때, 여러분은 "자동화가 정말 필요하구나"라고 절실히 느낄 거거든요. 그리고 자동화의 가치를 제대로 이해할 수 있어요.',
        visual: '화면에 큰 글씨로 "15개 노드 = 1시간, 100개 문서 = ???"',
        callout: {
          type: 'key',
          text: '고통을 체감한 사람만이 자동화의 가치를 진정으로 이해합니다.'
        }
      }
    ]
  },
  // Section 5: 쿼리 실습 + 시각화
  {
    sectionId: 'sec5',
    slides: [
      {
        id: '5-1',
        tag: 'practice',
        title: 'Multi-hop 질문 직접 해보기',
        script: '이제 Part 1에서 벡터 RAG가 실패했던 질문을 그래프로 해결해봅시다. "삼성전자에 투자한 기관이 투자한 다른 기업은?" 이 질문을 Cypher로 어떻게 쓸까요? MATCH (samsung:Company {name:"삼성전자"}) <-[:INVESTED_IN]-(fund) -[:INVESTED_IN]->(other) WHERE other <> samsung RETURN fund.name AS 투자기관, other.name AS 다른투자처 이렇게 쓰면 됩니다. 삼성전자를 찾고, 삼성전자에 투자한 펀드를 찾고, 그 펀드가 투자한 다른 회사를 찾는 거죠. 벡터 RAG는 이걸 못했습니다. 왜냐하면 청크가 분리되어 있어서요. 하지만 그래프는 관계를 추적할 수 있으니까 가능해요.',
        code: {
          language: 'cypher',
          code: `// 질문: 삼성전자 투자 기관의 다른 투자처는?
MATCH (samsung:Company {name:'삼성전자'})
      <-[:INVESTED_IN]-(fund)
      -[:INVESTED_IN]->(other)
WHERE other <> samsung
RETURN fund.name AS 투자기관,
       other.name AS 다른투자처

// 결과: 국민연금 | SK하이닉스`
        },
        callout: {
          type: 'key',
          text: 'Part 1에서 벡터 RAG가 실패했던 질문을 그래프로 해결했습니다!'
        }
      },
      {
        id: '5-2',
        tag: 'practice',
        title: '벡터 RAG vs Graph — 같은 질문, 다른 결과',
        script: '이제 벡터 RAG와 GraphRAG를 나란히 비교해봅시다. 같은 질문을 던졌는데 결과가 완전히 다릅니다. 벡터 RAG는 "정확한 정보를 찾을 수 없습니다"라고 답했어요. 왜냐하면 청크가 분리되어 있어서 관계를 추적할 수 없거든요. 하지만 GraphRAG는 "국민연금 | SK하이닉스"라고 정확히 답했습니다. 왜냐하면 그래프 구조를 따라가면 답이 나오거든요. 이게 바로 GraphRAG의 핵심 가치입니다. Multi-hop 질문에 답할 수 있다는 거죠.',
        table: {
          headers: ['시스템', '질문', '결과', '원인/장점'],
          rows: [
            {
              cells: [
                { text: '벡터 RAG', bold: true },
                { text: '삼성 투자 기관의 다른 투자처는?' },
                { text: '정보 없음', status: 'fail' },
                { text: '청크 분리 → 관계 소실' }
              ]
            },
            {
              cells: [
                { text: 'GraphRAG', bold: true },
                { text: '삼성 투자 기관의 다른 투자처는?' },
                { text: '국민연금 | SK하이닉스', status: 'pass' },
                { text: '관계 추적으로 정확한 답변' }
              ]
            }
          ]
        }
      },
      {
        id: '5-3',
        tag: 'practice',
        title: 'Neo4j Browser 시각화',
        script: 'Neo4j Browser에서 그래프를 시각화해보세요. MATCH 쿼리를 실행하면 화면에 노드와 관계가 그래프로 나타납니다. 국민연금 노드에서 삼성전자, SK하이닉스로 화살표가 뻗어나가는 걸 볼 수 있어요. 이 시각화가 정말 강력합니다. 왜냐하면 한눈에 관계를 파악할 수 있거든요. 실무에서는 이 시각화로 온톨로지를 검증하고, 데이터 품질을 확인합니다. 예를 들어 "어? 이 노드는 관계가 하나도 없네?"라고 발견하면 데이터 추출 과정에서 뭔가 빠진 거죠.',
        visual: 'Neo4j Browser 스크린샷: 국민연금 노드에서 삼성전자, SK하이닉스로 INVESTED_IN 화살표가 뻗어나가는 그래프',
        callout: {
          type: 'tip',
          text: '시각화는 데이터 품질 검증의 핵심 도구입니다. 고립된 노드, 이상한 관계 등을 빠르게 발견할 수 있습니다.'
        }
      },
      {
        id: '5-4',
        tag: 'discussion',
        title: '체감 포인트 — "벡터로 안 되는 질문이 그래프로 되는 순간"',
        script: '여러분, 지금 이 순간이 정말 중요합니다. 벡터 RAG로 안 되던 질문이 GraphRAG로 되는 순간을 경험했습니다. 이게 GraphRAG의 핵심 가치예요. Multi-hop 질문에 답할 수 있다는 거죠. 이 경험을 기억하세요. 나중에 실무에서 "우리 프로젝트에 GraphRAG가 필요한가?"라고 판단할 때, 이 경험이 기준이 됩니다. "우리 질문이 Multi-hop인가? 그럼 GraphRAG가 필요해. 1-hop이면 벡터 RAG로 충분해." 이렇게 판단할 수 있거든요.',
        visual: '화면에 큰 글씨로 "벡터로 안 되는 질문이 그래프로 되는 순간!"',
        callout: {
          type: 'key',
          text: '이 경험이 GraphRAG의 핵심 가치를 이해하는 결정적 순간입니다.'
        }
      }
    ]
  }
];
