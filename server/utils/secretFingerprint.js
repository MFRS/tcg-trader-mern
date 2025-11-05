import crypto from "crypto";
export function secretFingerprint() {
  const s = process.env.JWT_SECRET || "";
  return crypto.createHash("sha256").update(s, "utf8").digest("hex").slice(0, 16);
}
