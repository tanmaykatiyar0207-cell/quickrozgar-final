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

  const model = genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: { responseMimeType: "application/json" }
  });
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    // Clean potential markdown artifacts (though native JSON mode should handle this)
    const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanText);
    
    // If Gemini wrapped the result in a property, try to find it
    if (!Array.isArray(parsed) && typeof parsed === 'object') {
      const firstKey = Object.keys(parsed)[0];
      if (Array.isArray(parsed[firstKey])) return parsed[firstKey];
    }
    
    return parsed;
  } catch (error) {
    console.error("Failed to parse Gemini JSON:", text);
    // If it's not a valid JSON array/object, try to extract anything that looks like JSON
    try {
      const match = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch (innerError) {
      console.error("Secondary parse attempt failed:", innerError);
    }
    throw new Error("Gemini returned invalid JSON");
  }
}
