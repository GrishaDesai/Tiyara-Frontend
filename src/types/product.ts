export interface Product {
    _id: number;
    URL: string;
    Category: string;
    image_url: string;
    BrandName: string;
    Individual_category: string;
    Description: string;
    DiscountPrice: number;
    OriginalPrice: number;
    DiscountOffer: string;
    SizeOption: string; // e.g., "S, M, L, XL, XXL"
    Ratings: number;
    Reviews: number;
    tags: string; // Can be split into string[] if needed
}

export interface ImageRecommendation {
    productId: string;   // changed from url → productId
    score: number;
}

export interface ImageApiResponse {
    recommendations: ImageRecommendation[];
    error?: string;
}

export interface Recommendation {
    recommended_product: Product;
}