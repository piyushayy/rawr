"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { updateCustomerNotes } from "../actions";
import { toast } from "sonner";
import { useEffect } from "react";

export function CustomerNotesForm({ userId, initialNotes }: { userId: string, initialNotes: string }) {
    const [state, action, isPending] = useActionState(
        updateCustomerNotes.bind(null, userId),
        null
    );

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
        } else if (state?.success) {
            toast.success("Notes updated successfully.");
        }
    }, [state]);

    return (
        <form action={action}>
            <textarea
                name="notes"
                defaultValue={initialNotes}
                className="w-full h-32 p-2 border border-gray-300 resize-none font-sans text-sm mb-2"
                placeholder="Add notes about this customer (VIP, difficult, size preference, etc)..."
            />
            <Button
                type="submit"
                size="sm"
                variant="outline"
                className="w-full"
                disabled={isPending}
            >
                {isPending ? "Saving..." : "Save Notes"}
            </Button>
        </form>
    );
}
