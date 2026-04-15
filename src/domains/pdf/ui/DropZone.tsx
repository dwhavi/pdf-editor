// PDF Drop Zone Component
import { useRef, useState, useCallback } from 'react';
import { openPdfFile } from '@/domains/pdf/service';

export function DropZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    openPdfFile(file);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      id="pdf-drop-zone"
      className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <div className="drop-zone__icon">📄</div>
      <div className="drop-zone__title">PDF 파일을 드래그하거나 클릭하세요</div>
      <div className="drop-zone__sub">최대 100MB · PDF 형식만 지원</div>
      <button className="drop-zone__btn" type="button">
        파일 선택
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="visually-hidden"
        onChange={onFileChange}
        id="pdf-file-input"
      />
    </div>
  );
}
