import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateDemoList = async (count: number = 20): Promise<string[]> => {
  if (!apiKey) {
    console.warn("No API Key available for Gemini generation.");
    return [
      "Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince", "Evan Wright",
      "Fiona Gallagher", "George Martin", "Hannah Lee", "Ian Malcolm", "Julia Child"
    ]; // Fallback
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a diverse list of ${count} realistic full names for a workplace team. Return only the names.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText) as string[];
  } catch (error) {
    console.error("Failed to generate demo list:", error);
    return [];
  }
};
