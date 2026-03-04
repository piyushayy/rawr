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
      animate={
        isOpen
          ? { opacity: 1, y: 0, height: "auto" }
          : { opacity: 0, y: -20, height: 0 }
      }
      exit={{ opacity: 0, y: -20, height: 0 }}
      transition={{ type: "tween", duration: 0.2 }}
      className="absolute top-full left-0 w-full bg-rawr-white border-b-2 border-rawr-black shadow-xl overflow-hidden z-40"
      onMouseLeave={onClose}
    >
      <div className="container mx-auto px-4 py-8 grid grid-cols-4 gap-8">
        {/* Column 1: New Arrivals */}
        {/* Column 1: New Arrivals */}
        <div className="space-y-4">
          <h3 className="text-rawr-red font-heading font-black uppercase text-xl mb-4">
            Latest Drop
          </h3>
          <Link
            href="/shop?sort=newest"
            className="group block relative aspect-[3/4] overflow-hidden border-2 border-transparent bg-rawr-black mb-2"
          >
            <div className="absolute inset-0 bg-rawr-red/20 group-hover:bg-rawr-red/40 transition-colors" />
            <span className="absolute bottom-4 left-4 text-white px-2 font-black text-2xl uppercase font-heading drop-shadow-md">
              System
              <br />
              Overload
            </span>
          </Link>
          <Link
            href="/shop?sort=newest"
            className="block font-bold hover:text-rawr-red hover:underline decoration-2 underline-offset-4 decoration-rawr-red uppercase"
          >
            Shop All New Arrivals
          </Link>
        </div>

        {/* Column 2: Categories */}
        {/* Column 2: Categories (Visual Grid) */}
        <div className="space-y-4 col-span-2">
          <h3 className="text-rawr-black font-heading font-black uppercase text-xl mb-4">
            Categories
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/shop?category=tops"
              className="group block relative aspect-[16/9] overflow-hidden bg-rawr-black border border-gray-800 hover:border-rawr-red transition-colors"
            >
              <span className="absolute inset-0 flex items-center justify-center text-white font-heading font-black uppercase text-2xl drop-shadow-lg tracking-widest pointer-events-none">
                Tops
              </span>
            </Link>
            <Link
              href="/shop?category=bottoms"
              className="group block relative aspect-[16/9] overflow-hidden bg-rawr-black border border-gray-800 hover:border-rawr-red transition-colors"
            >
              <span className="absolute inset-0 flex items-center justify-center text-white font-heading font-black uppercase text-2xl drop-shadow-lg tracking-widest pointer-events-none">
                Bottoms
              </span>
            </Link>
            <Link
              href="/shop?category=outerwear"
              className="group block relative aspect-[16/9] overflow-hidden bg-rawr-black border border-gray-800 hover:border-rawr-red transition-colors"
            >
              <span className="absolute inset-0 flex items-center justify-center text-white font-heading font-black uppercase text-2xl drop-shadow-lg tracking-widest pointer-events-none">
                Outerwear
              </span>
            </Link>
            <Link
              href="/shop?category=accessories"
              className="group block relative aspect-[16/9] overflow-hidden bg-rawr-black border border-gray-800 hover:border-rawr-red transition-colors"
            >
              <span className="absolute inset-0 flex items-center justify-center text-white font-heading font-black uppercase text-2xl drop-shadow-lg tracking-widest pointer-events-none">
                Hardware
              </span>
            </Link>
          </div>
        </div>

        {/* Column 4: Collections */}
        <div className="space-y-4">
          <h3 className="text-rawr-black font-heading font-black uppercase text-xl mb-4">
            Collections
          </h3>
          <ul className="space-y-2 font-heading font-black text-2xl uppercase">
            <li>
              <Link
                href="/drops"
                className="hover:text-rawr-red decoration-rawr-red"
              >
                Upcoming Drops
              </Link>
            </li>
            <li>
              <Link
                href="/shop?collection=bestsellers"
                className="hover:text-rawr-red decoration-rawr-red"
              >
                Best Sellers
              </Link>
            </li>
            <li>
              <Link
                href="/archive"
                className="text-rawr-red hover:text-red-700"
              >
                The Vault
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
