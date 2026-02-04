
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// Note: process.env.API_KEY is handled by the platform
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeThreat = async (signature: string): Promise<string> => {
  const ai = getAiClient();
  
  const prompt = `
    As a cybersecurity expert, analyze the following ClamAV malware signature: "${signature}".
    
    Provide a concise report including:
    1. Threat Classification (e.g., Trojan, Worm, Ransomware, PUA).
    2. Typical behavior or symptoms of this threat.
    3. Recommendations for mitigation.
    
    Keep the tone professional and the response under 150 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "No analysis could be generated for this signature.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "The threat intelligence service is currently unavailable. Please check your connectivity.";
  }
};
