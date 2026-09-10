/**
 * Accès Supabase côté serveur uniquement (clé service_role).
 * Les tables `photos` et `visages` ont RLS activé sans policy : elles ne sont
 * lisibles qu'avec cette clé, qui n'est jamais exposée au navigateur.
 */

export const BUCKET = "photos";

function conf() {
  const url = process.env.SUPABASE_URL;
  const cle = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !cle) throw new Error("Configuration Supabase manquante");
  return { url, cle };
}

export function supabaseConfigure() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

type RestOptions = {
  method?: string;
  body?: unknown;
  /** en-tête Prefer de PostgREST (return=representation, resolution=..., etc.) */
  prefer?: string;
};

async function rest(chemin: string, options: RestOptions = {}) {
  const { url, cle } = conf();
  const res = await fetch(`${url}/rest/v1/${chemin}`, {
    method: options.method ?? "GET",
    cache: "no-store",
    headers: {
      apikey: cle,
      Authorization: `Bearer ${cle}`,
      "Content-Type": "application/json",
      Prefer: options.prefer ?? "return=representation",
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!res.ok) {
    throw new Error(`Supabase ${res.status} sur ${chemin} : ${await res.text()}`);
  }
  const texte = await res.text();
  return texte ? JSON.parse(texte) : null;
}

/* ─── Types de la base ───────────────────────────────────────────────────── */

export type PhotoRow = {
  id: string;
  chemin: string;
  chemin_vignette: string;
  largeur: number;
  hauteur: number;
  indexee: boolean;
  created_at: string;
};

export type VisageRow = {
  id: string;
  photo_id: string;
  x: number;
  y: number;
  l: number;
  h: number;
  score: number;
  /** absente quand la requête est faite avec `avecEmpreinte: false` */
  empreinte?: number[];
  membre_id: number | null;
  ancre: boolean;
  similarite: number | null;
};

/* ─── Storage ────────────────────────────────────────────────────────────── */

export function urlPublique(chemin: string) {
  const { url } = conf();
  return `${url}/storage/v1/object/public/${BUCKET}/${chemin}`;
}

/**
 * Crée une URL d'upload signée : le navigateur envoie ensuite le fichier
 * directement à Supabase, sans passer par une fonction Vercel (limite 4,5 Mo).
 */
export async function urlUploadSignee(chemin: string) {
  const { url, cle } = conf();
  const res = await fetch(
    `${url}/storage/v1/object/upload/sign/${BUCKET}/${chemin}`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        apikey: cle,
        Authorization: `Bearer ${cle}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expiresIn: 3600 }),
    },
  );
  if (!res.ok) {
    throw new Error(`Signature d'upload impossible : ${await res.text()}`);
  }
  const data = (await res.json()) as { url: string };
  return `${url}/storage/v1${data.url}`;
}

export async function supprimerFichiers(chemins: string[]) {
  if (chemins.length === 0) return;
  const { url, cle } = conf();
  await fetch(`${url}/storage/v1/object/${BUCKET}`, {
    method: "DELETE",
    cache: "no-store",
    headers: {
      apikey: cle,
      Authorization: `Bearer ${cle}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefixes: chemins }),
  });
}

/* ─── Requêtes ───────────────────────────────────────────────────────────── */

export async function listerPhotos(filtre?: { indexee?: boolean }): Promise<PhotoRow[]> {
  const params = new URLSearchParams({ select: "*", order: "created_at.asc" });
  if (filtre?.indexee !== undefined) params.set("indexee", `is.${filtre.indexee}`);
  return (await rest(`photos?${params}`)) as PhotoRow[];
}

export async function creerPhotos(
  lignes: Array<Omit<PhotoRow, "id" | "indexee" | "created_at">>,
): Promise<PhotoRow[]> {
  return (await rest("photos", { method: "POST", body: lignes })) as PhotoRow[];
}

export async function supprimerPhoto(id: string) {
  await rest(`photos?id=eq.${id}`, { method: "DELETE", prefer: "return=minimal" });
}

export async function listerVisages(filtre?: {
  membreId?: number;
  photoIds?: string[];
  avecEmpreinte?: boolean;
}): Promise<VisageRow[]> {
  const colonnes = filtre?.avecEmpreinte === false
    ? "id,photo_id,x,y,l,h,score,membre_id,ancre,similarite"
    : "*";
  const params = new URLSearchParams({ select: colonnes, order: "created_at.asc" });
  if (filtre?.membreId !== undefined) params.set("membre_id", `eq.${filtre.membreId}`);
  if (filtre?.photoIds?.length) {
    params.set("photo_id", `in.(${filtre.photoIds.join(",")})`);
  }
  return (await rest(`visages?${params}`)) as VisageRow[];
}

export async function creerVisages(
  lignes: Array<Omit<VisageRow, "id" | "membre_id" | "ancre" | "similarite">>,
) {
  if (lignes.length === 0) return;
  await rest("visages", { method: "POST", body: lignes, prefer: "return=minimal" });
}

export async function marquerIndexee(photoId: string) {
  await rest(`photos?id=eq.${photoId}`, {
    method: "PATCH",
    body: { indexee: true },
    prefer: "return=minimal",
  });
}

/** Mise à jour en masse, chaque visage avec son propre score. */
export async function associerEnMasse(
  associations: Array<{ id: string; membreId: number | null; ancre: boolean; similarite: number | null }>,
) {
  if (associations.length === 0) return 0;
  const total = (await rest("rpc/associer_visages", {
    method: "POST",
    body: { associations },
  })) as number;
  return total;
}

export async function associerVisages(
  ids: string[],
  membreId: number | null,
  options: { ancre: boolean; similarite?: number | null } = { ancre: true },
) {
  if (ids.length === 0) return;
  await rest(`visages?id=in.(${ids.join(",")})`, {
    method: "PATCH",
    body: {
      membre_id: membreId,
      ancre: membreId === null ? false : options.ancre,
      similarite: membreId === null ? null : (options.similarite ?? null),
    },
    prefer: "return=minimal",
  });
}

/**
 * Visages rattachés à un membre, groupés par photo. Sert à afficher les prénoms
 * au survol : seuls les visages nommés sont renvoyés, sans leur empreinte.
 */
export async function visagesNommesParPhoto(photoIds: string[]) {
  const parPhoto = new Map<string, VisageRow[]>();
  if (photoIds.length === 0) return parPhoto;

  const visages = await listerVisages({ photoIds, avecEmpreinte: false });
  for (const visage of visages) {
    if (visage.membre_id === null) continue;
    const liste = parPhoto.get(visage.photo_id) ?? [];
    liste.push(visage);
    parPhoto.set(visage.photo_id, liste);
  }
  return parPhoto;
}

/* ─── Rattachements manuels (photos_membres) ─────────────────────────────── */

export type RattachementRow = { photo_id: string; membre_id: number };

/**
 * Tous les rattachements manuels. La table est jeune : tant que la migration
 * n'est pas passée en base, on renvoie une liste vide plutôt que de casser la
 * galerie, qui n'en dépend pas pour fonctionner.
 */
export async function listerRattachements(): Promise<RattachementRow[]> {
  try {
    return (await rest("photos_membres?select=photo_id,membre_id")) as RattachementRow[];
  } catch {
    return [];
  }
}

/** Rattachements manuels d'un lot de photos, groupés par photo. */
export async function rattachementsDesPhotos(photoIds: string[]) {
  const parPhoto = new Map<string, number[]>();
  if (photoIds.length === 0) return parPhoto;

  const params = new URLSearchParams({
    select: "photo_id,membre_id",
    photo_id: `in.(${photoIds.join(",")})`,
  });
  let lignes: RattachementRow[] = [];
  try {
    lignes = (await rest(`photos_membres?${params}`)) as RattachementRow[];
  } catch {
    return parPhoto;
  }
  for (const ligne of lignes) {
    parPhoto.set(ligne.photo_id, [
      ...(parPhoto.get(ligne.photo_id) ?? []),
      ligne.membre_id,
    ]);
  }
  return parPhoto;
}

export async function rattacherPhoto(photoId: string, membreIds: number[]) {
  if (membreIds.length === 0) return;
  await rest("photos_membres", {
    method: "POST",
    body: membreIds.map((membreId) => ({ photo_id: photoId, membre_id: membreId })),
    // réenregistrer quelqu'un déjà rattaché ne doit pas lever d'erreur
    prefer: "return=minimal,resolution=ignore-duplicates",
  });
}

export async function detacherPhoto(photoId: string, membreId: number) {
  await rest(`photos_membres?photo_id=eq.${photoId}&membre_id=eq.${membreId}`, {
    method: "DELETE",
    prefer: "return=minimal",
  });
}

/** Photos où un membre a été reconnu, dédoublonnées et triées. */
const CHAMPS_PHOTO = "photos(id,chemin,chemin_vignette,largeur,hauteur,created_at)";

type LignePhoto = {
  photos: Pick<
    PhotoRow,
    "id" | "chemin" | "chemin_vignette" | "largeur" | "hauteur" | "created_at"
  > | null;
};

async function rattachementsDuMembre(membreId: number): Promise<LignePhoto[]> {
  const params = new URLSearchParams({
    select: CHAMPS_PHOTO,
    membre_id: `eq.${membreId}`,
  });
  try {
    return (await rest(`photos_membres?${params}`)) as LignePhoto[];
  } catch {
    return [];
  }
}

export async function photosDuMembre(membreId: number) {
  const params = new URLSearchParams({
    select: "similarite,ancre,photos(id,chemin,chemin_vignette,largeur,hauteur,created_at)",
    membre_id: `eq.${membreId}`,
  });
  const lignes = (await rest(`visages?${params}`)) as Array<{
    similarite: number | null;
    ancre: boolean;
    photos: Pick<
      PhotoRow,
      "id" | "chemin" | "chemin_vignette" | "largeur" | "hauteur" | "created_at"
    > | null;
  }>;

  const parPhoto = new Map<string, { photo: NonNullable<(typeof lignes)[number]["photos"]>; sur: number }>();
  for (const ligne of lignes) {
    if (!ligne.photos) continue;
    const sur = ligne.ancre ? 1 : (ligne.similarite ?? 0);
    const existant = parPhoto.get(ligne.photos.id);
    if (!existant || sur > existant.sur) {
      parPhoto.set(ligne.photos.id, { photo: ligne.photos, sur });
    }
  }

  // Photos rattachées à la main : personne de dos, floue ou hors cadre. Elles
  // valent une certitude maximale, c'est un humain qui l'a décidé.
  for (const ligne of await rattachementsDuMembre(membreId)) {
    if (!ligne.photos) continue;
    parPhoto.set(ligne.photos.id, { photo: ligne.photos, sur: 1 });
  }

  return [...parPhoto.values()]
    .sort((a, b) => a.photo.created_at.localeCompare(b.photo.created_at))
    .map(({ photo, sur }) => ({
      id: photo.id,
      url: urlPublique(photo.chemin),
      vignette: urlPublique(photo.chemin_vignette),
      largeur: photo.largeur,
      hauteur: photo.hauteur,
      certitude: sur,
    }));
}
