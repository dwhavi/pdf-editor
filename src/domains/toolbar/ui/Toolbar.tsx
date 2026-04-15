// Toolbar with color picker and stroke width options
import { useToolbarStore } from '@/domains/toolbar/store';
import { useAnnotationStore } from '@/domains/annotation/store';
import type { AnnotationTool } from '@/domains/annotation/types';

const TOOLS: { id: AnnotationTool; icon: string; label: string }[] = [
  { id: 'select',    icon: '↖',  label: '선택 (V)' },
  { id: 'highlight', icon: '▬',  label: '하이라이트 (H)' },
  { id: 'draw',      icon: '✏',  label: '드로잉 (D)' },
  { id: 'rect',      icon: '▭',  label: '사각형 (R)' },
  { id: 'note',      icon: '📝', label: '노트 (N)' },
  { id: 'text',      icon: 'T',  label: '텍스트 (T)' },
  { id: 'eraser',    icon: '⌫',  label: '지우개 (E)' },
];

const STROKE_SIZES = [2, 4, 6, 10];
const COLORS = ['#6c63ff', '#f87171', '#34d399', '#fbbf24', '#60a5fa', '#f472b6', '#1a1d27', '#ffffff'];

export function Toolbar() {
  const { activeTool, options, setTool, setOptions } = useToolbarStore();
  const clearAll = useAnnotationStore((s) => s.clearAll);

  return (
    <aside className="app-toolbar" id="app-toolbar" aria-label="도구 모음">
      {TOOLS.map((t, i) => (
        <span key={t.id}>
          {i === 1 && <div className="toolbar-divider" />}
          {i === 6 && <div className="toolbar-divider" />}
          <button
            id={`tool-${t.id}`}
            className={`toolbar-btn ${activeTool === t.id ? 'active' : ''}`}
            onClick={() => setTool(t.id)}
            title={t.label}
            aria-pressed={activeTool === t.id}
          >
            {t.icon}
            <span className="toolbar-btn__tooltip">{t.label}</span>
          </button>
        </span>
      ))}

      {/* Stroke width / Font size (for draw/rect/text) */}
      {['draw', 'rect', 'text'].includes(activeTool) && (
        <>
          <div className="toolbar-divider" />
          <div className="toolbar-section-label">굵기</div>
          {STROKE_SIZES.map((s) => (
            <button
              key={s}
              className={`toolbar-btn ${options.strokeWidth === s ? 'active' : ''}`}
              onClick={() => setOptions({ strokeWidth: s })}
              title={`굵기 ${s}`}
              style={{ fontSize: `${8 + s}px` }}
            >
              ●
              <span className="toolbar-btn__tooltip">{s}px</span>
            </button>
          ))}
        </>
      )}

      {/* Color picker */}
      {activeTool !== 'select' && activeTool !== 'eraser' && activeTool !== 'highlight' && (
        <>
          <div className="toolbar-divider" />
          <div className="toolbar-section-label">색상</div>
          {COLORS.map((c) => (
            <button
              key={c}
              className={`toolbar-btn ${options.color === c ? 'active' : ''}`}
              onClick={() => setOptions({ color: c })}
              title={c}
              style={{ padding: 0 }}
            >
              <span
                style={{
                  display: 'block',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: c,
                  border: options.color === c ? '2px solid white' : '2px solid transparent',
                }}
              />
            </button>
          ))}
        </>
      )}

      {/* Clear all */}
      <div className="toolbar-divider" style={{ marginTop: 'auto' }} />
      <button
        id="btn-clear-all"
        className="toolbar-btn"
        onClick={clearAll}
        title="모두 지우기"
        style={{ color: 'var(--color-danger)' }}
      >
        🗑
        <span className="toolbar-btn__tooltip">모두 지우기</span>
      </button>
    </aside>
  );
}
