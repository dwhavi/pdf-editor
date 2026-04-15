// Keyboard shortcuts hook
import { useEffect } from 'react';
import { useToolbarStore } from '@/domains/toolbar/store';
import { zoomIn, zoomOut, goToPage } from '@/domains/pdf/service';
import { usePdfStore } from '@/domains/pdf/store';
import type { AnnotationTool } from '@/domains/annotation/types';

const KEY_MAP: Record<string, AnnotationTool> = {
  v: 'select',
  h: 'highlight',
  d: 'draw',
  r: 'rect',
  n: 'note',
  t: 'text',
  e: 'eraser',
};

export function useKeyboardShortcuts() {
  const setTool = useToolbarStore((s) => s.setTool);

  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      // Skip if focus is inside an input/textarea
      const tag = (ev.target as HTMLElement).tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      const key = ev.key.toLowerCase();

      // Tool shortcuts
      if (KEY_MAP[key]) {
        ev.preventDefault();
        setTool(KEY_MAP[key]);
        return;
      }

      // Zoom
      if ((ev.metaKey || ev.ctrlKey) && key === '=') {
        ev.preventDefault();
        zoomIn();
      }
      if ((ev.metaKey || ev.ctrlKey) && key === '-') {
        ev.preventDefault();
        zoomOut();
      }

      // Page navigation
      const { viewport } = usePdfStore.getState();
      if (key === 'arrowleft' || key === 'arrowup') {
        ev.preventDefault();
        goToPage(viewport.currentPage - 1);
      }
      if (key === 'arrowright' || key === 'arrowdown') {
        ev.preventDefault();
        goToPage(viewport.currentPage + 1);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setTool]);
}
