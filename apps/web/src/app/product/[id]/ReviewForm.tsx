"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addReview } from "./actions";
import { toast } from "sonner";

export default function ReviewForm({ productId }: { productId: string }) {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [loading, setLoading] = useState(false);

    // Simple optimistic user check (would ideally pass from server)
    // For now we just let the server action handle auth error

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        formData.append('rating', rating.toString());
        formData.append('productId', productId);

        const result = await addReview(formData);
        setLoading(false);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Review posted!");
        }
    }

    return (
        <form action={handleSubmit} className="border-2 border-rawr-black p-6 bg-white mt-8">
            <h3 className="font-heading font-bold text-xl uppercase mb-4">Leave a Review</h3>

            <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="focus:outline-none transition-transform hover:scale-110"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(rating)}
                    >
                        <Star
                            className={`w-8 h-8 ${star <= (hover || rating) ? "fill-rawr-black text-rawr-black" : "text-gray-300"}`}
                        />
                    </button>
                ))}
            </div>

            <textarea
                name="comment"
                required
                placeholder="Tell us about the fit, quality, and vibe..."
                className="w-full p-4 border-2 border-rawr-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 min-h-[120px] font-bold"
            />

            <div className="mt-4">
                <label className="block font-bold text-sm mb-2 uppercase text-gray-600">Add a Photo (Optional)</label>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full border-2 border-dashed border-gray-300 p-4 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-rawr-black file:text-white file:font-bold file:uppercase cursor-pointer"
                />
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-4 h-12">
                {loading ? "POSTING..." : "SUBMIT REVIEW"}
            </Button>
        </form>
    );
}
