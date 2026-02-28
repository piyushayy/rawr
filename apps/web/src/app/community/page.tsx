import { createClient } from "@/utils/supabase/server";
import { FeedPost } from "./FeedPost";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community | RAWR",
  description: "On The Body. The global feed of the Rawr hierarchy.",
};

export default async function CommunityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch posts with user profile info
  // Fetch posts
  const { data: rawPosts } = await supabase
    .from("gallery_posts")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch Authors
  const userIds = Array.from(
    new Set((rawPosts || []).map((p) => p.user_id).filter(Boolean)),
  );
  let authorMap = new Map();

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", userIds);

    authorMap = new Map(profiles?.map((p) => [p.id, p]));
  }

  // Fetch User Likes (if logged in) to show "red heart"
  let likedPostIds = new Set();
  if (user) {
    const { data: likes } = await supabase
      .from("gallery_likes")
      .select("post_id")
      .eq("user_id", user.id);

    likes?.forEach((l) => likedPostIds.add(l.post_id));
  }

  const feedPosts = rawPosts?.map((post) => ({
    ...post,
    user: authorMap.get(post.user_id) || { full_name: "Unknown Agent" },
    isLiked: likedPostIds.has(post.id),
  }));

  return (
    <div className="bg-rawr-white min-h-screen">
      <div className="container mx-auto max-w-xl px-4 py-8">
        <h1 className="text-4xl font-heading font-black uppercase text-center mb-8 border-b-2 border-rawr-black pb-4">
          The Feed
        </h1>

        {feedPosts?.map((post) => (
          <FeedPost key={post.id} post={post} currentUserId={user?.id} />
        ))}

        {feedPosts?.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p>The feed is silent.</p>
            <p className="text-sm mt-2">
              Be the first to post "On The Body" from your profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
