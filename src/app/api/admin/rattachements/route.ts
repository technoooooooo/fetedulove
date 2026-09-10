import { estAdmin, refus } from "@/lib/admin";
import { detacherPhoto, listerRattachements, rattacherPhoto } from "@/lib/supabase";

/** Rattachements manuels photo → membre, hors reconnaissance faciale. */
export async function GET() {
  if (!(await estAdmin())) return refus();

  const rattachements = await listerRattachements();
  return Response.json({
    rattachements: rattachements.map((r) => ({
      photoId: r.photo_id,
      membreId: r.membre_id,
    })),
  });
}

/** Accepte un membre seul (`membreId`) ou un lot (`membreIds`). */
async function lire(request: Request) {
  const body = (await request.json()) as {
    photoId?: unknown;
    membreId?: unknown;
    membreIds?: unknown;
  };
  const lot = Array.isArray(body.membreIds)
    ? body.membreIds.filter((id): id is number => typeof id === "number")
    : [];
  return {
    photoId: typeof body.photoId === "string" ? body.photoId : "",
    membreIds: typeof body.membreId === "number" ? [body.membreId, ...lot] : lot,
  };
}

export async function POST(request: Request) {
  if (!(await estAdmin())) return refus();

  let photoId = "";
  let membreIds: number[] = [];
  try {
    ({ photoId, membreIds } = await lire(request));
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  if (!photoId || membreIds.length === 0) {
    return Response.json({ error: "photoId et membreId(s) requis" }, { status: 400 });
  }

  await rattacherPhoto(photoId, membreIds);
  return Response.json({ ok: true, rattaches: membreIds.length });
}

export async function DELETE(request: Request) {
  if (!(await estAdmin())) return refus();

  const params = new URL(request.url).searchParams;
  const photoId = params.get("photoId");
  const membreId = Number(params.get("membreId"));
  if (!photoId || !Number.isInteger(membreId)) {
    return Response.json({ error: "photoId et membreId requis" }, { status: 400 });
  }

  await detacherPhoto(photoId, membreId);
  return Response.json({ ok: true });
}
