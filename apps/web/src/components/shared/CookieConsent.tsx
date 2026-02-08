'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check local storage
        const consented = localStorage.getItem('rawr-cookie-consent')
        if (!consented) {
            setIsVisible(true)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('rawr-cookie-consent', 'true')
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 z-50 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-800 animate-in slide-in-from-bottom">
            <div className="text-xs md:text-sm text-center md:text-left">
                <p>
                    <span className="font-bold uppercase text-rawr-red">RAWR</span> uses cookies to ensure you get the best experience on our website.
                    By continuing, you agree to our use of cookies.
                </p>
            </div>
            <div className="flex gap-2 shrink-0">
                <Button
                    size="sm"
                    onClick={handleAccept}
                    className="bg-white text-black hover:bg-gray-200 font-bold uppercase text-xs h-8"
                >
                    Accept
                </Button>
            </div>
        </div>
    )
}
