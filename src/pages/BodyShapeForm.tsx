import { useState } from "react";
import { useNavigate } from "react-router-dom";
import placeholder from "../assets/image/collage4.webp";

import type {
    BodyShapeFormData,
    BodyShapeDetails,
    Recommendation,
} from "../types/bodyshape";

import {
    fetchBodyShape,
    fetchBodyShapeRecommendations,
} from "../apis/bodyshape";

const BodyShapeForm = () => {
    const [formData, setFormData] = useState<BodyShapeFormData>({
        bust: "",
        waist: "",
        highHip: "",
        hip: "",
        shoulder: "",
    });

    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [waistHipRatio, setWaistHipRatio] = useState<number | null>(null);
    const [details, setDetails] = useState<BodyShapeDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        try {
            const data = await fetchBodyShape(formData);
            setResult(data.bodyShape);
            setWaistHipRatio(data.waistHipRatio);
            setDetails(data.data);
            console.log(data.data);
        } catch (err) {
            console.error(err);
            setError((err as Error).message || "Failed to fetch body shape.");
        }
    };

    const handleRecommendations = async () => {
        if (!result) return; // guard against null
        try {
            setLoading(true);
            setError(null);

            const data = await fetchBodyShapeRecommendations(result);

            navigate("/body-shape/recommendations", {
                state: {
                    recommendedProducts: data.recommended_products,
                    bodyShape: result,
                    bodyShapeData: details,
                },
            });
        } catch (err) {
            setError((err as Error).message || "Failed to fetch recommendations.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-wine flex flex-col md:flex-row p-4 sm:p-6 md:p-8 gap-4 justify-center items-start">
            {/* Form Section */}
            <div className="w-full md:w-1/2 lg:w-1/3 bg-ivory shadow-xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-wine mb-6 text-center">
                    Calculate Your Body Shape
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {["bust", "waist", "highHip", "hip", "shoulder"].map((field) => (
                        <div key={field} className="space-y-2">
                            <label className="block text-plum font-semibold capitalize">
                                {field.replace(/([A-Z])/g, " $1").trim()} Size (cm):
                            </label>
                            <input
                                type="number"
                                name={field}
                                value={formData[field as keyof BodyShapeFormData]}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.1"
                                className="w-full p-3 bg-moonstone border border-mauve rounded-lg text-plum focus:ring-2 focus:ring-lavender"
                                placeholder={`Enter ${field} measurement`}
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-wine text-ivory p-3 rounded-lg hover:bg-plum transition-colors font-semibold"
                    >
                        Calculate Body Shape
                    </button>
                </form>

                {result && (
                    <div className="mt-6 space-y-2 text-center bg-lightLavender/20 p-4 rounded-lg">
                        <p className="text-lg font-semibold text-lavender">
                            Your body shape: <span className="text-wine">{result}</span>
                        </p>
                        <p className="text-lg font-semibold text-lavender">
                            Waist-hip ratio:{" "}
                            <span className="text-wine">{waistHipRatio?.toFixed(2)}</span>
                        </p>
                    </div>
                )}

                {error && (
                    <p className="mt-6 text-center text-rose bg-rose/10 p-3 rounded-lg">
                        {error}
                    </p>
                )}
            </div>

            {/* Results Section */}
            <div className="w-full md:w-1/2 lg:w-1/2 bg-ivory shadow-xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
                {details ? (
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-bold text-wine mb-4 text-center">
                            {details.name}
                        </h1>
                        <p className="text-plum text-lg mb-6 text-center">
                            {details.description}
                        </p>
                        <img
                            src={details.image}
                            alt={details.name}
                            className="w-80 h-96 object-fill rounded-lg mb-6 shadow-md"
                        />

                        {details.recommendations && (
                            <div className="space-y-6 w-full">
                                <h2 className="text-2xl font-semibold text-lavender">
                                    Style Recommendations
                                </h2>
                                {details.recommendations.map(
                                    (item: Recommendation, index: number) => (
                                        <div
                                            key={index}
                                            className="bg-moonstone p-4 rounded-lg shadow-md flex flex-col items-center"
                                        >
                                            <h3 className="text-xl font-semibold text-wine">
                                                {item.name}
                                            </h3>
                                            <p className="text-plum mt-2">{item.description}</p>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-80 h-96 object-cover rounded-md mt-4"
                                            />
                                        </div>
                                    )
                                )}

                                <button
                                    type="button"
                                    onClick={handleRecommendations}
                                    disabled={loading}
                                    className="w-full bg-wine text-ivory p-3 rounded-lg hover:bg-plum transition-colors font-semibold"
                                >
                                    {loading
                                        ? "Loading Recommendations..."
                                        : "Browse clothes for your body shape"}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <img
                        src={placeholder}
                        alt="placeholder"
                        className="w-full h-[90vh] object-cover rounded-lg"
                    />
                )}
            </div>
        </div>
    );
};

export default BodyShapeForm;