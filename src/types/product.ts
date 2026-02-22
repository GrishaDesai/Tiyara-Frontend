export interface Product {
    _id: string;
    Product_id: number;
    URL: string;
    Category: string;
    image_url: string;
    BrandName: string;
    Individual_category: string;
    Description: string;
    DiscountPrice: number;
    OriginalPrice: number;
    DiscountOffer: string;
    SizeOption: string;
    Ratings: number;
    Reviews: number;
    tags: string;
}

export interface ProductWithScore {
    product: Product;
    score: number;
}

export interface ImageRecommendation {
    productId: string;
    score: number;
}

export interface ImageApiResponse {
    recommendations: ImageRecommendation[];
    error?: string;
}

export interface Recommendation {
    recommended_product: Product;
}