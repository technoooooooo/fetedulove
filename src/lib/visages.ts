/**
 * Comparaison d'empreintes faciales.
 *
 * On reprend exactement la mesure de @vladmandic/human (distance de Minkowski
 * d'ordre 2, multiplicateur 25, normalisée entre 0.2 et 0.8) pour que les
 * seuils utilisés ici correspondent à ceux documentés par la bibliothèque.
 * L'avantage de la réimplémenter : l'écran d'association tourne sans charger
 * les 9 Mo de modèles.
 */

const ORDRE = 2;
const MULTIPLICATEUR = 25;
const MIN = 0.2;
const MAX = 0.8;

/** Similarité 0..1 entre deux descripteurs. 1 = identique. */
export function similarite(a: number[], b: number[]) {
  if (!a || !b || a.length !== b.length) return 0;
  let somme = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    somme += d * d;
  }
  const distance = Math.round(100 * MULTIPLICATEUR * somme) / 100;
  if (distance === 0) return 1;
  const racine = ORDRE === 2 ? Math.sqrt(distance) : distance ** (1 / ORDRE);
  const norme = (1 - racine / 100 - MIN) / (MAX - MIN);
  return Math.round(100 * Math.max(Math.min(norme, 1), 0)) / 100;
}

/** Descripteur moyen d'un groupe de visages. */
export function centroide(empreintes: number[][]): number[] {
  if (empreintes.length === 0) return [];
  const taille = empreintes[0].length;
  const somme = new Array<number>(taille).fill(0);
  for (const e of empreintes) {
    for (let i = 0; i < taille; i++) somme[i] += e[i];
  }
  return somme.map((v) => v / empreintes.length);
}

export type Regroupable = { id: string; empreinte: number[]; score: number };

export type Groupe<T extends Regroupable> = {
  membres: T[];
  centroide: number[];
};

/**
 * Regroupement glouton : chaque visage rejoint le groupe dont le centroïde lui
 * ressemble le plus, si la similarité dépasse le seuil. Sinon il ouvre un
 * nouveau groupe. Les visages les plus nets sont traités en premier pour que
 * les centroïdes se construisent sur les meilleures images.
 */
export function regrouper<T extends Regroupable>(visages: T[], seuil: number): Groupe<T>[] {
  const groupes: Groupe<T>[] = [];
  const tries = [...visages].sort((a, b) => b.score - a.score);

  for (const visage of tries) {
    let meilleur: Groupe<T> | null = null;
    let meilleureSimilarite = seuil;

    for (const groupe of groupes) {
      const s = similarite(visage.empreinte, groupe.centroide);
      if (s >= meilleureSimilarite) {
        meilleureSimilarite = s;
        meilleur = groupe;
      }
    }

    if (meilleur) {
      meilleur.membres.push(visage);
      meilleur.centroide = centroide(meilleur.membres.map((m) => m.empreinte));
    } else {
      groupes.push({ membres: [visage], centroide: [...visage.empreinte] });
    }
  }

  return groupes.sort((a, b) => b.membres.length - a.membres.length);
}
