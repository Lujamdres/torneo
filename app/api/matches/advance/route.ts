import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { tournament_id } = await request.json();

    if (!tournament_id) {
      return NextResponse.json({ error: 'Tournament ID is required' }, { status: 400 });
    }

    const allMatches = await sql`
      SELECT * FROM matches 
      WHERE tournament_id = ${tournament_id}
      ORDER BY round, match_number
    `;

    if (allMatches.length === 0) {
      return NextResponse.json({ success: true });
    }

    const matchesByRound: Record<number, any[]> = {};
    let maxRound = 0;

    for (const match of allMatches) {
      const round = match.round;
      if (!matchesByRound[round]) {
        matchesByRound[round] = [];
      }
      matchesByRound[round].push(match);
      if (round > maxRound) maxRound = round;
    }

    for (let round = 1; round <= maxRound; round++) {
      const currentRoundMatches = matchesByRound[round] || [];
      const nextRoundMatches = matchesByRound[round + 1] || [];

      const completedMatches = currentRoundMatches.filter((m: any) => m.status === 'completed');

      if (completedMatches.length === currentRoundMatches.length && completedMatches.length > 0) {
        const winners = completedMatches.map((m: any) => m.winner_id);

        if (winners.length === 1) {
          await sql`
            UPDATE tournaments 
            SET status = 'completed'
            WHERE id = ${tournament_id}
          `;
          break;
        }

        if (nextRoundMatches.length === 0 && winners.length >= 2) {
          // Si la siguiente ronda será la FINAL (solo 1 partido), crear partido de 3er puesto
          if (winners.length === 2) {
            // Obtener los perdedores de las semifinales
            const losers = completedMatches.map((m: any) => 
              m.winner_id === m.team1_id ? m.team2_id : m.team1_id
            );

            // Verificar que no exista ya un partido de 3er puesto (round = 0)
            const existing3rd = await sql`
              SELECT id FROM matches WHERE tournament_id = ${tournament_id} AND round = 0
            `;

            if (existing3rd.length === 0 && losers.length === 2 && losers[0] !== losers[1]) {
              await sql`
                INSERT INTO matches (tournament_id, team1_id, team2_id, round, match_number, status)
                VALUES (${tournament_id}, ${losers[0]}, ${losers[1]}, 0, 1, 'pending')
              `;
            }
          }

          let matchNumber = 1;
          for (let i = 0; i < winners.length; i += 2) {
            if (i + 1 < winners.length) {
              await sql`
                INSERT INTO matches (tournament_id, team1_id, team2_id, round, match_number, status)
                VALUES (${tournament_id}, ${winners[i]}, ${winners[i + 1]}, ${round + 1}, ${matchNumber}, 'pending')
              `;
              matchNumber++;
            } else if (winners.length % 2 !== 0 && i === winners.length - 1) {
              await sql`
                INSERT INTO matches (tournament_id, team1_id, team2_id, round, match_number, winner_id, status)
                VALUES (${tournament_id}, ${winners[i]}, ${winners[i]}, ${round + 1}, ${matchNumber}, ${winners[i]}, 'completed')
              `;
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error advancing matches:', error);
    return NextResponse.json({ error: 'Failed to advance matches' }, { status: 500 });
  }
}
