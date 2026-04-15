// Root App — assembles all domains, handles theme + keyboard shortcuts
import './app.css';
import { useState, useEffect } from 'react';
import { usePdfStore } from '@/domains/pdf/store';
import { AppHeader } from './AppHeader';
import { Toolbar } from '@/domains/toolbar/ui/Toolbar';
import { DropZone } from '@/domains/pdf/ui/DropZone';
import { PageControls } from '@/domains/pdf/ui/PageControls';
import { PdfViewer } from '@/domains/pdf/ui/PdfViewer';
import { useKeyboardShortcuts } from '@/utils/useKeyboardShortcuts';
import '@/domains/toolbar/ui/toolbar.css';

type Theme = 'dark' | 'light';

export function App() {
  const { document: pdfDoc, status, error } = usePdfStore();
  const hasPdf = !!pdfDoc;

  const [theme, setTheme] = useState<Theme>('dark');

  useKeyboardShortcuts();

  // Apply theme to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className="app-shell" id="app-shell">
      <AppHeader theme={theme} onToggleTheme={toggleTheme} />
      <Toolbar />

      <main className="app-main" id="app-main">
        {/* No PDF yet */}
        {!hasPdf && status !== 'loading' && status !== 'error' && (
          <DropZone />
        )}

        {/* Loading */}
        {status === 'loading' && !hasPdf && (
          <div className="status-overlay">
            <div className="spinner" />
            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              파일 읽는 중…
            </span>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="status-overlay">
            <span style={{ fontSize: '40px' }}>⚠️</span>
            <p className="error-msg">{error ?? 'PDF를 열 수 없습니다.'}</p>
            <button className="btn btn-ghost" onClick={() => usePdfStore.getState().reset()}>
              다시 시도
            </button>
          </div>
        )}

        {/* PDF loaded */}
        {hasPdf && (
          <>
            <PageControls />
            <PdfViewer />
          </>
        )}
      </main>
    </div>
  );
}
