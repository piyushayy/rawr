import { createClient } from "./supabase/server";

export async function trackEventServer(
  eventType: string,
  eventData: any,
  customerId?: string | null,
  sourceUrl?: string,
) {
  try {
    const supabase = await createClient();

    let cid = customerId;

    if (!cid) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) {
        cid = user.id;
      }
    }

    await supabase.from("customer_events").insert({
      customer_id: cid || null,
      event_type: eventType.toUpperCase(),
      event_data: eventData,
      source: "system",
      url: sourceUrl || null,
    });
  } catch (error) {
    console.error("Failed to track server event:", error);
  }
}
