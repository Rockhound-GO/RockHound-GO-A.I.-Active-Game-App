import { GoogleGenAI, Chat, GenerateContentResponse, Part } from '@google/genai';
import { INITIAL_SYSTEM_PROMPT } from '../constants';
import { LandListing } from '../types';

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
    // This function is being corrected to address a recurring '[object Object]' error.
    // The issue stems from incorrect type definitions in the SDK for `chat.sendMessageStream`.
    // The runtime API expects the content (either a string or a Part array) to be passed directly,
    // not wrapped in a `{ message: ... }` object as the types suggest.
    // We use a type assertion `(chat.sendMessageStream as any)` to bypass the faulty
    // typings and send the data in the format the runtime requires.
    if (imagePart) {
        const parts: Part[] = [{ text: message }, imagePart];
        const response = await (chat.sendMessageStream as any)(parts);
        return response;
    } else {
        const response = await (chat.sendMessageStream as any)(message);
        return response;
    }
}

export async function generateListingDescription(listing: LandListing): Promise<string> {
    const ai = getGeminiClient();
    const prompt = `You are an expert copywriter for a premium rockhounding and mineral collecting app. Your task is to transform a landowner's basic property data into a compelling, informative, and safe listing description. The tone should be inviting and professional, highlighting unique features and geological potential. Based on the following data, write a compelling property description. Use a professional and inviting tone, highlight the geological potential, and include a clear summary of the fee and rules.

Input: {
"propertyName": "${listing.propertyName}",
"landOwnerName": "${listing.landOwnerName}",
"location": "${listing.location}",
"fee": ${listing.fee},
"mineralsKnown": ["${listing.mineralsKnown.join('", "')}"],
"accessRules": "${listing.accessRules}",
"additionalNotes": "${listing.additionalNotes}"
}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
}

export async function generateMineralEnrichment(mineralName: string, propertyLocation: string): Promise<string> {
    const ai = getGeminiClient();
    const prompt = `You are an expert mineralogist and content creator for a mobile app. For a user-selected mineral, write a one-paragraph description that includes its key characteristics (color, hardness), how it forms, a fun historical fact or a notable location where it is found, and a short tip for a rockhound looking for it. The language should be accessible to hobbyists. Based on the provided mineral and location, generate a unique and engaging description of the mineral for a rockhounding app. Make sure to connect the description to the general area if possible.

Input: {
"mineralName": "${mineralName}",
"propertyLocation": "${propertyLocation}"
}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
}