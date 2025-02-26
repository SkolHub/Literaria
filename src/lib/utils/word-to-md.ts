import mammoth from 'mammoth';
import TurndownService from 'turndown';

export async function wordToMd(file: File): Promise<string> {
  if (
    !file ||
    file.type !==
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    throw new Error('Invalid file type. Please upload a .docx file.');
  }

  const arrayBuffer: ArrayBuffer = await file.arrayBuffer();

  const mammothResult = await mammoth.convertToHtml({
    arrayBuffer
  });

  const turndownService = new TurndownService();
  return turndownService.turndown(mammothResult.value);
}
