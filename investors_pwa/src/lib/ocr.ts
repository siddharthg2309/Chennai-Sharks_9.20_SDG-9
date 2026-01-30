import 'server-only';

type OcrLoggerMessage = { status: string; progress: number };

type TesseractRecognize = (
  image: Buffer | ArrayBuffer | string,
  lang?: string,
  options?: { logger?: (message: OcrLoggerMessage) => void }
) => Promise<{ data?: { text?: string } }>;

type PdfParseFn = (buffer: Buffer) => Promise<{ text?: string }>;

function getTesseractRecognize(mod: unknown): TesseractRecognize | null {
  const maybeDirect = mod as { recognize?: unknown };
  if (typeof maybeDirect.recognize === 'function') return maybeDirect.recognize as TesseractRecognize;

  const maybeDefault = mod as { default?: { recognize?: unknown } };
  if (typeof maybeDefault.default?.recognize === 'function') return maybeDefault.default.recognize as TesseractRecognize;

  return null;
}

function getPdfParse(mod: unknown): PdfParseFn | null {
  const maybeDefault = mod as { default?: unknown };
  if (typeof maybeDefault.default === 'function') return maybeDefault.default as PdfParseFn;
  if (typeof mod === 'function') return mod as PdfParseFn;
  return null;
}

export async function extractTextFromImage(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const tesseractMod = (await import('tesseract.js')) as unknown;
    const recognize = getTesseractRecognize(tesseractMod);
    if (!recognize) return '';

    const result = await recognize(buffer, 'eng', {
      logger: (message) => {
        if (message.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(message.progress * 100)}%`);
        }
      },
    });

    return result.data?.text ?? '';
  } catch (error) {
    console.error('OCR extraction failed:', error);
    return '';
  }
}

export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfMod = (await import('pdf-parse')) as unknown;
    const pdfParse = getPdfParse(pdfMod);
    if (!pdfParse) return '';

    const data = await pdfParse(buffer);
    return data.text ?? '';
  } catch (error) {
    console.error('PDF extraction failed:', error);
    return '';
  }
}

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return extractTextFromPdf(file);
  }

  if (
    fileType.startsWith('image/') ||
    fileName.endsWith('.png') ||
    fileName.endsWith('.jpg') ||
    fileName.endsWith('.jpeg')
  ) {
    return extractTextFromImage(file);
  }

  console.warn('Unsupported file type for OCR:', fileType);
  return '';
}

