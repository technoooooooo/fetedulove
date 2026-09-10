export type PhotoAdmin = {
  id: string;
  chemin: string;
  url: string;
  vignette: string;
  largeur: number;
  hauteur: number;
  indexee: boolean;
};

export type Boite = { x: number; y: number; l: number; h: number };

/**
 * Vue légère d'un visage : les empreintes (1024 flottants chacune) restent
 * côté serveur, sinon la page admin téléchargerait des dizaines de Mo.
 */
export type VisageAdmin = {
  id: string;
  photoId: string;
  boite: Boite;
  score: number;
  membreId: number | null;
  ancre: boolean;
  similarite: number | null;
};

/** Rattachement manuel d'un membre à une photo, sans visage détecté. */
export type Rattachement = { photoId: string; membreId: number };

export type GroupeAdmin = {
  ids: string[];
  /** quelques visages représentatifs, pour l'aperçu */
  apercu: Array<{ id: string; photoId: string; boite: Boite }>;
};
