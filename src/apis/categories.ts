import type { Result } from "../types/result";
import  type{Product} from "../types/product";
import type { IndividualCategory } from "../types/individualCategory";
import type{MainCategory} from "../types/mainCategory"

// const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
const apiUrl = import.meta.env.VITE_APP_API_URL;

export const fetchCategories = async (): Promise<Result> => {
    try {
        const response = await fetch(`${apiUrl}/allCategories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json() as Promise<Result>;

    } catch (err) {
        console.error('Error fetching categories:', err);
        throw err; // Re-throw to allow component to handle errors
    }
};

export const fetchCategoryProducts = async (
    category: string
): Promise<{ products: Product[]; categories: IndividualCategory[] }> => {
    const response = await fetch(`${apiUrl}/category_product/${category}`);
    const result: {
        data?: {
            filtered_products?: Product[];
            categories?: IndividualCategory[];
        };
        error?: string | null;
        message?: string;
    } = await response.json();

    if (result.error) {
        throw new Error(result.message || "Failed to fetch products");
    }

    return {
        products: result.data?.filtered_products || [],
        categories: result.data?.categories || [],
    };
};


export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
    try {
        const response = await fetch(`${apiUrl}/allCategories/${category}`);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.message);
            return [];
        }

        return data.data || [];
    } catch (err) {
        console.error("Fetch error:", err);
        return [];
    }
};

export const fetchMainCategories = async (): Promise<MainCategory[]> => {
    try {
        const response = await fetch(`${apiUrl}/main_category`);
        const data = await response.json();

        if (data.error) {
            console.error("Error fetching categories:", data.message);
            return [];
        }
        return data.data || data; // some APIs send {data: []}, some just []
    } catch (err) {
        console.error("Error fetching categories:", err);
        return [];
    }
};