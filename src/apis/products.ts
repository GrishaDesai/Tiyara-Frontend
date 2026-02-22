import type { Result } from "../types/result";
import type { ImageApiResponse, Product, ProductWithScore } from "../types/product";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export const fetchAllProducts = async (): Promise<Result<Product[]>> => {
    try {
        const response = await fetch(`${apiUrl}/allProducts`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json() as Promise<Result<Product[]>>;
    } catch (err) {
        console.error("Error fetching products:", err);
        throw err;
    }
};

export const fetchImageRecommendations = async (file: File): Promise<ProductWithScore[]> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${apiUrl}/image-recommend`, {
        method: "POST",
        body: formData,
    });

    const result: ImageApiResponse = await response.json();

    if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to fetch recommendations");
    }

    const productsWithScores: (ProductWithScore | null)[] = await Promise.all(
        result.recommendations.map(async (rec) => {
            try {
                const productResponse = await fetch(`${apiUrl}/products/${rec.productId}`);
                const productResult: Result<Product> = await productResponse.json();

                if (productResponse.ok && !productResult.error) {
                    return {
                        product: productResult.data,
                        score: rec.score,
                    };
                } else {
                    console.error(`Failed to fetch product ${rec.productId}`, productResult.error);
                    return null;
                }
            } catch (err) {
                console.error(`Error fetching product ${rec.productId}`, err);
                return null;
            }
        })
    );

    return productsWithScores.filter((p): p is ProductWithScore => p !== null);
};

export const fetchProductsByPrice = async (price: string): Promise<Product[]> => {
    try {
        const response = await fetch(`${apiUrl}/prices/${price}`);
        const result: Result<Product[]> = await response.json();

        if (result.error) throw new Error(result.message || "Failed to fetch products");
        return result.data;
    } catch (error) {
        console.error("Error fetching products by price:", error);
        return [];
    }
};

export const fetchRecommendations = async (id: string): Promise<Result<{ recommendations: { recommended_product: Product }[]; product: Product }>> => {
    try {
        const response = await fetch(`${apiUrl}/recommend/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        return await response.json();
    } catch (error) {
        return {
            data: { recommendations: [], product: {} as Product },
            message: "Network error while fetching recommendations",
            error: (error as Error).message,
        };
    }
};