"use server";

import { createClient } from "@/utils/supabase/server";
import { sendEmail } from "@/utils/email";
import { getTier, TIERS } from "@/utils/tiers";
import { revalidatePath } from "next/cache";

import { checkAdmin } from "@/utils/admin";

export async function sendBroadcast(
  segment: string,
  subject: string,
  body: string,
) {
  await checkAdmin();
  const supabase = await createClient();

  // 2. Fetch Audience
  let query = supabase.from("profiles").select("email, clout_score");

  // In a real app we might filter in DB, but for tiers we calculate in JS or store tier in DB
  // For now, let's fetch all and filter in memory (not scalable > 10k users, but fine for MVP)
  const { data: users, error } = await query;

  if (error || !users) return { error: "Failed to fetch users" };

  let targets = users.filter((u) => u.email); // Must have email

  if (segment === "elite") {
    targets = targets.filter((u) => getTier(u.clout_score).name === "Elite");
  } else if (segment === "members") {
    targets = targets.filter((u) => getTier(u.clout_score).name === "Member");
  }

  if (targets.length === 0) return { error: "No users found in this segment." };

  // 3. Send Emails (Batching would be better, but loop for MVP)
  let count = 0;
  const bodyHtml = `
        <div style="font-family: sans-serif; padding: 20px; color: #000;">
            <h1 style="font-weight: 900; text-transform: uppercase; margin-bottom: 20px;">RAWR NOTIFICATION</h1>
            <div style="white-space: pre-wrap; font-size: 16px; line-height: 1.5;">${body.replace(/\n/g, "<br/>")}</div>
            <p style="margin-top: 40px; font-size: 11px; color: #666;">
                You are receiving this because you joined the cult. <a href="https://rawr.gg/unsubscribe">Unsubscribe</a>.
            </p>
        </div>
    `;

  // Limit to 5 for safety in demo/dev mode unless explicitly overridden
  // const SAFE_MODE_LIMIT = 5;
  // const actualTargets = targets.slice(0, SAFE_MODE_LIMIT);

  for (const target of targets) {
    // console.log(`Simulating send to ${target.email}`);
    await sendEmail(target.email, subject, bodyHtml);
    count++;
  }

  return { success: true, count };
}
