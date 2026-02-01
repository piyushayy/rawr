"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HERO_SLIDES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=2000&auto=format&fit=crop",
        title: "DROP 001 // GENESIS",
        subtitle: "The Beginning of the End.",
        cta: "SHOP THE DROP",
        link: "/shop"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop",
        title: "NO MERCY",
        subtitle: "Limited Edition Outerwear. 50 Units Only.",
        cta: "VIEW COLLECTION",
        link: "/shop?category=outerwear"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1550973886-df96c6e7a1b4?q=80&w=2000&auto=format&fit=crop",
        title: "THE CULT",
        subtitle: "Join the hierarchy. Earn clout.",
        cta: "JOIN NOW",
        link: "/login"
    }
];

export const HeroSlider = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <section className="relative h-[85vh] bg-rawr-black overflow-hidden border-b-2 border-rawr-black group">
            <div className="embla h-full" ref={emblaRef}>
                <div className="embla__container h-full flex">
                    {HERO_SLIDES.map((slide) => (
                        <div key={slide.id} className="embla__slide relative flex-[0_0_100%] min-w-0">
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                    filter: 'grayscale(100%) contrast(120%) brightness(60%)' // Rawr Aesthetic
                                }}
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                            {/* Content */}
                            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto space-y-6">
                                <span className="bg-rawr-red text-white px-4 py-1 text-sm font-bold uppercase tracking-[0.2em] animate-pulse">
                                    New Arrival
                                </span>

                                <h1 className="text-6xl md:text-9xl font-heading font-black text-white leading-[0.85] uppercase tracking-tighter mix-blend-overlay">
                                    {slide.title}
                                </h1>

                                <p className="text-xl md:text-2xl text-gray-300 font-bold max-w-xl font-body">
                                    {slide.subtitle}
                                </p>

                                <Link href={slide.link}>
                                    <Button size="lg" className="h-16 px-12 text-xl bg-white text-rawr-black hover:bg-rawr-red hover:text-white transition-all transform hover:scale-105 uppercase font-black">
                                        {slide.cta} <ArrowRight className="ml-2 w-6 h-6" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={scrollPrev}
                className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 border-2 border-white text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors z-20 opacity-0 group-hover:opacity-100"
            >
                ←
            </button>
            <button
                onClick={scrollNext}
                className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 border-2 border-white text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors z-20 opacity-0 group-hover:opacity-100"
            >
                →
            </button>
        </section>
    );
};
