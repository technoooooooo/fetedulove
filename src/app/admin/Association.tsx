"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { MEMBRES_PAR_ID, avatarSrc } from "@/data/membres";
import ChoixMembre from "./ChoixMembre";
import VisageVignette from "./VisageVignette";
import type { GroupeAdmin, PhotoAdmin, Rattachement, VisageAdmin } from "./types";

/** Pseudo-membre : visages qui ne sont pas des invités (serveurs, passants…). */
const IGNORE = 0;

export default function Association({
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
  const [vue, setVue] = useState<"aIdentifier" | "identifies" | "sansPersonne">(
    "aIdentifier",
  );
  /** photo qu'on rattache à la main, faute de visage détecté */
  const [photoPour, setPhotoPour] = useState<PhotoAdmin | null>(null);
  const [seuilGroupe, setSeuilGroupe] = useState(0.5);
  const [seuilPropagation, setSeuilPropagation] = useState(0.5);
  const [groupes, setGroupes] = useState<GroupeAdmin[]>([]);
  const [regroupementEnCours, setRegroupementEnCours] = useState(false);
  const [choixPour, setChoixPour] = useState<{ ids: string[]; titre: string } | null>(null);
  /** ids du groupe ouvert en grand : on les garde tels quels pour retrouver le
   *  groupe après un recalcul, ses ids ayant alors bougé. */
  const [deplie, setDeplie] = useState<string[] | null>(null);
  const [occupe, setOccupe] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const photosParId = useMemo(() => new Map(photos.map((p) => [p.id, p])), [photos]);
  const visagesParId = useMemo(() => new Map(visages.map((v) => [v.id, v])), [visages]);
  const deplieSet = useMemo(() => (deplie ? new Set(deplie) : null), [deplie]);

  const nonAssignes = useMemo(
    () => visages.filter((v) => v.membreId === null).length,
    [visages],
  );

  const parMembre = useMemo(() => {
    const map = new Map<number, VisageAdmin[]>();
    for (const v of visages) {
      if (v.membreId === null) continue;
      const liste = map.get(v.membreId) ?? [];
      liste.push(v);
      map.set(v.membreId, liste);
    }
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [visages]);

  const ancres = useMemo(() => visages.filter((v) => v.ancre).length, [visages]);

  /**
   * Photos sur lesquelles personne n'est identifié : ni visage nommé, ni ajout
   * manuel. Un baiser, une personne de dos, un flou de danse — la détection n'a
   * rien à proposer, c'est donc ici qu'on les rattache à la main.
   */
  const sansPersonne = useMemo(() => {
    const identifiees = new Set<string>();
    for (const v of visages) {
      if (v.membreId !== null && v.membreId !== IGNORE) identifiees.add(v.photoId);
    }
    for (const r of rattachements) identifiees.add(r.photoId);
    return photos.filter((p) => !identifiees.has(p.id));
  }, [photos, visages, rattachements]);

  /** Après un recalcul, le groupe ouvert est celui qui a gardé le plus de ses
   *  visages : sans ça, un groupe éclaté en deux s'ouvrirait deux fois. */
  const cleDeplie = useMemo(() => {
    if (!deplieSet) return null;
    let meilleure: string | null = null;
    let max = 0;
    for (const groupe of groupes) {
      const communs = groupe.ids.filter((id) => deplieSet.has(id)).length;
      if (communs > max) {
        max = communs;
        meilleure = groupe.ids[0];
      }
    }
    return meilleure;
  }, [groupes, deplieSet]);

  const regrouper = useCallback(async (seuil: number) => {
    setRegroupementEnCours(true);
    try {
      const res = await fetch("/api/admin/regroupement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seuil }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { groupes } = (await res.json()) as { groupes: GroupeAdmin[] };
      setGroupes(groupes);
    } catch (e) {
      setMessage(`Regroupement impossible : ${String(e)}`);
    } finally {
      setRegroupementEnCours(false);
    }
  }, []);

  // le curseur bouge en continu : on attend qu'il se stabilise avant de recalculer
  useEffect(() => {
    const t = setTimeout(() => void regrouper(seuilGroupe), 400);
    return () => clearTimeout(t);
  }, [seuilGroupe, visages, regrouper]);

  async function patch(corps: unknown) {
    setOccupe("patch");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/visages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corps),
      });
      if (!res.ok) throw new Error(await res.text());
      await onChange();
    } catch (e) {
      setMessage(String(e));
    } finally {
      setOccupe(null);
    }
  }

  async function rattacher(photoId: string, membreIds: number[]) {
    if (membreIds.length === 0) {
      setPhotoPour(null);
      return;
    }
    setOccupe("rattachement");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/rattachements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId, membreIds }),
      });
      if (!res.ok) throw new Error(await res.text());
      await onChange();
    } catch (e) {
      setMessage(String(e));
    } finally {
      setOccupe(null);
      setPhotoPour(null);
    }
  }

  async function propager() {
    setOccupe("propagation");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/propagation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seuil: seuilPropagation }),
      });
      const data = (await res.json()) as { rattaches?: number; error?: string };
      if (!res.ok) throw new Error(data.error ?? "échec");
      setMessage(`${data.rattaches ?? 0} visages rattachés automatiquement.`);
      await onChange();
    } catch (e) {
      setMessage(String(e));
    } finally {
      setOccupe(null);
    }
  }

  return (
    <section className="rounded-2xl border border-rose/25 bg-rose/10 p-5">
      <h2 className="font-display text-2xl mb-1">3 · Mettre un nom sur les visages</h2>
      <p className="text-sm opacity-80 mb-4">
        Les visages sont regroupés par ressemblance. Nomme un groupe : il devient
        une référence. « Propager » étend ensuite chaque référence à toutes les
        photos restantes.
      </p>

      <dl className="mb-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <Stat valeur={visages.length} libelle="visages" />
        <Stat valeur={visages.length - nonAssignes} libelle="rattachés" />
        <Stat valeur={ancres} libelle="références" />
        <Stat
          valeur={parMembre.filter(([id]) => id !== IGNORE).length}
          libelle="membres reconnus"
        />
      </dl>

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <Curseur
          libelle="Finesse des groupes"
          aide="Plus haut = groupes plus petits mais plus sûrs"
          valeur={seuilGroupe}
          onChange={setSeuilGroupe}
        />
        <Curseur
          libelle="Seuil de reconnaissance"
          aide="Plus haut = moins de photos, moins d’erreurs"
          valeur={seuilPropagation}
          onChange={setSeuilPropagation}
        />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void propager()}
          disabled={occupe !== null || ancres === 0}
          className="rounded-full bg-rose px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-rouge disabled:opacity-40"
        >
          {occupe === "propagation" ? "Propagation…" : "Propager les références"}
        </button>
        {ancres === 0 && (
          <span className="text-sm opacity-70">Nomme d’abord au moins un groupe.</span>
        )}
      </div>

      {message && (
        <p className="mb-4 rounded-xl bg-jaune/20 px-4 py-2 text-sm text-jaune">{message}</p>
      )}

      <div className="mb-4 flex gap-2">
        <Onglet actif={vue === "aIdentifier"} onClick={() => setVue("aIdentifier")}>
          À identifier ({groupes.length})
        </Onglet>
        <Onglet actif={vue === "identifies"} onClick={() => setVue("identifies")}>
          Identifiés ({parMembre.length})
        </Onglet>
        <Onglet actif={vue === "sansPersonne"} onClick={() => setVue("sansPersonne")}>
          Sans personne ({sansPersonne.length})
        </Onglet>
      </div>

      {vue === "sansPersonne" ? (
        sansPersonne.length === 0 ? (
          <p className="py-8 text-center opacity-70">
            Toutes les photos ont au moins une personne. 🎉
          </p>
        ) : (
          <>
            <p className="mb-3 text-sm opacity-80">
              Aucun visage exploitable sur ces photos. Clique pour dire qui est
              dessus : elles apparaîtront dans sa galerie.
            </p>
            <ul className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-2">
              {sansPersonne.map((photo) => (
                <li key={photo.id}>
                  <button
                    type="button"
                    disabled={occupe !== null}
                    onClick={() => setPhotoPour(photo)}
                    className="group relative block w-full overflow-hidden rounded-lg disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.vignette}
                      alt=""
                      loading="lazy"
                      className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-1 left-1 rounded-full bg-jaune px-2 py-0.5 text-[10px] font-bold text-rouge">
                      qui est-ce ?
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )
      ) : vue === "aIdentifier" ? (
        regroupementEnCours ? (
          <p className="py-8 text-center opacity-70">Regroupement…</p>
        ) : groupes.length === 0 ? (
          <p className="py-8 text-center opacity-70">Plus rien à identifier. 🎉</p>
        ) : (
          <ul className="space-y-3">
            {groupes.map((groupe) => {
              const estDeplie = groupe.ids[0] === cleDeplie;
              return (
              <li
                key={groupe.ids[0]}
                className="rounded-xl bg-rouge/40 border border-rose/20 p-3"
              >
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="flex -space-x-3">
                  {groupe.apercu.map((v) => {
                    const photo = photosParId.get(v.photoId);
                    if (!photo) return null;
                    return (
                      <VisageVignette
                        key={v.id}
                        url={photo.vignette}
                        boite={v.boite}
                        largeur={photo.largeur}
                        hauteur={photo.hauteur}
                        className="w-14 shrink-0 rounded-full border-2 border-rouge"
                      />
                    );
                  })}
                </div>

                <p className="flex-1 text-sm font-semibold">
                  {groupe.ids.length} visage{groupe.ids.length > 1 ? "s" : ""}
                </p>

                {groupe.ids.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setDeplie(estDeplie ? null : groupe.ids)}
                    className="rounded-full border border-rose/40 px-4 py-2 text-xs font-bold uppercase tracking-wide"
                  >
                    {estDeplie ? "Replier" : "Déplier"}
                  </button>
                )}
                <button
                  type="button"
                  disabled={occupe !== null}
                  onClick={() =>
                    setChoixPour({
                      ids: groupe.ids,
                      titre: `Qui est-ce ? (${groupe.ids.length} visages)`,
                    })
                  }
                  className="rounded-full bg-rose px-4 py-2 text-xs font-bold uppercase tracking-wide text-rouge disabled:opacity-40"
                >
                  C’est qui ?
                </button>
                <button
                  type="button"
                  disabled={occupe !== null}
                  onClick={() => void patch({ ids: groupe.ids, membreId: IGNORE, ancre: true })}
                  className="rounded-full border border-rose/40 px-4 py-2 text-xs font-bold uppercase tracking-wide disabled:opacity-40"
                >
                  Pas un invité
                </button>
                </div>

                {estDeplie && (
                  <>
                    <p className="mt-4 mb-2 text-xs uppercase tracking-wider opacity-60">
                      Un clic sur un visage le nomme seul · le 🚫 l’écarte
                    </p>
                    <ul className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                      {groupe.ids.map((id) => {
                        const visage = visagesParId.get(id);
                        const photo = visage && photosParId.get(visage.photoId);
                        if (!visage || !photo) return null;
                        return (
                          <li key={id} className="group relative">
                            <button
                              type="button"
                              disabled={occupe !== null}
                              onClick={() => setChoixPour({ ids: [id], titre: "C’est qui ?" })}
                              className="block w-full overflow-hidden rounded-lg ring-rose transition-shadow hover:ring-2 disabled:opacity-40"
                            >
                              {/* la version web, pas la vignette : à cette taille le
                                  recadrage d’un visage doit rester reconnaissable */}
                              <VisageVignette
                                url={photo.url}
                                boite={visage.boite}
                                largeur={photo.largeur}
                                hauteur={photo.hauteur}
                              />
                            </button>
                            <button
                              type="button"
                              disabled={occupe !== null}
                              aria-label="Pas un invité"
                              onClick={() =>
                                void patch({ ids: [id], membreId: IGNORE, ancre: true })
                              }
                              className="absolute top-1 right-1 hidden h-6 w-6 items-center justify-center rounded-full bg-rouge text-xs group-hover:flex disabled:opacity-40"
                            >
                              🚫
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </li>
              );
            })}
          </ul>
        )
      ) : (
        <ul className="space-y-3">
          {parMembre.map(([membreId, liste]) => {
            const membre = MEMBRES_PAR_ID.get(membreId);
            const photosDistinctes = new Set(liste.map((v) => v.photoId)).size;
            return (
              <li
                key={membreId}
                className="flex flex-wrap items-center gap-3 sm:gap-4 rounded-xl bg-rouge/40 border border-rose/20 p-3"
              >
                {membre ? (
                  <Image
                    src={avatarSrc(membre.id)}
                    alt=""
                    width={96}
                    height={96}
                    className="w-14 rounded-lg shrink-0"
                  />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-rose/15 text-2xl">
                    🚫
                  </span>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">
                    {membre ? membre.prenom : "Pas des invités"}
                    {membre && (
                      <span className="ml-2 text-xs font-normal opacity-60">{membre.team}</span>
                    )}
                  </p>
                  <p className="text-xs opacity-70">
                    {liste.length} visage{liste.length > 1 ? "s" : ""} · {photosDistinctes} photo
                    {photosDistinctes > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="hidden sm:flex -space-x-3">
                  {liste.slice(0, 4).map((v) => {
                    const photo = photosParId.get(v.photoId);
                    if (!photo) return null;
                    return (
                      <VisageVignette
                        key={v.id}
                        url={photo.vignette}
                        boite={v.boite}
                        largeur={photo.largeur}
                        hauteur={photo.hauteur}
                        className="w-12 shrink-0 rounded-full border-2 border-rouge"
                      />
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={occupe !== null}
                  onClick={() => void patch({ ids: liste.map((v) => v.id), membreId: null })}
                  className="rounded-full border border-rose/40 px-4 py-2 text-xs font-bold uppercase tracking-wide disabled:opacity-40"
                >
                  Détacher
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {photoPour && (
        <ChoixMembre
          titre="Qui est sur cette photo ?"
          apercu={photoPour.url}
          onFermer={() => setPhotoPour(null)}
          onChoisir={() => undefined}
          onValider={(membreIds) => void rattacher(photoPour.id, membreIds)}
        />
      )}

      {choixPour && (
        <ChoixMembre
          titre={choixPour.titre}
          onFermer={() => setChoixPour(null)}
          onChoisir={(membreId) => {
            const ids = choixPour.ids;
            setChoixPour(null);
            void patch({ ids, membreId, ancre: true });
          }}
        />
      )}
    </section>
  );
}

function Stat({ valeur, libelle }: { valeur: number; libelle: string }) {
  return (
    <div className="rounded-xl bg-rouge/40 border border-rose/20 py-3">
      <dt className="sr-only">{libelle}</dt>
      <dd>
        <span className="block font-display text-3xl leading-none">{valeur}</span>
        <span className="text-[11px] uppercase tracking-wider opacity-70">{libelle}</span>
      </dd>
    </div>
  );
}

function Curseur({
  libelle,
  aide,
  valeur,
  onChange,
}: {
  libelle: string;
  aide: string;
  valeur: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-sm font-semibold">
        {libelle}
        <span className="font-mono text-xs opacity-70">{valeur.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={0.3}
        max={0.8}
        step={0.01}
        value={valeur}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-rose"
      />
      <span className="text-xs opacity-60">{aide}</span>
    </label>
  );
}

function Onglet({
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
      className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
        actif ? "bg-rose text-rouge" : "bg-rose/15 hover:bg-rose/25"
      }`}
    >
      {children}
    </button>
  );
}
