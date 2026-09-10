import { cookies } from "next/headers";
import { COOKIE_ADMIN, comparer, estAdmin, jetonAttendu, jetonDe } from "@/lib/admin";

export async function GET() {
  return Response.json({ connecte: await estAdmin() });
}

export async function POST(request: Request) {
  const attendu = jetonAttendu();
  if (!attendu) {
    return Response.json(
      { error: "ADMIN_PASSWORD n'est pas configuré" },
      { status: 500 },
    );
  }

  let motDePasse = "";
  try {
    const body = (await request.json()) as { motDePasse?: unknown };
    motDePasse = typeof body.motDePasse === "string" ? body.motDePasse : "";
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }

  const propose = jetonDe(motDePasse);
  if (!propose || !comparer(propose, attendu)) {
    return Response.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  (await cookies()).set(COOKIE_ADMIN, attendu, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return Response.json({ ok: true });
}

export async function DELETE() {
  (await cookies()).delete(COOKIE_ADMIN);
  return Response.json({ ok: true });
}
