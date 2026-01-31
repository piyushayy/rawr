"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { Product } from "@/types";
import { Heart } from "lucide-react";
import { toggleWishlist } from "@/app/account/wishlist/actions";
import { Price } from "./Price";

interface ProductProps extends Product { }

export const ProductCard = ({ id, title, price, images, size, soldOut, release_date }: ProductProps) => {
    const { addItem } = useCartStore();
    const isDroppingSoon = release_date ? new Date(release_date) > new Date() : false;
    return (
        <Link href={`/product/${id}`} className="group block relative">
            <div className="relative aspect-[3/4] overflow-hidden border-2 border-rawr-black bg-gray-100">
                <Image
                    src={images[0]}
                    alt={title}
                    fill
                    className={`object-cover transition-transform duration-500 group-hover:scale-110 ${soldOut ? 'grayscale contrast-125' : ''}`}
                />

                <div className="absolute top-2 right-2 z-20">
                    <form action={async () => {
                        toggleWishlist(id)
                            .then((res) => {
                                if (res?.error) toast.error(res.error);
                                if (res?.action) toast(res.message);
                            });
                    }}>
                        <button type="submit" className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-rawr-red hover:text-white transition-all text-rawr-black group/heart">
                            <Heart className="w-5 h-5 group-hover/heart:fill-current" />
                        </button>
                    </form>
                </div>

                {soldOut && !isDroppingSoon && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                        <span className="text-red-500 font-heading font-black text-3xl md:text-6xl rotate-[-15deg] border-4 border-red-500 px-4 py-2 opacity-90 mix-blend-hard-light">
                            SOLD
                        </span>
                    </div>
                )}

                {isDroppingSoon && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 text-center p-4">
                        <span className="text-white font-heading font-bold uppercase text-2xl tracking-widest mb-2">
                            DROPPING
                        </span>
                        <span className="text-rawr-red font-mono font-bold text-sm bg-black px-2 py-1 border border-rawr-red">
                            {new Date(release_date!).toLocaleDateString()}
                            <br />
                            {new Date(release_date!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                )}

                {!soldOut && !isDroppingSoon && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <Button
                            className="w-full shadow-none rounded-none border-t-2 border-x-0 border-b-0"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addItem({ id, title, price, image: images[0], size });
                                toast("ADDED TO STASH", {
                                    description: `${title} - ${size || 'OS'}`,
                                });
                            }}
                        >
                            QUICK ADD
                        </Button>
                    </div>
                )}

                {size && (
                    <div className="absolute top-2 left-2 bg-rawr-black text-rawr-white px-2 py-1 text-xs font-bold uppercase">
                        {size}
                    </div>
                )}
            </div>

            <div className="mt-3 flex justify-between items-start">
                <div>
                    <h3 className="font-heading font-bold text-lg uppercase leading-none group-hover:text-rawr-red transition-colors">
                        {title}
                    </h3>
                    <p className="font-body text-sm text-gray-500 mt-1">VINTAGE PRE-OWNED</p>
                </div>
                <span className="font-heading font-bold text-lg">
                    <Price amount={price} />
                </span>
            </div>
        </Link>
    );
};
