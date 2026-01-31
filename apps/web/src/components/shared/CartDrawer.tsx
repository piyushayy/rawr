"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Price } from "./Price";

export const CartDrawer = () => {
    const { isOpen, toggleCart, items, removeItem } = useCartStore();

    const total = items.reduce((acc, item) => acc + item.price, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-rawr-white border-l-2 border-rawr-black z-[70] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b-2 border-rawr-black bg-rawr-black text-rawr-white">
                            <h2 className="text-2xl font-heading font-black uppercase">Your Stash ({items.length})</h2>
                            <button onClick={toggleCart} className="hover:text-rawr-red transition-colors">
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                            {items.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                                    <h3 className="font-heading font-bold text-2xl mb-2">EMPTY</h3>
                                    <p className="font-body">Your bag is empty. Fix that.</p>
                                </div>
                            ) : (
                                items.map((item, index) => (
                                    <div key={`${item.id}-${index}`} className="flex gap-4 p-4 border-2 border-rawr-black bg-white shadow-[4px_4px_0px_0px_#050505]">
                                        <div className="relative w-20 h-24 border border-rawr-black shrink-0">
                                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-heading font-bold uppercase text-lg leading-tight">{item.title}</h4>
                                                <p className="text-xs font-bold bg-rawr-black text-white inline-block px-1 mt-1">{item.size}</p>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <span className="font-bold text-lg"><Price amount={item.price} /></span>
                                                <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-rawr-red">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t-2 border-rawr-black bg-white">
                            <div className="flex justify-between items-center mb-6 font-heading font-black text-3xl">
                                <span>TOTAL</span>
                                <span><Price amount={total} /></span>
                            </div>
                            <Link href="/checkout" onClick={toggleCart} className="w-full">
                                <Button className="w-full h-16 text-xl tracking-widest flex justify-between items-center px-6" disabled={items.length === 0}>
                                    <span>SECURE THE BAG</span>
                                    <ArrowRight className="w-6 h-6" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
