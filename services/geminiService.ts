import { GoogleGenAI, Chat, GenerateContentResponse, Part } from '@google/genai';
import { INITIAL_SYSTEM_PROMPT } from '../constants';

// A extensible in-memory store for different AI clients, extensible for future use customizing its characteristics unique to each user'
const clients: { [key: string]: GoogleGenAI } = {};

function getGeminiClient(): GoogleGenAI {
  const provider = 'google';
  if (!clients[provider]) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set.");
    }
    clients[provider] = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return clients[provider];
}

// Converts a File object to a GoogleGenerativeAI.Part object.
export async function fileToGenerativePart(file: File): Promise<Part> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // Splitting to get only the base64 part
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Or handle the error appropriately
      }
    };
    reader.readAsDataURL(file);
  });
  const base64EncodedData = await base64EncodedDataPromise;
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}


export function createGameSession(): Chat {
  const ai = getGeminiClient();
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: INITIAL_SYSTEM_PROMPT,
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
    },
  });
  return chat;
}

export async function sendMessageToAIStream(
  chat: Chat, 
  message: string,
  imagePart?: Part
): Promise<AsyncGenerator<GenerateContentResponse>> {
    
    const parts = imagePart ? [ { text: message }, imagePart] : [{ text: message }];

    // Fix for: Argument of type 'Part[]' is not assignable to parameter of type 'SendMessageParameters'.
    // The `sendMessageStream` method expects an object with a `message` property that holds the array of parts,
    // not just the parts array directly.
    const response = await chat.sendMessageStream({ message: parts });
    return response;
}