interface ScriptBlockProps {
  children: React.ReactNode;
}

export function ScriptBlock({ children }: ScriptBlockProps) {
  return (
    <div className="relative my-4 py-5 px-6 rounded-r-xl text-sm leading-loose" style={{
      background: 'linear-gradient(135deg, rgba(14,165,233,0.04), rgba(59,130,246,0.03))',
      borderLeft: '3px solid var(--accent-cyan)',
      color: 'var(--text-primary)',
    }}>
      <span className="absolute -top-2.5 left-3 text-[0.65rem] font-semibold px-2 tracking-wider rounded" style={{
        background: 'var(--bg-card)',
        color: 'var(--accent-cyan)',
      }}>
        🎤 대본
      </span>
      {children}
    </div>
  );
}
