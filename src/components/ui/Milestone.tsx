interface MilestoneProps {
  title: string;
  children: React.ReactNode;
}

export function Milestone({ title, children }: MilestoneProps) {
  return (
    <div className="my-8 p-6 md:p-8 rounded-2xl text-center" style={{
      background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(59,130,246,0.06))',
      border: '1px solid rgba(14,165,233,0.25)',
    }}>
      <div className="text-4xl mb-3">🏆</div>
      <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--accent-cyan)' }}>
        {title}
      </h3>
      <div className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}
