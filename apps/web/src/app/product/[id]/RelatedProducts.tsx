import { getRelatedProducts } from "@/services/products";
import { ProductCard } from "@/components/shared/ProductCard";

export default async function RelatedProducts({
  currentProductId,
  category,
}: {
  currentProductId: string;
  category: string;
}) {
  const products = await getRelatedProducts(currentProductId, category);

  if (products.length === 0) return null;

  return (
    <div className="mt-16 border-t-2 border-rawr-black pt-12">
      <h2 className="text-3xl font-heading font-black uppercase mb-8">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
