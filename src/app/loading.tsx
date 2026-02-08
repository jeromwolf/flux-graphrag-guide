export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 animate-spin mb-4"
        style={{
          borderColor: 'var(--border)',
          borderTopColor: 'var(--accent-cyan)',
        }}
      />
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        로딩 중...
      </p>
    </div>
  );
}
