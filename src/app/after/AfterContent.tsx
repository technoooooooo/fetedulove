"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Camera from "@/components/Camera";
import GalerieCartes from "./GalerieCartes";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function AfterContent() {
  return (
    <main className="flex min-h-dvh bg-rose-bg p-3 sm:p-5">
      <div className="grain-overlay" />

      <div className="relative flex flex-1 flex-col items-center rounded-[2rem] sm:rounded-[2.5rem] bg-rouge text-rose px-4 py-8 sm:px-8 sm:py-10">
        <motion.header
          className="flex flex-col items-center text-center mb-7 sm:mb-9"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <Image
            src="/images/logo-white.png"
            alt="The Fan Club"
            width={72}
            height={72}
            className="w-12 h-12 sm:w-16 sm:h-16 mb-3 opacity-90"
            priority
          />
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold opacity-70 mb-2">
            Le jour d&apos;après
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl mb-3">
            Retrouve tes photos
          </h1>
          <p className="max-w-md text-base sm:text-lg leading-relaxed opacity-90">
            Cherche ta carte de membre, clique dessus, et on te sort toutes les
            photos où on t&apos;a reconnu·e.
          </p>

          <motion.div
            className="mt-5"
            initial={{ opacity: 0, rotate: -8 }}
            animate={{ opacity: 1, rotate: -3 }}
            transition={{ delay: 0.2, duration: 0.9, ease: EASE }}
          >
            <Camera size={200} className="w-24 sm:w-28 h-auto" />
          </motion.div>
        </motion.header>

        <GalerieCartes />
      </div>
    </main>
  );
}
