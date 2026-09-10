import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MEMBRES_PAR_ID, carteSrc } from "@/data/membres";
import {
  photosDuMembre,
  rattachementsDesPhotos,
  supabaseConfigure,
  visagesNommesParPhoto,
} from "@/lib/supabase";
import PhotosMembre, { type PhotoMembre } from "./PhotosMembre";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const membre = MEMBRES_PAR_ID.get(Number((await params).id));
  if (!membre) return { title: "Carte introuvable — Fiona & Antoine" };
  return {
    title: `Les photos de ${membre.prenom} — Fiona & Antoine`,
    description: `Toutes les photos du mariage où ${membre.prenom} (team ${membre.team}) a été reconnu·e.`,
  };
}

/**
 * Attache à chaque photo les visages dont on connaît le prénom, pour que la
 * visionneuse puisse les nommer au survol. Le pseudo-membre « pas un invité »
 * n'a pas de carte : il est écarté par la recherche dans MEMBRES_PAR_ID.
 */
async function avecPrenoms(
  photos: Array<Omit<PhotoMembre, "visages" | "membres">>,
): Promise<PhotoMembre[]> {
  const ids = photos.map((p) => p.id);
  const [visagesParPhoto, manuelsParPhoto] = await Promise.all([
    visagesNommesParPhoto(ids),
    rattachementsDesPhotos(ids),
  ]);

  return photos.map((photo) => {
    const visages = (visagesParPhoto.get(photo.id) ?? []).flatMap((v) => {
      const nomme = v.membre_id === null ? undefined : MEMBRES_PAR_ID.get(v.membre_id);
      return nomme
        ? [
            {
              id: v.id,
              x: v.x,
              y: v.y,
              l: v.l,
              h: v.h,
              membreId: nomme.id,
              prenom: nomme.prenom,
            },
          ]
        : [];
    });

    // le trombinoscope de la photo : visages reconnus puis ajouts manuels,
    // chaque personne une seule fois même si elle apparaît des deux côtés
    const membres = [
      ...new Set([
        ...visages.map((v) => v.membreId),
        ...(manuelsParPhoto.get(photo.id) ?? []).filter((id) =>
          MEMBRES_PAR_ID.has(id),
        ),
      ]),
    ];

    return { ...photo, visages, membres };
  });
}

export default async function MembrePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const membre = MEMBRES_PAR_ID.get(Number((await params).id));
  if (!membre) notFound();

  let photos: PhotoMembre[] = [];
  let erreur = false;
  if (supabaseConfigure()) {
    try {
      photos = await avecPrenoms(await photosDuMembre(membre.id));
    } catch {
      // galerie pas encore initialisée : on affiche l'état vide plutôt qu'une 500
      erreur = true;
    }
  } else {
    erreur = true;
  }

  return (
    <main className="flex min-h-dvh bg-rose-bg p-3 sm:p-5">
      <div className="grain-overlay" />

      <div className="relative flex min-w-0 flex-1 flex-col items-center rounded-[2rem] sm:rounded-[2.5rem] bg-rouge text-rose px-3 py-6 sm:px-8 sm:py-10">
        <div className="w-full max-w-5xl">
          <Link
            href="/after"
            className="inline-flex items-center gap-2 rounded-full bg-rose/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-rose hover:text-rouge transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Toutes les cartes
          </Link>

          <header className="mt-6 mb-8 flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:gap-7 text-center sm:text-left">
            <Image
              src={carteSrc(membre.id)}
              alt={`Carte de membre de ${membre.prenom}`}
              width={649}
              height={1004}
              sizes="(max-width: 640px) 45vw, 180px"
              className="w-32 sm:w-44 h-auto rounded-2xl shadow-lg -rotate-2"
              priority
            />
            <div className="pb-1">
              <p className="text-xs uppercase tracking-[0.3em] font-semibold opacity-70 mb-2">
                Team {membre.team}
              </p>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-none">
                {membre.prenom}
              </h1>
              <p className="mt-3 text-base sm:text-lg opacity-90">
                {photos.length === 0
                  ? "Aucune photo pour l’instant."
                  : `${photos.length} photo${photos.length > 1 ? "s" : ""} où on t’a reconnu·e.`}
              </p>
            </div>
          </header>

          {photos.length === 0 ? (
            <div className="rounded-2xl border border-rose/25 bg-rose/10 px-6 py-12 text-center">
              <p className="font-display text-3xl sm:text-4xl mb-3">
                {erreur ? "La galerie arrive" : "Rien pour toi… pour l’instant"}
              </p>
              <p className="mx-auto max-w-md text-base opacity-90">
                {erreur
                  ? "Les photos ne sont pas encore en ligne. Reviens dans quelques jours !"
                  : "On n’a pas encore retrouvé ton visage sur les photos publiées. D’autres arrivent, repasse plus tard."}
              </p>
            </div>
          ) : (
            <PhotosMembre photos={photos} prenom={membre.prenom} />
          )}
        </div>
      </div>
    </main>
  );
}
