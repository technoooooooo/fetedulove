"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [personne, setPersonne] = useState<number | null>(null);
  const [choixPersonne, setChoixPersonne] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

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
    const map = new Map<string, Set<number>>();
    for (const photo of photos) {
      const ids = new Set(manuelsParPhoto.get(photo.id) ?? []);
      for (const v of visagesParPhoto.get(photo.id) ?? []) {
        if (v.membreId !== null && v.membreId !== IGNORE) ids.add(v.membreId);
      }
      map.set(photo.id, ids);
    }
    return map;
  }, [photos, visagesParPhoto, manuelsParPhoto]);

  const sansVisage = useMemo(
    () => photos.filter((p) => (visagesParPhoto.get(p.id) ?? []).length === 0),
    [photos, visagesParPhoto],
  );

  const sansPersonne = useMemo(
    () => photos.filter((p) => (personnesParPhoto.get(p.id)?.size ?? 0) === 0),
    [photos, personnesParPhoto],
  );

  const listees = useMemo(() => {
    const base =
      filtre === "sansVisage" ? sansVisage : filtre === "sansPersonne" ? sansPersonne : photos;
    return personne === null
      ? base
      : base.filter((p) => personnesParPhoto.get(p.id)?.has(personne));
  }, [filtre, personne, photos, sansVisage, sansPersonne, personnesParPhoto]);

  // la photo ouverte est retrouvée par son id : elle reste juste après chaque
  // rechargement. Le parcours est figé à l'ouverture, sinon nommer quelqu'un
  // sous le filtre « personne d'identifié » ferait sortir la photo de la liste
  // et casserait la navigation.
  const [parcours, setParcours] = useState<string[]>([]);
  const ouvrir = (id: string) => {
    setParcours(listees.map((p) => p.id));
    setDetailId(id);
  };
  const detail = detailId ? photos.find((p) => p.id === detailId) : undefined;
  const index = detailId ? parcours.indexOf(detailId) : -1;
  const voisine = (pas: number) => {
    const cible = index >= 0 ? parcours[index + pas] : undefined;
    return cible ? () => setDetailId(cible) : undefined;
  };

  const nomPersonne = personne === null ? null : MEMBRES_PAR_ID.get(personne)?.prenom;

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
            Clique une photo pour dire qui est dessus, corriger un nom ou retirer
            quelqu&apos;un. Les invités voient le résultat tout de suite sur leur carte.
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
            {personne === null ? (
              <Chip actif={false} onClick={() => setChoixPersonne(true)}>
                Avec… 🔍
              </Chip>
            ) : (
              <Chip actif onClick={() => setPersonne(null)}>
                Avec {nomPersonne ?? `#${personne}`} ×
              </Chip>
            )}
          </div>

          {listees.length === 0 ? (
            <p className="py-8 text-center opacity-70">Aucune photo ici. 🎉</p>
          ) : (
            <ul className="mt-4 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2">
              {listees.map((p) => {
                const personnes = personnesParPhoto.get(p.id)?.size ?? 0;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => ouvrir(p.id)}
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
          key={detail.id}
          photo={detail}
          visages={visagesParPhoto.get(detail.id) ?? []}
          manuels={manuelsParPhoto.get(detail.id) ?? []}
          position={index >= 0 ? `${index + 1} / ${parcours.length}` : null}
          onPrecedente={voisine(-1)}
          onSuivante={voisine(1)}
          onFermer={() => setDetailId(null)}
          onChange={onChange}
          onSupprimee={() => setDetailId(parcours[index + 1] ?? null)}
        />
      )}

      {choixPersonne && (
        <ChoixMembre
          titre="Photos avec…"
          onFermer={() => setChoixPersonne(false)}
          onChoisir={(membreId) => {
            setPersonne(membreId);
            setChoixPersonne(false);
            setOuvert(true);
          }}
        />
      )}
    </section>
  );
}

/** Une personne sur la photo, avec ce qui l'y rattache. */
type Present = { membreId: number; visageIds: string[]; manuel: boolean };

function DetailPhoto({
  photo,
  visages,
  manuels,
  position,
  onPrecedente,
  onSuivante,
  onFermer,
  onChange,
  onSupprimee,
}: {
  photo: PhotoAdmin;
  visages: VisageAdmin[];
  manuels: number[];
  position: string | null;
  onPrecedente?: () => void;
  onSuivante?: () => void;
  onFermer: () => void;
  onChange: () => Promise<void>;
  onSupprimee: () => void;
}) {
  const [choix, setChoix] = useState(false);
  const [visageChoisi, setVisageChoisi] = useState<VisageAdmin | null>(null);
  const [survol, setSurvol] = useState<number | null>(null);
  const [occupe, setOccupe] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  /** Tout le monde une seule fois, qu'il soit reconnu, ajouté à la main, ou les deux. */
  const presents = useMemo(() => {
    const map = new Map<number, Present>();
    const present = (membreId: number) => {
      const p = map.get(membreId) ?? { membreId, visageIds: [], manuel: false };
      map.set(membreId, p);
      return p;
    };
    for (const v of visages) {
      if (v.membreId !== null && v.membreId !== IGNORE) present(v.membreId).visageIds.push(v.id);
    }
    for (const membreId of manuels) present(membreId).manuel = true;
    return [...map.values()];
  }, [visages, manuels]);

  const anonymes = visages.filter((v) => v.membreId === null).length;

  // flèches pour passer d'une photo à l'autre, Échap pour fermer — sauf
  // pendant le choix d'un membre, qui a son propre champ de recherche
  const panneauOuvert = choix || visageChoisi !== null;
  const clavier = useCallback(
    (e: KeyboardEvent) => {
      if (panneauOuvert || occupe) return;
      if (e.key === "ArrowLeft") onPrecedente?.();
      else if (e.key === "ArrowRight") onSuivante?.();
      else if (e.key === "Escape") onFermer();
    },
    [panneauOuvert, occupe, onPrecedente, onSuivante, onFermer],
  );
  useEffect(() => {
    window.addEventListener("keydown", clavier);
    return () => window.removeEventListener("keydown", clavier);
  }, [clavier]);

  async function executer(action: () => Promise<void>) {
    setOccupe(true);
    setErreur(null);
    try {
      await action();
      await onChange();
    } catch (e) {
      setErreur(String(e));
    } finally {
      setOccupe(false);
      setChoix(false);
      setVisageChoisi(null);
    }
  }

  async function requete(url: string, init?: RequestInit) {
    const res = await fetch(url, init);
    if (!res.ok) throw new Error(await res.text());
  }

  /**
   * Un choix fait à la main sur un visage devient une référence (ancre) : la
   * propagation automatique ne le recalculera plus et s'en servira pour
   * reconnaître la personne ailleurs.
   */
  const nommerVisages = (ids: string[], membreId: number) =>
    requete("/api/admin/visages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, membreId, ancre: true }),
    });

  const ajouterManuels = (membreIds: number[]) =>
    requete("/api/admin/rattachements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoId: photo.id, membreIds }),
    });

  const retirerManuel = (membreId: number) =>
    requete(`/api/admin/rattachements?photoId=${photo.id}&membreId=${membreId}`, {
      method: "DELETE",
    });

  /**
   * Retirer quelqu'un de la photo : ses visages passent en « pas un invité »
   * (verrouillés, pour que la propagation ne le remette pas) et son ajout
   * manuel éventuel est supprimé.
   */
  const retirer = (p: Present) =>
    executer(async () => {
      if (p.visageIds.length > 0) await nommerVisages(p.visageIds, IGNORE);
      if (p.manuel) await retirerManuel(p.membreId);
    });

  /**
   * Enregistre la sélection du panneau multiple : on n'envoie que l'écart
   * avec les ajouts manuels déjà en base. Les personnes reconnues par leur
   * visage n'y figurent pas, elles se gèrent directement sur la photo.
   */
  const enregistrerManuels = (membreIds: number[]) => {
    const ajouts = membreIds.filter((id) => !manuels.includes(id));
    const retraits = manuels.filter((id) => !membreIds.includes(id));
    if (ajouts.length === 0 && retraits.length === 0) {
      setChoix(false);
      return;
    }
    void executer(async () => {
      if (ajouts.length > 0) await ajouterManuels(ajouts);
      for (const membreId of retraits) await retirerManuel(membreId);
    });
  };

  /** La suppression emporte visages et rattachements, par cascade en base. */
  async function supprimer() {
    if (!window.confirm("Supprimer cette photo et tout ce qui y est rattaché ?")) return;
    const params = new URLSearchParams({
      id: photo.id,
      chemin: photo.chemin,
      vignette: photo.vignette.split("/photos/")[1] ?? "",
    });
    await executer(() => requete(`/api/admin/photos?${params}`, { method: "DELETE" }));
    onSupprimee();
  }

  const nomVisage = visageChoisi?.membreId
    ? MEMBRES_PAR_ID.get(visageChoisi.membreId)?.prenom
    : undefined;

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
          className="flex max-h-[94dvh] w-full max-w-5xl flex-col gap-4 overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-rose/30 bg-rouge p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-2xl text-rose">Qui est sur cette photo ?</h3>
            <div className="flex shrink-0 items-center gap-2">
              {position && (
                <span className="hidden text-xs font-semibold text-rose/60 sm:inline">
                  {position}
                </span>
              )}
              <Fleche sens="gauche" onClick={onPrecedente} disabled={occupe} />
              <Fleche sens="droite" onClick={onSuivante} disabled={occupe} />
              <button
                type="button"
                onClick={onFermer}
                className="rounded-full bg-rose/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-rose"
              >
                Fermer
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-5 md:flex-row">
            {/* la photo, avec un cadre cliquable sur chaque visage détecté */}
            <div className="flex justify-center md:w-3/5 md:shrink-0">
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt=""
                  className="block max-h-[50dvh] w-auto rounded-2xl md:max-h-[72dvh]"
                />
                {visages.map((v) => {
                  const membre =
                    v.membreId !== null && v.membreId !== IGNORE
                      ? MEMBRES_PAR_ID.get(v.membreId)
                      : undefined;
                  const ecarte = v.membreId === IGNORE;
                  const enAvant = membre && survol === membre.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={occupe}
                      onClick={() => setVisageChoisi(v)}
                      title={membre?.prenom ?? (ecarte ? "Pas un invité" : "Qui est-ce ?")}
                      style={{
                        left: `${v.boite.x * 100}%`,
                        top: `${v.boite.y * 100}%`,
                        width: `${v.boite.l * 100}%`,
                        height: `${v.boite.h * 100}%`,
                      }}
                      className={`group absolute rounded-md border-2 transition-colors ${
                        enAvant
                          ? "border-jaune bg-jaune/20"
                          : membre
                            ? "border-rose hover:bg-rose/20"
                            : ecarte
                              ? "border-dashed border-rose/30 hover:border-rose"
                              : "border-jaune hover:bg-jaune/20"
                      }`}
                    >
                      <span
                        className={`absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          membre
                            ? "bg-rose text-rouge"
                            : ecarte
                              ? "hidden bg-rouge/80 text-rose group-hover:inline"
                              : "bg-jaune text-rouge"
                        }`}
                      >
                        {membre?.prenom ?? (ecarte ? "—" : "?")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-4">
              {erreur && (
                <p className="rounded-xl bg-jaune/20 px-4 py-2 text-sm text-jaune">{erreur}</p>
              )}

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-rose/60">
                  Sur la photo ({presents.length})
                </p>
                {presents.length === 0 ? (
                  <p className="text-sm text-rose/70">Personne pour l’instant.</p>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {presents.map((p) => {
                      const membre = MEMBRES_PAR_ID.get(p.membreId);
                      return (
                        <li
                          key={p.membreId}
                          onMouseEnter={() => setSurvol(p.membreId)}
                          onMouseLeave={() => setSurvol(null)}
                          className="inline-flex items-center gap-2 rounded-full bg-rose py-1 pl-1 pr-3 text-xs font-bold text-rouge"
                        >
                          <Image
                            src={avatarSrc(p.membreId)}
                            alt=""
                            width={48}
                            height={48}
                            className="h-7 w-7 rounded-full object-cover"
                          />
                          <span>
                            {membre?.prenom ?? `#${p.membreId}`}
                            <span className="ml-1 font-normal text-rouge/60">
                              {p.visageIds.length > 0 ? "· visage" : "· ajouté"}
                            </span>
                          </span>
                          <button
                            type="button"
                            aria-label={`Retirer ${membre?.prenom ?? p.membreId} de la photo`}
                            title="Retirer de la photo"
                            disabled={occupe}
                            onClick={() => void retirer(p)}
                            className="text-base leading-none text-rouge/50 hover:text-rouge disabled:opacity-40"
                          >
                            ×
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <p className="text-sm text-rose/80">
                {visages.length === 0
                  ? "Aucun visage détecté : ajoute les personnes à la main."
                  : anonymes > 0
                    ? `${anonymes} visage${anonymes > 1 ? "s" : ""} en jaune pas encore nommé${
                        anonymes > 1 ? "s" : ""
                      } : clique dessus pour dire qui c’est.`
                    : "Clique sur un visage pour corriger son nom."}
              </p>

              <button
                type="button"
                disabled={occupe}
                onClick={() => setChoix(true)}
                className="self-start rounded-full bg-rose px-4 py-2 text-xs font-bold uppercase tracking-wide text-rouge disabled:opacity-40"
              >
                {occupe ? "…" : "+ Ajouter quelqu’un (de dos, flou, caché…)"}
              </button>

              <button
                type="button"
                disabled={occupe}
                onClick={() => void supprimer()}
                className="mt-auto self-start rounded-full border border-rose/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-rose/70 hover:border-rose hover:text-rose disabled:opacity-40"
              >
                Supprimer la photo
              </button>
            </div>
          </div>
        </div>
      </div>

      {choix && (
        <ChoixMembre
          titre="Qui d’autre est sur la photo ?"
          apercu={photo.url}
          dejaChoisis={manuels}
          onFermer={() => setChoix(false)}
          onChoisir={() => undefined}
          onValider={enregistrerManuels}
        />
      )}

      {visageChoisi && (
        <ChoixMembre
          titre={nomVisage ? `Ce n’est pas ${nomVisage} ?` : "C’est qui ?"}
          apercu={photo.url}
          onFermer={() => setVisageChoisi(null)}
          onChoisir={(membreId) => void executer(() => nommerVisages([visageChoisi.id], membreId))}
          onRetirer={
            visageChoisi.membreId !== IGNORE
              ? () => void executer(() => nommerVisages([visageChoisi.id], IGNORE))
              : undefined
          }
        />
      )}
    </>
  );
}

function Fleche({
  sens,
  onClick,
  disabled,
}: {
  sens: "gauche" | "droite";
  onClick?: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={sens === "gauche" ? "Photo précédente" : "Photo suivante"}
      disabled={disabled || !onClick}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-rose/15 text-rose hover:bg-rose/25 disabled:opacity-30"
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
        <path d={sens === "gauche" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
      </svg>
    </button>
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
