/**
 * Préparation des photos côté navigateur : on n'envoie jamais l'original.
 * Une version web (2400 px max) sert à l'affichage plein écran et à la
 * détection de visages, une vignette (480 px) alimente les grilles.
 */

const TAILLE_WEB = 2400;
const TAILLE_VIGNETTE = 480;

export type PhotoPreparee = {
  web: Blob;
  vignette: Blob;
  largeur: number;
  hauteur: number;
};

export async function preparerPhoto(fichier: File): Promise<PhotoPreparee> {
  // `from-image` applique l'orientation EXIF : sinon les photos de téléphone
  // arrivent couchées et la détection de visages rate.
  const bitmap = await createImageBitmap(fichier, { imageOrientation: "from-image" });
  try {
    const web = await redimensionner(bitmap, TAILLE_WEB, 0.82);
    const vignette = await redimensionner(bitmap, TAILLE_VIGNETTE, 0.7);
    return {
      web: web.blob,
      vignette: vignette.blob,
      largeur: web.largeur,
      hauteur: web.hauteur,
    };
  } finally {
    bitmap.close();
  }
}

async function redimensionner(bitmap: ImageBitmap, cote: number, qualite: number) {
  const echelle = Math.min(1, cote / Math.max(bitmap.width, bitmap.height));
  const largeur = Math.max(1, Math.round(bitmap.width * echelle));
  const hauteur = Math.max(1, Math.round(bitmap.height * echelle));

  const canvas = document.createElement("canvas");
  canvas.width = largeur;
  canvas.height = hauteur;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, largeur, hauteur);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", qualite),
  );
  if (!blob) throw new Error("Conversion WebP impossible");
  return { blob, largeur, hauteur };
}
