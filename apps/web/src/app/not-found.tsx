import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-rawr-black text-rawr-white text-center p-4">
            <h1 className="text-[10rem] md:text-[15rem] leading-none font-heading font-black text-rawr-red select-none">
                404
            </h1>
            <h2 className="text-2xl md:text-4xl font-heading font-bold uppercase mb-8">
                You Are Lost In The Void
            </h2>
            <p className="font-body text-gray-400 max-w-md mb-8">
                The page you are looking for does not exist. It may have been dropped, sold out, or deleted from existence.
            </p>
            <Link href="/">
                <Button size="lg" className="bg-white text-rawr-black hover:bg-rawr-red hover:text-white border-2 border-white">
                    RETURN TO BASE
                </Button>
            </Link>
        </div>
    );
}
