"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import Marquee from "@/components/Marquee";
import Camera from "@/components/Camera";
import DiscoBall from "@/components/DiscoBall";
import FourPointStar from "@/components/FourPointStar";

const TIPS = [
  {
    emoji: "📸",
    title: "Mitraillez",
    text: "Photos ratées, vidéos tremblantes, stories de 3h du matin : gardez tout.",
    color: "bg-bleu/40",
  },
  {
    emoji: "🪩",
    title: "Dansez d'abord",
    text: "Le tri se fera plus tard. Le dancefloor, lui, n'attend pas.",
    color: "bg-jaune/50",
  },
  {
    emoji: "💾",
    title: "Ne supprimez rien",
    text: "Même la photo floue a sa place ici. Surtout la photo floue.",
    color: "bg-orange/25",
  },
];

function Decorations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <DiscoBall size={70} className="absolute top-[6vh] left-[5%] opacity-40 animate-float" />
      <DiscoBall
        size={55}
        className="absolute top-[10vh] right-[7%] opacity-35 animate-float-reverse"
      />
      <DiscoBall
        size={45}
        className="absolute bottom-[12vh] left-[10%] opacity-25 animate-float-reverse hidden sm:block"
      />
      <FourPointStar size={24} className="absolute top-[24vh] right-[14%] opacity-50 animate-twinkle" />
      <FourPointStar
        size={18}
        className="absolute top-[38vh] left-[8%] opacity-40 animate-twinkle hidden sm:block"
      />
      <FourPointStar size={20} className="absolute bottom-[20vh] right-[9%] opacity-45 animate-twinkle" />
    </div>
  );
}

export default function AfterContent() {
  return (
    <main className="relative min-h-screen bg-rose-bg text-rouge overflow-hidden">
      <div className="grain-overlay" />
      <Decorations />

      <AnimatedSection className="relative z-10 px-4 sm:px-8 pt-12 sm:pt-20">
        <div className="max-w-3xl mx-auto bg-rouge text-rose rounded-3xl p-8 sm:p-12 md:p-16 text-center">
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 30, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Camera size={320} className="w-56 sm:w-72 md:w-80 h-auto" />
          </motion.div>

          <p className="text-sm uppercase tracking-[0.3em] font-semibold mb-4 opacity-70">
            Le jour d&apos;après
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl mb-6">
            Les photos
          </h1>

          <div className="inline-flex items-center gap-2 rounded-full bg-rose/15 border border-rose/30 px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-rose opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose" />
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold">
              Bientôt ouvert
            </span>
          </div>

          <p className="text-lg sm:text-xl leading-relaxed opacity-90 max-w-xl mx-auto mb-6">
            Cette page vous permettra de retrouver et de déposer toutes les
            photos du mariage.
          </p>
          <p className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight">
            Mais pour le moment,
            <br />
            éclatez-vous !
          </p>

          <p className="mt-8 text-base leading-relaxed opacity-70 max-w-lg mx-auto">
            On ouvrira les vannes juste après la fête. En attendant, rangez le
            téléphone (de temps en temps) et profitez.
          </p>
        </div>
      </AnimatedSection>

      <div className="relative z-10 mt-12 sm:mt-16 bg-orange text-jaune py-6 overflow-hidden">
        <Marquee text="ON IMMORTALISE" className="font-display text-2xl sm:text-3xl" />
      </div>

      <AnimatedSection className="relative z-10 px-4 sm:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-sm uppercase tracking-[0.3em] font-semibold mb-8 opacity-70">
            En attendant
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {TIPS.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className={`${tip.color} rounded-2xl p-6 text-left hover:scale-[1.02] transition-transform`}
              >
                <span className="text-2xl block mb-2" aria-hidden>
                  {tip.emoji}
                </span>
                <h2 className="font-display text-2xl mb-1">{tip.title}</h2>
                <p className="text-sm leading-relaxed opacity-70">{tip.text}</p>
              </motion.div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm opacity-50 italic">
            Gardez le lien de côté : c&apos;est ici que tout atterrira 💛
          </p>

          <div className="text-center mt-8">
            <Link
              href="/"
              className="text-rouge/60 hover:text-rouge text-sm transition-colors"
            >
              ← Retour au site
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
