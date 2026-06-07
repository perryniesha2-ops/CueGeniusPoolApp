"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function ctx() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return { supabase, uid: data?.claims.sub as string };
}

export async function createTeam(formData: FormData) {
  const { supabase, uid } = await ctx();
  await supabase
    .from("teams")
    .insert({ owner_id: uid, name: formData.get("name") as string });
  revalidatePath("/team");
}

export async function createPlayer(formData: FormData) {
  const { supabase, uid } = await ctx();
  await supabase.from("players").insert({
    owner_id: uid,
    name: formData.get("name") as string,
    team_id: (formData.get("team_id") as string) || null,
    default_system: (formData.get("default_system") as string) || "apa8",
  });
  revalidatePath("/team");
}

export async function deletePlayer(formData: FormData) {
  const { supabase } = await ctx();
  await supabase
    .from("players")
    .delete()
    .eq("id", formData.get("id") as string);
  revalidatePath("/team");
}

export async function deleteTeam(formData: FormData) {
  const { supabase } = await ctx();
  await supabase
    .from("teams")
    .delete()
    .eq("id", formData.get("id") as string);
  revalidatePath("/team");
}
