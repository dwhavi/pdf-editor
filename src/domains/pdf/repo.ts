// PDF Domain — Repo (파일 I/O 경계. GR-2: Zod 파싱)
import { z } from 'zod';
import { PDF_CONFIG } from './config';

const FileSchema = z.object({
  name: z.string().refine((name) => name.toLowerCase().endsWith('.pdf'), 'PDF 파일(.pdf)만 지원됩니다.'),
  size: z.number().max(PDF_CONFIG.maxFileSizeMb * 1024 * 1024, '파일이 너무 큽니다.'),
  type: z.string().optional(),
});

export async function loadPdfFromFile(file: File): Promise<{ name: string; arrayBuffer: ArrayBuffer }> {
  const validated = FileSchema.parse({
    name: file.name,
    size: file.size,
    type: file.type,
  });

  try {
    const arrayBuffer = await file.arrayBuffer();
    return { name: validated.name, arrayBuffer };
  } catch (err) {
    throw new Error('파일을 읽는 중 오류가 발생했습니다.');
  }
}
