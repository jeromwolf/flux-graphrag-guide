'use client';

interface StageProgressProps {
  currentStage: number;
  stages: { stage: number; name: string; nodes: string }[];
}

export function StageProgress({ currentStage, stages }: StageProgressProps) {
  return (
    <div className="py-8">
      <div className="relative">
        {/* Progress line */}
        <div
          className="absolute top-4 left-0 right-0 h-0.5"
          style={{
            background: 'var(--border)',
            zIndex: 0,
          }}
        />
        <div
          className="absolute top-4 left-0 h-0.5 transition-all duration-500"
          style={{
            background: 'var(--accent-cyan)',
            width: `${(currentStage / (stages.length - 1)) * 100}%`,
            zIndex: 0,
          }}
        />

        {/* Stage markers */}
        <div className="relative flex justify-between" style={{ zIndex: 1 }}>
          {stages.map((stage) => {
            const isCompleted = stage.stage < currentStage;
            const isCurrent = stage.stage === currentStage;
            const isFuture = stage.stage > currentStage;

            return (
              <div key={stage.stage} className="flex flex-col items-center" style={{ flex: 1 }}>
                {/* Circle */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300"
                  style={{
                    background: isCompleted || isCurrent ? 'var(--accent-cyan)' : 'var(--bg-card)',
                    border: `2px solid ${
                      isCompleted || isCurrent ? 'var(--accent-cyan)' : 'var(--border)'
                    }`,
                    color: isCompleted || isCurrent ? 'var(--bg-primary)' : 'var(--text-dim)',
                    boxShadow: isCurrent
                      ? '0 0 0 4px rgba(14,165,233,0.2)'
                      : 'none',
                    animation: isCurrent ? 'pulse 2s ease-in-out infinite' : 'none',
                  }}
                >
                  {isCompleted ? '✓' : stage.stage}
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <div
                    className="text-sm font-semibold"
                    style={{
                      color: isCurrent
                        ? 'var(--accent-cyan)'
                        : isFuture
                        ? 'var(--text-dim)'
                        : 'var(--text-secondary)',
                    }}
                  >
                    {stage.name}
                  </div>
                  <div
                    className="text-xs mt-1 px-2 py-0.5 rounded-full inline-block"
                    style={{
                      background: isCurrent
                        ? 'rgba(14,165,233,0.1)'
                        : 'rgba(0,0,0,0.02)',
                      color: 'var(--text-dim)',
                    }}
                  >
                    {stage.nodes}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(14,165,233,0.2);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(14,165,233,0.1);
          }
        }
      `}</style>
    </div>
  );
}
