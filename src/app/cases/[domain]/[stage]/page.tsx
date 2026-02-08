import { notFound } from 'next/navigation';
import Link from 'next/link';
import { domainsMeta } from '@/data/domain-meta';
import { ManufacturingStage0Interactive } from './ManufacturingStage0';
import { ManufacturingStage1Interactive } from './ManufacturingStage1';
import { ManufacturingStage2Interactive } from './ManufacturingStage2';
import { ManufacturingStage3Interactive } from './ManufacturingStage3';

export async function generateStaticParams() {
  const params: { domain: string; stage: string }[] = [];

  domainsMeta
    .filter((d) => d.status === 'active')
    .forEach((domain) => {
      domain.stages.forEach((stage) => {
        params.push({
          domain: domain.id,
          stage: `stage-${stage.stage}`,
        });
      });
    });

  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ domain: string; stage: string }> }) {
  const { domain: domainId, stage: stageSlug } = await params;
  const domain = domainsMeta.find((d) => d.id === domainId);

  if (!domain) return { title: 'Not Found' };

  const stageNum = parseInt(stageSlug.replace('stage-', ''), 10);
  const stage = domain.stages.find((s) => s.stage === stageNum);

  if (!stage) return { title: 'Not Found' };

  return {
    title: `${domain.name} Stage ${stage.stage}: ${stage.name} | GraphRAG Guide`,
    description: stage.milestone,
  };
}

export default async function StagePage({ params }: { params: Promise<{ domain: string; stage: string }> }) {
  const { domain: domainId, stage: stageSlug } = await params;
  const domain = domainsMeta.find((d) => d.id === domainId);

  if (!domain) notFound();

  const stageNum = parseInt(stageSlug.replace('stage-', ''), 10);
  const stage = domain.stages.find((s) => s.stage === stageNum);

  if (!stage) notFound();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Back Link */}
      <Link
        href={`/cases/${domain.id}`}
        className="inline-flex items-center gap-2 mb-8 text-sm hover:gap-3 transition-all"
        style={{ color: 'var(--accent-cyan)' }}
      >
        <span>←</span>
        <span>{domain.name} 도메인으로</span>
      </Link>

      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span
            className="text-sm font-mono px-3 py-1.5 rounded"
            style={{
              background: 'rgba(14,165,233,0.1)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(14,165,233,0.2)'
            }}
          >
            Stage {stage.stage}
          </span>
          <h1
            className="text-4xl md:text-5xl font-black gradient-text"
            style={{
              fontFamily: 'var(--font-title)',
            }}
          >
            {stage.name}
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-6">
          {domain.stages.map((s, idx) => (
            <div
              key={s.stage}
              className="flex-1 h-2 rounded-full transition-all"
              style={{
                background: s.stage <= stageNum ? 'var(--accent-cyan)' : 'var(--bg-secondary)',
              }}
            />
          ))}
        </div>

        {/* Milestone */}
        <div
          className="p-5 rounded-xl"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glow)',
          }}
        >
          <span className="text-xs font-mono" style={{ color: 'var(--accent-purple)' }}>
            마일스톤
          </span>
          <p className="text-lg font-semibold mt-2">{stage.milestone}</p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            {stage.curriculumParts} · 노드 {stage.nodes}
          </p>
        </div>
      </div>

      {/* Content */}
      {domainId === 'manufacturing' ? (
        <ManufacturingStageContent stageNum={stageNum} />
      ) : (
        <PlaceholderContent />
      )}
    </div>
  );
}

function ManufacturingStageContent({ stageNum }: { stageNum: number }) {
  switch (stageNum) {
    case 0: return <ManufacturingStage0Content />;
    case 1: return <ManufacturingStage1Interactive />;
    case 2: return <ManufacturingStage2Interactive />;
    case 3: return <ManufacturingStage3Interactive />;
    default: return <PlaceholderContent />;
  }
}

function ManufacturingStage0Content() {
  return (
    <>
      {/* Interactive Graph and Queries */}
      <ManufacturingStage0Interactive />


      {/* Ontology */}
      <section className="mb-12 mt-12">
        <h2 className="text-2xl font-bold mb-6">온톨로지</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div
            className="p-6 rounded-xl"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <h3 className="font-semibold mb-4" style={{ color: 'var(--accent-cyan)' }}>
              엔티티 타입 (5개)
            </h3>
            <div className="space-y-2">
              <EntityBadge type="Process" label="Process (공정)" />
              <EntityBadge type="Equipment" label="Equipment (설비)" />
              <EntityBadge type="Defect" label="Defect (결함)" />
              <EntityBadge type="Inspection" label="Inspection (검사)" />
              <EntityBadge type="Component" label="Component (부품)" />
            </div>
          </div>

          <div
            className="p-6 rounded-xl"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <h3 className="font-semibold mb-4" style={{ color: 'var(--accent-blue)' }}>
              관계 타입 (7개)
            </h3>
            <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p>• NEXT (순차 공정)</p>
              <p>• USES_EQUIPMENT (장비 사용)</p>
              <p>• USES_MATERIAL (자재 사용)</p>
              <p>• CAUSED_BY_PROCESS (공정 유발)</p>
              <p>• CAUSED_BY_EQUIPMENT (장비 유발)</p>
              <p>• DETECTED_AT (검출 위치)</p>
              <p>• INSPECTS (검사 대상)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-hop Tracking Highlight */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">3-hop 추적 상세</h2>
        <div
          className="p-6 rounded-xl"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glow)',
          }}
        >
          <div className="space-y-6">
            <HopStep
              number={1}
              from="결함: 접착 박리"
              relation="DETECTED_AT"
              to="검사: 전단강도 시험"
              description="결함이 어느 검사에서 발견되었는가?"
            />
            <HopStep
              number={2}
              from="검사: 전단강도 시험"
              relation="INSPECTS"
              to="공정: 열압착"
              description="해당 검사가 어느 공정을 검증하는가?"
            />
            <HopStep
              number={3}
              from="공정: 열압착"
              relation="USES_EQUIPMENT"
              to="설비: HP-01"
              description="해당 공정이 어느 설비를 사용하는가?"
            />
          </div>

          <div
            className="mt-6 p-4 rounded-lg"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)'
            }}
          >
            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--accent-cyan)' }}>
              결론
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              접착 박리 결함의 근본 원인은 <strong style={{ color: 'var(--accent-orange)' }}>HP-01 설비</strong>에서
              실행된 <strong style={{ color: 'var(--accent-cyan)' }}>열압착 공정</strong>입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Learning Points */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">학습 포인트</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div
            className="p-6 rounded-xl"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--accent-cyan)' }}>
              GraphRAG의 강점
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>• 3-hop 경로 탐색으로 근본 원인 추적</li>
              <li>• 명확한 인과 관계 체인 시각화</li>
              <li>• 구조화된 관계 기반 추론</li>
              <li>• LLM 없이도 정확한 답변 가능</li>
            </ul>
          </div>

          <div
            className="p-6 rounded-xl"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--accent-red)' }}>
              벡터 RAG의 한계
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>• 유사도 기반 검색만 가능</li>
              <li>• 다중 홉 관계 추적 불가</li>
              <li>• 인과관계 파악 어려움</li>
              <li>• 구조적 질의 표현 제한</li>
            </ul>
          </div>
        </div>

        <div
          className="mt-6 p-6 rounded-xl"
          style={{
            background: 'rgba(14,165,233,0.05)',
            border: '1px solid var(--border-glow)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--accent-cyan)' }}>핵심:</strong> 노드 7개뿐인 미니 그래프에서도
            의미 있는 추론이 가능합니다. Stage 1에서는 노드 35개로 확장하여 더 복잡한 시나리오를 다룹니다.
          </p>
        </div>
      </section>

      {/* File Downloads */}
      <section>
        <h2 className="text-2xl font-bold mb-6">실습 파일 다운로드</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <DownloadLink
            href="/data/manufacturing/mini_schema.yaml"
            title="mini_schema.yaml"
            description="온톨로지 정의 (엔티티 + 관계)"
          />
          <DownloadLink
            href="/data/manufacturing/mini_data.json"
            title="mini_data.json"
            description="7개 노드 데이터"
          />
          <DownloadLink
            href="/data/manufacturing/neo4j_load.cypher"
            title="neo4j_load.cypher"
            description="Neo4j 로드 스크립트"
          />
          <DownloadLink
            href="/data/manufacturing/first_query.cypher"
            title="first_query.cypher"
            description="5개 데모 쿼리 모음"
          />
        </div>
      </section>
    </>
  );
}

function PlaceholderContent() {
  return (
    <div
      className="p-12 rounded-xl text-center"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
    >
      <p className="text-xl font-semibold mb-2">콘텐츠 준비 중</p>
      <p style={{ color: 'var(--text-secondary)' }}>
        이 단계의 실습 콘텐츠는 곧 공개됩니다.
      </p>
    </div>
  );
}

// Component helpers
function EntityBadge({ type, label }: { type: string; label: string }) {
  const colors: Record<string, string> = {
    Process: 'var(--accent-cyan)',
    Equipment: 'var(--accent-blue)',
    Defect: 'var(--accent-red)',
    Inspection: 'var(--accent-purple)',
    Component: 'var(--accent-orange)',
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-full"
        style={{ background: colors[type] || colors.Process }}
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}

function HopStep({
  number,
  from,
  relation,
  to,
  description,
}: {
  number: number;
  from: string;
  relation: string;
  to: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
        style={{
          background: 'rgba(14,165,233,0.2)',
          color: 'var(--accent-cyan)',
          border: '2px solid var(--accent-cyan)'
        }}
      >
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold">{from}</span>
          <span className="text-xs px-2 py-0.5 rounded" style={{
            background: 'rgba(59,130,246,0.1)',
            color: 'var(--accent-blue)'
          }}>
            {relation}
          </span>
          <span className="text-sm font-semibold">{to}</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{description}</p>
      </div>
    </div>
  );
}

function DownloadLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <a
      href={href}
      className="p-4 rounded-xl transition-all hover:-translate-y-0.5"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        display: 'block',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">📄</span>
        <span className="font-mono text-sm font-semibold">{title}</span>
      </div>
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{description}</p>
    </a>
  );
}
