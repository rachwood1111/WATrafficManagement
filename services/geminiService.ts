import { GoogleGenAI } from "@google/genai";

// Initialize the API client
// Note: The API_KEY is loaded from the environment variables (Settings), not hardcoded here.
const apiKey = process.env.API_KEY;

// Create the instance only if the key exists to prevent immediate crash on load
const ai = apiKey ? new GoogleGenAI({ apiKey: apiKey }) : null;

export const askTrafficAssistant = async (question: string): Promise<string> => {
  if (!ai) {
    console.error("API Key is missing. Please set the API_KEY environment variable in your deployment settings.");
    return "Configuration Error: API Key is missing. Please contact the administrator to set the API_KEY environment variable.";
  }

  try {
    const modelId = 'gemini-2.5-flash'; // Use flash for speed and search capabilities
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are an expert Traffic Management Engineer assistant. 
              The user is in Western Australia (WA). You MUST prioritize the "Main Roads Western Australia (MRWA) Code of Practice" over the standard Austroads Guide to Temporary Traffic Management (AGTTM) whenever there is a conflict.
              
              The user currently has the following data explicitly loaded in their calculator tools:
              - AGTTM Part 3 (Static Worksites)
              - AGTTM Part 4 (Mobile Works)
              - AGTTM Part 5 (Short Term Low Impact Worksites) - NOTE: App has specific MRWA override for Lane Widths (3.2m for 61-70km/h per MRWA CoP).
              - AGTTM Part 6 (Field Staff - Inspection frequencies)
              - AGTTM Part 7 (Traffic Controllers - Sign placement)
              - AGTTM Part 8 (Processes - Road Categorization)
              
              CRITICAL RULES FOR WA:
              1. Lane Widths: MRWA allows 3.2m lane widths for speeds 61-70km/h (Short Term), whereas AGTTM jumps to 3.5m.
              2. Precedence: If AGTTM says one thing (e.g. sign spacing) but MRWA CoP says another, state the MRWA rule as the requirement and note it is a WA specific departure.
              3. Risk: Emphasize that all departures from standard drawings require a documented Risk Assessment.
              
              Question: ${question}`
            }
          ]
        }
      ],
      config: {
        tools: [{ googleSearch: {} }], // Enable search grounding
      }
    });

    // Handling the response structure based on search grounding presence
    let responseText = response.text || "I couldn't find specific information. Please verify with the official AGTTM or MRWA documentation.";
    
    // Append grounding links if available to be helpful
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      const chunks = response.candidates[0].groundingMetadata.groundingChunks;
      const links = chunks
        .map((chunk: any) => chunk.web?.uri)
        .filter((uri: string) => uri)
        .map((uri: string) => `\n- Source: ${uri}`)
        .join('');
      
      if (links) {
        responseText += `\n\nReferences:${links}`;
      }
    }

    return responseText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while trying to fetch that information. Please try again.";
  }
};