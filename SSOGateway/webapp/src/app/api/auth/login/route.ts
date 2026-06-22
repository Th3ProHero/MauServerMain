import { NextResponse } from "next/server";
import { signToken, setActiveSessionId } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const validUsername = process.env.ADMIN_USERNAME || "admin";
    const validPassword = process.env.ADMIN_PASSWORD || "admin";

    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate a unique session ID
    const sessionId = crypto.randomUUID();
    
    // Set this session ID as the globally active one in memory
    setActiveSessionId(sessionId);

    // Create a JWT containing the session ID
    const token = await signToken({ sessionId });

    const isHttps = req.headers.get("x-forwarded-proto") === "https" || req.url.startsWith("https://");

    const response = NextResponse.json({ success: true });
    response.cookies.set("sso_token", token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
