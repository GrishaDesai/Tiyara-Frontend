// types/chatbot.ts

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    products?: ChatProduct[];
    timestamp: number;
}

export interface ChatProduct {
    Product_id: number;
    BrandName: string;
    Individual_category: string;
    Description: string;
    OriginalPrice: number;
    DiscountOffer: string;
    image_url: string;
    Ratings: number;
}

export interface ChatRequest {
    message: string;
    conversation_history: { role: "user" | "assistant"; content: string }[];
}

export interface ChatResponse {
    reply: string;
    products: ChatProduct[];
    is_product_query: boolean;
}