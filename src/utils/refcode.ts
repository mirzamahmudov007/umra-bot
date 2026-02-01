import crypto from "crypto";

export function generateRefCode(len = 8) {
  // url-safe, qisqa
  return crypto.randomBytes(16).toString("base64url").slice(0, len);
}

export function parseStartPayload(text?: string) {
  // "/start abcd123" yoki "/start abcd123&group=true"
  if (!text) return null;
  const parts = text.trim().split(/\s+/);
  if (parts.length < 2) return null;

  const payload = parts[1].trim();

  // Agar payload da & parametri bo'lsa, faqat refcode ni qaytar
  const refCode = payload.split('&')[0];
  return refCode;
}

export function hasGroupParam(text?: string) {
  if (!text) return false;
  const parts = text.trim().split(/\s+/);
  if (parts.length < 2) return false;

  const payload = parts[1].trim();
  return payload.includes('group=true');
}
