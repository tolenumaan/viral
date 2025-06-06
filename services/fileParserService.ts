import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
// We don't need to import the worker as a module object if we are providing its URL as a string.
// import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs';
import mammoth from 'mammoth/mammoth.browser.js'; // esm.sh serves browser version

// Configure the PDF worker. This is crucial for pdf.js to work.
if (typeof Worker !== 'undefined') {
    // Set workerSrc to the URL of the worker script.
    // This URL is what esm.sh provides and is specified in your importmap.
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://esm.sh/pdfjs-dist@^4.4.172/build/pdf.worker.mjs";
} else {
    console.warn("Web Workers are not supported in this environment. PDF.js may not work correctly or at all.");
}


async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let textContent = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();
    // Ensure items are correctly typed if 'any' is an issue, pdf.js types can be more specific
    textContent += text.items.map((item: { str: string }) => item.str).join(' ') + '\n';
  }
  return textContent.trim();
}

async function parseDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

async function parseTxtOrCsv(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(file);
  });
}

export async function parseFile(file: File): Promise<{ extractedText: string | null, error: string | null }> {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      const text = await parsePdf(file);
      return { extractedText: text, error: null };
    }
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      const text = await parseDocx(file);
      return { extractedText: text, error: null };
    }
    if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
       try {
        const arrayBuffer = await file.arrayBuffer();
        const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
        const div = document.createElement('div');
        div.innerHTML = htmlResult.value;
        const text = div.textContent || div.innerText || "";
        return { extractedText: text.trim(), error: null };
      } catch (docError: any) {
        console.warn(`Standard .doc parsing failed for ${fileName}, trying as plain text. Error:`, docError.message || docError);
        const text = await parseTxtOrCsv(file);
        // It might be better to inform the user that .doc parsing was partial or via fallback
        return { extractedText: text, error: "DOC parsing fallback to plain text; formatting lost." };
      }
    }
    if (fileType === 'text/plain' || fileName.endsWith('.txt') || fileType === 'text/csv' || fileName.endsWith('.csv')) {
      const text = await parseTxtOrCsv(file);
      return { extractedText: text, error: null };
    }
    if (fileType.startsWith('image/') || fileType.startsWith('video/') || fileType.startsWith('audio/')) {
        return { extractedText: null, error: "Text extraction not applicable for this media type." };
    }

    return { extractedText: null, error: `File type (${fileType || fileName.split('.').pop()}) not supported for text extraction.` };
  } catch (error: any) {
    console.error(`Error parsing file ${file.name}:`, error);
    return { extractedText: null, error: error.message || 'An unknown error occurred during parsing.' };
  }
}
