'use client';

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteArticle } from "./actions";
import { toast } from "sonner";
import { useState } from "react";

export default function DeleteArticleButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to burn this manifesto?")) return;

        setLoading(true);
        try {
            const result = await deleteArticle(id);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Burned.");
                // Server action revalidates, so UI should update automatically
            }
        } catch (e) {
            toast.error("Failed to delete.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8 hover:bg-red-600"
            onClick={handleDelete}
            disabled={loading}
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    );
}
