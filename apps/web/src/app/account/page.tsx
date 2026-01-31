import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Heart, Trophy } from "lucide-react";
import Image from "next/image";
import { TierBadge } from "@/components/shared/TierBadge";
import { getNextTier } from "@/utils/tiers";

export default async function AccountPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // Compute Tier Info
    const clout = profile?.clout_score || 0;
    const nextTier = getNextTier(clout);
    const progress = nextTier
        ? Math.min(100, Math.max(0, (clout / nextTier.minClout) * 100))
        : 100;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-rawr-black text-white p-8 rounded-lg relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Trophy className="w-64 h-64" />
                </div>

                <div className="relative z-10 w-24 h-24 rounded-full border-4 border-rawr-red overflow-hidden bg-gray-800 shrink-0">
                    {profile?.avatar_url ? (
                        <Image src={profile.avatar_url} alt="You" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-black">
                            {profile?.full_name?.[0] || user.email?.[0]}
                        </div>
                    )}
                </div>

                <div className="relative z-10 flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center md:items-baseline gap-4 mb-1">
                        <h1 className="text-3xl font-heading font-black uppercase">
                            {profile?.full_name || "Rawr Recruit"}
                        </h1>
                        <TierBadge clout={clout} />
                    </div>
                    <p className="text-gray-400 font-bold uppercase text-sm mb-4">{user.email}</p>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <div className="bg-white/10 px-4 py-2 rounded">
                            <p className="text-xs uppercase text-gray-400 font-bold">Clout Score</p>
                            <p className="text-2xl font-black text-rawr-red">{clout}</p>
                        </div>
                    </div>
                </div>

                {/* Tier Progress */}
                {nextTier && (
                    <div className="relative z-10 w-full md:w-64 bg-white/10 p-4 rounded backdrop-blur-sm">
                        <div className="flex justify-between text-xs font-bold uppercase mb-2">
                            <span>Current Progress</span>
                            <span>{nextTier.name}</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-rawr-red"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-right text-xs mt-2 text-gray-400">
                            {nextTier.minClout - clout} pts to unlock {nextTier.name} perks
                        </p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/orders" className="group">
                    <div className="border-2 border-rawr-black p-6 hover:bg-black hover:text-white transition-colors h-full">
                        <Package className="w-8 h-8 mb-4 group-hover:text-rawr-red transition-colors" />
                        <h3 className="text-xl font-heading font-black uppercase mb-2">Orders</h3>
                        <p className="text-sm font-bold text-gray-500 group-hover:text-gray-400">Track shipments and view history.</p>
                    </div>
                </Link>

                <Link href="/account/addresses" className="group">
                    <div className="border-2 border-rawr-black p-6 hover:bg-black hover:text-white transition-colors h-full">
                        <MapPin className="w-8 h-8 mb-4 group-hover:text-rawr-red transition-colors" />
                        <h3 className="text-xl font-heading font-black uppercase mb-2">Addresses</h3>
                        <p className="text-sm font-bold text-gray-500 group-hover:text-gray-400">Manage shipping destinations.</p>
                    </div>
                </Link>

                <Link href="/account/wishlist" className="group">
                    <div className="border-2 border-rawr-black p-6 hover:bg-black hover:text-white transition-colors h-full">
                        <Heart className="w-8 h-8 mb-4 group-hover:text-rawr-red transition-colors" />
                        <h3 className="text-xl font-heading font-black uppercase mb-2">The Stash</h3>
                        <p className="text-sm font-bold text-gray-500 group-hover:text-gray-400">Your curated wishlist.</p>
                    </div>
                </Link>
            </div>

            <div className="bg-rawr-black text-white p-8 border-2 border-rawr-black relative overflow-hidden group">
                <div className="absolute inset-0 bg-rawr-red/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-heading font-black uppercase mb-2">Recruit The Pack</h2>
                        <p className="text-gray-300 font-bold max-w-md">
                            Share your code. Earn 500 Clout for every new member who joins the hierarchy.
                        </p>
                    </div>
                    <div className="bg-white text-rawr-black p-4 font-mono font-black text-2xl tracking-widest border-4 border-dashed border-gray-400">
                        {profile?.referral_code || "GENERATING..."}
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 p-8 border border-gray-200 text-center">
                <h3 className="font-heading font-bold uppercase text-lg mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">Issues with your order or questions about the cult?</p>
                <Button variant="outline">Contact Support</Button>
            </div>
        </div>
    );
}
