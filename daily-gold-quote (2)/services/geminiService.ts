import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Quote, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const QUOTE_MODEL = "gemini-2.5-flash";
const CHAT_MODEL = "gemini-2.5-flash";

const quoteSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    content: {
      type: Type.STRING,
      description: "The text of the quote. If original is English/Other, provide the Chinese translation primarily.",
    },
    author: {
      type: Type.STRING,
      description: "The author of the quote in Chinese (include English name in parentheses if famous).",
    },
    context: {
      type: Type.STRING,
      description: "A brief, profound interpretation or context of the quote in Chinese.",
    }
  },
  required: ["content", "author"],
};

export const fetchDailyQuote = async (): Promise<Quote> => {
  try {
    const response = await ai.models.generateContent({
      model: QUOTE_MODEL,
      contents: `
        请生成一句深刻、鼓舞人心或充满哲理的“每日金句”。
        
        要求：
        1. 内容（Content）：如果是中文名言，直接提供；如果是外文名言（如英文），请提供优秀的中文翻译，并视情况保留原文（格式示例：“中文翻译。\n"Original English Text"”）。
        2. 语境（Context）：用简练、优美的中文解释这句话的深层含义或背景。
        3. 风格：可以是古诗词、现代文学、哲学名言或电影台词。
        4. 多样性：主题涵盖人生、智慧、自然、美学、孤独等。
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: quoteSchema,
        temperature: 1.1,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as Quote;
    }
    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Error fetching quote:", error);
    // Fallback quote
    return {
      content: "生活不是等待风暴过去，而是学会在雨中翩翩起舞。",
      author: "维维安·格林 (Vivian Greene)",
      context: "面对逆境时，保持优雅与积极的心态本身就是一种胜利。"
    };
  }
};

export const sendChatMessage = async (
  currentQuote: Quote,
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  try {
    const contextPrompt = `
      我们正在讨论这句金句： "${currentQuote.content}" 作者：${currentQuote.author}。
      背景含义：${currentQuote.context || '无'}。
      
      你是一位充满智慧、富有同理心且博学的导师。
      请用中文与用户交流。
      讨论这句话的深层含义，回答用户的疑问，或者探讨相关的哲学话题。
      回答要简练、优美，富有文学性。
    `;

    const chat = ai.chats.create({
      model: CHAT_MODEL,
      config: {
        systemInstruction: contextPrompt,
      },
      history: history.filter(m => m.id !== 'temp').map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "我正在思考...";
  } catch (error) {
    console.error("Error in chat:", error);
    return "抱歉，思绪似乎被打断了，请稍后再试。";
  }
};