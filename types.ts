
export interface UploadedFile {
  id: string;
  name: string;
  type: string; // MIME type or file extension
  size: number;
  fileObject: File; // Actual File object, always present when adding new files
  previewUrl?: string; // For images
  status: 'pending' | 'processing' | 'completed' | 'error';
  extractedText?: string;
  imageAnalysis?: string; // To store AI-generated description/analysis of the image
  processingError?: string;
  progress?: number; // For upload or processing progress, optional
}

export interface ParameterSettings {
  tone: 'Professional' | 'Casual' | 'Playful' | 'Informative' | 'Witty';
  contentStyle: 'Educational' | 'Entertainment' | 'Promotional' | 'Storytelling' | 'News';
  complexity: 'Simple' | 'Detailed' | 'Technical';
  urgencyCTA: 'Soft' | 'Medium' | 'Strong';
  visualStyle: 'Minimalist' | 'Bold' | 'Artistic' | 'Natural' | 'Futuristic';
  platformOptimization: 'Instagram' | 'TikTok' | 'LinkedIn' | 'Twitter' | 'Blog' | 'General';
}

export interface ContentIdeaRefinementParameters {
  lighting: string; // Can use predefined options or allow custom
  scenery: string;  // Can use predefined options or allow custom
  storyboardNotes: string; // Free text for detailed visual direction
  customVisualPromptOverride: string; // User can completely override the visual prompt
}

export interface ContentIdea {
  id: string;
  postText: string;
  platform: string; 
  contentType: string; 
  visualConceptPrompt: string;
  hashtags?: string[];
  isSelected?: boolean;
  generatedImageUrl?: string | null;
  imageGenerationError?: string | null;
  isGeneratingImage?: boolean;
  refinementParameters: ContentIdeaRefinementParameters;
  color?: string; // Tailwind classes for background/border
  isPinned?: boolean;
  isManual?: boolean; // True if manually added by user
}

export interface Notebook {
  id: string;
  name: string;
  campaignName: string;
  files: UploadedFile[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  parameters: ParameterSettings;
  contentIdeas: ContentIdea[];
  aiResearchAnalysis?: string | null; // Store the main analysis result here
}