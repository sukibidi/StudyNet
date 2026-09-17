import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import JSZip from 'jszip';

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

async function extractOfficeText(file: File): Promise<string> {
  const zip = await JSZip.loadAsync(file);
  const xmlFiles = Object.keys(zip.files).filter((fileName) => {
    return fileName === 'word/document.xml' || fileName === 'xl/sharedStrings.xml' || /^ppt\/slides\/slide\d+\.xml$/.test(fileName);
  });
  const textParts: string[] = [];

  for (const fileName of xmlFiles) {
    const xml = await zip.files[fileName].async('text');
    const parsed = new DOMParser().parseFromString(xml, 'application/xml');
    textParts.push(parsed.documentElement.textContent || '');
  }

  return textParts.join('\n');
}

export async function extractDocumentText(file: File): Promise<string> {
  if (file.type === 'text/plain' || file.type === 'text/csv' || /\.(txt|csv)$/i.test(file.name)) {
    return file.text();
  }

  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
    return recognizePdf(file);
  }

  if (/\.(docx|pptx)$/i.test(file.name)) {
    return extractOfficeText(file);
  }

  if (file.type.startsWith('image/')) {
    return recognizeImage(file);
  }

  throw new Error('Upload a PDF, DOCX, PPTX, image, TXT, or CSV file.');
}