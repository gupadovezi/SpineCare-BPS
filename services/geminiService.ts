import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { UserAssessment } from "../types";
import { generateSystemInstruction } from "../utils/constants";

let chatSession: Chat | null = null;

export const initializeChatSession = (assessment: UserAssessment) => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment variables.");
    return;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: generateSystemInstruction(assessment),
      temperature: 0.7, // Balanced creativity and precision
      topK: 40,
      topP: 0.95,
    },
  });
};

export const sendMessageToGemini = async (message: string): Promise<AsyncIterable<string>> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized. Please complete assessment first.");
  }

  try {
    const resultStream = await chatSession.sendMessageStream({ message });
    
    // Create an async generator to yield text chunks
    async function* streamGenerator() {
      for await (const chunk of resultStream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          yield c.text;
        }
      }
    }

    return streamGenerator();

  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};