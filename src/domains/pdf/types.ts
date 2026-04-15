// PDF Domain — Types
// GR-3: no `any`. GR-2: all external input parsed via Zod.

export interface PdfDocument {
  id: string;
  name: string;
  numPages: number;
  arrayBuffer: ArrayBuffer;
}

export interface PageViewport {
  currentPage: number;
  totalPages: number;
  zoom: number; // 0.5 – 3.0
}

export type PdfLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface PdfState {
  document: PdfDocument | null;
  viewport: PageViewport;
  status: PdfLoadStatus;
  error: string | null;
}
