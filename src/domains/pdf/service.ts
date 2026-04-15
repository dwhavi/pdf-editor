// PDF Domain — Service (비즈니스 로직. GR-1: UI는 이 레이어만 호출)
import { loadPdfFromFile } from './repo';
import { usePdfStore } from './store';

let _pdfDocumentInstance: { numPages: number } | null = null;

export function getPdfDocumentInstance() {
  return _pdfDocumentInstance;
}

export async function openPdfFile(file: File): Promise<void> {
  const store = usePdfStore.getState();
  store.setStatus('loading');
  try {
    const { name, arrayBuffer } = await loadPdfFromFile(file);
    // numPages는 react-pdf 렌더링 후 onDocumentLoadSuccess 콜백으로 설정됨
    store.setDocument({ id: crypto.randomUUID(), name, numPages: 0, arrayBuffer });
    store.setStatus('loaded');
  } catch (err) {
    console.error('[PDF Service] 리포지토리 로드 실패:', err);
    const message = err instanceof Error ? err.message : '알 수 없는 오류';
    store.setStatus('error', message);
  }
}

export function updateNumPages(numPages: number): void {
  const store = usePdfStore.getState();
  if (!store.document) return;
  store.setDocument({ ...store.document, numPages });
}

export function goToPage(page: number): void {
  usePdfStore.getState().setPage(page);
}

export function zoomIn(): void {
  usePdfStore.getState().zoomIn();
}

export function zoomOut(): void {
  usePdfStore.getState().zoomOut();
}

export function setZoom(zoom: number): void {
  usePdfStore.getState().setZoom(zoom);
}

export function closePdf(): void {
  usePdfStore.getState().reset();
}
