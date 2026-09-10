"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Camera from "@/components/Camera";
import GalerieCartes from "./GalerieCartes";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function AfterContent() {
  return (
    <main className="flex min-h-dvh bg-rose-bg p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:p-5">
      <div className="grain-overlay" />

      {/* min-w-0 : sans lui l'élément flex refuse de descendre sous la largeur
          de son contenu, et la page déborde horizontalement sur téléphone */}
      <div className="relative flex min-w-0 flex-1 flex-col items-center rounded-[2rem] sm:rounded-[2.5rem] bg-rouge text-rose px-3 py-6 sm:px-8 sm:py-10">
        {/* Sur téléphone l'en-tête est ramassé : c'est la recherche qu'on veut
            voir arriver vite, l'appareil photo passe à côté du titre plutôt
            qu'en dessous pour ne pas repousser la grille hors de l'écran. */}
        <motion.header
          className="relative mb-5 flex w-full flex-col items-center text-center sm:mb-9"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <Image
            src="/images/logo-white.png"
            alt="The Fan Club"
            width={72}
            height={72}
            className="mb-2 h-10 w-10 opacity-90 sm:mb-3 sm:h-16 sm:w-16"
            priority
          />
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] opacity-70 sm:mb-2 sm:text-sm">
            Le jour d&apos;après
          </p>

          <h1 className="font-display text-[2.4rem] leading-[0.95] sm:mb-3 sm:text-6xl sm:leading-normal md:text-7xl">
            Retrouve tes photos
          </h1>

          {/* au coin de l'en-tête sur téléphone, où il ne pousse pas la grille
              vers le bas ; en dessous du titre dès qu'il y a la place */}
          <motion.div
            className="absolute right-0 top-0 sm:static sm:order-last sm:mt-5"
            initial={{ opacity: 0, rotate: -8 }}
            animate={{ opacity: 1, rotate: -3 }}
            transition={{ delay: 0.2, duration: 0.9, ease: EASE }}
          >
            <Camera size={200} className="h-auto w-12 opacity-70 sm:w-28 sm:opacity-100" />
          </motion.div>

          <p className="mt-3 max-w-md text-sm leading-relaxed opacity-90 sm:text-lg">
            Cherche ta carte de membre, clique dessus, et on te sort toutes les
            photos où on t&apos;a reconnu·e.
          </p>
        </motion.header>

        <GalerieCartes />
      </div>
    </main>
  );
}
