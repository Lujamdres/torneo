# 🎮 Torneo de Valorant

Aplicación web para gestionar torneos de Valorant con amigos. Sistema de brackets automático, seguimiento de partidos y tabla de posiciones.

## ✨ Características

- ✅ Gestión de equipos/jugadores
- ✅ Generación automática de brackets
- ✅ Sistema de eliminación simple
- ✅ Seguimiento de partidos en tiempo real
- ✅ Interfaz moderna y responsive
- ✅ Tema oscuro/claro automático

## 🚀 Stack Tecnológico

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** TailwindCSS v4
- **Componentes:** shadcn/ui + Radix UI
- **Base de datos:** Neon Postgres (serverless)
- **Despliegue:** Vercel

## 📦 Instalación Local

1. **Clonar el repositorio**
```bash
git clone <tu-repo>
cd torneito
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar base de datos**

Crea una cuenta en [Neon](https://neon.tech) y obtén tu connection string.

Crea un archivo `.env.local` en la raíz del proyecto:
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

4. **Inicializar la base de datos**
```bash
pnpm db:init
```

5. **Iniciar servidor de desarrollo**
```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🌐 Despliegue en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. Sube tu código a GitHub
2. Ve a [Vercel](https://vercel.com)
3. Click en "New Project"
4. Importa tu repositorio de GitHub
5. Agrega la variable de entorno:
   - `DATABASE_URL`: Tu connection string de Neon
6. Click en "Deploy"

### Opción 2: Desde CLI

```bash
# Instalar Vercel CLI
pnpm add -g vercel

# Desplegar
vercel

# Agregar variable de entorno
vercel env add DATABASE_URL
```

**Importante:** Después del primer despliegue, ejecuta el script de inicialización de la BD una vez:
```bash
vercel env pull .env.local
pnpm db:init
```

## 📖 Uso

1. **Agregar equipos:** Ingresa los nombres de los equipos o jugadores en la sección "Equipos/Jugadores"
2. **Generar bracket:** Una vez agregados todos los equipos, click en "Generar Bracket"
3. **Jugar partidos:** Marca el ganador de cada partido haciendo click en el botón "Ganador"
4. **Avanzar fases:** Los ganadores avanzan automáticamente a la siguiente ronda

## 🗂️ Estructura del Proyecto

```
torneito/
├── app/
│   ├── api/              # API Routes
│   │   ├── teams/        # CRUD de equipos
│   │   ├── tournaments/  # CRUD de torneos
│   │   └── matches/      # CRUD de partidos
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página principal
├── components/
│   ├── ui/               # Componentes UI base
│   ├── team-manager.tsx  # Gestión de equipos
│   └── tournament-bracket.tsx  # Visualización de brackets
├── lib/
│   ├── db.ts             # Configuración de BD
│   ├── types.ts          # Tipos TypeScript
│   ├── utils.ts          # Utilidades
│   ├── schema.sql        # Schema de BD
│   └── bracket-generator.ts  # Lógica de brackets
└── scripts/
    └── init-db.ts        # Script de inicialización de BD
```

## 🛠️ Scripts Disponibles

- `pnpm dev` - Inicia servidor de desarrollo
- `pnpm build` - Construye para producción
- `pnpm start` - Inicia servidor de producción
- `pnpm lint` - Ejecuta linter
- `pnpm db:init` - Inicializa la base de datos

## 🎨 Personalización

Para cambiar los colores del tema, edita las variables CSS en `app/globals.css`.

## 📝 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Abre un issue o pull request.
