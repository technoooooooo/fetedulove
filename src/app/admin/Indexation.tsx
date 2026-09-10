"use client";

import { useRef, useState } from "react";
import type { PhotoAdmin } from "./types";

type EtatHuman = Awaited<ReturnType<typeof charger>>;

async function charger() {
  const { Human } = await import("@vladmandic/human");
  const human = new Human({
    backend: "webgl",
    // modèles servis depuis public/models : pas de dépendance CDN pendant un long batch
    modelBasePath: "/models/",
    cacheModels: true,
    warmup: "none",
    debug: false,
    filter: { enabled: false },
    gesture: { enabled: false },
    body: { enabled: false },
    hand: { enabled: false },
    object: { enabled: false },
    segmentation: { enabled: false },
    face: {
      enabled: true,
      detector: {
        modelPath: "blazeface.json",
        // photos de groupe : on veut tout le monde, y compris au fond
        maxDetected: 50,
        minConfidence: 0.2,
        minSize: 24,
        rotation: true,
      },
      mesh: { enabled: true, modelPath: "facemesh.json" },
      description: { enabled: true, modelPath: "faceres.json" },
      attention: { enabled: false },
      iris: { enabled: false },
      emotion: { enabled: false },
      antispoof: { enabled: false },
      liveness: { enabled: false },
      gear: { enabled: false },
    },
  });
  await human.load();
  await human.warmup();
  return human;
}

export default function Indexation({
  photos,
  onTermine,
}: {
  photos: PhotoAdmin[];
  onTermine: () => void;
}) {
  const human = useRef<EtatHuman | null>(null);
  const stop = useRef(false);
  const [etat, setEtat] = useState<"repos" | "chargement" | "analyse">("repos");
  const [fait, setFait] = useState(0);
  const [visagesTrouves, setVisagesTrouves] = useState(0);
  const [erreurs, setErreurs] = useState<string[]>([]);

  const aFaire = photos.filter((p) => !p.indexee);

  async function lancer() {
    stop.current = false;
    setFait(0);
    setVisagesTrouves(0);
    setErreurs([]);

    if (!human.current) {
      setEtat("chargement");
      try {
        human.current = await charger();
      } catch (e) {
        setErreurs([`Chargement des modèles impossible : ${String(e)}`]);
        setEtat("repos");
        return;
      }
    }

    setEtat("analyse");
    for (const photo of aFaire) {
      if (stop.current) break;
      try {
        const trouves = await analyser(human.current, photo);
        setVisagesTrouves((n) => n + trouves);
      } catch (e) {
        setErreurs((v) => [...v, `${photo.chemin} : ${String(e)}`]);
      }
      setFait((n) => n + 1);
      // laisse respirer le thread principal entre deux photos
      await new Promise((r) => setTimeout(r, 0));
    }

    setEtat("repos");
    onTermine();
  }

  return (
    <section className="rounded-2xl border border-rose/25 bg-rose/10 p-5">
      <h2 className="font-display text-2xl mb-1">2 · Détecter les visages</h2>
      <p className="text-sm opacity-80 mb-4">
        La détection tourne dans ce navigateur, sur ta machine. Garde l&apos;onglet
        ouvert : compte environ une seconde par photo.
      </p>

      <p className="mb-4 text-sm font-semibold">
        {aFaire.length === 0
          ? `Tout est indexé (${photos.length} photo${photos.length > 1 ? "s" : ""}).`
          : `${aFaire.length} photo${aFaire.length > 1 ? "s" : ""} à analyser.`}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void lancer()}
          disabled={etat !== "repos" || aFaire.length === 0}
          className="rounded-full bg-rose px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-rouge disabled:opacity-40"
        >
          {etat === "chargement"
            ? "Chargement des modèles…"
            : etat === "analyse"
              ? "Analyse en cours…"
              : "Lancer la détection"}
        </button>
        {etat === "analyse" && (
          <button
            type="button"
            onClick={() => {
              stop.current = true;
            }}
            className="rounded-full border border-rose/40 px-5 py-2.5 text-sm font-bold uppercase tracking-wide"
          >
            Arrêter
          </button>
        )}
      </div>

      {etat === "analyse" && (
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-rose/20">
            <div
              className="h-full bg-rose transition-[width] duration-300"
              style={{ width: `${aFaire.length ? (fait / aFaire.length) * 100 : 0}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-semibold">
            {fait} / {aFaire.length} · {visagesTrouves} visage
            {visagesTrouves > 1 ? "s" : ""} trouvé{visagesTrouves > 1 ? "s" : ""}
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

async function analyser(human: EtatHuman, photo: PhotoAdmin) {
  const image = await chargerImage(photo.url);
  const resultat = await human.detect(image);

  const visages = (resultat.face ?? []).flatMap((f) => {
    const empreinte = f.embedding;
    if (!empreinte || empreinte.length === 0) return [];
    const [x, y, l, h] = f.boxRaw;
    return [
      {
        x: borner(x),
        y: borner(y),
        l: borner(l),
        h: borner(h),
        score: f.score ?? 0,
        // 5 décimales : divise par deux le poids stocké sans changer les scores
        empreinte: empreinte.map((n) => Math.round(n * 1e5) / 1e5),
      },
    ];
  });

  const res = await fetch("/api/admin/visages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ photoId: photo.id, visages }),
  });
  if (!res.ok) throw new Error(await res.text());
  return visages.length;
}

const borner = (v: number) => Math.min(1, Math.max(0, v));

function chargerImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image illisible"));
    image.src = url;
  });
}
