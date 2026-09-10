"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Association from "./Association";
import Import from "./Import";
import Photos from "./Photos";
import type { PhotoAdmin, Rattachement, VisageAdmin } from "./types";

/**
 * Chargé uniquement dans le navigateur : @vladmandic/human résout son entrée
 * Node au rendu serveur, laquelle réclame @tensorflow/tfjs-node.
 */
const Indexation = dynamic(() => import("./Indexation"), {
  ssr: false,
  loading: () => (
    <section className="rounded-2xl border border-rose/25 bg-rose/10 p-5">
      <h2 className="font-display text-2xl">2 · Détecter les visages</h2>
      <p className="text-sm opacity-70">Chargement…</p>
    </section>
  ),
});

export default function AdminApp() {
  const [connecte, setConnecte] = useState<boolean | null>(null);
  const [photos, setPhotos] = useState<PhotoAdmin[]>([]);
  const [visages, setVisages] = useState<VisageAdmin[]>([]);
  const [rattachements, setRattachements] = useState<Rattachement[]>([]);
  const [chargement, setChargement] = useState(false);

  const recharger = useCallback(async () => {
    setChargement(true);
    try {
      const [rp, rv, rr] = await Promise.all([
        fetch("/api/admin/photos"),
        fetch("/api/admin/visages"),
        fetch("/api/admin/rattachements"),
      ]);
      if (rp.ok) setPhotos(((await rp.json()) as { photos: PhotoAdmin[] }).photos);
      if (rv.ok) setVisages(((await rv.json()) as { visages: VisageAdmin[] }).visages);
      if (rr.ok) {
        setRattachements(
          ((await rr.json()) as { rattachements: Rattachement[] }).rattachements,
        );
      }
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/session");
      const { connecte } = (await res.json()) as { connecte: boolean };
      setConnecte(connecte);
      if (connecte) await recharger();
    })();
  }, [recharger]);

  if (connecte === null) {
    return <p className="py-20 text-center opacity-70">Chargement…</p>;
  }

  if (!connecte) {
    return (
      <Connexion
        onConnecte={async () => {
          setConnecte(true);
          await recharger();
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <Import onTermine={recharger} />
      <Indexation photos={photos} onTermine={recharger} />
      <Association
        photos={photos}
        visages={visages}
        rattachements={rattachements}
        onChange={recharger}
      />
      <Photos
        photos={photos}
        visages={visages}
        rattachements={rattachements}
        onChange={recharger}
      />

      <div className="flex items-center justify-between gap-4 pt-2">
        <span className="text-xs uppercase tracking-wider opacity-60">
          {chargement ? "Synchronisation…" : "À jour"}
        </span>
        <button
          type="button"
          onClick={async () => {
            await fetch("/api/admin/session", { method: "DELETE" });
            setConnecte(false);
          }}
          className="rounded-full border border-rose/40 px-4 py-2 text-xs font-bold uppercase tracking-wide"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

function Connexion({ onConnecte }: { onConnecte: () => Promise<void> }) {
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motDePasse }),
      });
      if (!res.ok) {
        const { error } = (await res.json()) as { error?: string };
        setErreur(error ?? "Connexion impossible");
        return;
      }
      await onConnecte();
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form
      onSubmit={soumettre}
      className="mx-auto max-w-sm rounded-2xl border border-rose/25 bg-rose/10 p-6"
    >
      <h2 className="font-display text-3xl mb-4">Coulisses</h2>
      <input
        type="password"
        autoFocus
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
        placeholder="Mot de passe"
        className="mb-3 w-full rounded-full bg-rose px-5 py-3 text-rouge placeholder:text-rouge/40 outline-none"
      />
      {erreur && <p className="mb-3 text-sm text-jaune">{erreur}</p>}
      <button
        type="submit"
        disabled={envoi || motDePasse.length === 0}
        className="w-full rounded-full bg-rose px-5 py-3 font-bold uppercase tracking-wide text-rouge disabled:opacity-40"
      >
        {envoi ? "…" : "Entrer"}
      </button>
    </form>
  );
}
