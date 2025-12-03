import { GoogleGenAI } from "@google/genai";
import { Book, Student, Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askLibrarian = async (
  query: string, 
  contextData: { books: Book[], students: Student[], transactions: Transaction[] }
): Promise<string> => {
  try {
    const systemPrompt = `
      You are Athena, a helpful and intelligent School Librarian Assistant.
      
      Here is the current library database context:
      - Total Books: ${contextData.books.length}
      - Books Catalog: ${JSON.stringify(contextData.books.map(b => ({ title: b.title, author: b.author, category: b.category, status: b.status })))}
      
      Your goal is to help the librarian or students by:
      1. Recommending books based on the catalog.
      2. Answering questions about availability.
      3. Summarizing book contents if known (you have general knowledge).
      4. Suggesting administrative actions based on the data.

      Keep answers concise, professional, yet friendly. If a book is not in the catalog, clearly state that.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the library network (AI Service) right now.";
  }
};