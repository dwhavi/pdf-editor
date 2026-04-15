// Annotation Domain — Types
export type AnnotationTool = 'select' | 'highlight' | 'draw' | 'note' | 'text' | 'rect' | 'eraser';

export interface BaseAnnotation {
  id: string;
  page: number;
  tool: AnnotationTool;
  createdAt: number;
}

export interface HighlightAnnotation extends BaseAnnotation {
  tool: 'highlight';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
}

export interface DrawAnnotation extends BaseAnnotation {
  tool: 'draw';
  points: number[]; // [x1,y1,x2,y2,...]
  color: string;
  strokeWidth: number;
}

export interface NoteAnnotation extends BaseAnnotation {
  tool: 'note';
  x: number;
  y: number;
  text: string;
  color: string;
}

export interface TextAnnotation extends BaseAnnotation {
  tool: 'text';
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
}

export interface RectAnnotation extends BaseAnnotation {
  tool: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
}

export type Annotation =
  | HighlightAnnotation
  | DrawAnnotation
  | NoteAnnotation
  | TextAnnotation
  | RectAnnotation;

export interface AnnotationState {
  annotations: Annotation[];
  selectedId: string | null;
}
