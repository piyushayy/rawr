import { createClient } from "@/utils/supabase/server";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: any[] = [];
  let articles: any[] = [];
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://rawr.stream";

  try {
    const supabase = await createClient();
    const { data: p } = await supabase
      .from("products")
      .select("id, updated_at");
    const { data: a } = await supabase
      .from("articles")
      .select("id, updated_at");

    products = p || [];
    articles = a || [];
  } catch (error) {
    console.warn("Sitemap generation fallback mode:", error);
  }

  const producturls = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(product.updated_at || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/manifesto/${article.id}`,
    lastModified: new Date(article.updated_at || Date.now()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...producturls,
    ...articleUrls,
  ];
}
