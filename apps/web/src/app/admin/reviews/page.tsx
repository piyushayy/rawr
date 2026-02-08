
"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Check, Trash2, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { deleteReview } from "./actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ReviewsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from('reviews')
                .select('*, products(title, images), profiles(full_name, email)')
                .order('created_at', { ascending: false });

            if (data) setReviews(data);
        };
        fetchReviews();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-heading font-black uppercase mb-8">Review Moderation</h1>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-bold uppercase text-xs text-gray-500">Product</th>
                            <th className="p-4 font-bold uppercase text-xs text-gray-500">User</th>
                            <th className="p-4 font-bold uppercase text-xs text-gray-500">Rating</th>
                            <th className="p-4 font-bold uppercase text-xs text-gray-500">Review</th>
                            <th className="p-4 font-bold uppercase text-xs text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reviews.map((review) => (
                            <tr key={review.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 relative bg-gray-100 shrink-0">
                                            {review.products?.images?.[0] && (
                                                <Image src={review.products.images[0]} alt="" fill className="object-cover" />
                                            )}
                                        </div>
                                        <div className="text-xs font-bold w-32 truncate">{review.products?.title}</div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm">
                                    <div className="font-bold">{review.profiles?.full_name || 'Anonymous'}</div>
                                    <div className="text-xs text-gray-400">{review.profiles?.email}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex text-yellow-500">
                                        {Array.from({ length: review.rating }).map((_, i) => (
                                            <span key={i}>★</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 text-sm max-w-md">
                                    <p className="line-clamp-2">{review.comment}</p>
                                    {review.image_url && (
                                        <div className="mt-2 text-xs text-blue-500 underline">View User Image</div>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <form action={async () => {
                                            const res = await deleteReview(review.id);
                                            if (res.success) {
                                                toast("Review Deleted");
                                                setReviews(prev => prev.filter(r => r.id !== review.id));
                                            } else {
                                                toast.error(res.error);
                                            }
                                        }}>
                                            <Button size="icon" variant="destructive" className="h-8 w-8">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
