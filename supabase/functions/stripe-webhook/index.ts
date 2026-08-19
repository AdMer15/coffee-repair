// Supabase Edge Function: Stripe-Webhook-Endpunkt.
//
// Speichert bezahlte Bestellungen serverseitig in der Tabelle "orders", sobald Stripe
// das Event "payment_intent.succeeded" meldet. Das ist die vertrauenswürdige Quelle für
// abgeschlossene Zahlungen (im Gegensatz zum Client, der theoretisch manipuliert werden könnte).
//
// Benötigte Secrets:
//   supabase secrets set STRIPE_SECRET_KEY=sk_test_...
//   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
// SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY werden von Supabase Edge Functions
// automatisch als Umgebungsvariablen bereitgestellt, müssen NICHT manuell gesetzt werden.
//
// Webhook-Endpoint-URL für das Stripe Dashboard (Testmodus):
//   https://<project-ref>.supabase.co/functions/v1/stripe-webhook

import Stripe from "npm:stripe@22.5.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const stripe = new Stripe(stripeSecretKey ?? "", {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(supabaseUrl ?? "", serviceRoleKey ?? "");

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
    console.error("stripe-webhook ist nicht vollständig konfiguriert.");
    return new Response("Webhook ist serverseitig nicht konfiguriert.", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();

  if (!signature) {
    return new Response("Fehlende Stripe-Signatur.", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    // constructEventAsync statt constructEvent, da Deno SubtleCrypto asynchron ist.
    event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe-Signaturprüfung fehlgeschlagen:", error);
    return new Response("Ungültige Signatur.", { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    let items: unknown = [];
    try {
      items = JSON.parse(paymentIntent.metadata?.items ?? "[]");
    } catch {
      items = [];
    }

    const { error } = await supabaseAdmin.from("orders").upsert(
      {
        stripe_payment_intent_id: paymentIntent.id,
        customer_email:
          paymentIntent.metadata?.customer_email || paymentIntent.receipt_email || null,
        items,
        amount_total: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: "paid",
        payment_method_types: paymentIntent.payment_method_types ?? [],
      },
      { onConflict: "stripe_payment_intent_id" },
    );

    if (error) {
      console.error("Fehler beim Speichern der Bestellung:", error);
      return new Response("Datenbankfehler beim Speichern der Bestellung.", { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
