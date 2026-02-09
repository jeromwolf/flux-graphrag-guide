import type { Metadata } from 'next';
import Link from 'next/link';
import { Noto_Sans_KR, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import { BookOpen, Github } from 'lucide-react';
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
    <nav aria-label="메인 내비게이션" className="sticky top-0 z-50 border-b border-slate-200 bg-white/92 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <BookOpen className="w-5 h-5 text-sky-500 group-hover:text-sky-600 transition-colors" />
          <span className="text-xl font-bold gradient-text">
            GraphRAG Guide
          </span>
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/curriculum" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
            커리큘럼
          </Link>
          <Link href="/cases" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
            도메인 케이스
          </Link>
          <Link href="/guides" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
            실전 가이드
          </Link>
          <a
            href="https://github.com/jeromwolf/flux-graphrag-guide"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-700 transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-4 h-4 text-sky-500" />
          <span className="text-sm font-semibold text-slate-700">GraphRAG Guide</span>
          <span className="text-xs text-slate-400">· 깊이가 곧 가치</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <span>Root Bricks Co., Ltd.</span>
          <a href="https://fde-academy.ai.kr" className="hover:text-sky-600 transition-colors">
            FDE Academy
          </a>
          <a href="https://github.com/jeromwolf/flux-graphrag-guide" className="hover:text-sky-600 transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
