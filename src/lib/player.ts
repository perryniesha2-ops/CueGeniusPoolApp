import { createClient } from "@/lib/supabase/server";

// Returns the id of the current user's player, creating one if needed.
export async function getOrCreateMyPlayer(): Promise<string> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub as string;

  const { data: existing } = await supabase
    .from("players")
    .select("id")
    .eq("owner_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();

  const { data: created, error } = await supabase
    .from("players")
    .insert({ owner_id: userId, name: profile?.display_name || "Me" })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return created.id;
}
