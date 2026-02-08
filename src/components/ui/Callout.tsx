type CalloutType = 'key' | 'tip' | 'warn';

interface CalloutProps {
  type: CalloutType;
  children: React.ReactNode;
}

const calloutStyles: Record<CalloutType, { bg: string; border: string; color: string }> = {
  key: {
    bg: 'rgba(14,165,233,0.08)',
    border: 'rgba(14,165,233,0.3)',
    color: 'var(--accent-cyan)',
  },
  tip: {
    bg: 'rgba(14,165,233,0.06)',
    border: 'rgba(14,165,233,0.15)',
    color: 'var(--accent-cyan)',
  },
  warn: {
    bg: 'rgba(239,68,68,0.06)',
    border: 'rgba(239,68,68,0.15)',
    color: 'var(--accent-red)',
  },
};

export function Callout({ type, children }: CalloutProps) {
  const style = calloutStyles[type];
  return (
    <div className="my-6 p-4 rounded-xl text-sm leading-relaxed" style={{
      background: style.bg,
      border: `1px solid ${style.border}`,
      color: style.color,
    }}>
      {children}
    </div>
  );
}
