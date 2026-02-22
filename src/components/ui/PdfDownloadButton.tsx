'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

interface PdfDownloadButtonProps {
  partNumber: number;
  partTitle: string;
}

export function PdfDownloadButton({ partNumber, partTitle }: PdfDownloadButtonProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    // Set document title for PDF filename
    const originalTitle = document.title;
    document.title = `Part${partNumber}_${partTitle}_GraphRAG`;

    window.print();

    // Restore title after print dialog
    document.title = originalTitle;
    setIsPrinting(false);
  };

  return (
    <button
      onClick={handlePrint}
      disabled={isPrinting}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white border border-slate-200 text-slate-700 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600 print:hidden"
      aria-label={`Part ${partNumber} PDF 저장`}
    >
      <Download className="w-4 h-4" />
      PDF 저장
    </button>
  );
}
