import type { Result } from "../types/result";
import type { Product } from "../types/product";
import type { IndividualCategory } from "../types/individualCategory";
import type { MainCategory } from "../types/mainCategory";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export const fetchCategories = async (): Promise<Result<IndividualCategory[]>> => {
    try {
        const response = await fetch(`${apiUrl}/allCategories`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json() as Promise<Result<IndividualCategory[]>>;
    } catch (err) {
        console.error("Error fetching categories:", err);
        throw err;
    }
};

export const fetchCategoryProducts = async (
    category: string
): Promise<{ products: Product[]; categories: IndividualCategory[] }> => {
    const response = await fetch(`${apiUrl}/category_product/${category}`);
    const result: Result<{ filtered_products?: Product[]; categories?: IndividualCategory[] }> =
        await response.json();

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
        const data: Result<Product[]> = await response.json();

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
        const data: Result<MainCategory[]> = await response.json();

        if (data.error) {
            console.error("Error fetching categories:", data.message);
            return [];
        }
        return data.data || [];
    } catch (err) {
        console.error("Error fetching categories:", err);
        return [];
    }
};