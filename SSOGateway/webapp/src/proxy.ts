import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_for_development"
);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("sso_token")?.value;
  const isLoginPage = request.nextUrl.pathname === "/login";

  // Note: Middleware runs in edge runtime, we can't access `global` here for single session
  // So we just do a basic JWT validity check. The true single-session check happens 
  // on API calls and Nginx auth_request.
  let isValid = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isValid = true;
    } catch (e) {
      // invalid token
    }
  }

  if (!isValid && !isLoginPage) {
    // Redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isValid && isLoginPage) {
    // Redirect to dashboard if already logged in
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
