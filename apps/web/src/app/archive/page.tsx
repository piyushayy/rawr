import { getArchivedProducts } from "@/services/products";
import { ProductCard } from "@/components/shared/ProductCard";
import { Lock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "THE VAULT | RAWR STORE",
  description: "Archive of sold out grails. See what you missed.",
};

export default async function ArchivePage() {
  const products = await getArchivedProducts();

  return (
    <div className="min-h-screen bg-rawr-white pb-24">
      {/* Header */}
      <header className="bg-rawr-black text-white py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Lock className="w-8 h-8 text-rawr-red" />
            <h1 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter">
              The Vault
            </h1>
          </div>
          <p className="font-body text-xl max-w-2xl text-gray-400">
            Grails that slipped away. These items are currently secured in the
            archive. See what you missed, and open an item to request a hunt. If
            we find it again, you'll be the first to know.
          </p>
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-rawr-black">
            <p className="font-heading font-black text-3xl uppercase">
              The Vault is empty.
            </p>
            <p className="text-gray-500 mt-2 font-bold uppercase">
              There are no sold-out items yet. Grab the drops while they last.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
