"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const updates = {
    full_name: formData.get("full_name") as string,
    phone_number: formData.get("phone_number") as string,
    birthday: formData.get("birthday") || null,
    gender: formData.get("gender") || null,
    marketing_opt_in: formData.get("marketing_opt_in") === "on",
    avatar_url: formData.get("avatar_url") as string,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/account");
  revalidatePath("/account/settings");
  return { success: true };
}
