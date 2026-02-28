"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const fullName = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;
  // Avatar upload logic would go here (need to handle file upload separately in client usually, saving URL here)
  // For Phase 30 MVP, we assume text updates.

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone_number: phone,
      // We explicitly DO NOT update role or clout here, and RLS would block it anyway.
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  revalidatePath("/profile");
  return { success: true };
}

export async function deleteAccount() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  // Initialize Admin Client (Service Role)
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  // Delete User from Auth (Cascade should handle profiles/orders/etc if configured,
  // but usually we want to keep orders for records?
  // GDPR says delete personal data.
  // Schema logic: profiles references auth.users on delete cascade?
  // profiles.sql says: `references auth.users (id) on delete cascade` -> YES.
  // orders references auth.users? checking schema.sql -> `references auth.users (id)` (default NO ACTION).
  // So we might leave orphaned orders. Ideally we anonymize them.
  // implementing soft delete or anonymization is better, but "Delete Account" usually means nuke it.
  // If orders foreign key prevents deletion, this will fail.
  // Let's check schema for orders FK constraint.
  // If it fails, we should anonymize orders first.

  // Anonymize Orders (Prevent FK constraint failure)
  // We update orders with this user_id to set user_id = null
  const { error: anonymizeError } = await adminClient
    .from("orders")
    .update({ user_id: null })
    .eq("user_id", user.id);

  if (anonymizeError) {
    console.error("Anonymize Orders Error:", anonymizeError);
    // We continue? Or fail? If we fail, user can't delete.
    // If we continue, deleteUser might fail if FK exists and is strict.
    // Given we just tried to update, if it failed, deleteUser likely fails too.
    return { error: "Failed to process your data deletion request." };
  }

  // Attempt deletion
  const { error } = await adminClient.auth.admin.deleteUser(user.id);

  if (error) {
    console.error("Delete Account Error:", error);
    return { error: "Failed to delete account. Please contact support." };
  }

  return { success: true };
}
