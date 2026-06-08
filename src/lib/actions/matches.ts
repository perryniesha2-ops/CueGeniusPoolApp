"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateMyPlayer } from "@/lib/player";

// Turns a form field into a number, or null if left blank.
function num(formData: FormData, key: string): number | null {
  const v = formData.get(key);
  return v === null || v === "" ? null : Number(v);
}

export async function createMatch(formData: FormData) {
  const supabase = await createClient();
  const playerId =
    (formData.get("player_id") as string) || (await getOrCreateMyPlayer());

  await supabase.from("matches").insert({
    player_id: playerId,
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

  revalidatePath("/matches");
  revalidatePath("/dashboard");
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
