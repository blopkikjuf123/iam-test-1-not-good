import { GoogleGenAI } from "@google/genai";

// We use Gemini to simulate the other "Mages" (Grok, etc) for this demo.
// In a production app, this would route to a backend that calls the specific APIs.

export const generateAgentOutput = async (
  apiKey: string,
  agentName: string,
  systemPrompt: string,
  domain: string,
  niche: string,
  previousContext: string = ""
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure it in Settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Construct a prompt that forces Gemini to roleplay as the specific Mage
  const fullPrompt = `
    CONTEXT:
    You are an AI Agent named "${agentName}" inside the "Infinite Affiliate Machine" system.
    Target Domain: ${domain}
    Target Niche: ${niche}
    
    YOUR SYSTEM INSTRUCTION:
    ${systemPrompt}

    PREVIOUS STEP CONTEXT (If any):
    ${previousContext}

    TASK:
    Execute your directives immediately. 
    Do not explain what you are doing, just provide the final OUTPUT of your work.
    If the output format is JSON, ensure it is valid JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        temperature: 0.7, // Creativity balance
      }
    });

    return response.text || "No output generated.";
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return `Error generating content: ${error.message}`;
  }
};