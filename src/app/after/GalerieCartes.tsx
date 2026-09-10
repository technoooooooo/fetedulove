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
      <div className="sticky top-0 z-30 -mx-4 px-4 pt-4 pb-3 bg-rouge/95 nav-blur sm:rounded-b-3xl">
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
            className="w-full rounded-full bg-rose py-3 pl-12 pr-4 text-rouge placeholder:text-rouge/40 text-base font-medium outline-none ring-0 focus:ring-4 focus:ring-rose/40 transition-shadow"
          />
        </label>

        {/* Filtres par team */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

      <p className="mt-4 mb-3 text-center text-xs uppercase tracking-[0.25em] font-semibold text-rose/60">
        {resultats.length === 0
          ? "Aucune carte"
          : `${resultats.length} carte${resultats.length > 1 ? "s" : ""}`}
      </p>

      {resultats.length === 0 ? (
        <p className="py-16 text-center font-display text-3xl text-rose/70">
          Personne sous ce nom…
        </p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 pb-16">
          {resultats.map((m, i) => (
            <motion.li
              key={m.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 20) * 0.02, duration: 0.4, ease: EASE }}
            >
              <Link
                href={`/after/${m.id}`}
                className="group block rounded-2xl overflow-hidden shadow-md transition-transform duration-300 hover:-translate-y-1.5 hover:rotate-[-1.5deg] focus-visible:-translate-y-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
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
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
        actif
          ? "bg-rose text-rouge"
          : "bg-rose/15 text-rose/80 hover:bg-rose/25 hover:text-rose"
      }`}
    >
      {children}
    </button>
  );
}
