import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const MAX_PDF_PAGES = 3;

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

async function recognizeImage(image: Blob | HTMLCanvasElement): Promise<string> {
  const worker = await createWorker('eng');
  try {
    const result = await worker.recognize(image);
    return result.data.text;
  } finally {
    await worker.terminate();
  }
}

async function recognizePdf(file: File): Promise<string> {
  const pdfDocument = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pageTexts: string[] = [];
  const pagesToScan = Math.min(pdfDocument.numPages, MAX_PDF_PAGES);

  for (let pageNumber = 1; pageNumber <= pagesToScan; pageNumber += 1) {
    const page = await pdfDocument.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.6 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) continue;

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    pageTexts.push(await recognizeImage(canvas));
  }

  return pageTexts.join('\n');
}

export async function extractDocumentText(file: File): Promise<string> {
  if (file.type === 'text/plain' || file.type === 'text/csv' || /\.(txt|csv)$/i.test(file.name)) {
    return file.text();
  }

  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
    return recognizePdf(file);
  }

  if (file.type.startsWith('image/')) {
    return recognizeImage(file);
  }

  throw new Error('OCR supports PDF, image, TXT, and CSV files.');
}