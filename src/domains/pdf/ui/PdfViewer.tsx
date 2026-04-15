import { useState, useCallback, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { usePdfStore } from '@/domains/pdf/store';
import { updateNumPages } from '@/domains/pdf/service';
import { AnnotationCanvas } from '@/domains/annotation/ui/AnnotationCanvas';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfViewer() {
  const { document: pdfDoc, viewport, status } = usePdfStore();
  const [pageSize, setPageSize] = useState({ width: 800, height: 1000 });

  // react-pdf requires memoized file object to avoid infinite reloads
  const pdfFile = useMemo(() => (pdfDoc ? { data: pdfDoc.arrayBuffer } : null), [pdfDoc?.id]);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      // Prevent infinite loop by checking if numPages actually changed
      const currentDoc = usePdfStore.getState().document;
      if (currentDoc && currentDoc.numPages !== numPages) {
        updateNumPages(numPages);
      }
    },
    []
  );

  const onPageLoadSuccess = useCallback((page: { width: number; height: number }) => {
    // Prevent infinite loop by avoiding new object creation if size hasn't changed
    setPageSize((prev) => 
      prev.width === page.width && prev.height === page.height 
        ? prev 
        : { width: page.width, height: page.height }
    );
  }, []);

  if (!pdfDoc || !pdfFile) return null;

  const scale = viewport.zoom;

  return (
    <div className="pdf-canvas-area" id="pdf-canvas-area">
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="status-overlay">
            <div className="spinner" />
            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              PDF 로딩 중…
            </span>
          </div>
        }
        error={
          <div className="status-overlay">
            <span className="error-msg">{status === 'error' && usePdfStore.getState().error ? usePdfStore.getState().error : 'PDF를 로드할 수 없습니다.'}</span>
          </div>
        }
      >
        <div
          className="pdf-page-wrapper"
          style={{
            width: pageSize.width * scale,
            height: pageSize.height * scale,
          }}
        >
          <Page
            pageNumber={viewport.currentPage}
            scale={scale}
            onLoadSuccess={onPageLoadSuccess}
            renderTextLayer
            renderAnnotationLayer={false}
          />
          <AnnotationCanvas
            page={viewport.currentPage}
            width={pageSize.width * scale}
            height={pageSize.height * scale}
          />
        </div>
      </Document>

      {status === 'loading' && (
        <div className="status-overlay" style={{ position: 'absolute', inset: 0 }}>
          <div className="spinner" />
        </div>
      )}
    </div>
  );
}
