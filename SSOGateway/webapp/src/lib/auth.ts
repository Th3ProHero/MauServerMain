import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_for_development"
);

// We use a global variable to store the single active session ID in memory.
// This is ultra-lightweight and requires zero database queries.
// In production (Next.js standalone), this persists in the single Node process memory.
const globalForAuth = global as unknown as { activeSessionId: string | null };
if (!globalForAuth.activeSessionId) {
  globalForAuth.activeSessionId = null;
}

export async function signToken(payload: { sessionId: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { sessionId: string };
  } catch (err) {
    return null;
  }
}

export function setActiveSessionId(sessionId: string | null) {
  globalForAuth.activeSessionId = sessionId;
}

export function getActiveSessionId() {
  return globalForAuth.activeSessionId;
}
