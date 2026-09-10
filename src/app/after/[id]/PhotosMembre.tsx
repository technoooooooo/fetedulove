"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MEMBRES_PAR_ID, carteSrc } from "@/data/membres";

/** Visage reconnu, en fractions de l'image (0..1) comme en base. */
export type VisageNomme = {
  id: string;
  x: number;
  y: number;
  l: number;
  h: number;
  membreId: number;
  prenom: string;
};

export type PhotoMembre = {
  id: string;
  url: string;
  vignette: string;
  largeur: number;
  hauteur: number;
  certitude: number;
  visages: VisageNomme[];
  /** tout le monde sur la photo : visages reconnus + ajouts manuels */
  membres: number[];
};

/**
 * Photo bien plus haute que large : sa vignette, calée sur 480 px de hauteur,
 * ne fait qu'une poignée de pixels de large et serait floue en colonne. On sert
 * la version web pour celles-là — quelques tirages photobooth par galerie.
 */
const estEtroite = (p: PhotoMembre) => p.hauteur > p.largeur * 2;

/**
 * Nombre de rangées occupées, en prenant le tirage 2:3 comme unité : une bande
 * 1:3 est exactement deux fois plus haute à largeur égale, donc deux rangées.
 */
const rangees = (p: PhotoMembre) =>
  Math.min(2, Math.max(1, Math.round(p.hauteur / p.largeur / 1.5)));

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function PhotosMembre({
  photos,
  prenom,
}: {
  photos: PhotoMembre[];
  prenom: string;
}) {
  const [ouverte, setOuverte] = useState<number | null>(null);

  const index =
    ouverte === null || photos.length === 0
      ? null
      : Math.min(ouverte, photos.length - 1);
  const photo = index === null ? null : photos[index];

  const naviguer = useCallback(
    (pas: number) =>
      setOuverte((i) =>
        i === null ? null : (i + pas + photos.length) % photos.length,
      ),
    [photos.length],
  );

  useEffect(() => {
    if (ouverte === null) return;
    function touche(e: KeyboardEvent) {
      if (e.key === "Escape") setOuverte(null);
      if (e.key === "ArrowRight") naviguer(1);
      if (e.key === "ArrowLeft") naviguer(-1);
    }
    window.addEventListener("keydown", touche);
    return () => window.removeEventListener("keydown", touche);
  }, [ouverte, naviguer]);

  return (
    <>
      {/* Grille à colonnes égales : toutes les photos font la même largeur,
          et une bande photobooth — deux fois plus haute qu'un tirage à largeur
          égale — occupe simplement deux rangées. Les colonnes restent alignées,
          la lecture va de gauche à droite, et les vignettes d'une bande sont
          aussi larges que n'importe quelle autre photo. */}
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <li key={p.id} className={rangees(p) === 2 ? "row-span-2" : undefined}>
            <motion.button
              type="button"
              onClick={() => setOuverte(i)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 16) * 0.03, duration: 0.4, ease: EASE }}
              className="group block w-full overflow-hidden rounded-xl bg-rose/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={estEtroite(p) ? p.url : p.vignette}
                alt={`Photo du mariage avec ${prenom}`}
                loading="lazy"
                // proportion connue avant le chargement : la place est
                // réservée et rien ne saute quand l'image arrive
                style={{ aspectRatio: `${p.largeur} / ${p.hauteur}` }}
                className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </motion.button>
          </li>
        ))}
      </ul>

      {photo && index !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${index + 1} sur ${photos.length}`}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-rouge/95 p-4 nav-blur"
          onClick={() => setOuverte(null)}
        >
          <div
            // sur mobile la colonne photo + trombinoscope dépasse l'écran :
            // elle défile en entier, en laissant la place aux boutons du bas
            className="flex max-h-full w-full max-w-[92rem] flex-col items-center gap-4 overflow-y-auto pb-14 sm:flex-row sm:items-start sm:justify-center sm:gap-6 sm:overflow-visible sm:pb-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* le conteneur épouse l'image affichée : les visages sont alors
                positionnables en pourcentages, comme ils sont stockés */}
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={`Photo du mariage avec ${prenom}`}
                className="block max-h-[58dvh] max-w-full rounded-2xl object-contain shadow-2xl sm:max-h-[82dvh]"
              />

              {photo.visages.map((v) => (
                <Visage key={v.id} visage={v} />
              ))}
            </div>

            {/* le trombinoscope de la photo : plutôt que d'encadrer les visages,
                on montre les cartes de ceux qui sont dessus */}
            <aside className="w-full max-w-md shrink-0 overflow-y-auto sm:max-h-[82dvh] sm:w-52 lg:w-60">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-rose/60">
                Sur cette photo
              </p>

              {photo.membres.length === 0 ? (
                <p className="text-sm text-rose/70">
                  Personne d&apos;identifié sur cette photo.
                </p>
              ) : (
                <ul className="grid grid-cols-3 gap-2 sm:grid-cols-2">
                  {photo.membres.map((membreId) => {
                    const membre = MEMBRES_PAR_ID.get(membreId);
                    if (!membre) return null;
                    return (
                      <li key={membreId}>
                        <Link
                          href={`/after/${membreId}`}
                          className="group block overflow-hidden rounded-xl shadow-md transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
                        >
                          <Image
                            src={carteSrc(membreId)}
                            alt={`Carte de membre de ${membre.prenom}`}
                            width={649}
                            height={1004}
                            sizes="160px"
                            className="h-auto w-full"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </aside>
          </div>

          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setOuverte(null)}
            className="absolute top-4 right-4 rounded-full bg-rose px-4 py-2 text-sm font-bold uppercase tracking-wide text-rouge"
          >
            Fermer
          </button>

          {photos.length > 1 && (
            <>
              <FlecheLightbox cote="gauche" onClick={() => naviguer(-1)} />
              <FlecheLightbox cote="droite" onClick={() => naviguer(1)} />
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-rose/20 px-4 py-1.5 text-sm font-semibold text-rose">
                {index + 1} / {photos.length}
              </p>
            </>
          )}

          <a
            href={photo.url}
            download
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-4 right-4 rounded-full bg-rose px-4 py-2 text-sm font-bold uppercase tracking-wide text-rouge"
          >
            Télécharger
          </a>
        </div>
      )}
    </>
  );
}

/** Zone d'un visage reconnu : rien au repos, le prénom apparaît au survol. */
function Visage({ visage }: { visage: VisageNomme }) {
  return (
    <span
      className="group absolute rounded-lg ring-rose/0 transition-[box-shadow] hover:ring-2 hover:ring-rose"
      style={{
        left: `${visage.x * 100}%`,
        top: `${visage.y * 100}%`,
        width: `${visage.l * 100}%`,
        height: `${visage.h * 100}%`,
      }}
    >
      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-rose px-2.5 py-1 text-xs font-bold text-rouge opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {visage.prenom}
      </span>
    </span>
  );
}

function FlecheLightbox({
  cote,
  onClick,
}: {
  cote: "gauche" | "droite";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={cote === "gauche" ? "Photo précédente" : "Photo suivante"}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`absolute top-1/2 -translate-y-1/2 ${
        cote === "gauche" ? "left-2 sm:left-4" : "right-2 sm:right-4"
      } flex h-11 w-11 items-center justify-center rounded-full bg-rose/20 text-rose hover:bg-rose hover:text-rouge transition-colors`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-6 w-6 ${cote === "gauche" ? "" : "rotate-180"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>
  );
}
