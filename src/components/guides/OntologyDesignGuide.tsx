import { Callout } from '@/components/ui/Callout';

export default function OntologyDesignGuide() {
  return (
    <div className="border-t border-slate-200 p-6 space-y-6 bg-slate-50">
      <Callout type="warn">
        <strong>관계는 동사형으로!</strong> 명사형 관계는 나중에 혼란의 원인이 됩니다.
        <br />
        예: &quot;Connection&quot; (X) → &quot;CONNECTS_TO&quot; (O)
      </Callout>

      <section>
        <h4 className="text-xl font-bold mb-4 text-sky-600">
          9가지 관계 설계 패턴
        </h4>
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            style={{ borderCollapse: 'separate', borderSpacing: 0 }}
          >
            <thead>
              <tr>
                {['#', '관계 타입', '의미', '예시'].map((header) => (
                  <th
                    key={header}
                    className="text-left px-4 py-3 font-semibold bg-sky-50 border-b-2 border-b-sky-600 text-sky-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { num: '1', type: 'IS_A', meaning: '상위-하위', example: 'Process IS_A ManufacturingStep' },
                { num: '2', type: 'HAS_PART', meaning: '부분-전체', example: 'Equipment HAS_PART Sensor' },
                { num: '3', type: 'USES', meaning: '사용', example: 'Process USES Equipment' },
                { num: '4', type: 'PRODUCES', meaning: '생산', example: 'Process PRODUCES Component' },
                { num: '5', type: 'CAUSED_BY', meaning: '인과', example: 'Defect CAUSED_BY Process' },
                { num: '6', type: 'DETECTED_AT', meaning: '검출', example: 'Defect DETECTED_AT Inspection' },
                { num: '7', type: 'NEXT', meaning: '순차', example: 'Process NEXT Process' },
                { num: '8', type: 'BELONGS_TO', meaning: '소속', example: 'Person BELONGS_TO Department' },
                { num: '9', type: 'REFERENCES', meaning: '참조', example: 'Document REFERENCES Standard' },
              ].map((row) => (
                <tr
                  key={row.num}
                  className="border-b border-slate-200"
                >
                  <td className="px-4 py-3 font-bold text-sky-600">
                    {row.num}
                  </td>
                  <td className="px-4 py-3">
                    <code className="px-2 py-0.5 rounded text-xs font-mono bg-sky-50 text-sky-600">
                      {row.type}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {row.meaning}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-900">
                    {row.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h4 className="text-xl font-bold mb-4 text-sky-600">
          Prefix 표준화 전략
        </h4>
        <Callout type="tip">
          <strong>Prefix를 사용하면</strong> 노드 ID만으로 엔티티 유형을 즉시 파악할 수 있어 디버깅과 쿼리 작성이 훨씬 수월해집니다.
        </Callout>
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            style={{ borderCollapse: 'separate', borderSpacing: 0 }}
          >
            <thead>
              <tr>
                {['Prefix', '엔티티', '설명', '예시 ID'].map((header) => (
                  <th
                    key={header}
                    className="text-left px-4 py-3 font-semibold bg-sky-50 border-b-2 border-b-sky-600 text-sky-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { prefix: 'PRC-', entity: 'Process', desc: '공정', example: 'PRC-001' },
                { prefix: 'EQP-', entity: 'Equipment', desc: '설비', example: 'EQP-HP01' },
                { prefix: 'DEF-', entity: 'Defect', desc: '결함', example: 'DEF-042' },
                { prefix: 'INS-', entity: 'Inspection', desc: '검사', example: 'INS-A03' },
                { prefix: 'CMP-', entity: 'Component', desc: '부품', example: 'CMP-200' },
                { prefix: 'MTR-', entity: 'Material', desc: '자재', example: 'MTR-EP01' },
                { prefix: 'OPR-', entity: 'Operator', desc: '작업자', example: 'OPR-KIM' },
                { prefix: 'DOC-', entity: 'Document', desc: '문서', example: 'DOC-SPC01' },
                { prefix: 'STD-', entity: 'Standard', desc: '표준', example: 'STD-ISO9001' },
              ].map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-200"
                >
                  <td className="px-4 py-3">
                    <code className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-50 text-amber-700">
                      {row.prefix}
                    </code>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {row.entity}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {row.desc}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-sky-600">
                    {row.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h4 className="text-xl font-bold mb-4 text-sky-600">
          Meta-Dictionary 구조
        </h4>
        <p className="text-sm mb-4 text-slate-500">
          온톨로지를 체계적으로 관리하기 위한 메타 사전입니다. 모든 엔티티, 속성, 관계, 검증 규칙을 한 곳에서 관리합니다.
        </p>
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            style={{ borderCollapse: 'separate', borderSpacing: 0 }}
          >
            <thead>
              <tr>
                {['Entity Type', 'Properties', 'Relations', 'Validation Rules'].map((header) => (
                  <th
                    key={header}
                    className="text-left px-4 py-3 font-semibold bg-sky-50 border-b-2 border-b-sky-600 text-sky-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  entity: 'Process',
                  properties: 'name, type, temperature, duration',
                  relations: 'USES Equipment, PRODUCES Component',
                  rules: 'name: required, unique',
                },
                {
                  entity: 'Equipment',
                  properties: 'name, model, status, location',
                  relations: 'HAS_PART Sensor, BELONGS_TO Line',
                  rules: 'model: enum[A,B,C]',
                },
                {
                  entity: 'Defect',
                  properties: 'code, severity, description',
                  relations: 'CAUSED_BY Process, DETECTED_AT Inspection',
                  rules: 'severity: 1-5 range',
                },
                {
                  entity: 'Inspection',
                  properties: 'date, inspector, result',
                  relations: 'FOLLOWS Process, REFERENCES Standard',
                  rules: 'date: ISO 8601',
                },
              ].map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-200"
                >
                  <td className="px-4 py-3 font-bold text-sky-600">
                    {row.entity}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-900">
                    {row.properties}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {row.relations}
                  </td>
                  <td className="px-4 py-3 text-xs text-amber-700">
                    {row.rules}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h4 className="text-xl font-bold mb-4 text-sky-600">
          도메인별 온톨로지 템플릿
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              domain: '제조업',
              icon: '🏭',
              entities: 'Process, Equipment, Defect, Component',
              keyRelation: 'CAUSED_BY, DETECTED_AT',
            },
            {
              domain: '금융',
              icon: '🏦',
              entities: 'Account, Transaction, Customer, Risk',
              keyRelation: 'TRANSFERRED_TO, OWNED_BY',
            },
            {
              domain: '법률',
              icon: '⚖️',
              entities: 'Case, Clause, Regulation, Precedent',
              keyRelation: 'CITES, OVERRIDES',
            },
            {
              domain: 'IT 인프라',
              icon: '🖥️',
              entities: 'Server, Service, Incident, Config',
              keyRelation: 'DEPENDS_ON, TRIGGERED_BY',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-white ring-card"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{item.icon}</span>
                <span className="font-bold">{item.domain}</span>
              </div>
              <div className="text-xs space-y-1 text-slate-500">
                <div>
                  <span className="text-sky-600">엔티티:</span> {item.entities}
                </div>
                <div>
                  <span className="text-amber-700">핵심 관계:</span> {item.keyRelation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Callout type="key">
        <strong>핵심:</strong> 온톨로지는 &quot;완벽&quot;보다 &quot;일관성&quot;이 중요합니다. 팀 전체가 동일한 명명 규칙을 따르는 것이 최우선입니다.
      </Callout>
    </div>
  );
}
