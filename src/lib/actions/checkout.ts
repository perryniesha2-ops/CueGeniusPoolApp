"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export async function createCheckoutSession(formData: FormData) {
  const plan = formData.get("plan") as string; // "monthly" or "yearly"
  const priceId =
    plan === "yearly"
      ? process.env.STRIPE_PRICE_YEARLY!
      : process.env.STRIPE_PRICE_MONTHLY!;

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/login");

  const userId = claims.claims.sub;
  const email = claims.claims.email as string | undefined;

  // Reuse an existing Stripe customer if we have one, else let Checkout create it.
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single<{ stripe_customer_id: string | null }>();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/dashboard?upgraded=1`,
    cancel_url: `${siteUrl}/pricing`,
    ...(profile?.stripe_customer_id
      ? { customer: profile.stripe_customer_id }
      : { customer_email: email }),
    // Tag the session with our user ID so the webhook knows who paid.
    client_reference_id: userId,
    subscription_data: {
      metadata: { supabase_user_id: userId },
    },
  });

  if (session.url) redirect(session.url);
  redirect("/pricing?error=Could not start checkout");
}
