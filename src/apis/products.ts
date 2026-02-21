import type { Result } from "../types/result";
import type {ImageApiResponse, Product} from "../types/product"

// const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
// const API_BASE_URL = "http://localhost:5000"
const apiUrl = import.meta.env.VITE_APP_API_URL;

export interface ProductWithScore {
    product: Product;
    score: number;
}

export const fetchAllProducts = async (): Promise<Result> => {
    try {
        
        const apiUrl = import.meta.env.VITE_APP_API_URL; // For Vite (not REACT_APP)
        const response = await fetch(`${apiUrl}/allProducts`, {
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
        throw err;
    }
};

// export const fetchImageRecommendations = async (file: File): Promise<ImageApiResponse> => {
//     const formData = new FormData();
//     formData.append("image", file);

//     const response = await fetch(`${apiUrl}/image-recommend`, {
//         method: "POST",
//         body: formData,
//     });

//     const data = await response.json();
//     if (!response.ok) {
//         throw new Error(data.error || "Failed to fetch recommendations");
//     }

//     return data as ImageApiResponse;
// };

// Fetch recommendations → then fetch product details for each productId
export const fetchImageRecommendations = async (file: File): Promise<ProductWithScore[]> => {
    const formData = new FormData();
    formData.append("image", file);

    // Step 1: Get productIds + similarity scores
    const response = await fetch(`${apiUrl}/image-recommend`, {
        method: "POST",
        body: formData,
    });

    const result: ImageApiResponse = await response.json();

    if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to fetch recommendations");
    }

    // Step 2: Fetch product details for each recommended product
    const productsWithScores: ProductWithScore[] = await Promise.all(
        result.recommendations.map(async (rec) => {
            try {
                const productResponse = await fetch(`${apiUrl}/products/${rec.productId}`);
                const productResult = await productResponse.json();

                if (productResponse.ok && !productResult.error) {
                    return {
                        product: productResult.data as Product,
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

    // Filter out nulls if some products fail
    return productsWithScores.filter((p): p is ProductWithScore => p !== null);
};




export const fetchProductsByPrice = async (price: string): Promise<Product[]> => {
    try {
        const response = await fetch(`${apiUrl}/prices/${price}`);
        const result = await response.json();

        if (result.error) {
            throw new Error(result.message || "Failed to fetch products");
        }

        return result.data as Product[];
    } catch (error) {
        console.error("Error fetching products by price:", error);
        return [];
    }
};


export const fetchRecommendations = async (id: string): Promise<Result> => {
    try {
        const response = await fetch(`${apiUrl}/recommend/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data: Result = await response.json();
        return data;
    } catch (error) {
        return {
            data: null,
            message: "Network error while fetching recommendations",
            error: (error as Error).message,
        };
    }
};
