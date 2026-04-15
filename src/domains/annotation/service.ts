// Annotation Domain — Service
import { useAnnotationStore } from './store';
import type { Annotation, AnnotationTool } from './types';

export function addAnnotation(a: Annotation): void {
  useAnnotationStore.getState().addAnnotation(a);
}

export function removeAnnotation(id: string): void {
  useAnnotationStore.getState().removeAnnotation(id);
}

export function selectAnnotation(id: string | null): void {
  useAnnotationStore.getState().selectAnnotation(id);
}

export function clearAllAnnotations(): void {
  useAnnotationStore.getState().clearAll();
}

export function getAnnotationsForPage(page: number): Annotation[] {
  return useAnnotationStore.getState().annotations.filter((a) => a.page === page);
}

export function createAnnotationId(): string {
  return crypto.randomUUID();
}

export const TOOL_LABELS: Record<AnnotationTool, string> = {
  select: '선택',
  highlight: '하이라이트',
  draw: '그리기',
  note: '노트',
  text: '텍스트',
  rect: '사각형',
  eraser: '지우개',
};
