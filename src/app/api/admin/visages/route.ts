import { estAdmin, refus } from "@/lib/admin";
import {
  associerEnMasse,
  associerVisages,
  creerVisages,
  listerVisages,
  marquerIndexee,
} from "@/lib/supabase";

/** Visages sans leurs empreintes : le regroupement et la propagation sont
 *  calculés côté serveur (routes /regroupement et /propagation). */
export async function GET() {
  if (!(await estAdmin())) return refus();

  const visages = await listerVisages({ avecEmpreinte: false });
  return Response.json({
    visages: visages.map((v) => ({
      id: v.id,
      photoId: v.photo_id,
      boite: { x: v.x, y: v.y, l: v.l, h: v.h },
      score: v.score,
      membreId: v.membre_id,
      ancre: v.ancre,
      similarite: v.similarite,
    })),
  });
}

type VisageEntree = {
  x?: unknown;
  y?: unknown;
  l?: unknown;
  h?: unknown;
  score?: unknown;
  empreinte?: unknown;
};

/** Enregistre les visages détectés sur une photo et marque celle-ci comme indexée. */
export async function POST(request: Request) {
  if (!(await estAdmin())) return refus();

  let photoId = "";
  let entrees: VisageEntree[] = [];
  try {
    const body = (await request.json()) as { photoId?: unknown; visages?: unknown };
    photoId = typeof body.photoId === "string" ? body.photoId : "";
    entrees = Array.isArray(body.visages) ? (body.visages as VisageEntree[]) : [];
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  if (!photoId) return Response.json({ error: "photoId requis" }, { status: 400 });

  const lignes = entrees.flatMap((e) =>
    typeof e.x === "number" &&
    typeof e.y === "number" &&
    typeof e.l === "number" &&
    typeof e.h === "number" &&
    Array.isArray(e.empreinte) &&
    e.empreinte.length > 0
      ? [
          {
            photo_id: photoId,
            x: e.x,
            y: e.y,
            l: e.l,
            h: e.h,
            score: typeof e.score === "number" ? e.score : 0,
            empreinte: e.empreinte as number[],
          },
        ]
      : [],
  );

  await creerVisages(lignes);
  await marquerIndexee(photoId);
  return Response.json({ ok: true, enregistres: lignes.length });
}

type Association = {
  id?: unknown;
  membreId?: unknown;
  ancre?: unknown;
  similarite?: unknown;
};

/**
 * Deux formes acceptées :
 * - `{ ids, membreId, ancre }` : association manuelle d'un groupe entier ;
 * - `{ associations: [{ id, membreId, ancre, similarite }] }` : propagation
 *   automatique, chaque visage portant son propre score.
 */
export async function PATCH(request: Request) {
  if (!(await estAdmin())) return refus();

  let brut: {
    ids?: unknown;
    membreId?: unknown;
    ancre?: unknown;
    similarite?: unknown;
    associations?: unknown;
  };
  try {
    brut = (await request.json()) as typeof brut;
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }

  if (Array.isArray(brut.associations)) {
    const associations = (brut.associations as Association[]).flatMap((a) =>
      typeof a.id === "string"
        ? [
            {
              id: a.id,
              membreId: typeof a.membreId === "number" ? a.membreId : null,
              ancre: a.ancre === true,
              similarite: typeof a.similarite === "number" ? a.similarite : null,
            },
          ]
        : [],
    );
    const misAJour = await associerEnMasse(associations);
    return Response.json({ ok: true, misAJour });
  }

  const ids = Array.isArray(brut.ids)
    ? brut.ids.filter((i): i is string => typeof i === "string")
    : [];
  const membreId = typeof brut.membreId === "number" ? brut.membreId : null;
  const ancre = brut.ancre !== false;
  const similarite = typeof brut.similarite === "number" ? brut.similarite : null;
  if (ids.length === 0) return Response.json({ error: "ids requis" }, { status: 400 });

  await associerVisages(ids, membreId, { ancre, similarite });
  return Response.json({ ok: true, misAJour: ids.length });
}
