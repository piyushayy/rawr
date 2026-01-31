"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Product } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { Price } from "@/components/shared/Price";

export const ProductClient = ({ product: initialProduct, children }: { product: Product, children?: React.ReactNode }) => {
    const { addItem } = useCartStore();
    const [selectedImage, setSelectedImage] = useState(0);
    const [viewerCount, setViewerCount] = useState(0);
    const [isSoldOut, setIsSoldOut] = useState(initialProduct.soldOut);
    const [hasDropped, setHasDropped] = useState(
        initialProduct.release_date
            ? new Date(initialProduct.release_date) <= new Date()
            : true
    );
    const product = { ...initialProduct, soldOut: isSoldOut };

    useEffect(() => {
        const supabase = createClient();

        // 1. Real-time Status Channel (DB Changes)
        const statusChannel = supabase
            .channel('product_status')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'products',
                    filter: `id=eq.${product.id}`
                },
                (payload) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (payload.new && typeof payload.new.sold_out === 'boolean') {
                        setIsSoldOut(payload.new.sold_out);
                        if (payload.new.sold_out) {
                            toast.error("ITEM JUST SOLD OUT!");
                        }
                    }
                }
            )
            .subscribe();

        // 2. Real-time Presence Channel (Viewers)
        const roomName = `product_viewers:${product.id}`;
        const presenceChannel = supabase.channel(roomName, {
            config: {
                presence: {
                    key: Math.random().toString(36).substring(7), // Random ID for anonymous guest
                },
            },
        });

        presenceChannel
            .on("presence", { event: "sync" }, () => {
                const state = presenceChannel.presenceState();
                const count = Object.keys(state).length;
                setViewerCount(count);
            })
            .on("presence", { event: "join" }, ({ newPresences }) => {
                // Optional: Toast "Someone joined"
                // console.log('Joined', newPresences);
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await presenceChannel.track({
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            supabase.removeChannel(statusChannel);
            supabase.removeChannel(presenceChannel);
        };
    }, [product.id]);

    return (
        <div className="bg-rawr-white min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Image Gallery */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {product.images.map((img, index) => (
                                <motion.div
                                    key={index}
                                    className={`relative aspect-[3/4] border-2 border-rawr-black bg-gray-100 cursor-pointer ${selectedImage === index ? 'ring-4 ring-rawr-red' : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                    whileHover={{ scale: 0.98 }}
                                >
                                    <Image src={img} alt={`${product.title} view ${index + 1}`} fill className="object-cover" />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-32 space-y-8">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-heading font-black uppercase leading-none mb-2 text-rawr-black">
                                    {product.title}
                                </h1>
                                <div className="flex justify-between items-center border-b-2 border-rawr-black pb-4">
                                    <p className="text-3xl font-bold"><Price amount={product.price} /></p>
                                    <div className={`px-3 py-1 font-bold uppercase ${product.soldOut ? 'bg-red-500 text-white' : 'bg-rawr-black text-rawr-white'}`}>
                                        {product.soldOut ? 'SOLD OUT' : `Size: ${product.size}`}
                                    </div>
                                </div>
                            </div>

                            {/* Viewer Count Badge - High Priority */}
                            {!product.soldOut && viewerCount > 1 && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 font-bold uppercase flex items-center gap-2 animate-pulse">
                                    <span className="w-2 h-2 rounded-full bg-red-600 block"></span>
                                    {viewerCount} people viewing this item right now
                                </div>
                            )}

                            <p className="font-body text-lg leading-relaxed">
                                {product.description}
                            </p>

                            <div className="space-y-2">
                                <h3 className="font-heading font-bold uppercase text-lg">Details</h3>
                                <ul className="list-disc list-inside font-body text-sm text-gray-600">
                                    {product.details.map((detail, i) => (
                                        <li key={i}>{detail}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-heading font-bold uppercase text-lg">Measurements</h3>
                                <div className="grid grid-cols-3 gap-2 text-sm font-body bg-gray-100 p-2 border border-rawr-black">
                                    {Object.entries(product.measurements).map(([key, value], i) => (
                                        <div key={key} className={`text-center ${i > 0 ? "border-l border-rawr-black" : ""}`}>
                                            <span className="block font-bold capitalize">{key}</span>
                                            {value}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4">
                                {!hasDropped && product.release_date ? (
                                    <div className="space-y-4 text-center border-2 border-rawr-black p-6 bg-gray-50">
                                        <p className="font-bold uppercase text-sm tracking-widest text-gray-500">Dropping In</p>
                                        <div className="flex justify-center">
                                            <CountdownTimer
                                                targetDate={product.release_date}
                                                onComplete={() => {
                                                    setHasDropped(true);
                                                    toast.success("DROP IS LIVE! GO GO GO!");
                                                }}
                                            />
                                        </div>
                                        <Button
                                            className="w-full bg-rawr-black text-white hover:bg-gray-800"
                                            onClick={async () => {
                                                const { subscribeToDrop } = await import("./actions");
                                                const res = await subscribeToDrop(product.id);
                                                if (res?.error) toast.error(res.error);
                                                else toast.success(res.message);
                                            }}
                                        >
                                            NOTIFY ME
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        disabled={product.soldOut}
                                        className="w-full h-16 text-xl tracking-widest shadow-[8px_8px_0px_0px_#050505] hover:shadow-[4px_4px_0px_0px_#050505] hover:translate-x-[4px] hover:translate-y-[4px] transition-all bg-rawr-red text-white hover:bg-red-600 border-rawr-black disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => {
                                            addItem({
                                                id: product.id,
                                                title: product.title,
                                                price: product.price,
                                                image: product.images[0],
                                                size: product.size
                                            });
                                            toast("ADDED TO CART", {
                                                description: "Don't let it slip away.",
                                            });
                                        }}
                                    >
                                        {product.soldOut ? 'SOLD OUT' : 'ADD TO CART'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
                {/* Reviews Section */}
                {children}
            </div>
        </div>
    );
};
