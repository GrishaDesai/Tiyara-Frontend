export interface SkinToneData {
    skin_tone: "light" | "mid-light" | "mid-dark" | "dark" | string;
}

export interface SkinToneResponse {
    data: SkinToneData;
    error: boolean;
    message: string;
}

export type ToneMap = Record<string, string>;