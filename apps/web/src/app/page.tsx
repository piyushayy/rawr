import { HeroSlider } from "@/components/shared/HeroSlider";
import { ProductCard } from "@/components/shared/ProductCard";
import { getLatestDrop } from "@/services/products";
import { Marquee } from "@/components/shared/Marquee";
import { CategorySelector } from "@/components/shared/CategorySelector";
import { RecentlyViewed } from "@/components/shared/RecentlyViewed";


import { BrandManifesto } from "@/components/shared/BrandManifesto";

export default async function Home() {
  const products = await getLatestDrop();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: "RAWR STORE",
    url: "https://rawr.store",
    description: "Limited edition drops. No restocks. Neo-brutalist fashion.",
    potentialAction: {
      '@type': "SearchAction",
      target: "https://rawr.store/search?query={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="bg-rawr-white min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSlider />
      <BrandManifesto items={products.slice(0, 2)} />

      {/* Marquee Separator, using Client Component wrapper if motion causes issues in server component? No, motion is safe if directive is use client, but here we are in server component. 
                Wait, framer-motion components must be used in client components. 
                I will extract Marquee to a separate component to be safe.
            */}
      <Marquee />
      <CategorySelector />

      <section className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-6xl font-heading font-black text-rawr-black uppercase">
            Latest<br /><span className="text-transparent stroke-text">Arrivals</span>
          </h2>
          <div className="hidden md:block text-right">
            <p className="font-heading font-bold text-xl">DROP 001</p>
            <p className="font-body text-sm text-gray-500">FEB 2026</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <RecentlyViewed />
      </section>

      {/* Manifesto / CTA */}
      <section className="bg-rawr-red border-y-2 border-rawr-black py-24 text-center px-4">
        <h2 className="text-5xl md:text-8xl font-heading font-black text-white mb-8 uppercase leading-none">
          Wear It<br />Or Fear It
        </h2>
        <p className="max-w-xl mx-auto text-white font-bold text-xl mb-8">
          We don&apos;t do mass production. We hunt for the rarest pieces so you can look like the main character.
        </p>
      </section>
    </div>
  );
}

// Extract client-side marquee

