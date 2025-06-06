
import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import { ContentIdea } from '../types'; // Corrected import path
import { Icons, PLATFORM_OPTIMIZATION_OPTIONS, DEFAULT_CONTENT_IDEA_REFINEMENT_PARAMETERS } from '../constants';

interface EditIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ideaData: Partial<ContentIdea>, existingIdeaId?: string) => void;
  ideaToEdit?: ContentIdea | null;
}

const EditIdeaModal: React.FC<EditIdeaModalProps> = ({ isOpen, onClose, onSave, ideaToEdit }) => {
  const [postText, setPostText] = useState('');
  const [platform, setPlatform] = useState<string>(PLATFORM_OPTIMIZATION_OPTIONS[0]);
  const [contentType, setContentType] = useState('');
  const [visualConceptPrompt, setVisualConceptPrompt] = useState('');
  const [hashtags, setHashtags] = useState(''); // Comma-separated string
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (ideaToEdit) {
        setPostText(ideaToEdit.postText || '');
        setPlatform(ideaToEdit.platform || PLATFORM_OPTIMIZATION_OPTIONS[0]);
        setContentType(ideaToEdit.contentType || '');
        setVisualConceptPrompt(ideaToEdit.visualConceptPrompt || '');
        setHashtags((ideaToEdit.hashtags || []).join(', '));
      } else {
        // Reset for new idea
        setPostText('');
        setPlatform(PLATFORM_OPTIMIZATION_OPTIONS[0]);
        setContentType('');
        setVisualConceptPrompt('');
        setHashtags('');
      }
      setError('');
    }
  }, [isOpen, ideaToEdit]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) {
      setError('Post text is required.');
      return;
    }
    if (!contentType.trim()) {
      setError('Content type is required.');
      return;
    }
    
    const ideaData: Partial<ContentIdea> = {
      postText: postText.trim(),
      platform: platform.trim(),
      contentType: contentType.trim(),
      visualConceptPrompt: visualConceptPrompt.trim(),
      hashtags: hashtags.split(',').map(h => h.trim()).filter(h => h),
    };

    if (!ideaToEdit) { // For new ideas, ensure refinementParameters and other defaults
      ideaData.refinementParameters = DEFAULT_CONTENT_IDEA_REFINEMENT_PARAMETERS;
      ideaData.isManual = true;
      ideaData.isPinned = false;
    }
    
    onSave(ideaData, ideaToEdit?.id);
    onClose();
  }, [postText, platform, contentType, visualConceptPrompt, hashtags, onSave, ideaToEdit, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={ideaToEdit ? "Edit Content Idea" : "Add New Content Idea"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="postText" className="block text-sm font-medium text-slate-300 mb-1">Post Text</label>
          <textarea
            id="postText"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows={4}
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500"
            placeholder="Write your engaging post copy here..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-slate-300 mb-1">Platform</label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500"
            >
              {PLATFORM_OPTIMIZATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="contentType" className="block text-sm font-medium text-slate-300 mb-1">Content Type</label>
            <input
              type="text"
              id="contentType"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500"
              placeholder="e.g., Image Post, Video Script"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="visualConceptPrompt" className="block text-sm font-medium text-slate-300 mb-1">Visual Concept Prompt</label>
          <textarea
            id="visualConceptPrompt"
            value={visualConceptPrompt}
            onChange={(e) => setVisualConceptPrompt(e.target.value)}
            rows={2}
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500"
            placeholder="e.g., Vibrant flat lay of healthy food..."
          />
        </div>

        <div>
          <label htmlFor="hashtags" className="block text-sm font-medium text-slate-300 mb-1">Hashtags (comma-separated)</label>
          <input
            type="text"
            id="hashtags"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500"
            placeholder="#innovation, #futuretech, #strategy"
          />
        </div>

        {error && <p className="text-sm text-red-400" role="alert">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-600 hover:bg-slate-500 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-md transition-colors flex items-center gap-2"
          >
            {React.cloneElement(Icons.save, {className: "w-4 h-4"})} {ideaToEdit ? "Save Changes" : "Add Idea"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditIdeaModal;
