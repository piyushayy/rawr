import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ orderId: string }> }) {
    const { orderId } = await searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

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

                {!user && (
                    <div className="bg-rawr-red text-white p-6 border-2 border-rawr-black space-y-4 mt-8 text-left">
                        <h3 className="font-heading font-black text-2xl uppercase">Track Your Order</h3>
                        <p className="font-body text-sm font-bold">
                            Create an account now to track your package live and earn Clout points for future exclusive drops.
                        </p>
                        <Link href="/login" className="inline-block mt-2">
                            <Button variant="secondary" className="w-full bg-white text-black hover:bg-gray-200 uppercase font-black tracking-widest flex items-center justify-center gap-2 h-12">
                                Create Account <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                )}

                <div className="pt-4">
                    <Link href="/">
                        <Button variant={user ? "default" : "outline"} className="w-full text-lg h-14 uppercase border-2 border-rawr-black">
                            Return to Base
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
