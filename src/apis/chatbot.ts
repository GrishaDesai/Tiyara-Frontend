// apis/chatbot.ts

import type { ChatRequest, ChatResponse } from "../types/chatbot";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
    }

    return response.json() as Promise<ChatResponse>;
};