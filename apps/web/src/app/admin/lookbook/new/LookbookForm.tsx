'use client';

import { createLookbookEntry } from "../actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export default function LookbookForm({ products }: { products: { id: string, title: string }[] }) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        try {
            const result = await createLookbookEntry(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Look created.");
            }
        } catch (e) {
            toast.error("Failed to create look.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="font-bold uppercase text-sm">Image URL</label>
                <input
                    name="image_url"
                    required
                    placeholder="https://..."
                    className="w-full p-3 border-2 border-rawr-black bg-white focus:outline-none focus:ring-4 focus:ring-rawr-black/10"
                />
            </div>

            <div className="space-y-2">
                <label className="font-bold uppercase text-sm">Title (Optional)</label>
                <input
                    name="title"
                    placeholder="The Midnight Run"
                    className="w-full p-3 border-2 border-rawr-black bg-white focus:outline-none focus:ring-4 focus:ring-rawr-black/10"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="font-bold uppercase text-sm">Linked Product</label>
                    <select
                        name="product_id"
                        className="w-full p-3 border-2 border-rawr-black bg-white focus:outline-none"
                    >
                        <option value="none">-- No Link --</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="font-bold uppercase text-sm">Display Order</label>
                    <input
                        name="display_order"
                        type="number"
                        defaultValue="0"
                        className="w-full p-3 border-2 border-rawr-black bg-white focus:outline-none"
                    />
                </div>
            </div>

            <Button disabled={loading} className="w-full h-14 bg-rawr-black text-white hover:bg-gray-800 text-xl">
                {loading ? "UPLOADING..." : "UPLOAD ENTRY"}
            </Button>
        </form>
    );
}
