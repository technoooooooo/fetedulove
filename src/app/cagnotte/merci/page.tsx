"use client";

import { motion } from "framer-motion";
import Van from "@/components/Van";

export default function MerciPage() {
  return (
    <main className="min-h-screen bg-rose-bg text-rouge flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Van size={260} className="w-52 sm:w-64 h-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h1 className="font-display text-5xl sm:text-6xl mb-6">Merci !</h1>
          <p className="text-lg sm:text-xl leading-relaxed opacity-90 max-w-sm mx-auto mb-4">
            Votre participation nous touche énormément.
          </p>
          <p className="text-base leading-relaxed opacity-70 max-w-sm mx-auto mb-10">
            On a hâte de vous retrouver pour faire la fête&nbsp;!
          </p>

          <motion.a
            href="/"
            className="inline-block bg-rouge text-rose px-10 py-5 rounded-full font-display text-xl shadow-lg"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
          >
            Retour au site
          </motion.a>
        </motion.div>
      </div>
    </main>
  );
}
