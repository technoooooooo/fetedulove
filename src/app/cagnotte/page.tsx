"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import Van from "@/components/Van";

export default function CagnottePage() {
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  async function pay() {
    if (!amount || Number(amount) < 1) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-rose-bg text-rouge flex items-center justify-center px-4 py-16">
      <AnimatedSection className="w-full max-w-lg">
        <div className="bg-rouge text-rose rounded-3xl p-8 sm:p-12 overflow-hidden">
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Van size={300} className="w-60 sm:w-72 h-auto" />
          </motion.div>

          <div className="text-center">
            <h1 className="font-display text-4xl sm:text-5xl mb-4">
              La cagnotte
            </h1>
            <p className="text-lg leading-relaxed opacity-90 max-w-sm mx-auto mb-2">
              Votre présence est déjà le plus beau des cadeaux.
            </p>
            <p className="text-base leading-relaxed opacity-80 max-w-sm mx-auto mb-10">
              Mais si le cœur vous en dit, participez à notre rêve :{" "}
              un <strong className="font-bold">van aménagé</strong> pour partir
              à l&apos;aventure.
            </p>

            <div className="inline-flex items-center bg-rouge border-2 border-rose/40 rounded-full px-6 py-3">
              <input
                type="number"
                min={1}
                placeholder="Montant"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value ? Number(e.target.value) : "")
                }
                className="bg-transparent text-rose text-center text-2xl font-display w-28 outline-none placeholder:text-rose/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-rose text-2xl font-display ml-1">€</span>
            </div>

            {/* Bouton payer */}
            <motion.button
              onClick={pay}
              disabled={!amount || Number(amount) < 1 || loading}
              className="mt-6 inline-block bg-rose text-rouge px-10 py-5 rounded-full font-display text-xl sm:text-2xl shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              whileHover={amount && Number(amount) >= 1 ? { scale: 1.08 } : {}}
              whileTap={amount && Number(amount) >= 1 ? { scale: 0.97 } : {}}
            >
              {loading
                ? "Redirection…"
                : amount
                  ? `Participer — ${amount} €`
                  : "Choisir un montant"}
            </motion.button>

            <p className="mt-8 text-xs opacity-40">
              Paiement sécurisé par Stripe · CB, Apple Pay, Google Pay
            </p>
          </div>
        </div>

        {/* Retour au site */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-rouge/60 hover:text-rouge text-sm transition-colors"
          >
            ← Retour au site
          </a>
        </div>
      </AnimatedSection>
    </main>
  );
}
