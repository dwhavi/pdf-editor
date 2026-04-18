// Annotation Canvas — Konva layer over PDF page
import { useRef, useCallback, useMemo } from 'react';
import { Stage, Layer, Line, Rect, Text, Group, Circle } from 'react-konva';
import type Konva from 'konva';
import { useAnnotationStore } from '@/domains/annotation/store';
import { useToolbarStore } from '@/domains/toolbar/store';
import { addAnnotation, createAnnotationId } from '@/domains/annotation/service';
import type {
  Annotation,
  DrawAnnotation,
  HighlightAnnotation,
  RectAnnotation,
  TextAnnotation,
  NoteAnnotation,
} from '@/domains/annotation/types';

interface Props {
  page: number;
  width: number;
  height: number;
}

export function AnnotationCanvas({ page, width, height }: Props) {
  const allAnnotations = useAnnotationStore((s) => s.annotations);
  const annotations = useMemo(() => allAnnotations.filter((a) => a.page === page), [allAnnotations, page]);
  
  const { activeTool, options } = useToolbarStore();
  const isDrawingRef = useRef(false);
  const currentIdRef = useRef<string | null>(null);

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (activeTool === 'select') return;
      const stage = e.target.getStage();
      if (!stage) return;
      const pos = stage.getPointerPosition();
      if (!pos) return;

      isDrawingRef.current = true;
      const id = createAnnotationId();
      currentIdRef.current = id;

      if (activeTool === 'draw') {
        const a: DrawAnnotation = {
          id,
          page,
          tool: 'draw',
          points: [pos.x, pos.y],
          color: options.color,
          strokeWidth: options.strokeWidth,
          createdAt: Date.now(),
        };
        addAnnotation(a);
      } else if (activeTool === 'highlight') {
        const a: HighlightAnnotation = {
          id,
          page,
          tool: 'highlight',
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 20,
          color: '#ffe632',
          opacity: options.opacity,
          createdAt: Date.now(),
        };
        addAnnotation(a);
      } else if (activeTool === 'rect') {
        const a: RectAnnotation = {
          id,
          page,
          tool: 'rect',
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          strokeColor: options.color,
          fillColor: options.color === '#ffffff' ? '#ffffff' : 'transparent',
          strokeWidth: options.strokeWidth,
          createdAt: Date.now(),
        };
        addAnnotation(a);
      } else if (activeTool === 'text') {
        const text = window.prompt('텍스트 내용을 입력하세요:');
        if (text) {
          const a: TextAnnotation = {
            id,
            page,
            tool: 'text',
            x: pos.x,
            y: pos.y,
            text,
            fontSize: options.fontSize,
            color: options.color,
            createdAt: Date.now(),
          };
          addAnnotation(a);
        }
      } else if (activeTool === 'note') {
        const text = window.prompt('노트 내용을 입력하세요:');
        if (text) {
          const a: NoteAnnotation = {
            id,
            page,
            tool: 'note',
            x: pos.x,
            y: pos.y,
            text,
            color: options.color,
            createdAt: Date.now(),
          };
          addAnnotation(a);
        }
      }
    },
    [activeTool, page, options]
  );

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!isDrawingRef.current || !currentIdRef.current) return;
      const stage = e.target.getStage();
      if (!stage) return;
      const pos = stage.getPointerPosition();
      if (!pos) return;

      const id = currentIdRef.current;
      const store = useAnnotationStore.getState();
      const ann = store.annotations.find((a) => a.id === id);
      if (!ann) return;

      if (ann.tool === 'draw') {
        store.updateAnnotation(id, {
          points: [...(ann as DrawAnnotation).points, pos.x, pos.y],
        });
      } else if (ann.tool === 'highlight') {
        const h = ann as HighlightAnnotation;
        store.updateAnnotation(id, { width: pos.x - h.x });
      } else if (ann.tool === 'rect') {
        const r = ann as RectAnnotation;
        store.updateAnnotation(id, {
          width: pos.x - r.x,
          height: pos.y - r.y,
        });
      }
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    // Remove trivial zero-size annotations
    if (currentIdRef.current) {
      const store = useAnnotationStore.getState();
      const ann = store.annotations.find((a) => a.id === currentIdRef.current);
      if (ann) {
        if (ann.tool === 'draw' && (ann as DrawAnnotation).points.length < 4) {
          store.removeAnnotation(ann.id);
        } else if (
          (ann.tool === 'highlight' || ann.tool === 'rect') &&
          Math.abs((ann as HighlightAnnotation).width) < 5
        ) {
          store.removeAnnotation(ann.id);
        }
      }
    }
    isDrawingRef.current = false;
    currentIdRef.current = null;
  }, []);

  const handleAnnotationClick = useCallback(
    (ann: Annotation) => {
      const store = useAnnotationStore.getState();
      const { activeTool } = useToolbarStore.getState();

      if (activeTool === 'eraser') {
        store.removeAnnotation(ann.id);
        return;
      }

      if (activeTool === 'select' || activeTool === 'text' || activeTool === 'note') {
        if (ann.tool === 'text') {
          const newText = window.prompt('텍스트 내용을 수정하세요:', ann.text);
          if (newText !== null) {
            store.updateAnnotation(ann.id, { text: newText });
          }
        } else if (ann.tool === 'note') {
          const newText = window.prompt('노트 내용을 수정하세요:', ann.text);
          if (newText !== null) {
            store.updateAnnotation(ann.id, { text: newText });
          }
        }
      }
    },
    []
  );

  return (
    <Stage
      width={width}
      height={height}
      className="annotation-layer"
      style={{
        cursor:
          activeTool === 'select'
            ? 'default'
            : activeTool === 'eraser'
            ? 'cell'
            : 'crosshair',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        {annotations.map((ann) => renderAnnotation(ann, handleAnnotationClick))}
      </Layer>
    </Stage>
  );
}

function renderAnnotation(
  ann: Annotation,
  onClick: (ann: Annotation) => void
) {
  switch (ann.tool) {
    case 'draw':
      return (
        <Line
          key={ann.id}
          points={ann.points}
          stroke={ann.color}
          strokeWidth={ann.strokeWidth}
          tension={0.4}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation="source-over"
        />
      );
    case 'highlight':
      return (
        <Rect
          key={ann.id}
          x={Math.min(ann.x, ann.x + ann.width)}
          y={ann.y}
          width={Math.abs(ann.width)}
          height={ann.height}
          fill={ann.color}
          opacity={ann.opacity}
          globalCompositeOperation="multiply"
        />
      );
    case 'rect':
      return (
        <Rect
          key={ann.id}
          x={Math.min(ann.x, ann.x + ann.width)}
          y={Math.min(ann.y, ann.y + ann.height)}
          width={Math.abs(ann.width)}
          height={Math.abs(ann.height)}
          stroke={ann.strokeColor}
          strokeWidth={ann.strokeWidth}
          fill={ann.fillColor}
        />
      );
    case 'text':
      return (
        <Text
          key={ann.id}
          x={ann.x}
          y={ann.y}
          text={ann.text}
          fontSize={ann.fontSize}
          fill={ann.color}
          onClick={() => onClick(ann)}
        />
      );
    case 'note':
      return (
        <Group 
          key={ann.id} 
          x={ann.x} 
          y={ann.y}
          onClick={() => onClick(ann)}
          style={{ cursor: 'pointer' }}
        >
          <Circle radius={12} fill={ann.color} opacity={0.9} />
          <Text text="✎" fontSize={14} fill="#fff" offsetX={5} offsetY={7} />
        </Group>
      );
    default:
      return null;
  }
}
