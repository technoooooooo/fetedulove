/**
 * Import en masse d'un dossier de photos dans la galerie, sans passer par le
 * navigateur : même traitement que l'import de /admin (WebP 2400 px + vignette
 * 480 px, orientation EXIF appliquée), envoyé directement à Supabase.
 *
 *   node --env-file=.env.local scripts/importer-photos.mjs <dossier>
 *
 * Le chemin en base est dérivé du nom de fichier (web/<nom>.webp) : relancer
 * le script sur le même dossier ne réimporte que ce qui manque. Les photos
 * sont enregistrées une par une dans l'ordre des noms de fichier, pour que la
 * galerie (triée par date d'ajout) suive l'ordre de prise de vue.
 *
 * La détection des visages reste à lancer depuis /admin (étape 2).
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const BUCKET = "photos";
const TAILLE_WEB = 2400;
const TAILLE_VIGNETTE = 480;
const PARALLELE = 4;

const url = process.env.SUPABASE_URL;
const cle = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dossier = process.argv[2];

if (!url || !cle) throw new Error("SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis");
if (!dossier) throw new Error("Usage : importer-photos.mjs <dossier>");

const entetes = { apikey: cle, Authorization: `Bearer ${cle}` };

async function cheminsExistants() {
  const res = await fetch(`${url}/rest/v1/photos?select=chemin`, { headers: entetes });
  if (!res.ok) throw new Error(`Lecture des photos : ${await res.text()}`);
  return new Set((await res.json()).map((p) => p.chemin));
}

async function televerser(chemin, buffer) {
  const res = await fetch(`${url}/storage/v1/object/${BUCKET}/${chemin}`, {
    method: "POST",
    headers: { ...entetes, "Content-Type": "image/webp", "x-upsert": "true" },
    body: buffer,
  });
  if (!res.ok) throw new Error(`upload ${chemin} : ${res.status} ${await res.text()}`);
}

async function enregistrer(ligne) {
  const res = await fetch(`${url}/rest/v1/photos`, {
    method: "POST",
    headers: { ...entetes, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(ligne),
  });
  if (!res.ok) throw new Error(`insertion ${ligne.chemin} : ${await res.text()}`);
}

async function preparer(fichier) {
  const source = await readFile(fichier);
  const web = await sharp(source)
    .rotate()
    .resize(TAILLE_WEB, TAILLE_WEB, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });
  const vignette = await sharp(source)
    .rotate()
    .resize(TAILLE_VIGNETTE, TAILLE_VIGNETTE, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 70 })
    .toBuffer();
  return { web: web.data, vignette, largeur: web.info.width, hauteur: web.info.height };
}

const fichiers = (await readdir(dossier))
  .filter((f) => /\.(jpe?g|png|webp|heic)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

const existants = await cheminsExistants();
const aFaire = fichiers
  .map((f) => {
    const nom = path.parse(f).name.replace(/[^A-Za-z0-9_-]/g, "_");
    return {
      fichier: path.join(dossier, f),
      chemin: `web/${nom}.webp`,
      cheminVignette: `vignettes/${nom}.webp`,
    };
  })
  .filter((p) => !existants.has(p.chemin));

console.log(`${fichiers.length} fichiers, ${aFaire.length} à importer`);

// conversion + upload en parallèle, enregistrement en base dans l'ordre
let fait = 0;
let erreurs = 0;
for (let debut = 0; debut < aFaire.length; debut += PARALLELE) {
  const lot = aFaire.slice(debut, debut + PARALLELE);
  const prets = await Promise.all(
    lot.map(async (p) => {
      try {
        const { web, vignette, largeur, hauteur } = await preparer(p.fichier);
        await Promise.all([televerser(p.chemin, web), televerser(p.cheminVignette, vignette)]);
        return { chemin: p.chemin, chemin_vignette: p.cheminVignette, largeur, hauteur };
      } catch (e) {
        erreurs++;
        console.error(`⚠ ${p.fichier} : ${e.message}`);
        return null;
      }
    }),
  );
  for (const ligne of prets) {
    if (!ligne) continue;
    try {
      await enregistrer(ligne);
      fait++;
    } catch (e) {
      erreurs++;
      console.error(`⚠ ${e.message}`);
    }
  }
  if (fait % 40 < PARALLELE) console.log(`${fait} / ${aFaire.length}`);
}

console.log(`Terminé : ${fait} importées, ${erreurs} erreur(s)`);
