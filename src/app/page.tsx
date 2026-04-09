"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import Marquee from "@/components/Marquee";
import Countdown from "@/components/Countdown";
import FloatingDecorations from "@/components/FloatingDecorations";
import MusicPlayer from "@/components/MusicPlayer";
import Van from "@/components/Van";

const NAV_ITEMS = [
  { label: "Programme", href: "#programme" },
  { label: "Infos", href: "#infos" },
  { label: "Cadeau", href: "#cagnotte" },
];

function Nav() {
  return (
    <motion.nav
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex items-center gap-2 sm:gap-3 bg-rouge/90 nav-blur rounded-full px-3 py-2 sm:px-4 sm:py-2.5 shadow-lg">
        <a href="#" className="shrink-0">
          <Image
            src="/images/logo-white.png"
            alt="The F&AN Club"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-9 sm:h-9"
          />
        </a>
        <div className="w-px h-6 bg-rose/30" />
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-rose/80 hover:text-rose transition-colors px-2 sm:px-3 py-1"
          >
            {item.label}
          </a>
        ))}
        <a
          href="https://tally.so/r/J9pL2Y"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-rose text-rouge text-xs sm:text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full hover:scale-105 transition-transform ml-1"
        >
          RSVP
        </a>
      </div>
    </motion.nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Main content */}
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.p
          className="font-script text-2xl sm:text-3xl md:text-4xl mb-1 text-rouge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Fiona & Antoine
        </motion.p>
        <motion.p
          className="text-sm sm:text-base md:text-lg mb-6 opacity-80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          vous invitent à leur
        </motion.p>

        <motion.h1
          className="font-display text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] leading-[0.85] mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Fête du
          <br />
          <span className="text-[5rem] sm:text-[7rem] md:text-[10rem] lg:text-[13rem]">
            Love
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
            05-06 Sept. 2026
          </p>
        </motion.div>
      </motion.div>


      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 opacity-60"
        >
          <span className="text-xs uppercase tracking-widest font-medium">Viens voir ce qu&apos;on te prépare</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4v12m0 0l-4-4m4 4l4-4"
              stroke="#D33B29"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

function MarqueeSection() {
  return (
    <div className="py-6 bg-rouge text-rose overflow-hidden relative z-10">
      <Marquee
        text="FÊTE DU LOVE"
        className="font-display text-2xl sm:text-3xl"
      />
    </div>
  );
}

function CountdownSection() {
  return (
    <AnimatedSection className="py-20 sm:py-32 px-6 text-center relative z-10">
      <p className="text-sm uppercase tracking-[0.3em] font-semibold mb-8 opacity-70">
        Compte à rebours
      </p>
      <Countdown />
      <p className="mt-10 text-lg sm:text-xl font-medium opacity-80 max-w-md mx-auto">
        avant de faire la fête ensemble
      </p>
    </AnimatedSection>
  );
}

function LogoSection() {
  return (
    <AnimatedSection className="py-16 sm:py-24 px-6 relative z-10">
      <div className="flex justify-center">
        <motion.div
          whileHover={{ scale: 1.05, rotate: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Image
            src="/images/logo-red-alt.png"
            alt="The F&AN Club"
            width={300}
            height={340}
            className="w-48 sm:w-64 md:w-72 h-auto"
          />
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function Programme() {
  const eventsFirst = [
    {
      time: "14h",
      title: "Mariage civil",
      location: "Mairie de Moulins-sur-Allier",
      description: "On se dit oui (officiellement)",
      color: "bg-bleu/30",
    },
    {
      time: "16h30",
      title: "Cérémonie laïque",
      location: "Saint-Didier-la-Forêt",
      description: "On se dit oui (pour de vrai)",
      color: "bg-jaune/40",
    },
  ];

  const eventsDJ = [
    {
      time: "17h30",
      title: "Vin d'honneur et Open air",
      location: "Saint-Didier-la-Forêt",
      description: "On trinque !",
      color: "bg-orange/20",
    },
    {
      time: "20h",
      title: "Dîner & soirée",
      location: "Saint-Didier-la-Forêt",
      description: "On mange, on danse, on s'aime",
      color: "bg-rose/50",
    },
  ];

  return (
    <AnimatedSection
      id="programme"
      className="py-20 sm:py-32 px-6 max-w-4xl mx-auto relative z-10"
    >
      <div className="text-center mb-16">
        <p className="text-sm uppercase tracking-[0.3em] font-semibold mb-4 opacity-70">
          Le déroulé
        </p>
        <h2 className="font-display text-5xl sm:text-7xl">Programme</h2>
      </div>

      <div className="mb-12">
        <div className="inline-block bg-rouge text-rose px-8 py-4 rounded-full">
          <p className="text-xl sm:text-2xl font-bold">
            Samedi 5 septembre — La fête
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-rouge/20" />

        <div className="space-y-12">
          {/* First events (mariage civil + cérémonie) */}
          {eventsFirst.map((event, i) => (
            <motion.div
              key={event.time}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative pl-16 sm:pl-24"
            >
              <div className="absolute left-4 sm:left-6 top-1 w-4 h-4 rounded-full bg-rouge border-4 border-rose-bg" />
              <div className={`${event.color} rounded-2xl p-6 sm:p-8 hover:scale-[1.01] transition-transform`}>
                <span className="text-3xl sm:text-4xl font-bold block mb-1">{event.time}</span>
                <h3 className="text-xl sm:text-2xl font-bold mb-1">{event.title}</h3>
                <p className="opacity-70 font-medium">{event.location}</p>
                <p className="mt-2 text-base opacity-60 italic">{event.description}</p>
              </div>
            </motion.div>
          ))}

          {/* DJ bracket group: vin d'honneur + soirée */}
          <div className="relative pl-16 sm:pl-24">
            <div className="flex gap-4 sm:gap-6">
              {/* Cards column */}
              <div className="flex-1 space-y-6">
                {eventsDJ.map((event, i) => (
                  <motion.div
                    key={event.time}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i + 2) * 0.15, duration: 0.6 }}
                    className="relative"
                  >
                    {/* Timeline dots */}
                    <div className="absolute -left-12 sm:-left-[4.5rem] top-1 w-4 h-4 rounded-full bg-rouge border-4 border-rose-bg" />
                    <div className={`${event.color} rounded-2xl p-6 sm:p-8 hover:scale-[1.01] transition-transform`}>
                      <span className="text-3xl sm:text-4xl font-bold block mb-1">{event.time}</span>
                      <h3 className="text-xl sm:text-2xl font-bold mb-1">{event.title}</h3>
                      <p className="opacity-70 font-medium">{event.location}</p>
                      <p className="mt-2 text-base opacity-60 italic">{event.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bracket + DJ tag */}
              <motion.div
                className="flex items-center gap-3 shrink-0"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {/* Bracket SVG */}
                <svg width="20" height="100%" viewBox="0 0 20 200" preserveAspectRatio="none" className="h-full" fill="none">
                  <path
                    d="M2 8 C12 8, 16 16, 16 30 L16 85 C16 95, 18 100, 20 100 C18 100, 16 105, 16 115 L16 170 C16 184, 12 192, 2 192"
                    stroke="#D33B29"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                {/* DJ label */}
                <a
                  href="https://soundcloud.com/egmusique"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-rouge text-rose rounded-2xl px-4 py-5 sm:px-5 sm:py-6 text-center hover:scale-105 transition-transform group"
                >
                  <p className="font-display text-base sm:text-lg leading-tight mb-1">
                    DJ set by
                  </p>
                  <p className="font-display text-2xl sm:text-3xl leading-none mb-3">
                    EG
                  </p>
                  <div className="flex items-center justify-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span className="text-xs uppercase tracking-wider font-semibold">Écouter</span>
                  </div>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="mb-12">
          <div className="inline-block bg-olive text-jaune px-8 py-4 rounded-full">
            <p className="text-xl sm:text-2xl font-bold">
              Dimanche 6 septembre — Le brunch
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-rouge/20" />
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative pl-16 sm:pl-24"
            >
              <div className="absolute left-4 sm:left-6 top-1 w-4 h-4 rounded-full bg-rouge border-4 border-rose-bg" />
              <div className="bg-olive/20 rounded-2xl p-6 sm:p-8 hover:scale-[1.01] transition-transform">
                <span className="text-3xl sm:text-4xl font-bold block mb-1">
                  11h30 — 15h30
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mb-1">
                  Brunch & DJ set
                </h3>
                <p className="mt-2 text-base opacity-60 italic">
                  (table du temps à venir)
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function FairePartSection() {
  return (
    <AnimatedSection className="py-20 sm:py-32 px-6 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
          whileHover={{ scale: 1.02, rotate: -1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Image
            src="/faire-part.jpg"
            alt="Faire-part Fiona & Antoine - Fête du Love"
            width={600}
            height={850}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-rouge/80 flex flex-col items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="font-display text-rose text-2xl sm:text-4xl text-center px-6">
              Meilleure déco pour ton frigo.
            </p>
            <a
              href="/faire-part.jpg"
              download="faire-part-fiona-antoine.jpg"
              className="bg-rose text-rouge px-8 py-3 rounded-full font-bold text-sm sm:text-base uppercase tracking-wider hover:scale-105 transition-transform"
            >
              Télécharger
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function Infos() {
  return (
    <AnimatedSection
      id="infos"
      className="py-20 sm:py-32 px-6 max-w-5xl mx-auto relative z-10"
    >
      <div className="text-center mb-16">
        <p className="text-sm uppercase tracking-[0.3em] font-semibold mb-4 opacity-70">
          Bon à savoir
        </p>
        <h2 className="font-display text-5xl sm:text-7xl">Infos pratiques</h2>
      </div>

      <div className="space-y-8">
        {/* Hébergement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-bleu/40 rounded-2xl p-8 sm:p-10"
        >
          <h3 className="font-display text-3xl mb-4">Où dormir ?</h3>
          <p className="opacity-80 leading-relaxed mb-4">
            Nous vous recommandons l&apos;<a href="https://all.accor.com/booking/fr/ibis/hotel/9490?destination=03500-saint-pourcain-sur-sioule&dateIn=2026-09-05&dateOut=2026-09-06&nights=1&hideWDR=false&accessibleRoom=false" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:opacity-70 transition-opacity">Hôtel Ibis de Saint-Pourçain-sur-Sioule</a>,
            idéalement situé à 12 minutes du lieu de réception et à 30 minutes de la mairie.
          </p>
          <p className="opacity-70 leading-relaxed mb-3">
            D&apos;autres options sont disponibles selon vos préférences :
          </p>
          <ul className="space-y-2 opacity-70">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rouge shrink-0" />
              <span><strong>Hôtel à Vichy</strong> — 17 min du lieu de réception, 57 min de la mairie</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rouge shrink-0" />
              <span><strong>Hôtel à Moulins-sur-Allier</strong> — à deux pas de la mairie, 40 min du lieu de réception</span>
            </li>
          </ul>
        </motion.div>

        {/* Transports */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-jaune/40 rounded-2xl p-8 sm:p-10"
        >
          <h3 className="font-display text-3xl mb-6">Transports</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-lg mb-2">En train</h4>
              <p className="opacity-70 leading-relaxed text-sm">
                Pour la cérémonie civile : <strong>gare de Moulins-sur-Allier</strong> (15 min à pied de la mairie).
                Pour le lieu de réception : les gares les plus proches sont <strong>Vichy</strong> (17 min en voiture)
                et <strong>Moulins-sur-Allier</strong> (40 min en voiture).
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">En voiture</h4>
              <p className="opacity-70 leading-relaxed text-sm">
                Comptez environ <strong>3h depuis Paris</strong> et <strong>5h30 depuis Marseille</strong>.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Sur place</h4>
              <p className="opacity-70 leading-relaxed text-sm">
                Pour se déplacer entre les lieux &amp; vos hébergements, le plus simple reste la voiture.
                Nous vous encourageons à organiser des covoiturages entre vous.
              </p>
              <span className="inline-block mt-3 px-5 py-2 bg-rouge/50 text-rose rounded-full text-sm font-semibold">
                Formulaire covoiturage — à venir
              </span>
            </div>
          </div>
        </motion.div>

        {/* Dress code */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-orange/25 rounded-2xl p-8 sm:p-10 text-center"
        >
          <h3 className="font-display text-3xl mb-4">Dress code</h3>
          <p className="text-lg sm:text-xl opacity-80 max-w-lg mx-auto">
            Soyez vous, soyez beaux, soyez joyeux.<br />
            Le reste, on s&apos;en fout.
          </p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function Lieux() {
  return (
    <AnimatedSection className="py-20 sm:py-32 px-6 max-w-4xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <p className="text-sm uppercase tracking-[0.3em] font-semibold mb-4 opacity-70">
          Où ça se passe
        </p>
        <h2 className="font-display text-5xl sm:text-7xl">Les lieux</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-rouge text-rose rounded-2xl p-8 sm:p-10"
        >
          <p className="text-sm uppercase tracking-[0.2em] opacity-70 mb-2">
            Samedi 5 sept. &mdash; 14h
          </p>
          <h3 className="font-display text-3xl mb-4">Mairie</h3>
          <p className="text-lg leading-relaxed opacity-90">
            Mairie de Moulins-sur-Allier
            <br />
            <span className="opacity-70">03000 Moulins</span>
          </p>
          <a
            href="https://maps.google.com/?q=Mairie+de+Moulins-sur-Allier"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-6 py-3 border-2 border-rose rounded-full text-sm font-semibold uppercase tracking-wider hover:bg-rose hover:text-rouge transition-colors"
          >
            Voir sur Maps
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-olive text-jaune rounded-2xl p-8 sm:p-10"
        >
          <p className="text-sm uppercase tracking-[0.2em] opacity-70 mb-2">
            Samedi 5 sept. &mdash; 16h
          </p>
          <h3 className="font-display text-3xl mb-4">
            Cérémonie & Soirée
          </h3>
          <p className="text-lg leading-relaxed opacity-90">
            Saint-Didier-la-Forêt
            <br />
            <span className="opacity-70">03110 Allier</span>
          </p>
          <a
            href="https://maps.google.com/?q=Saint-Didier-la-Forêt+03110"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-6 py-3 border-2 border-jaune rounded-full text-sm font-semibold uppercase tracking-wider hover:bg-jaune hover:text-olive transition-colors"
          >
            Voir sur Maps
          </a>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function RSVP() {
  return (
    <section
      id="rsvp"
      className="relative py-20 sm:py-32 px-6 text-center z-10"
    >
      <AnimatedSection>
        <p className="text-sm uppercase tracking-[0.3em] font-semibold mb-4 opacity-70">
          On compte sur vous
        </p>
        <h2 className="font-display text-5xl sm:text-7xl md:text-8xl mb-8">
          Vous venez ?
        </h2>
        <p className="text-lg sm:text-xl max-w-lg mx-auto mb-10 opacity-80 leading-relaxed">
          Dites-nous si vous serez des nôtres pour cette grande fête de l&apos;amour.
          Répondez avant le <strong className="font-bold">1er juillet 2026</strong>.
        </p>

        <motion.a
          href="https://tally.so/r/J9pL2Y"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-rouge text-rose px-10 py-5 rounded-full font-display text-xl sm:text-2xl hover:scale-105 transition-transform shadow-lg"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.98 }}
        >
          Je confirme ma venue
        </motion.a>
      </AnimatedSection>

      {/* Illustration couple en bas */}
      <motion.div
        className="mt-16 flex justify-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <Image
          src="/images/illu-couple.png"
          alt="Fiona & Antoine"
          width={300}
          height={260}
          className="w-40 sm:w-56 h-auto opacity-40"
        />
      </motion.div>
    </section>
  );
}

function Cagnotte() {
  return (
    <AnimatedSection id="cagnotte" className="py-20 sm:py-32 px-6 relative z-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-rouge text-rose rounded-3xl p-8 sm:p-12 md:p-16 overflow-hidden relative">
          {/* Van illustration */}
          <motion.div
            className="flex justify-center mb-10"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Van size={360} className="w-72 sm:w-80 md:w-[420px] h-auto" />
          </motion.div>

          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] font-semibold mb-4 opacity-60">
              En lieu de liste de mariage
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6">
              La cagnotte
            </h2>
            <p className="text-lg sm:text-xl leading-relaxed opacity-90 max-w-xl mx-auto mb-4">
              Votre présence est déjà le plus beau des cadeaux.
            </p>
            <p className="text-base sm:text-lg leading-relaxed opacity-80 max-w-xl mx-auto mb-10">
              Mais si le coeur vous en dit, vous pouvez contribuer à notre rêve :
              un <strong className="font-bold">van aménagé</strong>{" "}pour partir à l&apos;aventure.
            </p>

            <motion.div
              className="inline-block bg-rose text-rouge px-10 py-5 rounded-full font-display text-xl sm:text-2xl shadow-lg cursor-default relative group"
              whileHover={{ scale: 1.08 }}
            >
              <span className="group-hover:opacity-0 transition-opacity duration-200">
                Participer à la cagnotte
              </span>
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-base sm:text-lg font-bold">
                Ça arrive, on est à la bourre
              </span>
            </motion.div>

            <p className="mt-6 text-sm opacity-40">
              Lien cagnotte à venir
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function Footer() {
  return (
    <footer className="py-16 px-6 text-center relative z-10 bg-rouge text-rose">
      <div className="max-w-2xl mx-auto">
        <Image
          src="/images/logo-white.png"
          alt="The F&AN Club"
          width={120}
          height={130}
          className="w-24 sm:w-32 h-auto mx-auto mb-6"
        />
        <motion.p
          className="font-script text-3xl sm:text-4xl mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Fiona & Antoine
        </motion.p>
        <p className="opacity-60 text-sm">
          05-06 Septembre 2026 &mdash; Fête du Love
        </p>
        <p className="mt-6 text-xs opacity-30">
          Made with love
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <div className="grain-overlay" />
      <FloatingDecorations />
      <MusicPlayer />
      <Nav />
      <Hero />
      <MarqueeSection />
      <CountdownSection />
      <FairePartSection />
      <Programme />
      <div className="bg-orange text-jaune overflow-hidden py-6 relative z-10">
        <Marquee text="ON DANSE" className="font-display text-2xl sm:text-3xl" />
      </div>
      <Lieux />
      <Infos />
      <RSVP />
      <Cagnotte />
      <Footer />
    </>
  );
}
