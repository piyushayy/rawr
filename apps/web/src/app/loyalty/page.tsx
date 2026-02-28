import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  Crown,
  Sparkles,
  TrendingUp,
  Unlock,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { TIERS, getTier, getNextTier } from "@/utils/tiers";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function LoyaltyPortal() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/loyalty");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const clout = profile?.clout_score || 0;
  const currentTier = getTier(clout);
  const nextTier = getNextTier(clout);

  const progress = nextTier
    ? Math.min(100, Math.max(0, (clout / nextTier.minClout) * 100))
    : 100;

  return (
    <div className="bg-rawr-black min-h-screen text-white pb-20 pt-10 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-heading font-black uppercase text-transparent stroke-text drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            The Hierarchy
          </h1>
          <p className="text-gray-400 font-bold max-w-lg mx-auto uppercase tracking-widest text-sm">
            Earn clout. Climb the ranks. Unlock the vault.
          </p>
        </div>

        {/* Dashboard Card */}
        <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 p-8 md:p-12 overflow-hidden shadow-[0_0_50px_rgba(230,0,0,0.15)]">
          {/* Glowing background effects based on tier */}
          <div
            className={`absolute top-0 right-0 w-96 h-96 -translate-y-1/2 translate-x-1/3 rounded-full blur-[100px] opacity-20 
                        ${currentTier.name === "Elite" ? "bg-rawr-red" : currentTier.name === "Member" ? "bg-yellow-500" : "bg-gray-500"}`}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left space-y-6">
              <div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">
                  Current Status
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <h2 className="text-5xl font-black uppercase tracking-tighter shadow-sm">
                    {currentTier.name}
                  </h2>
                  {currentTier.name === "Elite" && (
                    <Crown className="w-10 h-10 text-rawr-red animate-pulse" />
                  )}
                </div>
              </div>

              <div>
                <p className="text-4xl font-mono font-black text-rawr-red">
                  {clout.toLocaleString()}{" "}
                  <span className="text-sm text-gray-400 font-sans tracking-widest">
                    CLOUT
                  </span>
                </p>
              </div>

              {nextTier ? (
                <div className="space-y-3 pt-4 border-t border-gray-800">
                  <div className="flex justify-between text-xs font-bold uppercase text-gray-400">
                    <span>Progress to {nextTier.name}</span>
                    <span>{nextTier.minClout.toLocaleString()} required</span>
                  </div>
                  <div className="h-3 bg-gray-900 border border-gray-700 w-full overflow-hidden relative">
                    <div
                      className="h-full bg-rawr-red transition-all duration-1000 ease-out relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:10px_10px] animate-[slide_1s_linear_infinite]" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-500">
                    Only{" "}
                    <span className="text-white">
                      {(nextTier.minClout - clout).toLocaleString()}
                    </span>{" "}
                    clout away from unlocking {nextTier.perks.join(", ")}.
                  </p>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-800">
                  <p className="font-bold text-rawr-red flex items-center gap-2">
                    <Sparkles className="w-5 h-5" /> MAXIMUM CLOUT REACHED. YOU
                    RULE THE CULT.
                  </p>
                </div>
              )}
            </div>

            {/* Perks Summary Wheel */}
            <div className="w-full md:w-1/3 space-y-4">
              <h3 className="font-bold uppercase text-gray-400 text-xs tracking-widest text-center md:text-left mb-4">
                Active Perks
              </h3>
              {currentTier.perks.map((perk, i) => (
                <div
                  key={i}
                  className="bg-gray-900 border border-gray-800 p-4 flex items-center gap-3"
                >
                  <Unlock className="w-4 h-4 text-green-500" />
                  <span className="font-bold text-sm uppercase">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-6 border border-gray-800 text-center space-y-4">
            <TrendingUp className="w-8 h-8 mx-auto text-rawr-red" />
            <h4 className="font-black uppercase">How To Earn</h4>
            <p className="text-sm text-gray-400">
              Earn 100 clout for every $1 spent. Buy drops, gain power.
            </p>
          </div>
          <div className="bg-gray-900 p-6 border border-gray-800 text-center space-y-4">
            <ShieldCheck className="w-8 h-8 mx-auto text-rawr-red" />
            <h4 className="font-black uppercase">Secret Shop</h4>
            <p className="text-sm text-gray-400">
              Hit Elite status to unlock products hidden from the public.
            </p>
          </div>
          <div className="bg-gray-900 p-6 border border-gray-800 text-center space-y-4 flex flex-col justify-between">
            <div>
              <Crown className="w-8 h-8 mx-auto text-rawr-red" />
              <h4 className="font-black uppercase">The Vault</h4>
              <p className="text-sm text-gray-400 mb-4">
                Redeem your clout for exclusive rewards and discounts.
              </p>
            </div>
            <Link href="/shop" className="block w-full">
              <Button className="w-full bg-white text-black hover:bg-gray-200">
                SHOP TO RANK UP
              </Button>
            </Link>
          </div>
        </div>

        {/* All Tiers Breakdown */}
        <div className="pt-12">
          <h3 className="text-3xl font-heading font-black uppercase text-center mb-8">
            Tier Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(TIERS).map((tier) => {
              const isCurrent = currentTier.name === tier.name;
              const isLocked = clout < tier.minClout;

              return (
                <div
                  key={tier.name}
                  className={`p-6 border-2 flex flex-col h-full
                                    ${isCurrent ? "bg-gray-900 border-rawr-red" : "border-gray-800 opacity-70"}
                                    ${isLocked ? "grayscale" : ""}
                                `}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-2xl font-black uppercase">
                      {tier.name}
                    </h4>
                    {isLocked ? (
                      <Lock className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Unlock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xl font-mono text-gray-400 mb-6">
                    {tier.minClout.toLocaleString()}+ Clout
                  </p>

                  <div className="mt-auto space-y-2">
                    {tier.perks.map((perk) => (
                      <div
                        key={perk}
                        className="flex gap-2 items-center text-sm font-bold text-gray-300"
                      >
                        <div className="w-1.5 h-1.5 bg-rawr-red rounded-full" />
                        {perk}
                      </div>
                    ))}
                  </div>

                  {isCurrent && (
                    <div className="mt-6 pt-4 border-t border-gray-800 text-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-rawr-red">
                        Current Rank
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
