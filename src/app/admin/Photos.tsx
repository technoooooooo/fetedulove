"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { MEMBRES_PAR_ID, avatarSrc } from "@/data/membres";
import ChoixMembre from "./ChoixMembre";
import type { PhotoAdmin, Rattachement, VisageAdmin } from "./types";

/** Pseudo-membre : visages qui ne sont pas des invités. */
const IGNORE = 0;

type Filtre = "toutes" | "sansVisage" | "sansPersonne";

export default function Photos({
  photos,
  visages,
  rattachements,
  onChange,
}: {
  photos: PhotoAdmin[];
  visages: VisageAdmin[];
  rattachements: Rattachement[];
  onChange: () => Promise<void>;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [filtre, setFiltre] = useState<Filtre>("toutes");
  const [detail, setDetail] = useState<PhotoAdmin | null>(null);

  const visagesParPhoto = useMemo(() => {
    const map = new Map<string, VisageAdmin[]>();
    for (const v of visages) {
      map.set(v.photoId, [...(map.get(v.photoId) ?? []), v]);
    }
    return map;
  }, [visages]);

  const manuelsParPhoto = useMemo(() => {
    const map = new Map<string, number[]>();
    for (const r of rattachements) {
      map.set(r.photoId, [...(map.get(r.photoId) ?? []), r.membreId]);
    }
    return map;
  }, [rattachements]);

  /** Personnes identifiées par photo : visages nommés + ajouts manuels. */
  const personnesParPhoto = useMemo(() => {
    const map = new Map<string, number>();
    for (const photo of photos) {
      const nommes = (visagesParPhoto.get(photo.id) ?? []).filter(
        (v) => v.membreId !== null && v.membreId !== IGNORE,
      ).length;
      map.set(photo.id, nommes + (manuelsParPhoto.get(photo.id) ?? []).length);
    }
    return map;
  }, [photos, visagesParPhoto, manuelsParPhoto]);

  const sansVisage = useMemo(
    () => photos.filter((p) => (visagesParPhoto.get(p.id) ?? []).length === 0),
    [photos, visagesParPhoto],
  );

  const sansPersonne = useMemo(
    () => photos.filter((p) => (personnesParPhoto.get(p.id) ?? 0) === 0),
    [photos, personnesParPhoto],
  );

  const listees =
    filtre === "sansVisage" ? sansVisage : filtre === "sansPersonne" ? sansPersonne : photos;

  return (
    <section className="rounded-2xl border border-rose/25 bg-rose/10 p-5">
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span>
          <span className="block font-display text-2xl">La galerie</span>
          <span className="text-sm opacity-80">
            {photos.length} photo{photos.length > 1 ? "s" : ""} · {visages.length} visage
            {visages.length > 1 ? "s" : ""}
            {sansVisage.length > 0 && ` · ${sansVisage.length} sans visage détecté`}
          </span>
        </span>
        <span className="rounded-full bg-rose/15 px-4 py-2 text-xs font-bold uppercase tracking-wide">
          {ouvert ? "Replier" : "Voir"}
        </span>
      </button>

      {ouvert && (
        <>
          <p className="mt-4 text-sm opacity-80">
            Clique une photo pour dire qui est dessus — utile quand personne n&apos;a été
            détecté : de dos, flou, ou hors cadre.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Chip actif={filtre === "toutes"} onClick={() => setFiltre("toutes")}>
              Toutes ({photos.length})
            </Chip>
            <Chip actif={filtre === "sansVisage"} onClick={() => setFiltre("sansVisage")}>
              Sans visage détecté ({sansVisage.length})
            </Chip>
            <Chip
              actif={filtre === "sansPersonne"}
              onClick={() => setFiltre("sansPersonne")}
            >
              Personne d&apos;identifié ({sansPersonne.length})
            </Chip>
          </div>

          {listees.length === 0 ? (
            <p className="py-8 text-center opacity-70">Aucune photo ici. 🎉</p>
          ) : (
            <ul className="mt-4 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2">
              {listees.map((p) => {
                const personnes = personnesParPhoto.get(p.id) ?? 0;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setDetail(p)}
                      className="group relative block w-full overflow-hidden rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.vignette}
                        alt=""
                        loading="lazy"
                        className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span
                        className={`absolute bottom-1 left-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          personnes > 0 ? "bg-rouge/85 text-rose" : "bg-jaune text-rouge"
                        }`}
                      >
                        {!p.indexee
                          ? "à indexer"
                          : personnes > 0
                            ? `${personnes} 👤`
                            : "qui est-ce ?"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {detail && (
        <DetailPhoto
          photo={detail}
          visages={visagesParPhoto.get(detail.id) ?? []}
          manuels={manuelsParPhoto.get(detail.id) ?? []}
          onFermer={() => setDetail(null)}
          onChange={onChange}
          onSupprimee={() => setDetail(null)}
        />
      )}
    </section>
  );
}

function DetailPhoto({
  photo,
  visages,
  manuels,
  onFermer,
  onChange,
  onSupprimee,
}: {
  photo: PhotoAdmin;
  visages: VisageAdmin[];
  manuels: number[];
  onFermer: () => void;
  onChange: () => Promise<void>;
  onSupprimee: () => void;
}) {
  const [choix, setChoix] = useState(false);
  const [occupe, setOccupe] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const reconnus = visages.flatMap((v) =>
    v.membreId === null || v.membreId === IGNORE
      ? []
      : [{ id: v.id, membre: MEMBRES_PAR_ID.get(v.membreId) }],
  );

  async function appeler(requete: Promise<Response>) {
    setOccupe(true);
    setErreur(null);
    try {
      const res = await requete;
      if (!res.ok) throw new Error(await res.text());
      await onChange();
    } catch (e) {
      setErreur(String(e));
    } finally {
      setOccupe(false);
      setChoix(false);
    }
  }

  /**
   * Enregistre la sélection du panneau : on n'envoie que l'écart avec ce qui
   * est déjà en base, pour ne pas réécrire des lignes inchangées.
   */
  async function enregistrer(membreIds: number[]) {
    const ajouts = membreIds.filter((id) => !manuels.includes(id));
    const retraits = manuels.filter((id) => !membreIds.includes(id));
    if (ajouts.length === 0 && retraits.length === 0) {
      setChoix(false);
      return;
    }

    setOccupe(true);
    setErreur(null);
    try {
      if (ajouts.length > 0) {
        const res = await fetch("/api/admin/rattachements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photoId: photo.id, membreIds: ajouts }),
        });
        if (!res.ok) throw new Error(await res.text());
      }
      for (const membreId of retraits) {
        const res = await fetch(
          `/api/admin/rattachements?photoId=${photo.id}&membreId=${membreId}`,
          { method: "DELETE" },
        );
        if (!res.ok) throw new Error(await res.text());
      }
      await onChange();
    } catch (e) {
      setErreur(String(e));
    } finally {
      setOccupe(false);
      setChoix(false);
    }
  }

  /** La suppression emporte visages et rattachements, par cascade en base. */
  async function supprimer() {
    if (!window.confirm("Supprimer cette photo et tout ce qui y est rattaché ?")) return;
    const params = new URLSearchParams({
      id: photo.id,
      chemin: photo.chemin,
      vignette: photo.vignette.split("/photos/")[1] ?? "",
    });
    await appeler(fetch(`/api/admin/photos?${params}`, { method: "DELETE" }));
    onSupprimee();
  }

  const detacher = (membreId: number) =>
    appeler(
      fetch(`/api/admin/rattachements?photoId=${photo.id}&membreId=${membreId}`, {
        method: "DELETE",
      }),
    );

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Qui est sur cette photo ?"
        className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-rouge/90 p-0 sm:p-6 nav-blur"
        onClick={onFermer}
      >
        <div
          className="flex max-h-[90dvh] w-full max-w-3xl flex-col gap-4 overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-rose/30 bg-rouge p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-display text-2xl text-rose">Qui est sur cette photo ?</h3>
            <button
              type="button"
              onClick={onFermer}
              className="rounded-full bg-rose/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-rose"
            >
              Fermer
            </button>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt=""
            className="mx-auto max-h-[45dvh] rounded-2xl object-contain"
          />

          {erreur && (
            <p className="rounded-xl bg-jaune/20 px-4 py-2 text-sm text-jaune">{erreur}</p>
          )}

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-rose/60">
              Reconnus automatiquement ({reconnus.length})
            </p>
            {reconnus.length === 0 ? (
              <p className="text-sm text-rose/70">
                {visages.length === 0
                  ? "Aucun visage détecté sur cette photo."
                  : `${visages.length} visage${visages.length > 1 ? "s" : ""} détecté${
                      visages.length > 1 ? "s" : ""
                    }, aucun nommé pour l’instant.`}
              </p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {reconnus.map(({ id, membre }) => (
                  <li
                    key={id}
                    className="rounded-full bg-rose/20 px-3 py-1 text-xs font-bold text-rose"
                  >
                    {membre?.prenom ?? "?"}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-rose/60">
              Ajoutés à la main ({manuels.length})
            </p>
            <ul className="flex flex-wrap items-center gap-2">
              {manuels.map((membreId) => {
                const membre = MEMBRES_PAR_ID.get(membreId);
                return (
                  <li
                    key={membreId}
                    className="inline-flex items-center gap-2 rounded-full bg-rose px-2 py-1 pr-3 text-xs font-bold text-rouge"
                  >
                    <Image
                      src={avatarSrc(membreId)}
                      alt=""
                      width={48}
                      height={48}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                    {membre?.prenom ?? `#${membreId}`}
                    <button
                      type="button"
                      aria-label={`Retirer ${membre?.prenom ?? membreId}`}
                      disabled={occupe}
                      onClick={() => void detacher(membreId)}
                      className="text-base leading-none text-rouge/50 hover:text-rouge disabled:opacity-40"
                    >
                      ×
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  disabled={occupe}
                  onClick={() => setChoix(true)}
                  className="rounded-full bg-rose px-4 py-2 text-xs font-bold uppercase tracking-wide text-rouge disabled:opacity-40"
                >
                  {occupe ? "…" : manuels.length > 0 ? "Modifier la liste" : "+ ajouter quelqu’un"}
                </button>
              </li>
            </ul>
          </div>

          <button
            type="button"
            disabled={occupe}
            onClick={() => void supprimer()}
            className="self-start rounded-full border border-rose/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-rose/70 hover:border-rose hover:text-rose disabled:opacity-40"
          >
            Supprimer la photo
          </button>
        </div>
      </div>

      {choix && (
        <ChoixMembre
          titre="Qui est sur la photo ?"
          apercu={photo.url}
          dejaChoisis={manuels}
          onFermer={() => setChoix(false)}
          onChoisir={() => undefined}
          onValider={(membreIds) => void enregistrer(membreIds)}
        />
      )}
    </>
  );
}

function Chip({
  actif,
  onClick,
  children,
}: {
  actif: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
        actif ? "bg-rose text-rouge" : "bg-rose/15 text-rose/80 hover:bg-rose/25"
      }`}
    >
      {children}
    </button>
  );
}
