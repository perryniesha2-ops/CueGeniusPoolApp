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
