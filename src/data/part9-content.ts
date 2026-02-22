import type { SectionContent } from './part1-content';

export const part9Content: SectionContent[] = [
  // Section 1: Part 8 연결 + GDS 설치 (20min) - 4 slides
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '9-1',
        tag: 'discussion',
        title: 'Part 8 리캡 — 블랙박스를 열어보자',
        script: 'Part 8에서 fast-graphrag의 Personalized PageRank가 27배 빠르다고 했습니다. MS GraphRAG의 Leiden 커뮤니티 탐지도 봤고요. 이 알고리즘들이 프레임워크 내부에서 "블랙박스"로 쓰인 건데, Part 9에서는 직접 구현합니다. Leiden으로 "접착 도포 공정" 커뮤니티를 찾고, PageRank로 "가장 영향력 있는 설비"를 찾고, 경로 알고리즘으로 "접착 박리 → 접착기 A-3"의 증거 사슬을 추출합니다. 프레임워크가 내부에서 무엇을 하는지 이해하면, 우리 제조 도메인에 맞게 튜닝할 수 있습니다.',
        diagram: {
          nodes: [
            { text: 'Part 8: 프레임워크 비교', type: 'entity' },
            { text: 'Leiden (MS GraphRAG)', type: 'relation' },
            { text: 'PageRank (fast-graphrag)', type: 'relation' },
            { text: '블랙박스 → 직접 구현', type: 'fail' },
            { text: 'Part 9: 그래프 알고리즘', type: 'entity' },
            { text: '커뮤니티 + 중심성 + 경로', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: 'Part 9 목표: Part 8에서 본 프레임워크 내부 알고리즘(Leiden, PageRank)을 직접 구현하고, 제조 KG에 적용하여 RAG 품질을 높인다.'
        }
      },
      {
        id: '9-2',
        tag: 'theory',
        title: 'Neo4j GDS란? — 설치부터 시작',
        script: 'Neo4j GDS(Graph Data Science)는 Neo4j의 그래프 알고리즘 라이브러리입니다. 커뮤니티 탐지, 중심성, 경로 알고리즘 등 60+ 알고리즘을 제공합니다. GDS Community Edition은 무료이며, Part 9 실습에 필요한 모든 알고리즘을 포함합니다. Enterprise Edition은 대규모 프로덕션용으로 유료입니다.',
        table: {
          headers: ['설치 방법', '절차', '비고'],
          rows: [
            {
              cells: [
                { text: 'Neo4j Desktop', bold: true },
                { text: 'Plugins 탭 → "Graph Data Science" → Install (1-click)' },
                { text: '가장 간단', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Docker', bold: true },
                { text: 'neo4j:5-community + GDS plugin 마운트' },
                { text: '서버 환경', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'Neo4j AuraDB', bold: true },
                { text: 'GDS 내장 (Pro 이상 플랜)' },
                { text: '클라우드', status: 'warn' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: 'GDS Community(무료)로 Part 9 전체 실습 가능. Enterprise는 병렬 처리, 메모리 최적화 등 프로덕션 기능이 추가됩니다.'
        }
      },
      {
        id: '9-3',
        tag: 'practice',
        title: 'GDS Docker 설치 + 버전 확인',
        script: 'Docker로 Neo4j + GDS를 띄우고, 버전을 확인합시다. GDS Community 플러그인을 다운받아 plugins 폴더에 마운트하면 됩니다. 설치 후 RETURN gds.version()으로 확인하세요.',
        code: {
          language: 'bash',
          code: `# 1. GDS Community 플러그인 다운로드
mkdir -p neo4j-plugins
wget -O neo4j-plugins/neo4j-graph-data-science.jar \\
  "https://github.com/neo4j/graph-data-science/releases/download/2.12.0/neo4j-graph-data-science-2.12.0.jar"

# 2. Docker Compose (docker-compose.yml)
# neo4j:
#   image: neo4j:5-community
#   ports: ["7474:7474", "7687:7687"]
#   volumes:
#     - ./neo4j-plugins:/plugins
#   environment:
#     NEO4J_PLUGINS: '["graph-data-science"]'
#     NEO4J_AUTH: neo4j/\${NEO4J_PASSWORD}

docker compose up -d

# 3. GDS 버전 확인 (Cypher)
# RETURN gds.version() AS version;
# 결과: "2.12.0"`
        },
        callout: {
          type: 'warn',
          text: 'GDS 버전과 Neo4j 버전 호환성을 확인하세요. Neo4j 5.x에는 GDS 2.x가 필요합니다.'
        }
      },
      {
        id: '9-4',
        tag: 'practice',
        title: '제조 KG 그래프 프로젝션 — 풀 스키마',
        script: 'GDS 알고리즘은 먼저 그래프를 메모리에 프로젝션해야 합니다. Part 2-6에서 구축한 제조 KG의 전체 스키마를 프로젝션합시다. Process, Equipment, Defect, Material, Product, Spec 6개 노드 타입과 USES_EQUIPMENT, CAUSED_BY 등 6개 관계 타입을 포함합니다. Native projection은 전체 그래프를 빠르게 로드하고, Cypher projection은 필터링을 적용합니다.',
        code: {
          language: 'cypher',
          code: `// 1. 제조 KG 풀 스키마 Native Projection
CALL gds.graph.project(
  'manufacturingGraph',
  ['Process', 'Equipment', 'Defect', 'Material', 'Product', 'Spec'],
  ['USES_EQUIPMENT', 'CAUSED_BY', 'USES_MATERIAL',
   'HAS_DEFECT', 'CONFORMS_TO', 'MAINTAINED_ON']
);

// 2. Cypher Projection (활성 장비만 필터링)
CALL gds.graph.project.cypher(
  'activeEquipmentGraph',
  'MATCH (n) WHERE n:Process OR n:Equipment OR n:Defect
   RETURN id(n) AS id, labels(n)[0] AS nodeLabels',
  'MATCH (a)-[r:USES_EQUIPMENT|CAUSED_BY|HAS_DEFECT]->(b)
   RETURN id(a) AS source, id(b) AS target, type(r) AS type'
);

// 3. 프로젝션 정보 확인
CALL gds.graph.list()
YIELD graphName, nodeCount, relationshipCount, memoryUsage
RETURN graphName, nodeCount, relationshipCount, memoryUsage;

// 4. 프로젝션 삭제 (작업 완료 후)
CALL gds.graph.drop('activeEquipmentGraph');`
        },
        callout: {
          type: 'tip',
          text: 'Native projection은 속도, Cypher projection은 유연성. 대용량 제조 KG(1만+ 노드)에서는 Cypher projection으로 범위를 제한하세요.'
        }
      }
    ]
  },

  // Section 2: 커뮤니티 탐지 (25min) - 5 slides
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '9-5',
        tag: 'theory',
        title: '커뮤니티란? — 강하게 연결된 노드 그룹',
        script: '그래프에서 "커뮤니티"는 서로 밀접하게 연결된 노드들의 클러스터를 의미합니다. 같은 커뮤니티 내부는 연결이 많고, 커뮤니티 간에는 연결이 적죠. 제조 KG에서는 "접착 도포 → 접착기 A-3 → 접착제 EP-200 → 접착 박리"처럼 같은 공정 라인의 설비/자재/불량이 하나의 커뮤니티를 형성합니다. Part 8에서 MS GraphRAG가 Leiden으로 커뮤니티를 찾고 요약을 만들었죠. 그게 바로 이 알고리즘입니다.',
        diagram: {
          nodes: [
            { text: '접착 도포', type: 'entity' },
            { text: 'USES_EQUIPMENT', type: 'relation' },
            { text: '접착기 A-3', type: 'entity' },
            { text: 'USES_MATERIAL', type: 'relation' },
            { text: '접착제 EP-200', type: 'entity' },
            { text: '약한 연결', type: 'dim' },
            { text: '열압착 커뮤니티', type: 'fail' }
          ]
        },
        callout: {
          type: 'key',
          text: '커뮤니티 = 내부 밀집 + 외부 희소. MS GraphRAG의 Global Search는 이 커뮤니티 요약 기반입니다.'
        }
      },
      {
        id: '9-6',
        tag: 'theory',
        title: 'Louvain vs Leiden — 어떤 알고리즘을 쓸까?',
        script: '커뮤니티 탐지 알고리즘 중 실무에서는 Louvain과 Leiden이 대표적입니다. Louvain은 빠르지만 "잘못 연결된 커뮤니티"(poorly connected community)가 생길 수 있습니다. Leiden은 이를 개선하여 더 정확한 커뮤니티를 찾습니다. MS GraphRAG가 Leiden을 선택한 이유이기도 합니다. Part 9에서는 Leiden을 기본으로 사용합니다.',
        table: {
          headers: ['항목', 'Louvain', 'Leiden'],
          rows: [
            {
              cells: [
                { text: '속도' },
                { text: '빠름', status: 'pass' },
                { text: '약간 느림', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: '품질' },
                { text: 'poorly connected 발생 가능', status: 'warn' },
                { text: '항상 well-connected 보장', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '확장성' },
                { text: '1M+ 노드', status: 'pass' },
                { text: '1M+ 노드', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'MS GraphRAG에서' },
                { text: '미사용' },
                { text: '기본 알고리즘', status: 'pass', bold: true }
              ]
            },
            {
              cells: [
                { text: '권장 용도' },
                { text: '빠른 프로토타입' },
                { text: '프로덕션', status: 'pass', bold: true }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '실무 권장: Leiden. 속도가 문제라면 Cypher projection으로 그래프 범위를 줄이세요.'
        }
      },
      {
        id: '9-7',
        tag: 'practice',
        title: 'Leiden 커뮤니티 탐지 실행',
        script: 'Neo4j GDS로 제조 KG에 Leiden을 실행해봅시다. 앞서 만든 manufacturingGraph 프로젝션을 사용합니다. stream 모드로 결과를 확인하고, write 모드로 노드에 community 속성을 저장합니다. 결과를 보면 "접착 도포 + 접착기 A-3 + 접착제 EP-200 + 접착 박리"가 같은 커뮤니티로 묶이는 것을 확인할 수 있습니다.',
        code: {
          language: 'cypher',
          code: `// 1. Leiden 실행 (스트리밍 — 결과 확인)
CALL gds.leiden.stream('manufacturingGraph')
YIELD nodeId, communityId
RETURN gds.util.asNode(nodeId).name AS name,
       labels(gds.util.asNode(nodeId))[0] AS type,
       communityId
ORDER BY communityId, name
LIMIT 20;
// 예상 결과:
// | name         | type       | communityId |
// | 접착 도포     | Process    | 0           |
// | 접착기 A-3   | Equipment  | 0           |
// | 접착제 EP-200 | Material  | 0           |
// | 접착 박리     | Defect     | 0           |
// | 열압착        | Process    | 1           |
// | 열프레스 HP-01| Equipment  | 1           |

// 2. 커뮤니티 속성 저장
CALL gds.leiden.write('manufacturingGraph', {
  writeProperty: 'community'
});

// 3. 커뮤니티별 구성 확인
MATCH (n)
WHERE n.community IS NOT NULL
  AND (n:Process OR n:Equipment OR n:Defect
       OR n:Material OR n:Product OR n:Spec)
WITH n.community AS community,
     labels(n)[0] AS type,
     collect(n.name) AS members
RETURN community, type, members
ORDER BY community, type;`
        },
        callout: {
          type: 'tip',
          text: 'gds.graph.project는 인메모리 작업. 프로젝션 후 원본 DB를 변경해도 반영되지 않습니다. 데이터 변경 시 프로젝션 재생성 필요.'
        }
      },
      {
        id: '9-8',
        tag: 'practice',
        title: '커뮤니티 요약 생성 — MS GraphRAG 방식 직접 구현',
        script: 'MS GraphRAG의 Global Search 핵심은 커뮤니티별 요약입니다. Leiden 결과를 활용해서 직접 구현해봅시다. 다중 노드 타입(Process, Equipment, Defect, Material, Product)을 모두 포함하여 커뮤니티를 요약합니다. 이 요약은 "전체 공정에서 가장 자주 발생하는 불량 패턴은?" 같은 광범위한 질문에 답할 때 사용됩니다.',
        code: {
          language: 'python',
          code: `import os
import openai
from neo4j import GraphDatabase

# Claude 옵션: anthropic.messages.create(model="claude-sonnet-4-5-20250514", ...)
client = openai.OpenAI()
driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD"))
)

def generate_community_summaries():
    summaries = {}
    with driver.session() as session:
        # 다중 노드 타입 포함 커뮤니티 조회
        result = session.run("""
            MATCH (n) WHERE n.community IS NOT NULL
              AND (n:Process OR n:Equipment OR n:Defect
                   OR n:Material OR n:Product)
            WITH n.community AS comm,
                 collect(labels(n)[0] + ': ' + n.name) AS members,
                 count(n) AS size
            WHERE size >= 2
            RETURN comm, members, size
            ORDER BY size DESC
        """)

        for record in result:
            comm_id = record['comm']
            members = record['members']

            prompt = f"""다음은 제조 KG에서 동일 커뮤니티에 속한 노드들입니다:
{chr(10).join('- ' + m for m in members)}

이 커뮤니티의 특징을 3줄로 요약하세요.
어떤 공정/설비/자재/불량이 관련되어 있는지 설명하세요."""

            response = client.chat.completions.create(
                model="gpt-4o",
                temperature=0,
                messages=[{"role": "user", "content": prompt}]
            )
            summary = response.choices[0].message.content
            summaries[comm_id] = summary

            # Neo4j에 요약 저장
            session.run("""
                MERGE (c:Community {id: $comm_id})
                SET c.summary = $summary
            """, comm_id=comm_id, summary=summary)

    return summaries

summaries = generate_community_summaries()
for comm_id, summary in summaries.items():
    print(f"[커뮤니티 {comm_id}]\\n{summary}\\n")`
        },
        callout: {
          type: 'key',
          text: 'Global Search = 커뮤니티 요약 기반. 제조 도메인에서는 Process, Equipment, Defect, Material을 모두 포함해야 의미 있는 요약이 만들어집니다.'
        }
      },
      {
        id: '9-9',
        tag: 'practice',
        title: '커뮤니티 시각화 — pyvis로 인터랙티브 그래프',
        script: 'Leiden 결과를 시각화해봅시다. pyvis를 사용하면 브라우저에서 인터랙티브하게 커뮤니티를 탐색할 수 있습니다. 같은 커뮤니티는 같은 색상으로 표시되고, 노드 타입별로 크기를 다르게 합니다. 시각화를 통해 "접착 라인 커뮤니티와 열압착 라인 커뮤니티가 어떻게 연결되는지" 한눈에 파악할 수 있습니다.',
        code: {
          language: 'python',
          code: `from pyvis.network import Network
from neo4j import GraphDatabase
import os

driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD"))
)

# 커뮤니티 색상 팔레트
COLORS = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981',
          '#ef4444', '#ec4899', '#6366f1']
# 노드 타입별 크기
SIZE_MAP = {
    'Process': 30, 'Equipment': 25, 'Defect': 20,
    'Material': 20, 'Product': 25, 'Spec': 15
}

net = Network(height="600px", width="100%", notebook=True)

with driver.session() as session:
    # 노드 추가
    nodes = session.run("""
        MATCH (n) WHERE n.community IS NOT NULL
        RETURN id(n) AS id, n.name AS name,
               labels(n)[0] AS type, n.community AS comm
    """)
    for n in nodes:
        color = COLORS[n['comm'] % len(COLORS)]
        size = SIZE_MAP.get(n['type'], 15)
        net.add_node(n['id'], label=n['name'],
                     color=color, size=size,
                     title=f"{n['type']} (커뮤니티 {n['comm']})")

    # 관계 추가
    rels = session.run("""
        MATCH (a)-[r]->(b)
        WHERE a.community IS NOT NULL AND b.community IS NOT NULL
        RETURN id(a) AS src, id(b) AS tgt, type(r) AS rel
    """)
    for r in rels:
        net.add_edge(r['src'], r['tgt'], title=r['rel'])

net.show("manufacturing_communities.html")
print("manufacturing_communities.html 파일을 브라우저에서 열어보세요.")`
        },
        callout: {
          type: 'tip',
          text: 'pyvis 설치: pip install pyvis. HTML 파일로 저장되어 별도 서버 없이 브라우저에서 바로 확인 가능합니다.'
        }
      }
    ]
  },

  // Section 3: 중심성 알고리즘 + Personalized PageRank (25min) - 5 slides
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '9-10',
        tag: 'theory',
        title: 'PageRank — 가장 영향력 있는 설비 찾기',
        script: 'PageRank는 구글 검색의 핵심 알고리즘입니다. "많이 참조되는 노드가 중요하다"는 원리죠. 제조 KG에서는 여러 공정에서 사용하는 접착기 A-3, 여러 불량의 원인이 되는 접착제 EP-200처럼 "많은 관계를 가진 핵심 노드"를 찾아냅니다. Part 8에서 fast-graphrag가 PageRank로 0.4초 응답을 달성했던 것 기억하시죠? 그 알고리즘을 직접 실행합니다.',
        diagram: {
          nodes: [
            { text: '접착기 A-3', type: 'entity' },
            { text: '← USES_EQUIPMENT', type: 'relation' },
            { text: '접착 도포', type: 'dim' },
            { text: '← CAUSED_BY', type: 'relation' },
            { text: '접착 박리', type: 'dim' },
            { text: '← MAINTAINED_ON', type: 'relation' },
            { text: '정비 기록', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: 'PageRank = 링크 개수 x 링크의 품질. 제조 KG에서는 "가장 영향력 있는 설비/자재"를 찾는 핵심 알고리즘입니다.'
        }
      },
      {
        id: '9-11',
        tag: 'practice',
        title: 'PageRank 실행 + Personalized PageRank',
        script: 'Part 8에서 약속한 Personalized PageRank를 구현합니다. 일반 PageRank는 전체 그래프의 중심성을 측정하지만, Personalized PageRank는 특정 노드(예: 접착 박리)를 시작점으로 "그 노드에서 가장 영향력 있는 관련 노드"를 찾습니다. fast-graphrag가 이것으로 27배 빠른 응답을 달성했습니다. 제조 도메인에서는 "접착 박리와 가장 관련 있는 설비/공정/자재"를 즉시 찾을 수 있습니다.',
        code: {
          language: 'cypher',
          code: `// 1. 일반 PageRank (전체 중심성)
CALL gds.pageRank.stream('manufacturingGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS node,
       labels(gds.util.asNode(nodeId))[0] AS type,
       round(score, 4) AS pagerank
ORDER BY score DESC
LIMIT 10;
// 예상 결과:
// | node          | type       | pagerank |
// | 접착기 A-3    | Equipment  | 0.4821   |
// | 접착 도포     | Process    | 0.3156   |
// | 접착제 EP-200 | Material   | 0.2843   |

// 2. Personalized PageRank (접착 박리 시작점)
// "접착 박리"에서 가장 관련 있는 노드를 찾기
MATCH (source:Defect {name: '접착 박리'})
CALL gds.pageRank.stream('manufacturingGraph', {
  sourceNodes: [source],
  dampingFactor: 0.85
})
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS node,
       labels(gds.util.asNode(nodeId))[0] AS type,
       round(score, 4) AS score
ORDER BY score DESC LIMIT 10;
// → 접착기 A-3, 접착 도포, 접착제 EP-200 순으로 나옴

// 3. PageRank 저장
CALL gds.pageRank.write('manufacturingGraph', {
  writeProperty: 'pagerank'
});`
        },
        callout: {
          type: 'key',
          text: 'Personalized PageRank = fast-graphrag의 핵심. 특정 불량에서 시작해 관련 설비/공정/자재를 중요도 순으로 찾습니다.'
        }
      },
      {
        id: '9-12',
        tag: 'theory',
        title: 'Betweenness Centrality — 공정 라인의 병목점',
        script: 'Betweenness Centrality는 "많은 최단 경로가 지나가는 노드"를 찾습니다. 제조 KG에서는 여러 공정 라인을 연결하는 중간 공정이나 공유 설비를 찾아냅니다. 예: 접착 도포와 열압착을 모두 연결하는 성형 공정이 높은 Betweenness를 가질 수 있습니다. 이런 노드는 제거 시 정보 흐름이 끊어지는 critical path입니다.',
        diagram: {
          nodes: [
            { text: '접착 라인', type: 'dim' },
            { text: '→', type: 'relation' },
            { text: '성형 (브리지)', type: 'entity' },
            { text: '→', type: 'relation' },
            { text: '열압착 라인', type: 'dim' }
          ]
        },
        callout: {
          type: 'tip',
          text: '브리지 노드 = 공정 라인 간 핵심 연결 고리. 이 노드의 정보를 컨텍스트에 포함하면 더 풍부한 답변을 얻을 수 있습니다.'
        }
      },
      {
        id: '9-13',
        tag: 'practice',
        title: 'Betweenness + 두 중심성 조합 분석',
        script: 'Betweenness Centrality를 실행하고, PageRank와 결합해서 종합 분석합니다. PageRank가 높은 노드는 "영향력"이 크고, Betweenness가 높은 노드는 "연결 역할"이 큽니다. 둘 다 높은 노드는 제조 KG에서 가장 중요한 핵심 노드입니다.',
        code: {
          language: 'cypher',
          code: `// 1. Betweenness Centrality 실행
CALL gds.betweenness.stream('manufacturingGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS node,
       labels(gds.util.asNode(nodeId))[0] AS type,
       round(score, 2) AS betweenness
ORDER BY score DESC
LIMIT 10;

// 2. Betweenness 저장
CALL gds.betweenness.write('manufacturingGraph', {
  writeProperty: 'betweenness'
});

// 3. 두 중심성 조합 — 핵심 노드 식별
MATCH (n)
WHERE n.pagerank IS NOT NULL AND n.betweenness IS NOT NULL
  AND (n:Process OR n:Equipment OR n:Defect
       OR n:Material OR n:Product)
RETURN n.name AS name,
       labels(n)[0] AS type,
       round(n.pagerank, 4) AS pagerank,
       round(n.betweenness, 2) AS betweenness,
       CASE
         WHEN n.pagerank > 0.1 AND n.betweenness > 1.0
         THEN 'CRITICAL'
         WHEN n.pagerank > 0.05 OR n.betweenness > 0.5
         THEN 'IMPORTANT'
         ELSE 'NORMAL'
       END AS priority
ORDER BY n.pagerank DESC
LIMIT 15;`
        },
        callout: {
          type: 'warn',
          text: 'Betweenness는 계산 비용이 높습니다. 1만+ 노드에서는 sampling 옵션(samplingSize 파라미터)을 사용하세요.'
        }
      },
      {
        id: '9-14',
        tag: 'practice',
        title: '알고리즘 파이프라인 — Leiden + PageRank + Betweenness 일괄 실행',
        script: '여러 알고리즘을 순차적으로 실행하는 파이프라인을 만듭시다. mutate 모드를 쓰면 인메모리 그래프에만 결과를 저장해서 디스크 I/O를 줄입니다. 마지막에 write로 최종 결과를 일괄 저장합니다. 이 파이프라인 패턴은 Part 10의 Agentic GraphRAG에서 에이전트가 자동으로 실행합니다.',
        code: {
          language: 'cypher',
          code: `// 1. 그래프 프로젝션 (이미 존재하면 drop 후 재생성)
CALL gds.graph.drop('pipeline', false);
CALL gds.graph.project(
  'pipeline',
  ['Process', 'Equipment', 'Defect', 'Material', 'Product', 'Spec'],
  ['USES_EQUIPMENT', 'CAUSED_BY', 'USES_MATERIAL',
   'HAS_DEFECT', 'CONFORMS_TO', 'MAINTAINED_ON']
);

// 2. Leiden (커뮤니티 탐지, mutate)
CALL gds.leiden.mutate('pipeline', {
  mutateProperty: 'community'
});

// 3. PageRank (mutate)
CALL gds.pageRank.mutate('pipeline', {
  mutateProperty: 'pagerank'
});

// 4. Betweenness Centrality (mutate)
CALL gds.betweenness.mutate('pipeline', {
  mutateProperty: 'betweenness'
});

// 5. 모든 결과를 한 번에 write
CALL gds.graph.nodeProperties.write(
  'pipeline',
  ['community', 'pagerank', 'betweenness']
);

// 6. 종합 조회 — 커뮤니티별 핵심 노드
MATCH (n)
WHERE n.community IS NOT NULL
WITH n.community AS community,
     collect({
       name: n.name,
       type: labels(n)[0],
       pagerank: round(n.pagerank, 4),
       betweenness: round(n.betweenness, 2)
     }) AS members
RETURN community,
       size(members) AS size,
       members[0..3] AS topMembers
ORDER BY size DESC;

// 7. 프로젝션 삭제
CALL gds.graph.drop('pipeline');`
        },
        callout: {
          type: 'tip',
          text: 'mutate 모드 = 메모리만 사용. 파이프라인 완료 후 write로 일괄 저장하면 I/O 최소화. 프로덕션에서는 이 패턴을 사용하세요.'
        }
      },
      // --- 경로 알고리즘 (sec3 continued) ---
      {
        id: '9-15',
        tag: 'theory',
        title: '최단 경로 — 불량 원인 추적의 증거 사슬',
        script: '최단 경로 알고리즘은 두 노드 사이의 가장 짧은 경로를 찾습니다. 제조 KG에서는 "접착 박리는 왜 발생했는가?"라는 질문에 "접착 박리 → CAUSED_BY → 접착 도포 → USES_EQUIPMENT → 접착기 A-3 → MAINTAINED_ON → 정비 지연"이라는 증거 사슬을 추출합니다. 이 경로를 LLM에 전달하면 hallucination 없이 근거 있는 답변을 생성합니다.',
        diagram: {
          nodes: [
            { text: '접착 박리', type: 'entity' },
            { text: '← CAUSED_BY', type: 'relation' },
            { text: '접착 도포', type: 'dim' },
            { text: '← USES_EQUIPMENT', type: 'relation' },
            { text: '접착기 A-3', type: 'dim' },
            { text: '← MAINTAINED_ON', type: 'fail' },
            { text: '정비 지연', type: 'entity' }
          ]
        },
        callout: {
          type: 'key',
          text: '경로 = 추론의 증거. LLM에 경로를 주면 hallucination이 줄어듭니다. Multi-hop 추론의 핵심 패턴입니다.'
        }
      },
      {
        id: '9-16',
        tag: 'practice',
        title: '경로 탐색 실습 — 방향 있는 원인 추적',
        script: '두 가지 경로 탐색을 실습합니다. 먼저 양방향 shortestPath로 "접착 박리"와 "접착기 A-3"의 연결을 찾고, 다음으로 방향 있는 CAUSED_BY 경로로 불량 원인을 역추적합니다. 방향 있는 경로가 더 정확합니다 — "접착 박리가 발생한 근본 원인"을 추적하기 때문이죠.',
        code: {
          language: 'cypher',
          code: `// 1. 양방향 최단 경로 (접착 박리 ↔ 접착기 A-3)
MATCH (start:Defect {name: '접착 박리'}),
      (end:Equipment {name: '접착기 A-3'})
MATCH path = shortestPath((start)-[*..5]-(end))
RETURN [node IN nodes(path) | node.name] AS nodes,
       [rel IN relationships(path) | type(rel)] AS relations,
       length(path) AS hops;

// 2. 방향 있는 원인 추적 (CAUSED_BY 체인)
MATCH (d:Defect {name: '접착 박리'})
MATCH path = (d)-[:CAUSED_BY*1..4]->(root)
RETURN [node IN nodes(path) | node.name] AS chain,
       [rel IN relationships(path) | type(rel)] AS relations,
       length(path) AS depth
ORDER BY depth DESC;
// → 접착 박리 → 접착 도포 → (근본 원인) 순서로 추적

// 3. 모든 최단 경로 (대안 경로 발견)
MATCH (start:Defect {name: '접착 박리'}),
      (end:Equipment {name: '열프레스 HP-01'})
MATCH paths = allShortestPaths((start)-[*..5]-(end))
RETURN [node IN nodes(paths) | node.name] AS route,
       length(paths) AS hops
LIMIT 5;

// 4. 경로 내 노드의 PageRank 조회
MATCH (d:Defect {name: '접착 박리'}),
      (e:Equipment {name: '접착기 A-3'})
MATCH path = shortestPath((d)-[*..5]-(e))
WITH nodes(path) AS pathNodes
UNWIND pathNodes AS n
RETURN n.name, labels(n)[0] AS type,
       round(n.pagerank, 4) AS pagerank
ORDER BY n.pagerank DESC;`
        },
        callout: {
          type: 'tip',
          text: 'maxHops 제한 필수 (*..5). 무한 경로 탐색은 성능 문제를 일으킵니다. 제조 KG에서는 5홉이면 충분합니다.'
        }
      },
      {
        id: '9-17',
        tag: 'practice',
        title: '경로 기반 LLM 추론 — 증거 사슬 전달',
        script: '경로를 찾았으면, 이를 LLM에 전달해서 추론하게 만듭니다. "접착 박리 → 접착 도포 → 접착기 A-3" 경로를 텍스트로 변환해서 프롬프트에 포함합니다. LLM은 경로를 기반으로 "접착 박리의 원인은 접착기 A-3의 정비 지연으로 인한 접착 도포 공정의 온도 불안정"이라는 근거 있는 답변을 생성합니다.',
        code: {
          language: 'python',
          code: `import os
import openai
from neo4j import GraphDatabase

# Claude 옵션: anthropic.messages.create(model="claude-sonnet-4-5-20250514", ...)
client = openai.OpenAI()
driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD"))
)

def find_path_and_explain(start_name: str, end_name: str) -> str:
    """경로를 찾고 LLM으로 해석"""
    with driver.session() as session:
        result = session.run("""
            MATCH (start {name: $start}), (end {name: $end})
            MATCH path = shortestPath((start)-[*..5]-(end))
            RETURN [node IN nodes(path) | node.name] AS nodes,
                   [rel IN relationships(path) | type(rel)] AS rels,
                   [node IN nodes(path) |
                    labels(node)[0]] AS types
        """, start=start_name, end=end_name)

        record = result.single()
        if not record:
            return "경로를 찾을 수 없습니다."

        nodes = record["nodes"]
        rels = record["rels"]
        types = record["types"]

        # 경로 텍스트 생성 (타입 포함)
        path_text = ""
        for i in range(len(rels)):
            path_text += f"({types[i]}) {nodes[i]} "
            path_text += f"--[{rels[i]}]--> "
        path_text += f"({types[-1]}) {nodes[-1]}"

    prompt = f"""다음은 제조 지식 그래프에서 발견된 경로입니다:
{path_text}

이 경로가 의미하는 인과 관계와 시사점을 설명하세요.
구체적인 개선 조치도 제안하세요."""

    response = client.chat.completions.create(
        model="gpt-4o",
        temperature=0,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# 실행 예시
result = find_path_and_explain("접착 박리", "접착기 A-3")
print(result)
# → "접착 박리는 접착 도포 공정에서 발생하며,
#    이 공정에 사용되는 접착기 A-3의 정비 상태가 핵심 원인입니다.
#    개선: 접착기 A-3의 예방 정비 주기를 단축하세요."`
        },
        callout: {
          type: 'key',
          text: '경로 = 증거 사슬. Hallucination 방지의 핵심 패턴. 경로 없이 답변하면 LLM이 관계를 "지어낼" 수 있습니다.'
        }
      },
      {
        id: '9-18',
        tag: 'theory',
        title: '경로 알고리즘 선택 가이드',
        script: '상황에 따라 적절한 경로 알고리즘을 선택해야 합니다. shortestPath는 가장 빠른 연결을, allShortestPaths는 대안 경로를, 방향 있는 경로는 인과 관계를 추적합니다. GDS의 Dijkstra는 가중치를 고려한 최적 경로를 찾습니다.',
        table: {
          headers: ['알고리즘', '용도 (제조 예시)', '성능'],
          rows: [
            {
              cells: [
                { text: 'shortestPath', bold: true },
                { text: '"접착 박리와 열프레스 HP-01의 관계는?"' },
                { text: '빠름', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'allShortestPaths', bold: true },
                { text: '"접착 박리의 모든 가능한 원인 경로는?"' },
                { text: '보통', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'CAUSED_BY*1..N', bold: true },
                { text: '"접착 박리의 근본 원인까지 역추적"' },
                { text: '빠름', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'GDS Dijkstra', bold: true },
                { text: '"가중치 기반 최적 경로 (PageRank 반영)"' },
                { text: '보통', status: 'warn' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '실무 추천: 인과 관계 추적 → 방향 있는 CAUSED_BY 경로, 관계 탐색 → shortestPath, 대안 분석 → allShortestPaths.'
        }
      }
    ]
  },

  // Section 4: 알고리즘 → RAG 통합 + graphrag_pipeline_v2 (30min) - 5 slides
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '9-19',
        tag: 'practice',
        title: 'PageRank 리랭킹 — 벡터 + 그래프 결합',
        script: '벡터 검색만으로는 노드의 중요도를 반영하기 어렵습니다. PageRank를 활용하면 "많이 참조되는 중요한 설비/공정"을 상위로 끌어올릴 수 있습니다. 하이브리드 점수 = alpha x vector_similarity + (1-alpha) x pagerank_normalized. alpha=0.7이 기본값이며, 도메인에 따라 튜닝합니다.',
        code: {
          language: 'python',
          code: `import os
import numpy as np
from neo4j import GraphDatabase

driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD"))
)

def hybrid_rerank(
    vector_results: list[dict],
    alpha: float = 0.7,
    top_k: int = 10
) -> list[dict]:
    """벡터 검색 결과에 PageRank 리랭킹 적용"""
    with driver.session() as session:
        pageranks = {}
        for result in vector_results:
            node_name = result['name']
            pr = session.run("""
                MATCH (n {name: $name})
                RETURN n.pagerank AS pr
            """, name=node_name).single()
            pageranks[node_name] = (pr['pr'] or 0.0) if pr else 0.0

        # PageRank 정규화 (0~1)
        pr_values = list(pageranks.values())
        pr_min, pr_max = min(pr_values), max(pr_values)
        pr_norm = {
            k: (v - pr_min) / (pr_max - pr_min)
            if pr_max > pr_min else 0.5
            for k, v in pageranks.items()
        }

    # 하이브리드 점수 계산
    reranked = []
    for r in vector_results:
        name = r['name']
        vec_score = r['score']
        pr_score = pr_norm[name]
        final = alpha * vec_score + (1 - alpha) * pr_score
        reranked.append({
            **r,
            'pagerank': pr_score,
            'final_score': final
        })

    reranked.sort(key=lambda x: x['final_score'], reverse=True)
    return reranked[:top_k]

# 실행 예시
vector_results = [
    {'name': '접착기 A-3', 'score': 0.92, 'text': '접착기 A-3 정비 기록...'},
    {'name': '열프레스 HP-01', 'score': 0.95, 'text': '열프레스 HP-01 사양...'},
    {'name': '접착 도포', 'score': 0.88, 'text': '접착 도포 공정 설명...'},
]
results = hybrid_rerank(vector_results, alpha=0.7)
for r in results:
    print(f"{r['name']}: 벡터={r['score']:.3f}, "
          f"PR={r['pagerank']:.3f}, 최종={r['final_score']:.3f}")`
        },
        callout: {
          type: 'tip',
          text: 'alpha 튜닝: 사실 정확도 중요 → alpha 높게 (벡터 우선), 도메인 전문성 중요 → alpha 낮게 (PageRank 우선).'
        }
      },
      {
        id: '9-20',
        tag: 'practice',
        title: 'graphrag_pipeline_v2 — Part 6 파이프라인 + 알고리즘 강화',
        script: 'Part 6에서 만든 graphrag_pipeline을 알고리즘으로 강화합니다. v2는 RRF 융합 결과에 PageRank 점수를 추가로 반영합니다. 벡터 유사도 + 그래프 구조 + 노드 중요도를 종합한 최종 검색 결과를 LLM에 전달합니다. 이것이 Part 8에서 본 fast-graphrag의 핵심 전략입니다.',
        code: {
          language: 'python',
          code: `import os
import openai
from neo4j import GraphDatabase

# Claude 옵션: anthropic.messages.create(model="claude-sonnet-4-5-20250514", ...)
client = openai.OpenAI()
driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD"))
)

def get_pagerank(node_name: str) -> float:
    """노드의 PageRank 점수 조회"""
    with driver.session() as session:
        result = session.run("""
            MATCH (n {name: $name})
            RETURN n.pagerank AS pr
        """, name=node_name).single()
        return result['pr'] if result and result['pr'] else 0.0

def graphrag_pipeline_v2(
    question: str,
    alpha: float = 0.7
) -> str:
    """Part 6 파이프라인 + PageRank 리랭킹 강화 버전

    alpha: RRF 점수 vs PageRank 가중치 (0.7 = RRF 70%, PR 30%)
    """
    # 1. Part 6의 RRF 융합 결과 (벡터 + Text2Cypher + 키워드)
    rrf_results = rrf_fusion(question)  # Part 6에서 구현

    # 2. PageRank 리랭킹
    reranked = []
    for result in rrf_results:
        pr_score = get_pagerank(result["node_name"])
        final_score = (
            alpha * result["rrf_score"]
            + (1 - alpha) * pr_score
        )
        reranked.append({
            **result,
            "pagerank": pr_score,
            "final_score": final_score
        })

    reranked.sort(key=lambda x: x["final_score"], reverse=True)
    top_contexts = reranked[:5]

    # 3. 경로 증거 추가 (상위 결과 간 경로 탐색)
    paths = []
    if len(top_contexts) >= 2:
        with driver.session() as session:
            path_result = session.run("""
                MATCH (a {name: $n1}), (b {name: $n2})
                MATCH p = shortestPath((a)-[*..4]-(b))
                RETURN [n IN nodes(p) | n.name] AS nodes,
                       [r IN relationships(p) | type(r)] AS rels
            """, n1=top_contexts[0]["node_name"],
                 n2=top_contexts[1]["node_name"])
            rec = path_result.single()
            if rec:
                paths.append(
                    " -> ".join(rec["nodes"])
                    + f" (via {', '.join(rec['rels'])})"
                )

    # 4. LLM 답변 생성
    context = "\\n".join([
        f"- {c['node_name']}: {c['text'][:200]} "
        f"(점수: {c['final_score']:.3f})"
        for c in top_contexts
    ])
    path_info = "\\n".join(paths) if paths else "없음"

    prompt = f"""제조 지식 그래프 검색 결과를 바탕으로 답변하세요.

검색 결과:
{context}

경로 증거:
{path_info}

질문: {question}"""

    response = client.chat.completions.create(
        model="gpt-4o",
        temperature=0,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# 실행
answer = graphrag_pipeline_v2(
    "접착 박리의 원인과 관련 설비는?",
    alpha=0.7
)
print(answer)`
        },
        callout: {
          type: 'key',
          text: 'graphrag_pipeline_v2 = Part 6 RRF 융합 + Part 9 PageRank 리랭킹 + 경로 증거. 세 가지를 결합한 최종 파이프라인입니다.'
        }
      },
      {
        id: '9-21',
        tag: 'practice',
        title: 'alpha 튜닝 가이드 — Part 7 RAGAS 평가 연동',
        script: 'alpha 값을 어떻게 정할까요? Part 7에서 만든 RAGAS 평가 데이터셋을 활용합니다. alpha를 0.0~1.0까지 0.1 단위로 바꿔가며 faithfulness와 answer_relevancy를 측정하고, 최적값을 찾습니다. 제조 도메인에서는 보통 alpha=0.6~0.8이 최적입니다.',
        code: {
          language: 'python',
          code: `from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy
import json

# Part 7에서 만든 평가 데이터셋 로드
with open("ragas_eval_dataset.json") as f:
    eval_data = json.load(f)

def sweep_alpha(
    questions: list[str],
    ground_truths: list[str],
    alpha_range: list[float]
) -> list[dict]:
    """alpha 값별 RAGAS 점수 측정"""
    results = []
    for alpha in alpha_range:
        answers = [
            graphrag_pipeline_v2(q, alpha=alpha)
            for q in questions
        ]

        # RAGAS 평가
        scores = evaluate(
            questions=questions,
            answers=answers,
            ground_truths=ground_truths,
            metrics=[faithfulness, answer_relevancy]
        )

        results.append({
            "alpha": alpha,
            "faithfulness": scores["faithfulness"],
            "answer_relevancy": scores["answer_relevancy"],
            "combined": (
                scores["faithfulness"]
                + scores["answer_relevancy"]
            ) / 2
        })
        print(f"alpha={alpha:.1f}: "
              f"faith={scores['faithfulness']:.3f}, "
              f"rel={scores['answer_relevancy']:.3f}")

    return results

# alpha 0.0 ~ 1.0 스윕
results = sweep_alpha(
    questions=eval_data["questions"][:20],
    ground_truths=eval_data["ground_truths"][:20],
    alpha_range=[i/10 for i in range(11)]
)

# 최적 alpha 찾기
best = max(results, key=lambda x: x["combined"])
print(f"\\n최적 alpha: {best['alpha']}"
      f" (faith: {best['faithfulness']:.3f},"
      f" rel: {best['answer_relevancy']:.3f})")`
        },
        callout: {
          type: 'tip',
          text: 'Part 7의 RAGAS 데이터셋(20개 질문)을 재활용. 새 데이터 없이도 알고리즘 튜닝이 가능합니다.'
        }
      },
      {
        id: '9-22',
        tag: 'practice',
        title: 'Global Search 직접 구현 — 커뮤니티 요약 검색',
        script: 'MS GraphRAG의 Global Search를 직접 구현합시다. Leiden으로 만든 커뮤니티 요약을 모아서 LLM에 전달합니다. "전체 공정에서 가장 자주 발생하는 불량 패턴은?"처럼 전체 데이터셋에 걸친 질문에 답합니다. Local Search(벡터+PageRank)와 조합하면 어떤 질문이든 대응할 수 있습니다.',
        code: {
          language: 'python',
          code: `import os
import openai
from neo4j import GraphDatabase

# Claude 옵션: anthropic.messages.create(model="claude-sonnet-4-5-20250514", ...)
client = openai.OpenAI()
driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD"))
)

def global_search(query: str) -> str:
    """커뮤니티 요약 기반 Global Search
    MS GraphRAG 방식을 직접 구현합니다."""

    with driver.session() as session:
        result = session.run("""
            MATCH (c:Community)
            RETURN c.id AS id, c.summary AS summary
            ORDER BY c.id
        """)
        all_summaries = "\\n\\n".join([
            f"[커뮤니티 {r['id']}]\\n{r['summary']}"
            for r in result
        ])

    prompt = f"""다음은 제조 지식 그래프의 커뮤니티별 요약입니다:

{all_summaries}

위 요약을 바탕으로 다음 질문에 답하세요.
증거가 있는 커뮤니티 번호를 함께 인용하세요.

질문: {query}"""

    response = client.chat.completions.create(
        model="gpt-4o",
        temperature=0,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# 실행
answer = global_search(
    "전체 공정에서 가장 자주 발생하는 불량 패턴은?"
)
print(answer)
# → "커뮤니티 0(접착 라인)에서 접착 박리가 가장 빈번하며,
#    커뮤니티 1(열압착 라인)에서 두께 불균일이 주요 불량입니다."`
        },
        callout: {
          type: 'key',
          text: 'Local Search = PageRank 리랭킹 (특정 노드 질문), Global Search = 커뮤니티 요약 (전체 트렌드 질문). 둘 다 구현하세요.'
        }
      },
      {
        id: '9-23',
        tag: 'discussion',
        title: '알고리즘 적용 전후 품질 비교',
        script: '그래프 알고리즘을 적용하기 전과 후의 RAG 품질을 비교합니다. 위 수치는 예시이며, 실제 성능은 KG 규모와 질문 유형에 따라 달라집니다. 측정 방법: Part 7의 RAGAS 평가 데이터셋(20개 질문)으로 각 단계별 faithfulness, answer_relevancy를 측정합니다.',
        table: {
          headers: ['지표', 'Baseline (벡터만)', '+ PageRank 리랭킹', '+ 커뮤니티 요약'],
          rows: [
            {
              cells: [
                { text: 'Faithfulness' },
                { text: '0.72', status: 'warn' },
                { text: '0.81', status: 'pass' },
                { text: '0.89 (Global)', status: 'pass', bold: true }
              ]
            },
            {
              cells: [
                { text: 'Answer Relevancy' },
                { text: '0.68', status: 'warn' },
                { text: '0.79', status: 'pass' },
                { text: '0.85', status: 'pass', bold: true }
              ]
            },
            {
              cells: [
                { text: 'Latency (ms)' },
                { text: '120ms', status: 'pass' },
                { text: '180ms', status: 'warn' },
                { text: '200ms', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'Cost (토큰/쿼리)' },
                { text: '800', status: 'pass' },
                { text: '900', status: 'warn' },
                { text: '1200 + 요약비용', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: '추천 용도' },
                { text: '프로토타입' },
                { text: 'Local Search', status: 'pass', bold: true },
                { text: 'Global Search', status: 'pass', bold: true }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: '위 수치는 예시이며, 실제 성능은 KG 규모와 질문 유형에 따라 달라집니다. 반드시 Part 7의 RAGAS 데이터셋으로 자체 벤치마크하세요.'
        }
      }
    ]
  },

  // Section 5: 종합 정리 + Part 10 예고 (15min) - 2 slides
  {
    sectionId: 'sec5',
    slides: [
      {
        id: '9-24',
        tag: 'discussion',
        title: 'Part 9 핵심 정리 — 알고리즘 맵',
        script: 'Part 9에서 배운 알고리즘을 정리합니다. Leiden은 MS GraphRAG의 핵심이고, PageRank/Personalized PageRank는 fast-graphrag의 핵심입니다. 경로 알고리즘은 Multi-hop 추론의 증거 사슬입니다. 이 모든 알고리즘을 graphrag_pipeline_v2로 통합했고, Part 7의 RAGAS로 튜닝하는 방법까지 다뤘습니다.',
        table: {
          headers: ['알고리즘', '용도 (제조 KG)', 'Part 연결'],
          rows: [
            {
              cells: [
                { text: 'Leiden 커뮤니티', bold: true },
                { text: '공정 라인 그룹핑 + Global Search 요약' },
                { text: 'Part 8: MS GraphRAG', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'PageRank', bold: true },
                { text: '핵심 설비/자재 식별 + 리랭킹' },
                { text: 'Part 6: RRF 융합 강화', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Personalized PageRank', bold: true },
                { text: '특정 불량에서 관련 노드 추적' },
                { text: 'Part 8: fast-graphrag', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Betweenness', bold: true },
                { text: '공정 간 병목점 식별' },
                { text: 'Critical path 분석', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: '경로 알고리즘', bold: true },
                { text: '불량 원인 증거 사슬 추출' },
                { text: 'Hallucination 방지', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'graphrag_pipeline_v2', bold: true },
                { text: 'RRF + PageRank + 경로 = 최종 파이프라인' },
                { text: 'Part 6 + Part 9 통합', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'GraphRAG = 벡터 검색 + 그래프 알고리즘 + 경로 증거. 세 가지를 결합해야 진정한 품질 향상이 나옵니다.'
        }
      },
      {
        id: '9-25',
        tag: 'discussion',
        title: 'Part 10 예고 — Agentic GraphRAG',
        script: 'Part 10에서는 이 알고리즘들을 LangGraph 에이전트가 자율적으로 선택합니다. "이 질문에는 커뮤니티 요약이 적합한가, 경로 탐색이 적합한가?"를 에이전트가 판단하는 Agentic GraphRAG를 구축합니다. Part 9의 알고리즘 파이프라인이 "수동"이었다면, Part 10은 "자동"입니다. 에이전트가 "접착 박리 원인 추적"에는 경로 알고리즘을, "전체 불량 트렌드"에는 Global Search를 자동 선택합니다.',
        diagram: {
          nodes: [
            { text: 'Part 9: 수동 파이프라인', type: 'entity' },
            { text: '개발자가 알고리즘 선택', type: 'dim' },
            { text: '→ 진화', type: 'relation' },
            { text: 'Part 10: Agentic GraphRAG', type: 'entity' },
            { text: 'LangGraph Agent가 자동 선택', type: 'dim' },
            { text: '커뮤니티 요약 vs 경로 탐색 vs PageRank', type: 'relation' }
          ]
        },
        callout: {
          type: 'tip',
          text: 'Part 10 키워드: LangGraph 멀티에이전트 + Tool 설계 + 자기 수정 파이프라인 — Part 9의 알고리즘을 Agent Tool로 변환합니다.'
        }
      }
    ]
  }
];
