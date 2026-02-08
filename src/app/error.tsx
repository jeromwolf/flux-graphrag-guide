'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="text-5xl mb-6">⚠️</div>
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        오류가 발생했습니다
      </h1>
      <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
        {error.message || '예상치 못한 오류가 발생했습니다. 다시 시도해주세요.'}
      </p>
      <button
        onClick={reset}
        className="px-6 py-2.5 rounded-xl font-semibold transition-transform hover:scale-105"
        style={{ background: 'var(--accent-cyan)', color: '#ffffff' }}
      >
        다시 시도
      </button>
    </div>
  );
}
