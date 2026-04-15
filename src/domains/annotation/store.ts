// Annotation Domain — Store
import { create } from 'zustand';
import type { Annotation, AnnotationState } from './types';

interface AnnotationActions {
  addAnnotation: (a: Annotation) => void;
  updateAnnotation: (id: string, patch: Partial<Annotation>) => void;
  removeAnnotation: (id: string) => void;
  selectAnnotation: (id: string | null) => void;
  clearPage: (page: number) => void;
  clearAll: () => void;
}

export const useAnnotationStore = create<AnnotationState & AnnotationActions>((set) => ({
  annotations: [],
  selectedId: null,

  addAnnotation: (a) =>
    set((s) => ({ annotations: [...s.annotations, a] })),

  updateAnnotation: (id, patch) =>
    set((s) => ({
      annotations: s.annotations.map((a) =>
        a.id === id ? ({ ...a, ...patch } as Annotation) : a
      ),
    })),

  removeAnnotation: (id) =>
    set((s) => ({ annotations: s.annotations.filter((a) => a.id !== id) })),

  selectAnnotation: (id) => set({ selectedId: id }),

  clearPage: (page) =>
    set((s) => ({ annotations: s.annotations.filter((a) => a.page !== page) })),

  clearAll: () => set({ annotations: [], selectedId: null }),
}));
