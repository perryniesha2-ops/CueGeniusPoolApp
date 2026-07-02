import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";
import { revalidatePath } from "next/cache";

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
      console.error("No supabase_user_id in subscription metadata", sub.id);
      return;
    }

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    revalidatePath("/matches");

    // Guard against a malformed/unexpanded items array so we never throw.
    const periodEndUnix = sub.items?.data?.[0]?.current_period_end;
    const periodEnd = periodEndUnix
      ? new Date(periodEndUnix * 1000).toISOString()
      : null;

    const { error } = await admin
      .from("profiles")
      .update({
        stripe_customer_id: sub.customer as string,
        subscription_status: sub.status, // "active", "canceled", "past_due", etc.
        subscription_price_id: sub.items?.data?.[0]?.price?.id ?? null,
        subscription_current_period_end: periodEnd,
        subscription_cancel_at_period_end: sub.cancel_at_period_end ?? false,
      })
      .eq("id", userId);

    if (error) {
      console.error("Failed to sync subscription to profile:", error, sub.id);
    }
  }

  try {
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
  } catch (err) {
    // Log but still return 200 so Stripe doesn't retry a permanent failure
    // in a loop. Genuine transient issues can be replayed from the dashboard.
    console.error("Webhook handler error for event", event.type, err);
    return NextResponse.json({ received: true, handled: false });
  }

  return NextResponse.json({ received: true });
}
