"use client";

import { useRef, useState } from "react";
import { preparerPhoto } from "./image";

type Cible = {
  chemin: string;
  cheminVignette: string;
  urlWeb: string;
  urlVignette: string;
};

const LOT = 10;

export default function Import({ onTermine }: { onTermine: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [enCours, setEnCours] = useState(false);
  const [fait, setFait] = useState(0);
  const [total, setTotal] = useState(0);
  const [erreurs, setErreurs] = useState<string[]>([]);

  async function envoyer(fichiers: File[]) {
    setEnCours(true);
    setTotal(fichiers.length);
    setFait(0);
    setErreurs([]);

    for (let debut = 0; debut < fichiers.length; debut += LOT) {
      const lot = fichiers.slice(debut, debut + LOT);

      let cibles: Cible[];
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: lot.length }),
        });
        if (!res.ok) throw new Error(await res.text());
        ({ cibles } = (await res.json()) as { cibles: Cible[] });
      } catch (e) {
        setErreurs((v) => [...v, `Signature impossible : ${String(e)}`]);
        break;
      }

      const enregistrer: Array<{
        chemin: string;
        cheminVignette: string;
        largeur: number;
        hauteur: number;
      }> = [];

      await Promise.all(
        lot.map(async (fichier, i) => {
          const cible = cibles[i];
          try {
            const preparee = await preparerPhoto(fichier);
            await Promise.all([
              televerser(cible.urlWeb, preparee.web),
              televerser(cible.urlVignette, preparee.vignette),
            ]);
            enregistrer.push({
              chemin: cible.chemin,
              cheminVignette: cible.cheminVignette,
              largeur: preparee.largeur,
              hauteur: preparee.hauteur,
            });
          } catch (e) {
            setErreurs((v) => [...v, `${fichier.name} : ${String(e)}`]);
          } finally {
            setFait((n) => n + 1);
          }
        }),
      );

      if (enregistrer.length > 0) {
        await fetch("/api/admin/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photos: enregistrer }),
        });
      }
    }

    setEnCours(false);
    if (input.current) input.current.value = "";
    onTermine();
  }

  return (
    <section className="rounded-2xl border border-rose/25 bg-rose/10 p-5">
      <h2 className="font-display text-2xl mb-1">1 · Importer les photos</h2>
      <p className="text-sm opacity-80 mb-4">
        Les originaux restent sur ton disque : le navigateur envoie une version
        web (2400 px) et une vignette, converties en WebP.
      </p>

      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        disabled={enCours}
        onChange={(e) => {
          const fichiers = [...(e.target.files ?? [])];
          if (fichiers.length > 0) void envoyer(fichiers);
        }}
        className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-rose file:px-5 file:py-2.5 file:font-bold file:uppercase file:tracking-wide file:text-rouge file:cursor-pointer disabled:opacity-50"
      />

      {enCours && (
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-rose/20">
            <div
              className="h-full bg-rose transition-[width] duration-300"
              style={{ width: `${total ? (fait / total) * 100 : 0}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-semibold">
            {fait} / {total} envoyées…
          </p>
        </div>
      )}

      {erreurs.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm text-jaune">
          {erreurs.slice(0, 5).map((e, i) => (
            <li key={i}>⚠ {e}</li>
          ))}
          {erreurs.length > 5 && <li>… et {erreurs.length - 5} autres</li>}
        </ul>
      )}
    </section>
  );
}

async function televerser(url: string, blob: Blob) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": blob.type || "image/webp", "x-upsert": "true" },
    body: blob,
  });
  if (!res.ok) throw new Error(`upload ${res.status} ${await res.text()}`);
}
