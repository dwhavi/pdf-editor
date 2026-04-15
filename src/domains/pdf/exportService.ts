// PDF Export Service — pdf-lib 기반 어노테이션 플래튼
// GR-1: UI는 이 service만 호출
import { PDFDocument, rgb, LineCapStyle } from 'pdf-lib';
import { useAnnotationStore } from '@/domains/annotation/store';
import { usePdfStore } from '@/domains/pdf/store';
import type {
  Annotation,
  DrawAnnotation,
  HighlightAnnotation,
  RectAnnotation,
  TextAnnotation,
} from '@/domains/annotation/types';

/** hex "#rrggbb" → {r,g,b} 0~1 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return { r, g, b };
}

export async function exportPdfWithAnnotations(): Promise<void> {
  const { document: pdfDoc } = usePdfStore.getState();
  if (!pdfDoc) throw new Error('열린 PDF가 없습니다.');

  const annotations = useAnnotationStore.getState().annotations;

  // Load original PDF
  const pdfBytes = pdfDoc.arrayBuffer.slice(0);
  const doc = await PDFDocument.load(pdfBytes);
  const pages = doc.getPages();

  // Group annotations by page (1-indexed)
  const byPage = new Map<number, Annotation[]>();
  for (const ann of annotations) {
    if (!byPage.has(ann.page)) byPage.set(ann.page, []);
    byPage.get(ann.page)!.push(ann);
  }

  for (const [pageNum, anns] of byPage.entries()) {
    const page = pages[pageNum - 1];
    if (!page) continue;

    const { width: pdfW, height: pdfH } = page.getSize();

    // We need the rendered canvas size to compute scale
    // Using the store zoom=1.0 base size to normalize coordinates
    // Konva coords are in "display px at zoom=1" space
    // pdf-lib coords: origin bottom-left, y flipped

    for (const ann of anns) {
      if (ann.tool === 'highlight') {
        const a = ann as HighlightAnnotation;
        const c = hexToRgb('#ffe632');
        const normX = a.x / 800;        // assume 800px base width
        const normY = a.y / 1131;       // assume A4 base height
        const normW = Math.abs(a.width) / 800;
        const normH = a.height / 1131;

        page.drawRectangle({
          x: normX * pdfW,
          y: pdfH - (normY + normH) * pdfH,
          width: normW * pdfW,
          height: normH * pdfH,
          color: rgb(c.r, c.g, c.b),
          opacity: a.opacity,
        });
      } else if (ann.tool === 'draw') {
        const a = ann as DrawAnnotation;
        const c = hexToRgb(a.color.startsWith('#') ? a.color : '#6c63ff');
        const pts = a.points;
        if (pts.length < 4) continue;

        for (let i = 0; i < pts.length - 2; i += 2) {
          const x1 = (pts[i] / 800) * pdfW;
          const y1 = pdfH - (pts[i + 1] / 1131) * pdfH;
          const x2 = (pts[i + 2] / 800) * pdfW;
          const y2 = pdfH - (pts[i + 3] / 1131) * pdfH;

          page.drawLine({
            start: { x: x1, y: y1 },
            end: { x: x2, y: y2 },
            thickness: a.strokeWidth,
            color: rgb(c.r, c.g, c.b),
            lineCap: LineCapStyle.Round,
          });
        }
      } else if (ann.tool === 'rect') {
        const a = ann as RectAnnotation;
        const sc = hexToRgb(a.strokeColor.startsWith('#') ? a.strokeColor : '#6c63ff');
        const normX = Math.min(a.x, a.x + a.width) / 800;
        const normY = Math.min(a.y, a.y + a.height) / 1131;
        const normW = Math.abs(a.width) / 800;
        const normH = Math.abs(a.height) / 1131;

        page.drawRectangle({
          x: normX * pdfW,
          y: pdfH - (normY + normH) * pdfH,
          width: normW * pdfW,
          height: normH * pdfH,
          borderColor: rgb(sc.r, sc.g, sc.b),
          borderWidth: a.strokeWidth,
          opacity: 0,
        });
      } else if (ann.tool === 'text') {
        const a = ann as TextAnnotation;
        const c = hexToRgb(a.color.startsWith('#') ? a.color : '#1a1d27');
        const normX = a.x / 800;
        const normY = a.y / 1131;

        page.drawText(a.text, {
          x: normX * pdfW,
          y: pdfH - normY * pdfH,
          size: a.fontSize,
          color: rgb(c.r, c.g, c.b),
        });
      }
    }
  }

  const exported = await doc.save();
  const blob = new Blob([exported.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const a = window.document.createElement('a');
  a.href = url;
  a.download = pdfDoc.name.replace(/\.pdf$/i, '') + '_annotated.pdf';
  a.click();
  URL.revokeObjectURL(url);
}
