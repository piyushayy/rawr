import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Manifesto | RAWR",
  description: "Culture, stories, and the raw truth behind the brand.",
};

export default async function ManifestoPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-rawr-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-rawr-black text-white py-24 px-4 text-center border-b-4 border-rawr-red">
        <h1 className="text-6xl md:text-9xl font-heading font-black uppercase mb-4 tracking-tighter">
          The Manifesto
        </h1>
        <p className="font-bold uppercase text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
          Stories from the underground. Culture, design, and the pursuit of the
          raw.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles?.map((article, i) => (
            <Link
              href={`/manifesto/${article.slug}`}
              key={article.id}
              className="group block"
            >
              <article className="border-2 border-rawr-black bg-white h-full flex flex-col transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#050505]">
                <div className="relative aspect-video w-full border-b-2 border-rawr-black overflow-hidden bg-gray-100">
                  {article.image_url ? (
                    <Image
                      src={article.image_url}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-rawr-black text-white font-black text-4xl">
                      RAWR
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-rawr-red text-white px-3 py-1 font-bold text-xs uppercase tracking-widest">
                    Editorial
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h2 className="text-3xl font-heading font-black uppercase leading-none mb-4 group-hover:text-rawr-red transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 font-medium line-clamp-3">
                      {article.excerpt ||
                        article.content.substring(0, 100) + "..."}
                    </p>
                  </div>
                  <div className="mt-auto flex justify-between items-center pt-8 border-t border-gray-100">
                    <span className="text-xs font-bold uppercase text-gray-400">
                      {new Date(article.created_at).toLocaleDateString(
                        undefined,
                        { month: "long", day: "numeric", year: "numeric" },
                      )}
                    </span>
                    <span className="flex items-center font-bold uppercase text-sm group-hover:translate-x-2 transition-transform">
                      Read <ArrowRight className="ml-2 w-4 h-4" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {articles?.length === 0 && (
          <div className="text-center py-24">
            <h3 className="text-2xl font-bold uppercase text-gray-400">
              Silence in the archives.
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
