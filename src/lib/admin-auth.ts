import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const SESSION_PAYLOAD = "iot-uleam-admin-session-v1";

function safeEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected && safeEqual(password, expected));
}

export function createAdminSessionToken() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET no configurado");
  return createHmac("sha256", secret).update(SESSION_PAYLOAD).digest("hex");
}

export function verifyAdminSessionToken(token?: string) {
  if (!token || !isAdminConfigured()) return false;
  return safeEqual(token, createAdminSessionToken());
}
