
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserInput, Itinerary, GroundingChunk } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

const buildPrompt = (userInput: UserInput): string => {
  return `
    As an expert travel planner, create an optimized travel itinerary based on the following details provided in Chinese.
    The primary goal is to minimize travel time and avoid backtracking, creating the most efficient and logical route.
    For each activity, especially scenic spots, provide photography suggestions including the best camera position, time of day, and orientation.
    The output MUST be a valid JSON object. Do not include any text, markdown, or code block fences before or after the JSON object.

    The JSON structure must be:
    {
      "title": "为[目的地]的旅行计划",
      "itinerary": [
        {
          "day": 1,
          "title": "第一天：[当天主题]",
          "schedule": [
            {
              "time": "HH:MM",
              "activity": "活动名称",
              "description": "活动的简要描述。",
              "transportation": "如何到达该地的交通方式详情。",
              "notes": "任何重要的提示或注意事项。",
              "photoSuggestion": "拍摄建议，例如最佳机位、时间和方位等。"
            }
          ]
        }
      ]
    }

    User's travel details (in Chinese):
    - Destination (旅行目的地): ${userInput.destination}
    - Flight Plan (航班计划): ${userInput.flightPlan}
    - Transportation Plan (交通方式计划): ${userInput.transportation}
    - Accommodation (住宿地点): ${userInput.accommodation}
    - Saved Shops/Places (收藏的店铺/地点): ${userInput.savedPlaces}
    - Local Attractions (当地景点): ${userInput.attractions}

    Please generate the complete itinerary in Chinese.
  `;
};

export const generateTravelPlan = async (
    userInput: UserInput, 
    lat: number | null, 
    lng: number | null
): Promise<{ itinerary: Itinerary | null, groundingChunks: GroundingChunk[] }> => {
  const prompt = buildPrompt(userInput);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleMaps: {}}],
        ...(lat && lng && {
            toolConfig: {
                retrievalConfig: {
                    latLng: {
                        latitude: lat,
                        longitude: lng
                    }
                }
            }
        })
      },
    });

    const groundingChunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as GroundingChunk[];

    const text = response.text.trim();
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

    if (!jsonString) {
      console.error("Empty response from Gemini.");
      throw new Error("Received an empty response from the travel planner.");
    }
    
    const parsedItinerary: Itinerary = JSON.parse(jsonString);
    return { itinerary: parsedItinerary, groundingChunks };

  } catch (error) {
    console.error("Error generating travel plan:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the travel plan. The AI might have returned an invalid format.");
    }
    throw new Error("Could not generate a travel plan. Please check your inputs and try again.");
  }
};