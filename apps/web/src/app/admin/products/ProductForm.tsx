"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
// import { toast } from "sonner"; // Can add client side toast, but server actions redirect currently.
// Using native form features for simplicity in Phase 3.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductForm({ action, initialData }: { action: any, initialData?: any }) {
    const [loading, setLoading] = useState(false);
    const [variants, setVariants] = useState<any[]>(
        initialData?.variants?.length ? initialData.variants : [{ id: crypto.randomUUID(), sku: '', size: 'OS', stock_quantity: 1 }]
    );

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
                    <label className="font-bold text-sm uppercase">Price (₹)</label>
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
                        <option value="dresses">Dresses</option>
                        <option value="tops">Tops</option>
                        <option value="bottoms">Bottoms</option>
                        <option value="lingerie">Lingerie</option>
                        <option value="outerwear">Outerwear</option>
                        <option value="shoes">Shoes</option>
                        <option value="accessories">Accessories</option>
                        <option value="clothing">Clothing</option>
                        <option value="plus">Plus</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="font-bold text-sm uppercase">Stock Quantity</label>
                    <input
                        name="stock_quantity"
                        type="number"
                        min="0"
                        required
                        defaultValue={initialData?.stock_quantity ?? 1}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
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
                    <label className="font-bold text-sm uppercase">Video URL (Optional)</label>
                    <input
                        name="video_url"
                        placeholder="https://... (MP4 Link)"
                        defaultValue={initialData?.video_url}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <p className="text-xs text-gray-500">Direct link to MP4 background video.</p>
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

                {/* --- SEO SECTION --- */}
                <div className="col-span-2 border-t border-gray-200 mt-6 pt-6">
                    <h3 className="font-heading font-black text-xl mb-4">SEARCH ENGINE OPTIMIZATION (SEO)</h3>
                </div>

                <div className="space-y-2 col-span-2">
                    <label className="font-bold text-sm uppercase">SEO Title</label>
                    <input
                        name="seo_title"
                        defaultValue={initialData?.seo_title}
                        placeholder="e.g. Vintage Leather Jacket | RAWR STORE"
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <p className="text-xs text-gray-500">Overrides the default page title. Keep under 60 characters.</p>
                </div>

                <div className="space-y-2 col-span-2">
                    <label className="font-bold text-sm uppercase">SEO Description</label>
                    <textarea
                        name="seo_description"
                        rows={2}
                        defaultValue={initialData?.seo_description}
                        placeholder="A highly clickable description for Google search results..."
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <p className="text-xs text-gray-500">Keep under 160 characters for best results.</p>
                </div>

                {/* --- VARIANTS SECTION --- */}
                <div className="col-span-2 border-t border-gray-200 mt-6 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-heading font-black text-xl">PRODUCT VARIANTS</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setVariants([...variants, { id: crypto.randomUUID(), sku: '', size: 'OS', stock_quantity: 1 }]);
                            }}
                        >
                            + ADD VARIANT
                        </Button>
                    </div>

                    {/* Hidden input to pass variants JSON to server action */}
                    <input type="hidden" name="variants_json" value={JSON.stringify(variants)} />

                    <div className="space-y-4">
                        {variants.map((variant, index) => (
                            <div key={variant.id} className="flex items-end gap-4 bg-gray-50 p-4 border border-gray-200 rounded relative">
                                <div className="flex-1 space-y-1">
                                    <label className="text-xs font-bold uppercase">Size</label>
                                    <input
                                        value={variant.size}
                                        onChange={(e) => {
                                            const newVariants = [...variants];
                                            newVariants[index].size = e.target.value;
                                            setVariants(newVariants);
                                        }}
                                        className="w-full p-2 border rounded uppercase"
                                        placeholder="OS, S, M, L..."
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <label className="text-xs font-bold uppercase">SKU</label>
                                    <input
                                        value={variant.sku}
                                        onChange={(e) => {
                                            const newVariants = [...variants];
                                            newVariants[index].sku = e.target.value;
                                            setVariants(newVariants);
                                        }}
                                        className="w-full p-2 border rounded uppercase"
                                        placeholder="RAWR-JKT-01"
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <label className="text-xs font-bold uppercase">Stock Qty</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={variant.stock_quantity}
                                        onChange={(e) => {
                                            const newVariants = [...variants];
                                            newVariants[index].stock_quantity = parseInt(e.target.value) || 0;
                                            setVariants(newVariants);
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => {
                                        setVariants(variants.filter((_, i) => i !== index));
                                    }}
                                >
                                    X
                                </Button>
                            </div>
                        ))}
                        {variants.length === 0 && (
                            <p className="text-sm text-gray-500 italic p-4 bg-yellow-50 border border-yellow-200">
                                Warning: No variants defined. Users won't be able to easily select sizes unless relying on fallback logic.
                            </p>
                        )}
                    </div>
                </div>

                {initialData && (
                    <div className="col-span-2 flex items-center gap-2 mt-6 border-t border-gray-200 pt-6">
                        <input
                            type="checkbox"
                            name="sold_out"
                            id="sold_out"
                            defaultChecked={initialData.sold_out}
                            className="w-5 h-5"
                        />
                        <label htmlFor="sold_out" className="font-bold uppercase text-sm">Force Mark as Sold Out (Overrides Variant Stock)</label>
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

            <div className="pt-8">
                <Button type="submit" disabled={loading} className="w-full h-14 text-xl tracking-widest bg-rawr-black text-white hover:bg-rawr-red border-none uppercase shadow-[4px_4px_0px_#FF0000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    {loading ? "SAVING DB..." : "SAVE PRODUCT"}
                </Button>
            </div>
        </form>
    );
}
