# LoreForge — AI-powered worldbuilding

An AI-powered worldbuilding and lore-management tool for creating and managing fictional universes, featuring Google Gemini integration for intelligent worldbuilding assistance.

## Features

✅ **Multi-world management** — Create and organize multiple fictional universes  
✅ **Rich entity types** — Characters, Locations, Magic Systems, Factions, Story Events  
✅ **Custom fields per entity** — Specialized fields for each type (age/strengths for characters, climate/population for locations, etc.)  
✅ **AI Wizard** — Google Gemini-powered assistant with context-aware suggestions  
✅ **Quick AI Actions** — Generate characters, locations, magic systems, factions, and story events with one click  
✅ **Chat Interface** — Ask the AI wizard custom questions about your world  
✅ **CRUD operations** — Full create, read, update, delete for all entities  
✅ **Fantasy-themed UI** — Mystical dark theme with purple/gold gradients and Cinzel typography

## Tech Stack

- **Frontend:** Next.js 13 (React)
- **Backend:** Next.js API routes (Node.js)
- **Database:** Prisma ORM + SQLite (switchable to PostgreSQL)
- **AI:** Google Generative AI (Gemini 2.0 Flash)
- **Styling:** Custom CSS with fantasy theme

## Quick Start

1. **Install dependencies:**

   ```powershell
   npm install
   ```

2. **Set up environment variables:**

   ```powershell
   Copy-Item .env.example .env.local
   ```

   Edit `.env.local` and add your Google Gemini API key:

   ```
   GEMINI_API_KEY=your_api_key_here
   ```

   Get your API key from: https://aistudio.google.com/app/apikey

3. **Set up database:**

   ```powershell
   npx prisma generate
   npx prisma migrate dev
   npm run seed
   ```

4. **Start dev server:**

   ```powershell
   npm run dev
   ```

5. **Open browser:**  
   Navigate to `http://localhost:3000`

## AI Wizard Usage

Click the floating wizard button (🧙‍♂️) in the bottom-right corner to:

- **Quick Actions**: Generate entities with one click based on your current tab

  - Characters: Generate character concepts, expand backstories, create relationships
  - Locations: Generate locations, add historical depth, create connected places
  - Magic: Design magic systems, add limitations, create spells
  - Factions: Generate factions, create leaders, add conflicts
  - Story: Generate plot hooks, suggest next events, create dramatic conflicts

- **Chat Interface**: Ask the wizard custom questions about your world
  - The AI knows your world name, current tab, and all existing entities
  - Get suggestions tailored to your worldbuilding context

## Entity Types & Custom Fields

Each entity type has specialized fields:

- **Characters**: name, role, age, personality, description, backstory, strengths, weaknesses
- **Locations**: name, type, population, climate, description, history
- **Magic Systems**: name, category, description, rules, limitations, costs, examples
- **Factions**: name, type, leader, description, goals, conflicts
- **Story Events**: title, date, location, description, characters involved, outcome

## Project Structure

- `pages/` — Next.js pages and API routes
  - `index.js` — Dashboard with world list
  - `world/[id].js` — World view with entity management
  - `api/` — RESTful API endpoints for all entity types
- `components/` — Reusable React components
  - `AIWizard.js` — AI assistant with chat and quick actions
  - `EntityList.js` — Entity cards with View/Edit/Delete
  - `EntityModal.js` — Dynamic forms per entity type
  - `Sidebar.js` — Navigation with world summary
- `prisma/` — Database schema and seed data
- `lib/` — Shared utilities
  - `prisma.js` — Prisma client singleton
  - `gemini.js` — Google Gemini service wrapper
- `styles/` — Fantasy-themed global CSS

## Database Management

View/edit database with Prisma Studio:

```powershell
npx prisma studio
```

For production or collaboration, migrate to PostgreSQL:

1. Update `DATABASE_URL` in `.env.local` with your Postgres connection string
2. Change provider in `prisma/schema.prisma` from `sqlite` to `postgresql`
3. Run `npx prisma migrate dev`

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Run production server
- `npm run seed` — Seed database with example data
- `npx prisma studio` — Open database GUI
- `npx prisma migrate dev` — Run database migrations

## API Endpoints

All endpoints support standard REST operations:

- `GET /api/worlds` — List all worlds
- `POST /api/worlds` — Create world
- `GET /api/worlds/[id]` — Get single world
- `PUT /api/worlds/[id]` — Update world
- `DELETE /api/worlds/[id]` — Delete world

Same pattern for: `/api/characters`, `/api/locations`, `/api/magics`, `/api/factions`, `/api/events`

AI endpoint:

- `POST /api/ai/generate` — Generate content with Google Gemini

## Deployment

**Vercel** (recommended):

1. Push to GitHub
2. Import in Vercel
3. Add `GEMINI_API_KEY` environment variable
4. Deploy

For PostgreSQL in production, also add `DATABASE_URL` with your database connection string.

## License

MIT
