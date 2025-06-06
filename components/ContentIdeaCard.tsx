
import React, { useState, useRef, useEffect } from 'react';
import { ContentIdea, ContentIdeaRefinementParameters } from '../types';
import { Icons, LIGHTING_OPTIONS, SCENERY_OPTIONS, IDEA_CARD_COLORS } from '../constants';
import LoadingSpinner from './LoadingSpinner';

interface ContentIdeaCardProps {
  idea: ContentIdea;
  onToggleSelect: (id: string) => void;
  onGenerateVisual: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onUpdateRefinement: (id: string, refinements: Partial<ContentIdeaRefinementParameters>) => void;
  onEdit: (idea: ContentIdea) => void;
  onDelete: (id: string) => void;
  onSetColor: (id: string, colorClasses: string) => void;
  onTogglePin: (id: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

const ContentIdeaCard: React.FC<ContentIdeaCardProps> = ({ 
  idea, 
  onToggleSelect, 
  onGenerateVisual,
  onMoveUp,
  onMoveDown,
  onUpdateRefinement,
  onEdit,
  onDelete,
  onSetColor,
  onTogglePin,
  isFirst,
  isLast
}) => {
  const [showRefinements, setShowRefinements] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const colorPaletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (colorPaletteRef.current && !colorPaletteRef.current.contains(event.target as Node)) {
        setShowColorPalette(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleRefinementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdateRefinement(idea.id, { [name]: value } as Partial<ContentIdeaRefinementParameters>);
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggleSelect(idea.id);
  };

  const cardColorClasses = idea.color || IDEA_CARD_COLORS[0].twClasses;
  const activePinIcon = React.cloneElement(Icons.pinActive, {className: "w-4 h-4 text-sky-400"});
  const inactivePinIcon = React.cloneElement(Icons.pinInactive, {className: "w-4 h-4"});


  return (
    <div className={`rounded-xl border shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out ${cardColorClasses}`}>
      {/* Pinned Indicator Bar */}
      {idea.isPinned && <div className="h-1.5 bg-sky-500 rounded-t-xl"></div>}
      
      <div className="p-4">
        {/* Header: Checkbox, Title/Tags, Menu */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start flex-grow min-w-0">
            <label htmlFor={`select-idea-${idea.id}`} className="flex items-center cursor-pointer mr-3 mt-1 shrink-0">
              <input 
                type="checkbox" 
                id={`select-idea-${idea.id}`}
                checked={!!idea.isSelected} 
                onChange={handleCheckboxChange}
                className="sr-only peer"
              />
              <span className={`w-5 h-5 border-2 rounded bg-slate-700 peer-checked:bg-sky-500 peer-checked:border-sky-500 flex items-center justify-center transition-colors ${idea.isSelected ? 'border-sky-500' : 'border-slate-600'}`}>
                {idea.isSelected && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
              </span>
            </label>
            <div className="flex-grow min-w-0">
              <p className="text-base text-slate-100 mb-1.5 whitespace-pre-wrap break-words">{idea.postText}</p>
              <div className="flex flex-wrap gap-x-2 gap-y-1 items-center">
                <span className="text-xs bg-teal-500/70 text-teal-50 px-2 py-0.5 rounded-full">
                  {idea.platform}
                </span>
                <span className="text-xs bg-sky-500/70 text-sky-50 px-2 py-0.5 rounded-full">
                  {idea.contentType}
                </span>
              </div>
            </div>
          </div>
          
          <div className="relative ml-2 shrink-0" ref={menuRef}>
            <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 text-slate-400 hover:text-slate-100 rounded-full hover:bg-slate-700 transition-colors">
              {React.cloneElement(Icons.menuDotsVertical, {className:"w-5 h-5"})}
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-slate-700 border border-slate-600 rounded-md shadow-xl z-10 py-1">
                <button onClick={() => { onEdit(idea); setShowMenu(false); }} className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-600 flex items-center gap-2">
                  {React.cloneElement(Icons.editPencil, {className: "w-4 h-4"})} Edit
                </button>
                <button onClick={() => { onTogglePin(idea.id); setShowMenu(false); }} className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-600 flex items-center gap-2">
                  {idea.isPinned ? activePinIcon : inactivePinIcon} {idea.isPinned ? 'Unpin' : 'Pin'}
                </button>
                <div className="relative" ref={colorPaletteRef}>
                    <button onClick={() => setShowColorPalette(!showColorPalette)} className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-600 flex items-center gap-2">
                        {React.cloneElement(Icons.palette, {className: "w-4 h-4"})} Change Color
                    </button>
                    {showColorPalette && (
                        <div className="absolute -left-36 sm:-left-40 mt-1 w-32 bg-slate-600 border border-slate-500 rounded-md shadow-lg p-2 grid grid-cols-3 gap-2 z-20">
                            {IDEA_CARD_COLORS.map(color => (
                                <button 
                                    key={color.name} 
                                    title={color.name}
                                    onClick={() => { onSetColor(idea.id, color.twClasses); setShowColorPalette(false); setShowMenu(false); }}
                                    className={`w-8 h-8 rounded-full border-2 ${idea.color === color.twClasses ? 'border-white ring-2 ring-sky-400' : 'border-transparent'} hover:opacity-80 transition-opacity ${color.sampleTwClasses}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <button onClick={() => { onMoveUp(idea.id); setShowMenu(false); }} disabled={isFirst} className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-600 flex items-center gap-2 disabled:opacity-50">
                  {React.cloneElement(Icons.arrowUp, {className: "w-4 h-4"})} Move Up
                </button>
                <button onClick={() => { onMoveDown(idea.id); setShowMenu(false); }} disabled={isLast} className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-600 flex items-center gap-2 disabled:opacity-50">
                   {React.cloneElement(Icons.arrowDown, {className: "w-4 h-4"})} Move Down
                </button>
                <div className="my-1 border-t border-slate-600"></div>
                <button onClick={() => { onDelete(idea.id); setShowMenu(false); }} className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-red-700/30 hover:text-red-300 flex items-center gap-2">
                  {React.cloneElement(Icons.trash, {className: "w-4 h-4"})} Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visuals & Refinements */}
      <div className="px-4 pb-4 space-y-3">
        <div className="bg-slate-700/40 p-3 rounded-lg">
          <h5 className="text-xs font-semibold text-slate-400 mb-1">Base Visual Prompt:</h5>
          <p className="text-xs text-slate-300 italic">
            "{idea.visualConceptPrompt || 'No base visual prompt defined.'}"
          </p>
        </div>

        <div>
          {idea.isGeneratingImage ? (
            <div className="flex items-center justify-center h-40 bg-slate-700/60 rounded-lg">
              <LoadingSpinner />
              <span className="ml-2 text-sm text-slate-300">Generating visual...</span>
            </div>
          ) : idea.generatedImageUrl ? (
            <img src={idea.generatedImageUrl} alt="Generated visual concept" className="w-full max-h-72 object-contain rounded-lg border border-slate-600/50"/>
          ) : idea.imageGenerationError ? (
            <div className="p-3 text-center text-xs text-red-300 bg-red-900/40 border border-red-700/60 rounded-lg h-40 flex flex-col items-center justify-center">
                <p className="font-semibold mb-1">Image Generation Failed</p>
                <p className="break-all line-clamp-3" title={idea.imageGenerationError}>{idea.imageGenerationError}</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 bg-slate-700/30 border-2 border-dashed border-slate-600/70 rounded-lg text-slate-500 text-sm">
              Visual will appear here
            </div>
          )}
          <button
            onClick={() => onGenerateVisual(idea.id)}
            disabled={idea.isGeneratingImage}
            className="w-full mt-2.5 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow hover:shadow-md"
          >
            {idea.isGeneratingImage ? <LoadingSpinner small /> : React.cloneElement(Icons.imageGeneration, {className: "w-4 h-4"})}
            {idea.generatedImageUrl ? 'Re-generate Visual' : 'Generate Visual'}
          </button>
        </div>
        
        {/* Refinements Accordion */}
        <div>
          <button 
            onClick={() => setShowRefinements(!showRefinements)}
            className="w-full flex justify-between items-center text-xs text-slate-300 hover:text-sky-300 py-2 px-2.5 bg-slate-700/60 hover:bg-slate-600/80 rounded-lg transition-colors"
            aria-expanded={showRefinements}
            aria-controls={`refinements-${idea.id}`}
          >
            <span>Refine Visual Parameters</span>
            {showRefinements ? React.cloneElement(Icons.chevronUp, {className:"w-4 h-4"}) : React.cloneElement(Icons.chevronDown, {className:"w-4 h-4"})}
          </button>
          {showRefinements && (
            <div id={`refinements-${idea.id}`} className="mt-2 p-3 bg-slate-700/40 rounded-lg space-y-3 border border-slate-600/50">
              <div>
                <label htmlFor={`lighting-${idea.id}`} className="block text-xs font-medium text-slate-400 mb-1">Lighting:</label>
                <select id={`lighting-${idea.id}`} name="lighting" value={idea.refinementParameters.lighting} onChange={handleRefinementChange} className="w-full p-1.5 bg-slate-600/80 border border-slate-500/70 rounded-md text-xs focus:ring-sky-500 focus:border-sky-500">
                  {LIGHTING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  <option value="Custom">Custom (Use Override)</option>
                </select>
              </div>
              <div>
                <label htmlFor={`scenery-${idea.id}`} className="block text-xs font-medium text-slate-400 mb-1">Scenery/Scape:</label>
                <select id={`scenery-${idea.id}`} name="scenery" value={idea.refinementParameters.scenery} onChange={handleRefinementChange} className="w-full p-1.5 bg-slate-600/80 border border-slate-500/70 rounded-md text-xs focus:ring-sky-500 focus:border-sky-500">
                  {SCENERY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                   <option value="Custom">Custom (Use Override)</option>
                </select>
              </div>
              <div>
                <label htmlFor={`storyboardNotes-${idea.id}`} className="block text-xs font-medium text-slate-400 mb-1">Storyboard Notes:</label>
                <textarea 
                    id={`storyboardNotes-${idea.id}`} name="storyboardNotes" 
                    value={idea.refinementParameters.storyboardNotes} onChange={handleRefinementChange} 
                    rows={2}
                    placeholder="e.g., Close-up shot, character looking thoughtful..."
                    className="w-full p-1.5 bg-slate-600/80 border border-slate-500/70 rounded-md text-xs focus:ring-sky-500 focus:border-sky-500 resize-y min-h-[40px]"
                />
              </div>
               <div>
                <label htmlFor={`customVisualPromptOverride-${idea.id}`} className="block text-xs font-medium text-slate-400 mb-1">Custom Visual Prompt (Overrides others):</label>
                <textarea 
                    id={`customVisualPromptOverride-${idea.id}`} name="customVisualPromptOverride" 
                    value={idea.refinementParameters.customVisualPromptOverride} onChange={handleRefinementChange} 
                    rows={2}
                    placeholder="Full detailed prompt to use instead of base + refinements."
                    className="w-full p-1.5 bg-slate-600/80 border border-slate-500/70 rounded-md text-xs focus:ring-sky-500 focus:border-sky-500 resize-y min-h-[40px]"
                />
              </div>
            </div>
          )}
        </div>

        {idea.hashtags && idea.hashtags.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-700/60">
            <h5 className="text-xs font-semibold text-slate-400 mb-1.5">Suggested Hashtags:</h5>
            <div className="flex flex-wrap gap-1.5">
              {idea.hashtags.map((tag, index) => (
                <span key={index} className="text-xs bg-slate-600/70 text-slate-300 px-2 py-0.5 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentIdeaCard;
