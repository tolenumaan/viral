
import React from 'react';
import { Notebook } from '../types';
import { Icons } from '../constants';

interface NotebookListProps {
  notebooks: Notebook[];
  selectedNotebookId: string | null;
  onSelectNotebook: (id: string) => void;
  onCreateNotebook: () => void;
  onDeleteNotebook: (id: string) => void;
}

const NotebookList: React.FC<NotebookListProps> = ({
  notebooks,
  selectedNotebookId,
  onSelectNotebook,
  onCreateNotebook,
  onDeleteNotebook
}) => {

  const handleDeleteClick = (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>, notebookId: string, notebookName: string) => {
    e.stopPropagation(); 
    if (window.confirm(`Are you sure you want to delete the notebook "${notebookName}" and all its files? This action cannot be undone.`)) {
      onDeleteNotebook(notebookId);
    }
  };

  return (
    <nav className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-200 px-1">Notebooks</h2>
      </div>
      <button
        onClick={onCreateNotebook}
        className="mb-4 w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors shadow hover:shadow-md"
        aria-label="Create a new notebook"
      >
        {React.cloneElement(Icons.add, {className: "w-4 h-4"})} New Notebook
      </button>
      {notebooks.length === 0 && (
        <p className="text-sm text-slate-500 text-center mt-6">No notebooks yet. Create one to get started!</p>
      )}
      <ul className="space-y-1.5 flex-grow overflow-y-auto pr-1 -mr-1">
        {notebooks.map((notebook) => (
          <li key={notebook.id}>
            <button
              onClick={() => onSelectNotebook(notebook.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all duration-150 group relative
                ${
                  selectedNotebookId === notebook.id
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-700/70 hover:text-sky-300'
                }`}
              aria-current={selectedNotebookId === notebook.id ? 'page' : undefined}
            >
              {selectedNotebookId === notebook.id && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-sky-400 rounded-l-lg"></span>
              )}
              <div className="flex items-center overflow-hidden flex-grow">
                 {React.cloneElement(selectedNotebookId === notebook.id ? Icons.folderOpen : Icons.notebook, { 
                    className: `w-5 h-5 mr-2.5 flex-shrink-0 ${selectedNotebookId === notebook.id ? 'text-sky-200' : 'text-slate-400 group-hover:text-sky-300'}`
                 })}
                <span className="truncate text-sm font-medium" title={notebook.name}>{notebook.name}</span>
              </div>
              <div
                onClick={(e) => handleDeleteClick(e, notebook.id, notebook.name)}
                onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') handleDeleteClick(e, notebook.id, notebook.name)}}
                className={`p-1.5 rounded-md text-slate-400 group-hover:text-red-400 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity
                           ${selectedNotebookId === notebook.id ? 'hover:bg-sky-500/50' : 'hover:bg-slate-600/70'}`}
                aria-label={`Delete notebook ${notebook.name}`}
                role="button"
                tabIndex={0}
              >
                {React.cloneElement(Icons.trash, {className: "w-4 h-4"})}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NotebookList;
