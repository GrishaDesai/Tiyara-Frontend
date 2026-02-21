import type{ Occasion } from "../types/occasion";
import type { Result } from "../types/result";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export const fetchOccasions = async (): Promise<Occasion[]> => {
    try {
        const response = await fetch(`${apiUrl}/occasions`);
        const data = await response.json();

        if (data.error) {
            console.error("Error fetching occasions:", data.message);
            return [];
        }
        return data.data || data;
    } catch (err) {
        console.error("Error fetching occasions:", err);
        return [];
    }
};


export const fetchOccasionByName = async (occName: string): Promise<Result> => {
    try {
        const response = await fetch(`${apiUrl}/occasions/${occName}`);
        const data: Result = await response.json();
        return data;
    } catch (error: any) {
        return {
            data: null,
            error: true,
            message: error.message || "Failed to fetch occasion",
        };
    }
};