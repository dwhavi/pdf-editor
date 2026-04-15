// Toolbar Domain — Types
import type { AnnotationTool } from '@/domains/annotation/types';

export interface ToolOption {
  color: string;
  strokeWidth: number;
  opacity: number;
  fontSize: number;
}

export interface ToolbarState {
  activeTool: AnnotationTool;
  options: ToolOption;
}
