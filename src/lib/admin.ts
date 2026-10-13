import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const COOKIE_ADMIN = "fanclub_admin";

/**
 * Jeton dérivé de l'identifiant et du mot de passe, signé avec la clé
 * service_role. Les identifiants eux-mêmes ne sont jamais stockés dans le cookie.
 */
export function jetonDe(identifiant: string, motDePasse: string) {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!identifiant || !motDePasse || !secret) return null;
  return createHmac("sha256", secret).update(`${identifiant}\n${motDePasse}`).digest("hex");
}

export function jetonAttendu() {
  return jetonDe(process.env.ADMIN_USERNAME ?? "", process.env.ADMIN_PASSWORD ?? "");
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
