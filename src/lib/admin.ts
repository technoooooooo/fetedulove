import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const COOKIE_ADMIN = "fanclub_admin";

/**
 * Jeton dérivé d'un mot de passe, signé avec la clé service_role.
 * Le mot de passe lui-même n'est jamais stocké dans le cookie.
 */
export function jetonDe(motDePasse: string) {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!motDePasse || !secret) return null;
  return createHmac("sha256", secret).update(motDePasse).digest("hex");
}

export function jetonAttendu() {
  return jetonDe(process.env.ADMIN_PASSWORD ?? "");
}

export function comparer(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export async function estAdmin() {
  const attendu = jetonAttendu();
  if (!attendu) return false;
  const jeton = (await cookies()).get(COOKIE_ADMIN)?.value;
  return Boolean(jeton && comparer(jeton, attendu));
}

/** Réponse 401 standard des routes /api/admin. */
export function refus() {
  return Response.json({ error: "Non autorisé" }, { status: 401 });
}
