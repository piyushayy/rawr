import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

// Simple Markdown Parser for Rawr Aesthetics
const MarkdownContent = ({ content }: { content: string }) => {
  // Split by double newline to form paragraphs
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-6 font-body text-lg leading-relaxed text-gray-800">
      {blocks.map((block, index) => {
        // Header 1
        if (block.startsWith("# ")) {
          return (
            <h2
              key={index}
              className="text-4xl font-heading font-black uppercase mt-12 mb-6"
            >
              {block.replace("# ", "")}
            </h2>
          );
        }
        // Header 2
        if (block.startsWith("## ")) {
          return (
            <h3
              key={index}
              className="text-2xl font-heading font-black uppercase mt-8 mb-4"
            >
              {block.replace("## ", "")}
            </h3>
          );
        }
        // Header 3
        if (block.startsWith("### ")) {
          return (
            <h4 key={index} className="text-xl font-bold uppercase mt-6 mb-2">
              {block.replace("### ", "")}
            </h4>
          );
        }
        // Blockquote
        if (block.startsWith("> ")) {
          return (
            <blockquote
              key={index}
              className="border-l-4 border-rawr-red pl-6 py-2 my-8 italic text-xl text-gray-600 bg-gray-50"
            >
              {block.replace("> ", "")}
            </blockquote>
          );
        }
        // Image (Basic syntax: ![alt](url))
        const imgMatch = block.match(/!\[(.*?)\]\((.*?)\)/);
        if (imgMatch) {
          return (
            <div
              key={index}
              className="my-12 relative aspect-video w-full border-2 border-rawr-black"
            >
              <Image
                src={imgMatch[2]}
                alt={imgMatch[1]}
                fill
                className="object-cover"
              />
            </div>
          );
        }

        // List (Basic - )
        if (block.startsWith("- ")) {
          const items = block
            .split("\n")
            .filter((line) => line.startsWith("- "));
          return (
            <ul key={index} className="list-disc list-inside space-y-2 ml-4">
              {items.map((item, i) => (
                <li key={i}>{item.replace("- ", "")}</li>
              ))}
            </ul>
          );
        }

        // Paragraph with Bold support
        // Very basic regex replace for **text** -> <strong>text</strong>
        // We'll use dangerouslySetInnerHTML for inline formatting simplicity here
        const htmlContent = block
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>");

        return (
          <p key={index} dangerouslySetInnerHTML={{ __html: htmlContent }} />
        );
      })}
    </div>
  );
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title, excerpt, image_url")
    .eq("slug", slug)
    .single();

  if (!article) return {};

  return {
    title: `${article.title} | RAWR Manifesto`,
    description: article.excerpt,
    openGraph: {
      images: article.image_url ? [article.image_url] : [],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("*") // Simplify query to avoid type inference issues for now
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Header Image */}
      <div className="relative h-[60vh] md:h-[80vh] w-full border-b-2 border-rawr-black bg-rawr-black">
        {article.image_url && (
          <>
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 p-8 md:p-16 z-20">
          <div className="container mx-auto max-w-4xl">
            <Link
              href="/manifesto"
              className="inline-flex items-center text-white mb-8 hover:text-rawr-red transition-colors font-bold uppercase tracking-widest text-sm"
            >
              <ArrowLeft className="mr-2 w-4 h-4" /> Back to Manifesto
            </Link>
            <h1 className="text-5xl md:text-8xl font-heading font-black uppercase text-white leading-[0.9] mb-6 drop-shadow-lg">
              {article.title}
            </h1>
            <div className="flex items-center gap-6 text-gray-300 font-bold uppercase text-sm md:text-base">
              <span>
                {new Date(article.created_at).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="w-2 h-2 rounded-full bg-rawr-red"></span>
              <span>Editorial</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        <MarkdownContent content={article.content} />

        <div className="mt-24 pt-12 border-t-2 border-rawr-black">
          <div className="bg-gray-50 p-8 border border-gray-200 text-center">
            <h3 className="font-heading font-bold uppercase text-2xl mb-2">
              Join the Conversation
            </h3>
            <p className="text-gray-600 mb-6">
              Drop into the gallery and show us how you wear the raw truth.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-rawr-black text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-rawr-red transition-colors shadow-[4px_4px_0px_0px_#050505]"
            >
              Shop The Look
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
