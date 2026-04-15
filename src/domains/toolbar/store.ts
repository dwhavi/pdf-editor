// Toolbar Domain — Store
import { create } from 'zustand';
import type { ToolbarState, ToolOption } from './types';
import type { AnnotationTool } from '@/domains/annotation/types';

interface ToolbarActions {
  setTool: (tool: AnnotationTool) => void;
  setOptions: (patch: Partial<ToolOption>) => void;
}

export const useToolbarStore = create<ToolbarState & ToolbarActions>((set) => ({
  activeTool: 'select',
  options: {
    color: '#6c63ff',
    strokeWidth: 3,
    opacity: 0.45,
    fontSize: 14,
  },
  setTool: (tool) => set({ activeTool: tool }),
  setOptions: (patch) =>
    set((s) => ({ options: { ...s.options, ...patch } })),
}));
