
import React, { useState, useCallback, useEffect } from 'react';
import { Notebook, UploadedFile, ParameterSettings, ContentIdea, ContentIdeaRefinementParameters } from './types';
import { APP_TITLE, Icons, DEFAULT_PARAMETER_SETTINGS, DEFAULT_CONTENT_IDEA_REFINEMENT_PARAMETERS } from './constants';
import NotebookList from './components/NotebookList';
import NotebookView from './components/NotebookView';
import CreateNotebookModal from './components/CreateNotebookModal';
import LoadingSpinner from './components/LoadingSpinner'; 

const App: React.FC = () => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  useEffect(() => {
    try {
      const storedNotebooks = localStorage.getItem('viralLensNotebooks');
      if (storedNotebooks) {
        const parsedNotebooks: Notebook[] = JSON.parse(storedNotebooks).map((nb: any) => ({
          ...nb,
          files: nb.files.map((f: any) => ({ 
            ...f, 
            fileObject: new File([], f.name, {type: f.type}) 
          })),
          parameters: nb.parameters || DEFAULT_PARAMETER_SETTINGS,
          contentIdeas: (nb.contentIdeas || []).map((idea: any) => ({
            ...idea,
            id: idea.id || `idea-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            isSelected: idea.isSelected || false,
            generatedImageUrl: idea.generatedImageUrl || null,
            imageGenerationError: null, 
            isGeneratingImage: false, 
            refinementParameters: idea.refinementParameters || DEFAULT_CONTENT_IDEA_REFINEMENT_PARAMETERS,
            hashtags: Array.isArray(idea.hashtags) ? idea.hashtags : (typeof idea.hashtags === 'string' ? [idea.hashtags] : []),
            color: idea.color || undefined,
            isPinned: idea.isPinned || false,
            isManual: idea.isManual || false,
          })),
          aiResearchAnalysis: nb.aiResearchAnalysis || null,
        }));
        setNotebooks(parsedNotebooks);
      }
      const storedSelectedId = localStorage.getItem('viralLensSelectedNotebookId');
      if (storedSelectedId && storedNotebooks) { 
         const parsedNotebooksData: Notebook[] = JSON.parse(storedNotebooks);
         if(parsedNotebooksData.find(nb => nb.id === storedSelectedId)) {
            setSelectedNotebookId(storedSelectedId);
         } else {
            localStorage.removeItem('viralLensSelectedNotebookId'); 
         }
      }
    } catch (error) {
      console.error("Failed to load notebooks from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) { 
        try {
            const serializableNotebooks = notebooks.map(nb => {
              const { files, contentIdeas, ...restOfNotebook } = nb;
              const serializableFiles = files.map(({ fileObject, extractedText, imageAnalysis, progress, ...restOfFile }) => restOfFile);
              const serializableContentIdeas = contentIdeas.map(idea => {
                // Exclude transient states, keep persistent ones
                const { isGeneratingImage, imageGenerationError, ...restOfIdea } = idea; 
                return restOfIdea;
              });
              return { ...restOfNotebook, files: serializableFiles, contentIdeas: serializableContentIdeas };
            });
            localStorage.setItem('viralLensNotebooks', JSON.stringify(serializableNotebooks));
        } catch (error) {
            console.error("Failed to save notebooks to localStorage:", error);
             if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                alert("Could not save changes: Local storage quota exceeded. Please try removing some large files or notebooks.");
            }
        }
    }
  }, [notebooks, isLoading]);

  useEffect(() => {
    if (!isLoading) {
        if (selectedNotebookId) {
            localStorage.setItem('viralLensSelectedNotebookId', selectedNotebookId);
        } else {
            localStorage.removeItem('viralLensSelectedNotebookId');
        }
    }
  }, [selectedNotebookId, isLoading]);


  const handleCreateNotebook = useCallback((name: string, campaignName: string) => {
    const newNotebook: Notebook = {
      id: `nb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      campaignName,
      files: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parameters: DEFAULT_PARAMETER_SETTINGS,
      contentIdeas: [],
      aiResearchAnalysis: null,
    };
    setNotebooks(prev => [...prev, newNotebook]);
    setSelectedNotebookId(newNotebook.id); 
    setIsCreateModalOpen(false);
  }, []);

  const handleSelectNotebook = useCallback((id: string) => {
    setSelectedNotebookId(id);
  }, []);
  
  const handleDeleteNotebook = useCallback((id: string) => {
    setNotebooks(prev => prev.filter(nb => nb.id !== id));
    if (selectedNotebookId === id) {
      const remainingNotebooks = notebooks.filter(nb => nb.id !== id);
      setSelectedNotebookId(remainingNotebooks.length > 0 ? remainingNotebooks[0].id : null);
    }
  }, [selectedNotebookId, notebooks]);

  const handleAddFilesToNotebook = useCallback((notebookId: string, newFiles: UploadedFile[]) => {
    setNotebooks(prevNotebooks =>
      prevNotebooks.map(nb =>
        nb.id === notebookId
          ? { ...nb, files: [...nb.files, ...newFiles], updatedAt: new Date().toISOString(), aiResearchAnalysis: null, contentIdeas: [] } // Reset analysis and ideas
          : nb
      )
    );
  }, []);
  
  const handleUpdateFileInNotebook = useCallback((notebookId: string, fileId: string, updates: Partial<UploadedFile>) => {
    setNotebooks(prevNotebooks =>
      prevNotebooks.map(nb =>
        nb.id === notebookId
          ? {
              ...nb,
              files: nb.files.map(f =>
                f.id === fileId ? { ...f, ...updates } : f
              ),
              updatedAt: new Date().toISOString(),
            }
          : nb
      )
    );
  }, []);

  const handleRemoveFileFromNotebook = useCallback((notebookId: string, fileId: string) => {
    setNotebooks(prevNotebooks =>
      prevNotebooks.map(nb =>
        nb.id === notebookId
          ? { ...nb, files: nb.files.filter(f => f.id !== fileId), updatedAt: new Date().toISOString(), aiResearchAnalysis: null, contentIdeas: [] } // Reset analysis and ideas
          : nb
      )
    );
  }, []);

  const handleUpdateNotebookParameters = useCallback((notebookId: string, newParams: Partial<ParameterSettings>) => {
    setNotebooks(prevNotebooks =>
      prevNotebooks.map(nb =>
        nb.id === notebookId
          ? { ...nb, parameters: { ...nb.parameters, ...newParams }, contentIdeas: [], updatedAt: new Date().toISOString() } 
          : nb
      )
    );
  }, []);

  const handleSetNotebookContentIdeas = useCallback((notebookId: string, ideas: ContentIdea[]) => {
    setNotebooks(prevNotebooks =>
      prevNotebooks.map(nb =>
        nb.id === notebookId
          ? { ...nb, contentIdeas: ideas, updatedAt: new Date().toISOString() }
          : nb
      )
    );
  }, []);
  
  const handleSetNotebookAiResearchAnalysis = useCallback((notebookId: string, analysis: string | null) => {
    setNotebooks(prevNotebooks =>
      prevNotebooks.map(nb =>
        nb.id === notebookId
          ? { ...nb, aiResearchAnalysis: analysis, contentIdeas: [], updatedAt: new Date().toISOString() } 
          : nb
      )
    );
  }, []);


  const selectedNotebook = notebooks.find(nb => nb.id === selectedNotebookId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <header className="bg-slate-900 shadow-lg p-4 flex justify-between items-center border-b border-slate-700/50 sticky top-0 z-30">
        <h1 className="text-2xl font-bold text-sky-400 tracking-tight">{APP_TITLE}</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out flex items-center gap-2 shadow hover:shadow-md"
          aria-label="Create new notebook"
        >
          {React.cloneElement(Icons.add, {className:"w-5 h-5"})} New Notebook
        </button>
      </header>

      <div className="flex-grow flex overflow-hidden">
        <aside className="w-64 md:w-72 bg-slate-900 p-4 border-r border-slate-700/50 overflow-y-auto">
          <NotebookList
            notebooks={notebooks}
            selectedNotebookId={selectedNotebookId}
            onSelectNotebook={handleSelectNotebook}
            onCreateNotebook={() => setIsCreateModalOpen(true)}
            onDeleteNotebook={handleDeleteNotebook}
          />
        </aside>

        <main className="flex-grow p-4 md:p-6 lg:p-8 overflow-y-auto">
          {selectedNotebook ? (
            <NotebookView
              key={selectedNotebook.id} 
              notebook={selectedNotebook}
              onAddFiles={handleAddFilesToNotebook}
              onRemoveFile={handleRemoveFileFromNotebook}
              onUpdateFile={handleUpdateFileInNotebook}
              onUpdateParameters={handleUpdateNotebookParameters}
              onSetContentIdeas={handleSetNotebookContentIdeas}
              onSetAiResearchAnalysis={handleSetNotebookAiResearchAnalysis}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="text-slate-600 mb-6">{React.cloneElement(Icons.notebook, {className: "w-32 h-32 opacity-50"})}</div>
              <h2 className="text-3xl font-semibold text-slate-500 mb-3">Welcome to {APP_TITLE}</h2>
              <p className="text-slate-400 max-w-md">
                Select a notebook from the list on the left, or create a new one to begin transforming your research into engaging content.
              </p>
            </div>
          )}
        </main>
      </div>

      {isCreateModalOpen && (
        <CreateNotebookModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateNotebook}
        />
      )}
       <footer className="w-full p-3 bg-slate-900 border-t border-slate-700/50 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} {APP_TITLE}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;