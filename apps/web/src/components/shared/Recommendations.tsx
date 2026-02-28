import { getRecommendations } from "@/services/products";
import { ProductCard } from "./ProductCard";

export default async function Recommendations({
  category,
}: {
  category: string;
}) {
  const products = await getRecommendations(category);

  if (products.length === 0) return null;

  return (
    <div className="mt-16 bg-gray-50 border-2 border-dashed border-rawr-black p-8">
      <h2 className="text-3xl font-heading font-black uppercase mb-8 flex items-center gap-3">
        <span className="bg-rawr-black text-white px-2 py-1 text-sm">
          PRO TIP
        </span>
        Complete The Look
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
