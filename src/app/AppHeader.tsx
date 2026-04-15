// AppHeader — with download + theme toggle
import { useState, useCallback } from 'react';
import { usePdfStore } from '@/domains/pdf/store';
import { closePdf } from '@/domains/pdf/service';
import { clearAllAnnotations } from '@/domains/annotation/service';
import { exportPdfWithAnnotations } from '@/domains/pdf/exportService';

interface Props {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function AppHeader({ theme, onToggleTheme }: Props) {
  const { document: pdfDoc, status } = usePdfStore();
  const [exporting, setExporting] = useState(false);

  const handleClose = () => {
    closePdf();
    clearAllAnnotations();
  };

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      await exportPdfWithAnnotations();
    } catch (err) {
      alert(err instanceof Error ? err.message : '내보내기 실패');
    } finally {
      setExporting(false);
    }
  }, []);

  return (
    <header className="app-header" id="app-header">
      <div className="app-header__brand">
        <div className="app-header__brand-icon">📄</div>
        PDF Editor
      </div>

      {pdfDoc && (
        <span className="app-header__doc-name truncate" title={pdfDoc.name}>
          {pdfDoc.name}
        </span>
      )}

      <div className="app-header__controls">
        {status === 'loading' && (
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            로딩 중…
          </span>
        )}

        {pdfDoc && (
          <>
            <button
              id="btn-export-pdf"
              className="btn btn-primary"
              onClick={handleExport}
              disabled={exporting}
              title="어노테이션 포함 PDF 다운로드"
            >
              {exporting ? '⏳ 내보내는 중…' : '⬇ PDF 저장'}
            </button>
            <button
              id="btn-close-pdf"
              className="btn btn-ghost"
              onClick={handleClose}
              title="PDF 닫기"
            >
              ✕ 닫기
            </button>
          </>
        )}

        <button
          id="btn-toggle-theme"
          className="btn btn-ghost"
          onClick={onToggleTheme}
          title={theme === 'dark' ? '라이트 모드' : '다크 모드'}
          style={{ fontSize: '18px', padding: '6px 10px' }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
