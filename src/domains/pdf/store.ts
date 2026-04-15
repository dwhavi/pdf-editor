// PDF Domain — Store (Zustand)
import { create } from 'zustand';
import type { PdfState, PageViewport } from './types';
import { PDF_CONFIG } from './config';

interface PdfActions {
  setDocument: (doc: PdfState['document']) => void;
  setStatus: (status: PdfState['status'], error?: string) => void;
  setPage: (page: number) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
}

const defaultViewport: PageViewport = {
  currentPage: PDF_CONFIG.page.default,
  totalPages: 0,
  zoom: PDF_CONFIG.zoom.default,
};

export const usePdfStore = create<PdfState & PdfActions>((set, get) => ({
  document: null,
  viewport: defaultViewport,
  status: 'idle',
  error: null,

  setDocument: (doc) =>
    set({
      document: doc,
      viewport: {
        ...defaultViewport,
        totalPages: doc?.numPages ?? 0,
      },
    }),

  setStatus: (status, error?: string) => set({ status, error: error ?? null }),

  setPage: (page) =>
    set((s) => ({
      viewport: {
        ...s.viewport,
        currentPage: Math.max(1, Math.min(page, s.viewport.totalPages)),
      },
    })),

  setZoom: (zoom) =>
    set((s) => ({
      viewport: {
        ...s.viewport,
        zoom: Math.max(PDF_CONFIG.zoom.min, Math.min(PDF_CONFIG.zoom.max, zoom)),
      },
    })),

  zoomIn: () => {
    const { viewport } = get();
    set((s) => ({
      viewport: {
        ...s.viewport,
        zoom: Math.min(viewport.zoom + PDF_CONFIG.zoom.step, PDF_CONFIG.zoom.max),
      },
    }));
  },

  zoomOut: () => {
    const { viewport } = get();
    set((s) => ({
      viewport: {
        ...s.viewport,
        zoom: Math.max(viewport.zoom - PDF_CONFIG.zoom.step, PDF_CONFIG.zoom.min),
      },
    }));
  },

  reset: () => set({ document: null, viewport: defaultViewport, status: 'idle', error: null }),
}));
