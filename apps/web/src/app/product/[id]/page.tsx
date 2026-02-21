import { notFound } from "next/navigation";
import { getProductById } from "@/services/products";
import { ProductClient } from "./ProductClient";
import ReviewsSection from "./ReviewsSection";
import RelatedProducts from "./RelatedProducts";
import Recommendations from "@/components/shared/Recommendations";
import { RecentlyViewed } from "@/components/shared/RecentlyViewed";
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
        alternates: {
            canonical: `https://rawr.store/product/${product.id}`,
        },
        openGraph: {
            title: product.title,
            description: product.description,
            images: product.images,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.title,
            description: product.description,
            images: [product.images[0]],
        },
    };
}

import { createClient } from "@/utils/supabase/server";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProductById(id);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    let clout = 0;
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('clout_score').eq('id', user.id).single();
        if (profile) clout = profile.clout_score;
    }

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
        <ProductClient product={product} clout={clout}>
            <div className="container mx-auto px-4 pt-4 pb-0">
                <Breadcrumbs items={[
                    { label: "Shop", href: "/shop" },
                    { label: product.category || "All", href: `/shop?category=${product.category}` },
                    { label: product.title, href: `/product/${product.id}` }
                ]} />
            </div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ReviewsSection productId={id} />
            <GallerySection productId={id} />
            <Recommendations category={product.category} />
            <RelatedProducts currentProductId={id} category={product.category} />
            <RecentlyViewed currentProductId={id} />
        </ProductClient>
    );
}
