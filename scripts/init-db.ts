import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function initDatabase() {
  try {
    console.log('Creando tablas...');

    await sql`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        points INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Tabla teams creada');

    await sql`ALTER TABLE teams ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0`;
    console.log('✓ Columna points verificada');

    await sql`
      CREATE TABLE IF NOT EXISTS tournaments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        status VARCHAR(50) DEFAULT 'setup',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Tabla tournaments creada');

    await sql`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
        team1_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        team2_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        winner_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
        round INTEGER NOT NULL,
        match_number INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        played_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Tabla matches creada');

    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(50) PRIMARY KEY,
        value TEXT
      )
    `;
    console.log('✓ Tabla settings creada');

    await sql`CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_matches_round ON matches(round)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status)`;
    console.log('✓ Índices creados');

    console.log('\n✅ Base de datos inicializada correctamente!');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

initDatabase();
