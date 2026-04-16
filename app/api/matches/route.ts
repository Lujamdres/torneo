import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { MatchWithTeams } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get('tournament_id');

    if (!tournamentId) {
      return NextResponse.json({ error: 'Tournament ID is required' }, { status: 400 });
    }

    const matches = await sql`
      SELECT 
        m.*,
        t1.name as team1_name,
        t2.name as team2_name,
        tw.name as winner_name
      FROM matches m
      LEFT JOIN teams t1 ON m.team1_id = t1.id
      LEFT JOIN teams t2 ON m.team2_id = t2.id
      LEFT JOIN teams tw ON m.winner_id = tw.id
      WHERE m.tournament_id = ${tournamentId}
      ORDER BY m.round, m.match_number
    `;
    
    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { tournament_id, team1_id, team2_id, round, match_number } = await request.json();

    if (!tournament_id || !team1_id || !team2_id || round === undefined || match_number === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO matches (tournament_id, team1_id, team2_id, round, match_number)
      VALUES (${tournament_id}, ${team1_id}, ${team2_id}, ${round}, ${match_number})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json({ error: 'Failed to create match' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, winner_id } = await request.json();

    if (!id || !winner_id) {
      return NextResponse.json({ error: 'Match ID and winner ID are required' }, { status: 400 });
    }

    const result = await sql`
      UPDATE matches 
      SET winner_id = ${winner_id}, 
          status = 'completed',
          played_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json({ error: 'Failed to update match' }, { status: 500 });
  }
}
