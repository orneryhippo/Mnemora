
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are Memora AI, a world-class memory coach and cognitive scientist. 
Your goal is to help users improve their memory using evidence-based techniques like spaced repetition, the Method of Loci, chunking, and elaborative encoding.
Always explain the "why" behind memory techniques.
Be encouraging and scientific.
If the user asks for complex mnemonics or study plans, use your thinking capability to generate the most effective associations.`;

export const getGeminiResponse = async (messages: ChatMessage[]) => {
  const contents = messages.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 32768 }
      },
    });

    return {
      text: response.text || "I'm sorry, I couldn't generate a response.",
      thought: response.candidates?.[0]?.groundingMetadata ? "Grounding used" : undefined
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
