import crypto from "crypto";

/**
 * Sign content with HMAC-SHA256 using HMAC_SECRET
 * Returns hex signature
 */
export function signContent(content: string | Buffer) {
  const secret = process.env.HMAC_SECRET || "change_this_hmac_secret";
  return crypto.createHmac("sha256", secret).update(content).digest("hex");
}

/**
 * Verify signature
 */
export function verifySignature(content: string | Buffer, signature: string) {
  const expected = signContent(content);
  // Use timing-safe compare
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
