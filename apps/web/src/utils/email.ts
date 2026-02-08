import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(to: string, orderId: string, total: number) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is missing. Skipping email.");
        return;
    }

    try {
        await resend.emails.send({
            from: 'RAWR Streamware <orders@resend.dev>', // Use resend.dev for testing unless domain is verified
            to,
            subject: `ORDER CONFIRMED: #${orderId.slice(0, 8).toUpperCase()}`,
            html: `
                <div style="font-family: sans-serif; background: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border: 2px solid #050505;">
                        <h1 style="font-size: 32px; font-weight: 900; margin-bottom: 20px; text-transform: uppercase;">Order Confirmed</h1>
                        <p style="font-size: 16px; margin-bottom: 20px;">Your gear is secured. Prepare for shipment.</p>
                        
                        <div style="background: #000; color: #fff; padding: 20px; margin-bottom: 20px;">
                            <p style="margin: 0; font-size: 14px; text-transform: uppercase;">Order ID</p>
                            <p style="margin: 0; font-size: 24px; font-weight: bold;">${orderId.slice(0, 8).toUpperCase()}</p>
                        </div>

                         <div style="border-top: 2px solid #000; padding-top: 20px;">
                            <p style="font-size: 20px; font-weight: bold;">Total: $${total.toFixed(2)}</p>
                        </div>

                        <p style="margin-top: 40px; font-size: 12px; color: #666;">RAWR STREAMWARE // WORLDWIDE</p>
                    </div>
                </div>
            `,
        });
        console.log(`[EMAIL] Sent confirmation to ${to}`);
    } catch (error) {
        console.error("[EMAIL] Failed to send:", error);
    }

    return { success: true };
}

export async function sendOrderShippedEmail(to: string, orderId: string, carrier: string, trackingNumber: string) {
    if (!process.env.RESEND_API_KEY) return;

    try {
        await resend.emails.send({
            from: 'RAWR Streamware <shipping@resend.dev>',
            to,
            subject: `SHIPPING UPDATE: Order #${orderId.slice(0, 8).toUpperCase()}`,
            html: `
                <div style="font-family: sans-serif; background: #FFF; padding: 20px;">
                    <h1 style="font-weight: 900; text-transform: uppercase; font-size: 24px;">YOUR GEAR IS ON THE WAY</h1>
                    <p style="font-size: 16px;">The package has left the facility.</p>
                    
                    <div style="background: #F4F4F4; padding: 20px; border-left: 4px solid #000; margin: 20px 0;">
                        <p style="margin: 0; font-weight: bold; text-transform: uppercase;">Carrier: ${carrier}</p>
                        <p style="margin: 5px 0 0 0; font-family: monospace;">Tracking: ${trackingNumber}</p>
                    </div>

                    <a href="#" style="background: #000; color: #FFF; padding: 10px 20px; text-decoration: none; font-weight: bold; display: inline-block;">TRACK PACKAGE</a>
                    
                    <p style="margin-top: 40px; font-size: 12px; color: #666;">RAWR STREAMWARE // WORLDWIDE</p>
                </div>
            `
        });
        console.log(`[EMAIL] Sent shipped notification to ${to}`);
    } catch (error) {
        console.error("[EMAIL] Failed to send shipped email:", error);
    }
    return { success: true };
}

export async function sendWelcomeEmail(to: string, name: string) {
    if (!process.env.RESEND_API_KEY) return;

    try {
        await resend.emails.send({
            from: 'RAWR Streamware <welcome@resend.dev>',
            to,
            subject: `WELCOME TO THE PACK`,
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h1 style="font-weight: 900; text-transform: uppercase;">Welcome, ${name}</h1>
                    <p>You have access to the drop.</p>
                </div>
            `
        });
    } catch (error) {
        console.error(error);
    }
    return { success: true };
}

export async function sendCartRecoveryEmail(to: string, userName: string, checkoutUrl: string) {
    if (!process.env.RESEND_API_KEY) return;

    try {
        await resend.emails.send({
            from: 'RAWR Streamware <cart@resend.dev>',
            to,
            subject: `FORGOT SOMETHING?`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; text-align: center;">
                    <h1 style="font-weight: 900; text-transform: uppercase;">DON'T LOSE YOUR STASH</h1>
                    <p>We saved your cart for you, ${userName}. But it won't hold forever.</p>
                    
                    <a href="${checkoutUrl}" style="background: #000; color: #FFF; padding: 15px 30px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 20px;">COMPLETE CHECKOUT</a>
                    
                    <p style="margin-top: 40px; font-size: 12px; color: #666;">RAWR STREAMWARE // WORLDWIDE</p>
                </div>
            `
        });
        console.log(`[EMAIL] Sent recovery to ${to}`);
    } catch (error) {
        console.error(error);
    }
    return { success: true };
}

export async function sendEmail(to: string, subject: string, html: string) {
    if (!process.env.RESEND_API_KEY) {
        return { error: "API Key missing" };
    }

    try {
        await resend.emails.send({
            from: 'RAWR Admin <admin@resend.dev>',
            to,
            subject,
            html
        });
        return { success: true };
    } catch (error) {
        console.error("Email Error:", error);
        return { error: "Failed to send" };
    }
}
