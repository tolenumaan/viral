
import React from 'react';
import { ParameterSettings, ContentIdeaRefinementParameters } from './types';

export const APP_TITLE = "ViralLens";

export const DEFAULT_PARAMETER_SETTINGS: ParameterSettings = {
  tone: 'Casual',
  contentStyle: 'Educational',
  complexity: 'Detailed',
  urgencyCTA: 'Medium',
  visualStyle: 'Bold',
  platformOptimization: 'General',
};

export const DEFAULT_CONTENT_IDEA_REFINEMENT_PARAMETERS: ContentIdeaRefinementParameters = {
  lighting: 'Bright Studio',
  scenery: 'Neutral Backdrop',
  storyboardNotes: '',
  customVisualPromptOverride: '',
};

export const TONE_OPTIONS: ParameterSettings['tone'][] = ['Professional', 'Casual', 'Playful', 'Informative', 'Witty'];
export const CONTENT_STYLE_OPTIONS: ParameterSettings['contentStyle'][] = ['Educational', 'Entertainment', 'Promotional', 'Storytelling', 'News'];
export const COMPLEXITY_OPTIONS: ParameterSettings['complexity'][] = ['Simple', 'Detailed', 'Technical'];
export const URGENCY_CTA_OPTIONS: ParameterSettings['urgencyCTA'][] = ['Soft', 'Medium', 'Strong'];
export const VISUAL_STYLE_OPTIONS: ParameterSettings['visualStyle'][] = ['Minimalist', 'Bold', 'Artistic', 'Natural', 'Futuristic'];
export const PLATFORM_OPTIMIZATION_OPTIONS: ParameterSettings['platformOptimization'][] = ['Instagram', 'TikTok', 'LinkedIn', 'Twitter', 'Blog', 'General'];

export const LIGHTING_OPTIONS: string[] = ['Bright Studio', 'Golden Hour', 'Dramatic Shadows', 'Natural Daylight', 'Neon Glow', 'Soft Ambient', 'Cinematic'];
export const SCENERY_OPTIONS: string[] = ['Neutral Backdrop', 'Urban Street', 'Lush Forest', 'Mountain Peak', 'Beach Sunset', 'Abstract Gradient', 'Minimalist Interior', 'Cyberpunk Cityscape'];

export const IDEA_CARD_COLORS: { name: string, twClasses: string, sampleTwClasses: string }[] = [
  { name: 'Default', twClasses: 'bg-slate-800 border-slate-700 text-slate-200', sampleTwClasses: 'bg-slate-700' },
  { name: 'Rose', twClasses: 'bg-rose-900/30 border-rose-700/70 text-rose-200', sampleTwClasses: 'bg-rose-500' },
  { name: 'Sky', twClasses: 'bg-sky-900/30 border-sky-700/70 text-sky-200', sampleTwClasses: 'bg-sky-500' },
  { name: 'Teal', twClasses: 'bg-teal-900/30 border-teal-700/70 text-teal-200', sampleTwClasses: 'bg-teal-500' },
  { name: 'Amber', twClasses: 'bg-amber-900/30 border-amber-700/70 text-amber-200', sampleTwClasses: 'bg-amber-500' },
  { name: 'Violet', twClasses: 'bg-violet-900/30 border-violet-700/70 text-violet-200', sampleTwClasses: 'bg-violet-500' },
];


export const Icons = {
  upload: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.046 11.135" />
    </svg>
  ),
  add: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"> {/* Adjusted size for better fit in buttons */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  plusCircle: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  notebook: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  ),
  folderOpen: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L12 3m0 0l-1.5 1.5M12 3v5.25A2.25 2.25 0 0014.25 10.5h2.25M12 3H7.5a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25V9A2.25 2.25 0 0016.5 6.75H12" />
    </svg>
  ),
  close: (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"> {/* Adjusted size */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  file: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="file-icon">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h4.5m0 0l1.125-1.125M12.75 21H5.625c-.621 0-1.125-.504-1.125-1.125V4.125C4.5 3.504 5.004 3 5.625 3h12.75c.621 0 1.125.504 1.125 1.125V11.25a9 9 0 00-9-9H8.25m0 0H5.625M3.375 19.5h17.25" />
    </svg>
  ),
  fileCsv: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="file-icon text-green-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5h15M4.5 16.5h15M4.5 13.5h15M4.5 10.5h15M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  filePdf: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="file-icon text-red-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M12.75 19.5V12.75M12.75 12.75H9M12.75 12.75H16.5M5.625 3H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 16.5h3" /> {/* PDF text inside */}
    </svg>
  ),
  fileDoc: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="file-icon text-blue-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h4.5M8.25 12h4.5m-4.5 3.75h4.5M5.625 3H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  fileImage: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="file-icon text-purple-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159M15.112 5.112a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  fileVideo: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="file-icon text-orange-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
    </svg>
  ),
  fileAudio: (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="file-icon text-pink-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
  ),
  trash: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"> {/* Adjusted size for menu items */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.243.096 3.267.267m-3.267-.267L3.469 3.465A2.25 2.25 0 001.125 5.102l1.613 1.612m0 0l.005.005m-.005-.005L5.69 7.165m0 0l.005.005m-.005-.005l1.612 1.612m0 0l.005.005m-.005-.005L8.83 10.33m0 0l.005.005m-.005-.005l1.613-1.613m0 0l.005.005m-.005-.005L12.06 7.165m0 0l.005.005m-.005-.005L13.673 5.55m0 0l.005.005m-.005-.005l1.613-1.613m0 0l.005.005m-.005-.005L16.84 2.25m0 0l.005.005m-.005-.005L18.453.636m0 0l.005.005M19.53 2.25l.005.005m0 0l.005.005M21.75 4.5l.005.005m0 0l.005.005" />
    </svg>
  ),
  ai: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"> {/* Consistent size */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l.813 2.846a2.25 2.25 0 01-1.545 1.545L14.67 12.75l-2.846-.813a2.25 2.25 0 01-1.545-1.545L9.464 7.5l2.846.813a2.25 2.25 0 011.545 1.545L16.536 12l2.846-.813a2.25 2.25 0 011.545-1.545L21.75 7.5l-.813-2.846a2.25 2.25 0 011.545-1.545L25.33 2.25l2.846.813a2.25 2.25 0 011.545 1.545L30.536 7.5l-2.846.813a2.25 2.25 0 01-1.545 1.545L23.33 12.75l-2.846-.813a2.25 2.25 0 01-1.545-1.545L18.25 7.5z" />
    </svg>
  ),
  checkCircle: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400"> {/* Consistent size */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  xCircle: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-400"> {/* Consistent size */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  sliders: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
  ),
  lightbulb: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.355a15.002 15.002 0 01-7.5 0C4.502 20.995 2.25 16.228 2.25 12c0-1.75.501-3.368 1.372-4.758A9.71 9.71 0 0112 3c2.959 0 5.641 1.091 7.628 2.911A9.74 9.74 0 0121.75 12c0 4.228-2.252 8.995-5.25 10.833z" />
    </svg>
  ),
  imageGeneration: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159M15.112 5.112a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12 18.75m-2.625-2.625a2.625 2.625 0 105.25 0 2.625 2.625 0 10-5.25 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /> {/* Sparkle-like element representing AI */}
    </svg>
  ),
  arrowUp: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
    </svg>
  ),
  arrowDown: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
    </svg>
  ),
  checkboxChecked: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-sky-500">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  checkboxUnchecked: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-slate-500">
      <rect x="3.5" y="3.5" width="13" height="13" rx="2.5" stroke="currentColor" />
    </svg>
  ),
  save: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  ),
  discard: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  chevronDown: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  ),
   chevronUp: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  ),
  editPencil: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  ),
  pinActive: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-sky-400">
      <path fillRule="evenodd" d="M10.472 1.028a.75.75 0 00-.944 0L6.363 4.243a.75.75 0 01-.678.221l-3.91-.754a.75.75 0 00-.836.51L.004 6.51a.75.75 0 00.51.836l3.91.754a.75.75 0 01.222.678l-.755 3.91a.75.75 0 00.836.51l2.245-.935a.75.75 0 01.678.222l3.215 3.135a.75.75 0 00.944 0l3.215-3.135a.75.75 0 01.678-.222l2.245.935a.75.75 0 00.836-.51l.935-2.245a.75.75 0 00-.51-.836l-3.91-.754a.75.75 0 01-.222-.678l.755-3.91a.75.75 0 00-.836-.51l-2.245.935a.75.75 0 01-.678-.222L10.472 1.028z" clipRule="evenodd" />
    </svg>
  ),
  pinInactive: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75v.007M12 3.375A3.375 3.375 0 008.625 0H7.5a2.25 2.25 0 00-2.25 2.25v1.5M12 3.375A3.375 3.375 0 0115.375 0H16.5a2.25 2.25 0 012.25 2.25v1.5" />
    </svg>
  ),
  palette: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.39 1.024 0 1.414l-.527.737c-.25.35-.272.806-.108 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.11v1.093c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.39.39.39 1.024 0 1.414l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.78.93l-.15.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.149-.894c-.07-.424-.384-.764-.78-.93-.398-.164-.854-.142-1.204.108l-.738.527a1.125 1.125 0 01-1.45-.12l-.773-.774a1.024 1.024 0 010-1.414l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.11v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.024 1.024 0 010-1.414l.774-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.93l.15-.894z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  menuDotsVertical: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
  ),
};