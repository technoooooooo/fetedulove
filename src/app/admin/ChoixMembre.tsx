"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  MEMBRES,
  MEMBRES_PAR_ID,
  TEAMS,
  avatarSrc,
  normalise,
  type Membre,
} from "@/data/membres";

export default function ChoixMembre({
  titre,
  onChoisir,
  onFermer,
  onRetirer,
  apercu,
  onValider,
  dejaChoisis,
}: {
  titre: string;
  onChoisir: (membreId: number) => void;
  onFermer: () => void;
  /** Optionnel : propose de détacher le visage plutôt que de le renommer. */
  onRetirer?: () => void;
  /** Optionnel : photo concernée, affichée en grand à côté des cartes. */
  apercu?: string;
  /**
   * Optionnel : passe en sélection multiple. Le clic sur une carte coche ou
   * décoche, et rien n'est envoyé avant « Enregistrer ».
   */
  onValider?: (membreIds: number[]) => void;
  /** Membres déjà sur la photo, cochés d'entrée en sélection multiple. */
  dejaChoisis?: number[];
}) {
  const [recherche, setRecherche] = useState("");
  const [table, setTable] = useState<string | null>(null);
  const [selection, setSelection] = useState<number[]>(dejaChoisis ?? []);
  const multiple = Boolean(onValider);

  const basculer = (membreId: number) =>
    setSelection((liste) =>
      liste.includes(membreId)
        ? liste.filter((id) => id !== membreId)
        : [...liste, membreId],
    );

  /**
   * Les cartes restent groupées par table, dans l'ordre du plan de salle : on
   * cherche quelqu'un en se rappelant où il était assis, pas en balayant 126
   * avatars.
   */
  const groupes = useMemo(() => {
    const q = normalise(recherche);
    const parTable = new Map<string, Membre[]>();
    for (const membre of MEMBRES) {
      if (table && membre.team !== table) continue;
      if (
        q &&
        !normalise(membre.prenom).includes(q) &&
        !normalise(membre.team).includes(q)
      ) {
        continue;
      }
      parTable.set(membre.team, [...(parTable.get(membre.team) ?? []), membre]);
    }
    return TEAMS.flatMap((t) => {
      const membres = parTable.get(t);
      return membres ? [[t, membres] as const] : [];
    });
  }, [recherche, table]);

  const trouves = groupes.reduce((total, [, membres]) => total + membres.length, 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={titre}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-rouge/90 p-0 sm:p-6 nav-blur"
      onClick={onFermer}
    >
      <div
        className={`flex max-h-[88dvh] w-full flex-col rounded-t-3xl sm:rounded-3xl bg-rouge border border-rose/30 p-5 ${
          apercu ? "max-w-5xl" : "max-w-2xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="font-display text-2xl text-rose">{titre}</h3>
          <div className="flex shrink-0 gap-2">
            {onRetirer && (
              <button
                type="button"
                onClick={onRetirer}
                className="rounded-full border border-rose/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-rose"
              >
                Enlever le nom
              </button>
            )}
            <button
              type="button"
              onClick={onFermer}
              className="rounded-full bg-rose/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-rose"
            >
              Annuler
            </button>
          </div>
        </div>

        {/* la photo reste sous les yeux pendant qu'on cherche la bonne carte :
            sur mobile au-dessus, sur écran large à gauche et pleine hauteur,
            ce qui rend lisibles les tirages photobooth en bande verticale */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 sm:flex-row">
          {apercu && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={apercu}
              alt=""
              className="max-h-[30dvh] w-full rounded-2xl object-contain sm:max-h-none sm:w-2/5 sm:self-stretch"
            />
          )}

          {/* min-w-0 : sans lui, la rangée de tables force la colonne à s'élargir
              au lieu de défiler, et déborde du panneau */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <label className="relative mb-3 block shrink-0">
              <span className="sr-only">Rechercher un prénom ou une table</span>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rouge/50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                autoFocus
                type="search"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Prénom ou table…"
                className="w-full rounded-full bg-rose py-2.5 pl-11 pr-4 text-rouge placeholder:text-rouge/40 outline-none"
              />
            </label>

            <div className="mb-3 flex shrink-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Chip actif={table === null} onClick={() => setTable(null)}>
                Toutes les tables
              </Chip>
              {TEAMS.map((t) => (
                <Chip
                  key={t}
                  actif={table === t}
                  onClick={() => setTable(table === t ? null : t)}
                >
                  {t}
                </Chip>
              ))}
            </div>

            {trouves === 0 ? (
              <p className="py-10 text-center font-display text-2xl text-rose/60">
                Personne sous ce nom…
              </p>
            ) : (
              <div className="min-h-0 flex-1 overflow-y-auto">
                {groupes.map(([nomTable, membres]) => (
                  <section key={nomTable} className="mb-4 last:mb-0">
                    <h4 className="sticky top-0 z-10 mb-2 bg-rouge py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-rose/50">
                      Table {nomTable}
                      <span className="ml-2 opacity-70">{membres.length}</span>
                    </h4>
                    <ul
                      className="grid grid-cols-4 gap-2 sm:grid-cols-6"
                    >
                      {membres.map((m) => {
                        const coche = multiple && selection.includes(m.id);
                        return (
                          <li key={m.id}>
                            <button
                              type="button"
                              aria-pressed={multiple ? coche : undefined}
                              onClick={() => (multiple ? basculer(m.id) : onChoisir(m.id))}
                              className={`group relative w-full overflow-hidden rounded-xl p-1.5 text-center transition-colors ${
                                coche
                                  ? "bg-rose text-rouge"
                                  : "bg-rose/10 hover:bg-rose/25"
                              }`}
                            >
                              <Image
                                src={avatarSrc(m.id)}
                                alt=""
                                width={128}
                                height={128}
                                className="mb-1 w-full rounded-lg"
                              />
                              {coche && (
                                <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-rouge text-[11px] font-bold text-rose">
                                  ✓
                                </span>
                              )}
                              <span
                                className={`block truncate text-xs font-bold ${
                                  coche ? "text-rouge" : "text-rose"
                                }`}
                              >
                                {m.prenom}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>

        {multiple && (
          <div className="mt-4 flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-rose/20 pt-4">
            <p className="min-w-0 flex-1 truncate text-sm text-rose/80">
              {selection.length === 0
                ? "Personne de sélectionné"
                : selection
                    .map((id) => MEMBRES_PAR_ID.get(id)?.prenom ?? `#${id}`)
                    .join(", ")}
            </p>
            <button
              type="button"
              onClick={() => onValider?.(selection)}
              className="shrink-0 rounded-full bg-rose px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-rouge"
            >
              Enregistrer ({selection.length})
            </button>
          </div>
        )}
      </div>
    </div>
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
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
        actif ? "bg-rose text-rouge" : "bg-rose/15 text-rose/80 hover:bg-rose/25"
      }`}
    >
      {children}
    </button>
  );
}
