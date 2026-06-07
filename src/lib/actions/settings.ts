"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateMyPlayer } from "@/lib/player";

function numOrNull(formData: FormData, key: string) {
  const v = formData.get(key);
  return v === null || v === "" ? null : Number(v);
}

export async function saveSettings(formData: FormData) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const uid = data?.claims.sub as string;
  const playerId = await getOrCreateMyPlayer();

  // Update the display name on the profile…
  await supabase
    .from("profiles")
    .update({ display_name: formData.get("display_name") as string })
    .eq("id", uid);

  // …and the official ratings + name on the player record.
  await supabase
    .from("players")
    .update({
      name: (formData.get("display_name") as string) || "Me",
      apa8_sl: numOrNull(formData, "apa8_sl"),
      apa9_sl: numOrNull(formData, "apa9_sl"),
      fargo_rating: numOrNull(formData, "fargo_rating"),
    })
    .eq("id", playerId);

  revalidatePath("/settings");
  redirect("/dashboard");
}
