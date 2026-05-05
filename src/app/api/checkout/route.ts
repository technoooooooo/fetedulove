import Stripe from "stripe";

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const { amount } = await request.json();

  const cents = Math.round(Number(amount) * 100);
  if (!cents || cents < 100) {
    return Response.json({ error: "Montant minimum : 1 €" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Cagnotte — Fête du Love",
            description: "Participation à la cagnotte van de Fiona & Antoine",
          },
          unit_amount: cents,
        },
        quantity: 1,
      },
    ],
    custom_fields: [
      {
        key: "name",
        label: { type: "custom", custom: "Votre nom (ou surnom)" },
        type: "text",
        optional: false,
      },
      {
        key: "message",
        label: { type: "custom", custom: "Un petit mot (optionnel)" },
        type: "text",
        optional: true,
      },
    ],
    success_url: `${new URL(request.url).origin}/cagnotte/merci`,
    cancel_url: `${new URL(request.url).origin}/cagnotte`,
  });

  return Response.json({ url: session.url });
}
