'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { updateProfile } from './actions'
import { toast } from 'sonner'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SettingsForm({ initialData }: { initialData: any }) {
    const [loading, setLoading] = useState(false)

    // We use a simple handler wrapper to catch the result
    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const result = await updateProfile(formData)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Profile updated successfully")
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6 max-w-xl">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Full Name</label>
                <input
                    name="full_name"
                    defaultValue={initialData?.full_name || ''}
                    className="w-full p-3 border border-gray-200 rounded font-sans focus:border-black outline-none"
                    placeholder="Your Name"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Phone Number</label>
                <input
                    name="phone"
                    defaultValue={initialData?.phone_number || ''}
                    className="w-full p-3 border border-gray-200 rounded font-sans focus:border-black outline-none"
                    placeholder="+1 555 000 0000"
                />
            </div>

            <div className="pt-2">
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white hover:bg-gray-800 font-bold uppercase px-8"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    )
}
