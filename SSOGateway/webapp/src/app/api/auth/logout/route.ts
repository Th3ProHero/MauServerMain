import { NextResponse } from "next/server";
import { setActiveSessionId } from "@/lib/auth";

export async function POST() {
  // Clear the active session from memory
  setActiveSessionId(null);

  const response = NextResponse.json({ success: true });
  response.cookies.set("sso_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
