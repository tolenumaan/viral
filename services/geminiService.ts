
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ParameterSettings, ContentIdea, ContentIdeaRefinementParameters } from "../types";
import { DEFAULT_CONTENT_IDEA_REFINEMENT_PARAMETERS } from "../constants";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set in environment variables.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const analyzeImageWithGemini = async (
  imageBase64: string, 
  mimeType: string,
  fileName: string, 
  campaignContext: string
): Promise<string> => {
  if (!ai) {
    return "Error: AI Service is not initialized. API Key might be missing for image analysis.";
  }
  if (!API_KEY) {
    return "Error: API Key for Gemini is not configured. Image analysis cannot proceed.";
  }

  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: imageBase64,
    },
  };

  const textPart = {
    text: `Analyze this image for a campaign titled '${campaignContext}'. 
Describe key objects, the overall scene, dominant colors, visual style, any discernible sentiment or emotion conveyed, and potential themes or ideas relevant to the campaign. 
Focus ONLY on aspects crucial for inspiring content creation.
File name for context: ${fileName}.
Provide a very concise textual description and analysis, strictly under 150 words. Be brief and to the point.`,
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: [{ role: "user", parts: [textPart, imagePart] }], 
      config: {
        temperature: 0.4, // Slightly lower for more factual descriptions
        topP: 0.95,
        topK: 64,
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error(`Error calling Gemini API for image analysis of ${fileName}:`, error);
    if (error instanceof Error) {
      if (error.message.includes("API key not valid")) {
        return `Error: The Gemini API key is not valid. Image analysis failed for ${fileName}.`;
      }
      return `Error during AI image analysis for ${fileName}: ${error.message}`;
    }
    return `An unknown error occurred during AI image analysis for ${fileName}.`;
  }
};


export const performResearchAnalysis = async (
  researchData: Array<{type: 'text' | 'image_description', content: string, fileName: string}>, 
  campaignContext: string
): Promise<{ analysisText: string | null; error: string | null, wasTruncated: boolean }> => {
  if (!ai) {
    return { analysisText: null, error: "Error: AI Service is not initialized. API Key might be missing. Cannot perform detailed analysis.", wasTruncated: false };
  }
  if (!API_KEY) {
    return { analysisText: null, error: "Error: API Key for Gemini is not configured. Detailed analysis cannot proceed.", wasTruncated: false };
  }

  const MAX_CHARS = 250000; 
  let currentChars = 0;
  let wasGloballyTruncated = false; // Renamed for clarity from wasTruncated
  const dataForPrompt: typeof researchData = [];

  for (const item of researchData) {
    // The item.content here is already potentially truncated by NotebookView
    const itemLength = item.content.length + (item.fileName || "").length + 100; 
    if (currentChars + itemLength > MAX_CHARS) {
      wasGloballyTruncated = true;
      break; 
    }
    dataForPrompt.push(item);
    currentChars += itemLength;
  }
  
  const formattedResearchData = dataForPrompt.map(item => 
    `--- File: ${item.fileName} (Content Type: ${item.type === 'text' ? 'Extracted Text' : 'AI Image Description'}) ---\n${item.content}`
  ).join("\n\n---\nEnd of File Content\n---\n\n");
  
  let truncationMessage = "";
  if (wasGloballyTruncated) {
    truncationMessage = "\n\nNOTE: The provided research material was too extensive even after individual item review and has been globally truncated to fit within processing limits. The analysis is based on the initial portion of the combined data.";
  } else if (researchData.some(item => item.content.includes("[Content truncated due to length]"))) {
    truncationMessage = "\n\nNOTE: Some individual research items were too long and their content was truncated before this combined analysis. The analysis considers these abridged versions.";
  }


  const prompt = `
You are an AI Research Analyst for ViralLens. Your task is to analyze the following collection of research materials for a campaign titled "${campaignContext}".
The materials include direct text extracted from documents AND AI-generated textual descriptions of images. You must synthesize insights from ALL available information.${truncationMessage}

The combined research materials are as follows:
---
${formattedResearchData}
---

Based on ALL this research data, please provide:
1.  **Key Themes & Topics (3-5):** Identify the most prominent themes or topics emerging from the combined text and image descriptions. For each, provide a brief 1-2 sentence description.
2.  **Recurring Patterns & Keywords:** List significant recurring patterns, sentiments (e.g., positive comments, concerns), or frequently mentioned keywords/phrases from both text and image data.
3.  **Cross-Modal Connections (if any):** Highlight any interesting connections or correlations between the textual information and the visual information. For example, "The emphasis on 'community' in the documents is visually reinforced by images frequently depicting groups of people."
4.  **Actionable AI Insights & Content Opportunities (2-3):** Suggest 2-3 high-level, actionable insights or content creation opportunities derived from the holistic analysis of all provided materials. These should be specific and creative, tailored to the "${campaignContext}" campaign.

Present your analysis in a clear, structured Markdown format. Ensure good spacing and readability. For example:

## ViralLens AI Research Analysis: ${campaignContext}

### Overall Summary
A brief (2-3 sentences) high-level summary of the core findings from all research materials.

### Key Themes & Topics
*   **Theme 1:** [Description derived from all data]
*   ...

### Recurring Patterns & Keywords
*   **Patterns:** [e.g., Strong positive sentiment towards X in documents, mirrored by joyful expressions in analyzed images.]
*   **Keywords:** [e.g., "keyword A", "visual element B", "concept C"]

### Cross-Modal Connections
*   [e.g., Connection 1 and its implication]
*   ...

### Actionable AI Insights & Content Opportunities
1.  **Insight/Opportunity 1:** [Detailed suggestion based on synthesis.]
2.  **Insight/Opportunity 2:** [Another detailed suggestion.]

Please ensure the output is well-formatted Markdown.
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: [{ role: "user", parts: [{text: prompt}]}],
      config: {
        temperature: 0.6, 
        topP: 0.95,
        topK: 64,
      }
    });
    return { analysisText: response.text.trim(), error: null, wasTruncated: wasGloballyTruncated || researchData.some(item => item.content.includes("[Content truncated due to length]")) };
  } catch (error) {
    console.error("Error calling Gemini API for research analysis:", error);
    if (error instanceof Error) {
      if (error.message.includes("API key not valid")) {
        return { analysisText: null, error: "Error: The provided Gemini API key is not valid. Detailed analysis cannot be performed.", wasTruncated: false };
      }
      return { analysisText: null, error: `Error during AI research analysis: ${error.message}`, wasTruncated: false };
    }
    return { analysisText: null, error: "An unknown error occurred during the AI research analysis.", wasTruncated: false };
  }
};

export const generateContentIdeas = async (
  researchAnalysisSummary: string,
  campaignContext: string,
  parameters: ParameterSettings,
  numberOfIdeas: number = 5
): Promise<ContentIdea[] | { error: string }> => {
  if (!ai) {
    return { error: "Error: AI Service is not initialized. API Key might be missing." };
  }
  if (!API_KEY) {
    return { error: "Error: API Key for Gemini is not configured. Content idea generation cannot proceed." };
  }

  const prompt = `
You are a Creative Content Strategist AI for ViralLens.
Your goal is to generate ${numberOfIdeas} distinct content ideas for a campaign titled "${campaignContext}".
These ideas should be based on the provided Research Analysis Summary and adhere to the specified Content Parameters.

**Research Analysis Summary:**
<research_summary>
${researchAnalysisSummary}
</research_summary>

**Content Parameters:**
*   Tone: ${parameters.tone}
*   Content Style: ${parameters.contentStyle}
*   Complexity: ${parameters.complexity}
*   Urgency/CTA Strength: ${parameters.urgencyCTA}
*   Visual Style for Mockups: ${parameters.visualStyle}
*   Target Platform (or General): ${parameters.platformOptimization}

For each of the ${numberOfIdeas} ideas, provide the following in a JSON array format. Each object in the array should have these keys:
- "id": A unique string identifier for the idea (e.g., "idea-1", "idea-2").
- "postText": The main text/copy for the content piece. This should be well-written and engaging.
- "platform": The primary social media platform this idea is best suited for (e.g., "Instagram Story", "TikTok Video", "LinkedIn Post", "Blog Snippet", "Twitter Thread part 1"). If platformOptimization is "General", suggest the most fitting one.
- "contentType": A brief description of the content format (e.g., "Single Image Post", "Short Video Script Idea (30s)", "Carousel Post - 3 slides outline", "Informative Article Excerpt", "Interactive Poll").
- "visualConceptPrompt": A concise (10-20 words) DALL-E or Imagen style prompt that could be used to generate a visual mockup for this idea, reflecting the Visual Style parameter.
- "hashtags": An array of 3-5 relevant hashtags (strings), like ["#tag1", "#tag2"].

**Example of a single idea object in the JSON array:**
{
  "id": "idea-1",
  "postText": "Did you know? Our new product helps you achieve X, Y, and Z effortlessly! Learn more at the link in bio. #NewProduct #Innovation",
  "platform": "Instagram Post",
  "contentType": "Single Image with Text Overlay",
  "visualConceptPrompt": "Minimalist flat lay of a new tech gadget on a clean pastel background, soft lighting.",
  "hashtags": ["#NewProduct", "#Innovation", "#TechGadget"]
}

Return ONLY the JSON array of content ideas, wrapped in \`\`\`json ... \`\`\` if necessary. Do not include any other text or explanation outside the JSON structure.
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.75, 
        topP: 0.95,
        topK: 64,
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    try {
      const parsedIdeas: Omit<ContentIdea, 'refinementParameters' | 'isSelected' | 'generatedImageUrl' | 'imageGenerationError' | 'isGeneratingImage' | 'color' | 'isPinned' | 'isManual'>[] = JSON.parse(jsonStr);
      
      if (parsedIdeas.length > 0 && typeof parsedIdeas[0].postText === 'string' && typeof parsedIdeas[0].visualConceptPrompt === 'string') {
        return parsedIdeas.map((idea, index) => ({
            ...idea,
            id: idea.id && typeof idea.id === 'string' ? idea.id : `idea-${Date.now()}-${index}`,
            hashtags: Array.isArray(idea.hashtags) ? idea.hashtags : (typeof idea.hashtags === 'string' ? [idea.hashtags] : []),
            isSelected: false,
            generatedImageUrl: null,
            imageGenerationError: null,
            isGeneratingImage: false,
            refinementParameters: DEFAULT_CONTENT_IDEA_REFINEMENT_PARAMETERS,
            color: undefined, // Default color (or can be set by IDEA_CARD_COLORS[0].twClasses)
            isPinned: false,
            isManual: false, // AI generated ideas are not manual
        }));
      } else if (parsedIdeas.length === 0 && numberOfIdeas > 0) {
         return { error: "AI generated an empty list of ideas. Try adjusting parameters or research summary." };
      } else {
        console.error("Parsed JSON does not match ContentIdea structure:", parsedIdeas);
        return { error: "AI response was valid JSON but not in the expected format for content ideas." };
      }
    } catch (e) {
      console.error('Failed to parse JSON response for content ideas:', e, "\nRaw response:", jsonStr);
      return { error: `Failed to parse AI response as JSON. Raw text: ${jsonStr.substring(0,1000)}` };
    }
  } catch (error) {
    console.error('Error calling Gemini API for content ideas:', error);
    if (error instanceof Error) {
      if (error.message.includes("API key not valid")) {
        return { error: "Error: The provided Gemini API key is not valid." };
      }
      return { error: `Error generating content ideas: ${error.message}` };
    }
    return { error: 'An unknown error occurred while generating content ideas.' };
  }
};

export const generateVisualFromPrompt = async (
  prompt: string
): Promise<{ imageUrl?: string; error?: string }> => {
  if (!ai) {
    return { error: "Error: AI Service is not initialized. API Key might be missing for image generation." };
  }
  if (!API_KEY) {
    return { error: "Error: API Key for Gemini is not configured. Image generation cannot proceed." };
  }

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt,
      config: { numberOfImages: 1, outputMimeType: 'image/png' }, // JPG or PNG
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
      return { imageUrl };
    } else {
      return { error: "Image generation succeeded but returned no images." };
    }
  } catch (error) {
    console.error('Error calling Gemini API for image generation:', error);
    if (error instanceof Error) {
       if (error.message.includes("API key not valid")) {
        return { error: "Error: The provided Gemini API key is not valid for image generation." };
      }
      // Check for safety-related errors specifically if the API provides distinct codes/messages
      if (error.message.toLowerCase().includes("safety") || error.message.toLowerCase().includes("policy violation")) {
        return { error: "Image generation blocked due to safety policies. Please revise the prompt." };
      }
      return { error: `Error during image generation: ${error.message}` };
    }
    return { error: 'An unknown error occurred during image generation.' };
  }
};
