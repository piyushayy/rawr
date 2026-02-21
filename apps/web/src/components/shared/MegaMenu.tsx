"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface MegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MegaMenu = ({ isOpen, onClose }: MegaMenuProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={isOpen ? { opacity: 1, y: 0, height: "auto" } : { opacity: 0, y: -20, height: 0 }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-rawr-white border-b-2 border-rawr-black shadow-xl overflow-hidden z-40"
            onMouseLeave={onClose}
        >
            <div className="container mx-auto px-4 py-8 grid grid-cols-4 gap-8">
                {/* Column 1: New Arrivals */}
                <div className="space-y-4">
                    <h3 className="text-rawr-red font-heading font-black uppercase text-xl mb-4">New In</h3>
                    <Link href="/shop?sort=newest" className="group block relative aspect-[4/3] overflow-hidden border-2 border-transparent bg-gray-100 mb-2">
                        {/* Placeholder for dynamic image or use a static asset */}
                        <div className="absolute inset-0 bg-rawr-black/10 group-hover:bg-transparent transition-colors" />
                        <span className="absolute bottom-2 left-2 bg-rawr-black text-white px-2 font-bold text-xs uppercase">Latest Drop</span>
                    </Link>
                    <Link href="/shop?sort=newest" className="block font-bold hover:text-rawr-red hover:underline decoration-2 underline-offset-4 decoration-rawr-red uppercase">
                        Shop All New Arrivals
                    </Link>
                </div>

                {/* Column 2: Categories */}
                <div className="space-y-4">
                    <h3 className="text-rawr-black font-heading font-black uppercase text-xl mb-4">Clothing</h3>
                    <ul className="space-y-2 font-body font-bold text-lg text-gray-600">
                        {["Tees", "Hoodies", "Jackets", "Pants", "Shorts", "Dresses", "Skirts"].map((item) => (
                            <li key={item}>
                                <Link
                                    href={`/shop?category=${item.toLowerCase()}`}
                                    className="hover:text-rawr-red hover:pl-2 transition-all block uppercase"
                                >
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Accessories */}
                <div className="space-y-4">
                    <h3 className="text-rawr-black font-heading font-black uppercase text-xl mb-4">Accessories</h3>
                    <ul className="space-y-2 font-body font-bold text-lg text-gray-600">
                        {["Hats", "Bags", "Jewelry", "Socks", "Masks", "Misc"].map((item) => (
                            <li key={item}>
                                <Link
                                    href={`/shop?category=${item.toLowerCase()}`}
                                    className="hover:text-rawr-red hover:pl-2 transition-all block uppercase"
                                >
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 4: Collections */}
                <div className="space-y-4">
                    <h3 className="text-rawr-black font-heading font-black uppercase text-xl mb-4">Collections</h3>
                    <ul className="space-y-2 font-heading font-black text-2xl uppercase">
                        <li>
                            <Link href="/drops" className="hover:text-rawr-red decoration-rawr-red">
                                Upcoming Drops
                            </Link>
                        </li>
                        <li>
                            <Link href="/shop?collection=bestsellers" className="hover:text-rawr-red decoration-rawr-red">
                                Best Sellers
                            </Link>
                        </li>
                        <li>
                            <Link href="/archive" className="text-rawr-red hover:text-red-700">
                                The Vault
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};
