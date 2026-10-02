import { Matchup, Team } from '@/lib/types';

export interface RoundState {
  round: number;
  usedIds: number[];
  byeId: number | null;
  counts: Record<number, number>;
}

export function getRoundState(teams: Team[], matchups: Matchup[]): RoundState {
  const counts: Record<number, number> = {};
  teams.forEach((t) => (counts[t.id] = 0));
  matchups.forEach((m) => {
    if (m.a.id in counts) counts[m.a.id]++;
    if (m.b.id in counts) counts[m.b.id]++;
  });

  const used = new Set<number>();
  const validIds = new Set(teams.map((t) => t.id));
  let round = 1;
  let byeId: number | null = null;

  for (const m of [...matchups].sort((a, b) => a.id - b.id)) {
    if (validIds.has(m.a.id)) used.add(m.a.id);
    if (validIds.has(m.b.id)) used.add(m.b.id);
    const remaining = teams.filter((t) => !used.has(t.id));
    if (remaining.length < 2) {
      byeId = remaining[0]?.id ?? null;
      used.clear();
      round++;
    }
  }

  if (used.size > 0) byeId = null;

  return { round, usedIds: [...used], byeId, counts };
}
