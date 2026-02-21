export interface OccasionCategory {
    category: string;
    image: string;
}

export interface Occasion {
    occasion: string;
    image: string;
    categories: OccasionCategory[];
}
