import { NextResponse } from "next/server";
import { verifyToken, getActiveSessionId } from "@/lib/auth";

export async function GET(req: Request) {
  // Read the cookie using standard Headers (as Nginx forwards it)
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/sso_token=([^;]+)/);
  const token = match ? match[1] : null;

  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Single Session Control: check if the session in the JWT matches the globally active one
  const activeSessionId = getActiveSessionId();
  if (!activeSessionId || payload.sessionId !== activeSessionId) {
    return new NextResponse("Unauthorized - Session Invalidated", { status: 401 });
  }

  return new NextResponse("OK", { status: 200 });
}
