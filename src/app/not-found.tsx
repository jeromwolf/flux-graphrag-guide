import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-6" style={{ color: 'var(--accent-cyan)' }}>404</div>
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-xl font-semibold transition-transform hover:scale-105"
        style={{ background: 'var(--accent-cyan)', color: '#ffffff' }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
