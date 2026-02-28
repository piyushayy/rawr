import { Resend } from "resend";
import OrderConfirmationEmail from "@/emails/OrderConfirmation";

export const resend = new Resend(
  process.env.RESEND_API_KEY || "re_dummy_dev_key",
);

export async function sendOrderConfirmationEmail(
  email: string,
  orderDetails: any,
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not found. Skipping email sending in DEV.");
    return;
  }

  try {
    const data = await resend.emails.send({
      from: "RAWR STORE <orders@rawr.store>", // This domain must be verified in Resend
      to: email,
      subject: `Order Confirmed: #${orderDetails.orderId.slice(0, 8)}`,
      react: OrderConfirmationEmail(orderDetails),
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { error };
  }
}
