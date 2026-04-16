import { Team } from './types';

export function generateBracket(teams: Team[], tournamentId: number) {
  if (teams.length < 2) {
    throw new Error('Se necesitan al menos 2 equipos para generar un bracket');
  }

  // Fisher-Yates shuffle para aleatoriedad uniforme
  const shuffledTeams = [...teams];
  for (let i = shuffledTeams.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledTeams[i], shuffledTeams[j]] = [shuffledTeams[j], shuffledTeams[i]];
  }
  const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(shuffledTeams.length)));
  
  const matches = [];
  let matchNumber = 1;
  
  for (let i = 0; i < nextPowerOfTwo / 2; i++) {
    const team1 = shuffledTeams[i * 2];
    const team2 = shuffledTeams[i * 2 + 1];
    
    if (team1 && team2) {
      matches.push({
        tournament_id: tournamentId,
        team1_id: team1.id,
        team2_id: team2.id,
        round: 1,
        match_number: matchNumber++,
      });
    } else if (team1 && !team2) {
      matches.push({
        tournament_id: tournamentId,
        team1_id: team1.id,
        team2_id: team1.id,
        round: 1,
        match_number: matchNumber++,
        winner_id: team1.id,
        status: 'completed',
      });
    }
  }

  return matches;
}

export function calculateRounds(teamCount: number): number {
  return Math.ceil(Math.log2(teamCount));
}

export function getRoundName(round: number, totalRounds: number): string {
  const roundsFromEnd = totalRounds - round + 1;
  
  if (roundsFromEnd === 1) return 'Final';
  if (roundsFromEnd === 2) return 'Semifinales';
  if (roundsFromEnd === 3) return 'Cuartos de Final';
  if (roundsFromEnd === 4) return 'Octavos de Final';
  
  return `Ronda ${round}`;
}
