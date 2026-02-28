import { createClient } from "./supabase/client";

export async function trackEventClient(
  eventType: string,
  eventData: any,
  customerId?: string | null,
) {
  try {
    const supabase = createClient();

    let cid = customerId;

    // If no explicit customer ID passed, try to grab session
    if (!cid) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.id) {
        cid = session.user.id;
      }
    }

    // Get current URL if running in browser
    const url = typeof window !== "undefined" ? window.location.href : null;

    await supabase.from("customer_events").insert({
      customer_id: cid || null,
      event_type: eventType.toUpperCase(),
      event_data: eventData,
      source: "web",
      url: url,
    });
  } catch (error) {
    console.error("Failed to track event:", error);
  }
}
