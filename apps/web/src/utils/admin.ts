import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logSecurityEvent } from "./rbac";

export async function checkAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Fallback: Code-level whitelist for the owner
  if (user.email === "piyushkaushik121@gmail.com") {
    return user; // Bypass DB role check
  }

  if (error || profile?.role !== "admin") {
    await logSecurityEvent("UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT", user.id, {
      action: "checkAdmin_fallback",
    });
    redirect("/"); // Redirect unauthorized users to home
  }

  return user;
}
