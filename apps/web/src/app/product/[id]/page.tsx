import { notFound } from "next/navigation";
import { getProductById } from "@/services/products";
import { ProductClient } from "./ProductClient";
import ReviewsSection from "./ReviewsSection";
import RelatedProducts from "./RelatedProducts";
import GallerySection from "./GallerySection";

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        return {
            title: "Product Not Found | RAWR",
        };
    }

    return {
        title: `${product.title} | RAWR STORE`,
        description: product.description.slice(0, 160),
        openGraph: {
            title: product.title,
            description: product.description,
            images: product.images,
        },
    };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: product.images,
        description: product.description,
        sku: product.id,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: product.price,
            availability: product.soldOut ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
        },
    };

    return (
        <ProductClient product={product}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ReviewsSection productId={id} />
            <GallerySection productId={id} />
            <RelatedProducts currentProductId={id} category={product.category} />
        </ProductClient>
    );
}
