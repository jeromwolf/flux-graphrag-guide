import { curriculumMeta } from '@/data/curriculum-meta';
import { part1Content, type SlideContent, type SectionContent } from '@/data/part1-content';
import { part2Content } from '@/data/part2-content';
import { part3Content } from '@/data/part3-content';
import { part4Content } from '@/data/part4-content';
import { part5Content } from '@/data/part5-content';
import { part6Content } from '@/data/part6-content';
import { part7Content } from '@/data/part7-content';
import { CodeBlock } from '@/components/ui/CodeBlock';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Trophy, Clock, Signal, Target, ArrowRight, Monitor, Mic, Key, Lightbulb, AlertTriangle } from 'lucide-react';

const sectionGradients = [
  'from-sky-500 to-blue-500',
  'from-blue-500 to-violet-500',
  'from-violet-500 to-red-500',
  'from-amber-500 to-yellow-600',
  'from-sky-500 to-sky-600',
  'from-blue-500 to-sky-500',
];

const tagClasses: Record<string, string> = {
  theory: 'bg-blue-50 border-blue-200 text-blue-600',
  demo: 'bg-red-50 border-red-200 text-red-500',
  practice: 'bg-sky-50 border-sky-200 text-sky-600',
  discussion: 'bg-violet-50 border-violet-200 text-violet-600',
};

const calloutIcons: Record<string, React.ReactNode> = {
  key: <Key className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />,
  tip: <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />,
  warn: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
};

const calloutClasses: Record<string, string> = {
  key: 'bg-sky-50 border-sky-200 text-sky-700',
  tip: 'bg-blue-50 border-blue-100 text-blue-600',
  warn: 'bg-amber-50 border-amber-200 text-amber-700',
};

function CurriculumSlideCard({ slide }: { slide: SlideContent }) {
  return (
    <div className="mb-6 p-6 rounded-xl ring-card bg-white">
      {/* Tag and Title */}
      <div className="flex items-center gap-3 mb-4">
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase border ${tagClasses[slide.tag] || tagClasses.theory}`}>
          {slide.tag}
        </span>
        <h3 className="text-lg font-bold flex-1">{slide.title}</h3>
      </div>

      {/* Script */}
      <div className="mb-4 p-3 rounded-lg bg-sky-50/60 border-l-[3px] border-l-sky-500">
        <div className="flex items-center gap-1 text-sm font-semibold mb-1 text-sky-600">
          <Mic className="w-3.5 h-3.5" />
          대본
        </div>
        <div className="text-base leading-relaxed text-slate-700 space-y-2">
          {slide.script.split(/(?<=\.\s)(?=[A-Z가-힣"'"])/).reduce((paragraphs: string[], sentence) => {
            const lastIdx = paragraphs.length - 1;
            if (lastIdx < 0 || paragraphs[lastIdx].length > 120) {
              paragraphs.push(sentence);
            } else {
              paragraphs[lastIdx] += sentence;
            }
            return paragraphs;
          }, []).map((para, idx) => (
            <p key={idx}>{para.trim()}</p>
          ))}
        </div>
      </div>

      {/* Visual */}
      {slide.visual && (
        <div className="mb-4 p-3 rounded-lg border border-dashed border-slate-200">
          <div className="flex items-center gap-1 text-sm font-semibold mb-1 text-amber-600">
            <Monitor className="w-3.5 h-3.5" />
            화면 구성
          </div>
          <p className="text-sm italic text-slate-500">
            {slide.visual}
          </p>
        </div>
      )}

      {/* Code */}
      {slide.code && (
        <CodeBlock language={slide.code.language} code={slide.code.code} />
      )}

      {/* Table */}
      {slide.table && (
        <div className="mb-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {slide.table.headers.map((h, i) => (
                  <th key={i} className="px-3 py-2 text-left font-semibold bg-slate-50 border-b-2 border-slate-200 text-slate-700">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slide.table.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.cells.map((cell, ci) => {
                    const statusClasses: Record<string, string> = {
                      pass: 'bg-emerald-50 text-emerald-700',
                      fail: 'bg-red-50 text-red-600',
                      warn: 'bg-amber-50 text-amber-700',
                    };
                    const statusClass = cell.status ? statusClasses[cell.status] || '' : '';
                    return (
                      <td key={ci} className={`px-3 py-2 border-b border-slate-100 ${cell.bold ? 'font-semibold' : ''} ${statusClass || (cell.bold ? 'text-slate-800' : 'text-slate-700')}`}>
                        {cell.text}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Diagram */}
      {slide.diagram && (
        <div className="mb-4 p-4 rounded-lg bg-blue-50/50 border border-blue-100">
          <div className="flex flex-wrap gap-2 items-center justify-center">
            {slide.diagram.nodes.flatMap((node, i) => {
              const nodeClasses: Record<string, string> = {
                entity: 'bg-sky-100 border-sky-200 text-sky-700 font-semibold',
                relation: 'bg-amber-50 border-amber-200 text-amber-700',
                fail: 'bg-red-50 border-red-200 text-red-500',
                dim: 'bg-slate-50 border-slate-100 text-slate-500 text-xs',
              };
              const prevNode = i > 0 ? slide.diagram!.nodes[i - 1] : null;
              const showArrow = i > 0 && node.type !== 'dim' && prevNode?.type !== 'dim';
              const elements = [];
              if (showArrow) {
                elements.push(
                  <span key={`arrow-${i}`} className="text-slate-400 text-lg mx-1">{'\u2192'}</span>
                );
              }
              elements.push(
                <div key={i} className={`px-3 py-1.5 rounded-lg text-sm border ${nodeClasses[node.type] || nodeClasses.dim}`}>
                  {node.text}
                </div>
              );
              return elements;
            })}
          </div>
        </div>
      )}

      {/* Callout */}
      {slide.callout && (
        <div className={`p-3 rounded-lg flex items-start gap-2 border ${calloutClasses[slide.callout.type] || calloutClasses.key}`}>
          {calloutIcons[slide.callout.type]}
          <p className="text-sm leading-relaxed flex-1">
            {slide.callout.text}
          </p>
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(14,165,233,0.06)_0%,transparent_50%),radial-gradient(ellipse_at_70%_30%,rgba(59,130,246,0.05)_0%,transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-sky-50 border border-sky-200 text-sky-600">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-sky-500" />
            Part {meta.part} of 7 · {meta.subtitle}
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-1 gradient-text" style={{ fontFamily: 'var(--font-title)', lineHeight: 1.15 }}>
            {meta.title}
          </h1>
          <p className="text-lg mb-6 text-slate-700 font-light">
            Knowledge Graph + GraphRAG 실무 완성 과정
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="inline-flex items-center gap-1.5 text-base text-slate-700">
              <Clock className="w-4 h-4 text-slate-500" />
              <strong className="text-slate-800">{meta.duration}</strong>
            </div>
            <div className="inline-flex items-center gap-1.5 text-base text-slate-500">
              <Signal className="w-4 h-4" />
              Lv.{meta.difficulty}
            </div>
            <div className="inline-flex items-center gap-1.5 text-base text-slate-700">
              <Target className="w-4 h-4 text-slate-500" />
              <strong className="text-slate-800">{meta.milestone.split('(')[0].trim()}</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl ring-card bg-white border-l-[3px] border-l-sky-500">
            <strong className="text-base text-sky-600 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              Part {meta.part} 목표
            </strong><br />
            <span className="text-base text-slate-800">{meta.description}</span>
          </div>
        </div>
      </header>

      {/* Timeline Nav */}
      <nav className="sticky top-16 z-40 overflow-x-auto bg-white/92 backdrop-blur-xl border-b border-slate-200">
        <div className="flex max-w-4xl mx-auto px-4">
          {meta.sections.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="flex-1 min-w-[120px] py-3 px-2 text-center text-sm font-medium whitespace-nowrap transition-colors text-slate-700 hover:text-sky-600 border-b-2 border-transparent hover:border-sky-500"
            >
              {sec.title}
              <span className="block text-xs font-mono mt-0.5 text-slate-500">
                {sec.time}
              </span>
            </a>
          ))}
        </div>
      </nav>

      {/* Sections */}
      <main className="max-w-4xl mx-auto px-6">
        {meta.sections.map((sec, idx) => (
          <section key={sec.id} id={sec.id} className={`py-12 ${idx < meta.sections.length - 1 ? 'border-b border-slate-200' : ''}`}>
            <div className="flex items-start gap-4 mb-8">
              <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl font-mono font-semibold text-white bg-gradient-to-br ${sectionGradients[idx] || sectionGradients[0]}`}>
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{sec.title}</h2>
                <div className="flex items-center gap-1 text-base font-mono mt-1 text-slate-500">
                  <Clock className="w-4 h-4" />
                  {sec.time}
                </div>
              </div>
            </div>

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
        <div className="my-12 p-6 md:p-8 rounded-2xl text-center bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200">
          <Trophy className="w-8 h-8 text-sky-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold mb-3 text-sky-600">
            Part {meta.part} Milestone 달성!
          </h3>
          <p className="text-base text-slate-500">
            {meta.milestone}
          </p>
        </div>

        {/* Next Preview */}
        {meta.nextPreview && (
          <Link
            href={`/curriculum/part${meta.part + 1}`}
            className="block my-8 p-6 rounded-2xl transition-all hover:-translate-y-0.5 ring-card ring-card-hover bg-white"
          >
            <div className="flex items-center gap-4">
              <ArrowRight className="w-7 h-7 text-violet-500" />
              <div>
                <h4 className="text-base font-semibold mb-1 text-violet-600">
                  다음 Part
                </h4>
                <p className="text-lg font-bold">{meta.nextPreview.title}</p>
                <p className="text-base mt-1 text-slate-500">
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
              className="flex-1 p-4 rounded-xl transition-all hover:-translate-y-0.5 ring-card bg-white"
            >
              <div className="text-sm mb-1 text-slate-400">
                ← 이전 Part
              </div>
              <div className="text-base font-bold text-slate-800">
                Part {meta.part - 1}: {curriculumMeta[meta.part - 2].title}
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {meta.part < 7 ? (
            <Link
              href={`/curriculum/part${meta.part + 1}`}
              className="flex-1 p-4 rounded-xl transition-all hover:-translate-y-0.5 text-right ring-card bg-white"
            >
              <div className="text-sm mb-1 text-slate-400">
                다음 Part →
              </div>
              <div className="text-base font-bold text-slate-800">
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
