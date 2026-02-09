import { Key, Lightbulb, AlertTriangle } from 'lucide-react';

type CalloutType = 'key' | 'tip' | 'warn';

interface CalloutProps {
  type: CalloutType;
  children: React.ReactNode;
}

const calloutConfig: Record<CalloutType, {
  icon: React.ReactNode;
  bg: string;
  border: string;
  text: string;
}> = {
  key: {
    icon: <Key className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />,
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-700',
  },
  tip: {
    icon: <Lightbulb className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />,
    bg: 'bg-sky-50/60',
    border: 'border-sky-100',
    text: 'text-sky-600',
  },
  warn: {
    icon: <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-600',
  },
};

export function Callout({ type, children }: CalloutProps) {
  const config = calloutConfig[type];
  return (
    <div className={`my-6 p-4 rounded-xl text-base leading-relaxed flex items-start gap-3 border ${config.bg} ${config.border} ${config.text}`}>
      {config.icon}
      <div>{children}</div>
    </div>
  );
}
