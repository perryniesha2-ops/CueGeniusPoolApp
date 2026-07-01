import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const body = await request.text(); // raw body — required for signature check
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Helper: update a user's profile from a subscription object.
  async function syncSubscription(sub: Stripe.Subscription) {
    const userId = sub.metadata?.supabase_user_id;
    if (!userId) {
      console.error("No supabase_user_id in subscription metadata");
      return;
    }
    await admin
      .from("profiles")
      .update({
        stripe_customer_id: sub.customer as string,
        subscription_status: sub.status, // "active", "canceled", "past_due", etc.
        subscription_price_id: sub.items.data[0]?.price.id ?? null,
        subscription_current_period_end: new Date(
          sub.items.data[0].current_period_end * 1000,
        ).toISOString(),
      })
      .eq("id", userId);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // Fetch the full subscription to get status + period end.
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(
          session.subscription as string,
        );
        // Make sure metadata carries the user id (set at checkout).
        if (!sub.metadata?.supabase_user_id && session.client_reference_id) {
          await stripe.subscriptions.update(sub.id, {
            metadata: { supabase_user_id: session.client_reference_id },
          });
          sub.metadata = { supabase_user_id: session.client_reference_id };
        }
        await syncSubscription(sub);
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await syncSubscription(sub);
      break;
    }
    default:
      // Ignore other events.
      break;
  }

  return NextResponse.json({ received: true });
}
