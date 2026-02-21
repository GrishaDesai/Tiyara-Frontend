// types/bodyshape.ts

export interface BodyShapeFormData {
    bust: string;
    waist: string;
    highHip: string;
    hip: string;
    shoulder: string;
}


export interface BodyShapeDetails {
    name: string;
    description: string;
    image: string;
    recommendations?: Recommendation[];
}

export interface Recommendation {
    name: string;
    description: string;
    image: string;
}

export interface BodyShapeData {
    bodyShape: string;
    waistHipRatio: number;
    data: BodyShapeDetails;
}

export interface BodyShapeRecommendationData {
    final_tag: string[];
    recommended_products: any[]; // Replace with Product type if available
}


export interface QuizAnswers {
    widestPart: string;
    waistDefined: string;
    hipsDescription: string;
    broadShoulders: string;
    weightChange: string;
    athleticBuild: string;
    derriere: string;
    bustSize: string;
}

export interface BodyShapeQuizResponse {
    bodyShape: string;
    details: BodyShapeDetails;
}