export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }

  const { nom, message } = (body ?? {}) as { nom?: unknown; message?: unknown };
  const n = typeof nom === "string" ? nom.trim() : "";
  const m = typeof message === "string" ? message.trim() : "";

  if (!n || !m) {
    return Response.json({ error: "Nom et message requis" }, { status: 400 });
  }
  if (n.length > 100 || m.length > 2000) {
    return Response.json({ error: "Message trop long" }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return Response.json(
      { error: "Configuration Supabase manquante" },
      { status: 500 },
    );
  }

  // Insertion via PostgREST avec la clé service_role (RLS contournée, côté serveur
  // uniquement — la clé n'est jamais exposée au navigateur).
  const res = await fetch(`${url}/rest/v1/livre_or`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ nom: n, message: m }),
  });

  if (!res.ok) {
    return Response.json(
      { error: "Enregistrement impossible" },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
