import { createClient } from "@/utils/supabase/server";
import { Star, CheckCircle } from "lucide-react";
import ReviewForm from "./ReviewForm";

export default async function ReviewsSection({ productId }: { productId: string }) {
    const supabase = await createClient();

    const { data: reviews } = await supabase
        .from("reviews")
        .select(`
            *,
            profiles (full_name) -- Assuming we link this later, or use auth metadata
        `)
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

    // Calculate average
    const total = reviews?.length || 0;
    const average = total > 0
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? (reviews?.reduce((acc: number, r: any) => acc + r.rating, 0) || 0) / total
        : 0;

    return (
        <div className="mt-16 border-t-2 border-rawr-black pt-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-heading font-black uppercase">Reviews ({total})</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`w-5 h-5 ${star <= Math.round(average) ? "fill-rawr-black text-rawr-black" : "text-gray-300"}`} />
                            ))}
                        </div>
                        <span className="font-bold text-lg">{average.toFixed(1)} / 5.0</span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {reviews?.map((review: any) => (
                        <div key={review.id} className="border-b-2 border-gray-200 pb-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className={`w-4 h-4 ${star <= review.rating ? "fill-rawr-black text-rawr-black" : "text-gray-300"}`} />
                                        ))}
                                    </div>
                                    {review.is_verified && (
                                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 uppercase">
                                            <CheckCircle className="w-3 h-3" /> Verified Buyer
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-gray-400 font-bold">{new Date(review.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="font-bold text-gray-800 leading-relaxed mb-3">{review.comment}</p>
                            {review.images && review.images.length > 0 && (
                                <div className="flex gap-2 mt-3 overflow-x-auto pb-2 snap-x">
                                    {review.images.map((img: string, idx: number) => (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img key={idx} src={img} alt="Review" className="w-24 h-24 object-cover border border-rawr-black shrink-0 snap-start" />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {total === 0 && <p className="text-gray-500 italic">No reviews yet. Be the first.</p>}
                </div>

                <div>
                    <ReviewForm productId={productId} />
                </div>
            </div>
        </div>
    );
}
