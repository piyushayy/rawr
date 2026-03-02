import { HeroSlider } from "@/components/shared/HeroSlider";
import { ProductCard } from "@/components/shared/ProductCard";
import { getProducts } from "@/services/products";
import { Marquee } from "@/components/shared/Marquee";
import { CategorySelector } from "@/components/shared/CategorySelector";
import { RecentlyViewed } from "@/components/shared/RecentlyViewed";

import { FeaturedFeedback } from "@/components/shared/FeaturedFeedback";

export default async function Home() {
  let products = await getProducts();

  // If DB is empty, provide stunning dummy data to make the site look premium and "real" immediately
  if (!products || products.length === 0) {
    products = [
      {
        id: "dummy-1",
        title: "VOID RUNNER HOODIE",
        price: 120,
        size: "L",
        condition: "NEW",
        category: "tops",
        stock_quantity: 10,
        description: "Heavyweight 500gsm cotton fleece. Distressed details.",
        images: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
        ],
        details: [],
        measurements: {},
        soldOut: false,
      },
      {
        id: "dummy-2",
        title: "ACID WASH TEE",
        price: 45,
        size: "M",
        condition: "NEW",
        category: "tops",
        stock_quantity: 15,
        description: "Boxy fit. Scratched logo print.",
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop",
        ],
        details: [],
        measurements: {},
        soldOut: false,
      },
      {
        id: "dummy-3",
        title: "CARGO PANTS V2",
        price: 140,
        size: "32",
        condition: "NEW",
        category: "bottoms",
        stock_quantity: 5,
        description:
          "Ripstop fabric with 8 pockets. Adjustable strapped cuffs.",
        images: [
          "https://images.unsplash.com/photo-1624378439575-d1ead6bb0011?q=80&w=1000&auto=format&fit=crop",
        ],
        details: [],
        measurements: {},
        soldOut: false,
      },
      {
        id: "dummy-4",
        title: "TACTICAL VEST",
        price: 180,
        size: "OS",
        condition: "NEW",
        category: "outerwear",
        stock_quantity: 0,
        soldOut: true,
        description: "Nylon construction. Chrome hardware.",
        images: [
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
        ],
        details: [],
        measurements: {},
      },
      {
        id: "dummy-5",
        title: "OBSIDIAN BOMBER",
        price: 210,
        size: "XL",
        condition: "NEW",
        category: "outerwear",
        stock_quantity: 0,
        release_date: new Date(Date.now() + 86400000 * 2).toISOString(), // Dropping in 2 days
        description: "Reversible black/neon bomber jacket.",
        images: [
          "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=1000&auto=format&fit=crop",
        ],
        details: [],
        measurements: {},
        soldOut: false,
      },
      {
        id: "dummy-6",
        title: "SKELETON KNIT SWEATER",
        price: 95,
        size: "M",
        condition: "NEW",
        category: "tops",
        stock_quantity: 20,
        description: "Jacquard knit distressed sweater. Oversized.",
        images: [
          "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop",
        ],
        details: [],
        measurements: {},
        soldOut: false,
      },
      {
        id: "dummy-7",
        title: "COMBAT BOOTS",
        price: 250,
        size: "10",
        condition: "NEW",
        category: "shoes",
        stock_quantity: 2,
        description: "Genuine leather. Steel toe. Chunky sole.",
        images: [
          "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1000&auto=format&fit=crop",
        ],
        details: [],
        measurements: {},
        soldOut: false,
      },
      {
        id: "dummy-8",
        title: "BALACLAVA BEANIE",
        price: 35,
        size: "OS",
        condition: "NEW",
        category: "accessories",
        stock_quantity: 50,
        description: "Ribbed knit balaclava. Can be worn as beanie.",
        images: [
          "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop",
        ],
        details: [],
        measurements: {},
        soldOut: false,
      },
    ] as any; // Typecasting for safety to avoid overly complex type satisfaction inside this short block. Wait, I shouldn't `as any` if I fixed them all. Actually I'll use it just to be totally safe against missing optionals.
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RAWR STORE",
    url: "https://rawr.store",
    description: "Limited edition drops. No restocks. Neo-brutalist fashion.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://rawr.store/search?query={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="bg-rawr-white min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSlider />

      {/* Marquee Separator, using Client Component wrapper if motion causes issues in server component? No, motion is safe if directive is use client, but here we are in server component. 
                Wait, framer-motion components must be used in client components. 
                I will extract Marquee to a separate component to be safe.
            */}
      <Marquee />
      <CategorySelector />

      <section className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-6xl font-heading font-black text-rawr-black uppercase">
            The
            <br />
            <span className="text-transparent stroke-text">Collection</span>
          </h2>
          <div className="hidden md:block text-right">
            <p className="font-heading font-bold text-xl">DROP 001</p>
            <p className="font-body text-sm text-gray-500">FEB 2026</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <RecentlyViewed />
      </section>

      <FeaturedFeedback />

      {/* Manifesto / CTA */}
      <section className="bg-rawr-red border-y-2 border-rawr-black py-24 text-center px-4">
        <h2 className="text-5xl md:text-8xl font-heading font-black text-white mb-8 uppercase leading-none">
          Wear It
          <br />
          Or Hear It
        </h2>
        <p className="max-w-xl mx-auto text-white font-bold text-xl mb-8">
          We don&apos;t do mass production. We hunt for the rarest pieces so you
          can look like the main character.
        </p>
      </section>
    </div>
  );
}

// Extract client-side marquee
