"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addReview(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to review." };
  }

  const productId = formData.get("productId") as string;
  const rating = parseInt(formData.get("rating") as string);
  const comment = formData.get("comment") as string;
  const image = formData.get("image") as File | null;

  let images: string[] = [];

  if (image && image.size > 0) {
    const fileExt = image.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${user.id}/${productId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("ugc-images")
      .upload(filePath, image);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
    } else {
      const { data } = supabase.storage
        .from("ugc-images")
        .getPublicUrl(filePath);
      images.push(data.publicUrl);
    }
  }

  // Check if user verified (simple check: did they buy it?)
  // For now we trust the client or checking orders table
  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_items(product_id)")
    .eq("user_id", user.id);

  // Flatten and check
  const hasBought = orders?.some((o) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    o.order_items.some((i: any) => i.product_id === productId),
  );

  const review = {
    user_id: user.id,
    product_id: productId,
    rating,
    comment,
    images: images.length > 0 ? images : null,
    is_verified: hasBought || false,
  };

  const { error } = await supabase.from("reviews").insert(review);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/product/${productId}`);
  return { success: true };
}

export async function subscribeToDrop(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to join the pack (login) to get notified." };
  }

  const { data: existing } = await supabase
    .from("drop_subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    return { message: "You are already on the list." };
  }

  const { error } = await supabase.from("drop_subscriptions").insert({
    user_id: user.id,
    product_id: productId,
    email: user.email,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Signal received. You will be notified." };
}

export async function subscribeToStock(productId: string, email: string) {
  const supabase = await createClient();

  // Check if already subscribed
  const { data: existing } = await supabase
    .from("stock_requests")
    .select("id")
    .eq("user_email", email)
    .eq("product_id", productId)
    .single();

  if (existing) {
    return { message: "You're already on the waitlist for this item." };
  }

  const { error } = await supabase.from("stock_requests").insert({
    user_email: email,
    product_id: productId,
  });

  if (error) {
    console.error("Stock Request Error:", error);
    return { error: "Failed to join waitlist. Try again later." };
  }

  return { success: true, message: "We'll hit you up the second it restocks." };
}
