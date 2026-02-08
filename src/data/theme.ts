export const colors = {
  bgPrimary: '#ffffff',
  bgSecondary: '#f8fafc',
  bgCard: '#ffffff',
  bgCardHover: '#f1f5f9',
  bgCode: '#f1f5f9',

  accent: '#0ea5e9',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  orange: '#f59e0b',
  red: '#ef4444',
  yellow: '#ca8a04',

  white: '#FFFFFF',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textDim: '#94a3b8',
  border: '#e2e8f0',
  borderGlow: 'rgba(14, 165, 233, 0.25)',
} as const;

export const fonts = {
  title: "'Playfair Display', serif",
  body: "'Noto Sans KR', sans-serif",
  code: "'JetBrains Mono', monospace",
} as const;

export const sectionColors = [
  colors.accent,   // Section 1 - cyan
  colors.blue,     // Section 2 - blue
  colors.purple,   // Section 3 - purple
  colors.orange,   // Section 4 - orange
  colors.accent,   // Section 5 - cyan (cycle)
  colors.blue,     // Section 6 - blue (cycle)
] as const;

export const tagStyles = {
  theory: { bg: 'rgba(59,130,246,0.15)', color: colors.blue, label: '📘 이론' },
  demo: { bg: 'rgba(239,68,68,0.15)', color: colors.red, label: '🔴 데모' },
  practice: { bg: 'rgba(14,165,233,0.15)', color: colors.accent, label: '🟢 실습' },
  discussion: { bg: 'rgba(139,92,246,0.15)', color: colors.purple, label: '💬 토론' },
} as const;

export type SlideTag = keyof typeof tagStyles;
