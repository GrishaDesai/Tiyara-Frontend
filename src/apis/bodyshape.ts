// apis/bodyshape.ts
import type {
    BodyShapeFormData,
    BodyShapeData,
    BodyShapeRecommendationData,
    QuizAnswers,
    BodyShapeQuizResponse
} from "../types/bodyshape";

import type{ Result } from "../types/result";

const apiUrl = import.meta.env.VITE_APP_API_URL;

    export const fetchBodyShape = async (
        formData: BodyShapeFormData
    ): Promise<BodyShapeData> => {
        const res = await fetch(`${apiUrl}/body-shape/measurements`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }, 
            body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Failed to fetch body shape");

        const json: Result<BodyShapeData> = await res.json();

        if (json.error) throw new Error(json.message);
        return json.data;
    };

export const fetchBodyShapeRecommendations = async (
    shape: string
): Promise<BodyShapeRecommendationData> => {
    const res = await fetch(`${apiUrl}/recommend/body_shape/${shape}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!res.ok) throw new Error("Failed to fetch recommendations");

    const json: Result<BodyShapeRecommendationData> = await res.json();

    if (json.error) throw new Error(json.message);
    return json.data ;
};


export async function submitBodyShapeQuiz(
    answers: QuizAnswers
): Promise<Result<BodyShapeQuizResponse>> {
    const response = await fetch(`${apiUrl}/body-shape-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
    });

    const data = await response.json();
    return data;
}
