import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About The Hunt | RAWR",
  description: "We don't manufacture. We discover.",
};

export default function AboutPage() {
  return (
    <div className="bg-rawr-white min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50">
          <Image
            src="https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?q=80&w=2568&auto=format&fit=crop"
            alt="Warehouse"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-6xl md:text-9xl font-heading font-black text-white uppercase leading-none mix-blend-difference">
            No More
            <br />
            Landfill
          </h1>
        </div>
      </section>

      {/* The Mission */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-heading font-black uppercase text-rawr-black">
              We Are Not A Brand.
              <br />
              We Are A Filter.
            </h2>
            <p className="text-xl font-body font-medium text-gray-700 leading-relaxed">
              The world has enough clothes. Millions of tons of "fast fashion"
              end up in landfills every year. Meanwhile, the highest quality
              garments from the 90s and 00s are sitting in dusty bins, waiting
              to be found.
            </p>
            <p className="text-xl font-body font-medium text-gray-700 leading-relaxed">
              RAWR exists to close the loop. We hunt the bins so you don't have
              to. We curate the rare, the faded, the perfectly broken-in pieces
              that money can't buy at a mall.
            </p>
          </div>
          <div className="relative aspect-square border-2 border-rawr-black bg-gray-100 p-4 rotate-2 hover:rotate-0 transition-transform duration-500">
            <Image
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop"
              alt="Clothing Rack"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="bg-rawr-black text-rawr-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading font-black uppercase text-center mb-16">
            The Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-white/20 p-8 hover:bg-white/5 transition-colors">
              <span className="text-6xl font-heading font-black text-rawr-red opacity-50 mb-4 block">
                01
              </span>
              <h3 className="text-2xl font-bold uppercase mb-4">The Dig</h3>
              <p className="text-gray-400">
                Our scouts search through thousands of pounds of textiles daily.
                We look for heavyweight cotton, single-stitch hems, and
                authentic wear.
              </p>
            </div>
            <div className="border border-white/20 p-8 hover:bg-white/5 transition-colors">
              <span className="text-6xl font-heading font-black text-rawr-red opacity-50 mb-4 block">
                02
              </span>
              <h3 className="text-2xl font-bold uppercase mb-4">The Wash</h3>
              <p className="text-gray-400">
                Every piece is industrially washed and steam pressed. We ensure
                it smells like fresh laundry, not a basement. Ready to wear,
                instantly.
              </p>
            </div>
            <div className="border border-white/20 p-8 hover:bg-white/5 transition-colors">
              <span className="text-6xl font-heading font-black text-rawr-red opacity-50 mb-4 block">
                03
              </span>
              <h3 className="text-2xl font-bold uppercase mb-4">The Drop</h3>
              <p className="text-gray-400">
                We release collections in drops. The best pieces are gone in
                seconds. It's a game of speed and taste.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
