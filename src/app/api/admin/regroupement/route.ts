import { estAdmin, refus } from "@/lib/admin";
import { listerVisages } from "@/lib/supabase";
import { regrouper } from "@/lib/visages";

const APERCU_MAX = 4;

/**
 * Regroupe les visages non encore rattachés par ressemblance.
 * Le calcul se fait ici : les empreintes ne transitent jamais vers le navigateur.
 */
export async function POST(request: Request) {
  if (!(await estAdmin())) return refus();

  let seuil = 0.5;
  try {
    const body = (await request.json()) as { seuil?: unknown };
    if (typeof body.seuil === "number") seuil = Math.min(0.95, Math.max(0.1, body.seuil));
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }

  const visages = await listerVisages();
  const aIdentifier = visages
    .filter((v) => v.membre_id === null && v.empreinte)
    .map((v) => ({
      id: v.id,
      empreinte: v.empreinte as number[],
      score: v.score,
      photoId: v.photo_id,
      boite: { x: v.x, y: v.y, l: v.l, h: v.h },
    }));

  const groupes = regrouper(aIdentifier, seuil).map((g) => ({
    ids: g.membres.map((m) => m.id),
    apercu: g.membres.slice(0, APERCU_MAX).map((m) => ({
      id: m.id,
      photoId: m.photoId,
      boite: m.boite,
    })),
  }));

  return Response.json({ groupes });
}
