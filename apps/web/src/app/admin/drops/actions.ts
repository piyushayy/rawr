"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getActiveDrop() {
  const supabase = await createClient();
  const { data } = await supabase.from("drops").select("*").limit(1).single();
  return data;
}

import { checkAdmin } from "@/utils/admin";

export async function updateDrop(title: string, date: string) {
  await checkAdmin();
  const supabase = await createClient();

  // 2. Update (Upsert really, since we just keep one row mostly)
  // First check if exists
  const { data: existing } = await supabase
    .from("drops")
    .select("id")
    .limit(1)
    .single();

  if (existing) {
    await supabase
      .from("drops")
      .update({ title, drop_date: date })
      .eq("id", existing.id);
  } else {
    await supabase.from("drops").insert({ title, drop_date: date });
  }

  revalidatePath("/drops"); // Update public page
  revalidatePath("/admin/drops");

  return { success: true };
}
