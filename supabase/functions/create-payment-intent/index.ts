// Supabase Edge Function: erstellt einen Stripe PaymentIntent für den aktuellen Warenkorb.
//
// Benötigtes Secret (siehe README-Hinweise im PR / Chat):
//   supabase secrets set STRIPE_SECRET_KEY=sk_test_...
//
// Aufruf aus dem Frontend über supabase.functions.invoke('create-payment-intent', { body: { items, email } })

import Stripe from "npm:stripe@22.5.0";

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

const stripe = new Stripe(stripeSecretKey ?? "", {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

// Autoritativer Produktkatalog (Preise in Euro, inkl. MwSt.).
// Preise werden NIE aus dem Client übernommen, um Manipulation am Warenkorb
// zu verhindern -- muss synchron mit den Produkten in src/views/ShopView.vue bleiben.
const PRODUCTS: Record<number, { price: number; nameKey: string }> = {
  1: { price: 14.9, nameKey: "shop.products.espresso" },
  2: { price: 16.5, nameKey: "shop.products.yirgacheffe" },
  3: { price: 29.0, nameKey: "shop.products.milkPitcher" },
  4: { price: 45.0, nameKey: "shop.products.tamper" },
  5: { price: 15.0, nameKey: "shop.products.decaf" },
};

const CURRENCY = "eur";
const MAX_QUANTITY_PER_ITEM = 50;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  if (!stripeSecretKey) {
    console.error("STRIPE_SECRET_KEY ist nicht gesetzt.");
    return new Response(
      JSON.stringify({ error: "Zahlungen sind serverseitig nicht konfiguriert." }),
      { status: 500, headers: jsonHeaders },
    );
  }

  let body: { items?: unknown; email?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Ungültiger Request-Body." }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const rawItems = Array.isArray(body.items) ? body.items : [];
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (rawItems.length === 0) {
    return new Response(JSON.stringify({ error: "Warenkorb ist leer." }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  let amountInCents = 0;
  const orderItems: Array<{ id: number; nameKey: string; price: number; quantity: number }> = [];

  for (const rawItem of rawItems as Array<{ id?: unknown; quantity?: unknown }>) {
    const productId = Number(rawItem?.id);
    const quantity = Number(rawItem?.quantity);
    const product = PRODUCTS[productId];

    if (
      !product ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_QUANTITY_PER_ITEM
    ) {
      return new Response(
        JSON.stringify({ error: `Ungültiger Artikel im Warenkorb (id: ${rawItem?.id}).` }),
        { status: 400, headers: jsonHeaders },
      );
    }

    amountInCents += Math.round(product.price * 100) * quantity;
    orderItems.push({ id: productId, nameKey: product.nameKey, price: product.price, quantity });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: CURRENCY,
      // Aktiviert automatisch alle im Stripe Dashboard (Testmodus) freigeschalteten
      // Zahlungsmethoden für das Payment Element (Karte, Apple/Google Pay, PayPal, Klarna, SEPA...).
      automatic_payment_methods: { enabled: true },
      receipt_email: email || undefined,
      metadata: {
        items: JSON.stringify(orderItems),
        customer_email: email,
      },
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        amount: amountInCents,
        currency: CURRENCY,
      }),
      { headers: jsonHeaders },
    );
  } catch (error) {
    console.error("create-payment-intent error:", error);
    return new Response(
      JSON.stringify({ error: "Zahlung konnte nicht initialisiert werden." }),
      { status: 500, headers: jsonHeaders },
    );
  }
});
