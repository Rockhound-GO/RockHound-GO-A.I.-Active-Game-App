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
    
    const parts: Part[] = imagePart ? [ { text: message }, imagePart] : [{ text: message }];

    // Fix: There is a discrepancy between the TypeScript definition and the runtime behavior for this method.
    // - The runtime expects the parts array to be passed directly: `chat.sendMessageStream(parts)`.
    // - The TypeScript checker expects an object wrapper: `chat.sendMessageStream({ message: parts })`.
    // Using the object wrapper causes an "[object Object]" error.
    // We use `as any` to bypass the incorrect type definition and send the request in the format the runtime expects.
    const response = await (chat.sendMessageStream as any)(parts);
    return response;
}
