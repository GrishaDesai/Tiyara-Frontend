import React, { useState } from "react"
import "../styles/skintone.css"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import skintoneimg from "../assets/image/skintone.png"
import SmallLoader from "../components/SmallLoader"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { predictSkinTone, type SkinToneData } from "../apis/skintone"
import type { Result } from "../types/result"
import type { Product } from "../types/product"

export default function SkintoneDemo() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [response, setResponse] = useState<Result<SkinToneData> | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const products: Product[] = [];
    const navigate = useNavigate()

    const toggleLogin = () => {
        setIsExpanded((prev) => !prev)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedImage) {
            setResponse({
                data: { skin_tone: "" },
                error: true,
                message: "Please select an image.",
            })
            return
        }

        setIsLoading(true)
        setResponse(null)

        const res = await predictSkinTone(selectedImage)
        setResponse(res)

        setIsLoading(false)
    }

    const toneMap: Record<string, string> = {
        light: "Fair",
        "mid-light": "Medium",
        "mid-dark": "Olive",
        dark: "Deep",
    }

    return (
        <div className="wrapper relative mx-auto mt-24 shadow-xl overflow-hidden text-center">
            <Navbar
                products={products}
                setFilteredProducts={() => { }}
                resetFilters={() => { }}
            />
            <div
                className={`login-text ${isExpanded ? "expand" : ""} bg-gradient-to-l from-lavender to-rose transition-all duration-500 ease-in-out`}
            >
                <button
                    className="cta flex items-center justify-center text-xl bg-wine"
                    onClick={toggleLogin}
                >
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {!isExpanded && (
                    <p className="collapsed-msg absolute bottom-16 left-1/2 -translate-x-1/2 text-ivory text-3xl font-semibold">
                        Unlock your Perfect Skintone
                    </p>
                )}

                <div className={`text ${isExpanded ? "show-hide" : ""}`}>
                    <div className="bg-ivory bg-opacity-90 rounded-xl shadow-lg p-8 max-w-md w-full mx-auto mt-4 text-center">
                        <h1 className="text-2xl font-bold text-plum mb-6">Skin Tone Detector</h1>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="flex flex-col items-center">
                                <label htmlFor="image-upload" className="mb-2 font-medium text-plum">
                                    Select an Image
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setSelectedImage(e.target.files[0])
                                        }
                                    }}
                                    className="text-sm text-wine cursor-pointer file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0 file:font-semibold
                  file:bg-lavender file:text-ivory hover:file:bg-lightLavender"
                                />
                                {selectedImage && (
                                    <p className="mt-2 text-sm text-rose">Selected: {selectedImage.name}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!selectedImage || isLoading}
                                className="w-full bg-rose text-ivory font-semibold py-2 px-4 rounded-full
                hover:bg-wine transition duration-300 ease-in-out
                disabled:bg-gray disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Processing..." : "Predict Skin Tone"}
                            </button>
                        </form>

                        {isLoading && <SmallLoader />}

                        {response && (
                            <div
                                className={`mt-5 p-3 rounded-lg ${response.error
                                    ? "bg-red-100 border border-red-400 text-red-600"
                                    : "bg-blush border border-rose text-rose"
                                    }`}
                            >
                                {response.error ? (
                                    <strong>Error:</strong>
                                ) : (
                                    <strong>Result:</strong>
                                )}{" "}
                                {response.error
                                    ? response.message
                                    : toneMap[response.data?.skin_tone || ""] || "Unknown"}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="call-text flex flex-col mt-24 justify-center items-center gap-3">
                <img src={skintoneimg} alt="skintone" />
                <button
                    className="bg-wine px-5 py-2 w-1/2 rounded-3xl shadow-2xl text-moonstone"
                    onClick={() => navigate("/skintone-guide")}
                >
                    Get Personalized Color Suggestions
                </button>
            </div>
        </div>
    )
}