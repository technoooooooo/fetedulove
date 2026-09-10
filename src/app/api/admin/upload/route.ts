import { randomUUID } from "node:crypto";
import { estAdmin, refus } from "@/lib/admin";
import { urlUploadSignee } from "@/lib/supabase";

/**
 * Renvoie des URLs d'upload signées (version web + vignette) pour un lot de
 * photos. Le navigateur PUT ensuite les fichiers directement sur Supabase.
 */
export async function POST(request: Request) {
  if (!(await estAdmin())) return refus();

  let nombre = 0;
  try {
    const body = (await request.json()) as { nombre?: unknown };
    nombre = typeof body.nombre === "number" ? Math.floor(body.nombre) : 0;
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  if (nombre < 1 || nombre > 50) {
    return Response.json({ error: "Lot de 1 à 50 photos" }, { status: 400 });
  }

  const cibles = await Promise.all(
    Array.from({ length: nombre }, async () => {
      const cle = randomUUID();
      const chemin = `web/${cle}.webp`;
      const cheminVignette = `vignettes/${cle}.webp`;
      const [urlWeb, urlVignette] = await Promise.all([
        urlUploadSignee(chemin),
        urlUploadSignee(cheminVignette),
      ]);
      return { chemin, cheminVignette, urlWeb, urlVignette };
    }),
  );

  return Response.json({ cibles });
}
