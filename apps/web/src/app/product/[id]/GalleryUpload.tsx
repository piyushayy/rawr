"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { uploadGalleryPost } from "./gallery-actions";
import { toast } from "sonner";
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function GalleryUpload({ productId }: { productId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        formData.append('product_id', productId);

        const result = await uploadGalleryPost(formData);

        setLoading(false);
        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Post live! +50 CLOUT EARNED");
            setIsOpen(false);
            setPreview(null);
        }
    };

    if (!isOpen) {
        return (
            <Button variant="outline" onClick={() => setIsOpen(true)} className="gap-2 w-full border-dashed border-2">
                <Camera className="w-4 h-4" /> POST YOUR FIT (+50 CLOUT)
            </Button>
        );
    }

    return (
        <div className="border-2 border-rawr-black p-4 bg-gray-50">
            <form action={handleSubmit} className="space-y-4">
                <h4 className="font-bold uppercase">Upload Fit Pic</h4>

                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    required
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-none file:border-0
                    file:text-sm file:font-bold
                    file:bg-rawr-black file:text-white
                    hover:file:bg-gray-800"
                />

                {preview && (
                    <div className="relative w-full h-64 border border-gray-300">
                        <Image src={preview} alt="Preview" fill className="object-cover" />
                    </div>
                )}

                <input
                    name="caption"
                    placeholder="Caption this..."
                    className="w-full p-2 border border-gray-300 rounded font-bold"
                />

                <div className="flex gap-2">
                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>CANCEL</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "POSTING..." : "POST TO GALLERY"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
