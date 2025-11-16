# LoreForge — AI-powered worldbuilding

An AI-powered worldbuilding and lore-management tool for creating and managing fictional universes.

## Features

✅ **Multi-world management** — Create and organize multiple fictional universes  
✅ **Rich entity types** — Characters, Locations, Magic Systems, Factions, Story Events  
✅ **Visual relationship maps** — Character relationships and location connections  
✅ **AI-powered suggestions** — Expand characters, generate backstories, fill plot holes (stub — configure your provider)  
✅ **CRUD operations** — Full create, read, update, delete for all entities  
✅ **Clean, modern UI** — Dark theme with intuitive navigation

## Tech Stack

- **Frontend:** Next.js (React)
- **Backend:** Next.js API routes (Node)
- **Database:** Prisma + SQLite (switchable to PostgreSQL)
- **Visualizations:** vis-network

## Quick Start

1. **Copy environment variables:**

   ```powershell
   Copy-Item .env.example .env
   ```

2. **Install dependencies:**

   ```powershell
   npm install
   ```

3. **Setup database:**

   ```powershell
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   ```

4. **Start dev server:**

   ```powershell
   npm run dev
   ```

5. **Open browser:**  
   Navigate to `http://localhost:3000`

## Project Structure

- `pages/` — Next.js pages and API routes
- `components/` — Reusable React components
- `prisma/` — Database schema and seed data
- `lib/` — Shared utilities (Prisma client)
- `styles/` — Global CSS

## Documentation

📖 See [ARCHITECTURE.md](./ARCHITECTURE.md) for:

- Detailed architecture overview
- API endpoint documentation
- Data model specifications
- Extension guides (add entities, AI integration, PostgreSQL migration)
- Deployment instructions
- Stretch features roadmap

## Usage

1. **Dashboard** (`/`) — View and create worlds
2. **World View** (`/world/[id]`) — Navigate tabs: Characters, Locations, Magic, Factions, Story
3. **CRUD Actions** — Create, edit, delete entities via modal dialogs
4. **Visualizations** — View relationship maps and location graphs

## AI Integration

The AI endpoint (`/api/ai/generate`) is currently a stub. To integrate a real AI provider:

1. Add your API key to `.env`:

   ```
   AI_API_KEY=your-key-here
   ```

2. Update `/pages/api/ai/generate.js` with your provider (OpenAI, Anthropic, etc.)

See ARCHITECTURE.md for implementation examples.

## Deployment

**Vercel** (recommended):

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

**Docker:** See ARCHITECTURE.md for Dockerfile

## License

MIT
