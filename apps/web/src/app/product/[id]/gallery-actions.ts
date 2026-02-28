"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadGalleryPost(formData: FormData) {
  const supabase = await createClient();

  const image = formData.get("image") as File;
  const caption = formData.get("caption") as string;
  const productId = formData.get("product_id") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to post." };
  }

  if (!image) {
    return { error: "Image is required." };
  }

  // Upload Image
  const fileExt = image.name.split(".").pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  // Assuming 'gallery' bucket exists (user needs to create this in supabase manually or we script it later)
  // For now we assume 'reviews' bucket is general purpose or we reuse it?
  // Let's use 'reviews' bucket for simplicity or fail if not exists.
  // Ideally we create a new bucket 'gallery'.

  const { error: uploadError } = await supabase.storage
    .from("reviews") // Reusing reviews bucket to avoid setup friction for now
    .upload(fileName, image);

  if (uploadError) {
    console.error(uploadError);
    return { error: "Failed to upload image." };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("reviews").getPublicUrl(fileName);

  // Insert Post
  const { error: dbError } = await supabase.from("gallery_posts").insert({
    user_id: user.id,
    product_id: productId,
    image_url: publicUrl,
    caption: caption,
  });

  if (dbError) {
    console.error(dbError);
    return { error: "Failed to save post." };
  }

  revalidatePath(`/product/${productId}`);
  return { success: true };
}
