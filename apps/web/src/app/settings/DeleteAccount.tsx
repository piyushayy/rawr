'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { deleteAccount } from './actions'
import { useRouter } from 'next/navigation'

export function DeleteAccount() {
    const [isConfirming, setIsConfirming] = useState(false)
    const [confirmText, setConfirmText] = useState('')
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (confirmText !== 'DELETE') return

        setIsPending(true)
        const res = await deleteAccount()

        if (res.error) {
            alert(res.error)
            setIsPending(false)
        } else {
            // Success - Redirect to home (Auth state will verify logout usually)
            // Ideally sign out client side too, but server action deleted user so session is invalid.
            router.push('/')
            router.refresh()
        }
    }

    if (!isConfirming) {
        return (
            <div className="border border-red-200 bg-red-50 p-6 rounded-lg mt-8">
                <h3 className="text-red-800 font-bold uppercase mb-2">Danger Zone</h3>
                <p className="text-sm text-red-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button
                    variant="destructive"
                    onClick={() => setIsConfirming(true)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                    DELETE ACCOUNT
                </Button>
            </div>
        )
    }

    return (
        <div className="border-2 border-red-600 bg-white p-6 rounded-lg mt-8 animate-in fade-in">
            <h3 className="text-red-600 font-black uppercase mb-2">Are you absolutely sure?</h3>
            <p className="text-sm text-gray-600 mb-4">
                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </p>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                        Type <span className="text-black">DELETE</span> to confirm
                    </label>
                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded font-mono"
                        placeholder="DELETE"
                    />
                </div>

                <div className="flex gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => setIsConfirming(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={confirmText !== 'DELETE' || isPending}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold flex-1"
                    >
                        {isPending ? 'DELETING...' : 'CONFIRM DELETION'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
