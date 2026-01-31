import { getTier } from "@/utils/tiers";

interface TierBadgeProps {
    clout: number;
    showPerks?: boolean;
}

export const TierBadge = ({ clout, showPerks = false }: TierBadgeProps) => {
    const tier = getTier(clout);

    return (
        <div className="inline-flex flex-col items-start">
            <span className={`px-2 py-1 text-xs font-bold uppercase text-white rounded ${tier.color}`}>
                {tier.name}
            </span>
            {showPerks && (
                <div className="flex gap-2 mt-2">
                    {tier.perks.map(perk => (
                        <span key={perk} className="text-[10px] uppercase font-bold border border-gray-300 px-1 rounded text-gray-500">
                            {perk}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
