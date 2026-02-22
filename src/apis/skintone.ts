import type { Result } from "../types/result";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export interface SkinToneData {
    skin_tone: string;
}

export const predictSkinTone = async (file: File): Promise<Result<SkinToneData>> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const res = await fetch(`${apiUrl}/predict-skin-tone`, {
            method: "POST",
            body: formData,
        });

        const data: Result<SkinToneData> = await res.json();
        return data;
    } catch (err) {
        return {
            data: { skin_tone: "" },
            error: true,
            message: (err as Error).message || "Something went wrong",
        };
    }
};