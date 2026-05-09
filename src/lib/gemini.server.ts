import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || 
                       process.env.GEMINI_API_KEY || 
                       (import.meta as any).env?.VITE_GEMINI_API_KEY || 
                       "";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateGeminiContent(prompt: string, modelName: string = "gemini-2.0-flash") {
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function generateGeminiJSON(prompt: string, modelName: string = "gemini-2.0-flash") {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  const text = await generateGeminiContent(prompt + "\n\nIMPORTANT: Return EXACTLY a JSON object or array. No markdown, no triple backticks.", modelName);
  
  try {
    // Clean potential markdown artifacts
    const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Failed to parse Gemini JSON:", text);
    throw new Error("Gemini returned invalid JSON");
  }
}
