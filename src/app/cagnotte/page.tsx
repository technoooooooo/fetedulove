"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import Van from "@/components/Van";

/* ─── Coordonnées de la cagnotte ─────────────────────────────────────────── */
const TITULAIRE = "Fiona Hiloua & Antoine Oriol";
const IBAN = "FR76 2823 3000 0175 4780 3518 609";
const BIC = "REVOFRP2";
const WERO = "+33 6 84 51 51 86"; // numéro de téléphone lié à Wero
/* ────────────────────────────────────────────────────────────────────────── */

function CopyValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value.replace(/\s+/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponible : l'utilisateur peut sélectionner à la main
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="group flex w-full items-center justify-between gap-3 rounded-xl bg-rose px-4 py-2.5 text-left text-rouge transition-transform active:scale-[0.98]"
    >
      <span className="font-mono text-sm sm:text-base tracking-wide break-all">
        {value}
      </span>
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wide opacity-60 group-hover:opacity-100 transition-opacity">
        {copied ? "Copié ✓" : "Copier"}
      </span>
    </button>
  );
}

function Method({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-rose/25 bg-rose/10 p-4 sm:p-5 text-left">
      <h2 className="font-display text-xl sm:text-2xl mb-2 flex items-center gap-2">
        <span aria-hidden>{emoji}</span>
        {title}
      </h2>
      <div className="space-y-2 text-sm sm:text-base opacity-90">{children}</div>
    </div>
  );
}

function LivreOr() {
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );

  const canSubmit = nom.trim() && message.trim() && status !== "sending";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/livre-or", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: nom.trim(), message: message.trim() }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-rouge text-rose rounded-3xl p-8 sm:p-10 max-w-2xl mx-auto">
      <h2 className="font-display text-3xl sm:text-4xl text-center mb-2">
        Laissez-nous un petit mot
      </h2>
      <p className="text-center text-sm sm:text-base opacity-80 mb-8">
        Un souvenir, un vœu, une blague… on gardera précieusement chaque mot 💛
      </p>

      {status === "done" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center py-6"
        >
          <p className="font-display text-2xl sm:text-3xl mb-2">Merci 🥹</p>
          <p className="opacity-80">Votre petit mot nous est bien parvenu.</p>
        </motion.div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Votre nom"
            maxLength={100}
            required
            className="w-full rounded-xl bg-rose/10 border border-rose/25 px-4 py-3 text-rose placeholder:text-rose/50 outline-none focus:border-rose/60 transition-colors"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Votre petit mot…"
            rows={4}
            maxLength={2000}
            required
            className="w-full rounded-xl bg-rose/10 border border-rose/25 px-4 py-3 text-rose placeholder:text-rose/50 outline-none focus:border-rose/60 transition-colors resize-none"
          />
          {status === "error" && (
            <p className="text-sm bg-rose/10 rounded-lg px-4 py-2">
              Oups, l&apos;envoi a échoué. Réessayez dans un instant.
            </p>
          )}
          <motion.button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-rose text-rouge px-8 py-4 rounded-full font-display text-lg sm:text-xl shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            whileHover={canSubmit ? { scale: 1.03 } : {}}
            whileTap={canSubmit ? { scale: 0.98 } : {}}
          >
            {status === "sending" ? "Envoi…" : "Envoyer"}
          </motion.button>
        </form>
      )}
    </div>
  );
}

export default function CagnottePage() {
  return (
    <main className="min-h-screen bg-rose-bg text-rouge flex items-center justify-center px-4 sm:px-8 lg:px-10 py-8 lg:py-6">
      <AnimatedSection className="w-full max-w-[1400px]">
        <div className="bg-rouge text-rose rounded-3xl p-6 sm:p-8 lg:p-8 overflow-hidden">
          {/* En-tête : van + présentation */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 text-center lg:text-left mb-6 lg:mb-8">
            <motion.div
              className="flex justify-center shrink-0"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Van size={300} className="w-44 sm:w-56 lg:w-64 h-auto" />
            </motion.div>

            <div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-3">
                La cagnotte
              </h1>
              <p className="text-lg leading-relaxed opacity-90 mb-1">
                Votre présence est déjà le plus beau des cadeaux.
              </p>
              <p className="text-base leading-relaxed opacity-80 max-w-2xl">
                Mais si le cœur vous en dit, participez à notre rêve : un{" "}
                <strong className="font-bold">van aménagé</strong>{" "}pour partir
                à l&apos;aventure. Le montant que vous voulez, comme vous voulez.
              </p>
            </div>
          </div>

          {/* Moyens de participer */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 lg:items-start">
              <Method emoji="🏦" title="Par virement">
                <p className="opacity-80">Le plus simple. Voici notre RIB :</p>
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-60 mb-1">
                    Titulaire
                  </p>
                  <p className="font-semibold">{TITULAIRE}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-60 mb-1">
                    IBAN
                  </p>
                  <CopyValue value={IBAN} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-60 mb-1">
                    BIC
                  </p>
                  <CopyValue value={BIC} />
                </div>
              </Method>

              <Method emoji="📱" title="Avec Wero">
                <p className="opacity-80">
                  Depuis l&apos;appli de votre banque, envoyez le montant de
                  votre choix à ce numéro via{" "}
                  <strong className="font-semibold">Wero</strong> :
                </p>
                <CopyValue value={WERO} />
              </Method>

              <Method emoji="💌" title="Le jour J">
                <p className="opacity-80">
                  Plus envie de vous en occuper maintenant ? Une urne vous
                  attendra à l&apos;abbaye. Espèces ou chèque, comme au bon vieux
                  temps.
                </p>
              </Method>
          </div>

          <p className="mt-6 text-center text-xs opacity-40">
            Un immense merci du fond du cœur 💛
          </p>
        </div>

        <div className="mt-6">
          <LivreOr />
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-rouge/60 hover:text-rouge text-sm transition-colors"
          >
            ← Retour au site
          </Link>
        </div>
      </AnimatedSection>
    </main>
  );
}
