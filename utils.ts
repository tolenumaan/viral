import { UploadedFile } from './types';

/**
 * Converts a File object to a base64 encoded string, stripping the data URL prefix.
 * @param file The File object to convert.
 * @returns A Promise that resolves with the raw base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Gemini API expects raw base64, so remove the data URL prefix if present
      const base64Prefix = /^data:[a-zA-Z0-9\/+]+;base64,/;
      resolve(result.replace(base64Prefix, ''));
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Checks if a given file is likely parsable for text content by fileParserService.
 * @param file The File object to check.
 * @returns True if the file type suggests it's text-parsable, false otherwise.
 */
export const isTextParsable = (file: File): boolean => {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) return true;
  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) return true;
  if (fileType === 'application/msword' || fileName.endsWith('.doc')) return true;
  if (fileType === 'text/plain' || fileName.endsWith('.txt')) return true;
  if (fileType === 'text/csv' || fileName.endsWith('.csv')) return true;

  return false;
};
