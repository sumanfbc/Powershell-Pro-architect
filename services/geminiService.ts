
import { GoogleGenAI, Type } from "@google/genai";
import { PSFunctionRequest, PSFunctionResponse } from "../types";

const MODEL_NAME = 'gemini-3-pro-preview';

export const generatePSFunction = async (request: PSFunctionRequest): Promise<PSFunctionResponse> => {
  // Always use process.env.API_KEY directly as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are an expert PowerShell architect. Your goal is to generate professional, industry-standard PowerShell functions.
    
    Guidelines:
    1. Use Verb-Noun naming convention (e.g., Get-Data, Set-Configuration).
    2. Use [CmdletBinding()] for advanced functions.
    3. Include proper parameter validation attributes where necessary.
    4. Implement Try/Catch blocks for robust error handling if requested.
    5. Provide high-quality Comment-Based Help (.SYNOPSIS, .DESCRIPTION, .PARAMETER, .EXAMPLE).
    6. Ensure the code is readable and uses proper indentation.
    7. Return the response in the specified JSON format.
  `;

  const prompt = `
    Generate a PowerShell function based on the following requirements:
    - Description: ${request.description}
    - Complexity Level: ${request.complexity}
    - Include Comment-Based Help: ${request.includeHelp ? 'Yes' : 'No'}
    - Include Error Handling: ${request.includeErrorHandling ? 'Yes' : 'No'}

    Be sure to strictly follow PowerShell best practices.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          code: {
            type: Type.STRING,
            description: "The complete PowerShell function code."
          },
          explanation: {
            type: Type.STRING,
            description: "A brief summary of how the function works."
          },
          bestPractices: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of best practices followed in this specific code."
          }
        },
        required: ["code", "explanation", "bestPractices"]
      }
    }
  });

  try {
    // Accessing .text as a property as required by guidelines.
    const data = JSON.parse(response.text || '{}');
    return data as PSFunctionResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid response format from AI");
  }
};
