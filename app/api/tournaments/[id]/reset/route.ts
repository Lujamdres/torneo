import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tournamentId = parseInt(id);

    await sql`DELETE FROM matches WHERE tournament_id = ${tournamentId}`;

    await sql`
      UPDATE tournaments 
      SET status = 'setup'
      WHERE id = ${tournamentId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resetting tournament:', error);
    return NextResponse.json(
      { error: 'Failed to reset tournament' },
      { status: 500 }
    );
  }
}
