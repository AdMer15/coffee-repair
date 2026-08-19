-- Speichert erfolgreich bezahlte Bestellungen aus dem Stripe-Checkout.
-- Wird ausschließlich serverseitig von der "stripe-webhook" Edge Function
-- über den Service-Role-Key befüllt (siehe supabase/functions/stripe-webhook).

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  stripe_payment_intent_id text not null unique,
  customer_email text,
  items jsonb not null default '[]'::jsonb,
  amount_total numeric(10, 2) not null,
  currency text not null default 'eur',
  status text not null default 'paid',
  payment_method_types text[] not null default '{}'::text[]
);

comment on table public.orders is
  'Bezahlte Bestellungen aus dem Stripe-Checkout. Wird ausschließlich vom stripe-webhook Edge Function-Handler über den Service-Role-Key beschrieben.';

alter table public.orders enable row level security;

-- Bewusst keine Policies: RLS ist aktiv, aber es existiert keine Policy für
-- anon/authenticated. Damit ist die Tabelle vom Frontend aus weder lesbar
-- noch beschreibbar -- Zugriff ist ausschließlich über den Service-Role-Key
-- (z. B. aus einer Edge Function) möglich, der RLS umgeht.
