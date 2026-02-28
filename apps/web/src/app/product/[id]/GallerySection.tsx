import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import GalleryUpload from "./GalleryUpload";

export default async function GallerySection({
  productId,
}: {
  productId: string;
}) {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("gallery_posts")
    .select(
      `
            *,
            profiles(full_name, avatar_url, clout_score)
        `,
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  return (
    <div className="mt-16 border-t-2 border-rawr-black pt-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black uppercase mb-2">
            On The Body
          </h2>
          <p className="text-gray-500 font-bold">See how the cult wears it.</p>
        </div>
        <div className="w-full md:w-auto">
          <GalleryUpload productId={productId} />
        </div>
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-[4/5] bg-gray-100 cursor-pointer overflow-hidden border border-black"
            >
              <Image
                src={post.image_url}
                alt={post.caption || "Community Post"}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                <p className="font-bold text-sm uppercase mb-1">
                  @{post.profiles?.full_name || "Anon"}
                </p>
                <p className="text-xs uppercase bg-rawr-red inline-block px-1 w-fit rounded">
                  lvl {Math.floor((post.profiles?.clout_score || 0) / 100)}{" "}
                  Clout
                </p>
                {post.caption && (
                  <p className="text-xs mt-2 italic">
                    &quot;{post.caption}&quot;
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300">
          <p className="font-bold text-gray-400 uppercase">
            No fits yet. Be the first.
          </p>
        </div>
      )}
    </div>
  );
}
