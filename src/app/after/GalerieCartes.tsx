"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MEMBRES, TEAMS, carteSrc, normalise } from "@/data/membres";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function GalerieCartes() {
  const [recherche, setRecherche] = useState("");
  const [team, setTeam] = useState<string | null>(null);

  const resultats = useMemo(() => {
    const q = normalise(recherche);
    return MEMBRES.filter((m) => {
      if (team && m.team !== team) return false;
      if (!q) return true;
      return (
        normalise(m.prenom).includes(q) ||
        normalise(m.team).includes(q) ||
        String(m.id) === q
      );
    });
  }, [recherche, team]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Recherche */}
      {/* collée juste sous le liseré rose (p-2 de la page), pour que la barre
          reste à portée de pouce sans recouvrir le cadre */}
      <div className="sticky top-2 z-30 -mx-3 rounded-2xl bg-rouge/95 px-3 pb-3 pt-3 nav-blur sm:top-5 sm:-mx-4 sm:px-4 sm:pt-4">
        <label className="relative block">
          <span className="sr-only">Rechercher un prénom ou une team</span>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rouge/50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Ton prénom, ta team…"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            // 16px minimum : en dessous, iOS zoome sur le champ à la saisie
            className="w-full rounded-full bg-rose py-3.5 pl-12 pr-4 text-base font-medium text-rouge outline-none ring-0 transition-shadow placeholder:text-rouge/40 focus:ring-4 focus:ring-rose/40"
          />
        </label>

        {/* Filtres par team */}
        <div className="-mx-3 mt-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <Chip actif={team === null} onClick={() => setTeam(null)}>
            Toutes ({MEMBRES.length})
          </Chip>
          {TEAMS.map((t) => (
            <Chip key={t} actif={team === t} onClick={() => setTeam(team === t ? null : t)}>
              {t}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mb-3 mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-rose/60 sm:mt-4 sm:text-xs">
        {resultats.length === 0
          ? "Aucune carte"
          : `${resultats.length} carte${resultats.length > 1 ? "s" : ""}`}
      </p>

      {resultats.length === 0 ? (
        <p className="py-16 text-center font-display text-3xl text-rose/70">
          Personne sous ce nom…
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-2.5 pb-10 sm:grid-cols-3 sm:gap-4 sm:pb-16 md:grid-cols-4 lg:grid-cols-5">
          {resultats.map((m, i) => (
            <motion.li
              key={m.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 20) * 0.02, duration: 0.4, ease: EASE }}
            >
              <Link
                href={`/after/${m.id}`}
                // active: le survol n'existe pas au doigt, il faut un retour au toucher
                className="group block overflow-hidden rounded-2xl shadow-md transition-transform duration-300 active:scale-95 hover:-translate-y-1.5 hover:rotate-[-1.5deg] focus-visible:-translate-y-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
              >
                <Image
                  src={carteSrc(m.id)}
                  alt={`Carte de membre de ${m.prenom} — team ${m.team}`}
                  width={649}
                  height={1004}
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
                  // les premières cartes sont au-dessus de la ligne de flottaison
                  priority={i < 5}
                  className="w-full h-auto"
                />
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
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
      className={`flex h-9 shrink-0 items-center rounded-full px-4 text-xs font-semibold uppercase tracking-wide transition-colors ${
        actif
          ? "bg-rose text-rouge"
          : "bg-rose/15 text-rose/80 hover:bg-rose/25 hover:text-rose"
      }`}
    >
      {children}
    </button>
  );
}
