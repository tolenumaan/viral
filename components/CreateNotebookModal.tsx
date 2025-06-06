
import React, { useState, useCallback } from 'react';
import Modal from './Modal'; 
import { Icons } from '../constants';

interface CreateNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, campaignName: string) => void;
}

const CreateNotebookModal: React.FC<CreateNotebookModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Notebook name is required.');
      return;
    }
    if (!campaignName.trim()) {
      setError('Campaign name is required.');
      return;
    }
    onCreate(name.trim(), campaignName.trim());
    setName('');
    setCampaignName('');
    setError('');
  }, [name, campaignName, onCreate]);

  React.useEffect(() => {
    if (!isOpen) {
      setName('');
      setCampaignName('');
      setError('');
    }
  }, [isOpen]);


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Notebook" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="notebookName" className="block text-sm font-medium text-slate-300 mb-1.5">
            Notebook Name
          </label>
          <input
            type="text"
            id="notebookName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 bg-slate-700/70 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
            placeholder="e.g., Q4 Product Launch Strategy"
            required
            aria-required="true"
            aria-describedby={error && name.trim() === '' ? "name-error" : undefined}
          />
        </div>
        <div>
          <label htmlFor="campaignName" className="block text-sm font-medium text-slate-300 mb-1.5">
            Campaign / Research Project
          </label>
          <input
            type="text"
            id="campaignName"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="w-full p-2.5 bg-slate-700/70 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
            placeholder="e.g., Holiday Season 2024 Outreach"
            required
            aria-required="true"
            aria-describedby={error && campaignName.trim() === '' ? "campaign-error" : undefined}
          />
        </div>
        {error && <p id={name.trim() === '' ? "name-error" : "campaign-error"} className="text-sm text-red-400" role="alert">{error}</p>}
        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors flex items-center gap-2 shadow hover:shadow-md"
          >
            {React.cloneElement(Icons.add, {className: "w-4 h-4"})} Create Notebook
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateNotebookModal;