
import React from 'react';
import { ParameterSettings } from '../types';
import { 
  TONE_OPTIONS, 
  CONTENT_STYLE_OPTIONS, 
  COMPLEXITY_OPTIONS, 
  URGENCY_CTA_OPTIONS, 
  VISUAL_STYLE_OPTIONS, 
  PLATFORM_OPTIMIZATION_OPTIONS,
  Icons
} from '../constants';

interface ParameterControlsProps {
  currentSettings: ParameterSettings;
  onChange: (newSettings: Partial<ParameterSettings>) => void;
}

const ParameterControls: React.FC<ParameterControlsProps> = ({ currentSettings, onChange }) => {
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value } as Partial<ParameterSettings>);
  };

  const renderSelect = (
    id: keyof ParameterSettings, 
    label: string, 
    options: readonly string[]
  ) => (
    <div className="flex-1 min-w-[180px] sm:min-w-[200px]"> {/* Increased min-width */}
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={currentSettings[id]}
        onChange={handleSelectChange}
        className="w-full p-2.5 bg-slate-700/70 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-shadow"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="p-5 bg-slate-800 rounded-xl border border-slate-700/70 shadow-md">
      <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
        {React.cloneElement(Icons.sliders, {className: "w-5 h-5 mr-2.5 text-sky-400"})}
        Adjust Content Parameters
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
        {renderSelect('tone', 'Tone', TONE_OPTIONS)}
        {renderSelect('contentStyle', 'Content Style', CONTENT_STYLE_OPTIONS)}
        {renderSelect('complexity', 'Complexity', COMPLEXITY_OPTIONS)}
        {renderSelect('urgencyCTA', 'Urgency / CTA', URGENCY_CTA_OPTIONS)}
        {renderSelect('visualStyle', 'Visual Style', VISUAL_STYLE_OPTIONS)}
        {renderSelect('platformOptimization', 'Target Platform', PLATFORM_OPTIMIZATION_OPTIONS)}
      </div>
    </div>
  );
};

export default ParameterControls;