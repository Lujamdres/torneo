# Torneito

App web para gestionar torneos con bracket estilo Champions League.

## Stack

- Next.js 16, TypeScript, TailwindCSS, shadcn/ui
- Neon Postgres, Vercel

## Instalacion

```bash
pnpm install
```

Crear `.env.local`:
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

```bash
pnpm db:init
pnpm dev
```

## Deploy en Vercel

1. Importar repo en [Vercel](https://vercel.com)
2. Agregar variable `DATABASE_URL`
3. Deploy

Despues del primer deploy, inicializar la BD:
```bash
vercel env pull .env.local
pnpm db:init
```

## Licencia

MIT
