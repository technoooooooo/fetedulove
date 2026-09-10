import { estAdmin, refus } from "@/lib/admin";
import {
  creerPhotos,
  listerPhotos,
  supprimerFichiers,
  supprimerPhoto,
  urlPublique,
} from "@/lib/supabase";

export async function GET(request: Request) {
  if (!(await estAdmin())) return refus();

  const indexee = new URL(request.url).searchParams.get("indexee");
  const photos = await listerPhotos(
    indexee === null ? undefined : { indexee: indexee === "true" },
  );

  return Response.json({
    photos: photos.map((p) => ({
      id: p.id,
      chemin: p.chemin,
      url: urlPublique(p.chemin),
      vignette: urlPublique(p.chemin_vignette),
      largeur: p.largeur,
      hauteur: p.hauteur,
      indexee: p.indexee,
    })),
  });
}

type Entree = {
  chemin?: unknown;
  cheminVignette?: unknown;
  largeur?: unknown;
  hauteur?: unknown;
};

export async function POST(request: Request) {
  if (!(await estAdmin())) return refus();

  let entrees: Entree[] = [];
  try {
    const body = (await request.json()) as { photos?: unknown };
    entrees = Array.isArray(body.photos) ? (body.photos as Entree[]) : [];
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }

  const lignes = entrees.flatMap((e) =>
    typeof e.chemin === "string" &&
    typeof e.cheminVignette === "string" &&
    typeof e.largeur === "number" &&
    typeof e.hauteur === "number"
      ? [
          {
            chemin: e.chemin,
            chemin_vignette: e.cheminVignette,
            largeur: e.largeur,
            hauteur: e.hauteur,
          },
        ]
      : [],
  );

  if (lignes.length === 0) {
    return Response.json({ error: "Aucune photo valide" }, { status: 400 });
  }

  const creees = await creerPhotos(lignes);
  return Response.json({ photos: creees.map((p) => ({ id: p.id, chemin: p.chemin })) });
}

export async function DELETE(request: Request) {
  if (!(await estAdmin())) return refus();

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const chemin = url.searchParams.get("chemin");
  const cheminVignette = url.searchParams.get("vignette");
  if (!id) return Response.json({ error: "id requis" }, { status: 400 });

  // les visages partent en cascade avec la ligne photo
  await supprimerPhoto(id);
  await supprimerFichiers([chemin, cheminVignette].filter((c): c is string => Boolean(c)));
  return Response.json({ ok: true });
}
