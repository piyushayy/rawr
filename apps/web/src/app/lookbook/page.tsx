import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lookbook | RAWR",
  description: "Visualizing the aesthetic.",
};

export default async function LookbookPage() {
  const supabase = await createClient();
  // Fetch lookbook entries
  const { data: entries } = await supabase
    .from("lookbook_entries")
    .select("*, product:products(id, title, price, slug:id)") // slug is id for now
    .order("display_order", { ascending: true });

  // Fallback if empty
  const isEmpty = !entries || entries.length === 0;

  return (
    <div className="bg-rawr-white min-h-screen">
      <div className="bg-rawr-black text-white py-12 px-4 text-center border-b-2 border-rawr-black sticky top-0 z-30 opacity-95 backdrop-blur">
        <h1 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tight">
          Lookbook 2026
        </h1>
      </div>

      <div className="p-4 md:p-8">
        {isEmpty ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 max-w-7xl mx-auto">
            {/* Static Placeholders for Demo */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="break-inside-avoid mb-8 group relative bg-gray-100 overflow-hidden border-2 border-transparent hover:border-rawr-red transition-all"
              >
                <div
                  className={`w-full relative ${i % 2 === 0 ? "aspect-[3/4]" : "aspect-square"}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold uppercase">
                    Look {i}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-8 space-y-4 md:space-y-8 max-w-[1600px] mx-auto">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="break-inside-avoid relative group mb-8"
              >
                <div className="relative border-2 border-rawr-black bg-gray-200 overflow-hidden">
                  {/* Image */}
                  <Image
                    src={entry.image_url}
                    alt={entry.title || "Look"}
                    width={800}
                    height={1000}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay Hotspot */}
                  {entry.product && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <Link href={`/product/${entry.product.id}`}>
                        <div className="bg-white text-rawr-black px-6 py-3 font-bold uppercase tracking-widest hover:bg-rawr-red hover:text-white transition-colors flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <Plus className="w-4 h-4" /> Shop{" "}
                          {entry.product.title}
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
