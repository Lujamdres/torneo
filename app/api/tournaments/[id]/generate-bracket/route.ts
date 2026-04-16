import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { generateBracket } from '@/lib/bracket-generator';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tournamentId = parseInt(id);

    const teams = await sql`SELECT * FROM teams ORDER BY id`;

    if (teams.length < 2) {
      return NextResponse.json(
        { error: 'Se necesitan al menos 2 equipos para generar el bracket' },
        { status: 400 }
      );
    }

    await sql`DELETE FROM matches WHERE tournament_id = ${tournamentId}`;

    const matches = generateBracket(teams as any[], tournamentId);

    for (const match of matches) {
      if (match.winner_id && match.status) {
        await sql`
          INSERT INTO matches (tournament_id, team1_id, team2_id, round, match_number, winner_id, status)
          VALUES (${match.tournament_id}, ${match.team1_id}, ${match.team2_id}, ${match.round}, ${match.match_number}, ${match.winner_id}, ${match.status})
        `;
      } else {
        await sql`
          INSERT INTO matches (tournament_id, team1_id, team2_id, round, match_number)
          VALUES (${match.tournament_id}, ${match.team1_id}, ${match.team2_id}, ${match.round}, ${match.match_number})
        `;
      }
    }

    await sql`
      UPDATE tournaments 
      SET status = 'in_progress'
      WHERE id = ${tournamentId}
    `;

    return NextResponse.json({ success: true, matches: matches.length });
  } catch (error) {
    console.error('Error generating bracket:', error);
    return NextResponse.json(
      { error: 'Failed to generate bracket' },
      { status: 500 }
    );
  }
}
