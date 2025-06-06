
import React, { useCallback, useState } from 'react';
import { UploadedFile } from '../types';
import { Icons } from '../constants';
// parseFile is not used directly here anymore as NotebookView orchestrates parsing.
// import { parseFile } from '../services/fileParserService'; 

interface FileUploadHubProps {
  // notebookId: string; // Not strictly needed if hub only selects files
  onFilesSelected: (files: UploadedFile[]) => void; // Changed prop name for clarity
}

const ACCEPTED_MIME_TYPES: { [key: string]: string[] } = {
  'text/csv': ['.csv'],
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'], 
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
  'video/webm': ['.webm'],
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/ogg': ['.ogg'],
  'text/plain': ['.txt'],
};

const ACCEPT_STRING = Object.entries(ACCEPTED_MIME_TYPES)
  .flatMap(([mimeType, extensions]) => [mimeType, ...extensions])
  .join(',');

const FileUploadHub: React.FC<FileUploadHubProps> = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processAndValidateFiles = useCallback((fileList: FileList): UploadedFile[] => {
    const processedFiles: UploadedFile[] = [];
    const errors: string[] = [];

    Array.from(fileList).forEach(file => {
      const fileType = file.type;
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      let isAccepted = Object.entries(ACCEPTED_MIME_TYPES).some(([mime, exts]) => 
        (fileType === mime && exts.includes(fileExtension)) || // Exact match
        (fileType === mime && fileType !== '') || // MIME only match
        (exts.includes(fileExtension) && (!fileType || fileType === 'application/octet-stream')) // Extension only (for unknown MIME)
      );
      
      if (!isAccepted && fileExtension === '.doc' && (fileType === 'application/octet-stream' || fileType === '')) {
          isAccepted = true; // Specific fallback for .doc
      }

      if (isAccepted) {
        processedFiles.push({
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type || fileExtension, // Use determined extension if MIME is generic
          size: file.size,
          fileObject: file,
          status: 'pending', // Initial status
          previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        });
      } else {
        errors.push(`File type not supported: ${file.name} (${file.type || 'unknown type'})`);
      }
    });

    if (errors.length > 0) {
      setUploadError(errors.join('; '));
    } else {
      setUploadError(null);
    }
    return processedFiles;
  }, []);


  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = processAndValidateFiles(event.target.files);
      if (files.length > 0) {
        onFilesSelected(files);
      }
      event.target.value = ''; // Reset input for same file selection
    }
  }, [processAndValidateFiles, onFilesSelected]);


  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const files = processAndValidateFiles(event.dataTransfer.files);
      if (files.length > 0) {
        onFilesSelected(files);
      }
      event.dataTransfer.clearData();
    }
  }, [processAndValidateFiles, onFilesSelected]);


  const handleDragEnter = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // Check if leaving to a child element, common issue with dragleave
    if (event.currentTarget.contains(event.relatedTarget as Node)) {
        return;
    }
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault(); // Necessary to allow drop
    event.stopPropagation();
  }, []);

  return (
    <div className="mb-6">
      <label
        htmlFor="file-upload-hub"
        className={`flex flex-col items-center justify-center w-full h-52 border-2 border-slate-600/70 border-dashed rounded-xl cursor-pointer transition-all duration-200 ease-in-out
          ${isDragging ? 'bg-sky-700/20 border-sky-500 scale-[1.01]' : 'bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-500'}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        aria-label="File upload area: Click to select files or drag and drop here."
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
          {React.cloneElement(Icons.upload, {className:"w-12 h-12 text-slate-500 mb-3"})}
          <p className="mb-2 text-base">
            <span className="font-semibold text-sky-400">Click to upload files</span>
          </p>
          <p className="text-sm">or drag and drop</p>
          <p className="text-xs text-slate-500 mt-2">CSV, PDF, DOCX, Images, Videos, Audio, TXT</p>
        </div>
        <input
          id="file-upload-hub"
          type="file"
          multiple
          accept={ACCEPT_STRING}
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      {uploadError && <p className="mt-2 text-sm text-red-400" role="alert">{uploadError}</p>}
       <p className="text-xs text-slate-500 mt-2 text-center">
        Text extraction and AI analysis will be performed on supported file types.
      </p>
    </div>
  );
};

export default FileUploadHub;