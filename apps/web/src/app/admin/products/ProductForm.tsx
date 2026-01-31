"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
// import { toast } from "sonner"; // Can add client side toast, but server actions redirect currently.
// Using native form features for simplicity in Phase 3.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductForm({ action, initialData }: { action: any, initialData?: any }) {
    const [loading, setLoading] = useState(false);

    return (
        <form
            action={(formData) => {
                setLoading(true);
                action(formData);
            }}
            className="bg-white p-8 border border-gray-200 rounded-lg space-y-6 max-w-4xl"
        >
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                    <label className="font-bold text-sm uppercase">Title</label>
                    <input
                        name="title"
                        required
                        defaultValue={initialData?.title}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="space-y-2">
                    <label className="font-bold text-sm uppercase">Price ($)</label>
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        required
                        defaultValue={initialData?.price}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="space-y-2">
                    <label className="font-bold text-sm uppercase">Size</label>
                    <select
                        name="size"
                        defaultValue={initialData?.size || 'M'}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="S">Small</option>
                        <option value="M">Medium</option>
                        <option value="L">Large</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="font-bold text-sm uppercase">Condition</label>
                    <input
                        name="condition"
                        defaultValue={initialData?.condition || "Vintage - Excellent"}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="space-y-2">
                    <label className="font-bold text-sm uppercase">Category</label>
                    <select
                        name="category"
                        defaultValue={initialData?.category || 'tops'}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="tops">Tops</option>
                        <option value="bottoms">Bottoms</option>
                        <option value="outerwear">Outerwear</option>
                        <option value="accessories">Accessories</option>
                    </select>
                </div>

                <div className="space-y-2 col-span-2">
                    <label className="font-bold text-sm uppercase">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        defaultValue={initialData?.description}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="space-y-2 col-span-2">
                    <label className="font-bold text-sm uppercase">Images (Comma Separated URLs)</label>
                    <input
                        name="images"
                        placeholder="https://..., https://..."
                        defaultValue={initialData?.images?.join(', ')}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <p className="text-xs text-gray-500">For Phase 3 demo, paste direct image URLs.</p>
                </div>

                <div className="space-y-2 col-span-2">
                    <label className="font-bold text-sm uppercase">Details (One per line)</label>
                    <textarea
                        name="details"
                        rows={4}
                        defaultValue={initialData?.details?.join('\n')}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                {/* Measurements */}
                <div className="col-span-2">
                    <label className="font-bold text-sm uppercase block mb-2">Measurements</label>
                    <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded border border-gray-200">
                        <div>
                            <label className="text-xs font-bold uppercase">Chest</label>
                            <input name="measure_chest" defaultValue={initialData?.measurements?.chest} className="w-full p-1 border rounded" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase">Length</label>
                            <input name="measure_length" defaultValue={initialData?.measurements?.length} className="w-full p-1 border rounded" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase">Sleeve</label>
                            <input name="measure_sleeve" defaultValue={initialData?.measurements?.sleeve} className="w-full p-1 border rounded" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase">Waist</label>
                            <input name="measure_waist" defaultValue={initialData?.measurements?.waist} className="w-full p-1 border rounded" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase">Inseam</label>
                            <input name="measure_inseam" defaultValue={initialData?.measurements?.inseam} className="w-full p-1 border rounded" />
                        </div>
                    </div>
                </div>

                {initialData && (
                    <div className="col-span-2 flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="sold_out"
                            id="sold_out"
                            defaultChecked={initialData.sold_out}
                            className="w-5 h-5"
                        />
                        <label htmlFor="sold_out" className="font-bold uppercase text-sm">Mark as Sold Out</label>
                    </div>
                )}

                <div className="space-y-2 col-span-2">
                    <label className="font-bold text-sm uppercase">Release Date (Leave empty for immediate drop)</label>
                    <input
                        type="datetime-local"
                        name="release_date"
                        defaultValue={initialData?.release_date ? new Date(initialData.release_date).toISOString().slice(0, 16) : ''}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

            </div>

            <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full h-12 bg-rawr-black text-white hover:bg-gray-800">
                    {loading ? "SAVING..." : "SAVE PRODUCT"}
                </Button>
            </div>
        </form>
    );
}
