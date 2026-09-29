import { NextResponse, type NextRequest } from "next/server";
import { dispatchEmails } from "@/lib/email/dispatch";

/** Called every 5 minutes by netlify/functions/dispatch-emails.mts. */
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json(await dispatchEmails());
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
