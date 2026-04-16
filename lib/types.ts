export interface Team {
  id: number;
  name: string;
  created_at: string;
}

export interface Tournament {
  id: number;
  name: string;
  status: 'setup' | 'in_progress' | 'completed';
  created_at: string;
}

export interface Match {
  id: number;
  tournament_id: number;
  team1_id: number;
  team2_id: number;
  winner_id: number | null;
  round: number;
  match_number: number;
  status: 'pending' | 'in_progress' | 'completed';
  played_at: string | null;
  created_at: string;
}

export interface MatchWithTeams extends Match {
  team1_name: string;
  team2_name: string;
  winner_name: string | null;
}
