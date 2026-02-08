interface VisualBlockProps {
  children: React.ReactNode;
}

export function VisualBlock({ children }: VisualBlockProps) {
  return (
    <div className="my-4 p-4 rounded-lg" style={{
      background: 'var(--bg-secondary)',
      border: '1px dashed var(--border)',
    }}>
      <div className="text-[0.7rem] font-semibold uppercase tracking-widest mb-2" style={{
        color: 'var(--accent-orange)',
      }}>
        📺 화면 구성
      </div>
      <div className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
}
