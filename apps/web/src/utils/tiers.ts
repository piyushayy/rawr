export const TIERS = {
    INITIATE: {
        name: 'Initiate',
        minClout: 0,
        color: 'bg-gray-500',
        perks: ['Standard Access']
    },
    MEMBER: {
        name: 'Member',
        minClout: 500,
        color: 'bg-rawr-black', // or gold if we want to be fancy, but keeping it rawr
        perks: ['Free Shipping', '5% Off']
    },
    ELITE: {
        name: 'Elite',
        minClout: 2000,
        color: 'bg-rawr-red',
        perks: ['Early Access', 'Secret Shop', 'Free Shipping', '10% Off']
    }
} as const;

export type TierLevel = keyof typeof TIERS;

// Helper to get tier from clout
export function getTier(clout: number) {
    if (clout >= TIERS.ELITE.minClout) return TIERS.ELITE;
    if (clout >= TIERS.MEMBER.minClout) return TIERS.MEMBER;
    return TIERS.INITIATE;
}

export function getNextTier(clout: number) {
    if (clout >= TIERS.ELITE.minClout) return null;
    if (clout >= TIERS.MEMBER.minClout) return TIERS.ELITE;
    return TIERS.MEMBER;
}
