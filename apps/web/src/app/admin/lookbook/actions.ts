"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAdmin } from "@/utils/admin";

export async function createLookbookEntry(formData: FormData) {
  await checkAdmin();
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const image_url = formData.get("image_url") as string;
  const product_id = formData.get("product_id") as string; // Optional
  const display_order = parseInt(formData.get("display_order") as string) || 0;

  const { error } = await supabase.from("lookbook_entries").insert({
    title,
    image_url,
    product_id: product_id === "none" ? null : product_id,
    display_order,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/lookbook");
  revalidatePath("/admin/lookbook");
  redirect("/admin/lookbook");
}

export async function deleteLookbookEntry(id: string) {
  await checkAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("lookbook_entries")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/lookbook");
  revalidatePath("/admin/lookbook");
}
