"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/utils/admin";

export async function updateInboxStatus(
  id: string,
  status: "read" | "archived" | "unread",
) {
  await checkAdmin();
  const supabase = await createClient();

  await supabase.from("inbox").update({ status }).eq("id", id);
  revalidatePath("/admin/inbox");
  revalidatePath("/admin/careers");
}

export async function deleteInboxItem(id: string) {
  await checkAdmin();
  const supabase = await createClient();

  await supabase.from("inbox").delete().eq("id", id);
  revalidatePath("/admin/inbox");
  revalidatePath("/admin/careers");
}
