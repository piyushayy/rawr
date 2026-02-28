"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/utils/admin";

import { sendEmail, sendOrderShippedEmail } from "@/utils/email";

export async function updateOrderStatus(
  id: string,
  status: string,
  formData: FormData,
) {
  await checkAdmin();
  const supabase = await createClient();

  const trackingNumber = formData.get("trackingNumber") as string;

  const { error } = await supabase
    .from("orders")
    .update({
      status,
      tracking_number: trackingNumber || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to update order status:", error);
    return;
  }

  // Send Email if Shipped
  if (status === "shipped" && trackingNumber) {
    const { data: order } = await supabase
      .from("orders")
      .select("*, profiles(email)")
      .eq("id", id)
      .single();
    if (order?.profiles?.email) {
      await sendOrderShippedEmail(
        order.profiles.email,
        id,
        "Standard Shipping", // Default for now
        trackingNumber,
      );
    }
  }

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
}
