"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { Product } from "@/types";
import { Heart, Lock } from "lucide-react";
import { toggleWishlist } from "@/app/account/wishlist/actions";
import { Price } from "./Price";
import { createClient } from "@/utils/supabase/client";

interface ProductProps extends Product { }

export const ProductCard = (props: ProductProps) => {
    const { id, title, price, images, size, soldOut, release_date } = props;
    const { addItem } = useCartStore();
    const isDroppingSoon = release_date ? new Date(release_date) > new Date() : false;
    const isPreOrder = title.toUpperCase().includes('PRE-ORDER') || title.toUpperCase().includes('PRE BOOKING');

    // JerseyWala style pseudo-random live stock to build hype
    const stockCount = 100 + (id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 400);

    return (
        <Link href={`/product/${id}`} className="group block relative">
            <div className="relative aspect-[3/4] overflow-hidden border-2 border-rawr-black bg-gray-100 transition-all duration-300 shadow-[4px_4px_0px_0px_#050505] group-hover:shadow-[8px_8px_0px_0px_#E60000] group-hover:-translate-y-1 group-hover:-translate-x-1">
                <Image
                    src={images[0]}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className={`object-cover transition-transform duration-500 group-hover:scale-110 ${soldOut ? 'grayscale contrast-125' : ''} ${images[1] ? 'group-hover:opacity-0' : ''}`}
                />

                {images[1] && (
                    <Image
                        src={images[1]}
                        alt={`${title} alternate`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className={`object-cover transition-transform duration-500 scale-100 opacity-0 group-hover:scale-110 group-hover:opacity-100 ${soldOut ? 'grayscale contrast-125' : ''}`}
                    />
                )}

                {props.video_url && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                        <video
                            src={props.video_url}
                            muted
                            loop
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

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

                {isPreOrder && !soldOut && !isDroppingSoon && (
                    <div className="absolute top-2 right-12 z-20 transition-transform hover:-translate-y-1">
                        <span className="bg-yellow-400 text-black font-bold uppercase text-[10px] px-2 py-1 shadow-[2px_2px_0_0_#000] border border-black">
                            PRE ORDER
                        </span>
                    </div>
                )}

                {!soldOut && !isDroppingSoon && (
                    <div className="absolute bottom-[4.5rem] left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="bg-white/95 text-rawr-black font-mono text-[10px] font-bold px-2 py-1.5 flex items-center gap-1.5 border border-rawr-black shadow-sm backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-rawr-black animate-pulse"></span> In stock, {stockCount} units
                        </span>
                    </div>
                )}

                {soldOut && !isDroppingSoon && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 transition-colors group-hover:bg-black/40">
                        <span className="text-red-500 font-heading font-black text-3xl md:text-6xl rotate-[-15deg] border-4 border-red-500 px-4 py-2 opacity-90 mix-blend-hard-light shadow-2xl">
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
                            onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                addItem({ id, title, price, image: images[0], size, quantity: 1 });
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
                <div className="flex flex-col items-end">
                    <span className="font-heading font-bold text-lg">
                        <Price amount={price} />
                    </span>
                    <span className="font-mono text-xs text-rawr-red font-bold flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity" title="Elite Members Price">
                        <Lock className="w-3 h-3" />
                        <Price amount={price * 0.9} /> ELITE
                    </span>
                </div>
            </div>
        </Link>
    );
};
