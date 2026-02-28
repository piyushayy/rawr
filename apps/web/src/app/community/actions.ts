"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Join the pack to show love." };
  }

  // Check if liked
  const { data: existing } = await supabase
    .from("gallery_likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .single();

  if (existing) {
    // Unlike
    await supabase.from("gallery_likes").delete().eq("id", existing.id);
  } else {
    // Like
    await supabase.from("gallery_likes").insert({
      user_id: user.id,
      post_id: postId,
    });
  }

  revalidatePath("/community");
  return { success: true };
}
