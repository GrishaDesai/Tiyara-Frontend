import type { Result } from "../types/result"

const apiUrl = import.meta.env.VITE_APP_API_URL;


export interface SkinToneData {
    skin_tone: string
}



export const predictSkinTone = async (file: File): Promise<Result<SkinToneData>> => {
    const formData = new FormData()
    formData.append("image", file)

    try {
        const res = await fetch(`${apiUrl}/predict-skin-tone`, {
            method: "POST",
            body: formData,
        })

        return await res.json()
    } catch (err: any) {
        return {
            data: null,
            error: true,
            message: err.message || "Something went wrong",
        }
    }
}