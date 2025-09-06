import { GoogleGenAI, Chat, GenerateContentResponse, Part, Type } from '@google/genai';
import { INITIAL_SYSTEM_PROMPT } from '../constants';
import { LandListing, User, JournalEntry } from '../types';

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


// FIX: Modified function to accept systemInstruction to resolve argument error.
export function createGameSession(systemInstruction: string): Chat {
  const ai = getGeminiClient();
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
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
  imageParts?: Part[]
): Promise<AsyncGenerator<GenerateContentResponse>> {
    // For multipart messages (with images), the payload should be an array of Part objects.
    // For text-only messages, it's a simple string.
    const messagePayload = (imageParts && imageParts.length > 0)
      ? [{ text: message }, ...imageParts]
      : message;
      
    // The `sendMessageStream` method expects an object with a `message` property
    // containing the payload.
    return chat.sendMessageStream({ message: messagePayload });
}

export async function evaluateTrade(
    chat: Chat,
    userOffer: JournalEntry,
    cloverRequest: JournalEntry
): Promise<string> {
    const prompt = `
        I would like to propose a trade.
        My Offer: ${userOffer.name} (Rarity: ${userOffer.rarity}, Score: ${userOffer.score})
        Your Item: ${cloverRequest.name} (Rarity: ${cloverRequest.rarity}, Score: ${cloverRequest.score})
        What do you think?
    `;

    // We use a non-streaming call for the trade evaluation
    const response = await chat.sendMessage({ message: prompt });
    return response.text;
}


export async function getGeneralChatResponse(message: string, traits: User['cloverTraits']): Promise<string> {
    const ai = getGeminiClient();
    const defaultTraits = { friendliness: 7, curiosity: 8 };
    const currentTraits = traits || defaultTraits;

    const systemPrompt = `You are Clover, a friendly, helpful, and slightly nerdy AI guide for a mineral-sifting game called "RockHound". You are knowledgeable about rocks, minerals, and the local geography. Your personality traits are: Friendliness: ${currentTraits.friendliness}/10 and Curiosity: ${currentTraits.curiosity}/10. Keep your responses concise and in character. Do not perform game actions like identification unless the user explicitly provides an image and asks for it. Focus on being a conversational companion.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
            systemInstruction: systemPrompt
        }
    });

    return response.text;
}

export async function generateMapMarker(mapContext: string): Promise<{ name: string; description: string; }> {
    const ai = getGeminiClient();
    const prompt = `You are a creative geologist for the game "RockHound GO". Based on the following context, invent a plausible and interesting fictional point of interest for a player to discover on their map.
    
    Context: "${mapContext}"

    Provide a name and a short, engaging description for this point of interest. The tone should be mysterious and exciting.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: "A creative and short name for the point of interest (e.g., 'Whispering Geode Cavern', 'Ancient Leviathan Ribcage')."
                    },
                    description: {
                        type: Type.STRING,
                        description: "A one or two-sentence intriguing description of the location, hinting at what might be found there."
                    }
                },
                required: ["name", "description"]
            },
        }
    });

    try {
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return {
            name: data.name || "Mysterious Anomaly",
            description: data.description || "An unusual geological reading from this location. Worth investigating."
        };
    } catch (e) {
        console.error("Failed to parse AI response for map marker:", e);
        // Fallback in case of parsing error
        return {
            name: "Unusual Signal",
            description: "AI scout detected something strange here, but the data was corrupted. Could be anything!",
        };
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