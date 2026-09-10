/**
 * Les 126 cartes de membre distribuées le jour J.
 * `id` = numéro du fichier source (public/cartes/<id>.webp), c'est aussi la clé
 * utilisée en base pour rattacher un visage à une personne.
 * Le fichier 127 est le verso de la carte (logo + QR code), il n'est pas un membre.
 */
export type Membre = {
  id: number;
  prenom: string;
  team: string;
};

export const MEMBRES: Membre[] = [
  { id: 1, prenom: "Antoine", team: "Fiona" },
  { id: 2, prenom: "Fiona", team: "Antoine" },
  { id: 3, prenom: "Baptiste", team: "PFTF" },
  { id: 4, prenom: "Arnaud", team: "PFTF" },
  { id: 5, prenom: "Morgane", team: "PFTF" },
  { id: 6, prenom: "Marine", team: "PFTF" },
  { id: 7, prenom: "Léopold", team: "PFTF" },
  { id: 8, prenom: "Nour", team: "PFTF" },
  { id: 9, prenom: "Bertille", team: "PFTF" },
  { id: 10, prenom: "Baptiste", team: "PFTF" },
  { id: 11, prenom: "Lydia", team: "PFTF" },
  { id: 12, prenom: "Hugo", team: "PFTF" },
  { id: 13, prenom: "Fannie", team: "PFTF" },
  { id: 14, prenom: "Marc", team: "PFTF" },
  { id: 15, prenom: "Sylia", team: "PFTF" },
  { id: 16, prenom: "Élodie", team: "PFTF" },
  { id: 17, prenom: "Florian", team: "PFTF" },
  { id: 18, prenom: "Steve", team: "PFTF" },
  { id: 19, prenom: "Marine", team: "PFTF" },
  { id: 20, prenom: "Zazou", team: "PFTF" },
  { id: 21, prenom: "Apolline", team: "Pont Alexandre 3" },
  { id: 22, prenom: "Tanilou", team: "Pont Alexandre 3" },
  { id: 23, prenom: "Nolan", team: "Pont Alexandre 3" },
  { id: 24, prenom: "Canelle", team: "Pont Alexandre 3" },
  { id: 25, prenom: "Amaury", team: "Poulpe" },
  { id: 26, prenom: "Hortense", team: "Poulpe" },
  { id: 27, prenom: "Anatole", team: "Poulpe" },
  { id: 28, prenom: "Louise", team: "Poulpe" },
  { id: 29, prenom: "Kenza", team: "Poulpe" },
  { id: 30, prenom: "Stéphane", team: "Poulpe" },
  { id: 31, prenom: "Anthony", team: "Poulpe" },
  { id: 32, prenom: "Samanta", team: "Poulpe" },
  { id: 33, prenom: "Carine", team: "Home Exchange" },
  { id: 34, prenom: "Clara", team: "Home Exchange" },
  { id: 35, prenom: "Marion", team: "Home Exchange" },
  { id: 36, prenom: "Thomas", team: "Home Exchange" },
  { id: 37, prenom: "Arthur", team: "Home Exchange" },
  { id: 38, prenom: "Clémentine", team: "Home Exchange" },
  { id: 39, prenom: "Thomas", team: "Home Exchange" },
  { id: 40, prenom: "Chantal", team: "Cold brew & Matcha Latte" },
  { id: 41, prenom: "Yannick", team: "Cold brew & Matcha Latte" },
  { id: 42, prenom: "Clémentine", team: "Cold brew & Matcha Latte" },
  { id: 43, prenom: "Selvam", team: "Cold brew & Matcha Latte" },
  { id: 44, prenom: "Stéphane", team: "Cold brew & Matcha Latte" },
  { id: 45, prenom: "Catherine", team: "Cold brew & Matcha Latte" },
  { id: 46, prenom: "Martine", team: "Cold brew & Matcha Latte" },
  { id: 47, prenom: "Patricia", team: "Cold brew & Matcha Latte" },
  { id: 48, prenom: "Angélique", team: "Pâtes au roquefort" },
  { id: 49, prenom: "André", team: "Pâtes au roquefort" },
  { id: 50, prenom: "Martine", team: "Pâtes au roquefort" },
  { id: 51, prenom: "Valérie", team: "Pâtes au roquefort" },
  { id: 52, prenom: "Xavier", team: "Pâtes au roquefort" },
  { id: 53, prenom: "Cathy", team: "Pâtes au roquefort" },
  { id: 54, prenom: "Gérard", team: "Pâtes au roquefort" },
  { id: 55, prenom: "Dominique", team: "Pâtes au roquefort" },
  { id: 56, prenom: "Florence", team: "C'est la tech" },
  { id: 57, prenom: "Charlotte", team: "C'est la tech" },
  { id: 58, prenom: "Mehdi", team: "C'est la tech" },
  { id: 59, prenom: "Gwen", team: "C'est la tech" },
  { id: 60, prenom: "Clément", team: "C'est la tech" },
  { id: 61, prenom: "Ludovic", team: "C'est la tech" },
  { id: 62, prenom: "Abel", team: "BST" },
  { id: 63, prenom: "Sophie", team: "BST" },
  { id: 64, prenom: "Olivier", team: "BST" },
  { id: 65, prenom: "Sophie", team: "BST" },
  { id: 66, prenom: "Olivier", team: "BST" },
  { id: 67, prenom: "Corinne", team: "BST" },
  { id: 68, prenom: "Didier", team: "BST" },
  { id: 69, prenom: "Nathalie", team: "BST" },
  { id: 70, prenom: "Clémence", team: "Pavan" },
  { id: 71, prenom: "Élise", team: "Pavan" },
  { id: 72, prenom: "Eva", team: "Pavan" },
  { id: 73, prenom: "Chloé", team: "Pavan" },
  { id: 74, prenom: "Victor", team: "Pavan" },
  { id: 75, prenom: "Justine", team: "Pavan" },
  { id: 76, prenom: "Nathan", team: "Pavan" },
  { id: 77, prenom: "Ana", team: "Pavan" },
  { id: 78, prenom: "Guilhem", team: "Balades Mosaïques" },
  { id: 79, prenom: "Cécile", team: "Balades Mosaïques" },
  { id: 80, prenom: "Jostt", team: "Balades Mosaïques" },
  { id: 81, prenom: "Dana", team: "Balades Mosaïques" },
  { id: 82, prenom: "Corentin", team: "Balades Mosaïques" },
  { id: 83, prenom: "Laurène", team: "Balades Mosaïques" },
  { id: 84, prenom: "Julie", team: "Balades Mosaïques" },
  { id: 85, prenom: "Simon", team: "Balades Mosaïques" },
  { id: 86, prenom: "Danielle", team: "Vin nat'" },
  { id: 87, prenom: "Dominique", team: "Vin nat'" },
  { id: 88, prenom: "Florence", team: "Vin nat'" },
  { id: 89, prenom: "Marie-France", team: "Vin nat'" },
  { id: 90, prenom: "Gérard", team: "Vin nat'" },
  { id: 91, prenom: "Richard", team: "Vin nat'" },
  { id: 92, prenom: "Sandrine", team: "Vin nat'" },
  { id: 93, prenom: "Philippe", team: "Vin nat'" },
  { id: 94, prenom: "Étienne", team: "P'tit run sur la corniche" },
  { id: 95, prenom: "Sarah", team: "P'tit run sur la corniche" },
  { id: 96, prenom: "Sébastien", team: "P'tit run sur la corniche" },
  { id: 97, prenom: "Guillaume", team: "P'tit run sur la corniche" },
  { id: 98, prenom: "Stéphanie", team: "P'tit run sur la corniche" },
  { id: 99, prenom: "Jayb", team: "P'tit run sur la corniche" },
  { id: 100, prenom: "Isabel", team: "P'tit run sur la corniche" },
  { id: 101, prenom: "Gabriel", team: "Callelongue" },
  { id: 102, prenom: "Jérémy", team: "Callelongue" },
  { id: 103, prenom: "Pablo", team: "Callelongue" },
  { id: 104, prenom: "Nadine", team: "Callelongue" },
  { id: 105, prenom: "Diwan", team: "Callelongue" },
  { id: 106, prenom: "Paul", team: "Callelongue" },
  { id: 107, prenom: "Salomé", team: "Callelongue" },
  { id: 108, prenom: "Jeanne", team: "Magnum" },
  { id: 109, prenom: "Hugo", team: "Magnum" },
  { id: 110, prenom: "Solen", team: "Magnum" },
  { id: 111, prenom: "Tom", team: "Magnum" },
  { id: 112, prenom: "Nicolas", team: "Magnum" },
  { id: 113, prenom: "Sara", team: "Magnum" },
  { id: 114, prenom: "Etienne", team: "Magnum" },
  { id: 115, prenom: "Matys", team: "Magnum" },
  { id: 116, prenom: "Macha", team: "Magnum" },
  { id: 117, prenom: "Jérôme", team: "Mousse" },
  { id: 118, prenom: "Cyrille", team: "Mousse" },
  { id: 119, prenom: "Quentin", team: "Mousse" },
  { id: 120, prenom: "Sabrina", team: "Mousse" },
  { id: 121, prenom: "Barbara", team: "Mousse" },
  { id: 122, prenom: "Laurent", team: "Mousse" },
  { id: 123, prenom: "Laurent", team: "Mousse" },
  { id: 124, prenom: "Leana", team: "Mousse" },
  { id: 125, prenom: "EG", team: "DJ" },
  { id: 126, prenom: "Adrien", team: "Photo" },
];

export const MEMBRES_PAR_ID = new Map(MEMBRES.map((m) => [m.id, m]));

/** Teams dans leur ordre d'apparition sur les cartes. */
export const TEAMS = [...new Set(MEMBRES.map((m) => m.team))];

export function carteSrc(id: number) {
  return `/cartes/${id}.webp`;
}

export function avatarSrc(id: number) {
  return `/cartes/avatars/${id}.webp`;
}

/** Minuscules sans accent ni ponctuation, pour la recherche. */
export function normalise(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['\u2019]/g, " ")
    .trim();
}
