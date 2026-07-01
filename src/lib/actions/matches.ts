"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateMyPlayer } from "@/lib/player";
import { redirect } from "next/navigation";
import { hasProAccess } from "@/lib/access";
import { createAdminClient } from "@/lib/supabase/admin";

// Turns a form field into a number, or null if left blank.
function num(formData: FormData, key: string): number | null {
  const v = formData.get(key);
  return v === null || v === "" ? null : Number(v);
}
function validateMatch(formData: FormData): string[] {
  const system = formData.get("system") as string;
  const missing: string[] = [];
  if (system === "apa8") {
    if (num(formData, "innings") === null) missing.push("innings");
    if (num(formData, "games_won") === null) missing.push("games won");
  } else if (system === "apa9") {
    if (num(formData, "points_earned") === null) missing.push("points earned");
    if (num(formData, "innings") === null) missing.push("innings");
  } else if (system === "fargo") {
    if (num(formData, "fargo_won") === null) missing.push("games you won");
    if (num(formData, "fargo_lost") === null)
      missing.push("games opponent won");
  } else {
    missing.push("a valid game type");
  }
  return missing;
}

export async function createMatch(formData: FormData) {
  const supabase = await createClient();

  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/login");
  const userId = claims.claims.sub;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("subscription_status, created_at")
    .eq("id", userId)
    .single<{ subscription_status: string | null; created_at: string }>();

  if (!profile || !hasProAccess(profile)) {
    redirect(
      "/pricing?error=" +
        encodeURIComponent(
          "Your free trial has ended. Subscribe to keep logging matches.",
        ),
    );
  }

  const missing = validateMatch(formData);
  if (missing.length > 0) {
    redirect(
      "/matches?error=" +
        encodeURIComponent(`Please enter ${missing.join(", ")}.`),
    );
  }

  // Get the PLAYER id — either the one picked in the form, or the user's default player.
  const playerId =
    (formData.get("player_id") as string) || (await getOrCreateMyPlayer());

  const { error: insertError } = await supabase.from("matches").insert({
    player_id: playerId, // ← the real player ID, not userId
    system: formData.get("system") as string,
    opponent_name: (formData.get("opponent_name") as string) || null,
    opponent_rating: num(formData, "opponent_rating"),
    won: formData.get("result") === "won",
    innings: num(formData, "innings"),
    safeties: num(formData, "safeties"),
    games_won: num(formData, "games_won"),
    fargo_won: num(formData, "fargo_won"),
    fargo_lost: num(formData, "fargo_lost"),
    opp_safeties: num(formData, "opp_safeties"),
    points_earned: num(formData, "points_earned"),
  });

  if (insertError) {
    console.log("INSERT ERROR:", insertError);
    redirect(
      "/matches?error=" +
        encodeURIComponent("Could not save match. Please try again."),
    );
  }

  revalidatePath("/matches");
  revalidatePath("/dashboard");
  redirect("/matches");
}
export async function deleteMatch(formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("matches")
    .delete()
    .eq("id", formData.get("id") as string);
  revalidatePath("/matches");
  revalidatePath("/dashboard");
}

export async function updateMatch(formData: FormData) {
  const supabase = await createClient();

  await supabase
    .from("matches")
    .update({
      system: formData.get("system") as string,
      opponent_name: (formData.get("opponent_name") as string) || null,
      opponent_rating: num(formData, "opponent_rating"),
      won: formData.get("result") === "won",
      innings: num(formData, "innings"),
      safeties: num(formData, "safeties"),
      games_won: num(formData, "games_won"),
      fargo_won: num(formData, "fargo_won"),
      fargo_lost: num(formData, "fargo_lost"),
      opp_safeties: num(formData, "opp_safeties"),
      points_earned: num(formData, "points_earned"),
    })
    .eq("id", formData.get("id") as string);

  revalidatePath("/matches");
  revalidatePath("/dashboard");
}
