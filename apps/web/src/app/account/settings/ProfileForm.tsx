"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { updateProfile } from "./actions";
import { toast } from "sonner";
import { useEffect } from "react";
import { useFormStatus } from "react-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProfileForm({ user, profile }: { user: any, profile: any }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [state, action] = useActionState(updateProfile as any, null) as any;

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
        } else if (state?.success) {
            toast.success("Profile updated successfully.");
        }
    }, [state]);

    return (
        <form action={action} className="space-y-4 max-w-lg">
            <div>
                <label className="block text-sm font-bold uppercase mb-1">Email</label>
                <input
                    disabled
                    value={user.email}
                    className="w-full p-2 border border-gray-300 bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
            </div>

            <div>
                <label className="block text-sm font-bold uppercase mb-1">Full Name</label>
                <input
                    name="full_name"
                    defaultValue={profile?.full_name || ''}
                    className="w-full p-2 border border-gray-300 rounded font-sans"
                    placeholder="Enter your name"
                />
            </div>

            <div>
                <label className="block text-sm font-bold uppercase mb-1">Avatar URL</label>
                <input
                    name="avatar_url"
                    defaultValue={profile?.avatar_url || ''}
                    className="w-full p-2 border border-gray-300 rounded font-sans"
                    placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-1">Paste a direct image link.</p>
            </div>

            <SubmitButton />
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button disabled={pending} type="submit" className="w-full bg-rawr-black text-white uppercase font-bold">
            {pending ? "Saving..." : "Update Profile"}
        </Button>
    );
}
