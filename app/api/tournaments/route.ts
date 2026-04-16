import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { Tournament } from '@/lib/types';

export async function GET() {
  try {
    const tournaments = await sql`
      SELECT * FROM tournaments ORDER BY created_at DESC
    `;
    return NextResponse.json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return NextResponse.json({ error: 'Failed to fetch tournaments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Tournament name is required' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO tournaments (name, status) 
      VALUES (${name.trim()}, 'setup') 
      RETURNING *
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating tournament:', error);
    return NextResponse.json({ error: 'Failed to create tournament' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Tournament ID and status are required' }, { status: 400 });
    }

    const result = await sql`
      UPDATE tournaments 
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating tournament:', error);
    return NextResponse.json({ error: 'Failed to update tournament' }, { status: 500 });
  }
}
