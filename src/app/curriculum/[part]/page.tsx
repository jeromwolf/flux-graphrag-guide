import { curriculumMeta } from '@/data/curriculum-meta';
import { part1Content, type SlideContent, type SectionContent } from '@/data/part1-content';
import { part2Content } from '@/data/part2-content';
import { part3Content } from '@/data/part3-content';
import { part4Content } from '@/data/part4-content';
import { part5Content } from '@/data/part5-content';
import { part6Content } from '@/data/part6-content';
import { part7Content } from '@/data/part7-content';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const sectionNumberStyles = [
  'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
  'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
  'linear-gradient(135deg, var(--accent-purple), var(--accent-red))',
  'linear-gradient(135deg, var(--accent-orange), var(--accent-yellow))',
  'linear-gradient(135deg, var(--accent-cyan), #0ea5e9)',
  'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
];

const tagStyles = {
  theory: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', color: 'var(--accent-blue)' },
  demo: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', color: 'var(--accent-red)' },
  practice: { bg: 'rgba(14,165,233,0.1)', border: 'rgba(14,165,233,0.3)', color: 'var(--accent-cyan)' },
  discussion: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)', color: 'var(--accent-purple)' },
};

const calloutStyles = {
  key: { bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.3)', icon: '🔑', color: 'var(--accent-cyan)' },
  tip: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.3)', icon: '💡', color: 'var(--accent-blue)' },
  warn: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', icon: '⚠️', color: 'var(--accent-orange)' },
};

function CurriculumSlideCard({ slide }: { slide: SlideContent }) {
  const tagStyle = tagStyles[slide.tag];

  return (
    <div className="mb-6 p-6 rounded-xl" style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
    }}>
      {/* Tag and Title */}
      <div className="flex items-center gap-3 mb-4">
        <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-semibold uppercase" style={{
          background: tagStyle.bg,
          border: `1px solid ${tagStyle.border}`,
          color: tagStyle.color,
        }}>
          {slide.tag}
        </span>
        <h3 className="text-base font-bold flex-1">{slide.title}</h3>
      </div>

      {/* Script */}
      <div className="mb-4 p-3 rounded-lg" style={{
        background: 'rgba(14,165,233,0.04)',
        borderLeft: '3px solid var(--accent-cyan)',
      }}>
        <div className="text-xs font-semibold mb-1" style={{ color: 'var(--accent-cyan)' }}>
          🎤 대본
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {slide.script}
        </p>
      </div>

      {/* Visual */}
      {slide.visual && (
        <div className="mb-4 p-3 rounded-lg" style={{
          border: '1px dashed var(--border)',
        }}>
          <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-dim)' }}>
            📺 화면 구성
          </div>
          <p className="text-xs italic" style={{ color: 'var(--text-dim)' }}>
            {slide.visual}
          </p>
        </div>
      )}

      {/* Code */}
      {slide.code && (
        <div className="mb-4 rounded-lg overflow-hidden" style={{
          background: 'rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.02)',
        }}>
          <div className="px-3 py-1.5 text-xs font-mono" style={{
            background: 'rgba(0,0,0,0.03)',
            color: 'var(--text-dim)',
            borderBottom: '1px solid rgba(0,0,0,0.02)',
          }}>
            {slide.code.language}
          </div>
          <pre className="p-3 text-xs overflow-x-auto" style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
          }}>
            <code>{slide.code.code}</code>
          </pre>
        </div>
      )}

      {/* Table */}
      {slide.table && (
        <div className="mb-4 overflow-x-auto">
          <table className="w-full text-xs" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {slide.table.headers.map((h, i) => (
                  <th key={i} className="px-3 py-2 text-left font-semibold" style={{
                    background: 'rgba(0,0,0,0.02)',
                    borderBottom: '2px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slide.table.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.cells.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2" style={{
                      borderBottom: '1px solid var(--border)',
                      color: cell.bold ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: cell.bold ? 600 : 400,
                    }}>
                      {cell.text}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Diagram */}
      {slide.diagram && (
        <div className="mb-4 p-4 rounded-lg" style={{
          background: 'rgba(59,130,246,0.05)',
          border: '1px solid rgba(59,130,246,0.2)',
        }}>
          <div className="flex flex-wrap gap-2 items-center">
            {slide.diagram.nodes.map((node, i) => {
              const nodeStyles = {
                entity: { bg: 'rgba(14,165,233,0.15)', border: 'var(--accent-cyan)', color: 'var(--accent-cyan)' },
                relation: { bg: 'rgba(59,130,246,0.15)', border: 'var(--accent-blue)', color: 'var(--text-secondary)' },
                fail: { bg: 'rgba(239,68,68,0.15)', border: 'var(--accent-red)', color: 'var(--accent-red)' },
                dim: { bg: 'transparent', border: 'transparent', color: 'var(--text-dim)' },
              };
              const style = nodeStyles[node.type];

              return (
                <div key={i} className="px-2 py-1 rounded text-xs" style={{
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                  color: style.color,
                  fontWeight: node.type === 'entity' ? 600 : 400,
                }}>
                  {node.text}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Callout */}
      {slide.callout && (
        <div className="p-3 rounded-lg" style={{
          background: calloutStyles[slide.callout.type].bg,
          border: `1px solid ${calloutStyles[slide.callout.type].border}`,
        }}>
          <div className="flex items-start gap-2">
            <span className="text-base">{calloutStyles[slide.callout.type].icon}</span>
            <p className="text-xs leading-relaxed flex-1" style={{
              color: calloutStyles[slide.callout.type].color,
            }}>
              {slide.callout.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  return curriculumMeta.map((part) => ({
    part: `part${part.part}`,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ part: string }> }) {
  const { part: partSlug } = await params;
  const partNum = parseInt(partSlug.replace('part', ''));
  const meta = curriculumMeta.find((p) => p.part === partNum);
  if (!meta) return { title: 'Not Found' };
  return {
    title: `Part ${meta.part}: ${meta.title}`,
    description: meta.description,
  };
}

const contentMap: Record<number, SectionContent[]> = {
  1: part1Content,
  2: part2Content,
  3: part3Content,
  4: part4Content,
  5: part5Content,
  6: part6Content,
  7: part7Content,
};

export default async function PartPage({ params }: { params: Promise<{ part: string }> }) {
  const { part: partSlug } = await params;
  const partNum = parseInt(partSlug.replace('part', ''));
  const meta = curriculumMeta.find((p) => p.part === partNum);

  if (!meta) notFound();

  return (
    <div>
      {/* Hero */}
      <header className="relative py-16 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(14,165,233,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(59,130,246,0.05) 0%, transparent 50%)',
        }} />
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4" style={{
            background: 'rgba(14,165,233,0.1)',
            border: '1px solid rgba(14,165,233,0.25)',
            color: 'var(--accent-cyan)',
          }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-cyan)' }} />
            Part {meta.part} of 7 · {meta.subtitle}
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-1 gradient-text" style={{
            fontFamily: 'var(--font-title)',
            lineHeight: 1.15,
          }}>
            {meta.title}
          </h1>
          <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)', fontWeight: 300 }}>
            Knowledge Graph + GraphRAG 실무 완성 과정
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
              ⏱ <strong style={{ color: 'var(--text-primary)' }}>{meta.duration}</strong>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              {'⭐'.repeat(meta.difficulty)}
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
              🎯 <strong style={{ color: 'var(--text-primary)' }}>{meta.milestone.split('(')[0].trim()}</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderLeft: '3px solid var(--accent-cyan)',
          }}>
            <strong style={{ color: 'var(--accent-cyan)' }}>🎯 Part {meta.part} 목표</strong><br />
            <span style={{ color: 'var(--text-primary)' }}>{meta.description}</span>
          </div>
        </div>
      </header>

      {/* Timeline Nav */}
      <nav className="sticky top-16 z-40 overflow-x-auto" style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="flex max-w-4xl mx-auto px-4">
          {meta.sections.map((sec, idx) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="flex-1 min-w-[120px] py-3 px-2 text-center text-[0.72rem] font-medium whitespace-nowrap transition-colors"
              style={{
                color: 'var(--text-dim)',
                borderBottom: '2px solid transparent',
              }}
            >
              {sec.title}
              <span className="block text-[0.65rem] font-mono mt-0.5" style={{ color: 'var(--text-dim)' }}>
                {sec.time}
              </span>
            </a>
          ))}
        </div>
      </nav>

      {/* Sections */}
      <main className="max-w-4xl mx-auto px-6">
        {meta.sections.map((sec, idx) => (
          <section key={sec.id} id={sec.id} className="py-12" style={{
            borderBottom: idx < meta.sections.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div className="flex items-start gap-4 mb-8">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl font-mono font-semibold text-white" style={{
                background: sectionNumberStyles[idx] || sectionNumberStyles[0],
              }}>
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div>
                <h2 className="text-xl font-bold">{sec.title}</h2>
                <div className="text-sm font-mono mt-1" style={{ color: 'var(--text-dim)' }}>
                  ⏱ {sec.time}
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              {(contentMap[partNum] || [])
                .find(s => s.sectionId === sec.id)
                ?.slides.map(slide => (
                  <CurriculumSlideCard key={slide.id} slide={slide} />
                ))
              }
            </div>
          </section>
        ))}

        {/* Milestone */}
        <div className="my-12 p-6 md:p-8 rounded-2xl text-center" style={{
          background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(59,130,246,0.06))',
          border: '1px solid rgba(14,165,233,0.25)',
        }}>
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--accent-cyan)' }}>
            Part {meta.part} Milestone 달성!
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {meta.milestone}
          </p>
        </div>

        {/* Next Preview */}
        {meta.nextPreview && (
          <Link
            href={`/curriculum/part${meta.part + 1}`}
            className="block my-8 p-6 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl" style={{ color: 'var(--accent-purple)' }}>👉</span>
              <div>
                <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--accent-purple)' }}>
                  다음 Part
                </h4>
                <p className="font-bold">{meta.nextPreview.title}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {meta.nextPreview.description}
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* Part Navigation */}
        <div className="my-12 flex items-center justify-between gap-4">
          {meta.part > 1 ? (
            <Link
              href={`/curriculum/part${meta.part - 1}`}
              className="flex-1 p-4 rounded-xl transition-all hover:-translate-y-0.5"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>
                ← 이전 Part
              </div>
              <div className="font-bold" style={{ color: 'var(--text-primary)' }}>
                Part {meta.part - 1}: {curriculumMeta[meta.part - 2].title}
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {meta.part < 7 ? (
            <Link
              href={`/curriculum/part${meta.part + 1}`}
              className="flex-1 p-4 rounded-xl transition-all hover:-translate-y-0.5 text-right"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>
                다음 Part →
              </div>
              <div className="font-bold" style={{ color: 'var(--text-primary)' }}>
                Part {meta.part + 1}: {curriculumMeta[meta.part].title}
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </main>
    </div>
  );
}
