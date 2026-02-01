"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="h-[80vh] flex flex-col items-center justify-center text-center p-4">
            <h2 className="text-4xl font-heading font-black uppercase mb-4 text-rawr-black">
                System Failure
            </h2>
            <p className="text-gray-500 mb-8 max-w-md font-body">
                Something went wrong. It's not you, it's the matrix.
                {process.env.NODE_ENV === 'development' && (
                    <span className="block mt-2 text-xs text-red-500 font-mono bg-red-50 p-2 rounded">
                        {error.message}
                    </span>
                )}
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} className="bg-rawr-black text-white hover:bg-rawr-red uppercase font-bold">
                    Try Again
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'} className="uppercase font-bold">
                    Go Home
                </Button>
            </div>
        </div>
    );
}
