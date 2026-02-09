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
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 transition-all duration-500 bg-sky-600 z-0"
          style={{
            width: `${(currentStage / (stages.length - 1)) * 100}%`,
          }}
        />

        {/* Stage markers */}
        <div className="relative flex justify-between z-10">
          {stages.map((stage) => {
            const isCompleted = stage.stage < currentStage;
            const isCurrent = stage.stage === currentStage;
            const isFuture = stage.stage > currentStage;

            return (
              <div key={stage.stage} className="flex flex-col items-center flex-1">
                {/* Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted || isCurrent
                      ? 'bg-sky-600 border-2 border-sky-600 text-white'
                      : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}
                  style={{
                    boxShadow: isCurrent ? '0 0 0 4px rgba(14,165,233,0.2)' : 'none',
                    animation: isCurrent ? 'pulse 2s ease-in-out infinite' : 'none',
                  }}
                >
                  {isCompleted ? '✓' : stage.stage}
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <div
                    className={`text-sm font-semibold ${
                      isCurrent ? 'text-sky-600' : isFuture ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {stage.name}
                  </div>
                  <div
                    className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block text-slate-400 ${
                      isCurrent ? 'bg-sky-50' : 'bg-slate-50'
                    }`}
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
