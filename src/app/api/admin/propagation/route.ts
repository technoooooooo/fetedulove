import { estAdmin, refus } from "@/lib/admin";
import { associerEnMasse, listerVisages } from "@/lib/supabase";
import { centroide, similarite } from "@/lib/visages";

/** Membre fictif : visages qui ne sont pas des invités. Jamais propagé. */
const IGNORE = 0;
const LOT = 500;

/**
 * Étend chaque association manuelle (« ancre ») à tous les visages qui lui
 * ressemblent. Tout ce qui n'est pas une ancre est recalculé, pour qu'un
 * changement de seuil puisse aussi défaire des rattachements trop généreux.
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

  const empreintesParMembre = new Map<number, number[][]>();
  for (const v of visages) {
    if (!v.ancre || v.membre_id === null || v.membre_id === IGNORE || !v.empreinte) continue;
    const liste = empreintesParMembre.get(v.membre_id) ?? [];
    liste.push(v.empreinte);
    empreintesParMembre.set(v.membre_id, liste);
  }

  if (empreintesParMembre.size === 0) {
    return Response.json({ error: "Aucune référence : nomme d'abord un groupe" }, { status: 400 });
  }

  const references = [...empreintesParMembre.entries()].map(([membreId, es]) => ({
    membreId,
    centre: centroide(es),
  }));

  const associations = visages
    .filter((v) => !v.ancre && v.empreinte)
    .map((v) => {
      let membreId: number | null = null;
      let meilleure = seuil;
      for (const ref of references) {
        const s = similarite(v.empreinte as number[], ref.centre);
        if (s >= meilleure) {
          meilleure = s;
          membreId = ref.membreId;
        }
      }
      return {
        id: v.id,
        membreId,
        ancre: false,
        similarite: membreId === null ? null : meilleure,
      };
    });

  let misAJour = 0;
  for (let i = 0; i < associations.length; i += LOT) {
    misAJour += await associerEnMasse(associations.slice(i, i + LOT));
  }

  return Response.json({
    ok: true,
    misAJour,
    rattaches: associations.filter((a) => a.membreId !== null).length,
    references: references.length,
  });
}
