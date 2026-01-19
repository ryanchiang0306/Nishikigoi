
import { GoogleGenAI, Type } from "@google/genai";
import { GradingResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function simulateAIGrading(imageBase64: string): Promise<GradingResult> {
  const model = 'gemini-3-flash-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: "Analyze this Nishikigoi (Koi fish) based on three professional criteria: Body Shape (体型), Pattern (模様), and Quality (質). Return the scores (out of 100) and a brief summary in Traditional Chinese. Be realistic and critical like a professional judge." },
          { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          bodyShape: { type: Type.NUMBER },
          pattern: { type: Type.NUMBER },
          quality: { type: Type.NUMBER },
          summary: { type: Type.STRING }
        },
        required: ["bodyShape", "pattern", "quality", "summary"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function getProfessionalTerms(term: string): Promise<string> {
  const model = 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model,
    contents: `Explain the Nishikigoi terminology "${term}" to a beginner. Keep it professional, concise, and in Traditional Chinese.`
  });
  return response.text;
}
