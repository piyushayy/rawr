import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ orderId: string }> }) {
    const { orderId } = await searchParams;

    return (
        <div className="min-h-screen bg-rawr-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <CheckCircle className="w-24 h-24 text-green-500" />
                </div>
                <h1 className="text-4xl font-heading font-black uppercase">Order Confirmed</h1>
                <p className="font-body text-lg">
                    Your order <span className="font-bold text-rawr-red">#{orderId.slice(0, 8)}</span> has been secured.
                </p>
                <div className="bg-gray-100 p-4 border-2 border-rawr-black text-sm">
                    A confirmation email has been sent to your inbox. Tracking details will follow shortly.
                </div>
                <div className="pt-4">
                    <Link href="/">
                        <Button className="w-full text-lg h-14 uppercase">Return to Base</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
