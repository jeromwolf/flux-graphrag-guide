import { Callout } from '@/components/ui/Callout';

export default function Neo4jOptimizationGuide() {
  return (
    <div
      className="border-t p-6 space-y-6"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--bg-secondary)',
      }}
    >
      <Callout type="key">
        <strong>핵심 원칙:</strong> Neo4j 최적화의 80%는 인덱스 전략에서 결정됩니다.
        <br />
        쿼리 튜닝 전에 반드시 인덱스부터 점검하세요.
      </Callout>

      <section>
        <h4
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--accent-cyan)' }}
        >
          1. Composite Index
        </h4>
        <div
          className="p-4 rounded-lg space-y-3"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>언제:</strong> 자주 함께 검색되는 속성 조합이 있을 때
          </div>
          <div
            className="p-3 rounded font-mono text-xs"
            style={{
              background: 'rgba(0,0,0,0.04)',
              color: 'var(--accent-cyan)',
            }}
          >
            CREATE INDEX FOR (p:Process) ON (p.name, p.department)
          </div>
          <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
            단일 속성 인덱스 2개보다 Composite Index 1개가 훨씬 빠릅니다.
          </div>
        </div>
      </section>

      <section>
        <h4
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--accent-cyan)' }}
        >
          2. Fulltext Index
        </h4>
        <div
          className="p-4 rounded-lg space-y-3"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>언제:</strong> 텍스트 검색이 필요할 때 (한국어 포함)
          </div>
          <div
            className="p-3 rounded font-mono text-xs"
            style={{
              background: 'rgba(0,0,0,0.04)',
              color: 'var(--accent-cyan)',
            }}
          >
            CREATE FULLTEXT INDEX FOR (d:Defect) ON EACH [d.description]
          </div>
          <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
            CONTAINS 연산보다 10배 이상 빠릅니다. 한국어 형태소 분석은 별도 플러그인 필요.
          </div>
        </div>
      </section>

      <section>
        <h4
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--accent-cyan)' }}
        >
          3. APOC 쿼리 최적화
        </h4>
        <div className="space-y-3">
          <div
            className="p-4 rounded-lg"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="font-semibold mb-2" style={{ color: 'var(--accent-cyan)' }}>
              apoc.periodic.iterate
            </div>
            <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              대용량 배치 작업을 청크 단위로 분할하여 메모리 초과를 방지합니다.
            </div>
            <div
              className="p-3 rounded font-mono text-xs"
              style={{
                background: 'rgba(0,0,0,0.04)',
                color: 'var(--accent-cyan)',
              }}
            >
              {`CALL apoc.periodic.iterate(\n  "MATCH (n:Process) RETURN n",\n  "SET n.updated = timestamp()",\n  {batchSize: 1000}\n)`}
            </div>
          </div>
          <div
            className="p-4 rounded-lg"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="font-semibold mb-2" style={{ color: 'var(--accent-cyan)' }}>
              apoc.path.expandConfig
            </div>
            <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              경로 탐색의 범위를 제한하여 불필요한 그래프 탐색을 방지합니다.
            </div>
            <div
              className="p-3 rounded font-mono text-xs"
              style={{
                background: 'rgba(0,0,0,0.04)',
                color: 'var(--accent-cyan)',
              }}
            >
              {`CALL apoc.path.expandConfig(startNode, {\n  maxLevel: 3,\n  relationshipFilter: "CAUSED_BY>|USES>",\n  labelFilter: "+Process|+Defect"\n})`}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h4
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--accent-cyan)' }}
        >
          4. 메모리 튜닝 공식
        </h4>
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            style={{ borderCollapse: 'separate', borderSpacing: 0 }}
          >
            <thead>
              <tr>
                {['노드 수', 'Heap (초기)', 'Heap (최대)', 'Pagecache', 'Total RAM'].map((header) => (
                  <th
                    key={header}
                    className="text-left px-4 py-3 font-semibold"
                    style={{
                      background: 'rgba(14,165,233,0.08)',
                      borderBottom: '2px solid var(--accent-cyan)',
                      color: 'var(--accent-cyan)',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { nodes: '~1K', heapInit: '512m', heapMax: '1g', pagecache: '512m', ram: '4GB' },
                { nodes: '~10K', heapInit: '1g', heapMax: '2g', pagecache: '1g', ram: '8GB' },
                { nodes: '~100K', heapInit: '2g', heapMax: '4g', pagecache: '4g', ram: '16GB' },
                { nodes: '~1M', heapInit: '4g', heapMax: '8g', pagecache: '8g', ram: '32GB' },
              ].map((row, idx) => (
                <tr
                  key={idx}
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <td className="px-4 py-3 font-bold" style={{ color: 'var(--accent-yellow)' }}>
                    {row.nodes}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-primary)' }}>
                    {row.heapInit}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-primary)' }}>
                    {row.heapMax}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--accent-cyan)' }}>
                    {row.pagecache}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {row.ram}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout type="tip">
          <strong>공식:</strong> Pagecache = 전체 store 파일 크기 + 20% 여유. Heap은 절대 총 RAM의 50%를 넘기지 마세요.
        </Callout>
      </section>

      <section>
        <h4
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--accent-cyan)' }}
        >
          5. 쿼리 프로파일링
        </h4>
        <div className="space-y-3">
          <div
            className="p-4 rounded-lg"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center gap-4 mb-3">
              <div>
                <code
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{
                    background: 'rgba(14,165,233,0.1)',
                    color: 'var(--accent-cyan)',
                  }}
                >
                  PROFILE
                </code>
                <span className="text-sm ml-2" style={{ color: 'var(--text-secondary)' }}>
                  쿼리를 실행하고 실제 db hits, 행 수를 표시
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <code
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{
                    background: 'rgba(234,179,8,0.1)',
                    color: 'var(--accent-yellow)',
                  }}
                >
                  EXPLAIN
                </code>
                <span className="text-sm ml-2" style={{ color: 'var(--text-secondary)' }}>
                  실행 계획만 표시 (실제 실행하지 않음)
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
            <p><strong style={{ color: 'var(--text-primary)' }}>db hits 줄이기 전략:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>인덱스를 활용하는 WHERE 조건 우선 배치</li>
              <li>불필요한 MATCH 패턴 제거</li>
              <li>WITH 절로 중간 결과를 줄인 후 다음 단계 진행</li>
              <li>OPTIONAL MATCH를 남용하지 않기</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h4
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--accent-cyan)' }}
        >
          6. 대용량 데이터 적재
        </h4>
        <div className="space-y-3">
          <div
            className="p-4 rounded-lg"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="font-semibold mb-2" style={{ color: 'var(--accent-cyan)' }}>
              UNWIND 배치 삽입
            </div>
            <div
              className="p-3 rounded font-mono text-xs"
              style={{
                background: 'rgba(0,0,0,0.04)',
                color: 'var(--accent-cyan)',
              }}
            >
              {`UNWIND $batch AS row\nMERGE (p:Process {id: row.id})\nSET p.name = row.name, p.type = row.type`}
            </div>
          </div>
          <div
            className="p-4 rounded-lg"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="font-semibold mb-2" style={{ color: 'var(--accent-cyan)' }}>
              apoc.load.json
            </div>
            <div
              className="p-3 rounded font-mono text-xs"
              style={{
                background: 'rgba(0,0,0,0.04)',
                color: 'var(--accent-cyan)',
              }}
            >
              {`CALL apoc.load.json("file:///data.json")\nYIELD value\nMERGE (n:Node {id: value.id})\nSET n += value.properties`}
            </div>
          </div>
        </div>
        <Callout type="warn">
          <strong>주의:</strong> CREATE 대신 MERGE를 사용하세요. 중복 실행 시 데이터 중복이 발생하며, 대용량에서는 치명적입니다.
        </Callout>
      </section>

      <section>
        <h4
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--accent-cyan)' }}
        >
          7. 캐시 전략
        </h4>
        <div className="space-y-3">
          {[
            {
              title: '쿼리 결과 캐시',
              description: '동일 쿼리의 반복 실행을 방지합니다. 애플리케이션 레벨에서 Redis/Memcached를 활용하거나, 결과를 별도 노드로 저장합니다.',
              icon: '💾',
            },
            {
              title: '자주 사용하는 서브그래프 사전 로드',
              description: '핫 데이터 (자주 조회되는 노드/관계)를 Pagecache에 유지합니다. 워밍업 쿼리를 서버 시작 시 실행하세요.',
              icon: '🔥',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex gap-3 p-4 rounded-lg"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
            >
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Callout type="tip">
        <strong>우선순위:</strong> 인덱스 설정 → 쿼리 프로파일링 → 메모리 튜닝 → APOC 최적화 → 캐시 전략 순으로 적용하세요. 인덱스만 제대로 설정해도 대부분의 성능 문제가 해결됩니다.
      </Callout>
    </div>
  );
}
