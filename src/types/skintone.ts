// types/skintone.ts
export interface SkinToneResponse {
    skin_tone: "light" | "mid-light" | "mid-dark" | "dark" | string;
    error?: string;
}

export type ToneMap = Record<string, string>;