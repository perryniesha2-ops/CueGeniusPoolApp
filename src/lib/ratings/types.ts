export type RatingSystem = "apa8" | "fargo";

// Shaped to match a row from the `matches` table (Phase 2),
// so query results can be passed straight in with no conversion.
export interface MatchInput {
  system: string;
  won: boolean;
  innings: number | null;
  safeties: number | null;
  games_won: number | null;
  fargo_won: number | null;
  fargo_lost: number | null;
  opponent_rating: number | null;
  points_earned: number | null;
}

export interface ApaResult {
  skillLevel: number;
  avgScore: number;
  sampleSize: number;
}

export interface FargoResult {
  rating: number;
  games: number;
  avgOpponent: number;
  capped: boolean;
}

export interface Match {
  id: string;
  player_id: string;
  system: string;
  opponent_name: string | null;
  opponent_rating: number | null;
  won: boolean;
  innings: number | null;
  safeties: number | null;
  games_won: number | null;
  fargo_won: number | null;
  fargo_lost: number | null;
  played_at: string;
  created_at: string;
  points_earned: number | null;
}

export interface Team {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
}

export interface Player {
  id: string;
  owner_id: string;
  team_id: string | null;
  name: string;
  default_system: string;
  created_at: string;
}
