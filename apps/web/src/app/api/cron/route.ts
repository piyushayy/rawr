import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // You can import and run your marketing and recover-cart logic here.
        return NextResponse.json({
            success: true,
            message: "Daily Cron Executed"
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
