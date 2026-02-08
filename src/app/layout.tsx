import type { Metadata } from 'next';
import Link from 'next/link';
import { Noto_Sans_KR, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-noto',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'GraphRAG Guide — 한국 GraphRAG 가이드',
    template: '%s | GraphRAG Guide',
  },
  description: '온톨로지 + GraphRAG 실무 완성 과정. 커리큘럼 + 도메인별 유스케이스로 GraphRAG를 체계적으로 학습합니다.',
  keywords: ['GraphRAG', 'Knowledge Graph', 'Neo4j', 'RAG', 'LLM', '온톨로지', '그래프DB'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`min-h-screen ${notoSansKR.variable} ${playfairDisplay.variable} ${jetbrainsMono.variable}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Navbar() {
  return (
    <nav aria-label="메인 내비게이션" className="sticky top-0 z-50 border-b" style={{
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px)',
      borderColor: 'var(--border)',
    }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold gradient-text">
            GraphRAG Guide
          </span>
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/curriculum" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            커리큘럼
          </Link>
          <Link href="/cases" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            도메인 케이스
          </Link>
          <Link href="/guides" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            실전 가이드
          </Link>
          <a
            href="https://github.com/topics/graphrag"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-4 py-1.5 rounded-full font-medium"
            style={{
              background: 'rgba(14,165,233,0.1)',
              border: '1px solid rgba(14,165,233,0.25)',
              color: 'var(--accent-cyan)',
            }}
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="py-12 text-center" style={{
      borderTop: '1px solid var(--border)',
      color: 'var(--text-dim)',
      fontSize: '0.8rem',
    }}>
      <p>깊이가 곧 가치 · Root Bricks Co., Ltd.</p>
      <p className="mt-1">
        <a href="https://fde-academy.ai.kr" style={{ color: 'var(--text-dim)' }}>
          FDE Academy
        </a>
        {' · '}
        <a href="#" style={{ color: 'var(--text-dim)' }}>AI ON 유튜브</a>
        {' · '}
        <a href="#" style={{ color: 'var(--text-dim)' }}>온톨로지 랩</a>
      </p>
    </footer>
  );
}
