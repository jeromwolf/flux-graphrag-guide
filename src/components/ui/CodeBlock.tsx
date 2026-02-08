interface CodeBlockProps {
  language: string;
  code: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ language, code, showLineNumbers = false }: CodeBlockProps) {
  return (
    <div className="my-6 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between px-4 py-2" style={{
        background: 'rgba(0,0,0,0.02)',
        borderBottom: '1px solid var(--border)',
      }}>
        <span className="font-mono text-xs font-medium tracking-wider" style={{ color: 'var(--accent-cyan)' }}>
          {language}
        </span>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-red)' }} />
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-yellow)' }} />
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-cyan)' }} />
        </div>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-sm leading-relaxed" style={{
        background: 'var(--bg-code)',
        color: '#334155',
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
