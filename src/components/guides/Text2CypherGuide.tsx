import { Callout } from '@/components/ui/Callout';

export default function Text2CypherGuide() {
  return (
    <div
      className="border-t p-6 space-y-6"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--bg-secondary)',
      }}
    >
      <Callout type="key">
        <strong>핵심 원칙:</strong> Text2Cypher의 성공률은 스키마 정보의 품질에 비례합니다.
        <br />
        LLM이 그래프 구조를 정확히 알수록 올바른 Cypher를 생성합니다.
      </Callout>

      <section>
        <h4
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--accent-cyan)' }}
        >
          Text2Cypher 3단계 진화
        </h4>
        <div className="space-y-4">
          {[
            {
              step: '1',
              title: '기본 (Zero-shot)',
              description: 'LLM에 스키마 + 질문을 주고 Cypher를 생성합니다. 별도 예제 없이 스키마만으로 쿼리를 만들어내는 방식입니다.',
              rate: '~45%',
              rateColor: 'var(--accent-red)',
            },
            {
              step: '2',
              title: 'Few-shot',
              description: '유사한 질문-쿼리 쌍을 예제로 추가합니다. LLM이 패턴을 학습하여 더 정확한 Cypher를 생성합니다.',
              rate: '~72%',
              rateColor: 'var(--accent-yellow)',
            },
            {
              step: '3',
              title: 'Agent 기반',
              description: '생성된 Cypher를 실행하고, 오류 발생 시 LLM이 자가 수정을 반복합니다. 최대 3회까지 재시도합니다.',
              rate: '~88%',
              rateColor: 'var(--accent-green, #4ade80)',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-4 p-4 rounded-lg"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                style={{
                  background: 'var(--accent-cyan)',
                  color: 'var(--bg-primary)',
                }}
              >
                {item.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold">{item.title}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded font-bold"
                    style={{
                      background: 'rgba(0,0,0,0.02)',
                      color: item.rateColor,
                    }}
                  >
                    성공률 {item.rate}
                  </span>
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h4
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--accent-cyan)' }}
        >
          실패하는 쿼리 패턴 12가지
        </h4>
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            style={{ borderCollapse: 'separate', borderSpacing: 0 }}
          >
            <thead>
              <tr>
                {['#', '실패 패턴', '설명'].map((header) => (
                  <th
                    key={header}
                    className="text-left px-4 py-3 font-semibold"
                    style={{
                      background: 'rgba(239,68,68,0.08)',
                      borderBottom: '2px solid var(--accent-red)',
                      color: 'var(--accent-red)',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { num: '1', pattern: '잘못된 레이블명', desc: 'Process vs process (대소문자 구분)' },
                { num: '2', pattern: '존재하지 않는 관계 타입', desc: 'LLM이 스키마에 없는 관계를 생성' },
                { num: '3', pattern: '방향 오류', desc: '화살표 방향이 스키마와 반대' },
                { num: '4', pattern: '속성명 오타', desc: 'name vs Name, status vs state' },
                { num: '5', pattern: '다중 홉 경로 누락', desc: '중간 노드를 건너뛰고 직접 연결 시도' },
                { num: '6', pattern: 'OPTIONAL MATCH 미사용', desc: '없을 수 있는 관계를 MATCH로 처리' },
                { num: '7', pattern: '집계 함수 오류', desc: 'WITH 절 없이 집계 함수 사용' },
                { num: '8', pattern: '날짜 형식 불일치', desc: 'ISO 8601 vs 한국식 날짜 형식 혼용' },
                { num: '9', pattern: 'NULL 처리 누락', desc: 'NULL 값에 대한 필터링 미고려' },
                { num: '10', pattern: '인덱스 미활용 쿼리', desc: '인덱스 없는 속성으로 대량 검색' },
                { num: '11', pattern: '카테시안 곱 발생', desc: '연결되지 않은 MATCH 절이 곱집합 생성' },
                { num: '12', pattern: 'LIMIT 없는 대용량 쿼리', desc: '전체 그래프 탐색으로 메모리 초과' },
              ].map((row) => (
                <tr
                  key={row.num}
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <td className="px-4 py-3 font-bold" style={{ color: 'var(--accent-red)' }}>
                    {row.num}
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                    {row.pattern}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h4
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--accent-cyan)' }}
        >
          Agent 기반 자가 수정
        </h4>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Agent 방식은 Cypher 생성 후 실행 결과를 피드백으로 활용하여 자가 수정을 반복합니다.
        </p>
        <div className="flex flex-wrap items-center gap-2 p-4 rounded-lg" style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}>
          {[
            { label: '질문 입력', icon: '💬' },
            { label: '→', icon: '' },
            { label: 'LLM Cypher 생성', icon: '🤖' },
            { label: '→', icon: '' },
            { label: 'Neo4j 실행', icon: '🗄️' },
            { label: '→', icon: '' },
            { label: '오류 확인', icon: '❓' },
            { label: '→', icon: '' },
            { label: 'LLM 수정', icon: '🔄' },
            { label: '→', icon: '' },
            { label: '재실행 (최대 3회)', icon: '✅' },
          ].map((step, idx) => (
            <span
              key={idx}
              className={step.icon ? 'text-xs px-3 py-2 rounded-lg font-medium' : 'text-lg'}
              style={step.icon ? {
                background: 'rgba(14,165,233,0.08)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(14,165,233,0.15)',
              } : {
                color: 'var(--text-dim)',
              }}
            >
              {step.icon && <span className="mr-1">{step.icon}</span>}
              {step.label}
            </span>
          ))}
        </div>
        <Callout type="tip">
          <strong>팁:</strong> Agent 방식에서 오류 메시지를 LLM에 그대로 전달하면 수정 성공률이 크게 올라갑니다.
          Neo4j 에러 메시지에는 정확한 위치와 원인이 포함되어 있기 때문입니다.
        </Callout>
      </section>

      <section>
        <h4
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--accent-cyan)' }}
        >
          Few-shot 예제 선정법
        </h4>
        <div className="space-y-3">
          {[
            {
              num: '1',
              title: '다양한 쿼리 패턴 포함',
              description: '단일 노드 조회, 관계 탐색, 집계, 경로 탐색 등 패턴별로 골고루 포함합니다.',
            },
            {
              num: '2',
              title: '자주 묻는 질문 우선',
              description: '실제 사용자 로그에서 가장 빈도 높은 질문 유형을 우선 선택합니다.',
            },
            {
              num: '3',
              title: '엣지 케이스 포함',
              description: 'NULL 처리, OPTIONAL MATCH, 집계 함수 등 틀리기 쉬운 패턴을 반드시 포함합니다.',
            },
            {
              num: '4',
              title: '난이도별 분류',
              description: '1-hop 단순 질문부터 3-hop 복합 질문까지 난이도를 구분하여 예제를 구성합니다.',
            },
            {
              num: '5',
              title: '자연어 변형 포함',
              description: '같은 의도의 질문을 다양한 표현으로 포함합니다. (예: "원인은?" = "왜 발생했나요?" = "뭐 때문에?")',
            },
          ].map((item) => (
            <div
              key={item.num}
              className="flex gap-4 p-4 rounded-lg"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                style={{
                  background: 'var(--accent-cyan)',
                  color: 'var(--bg-primary)',
                }}
              >
                {item.num}
              </div>
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

      <Callout type="warn">
        <strong>주의:</strong> Few-shot 예제가 10개를 넘으면 오히려 성능이 떨어질 수 있습니다.
        5~8개의 고품질 예제가 최적입니다. 토큰 소비도 고려하세요.
      </Callout>
    </div>
  );
}
