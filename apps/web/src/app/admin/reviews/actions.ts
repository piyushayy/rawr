"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

import { checkAdmin } from "@/utils/admin";

export async function deleteReview(reviewId: string) {
  await checkAdmin();
  const supabase = await createClient();

  // 2. Delete
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

  if (error) {
    console.error("Delete Review Error:", error);
    return { error: "Failed to delete review" };
  }

  revalidatePath("/admin/reviews");
  // Also revalidate product pages potentially, but next request handles that usually if dynamic

  return { success: true };
}
