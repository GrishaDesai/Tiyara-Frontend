import type { Occasion } from "../types/occasion";
import type { Result } from "../types/result";
import type { Product } from "../types/product";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export const fetchOccasions = async (): Promise<Occasion[]> => {
    try {
        const response = await fetch(`${apiUrl}/occasions`);
        const data: Result<Occasion[]> = await response.json();

        if (data.error) {
            console.error("Error fetching occasions:", data.message);
            return [];
        }
        return data.data || [];
    } catch (err) {
        console.error("Error fetching occasions:", err);
        return [];
    }
};

export const fetchOccasionByName = async (
    occName: string
): Promise<Result<{ filtered_products: Product[]; categories: string[] }>> => {
    try {
        const response = await fetch(`${apiUrl}/occasions/${occName}`);
        const data: Result<{ filtered_products: Product[]; categories: string[] }> =
            await response.json();
        return data;
    } catch (error) {
        return {
            data: { filtered_products: [], categories: [] },
            error: true,
            message: (error as Error).message || "Failed to fetch occasion",
        };
    }
};