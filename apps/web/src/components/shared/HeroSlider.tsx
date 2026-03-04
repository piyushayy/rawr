"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
}

interface HeroSliderProps {
  slides?: Slide[];
}

export const HeroSlider = ({ slides = [] }: HeroSliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000 }),
  ]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!slides || slides.length === 0) {
    return (
      <section className="relative h-[85vh] bg-rawr-black overflow-hidden border-b-2 border-rawr-black flex flex-col items-center justify-center px-4">
        {/* Oblique Slash Overlay Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        <div className="relative z-10 space-y-8 text-center">
          <h1 className="text-7xl md:text-9xl font-heading font-black text-white uppercase tracking-tighter drop-shadow-[4px_4px_0_rgba(230,0,0,1)]">RAWR IS COMING</h1>
          <p className="text-xl md:text-3xl text-gray-400 font-bold max-w-2xl font-body uppercase tracking-widest bg-black/50 p-4 border border-white/20 backdrop-blur-sm mx-auto">
            PREPARE FOR THE DROP
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[85vh] bg-rawr-black overflow-hidden border-b-2 border-rawr-black group">
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full flex">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="embla__slide relative flex-[0_0_100%] min-w-0"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-in-out hover:scale-110"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  filter: "contrast(110%) saturate(120%) brightness(80%)", // Punchy, vivid colors
                }}
              />

              {/* Oblique Slash Overlay Background (Bonkers Corner Style) */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto space-y-6">
                {/* Sticker Badge */}
                <div className="absolute top-20 right-10 md:right-20 animate-spin-slow">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-rawr-neon rounded-full mix-blend-screen text-rawr-black font-black uppercase text-center leading-none transform rotate-12 drop-shadow-lg">
                    <span className="z-10 text-sm md:text-lg">
                      NEW
                      <br />
                      DROP
                    </span>
                  </div>
                </div>

                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-rawr-red text-white border-2 border-white px-6 py-2 text-sm md:text-lg font-bold uppercase tracking-[0.3em]"
                >
                  Limited Edition
                </motion.span>

                <h1 className="text-6xl md:text-9xl font-heading font-black text-white leading-[0.85] uppercase tracking-tighter drop-shadow-[4px_4px_0_rgba(230,0,0,1)]">
                  {slide.title}
                </h1>

                <p className="text-xl md:text-3xl text-white font-bold max-w-2xl font-body bg-black/50 p-4 border border-white/20 backdrop-blur-sm">
                  {slide.subtitle}
                </p>

                <Link href={slide.link}>
                  <Button
                    size="lg"
                    className="h-16 px-12 text-xl bg-rawr-neon text-rawr-black hover:bg-white hover:text-black shadow-[8px_8px_0px_0px_transparent] border-2 border-transparent uppercase font-black tracking-widest transition-all"
                  >
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
