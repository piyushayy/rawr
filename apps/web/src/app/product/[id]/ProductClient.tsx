"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Product } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { trackEventClient } from "@/utils/trackEventClient";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { Price } from "@/components/shared/Price";

import { EstimatedDelivery } from "@/components/shared/EstimatedDelivery";
import { TIERS } from "@/utils/tiers";
import { ProductGallery } from "./ProductGallery";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { ShippingAccordion } from "@/components/shared/ShippingAccordion";
import { SizeGuide } from "./SizeGuide";
import { InView } from "react-intersection-observer";
import { AnimatePresence } from "framer-motion";

export const ProductClient = ({
  product: initialProduct,
  children,
  clout = 0,
}: {
  product: Product;
  children?: React.ReactNode;
  clout?: number;
}) => {
  const deliveryDays =
    clout >= TIERS.ELITE.minClout ? 2 : clout >= TIERS.MEMBER.minClout ? 3 : 5;

  // State
  const { addItem } = useCartStore();
  const [viewerCount, setViewerCount] = useState(0);
  const [isSoldOut, setIsSoldOut] = useState(initialProduct.soldOut);
  const [hasDropped, setHasDropped] = useState(true); // Timer removed per user request
  const [mainButtonInView, setMainButtonInView] = useState(true);
  const product = { ...initialProduct, soldOut: isSoldOut };

  // Variant Logic
  const [selectedSize, setSelectedSize] = useState<string>(
    product.size || (product.variants?.[0]?.size ?? ""),
  );
  const selectedVariant = product.variants?.find(
    (v) => v.size === selectedSize,
  );

  // Determine stock based on variant or fallback
  const currentStock = selectedVariant
    ? selectedVariant.stock_quantity
    : product.stock_quantity;
  const isVariantSoldOut = currentStock <= 0;

  useEffect(() => {
    const supabase = createClient();

    // 1. Real-time Status Channel (DB Changes)
    const statusChannel = supabase
      .channel("product_status")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "products",
          filter: `id=eq.${product.id}`,
        },
        (payload) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (payload.new && typeof payload.new.sold_out === "boolean") {
            setIsSoldOut(payload.new.sold_out);
            if (payload.new.sold_out) {
              toast.error("ITEM JUST SOLD OUT!");
            }
          }
        },
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
            <ProductGallery images={product.images} title={product.title} />
          </div>

          {/* Product Info */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-32 space-y-8">
              <div>
                <div>
                  <div className="flex flex-col gap-2 items-start mb-2">
                    <h1 className="text-4xl md:text-6xl font-heading font-black uppercase leading-none text-rawr-black">
                      {product.title}
                    </h1>
                    <VerifiedBadge />
                  </div>
                  <div className="flex justify-between items-center border-b-2 border-rawr-black pb-4">
                    <p className="text-3xl font-bold">
                      <Price
                        amount={
                          selectedVariant?.price_override || product.price
                        }
                      />
                    </p>
                    <div className="flex items-center gap-4">
                      <SizeGuide />
                      {/* Size Selector */}
                      {product.variants && product.variants.length > 0 ? (
                        <div className="flex gap-2">
                          {product.variants
                            .sort((a, b) => {
                              const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
                              const aIdx = sizes.indexOf(a.size);
                              const bIdx = sizes.indexOf(b.size);
                              return (
                                (aIdx === -1 ? 99 : aIdx) -
                                (bIdx === -1 ? 99 : bIdx)
                              );
                            })
                            .map((variant) => (
                              <button
                                key={variant.id}
                                onClick={() => setSelectedSize(variant.size)}
                                disabled={variant.stock_quantity <= 0}
                                className={`px-3 py-1 font-bold uppercase border border-rawr-black transition-all
                                                            ${selectedSize === variant.size ? "bg-rawr-black text-white" : "bg-white text-black hover:bg-gray-100"}
                                                            ${variant.stock_quantity <= 0 ? "opacity-50 cursor-not-allowed line-through" : ""}
                                                        `}
                              >
                                {variant.size}
                              </button>
                            ))}
                        </div>
                      ) : (
                        <div
                          className={`px-3 py-1 font-bold uppercase ${product.soldOut ? "bg-red-500 text-white" : "bg-rawr-black text-rawr-white"}`}
                        >
                          {product.soldOut
                            ? "SOLD OUT"
                            : `Size: ${product.size}`}
                        </div>
                      )}
                    </div>
                  </div>
                  {!isVariantSoldOut && currentStock > 0 && (
                    <p className="font-bold text-sm text-gray-500 mt-2">
                      HURRY! ONLY{" "}
                      <span className="text-rawr-red">{currentStock}</span> LEFT
                      IN STOCK
                    </p>
                  )}
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
                  <h3 className="font-heading font-bold uppercase text-lg">
                    Details
                  </h3>
                  <ul className="list-disc list-inside font-body text-sm text-gray-600">
                    {product.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading font-bold uppercase text-lg">
                    Measurements
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-sm font-body bg-gray-100 p-2 border border-rawr-black">
                    {Object.entries(product.measurements).map(
                      ([key, value], i) => (
                        <div
                          key={key}
                          className={`text-center ${i > 0 ? "border-l border-rawr-black" : ""}`}
                        >
                          <span className="block font-bold capitalize">
                            {key}
                          </span>
                          {value}
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  {!hasDropped && product.release_date ? (
                    <div className="space-y-4 text-center border-2 border-rawr-black p-6 bg-gray-50">
                      <p className="font-bold uppercase text-sm tracking-widest text-gray-500">
                        Dropping In
                      </p>
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
                    <div
                      ref={(el) => {
                        if (el) setMainButtonInView(true);
                      }}
                      className="w-full space-y-4"
                    >
                      {isVariantSoldOut || product.soldOut ? (
                        <div className="border-2 border-rawr-black p-4 bg-gray-50 space-y-4">
                          <p className="font-bold uppercase text-sm tracking-widest text-gray-500 text-center">
                            Get Notified on Restock
                          </p>
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              const formData = new FormData(e.currentTarget);
                              const email = formData.get("email") as string;
                              if (!email) return;

                              const { subscribeToStock } =
                                await import("./actions");
                              const res = await subscribeToStock(
                                product.id,
                                email,
                              );
                              if (res?.error) toast.error(res.error);
                              else {
                                toast.success(res.message);
                                (e.target as HTMLFormElement).reset();
                              }
                            }}
                            className="flex flex-col gap-2"
                          >
                            <input
                              type="email"
                              name="email"
                              required
                              placeholder="Enter your email..."
                              className="w-full p-3 border-2 border-rawr-black outline-none font-body"
                            />
                            <Button
                              type="submit"
                              className="w-full bg-rawr-black text-white hover:bg-gray-800 h-12 uppercase tracking-widest"
                            >
                              Notify Me
                            </Button>
                          </form>
                        </div>
                      ) : (
                        <Button
                          className="w-full h-16 text-xl tracking-widest shadow-[8px_8px_0px_0px_#050505] hover:shadow-[4px_4px_0px_0px_#050505] hover:translate-x-[4px] hover:translate-y-[4px] transition-all bg-rawr-red text-white hover:bg-red-600 border-rawr-black disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={async () => {
                            // Allow guest checkout! (Removing "Join the cult first" block for guests)

                            addItem({
                              id: product.id,
                              variant_id: selectedVariant?.id,
                              title: product.title,
                              price:
                                selectedVariant?.price_override ||
                                product.price,
                              image: product.images[0],
                              size: selectedSize,
                              quantity: 1,
                            });

                            // Call the CDP Event Stream
                            trackEventClient("ADD_TO_CART", {
                              product_id: product.id,
                              variant_id: selectedVariant?.id,
                              title: product.title,
                              price:
                                selectedVariant?.price_override ||
                                product.price,
                              size: selectedSize,
                            });

                            toast("ADDED TO CART", {
                              description: `Size ${selectedSize} secured. Don't let it slip away.`,
                            });
                          }}
                        >
                          ADD TO CART
                        </Button>
                      )}
                      <InView
                        onChange={setMainButtonInView}
                        className="absolute inset-0 pointer-events-none"
                      />
                    </div>
                  )}
                  <div className="mt-6">
                    <EstimatedDelivery days={deliveryDays} />
                  </div>
                  <div className="mt-8">
                    <ShippingAccordion />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Reviews Section */}
          {children}
        </div>

        {/* Sticky Mobile Bar */}
        <AnimatePresence>
          {!mainButtonInView && !product.soldOut && !hasDropped && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-rawr-black z-50 md:hidden shadow-[0px_-4px_10px_rgba(0,0,0,0.1)]"
            >
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <h4 className="font-heading font-bold uppercase text-sm truncate">
                    {product.title}
                  </h4>
                  <p className="font-mono text-xs text-rawr-red font-bold">
                    <Price
                      amount={selectedVariant?.price_override || product.price}
                    />
                  </p>
                </div>
                <Button
                  size="lg"
                  disabled={isVariantSoldOut}
                  className="bg-rawr-black text-white px-8 font-bold uppercase"
                  onClick={() => {
                    // Re-use add to cart logic (simplified duplication for now)
                    addItem({
                      id: product.id,
                      variant_id: selectedVariant?.id,
                      title: product.title,
                      price: selectedVariant?.price_override || product.price,
                      image: product.images[0],
                      size: selectedSize,
                      quantity: 1,
                    });
                    toast("ADDED TO CART", {
                      description: `${product.title} - ${selectedSize}`,
                    });
                  }}
                >
                  {isVariantSoldOut ? "SOLD" : "ADD"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
