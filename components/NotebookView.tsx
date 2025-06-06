
import React, { useState, useEffect, useCallback } from 'react';
import { Notebook, UploadedFile, ParameterSettings, ContentIdea, ContentIdeaRefinementParameters } from '../types';
import FileUploadHub from './FileUploadHub';
import ParameterControls from './ParameterControls';
import ContentIdeaCard from './ContentIdeaCard';
import EditIdeaModal from './EditIdeaModal';
import { Icons, DEFAULT_PARAMETER_SETTINGS, DEFAULT_CONTENT_IDEA_REFINEMENT_PARAMETERS, IDEA_CARD_COLORS } from '../constants';
import { performResearchAnalysis, analyzeImageWithGemini, generateContentIdeas, generateVisualFromPrompt } from '../services/geminiService';
import { parseFile } from '../services/fileParserService';
import LoadingSpinner from './LoadingSpinner';
import { fileToBase64, isTextParsable } from '../utils'; 

interface NotebookViewProps {
  notebook: Notebook;
  onAddFiles: (notebookId: string, files: UploadedFile[]) => void;
  onRemoveFile: (notebookId: string, fileId: string) => void;
  onUpdateFile: (notebookId: string, fileId: string, updates: Partial<UploadedFile>) => void;
  onUpdateParameters: (notebookId: string, newParameters: Partial<ParameterSettings>) => void;
  onSetContentIdeas: (notebookId: string, ideas: ContentIdea[]) => void;
  onSetAiResearchAnalysis: (notebookId: string, analysis: string | null) => void;
}

const MAX_CONTENT_ITEM_CHARS = 75000; // Max characters for individual text/image analysis items

const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  if (type.includes('csv')) return Icons.fileCsv;
  if (type.includes('pdf')) return Icons.filePdf;
  if (type.includes('word') || type.includes('docx') || type.includes('doc')) return Icons.fileDoc;
  if (type.startsWith('image/')) return Icons.fileImage;
  if (type.startsWith('video/')) return Icons.fileVideo;
  if (type.startsWith('audio/')) return Icons.fileAudio;
  return Icons.file;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const NotebookView: React.FC<NotebookViewProps> = ({ 
  notebook, 
  onAddFiles, 
  onRemoveFile, 
  onUpdateFile,
  onUpdateParameters,
  onSetContentIdeas,
  onSetAiResearchAnalysis
}) => {
  const [isSynthesizingResearch, setIsSynthesizingResearch] = useState(false);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);
  const [synthesisTruncatedWarning, setSynthesisTruncatedWarning] = useState<string | null>(null);
  
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [ideaGenerationError, setIdeaGenerationError] = useState<string | null>(null);

  const [fileProcessingMessages, setFileProcessingMessages] = useState<Record<string, string>>({}); 
  const [isEditIdeaModalOpen, setIsEditIdeaModalOpen] = useState(false);
  const [ideaToEdit, setIdeaToEdit] = useState<ContentIdea | null>(null);


  useEffect(() => {
    setSynthesisError(null); 
    setIdeaGenerationError(null);
    setSynthesisTruncatedWarning(null);
    // Reset file processing messages for the new notebook
    const newFileProcessingMessages: Record<string, string> = {};
    notebook.files.forEach(file => {
        if (file.status === 'processing') newFileProcessingMessages[file.id] = "Processing...";
        else if (file.status === 'error' && file.processingError) newFileProcessingMessages[file.id] = `Error: ${file.processingError.substring(0,50)}`;
        else if (file.status === 'completed') newFileProcessingMessages[file.id] = "Completed.";
    });
    setFileProcessingMessages(newFileProcessingMessages);
  }, [notebook.id, notebook.files]); // Depend on notebook.files as well


  const handleFilesSelected = useCallback(async (selectedFiles: UploadedFile[]) => {
    onSetAiResearchAnalysis(notebook.id, null); 
    onSetContentIdeas(notebook.id, []); 
    setSynthesisError(null);
    setSynthesisTruncatedWarning(null);
    setIdeaGenerationError(null);

    onAddFiles(notebook.id, selectedFiles); 

    for (const file of selectedFiles) {
      onUpdateFile(notebook.id, file.id, { status: 'processing' });
      setFileProcessingMessages(prev => ({ ...prev, [file.id]: "Starting processing..."}));

      try {
        let extractedTextContent: string | null = null;
        let textProcessingError: string | null = null;

        if (isTextParsable(file.fileObject)) {
          setFileProcessingMessages(prev => ({ ...prev, [file.id]: "Extracting text..."}));
          const textParseOutput = await parseFile(file.fileObject);
          if (textParseOutput.error) {
            textProcessingError = textParseOutput.error;
            onUpdateFile(notebook.id, file.id, { status: 'error', processingError: textProcessingError, extractedText: null });
            setFileProcessingMessages(prev => ({ ...prev, [file.id]: `Error: ${textProcessingError.substring(0, 100)}`}));
            continue; 
          }
          extractedTextContent = textParseOutput.extractedText;
          onUpdateFile(notebook.id, file.id, { extractedText: extractedTextContent });
          setFileProcessingMessages(prev => ({ ...prev, [file.id]: "Text extracted."}));
        }

        if (file.type.startsWith('image/')) {
          setFileProcessingMessages(prev => ({ ...prev, [file.id]: "Analyzing image with AI..."}));
          try {
            const base64Data = await fileToBase64(file.fileObject);
            const imageAnalysisResult = await analyzeImageWithGemini(base64Data, file.type, file.name, notebook.campaignName);
            
            if (imageAnalysisResult.toLowerCase().startsWith('error:')) {
                 onUpdateFile(notebook.id, file.id, { imageAnalysis: null, status: 'error', processingError: (textProcessingError ? textProcessingError + "; " : "") + imageAnalysisResult });
                 setFileProcessingMessages(prev => ({ ...prev, [file.id]: `Image Error: ${imageAnalysisResult.substring(0,100)}`}));
            } else {
                onUpdateFile(notebook.id, file.id, { imageAnalysis: imageAnalysisResult, status: 'completed', processingError: textProcessingError }); 
                setFileProcessingMessages(prev => ({ ...prev, [file.id]: "Image analyzed."}));
            }
          } catch (imgErr: any) {
            const imgAnalysisError = imgErr.message || "Image analysis failed";
            onUpdateFile(notebook.id, file.id, { imageAnalysis: null, status: 'error', processingError: (textProcessingError ? textProcessingError + "; " : "") + imgAnalysisError });
            setFileProcessingMessages(prev => ({ ...prev, [file.id]: `Image Error: ${imgAnalysisError.substring(0,100)}`}));
            continue;
          }
        } else if (textProcessingError) { 
            // Status is already 'error' from text parsing
        } else if (isTextParsable(file.fileObject) && !textProcessingError) {
            onUpdateFile(notebook.id, file.id, { status: 'completed', processingError: null });
            setFileProcessingMessages(prev => ({ ...prev, [file.id]: "Processing complete."}));
        } else if (!isTextParsable(file.fileObject) && !file.type.startsWith('image/')) {
            onUpdateFile(notebook.id, file.id, { status: 'completed', processingError: "No specific text/image processing for this file type." });
            setFileProcessingMessages(prev => ({ ...prev, [file.id]: "Not applicable for text/image processing."}));
        }
      } catch (err: any) {
        const generalError = err.message || 'Overall processing failed';
        onUpdateFile(notebook.id, file.id, { status: 'error', processingError: generalError });
        setFileProcessingMessages(prev => ({ ...prev, [file.id]: `Error: ${generalError.substring(0,100)}`}));
      }
    }
  }, [notebook.id, notebook.campaignName, onAddFiles, onUpdateFile, onSetAiResearchAnalysis, onSetContentIdeas]);


  const handleRemoveFile = (fileId: string) => {
    if (window.confirm("Are you sure you want to remove this file from the notebook?")) {
      onRemoveFile(notebook.id, fileId);
      setFileProcessingMessages(prev => {
        const newState = {...prev};
        delete newState[fileId];
        return newState;
      });
    }
  };

  const handleStartResearchSynthesis = async () => {
    setIsSynthesizingResearch(true);
    onSetAiResearchAnalysis(notebook.id, null);
    onSetContentIdeas(notebook.id, []); // Clear ideas as they depend on synthesis
    setSynthesisError(null);
    setSynthesisTruncatedWarning(null);
    setIdeaGenerationError(null);

    const researchData: Array<{type: 'text' | 'image_description', content: string, fileName: string}> = [];
    notebook.files.forEach(file => {
      if (file.status === 'completed') {
        let truncatedContent: string;
        let itemTruncated = false;

        if (file.extractedText && file.extractedText.trim().length > 0) {
          truncatedContent = file.extractedText;
          if (truncatedContent.length > MAX_CONTENT_ITEM_CHARS) {
            truncatedContent = truncatedContent.substring(0, MAX_CONTENT_ITEM_CHARS) + "\n... [Content truncated due to length]";
            itemTruncated = true;
          }
          researchData.push({ type: 'text', content: truncatedContent, fileName: file.name });
        }
        
        if (file.imageAnalysis && file.imageAnalysis.trim().length > 0) {
          truncatedContent = file.imageAnalysis;
           // Image analysis is already prompted for brevity, but apply a safety net.
          if (truncatedContent.length > MAX_CONTENT_ITEM_CHARS / 2) { // Smaller limit for image analysis
            truncatedContent = truncatedContent.substring(0, MAX_CONTENT_ITEM_CHARS / 2) + "\n... [Image analysis truncated due to length]";
            itemTruncated = true;
          }
          researchData.push({ type: 'image_description', content: truncatedContent, fileName: file.name });
        }
      }
    });
    
    if (researchData.length === 0) {
      setSynthesisError("No processed text or image descriptions available for analysis. Ensure files are uploaded and processed successfully.");
      setIsSynthesizingResearch(false);
      return;
    }

    try {
      const result = await performResearchAnalysis(researchData, notebook.campaignName);
      if (result.error) {
        setSynthesisError(result.error);
        onSetAiResearchAnalysis(notebook.id, null);
      } else {
        onSetAiResearchAnalysis(notebook.id, result.analysisText);
      }
      if (result.wasTruncated) { // This now reflects global truncation OR if any item was pre-truncated
        setSynthesisTruncatedWarning("Note: Research data was extensive and automatically summarized/truncated for AI analysis. Results may be based on a subset of your data.");
      }
    } catch (error) {
      console.error("Error during AI research analysis:", error);
      setSynthesisError("An unexpected error occurred while performing AI research analysis.");
       onSetAiResearchAnalysis(notebook.id, null);
    } finally {
      setIsSynthesizingResearch(false);
    }
  };

  const handleGenerateContentIdeas = async () => {
    if (!notebook.aiResearchAnalysis) {
      setIdeaGenerationError("Please perform AI Research Synthesis first.");
      return;
    }
    setIsGeneratingIdeas(true);
    setIdeaGenerationError(null);
    onSetContentIdeas(notebook.id, []); 

    try {
      const result = await generateContentIdeas(notebook.aiResearchAnalysis, notebook.campaignName, notebook.parameters);
      if ('error' in result) {
        setIdeaGenerationError(result.error);
      } else {
        onSetContentIdeas(notebook.id, result);
      }
    } catch (error) {
       console.error("Error generating content ideas:", error);
       setIdeaGenerationError("An unexpected error occurred while generating content ideas.");
    } finally {
        setIsGeneratingIdeas(false);
    }
  };
  
  const handleParametersChange = (newParams: Partial<ParameterSettings>) => {
    onUpdateParameters(notebook.id, newParams);
  };

  const handleToggleSelectIdea = (ideaId: string) => {
    const updatedIdeas = notebook.contentIdeas.map(idea => 
      idea.id === ideaId ? { ...idea, isSelected: !idea.isSelected } : idea
    );
    onSetContentIdeas(notebook.id, updatedIdeas);
  };

  const handleUpdateIdeaRefinement = (ideaId: string, refinements: Partial<ContentIdeaRefinementParameters>) => {
    const updatedIdeas = notebook.contentIdeas.map(idea =>
      idea.id === ideaId ? { ...idea, refinementParameters: { ...idea.refinementParameters, ...refinements } } : idea
    );
    onSetContentIdeas(notebook.id, updatedIdeas);
  };
  
  const handleGenerateVisual = async (ideaId: string) => {
    const targetIdea = notebook.contentIdeas.find(idea => idea.id === ideaId);
    if (!targetIdea) return;

    onSetContentIdeas(notebook.id, notebook.contentIdeas.map(idea => 
      idea.id === ideaId ? { ...idea, isGeneratingImage: true, imageGenerationError: null, generatedImageUrl: null } : idea
    ));

    let finalPrompt = targetIdea.visualConceptPrompt;
    if (targetIdea.refinementParameters.customVisualPromptOverride && targetIdea.refinementParameters.customVisualPromptOverride.trim() !== '') {
        finalPrompt = targetIdea.refinementParameters.customVisualPromptOverride.trim();
    } else {
        const refinements: string[] = [];
        if(targetIdea.refinementParameters.lighting && targetIdea.refinementParameters.lighting !== 'Custom' && targetIdea.refinementParameters.lighting !== DEFAULT_CONTENT_IDEA_REFINEMENT_PARAMETERS.lighting) refinements.push(`lighting: ${targetIdea.refinementParameters.lighting}`);
        if(targetIdea.refinementParameters.scenery && targetIdea.refinementParameters.scenery !== 'Custom' && targetIdea.refinementParameters.scenery !== DEFAULT_CONTENT_IDEA_REFINEMENT_PARAMETERS.scenery) refinements.push(`scenery: ${targetIdea.refinementParameters.scenery}`);
        if(targetIdea.refinementParameters.storyboardNotes) refinements.push(`details: ${targetIdea.refinementParameters.storyboardNotes}`);
        if(refinements.length > 0) finalPrompt += `, ${refinements.join(', ')}`;
    }
    finalPrompt += `, visual style: ${notebook.parameters.visualStyle || 'bold'}`;


    const result = await generateVisualFromPrompt(finalPrompt);
    
    onSetContentIdeas(notebook.id, notebook.contentIdeas.map(idea => 
      idea.id === ideaId 
        ? { ...idea, isGeneratingImage: false, generatedImageUrl: result.imageUrl || null, imageGenerationError: result.error || null } 
        : idea
    ));
  };

  const handleMoveIdea = (ideaId: string, direction: 'up' | 'down') => {
    const ideas = [...notebook.contentIdeas];
    const index = ideas.findIndex(idea => idea.id === ideaId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      [ideas[index - 1], ideas[index]] = [ideas[index], ideas[index - 1]];
    } else if (direction === 'down' && index < ideas.length - 1) {
      [ideas[index + 1], ideas[index]] = [ideas[index], ideas[index + 1]];
    }
    onSetContentIdeas(notebook.id, ideas);
  };

  const handleSaveSelectedIdeas = () => {
    if (window.confirm("Save selected ideas? All unselected ideas in this notebook will be discarded.")) {
      const selected = notebook.contentIdeas.filter(idea => idea.isSelected);
      onSetContentIdeas(notebook.id, selected);
    }
  };
  
  const handleDiscardSelectedIdeas = () => {
    if (window.confirm("Discard all selected ideas? This cannot be undone.")) {
      const unselected = notebook.contentIdeas.filter(idea => !idea.isSelected);
      onSetContentIdeas(notebook.id, unselected);
    }
  };

  const handleOpenEditIdeaModal = (idea: ContentIdea | null = null) => {
    setIdeaToEdit(idea);
    setIsEditIdeaModalOpen(true);
  };

  const handleSaveIdea = (ideaData: Partial<ContentIdea>, existingIdeaId?: string) => {
    let updatedIdeas: ContentIdea[];
    if (existingIdeaId) {
      updatedIdeas = notebook.contentIdeas.map(idea => 
        idea.id === existingIdeaId ? { ...idea, ...ideaData, isManual: idea.isManual || false } : idea // Preserve isManual if editing
      );
    } else {
      const newIdea: ContentIdea = {
        id: `idea-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        postText: ideaData.postText || '',
        platform: ideaData.platform || 'General',
        contentType: ideaData.contentType || 'Post',
        visualConceptPrompt: ideaData.visualConceptPrompt || '',
        hashtags: ideaData.hashtags || [],
        isSelected: false,
        generatedImageUrl: null,
        imageGenerationError: null,
        isGeneratingImage: false,
        refinementParameters: ideaData.refinementParameters || DEFAULT_CONTENT_IDEA_REFINEMENT_PARAMETERS,
        color: ideaData.color || IDEA_CARD_COLORS[0].twClasses,
        isPinned: ideaData.isPinned || false,
        isManual: true, // New manual ideas are manual
      };
      updatedIdeas = [...notebook.contentIdeas, newIdea];
    }
    onSetContentIdeas(notebook.id, updatedIdeas);
  };

  const handleDeleteIdea = (ideaId: string) => {
    if (window.confirm("Are you sure you want to delete this content idea?")) {
        const updatedIdeas = notebook.contentIdeas.filter(idea => idea.id !== ideaId);
        onSetContentIdeas(notebook.id, updatedIdeas);
    }
  };

  const handleSetIdeaColor = (ideaId: string, color: string) => {
    const updatedIdeas = notebook.contentIdeas.map(idea =>
      idea.id === ideaId ? { ...idea, color } : idea
    );
    onSetContentIdeas(notebook.id, updatedIdeas);
  };

  const handleTogglePinIdea = (ideaId: string) => {
    const updatedIdeas = notebook.contentIdeas.map(idea =>
      idea.id === ideaId ? { ...idea, isPinned: !idea.isPinned } : idea
    );
    onSetContentIdeas(notebook.id, updatedIdeas);
  };

  const getStatusBadge = (file: UploadedFile) => {
    const message = fileProcessingMessages[file.id] || file.status;
    switch(file.status) {
      case 'pending':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-600 text-slate-300">Pending</span>;
      case 'processing':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-sky-700 text-sky-200 flex items-center"><LoadingSpinner small className="mr-1 w-3 h-3" /> {message.substring(0,15)}...</span>;
      case 'completed':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-700 text-green-200 flex items-center">{React.cloneElement(Icons.checkCircle, {className:"w-3 h-3 mr-1"})} Done</span>;
      case 'error':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-700 text-red-200 flex items-center" title={file.processingError}>{React.cloneElement(Icons.xCircle, {className:"w-3 h-3 mr-1"})} Error</span>;
      default:
        return null;
    }
  }

  const allFilesProcessed = notebook.files.length > 0 && notebook.files.every(f => f.status === 'completed' || f.status === 'error');
  const selectedIdeasCount = notebook.contentIdeas.filter(idea => idea.isSelected).length;

  const pinnedIdeas = notebook.contentIdeas.filter(idea => idea.isPinned);
  const unpinnedIdeas = notebook.contentIdeas.filter(idea => !idea.isPinned);


  return (
    <div className="h-full flex flex-col space-y-6 lg:space-y-8">
      {/* Notebook Header */}
      <div className="pb-4 border-b border-slate-700/50">
        <h2 className="text-3xl font-bold text-sky-400 mb-1.5">{notebook.name}</h2>
        <p className="text-sm text-slate-400">Campaign: <span className="font-medium">{notebook.campaignName}</span></p>
        <p className="text-xs text-slate-500 mt-0.5">
          Created: {new Date(notebook.createdAt).toLocaleDateString()} | Last Updated: {new Date(notebook.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} {new Date(notebook.updatedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Section: File Upload & Management */}
      <section className="bg-slate-800/70 p-5 rounded-xl border border-slate-700/70 shadow-lg">
        <h3 className="text-xl font-semibold text-slate-200 mb-4">Upload Research Files</h3>
        <FileUploadHub onFilesSelected={handleFilesSelected} />
        {notebook.files.length > 0 && (
          <div className="mt-5">
            <h4 className="text-md font-medium text-slate-300 mb-3">Uploaded Files ({notebook.files.length}):</h4>
            <div className="bg-slate-800 rounded-lg p-1 max-h-[22rem] overflow-y-auto border border-slate-700">
              <ul className="space-y-2 p-3">
                {notebook.files.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-slate-700/80 rounded-lg shadow-sm hover:bg-slate-600/70 transition-colors"
                    aria-label={`File: ${file.name}, Status: ${file.status}`}
                  >
                    <div className="flex items-center overflow-hidden min-w-0 flex-grow"> 
                      {React.cloneElement(getFileIcon(file.type), {className: "file-icon flex-shrink-0 w-5 h-5"})}
                      <div className="overflow-hidden ml-2.5 flex-grow"> 
                        <p className="text-sm font-medium text-slate-100 truncate" title={file.name}>{file.name}</p>
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <span>{file.type} - {formatFileSize(file.size)}</span>
                        </div>
                         {(file.status === 'completed' || file.status === 'error') && (file.extractedText || file.imageAnalysis || file.processingError) && (
                           <p className={`text-xs italic mt-0.5 truncate ${file.status === 'error' && file.processingError ? 'text-red-400' : (file.imageAnalysis ? 'text-teal-400' : 'text-green-400')}`} title={file.processingError || (file.imageAnalysis ? 'Image Analyzed' : 'Text Extracted')}>
                            {file.status === 'error' && file.processingError ? `Error: ${file.processingError.substring(0,50)}...` : 
                             file.imageAnalysis ? 'Image Analyzed by AI' : 
                             file.extractedText ? `Text Extracted (${file.extractedText.length} chars)` : 
                             'Processing complete'}
                           </p>
                         )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0"> 
                        {getStatusBadge(file)}
                        {file.previewUrl && file.type.startsWith('image/') && (
                            <img src={file.previewUrl} alt={`Preview of ${file.name}`} className="w-10 h-10 object-cover rounded-md border border-slate-600"/>
                        )}
                        <button
                            onClick={() => handleRemoveFile(file.id)}
                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-600/50 rounded-md transition-colors"
                            aria-label={`Remove file ${file.name}`}
                            title="Remove file"
                        >
                            {React.cloneElement(Icons.trash, {className: "w-4 h-4"})}
                        </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Section: AI Research Synthesis */}
      {notebook.files.length > 0 && (
        <section className="bg-slate-800/70 p-5 rounded-xl border border-slate-700/70 shadow-lg">
          <h3 className="text-xl font-semibold text-slate-200 mb-4">Step 1: AI Research Synthesis</h3>
          <button
            onClick={handleStartResearchSynthesis}
            disabled={isSynthesizingResearch || !allFilesProcessed}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-base font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow hover:shadow-md"
            title={!allFilesProcessed ? "Wait for all files to finish processing" : "Synthesize insights from all processed text and image data"}
          >
            {isSynthesizingResearch ? <><LoadingSpinner small /> Synthesizing Research...</> : <>{React.cloneElement(Icons.ai, {className:"w-5 h-5"})} Perform AI Research Synthesis</>}
          </button>
          <p className="text-xs text-slate-400 mt-2.5 text-center">AI synthesizes insights from extracted text and analyzed image descriptions.</p>
          
          {synthesisTruncatedWarning && !isSynthesizingResearch && (
            <div className="mt-4 p-3 bg-amber-800/40 border border-amber-600/70 text-amber-300 rounded-lg text-sm">
                {synthesisTruncatedWarning}
            </div>
          )}
          {notebook.aiResearchAnalysis && !isSynthesizingResearch && (
            <div className="mt-4 p-4 bg-slate-700/50 rounded-lg border border-sky-700/50 shadow-inner max-h-72 overflow-y-auto">
              <h4 className="text-md font-semibold text-sky-300 mb-2">AI Synthesis Output:</h4>
              <div className="text-sm text-slate-300 whitespace-pre-wrap prose prose-sm prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5">
                  {notebook.aiResearchAnalysis}
              </div>
            </div>
          )}
          {synthesisError && !isSynthesizingResearch && (
            <div className="mt-4 p-4 bg-red-800/40 border border-red-600/70 text-red-300 rounded-lg shadow-md">
              <h4 className="text-md font-semibold text-red-300 mb-2">Synthesis Error:</h4>
              <p className="text-sm whitespace-pre-wrap">{synthesisError}</p>
            </div>
          )}
        </section>
      )}

      {/* Section: Content Idea Generation */}
      {notebook.aiResearchAnalysis && (
        <section className="bg-slate-800/70 p-5 rounded-xl border border-slate-700/70 shadow-lg">
            <h3 className="text-xl font-semibold text-slate-200 mb-4">Step 2: AI Content Idea Generation</h3>
            <ParameterControls currentSettings={notebook.parameters || DEFAULT_PARAMETER_SETTINGS} onChange={handleParametersChange} />
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleGenerateContentIdeas}
                    disabled={isGeneratingIdeas || isSynthesizingResearch}
                    className="flex-grow flex items-center justify-center gap-2.5 px-4 py-3 text-base font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow hover:shadow-md"
                >
                    {isGeneratingIdeas ? <><LoadingSpinner small /> Generating Ideas...</> : <>{React.cloneElement(Icons.lightbulb, {className:"w-5 h-5"})} Generate AI Ideas</>}
                </button>
                 <button
                    onClick={() => handleOpenEditIdeaModal()}
                    className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-3 text-base font-semibold text-sky-200 bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors shadow hover:shadow-md"
                    title="Add a content idea manually"
                >
                    {React.cloneElement(Icons.plusCircle, { className: "w-5 h-5"})} Add Idea Manually
                </button>
            </div>
            <p className="text-xs text-slate-400 mt-2.5 text-center">AI generates content ideas based on synthesis and your parameters, or add your own.</p>

            {ideaGenerationError && !isGeneratingIdeas && (
                 <div className="mt-4 p-4 bg-red-800/40 border border-red-600/70 text-red-300 rounded-lg shadow-md">
                    <h4 className="text-md font-semibold text-red-300 mb-2">Idea Generation Error:</h4>
                    <p className="text-sm whitespace-pre-wrap">{ideaGenerationError}</p>
                </div>
            )}

            {/* Pinned Ideas */}
            {pinnedIdeas.length > 0 && !isGeneratingIdeas && (
                <div className="mt-6">
                    <h4 className="text-lg font-semibold text-sky-300 mb-3 border-b border-sky-700/50 pb-2">Pinned Ideas ({pinnedIdeas.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pinnedIdeas.map((idea) => (
                            <ContentIdeaCard 
                                key={idea.id} 
                                idea={idea}
                                onToggleSelect={handleToggleSelectIdea}
                                onGenerateVisual={handleGenerateVisual}
                                onMoveUp={(id) => handleMoveIdea(id, 'up')}
                                onMoveDown={(id) => handleMoveIdea(id, 'down')}
                                onUpdateRefinement={handleUpdateIdeaRefinement}
                                onEdit={handleOpenEditIdeaModal}
                                onDelete={handleDeleteIdea}
                                onSetColor={handleSetIdeaColor}
                                onTogglePin={handleTogglePinIdea}
                                isFirst={false} // Pinned items don't use global first/last for reorder
                                isLast={false}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Unpinned Ideas */}
            {(pinnedIdeas.length > 0 && unpinnedIdeas.length > 0) && <div className="my-6 border-t border-slate-700/50"></div>}
            
            {unpinnedIdeas.length > 0 && !isGeneratingIdeas && (
                <div className={`mt-6 ${pinnedIdeas.length > 0 ? 'pt-0' : ''}`}>
                    <div className="flex flex-wrap justify-between items-center mb-3 gap-y-2">
                        <h4 className="text-lg font-semibold text-teal-300">
                            {pinnedIdeas.length > 0 ? "Other Ideas" : "Generated Content Ideas"} ({unpinnedIdeas.length}):
                        </h4>
                        {selectedIdeasCount > 0 && (
                            <div className="flex flex-wrap gap-2">
                                <button 
                                    onClick={handleSaveSelectedIdeas}
                                    className="flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded-lg transition-colors shadow"
                                    title="Keep only selected ideas, discard others"
                                >
                                    {React.cloneElement(Icons.save, {className: "w-3.5 h-3.5"})} Save Selected ({selectedIdeasCount})
                                </button>
                                <button 
                                    onClick={handleDiscardSelectedIdeas}
                                    className="flex items-center gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-lg transition-colors shadow"
                                    title="Discard all selected ideas"
                                >
                                    {React.cloneElement(Icons.trash, {className: "w-3.5 h-3.5"})} Discard Selected ({selectedIdeasCount})
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {unpinnedIdeas.map((idea, index) => (
                            <ContentIdeaCard 
                                key={idea.id} 
                                idea={idea}
                                onToggleSelect={handleToggleSelectIdea}
                                onGenerateVisual={handleGenerateVisual}
                                onMoveUp={(id) => handleMoveIdea(id, 'up')}
                                onMoveDown={(id) => handleMoveIdea(id, 'down')}
                                onUpdateRefinement={handleUpdateIdeaRefinement}
                                onEdit={handleOpenEditIdeaModal}
                                onDelete={handleDeleteIdea}
                                onSetColor={handleSetIdeaColor}
                                onTogglePin={handleTogglePinIdea}
                                isFirst={index === 0}
                                isLast={index === unpinnedIdeas.length - 1}
                            />
                        ))}
                    </div>
                </div>
            )}
            {(notebook.contentIdeas.length === 0 && !isGeneratingIdeas && !ideaGenerationError) && (
                 <p className="text-slate-400 mt-4 text-center">No content ideas generated yet for this combination of research and parameters. Try generating!</p>
            )}
        </section>
      )}
      {isEditIdeaModalOpen && (
        <EditIdeaModal
          isOpen={isEditIdeaModalOpen}
          onClose={() => setIsEditIdeaModalOpen(false)}
          onSave={handleSaveIdea}
          ideaToEdit={ideaToEdit}
        />
      )}
    </div>
  );
};

export default NotebookView;
