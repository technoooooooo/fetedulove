"use client";

import { motion } from "framer-motion";
import Camera from "@/components/Camera";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function AfterContent() {
  return (
    <main className="flex min-h-dvh bg-rose-bg p-3 sm:p-5">
      <div className="grain-overlay" />

      <div className="relative flex flex-1 flex-col items-center justify-center rounded-[2rem] sm:rounded-[2.5rem] bg-rouge text-rose text-center px-6 py-8 sm:px-10">
        <motion.div
          className="mb-5 sm:mb-7"
          initial={{ opacity: 0, y: 30, rotate: -6 }}
          animate={{ opacity: 1, y: 0, rotate: -3 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <Camera size={320} className="w-44 sm:w-48 md:w-56 h-auto" />
        </motion.div>

        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: EASE }}
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold opacity-70 mb-3 sm:mb-4">
            Le jour d&apos;après
          </p>

          <h1 className="font-display text-5xl sm:text-6xl mb-4">
            Les photos
          </h1>

          <div className="inline-flex items-center gap-2 rounded-full bg-rose/15 border border-rose/30 px-4 py-1.5 mb-6 sm:mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-rose opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose" />
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold">
              Bientôt ouvert
            </span>
          </div>

          <p className="max-w-md text-lg sm:text-xl leading-relaxed opacity-90 mb-6 sm:mb-8">
            Cette page vous permettra de retrouver et de déposer toutes les
            photos du mariage.
          </p>

          <p className="font-display text-3xl sm:text-4xl leading-tight">
            Mais pour le moment,
            <br />
            éclatez-vous !
          </p>
        </motion.div>
      </div>
    </main>
  );
}
