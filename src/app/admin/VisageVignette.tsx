"use client";

import type { Boite } from "./types";

/**
 * Affiche le recadrage d'un visage à partir de la photo entière, sans
 * générer de fichier : on joue sur background-size / background-position.
 * Le cadre est rendu carré pour que les grilles restent régulières.
 */
export default function VisageVignette({
  url,
  boite,
  largeur,
  hauteur,
  marge = 0.6,
  className = "",
}: {
  url: string;
  boite: Boite;
  largeur: number;
  hauteur: number;
  marge?: number;
  className?: string;
}) {
  // côté du carré à découper, en pixels de la photo source
  const cote = Math.max(boite.l * largeur, boite.h * hauteur) * (1 + marge);
  const l = Math.min(1, cote / largeur);
  const h = Math.min(1, cote / hauteur);

  const cx = boite.x + boite.l / 2;
  const cy = boite.y + boite.h / 2;
  const x = Math.min(Math.max(0, cx - l / 2), 1 - l);
  const y = Math.min(Math.max(0, cy - h / 2), 1 - h);

  return (
    <div
      className={`aspect-square bg-rose/20 bg-no-repeat ${className}`}
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: `${100 / l}% ${100 / h}%`,
        backgroundPosition: `${l < 1 ? (x / (1 - l)) * 100 : 50}% ${
          h < 1 ? (y / (1 - h)) * 100 : 50
        }%`,
      }}
    />
  );
}
