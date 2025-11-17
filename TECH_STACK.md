# LoreForge — Technical Documentation

**Live Demo:** [lore-forge-weld.vercel.app](https://lore-forge-weld.vercel.app)

## Architecture Overview

LoreForge is a full-stack serverless web application built with Next.js, deployed on Vercel with a cloud-hosted PostgreSQL database.

**Tech Stack:**

- **Frontend:** Next.js 13.5, React 18.2, Custom CSS (fantasy pixel-art theme)
- **Backend:** Next.js API Routes (Node.js serverless functions)
- **Database:** PostgreSQL (Neon cloud) + Prisma ORM 5.6.0
- **AI:** Google Gemini 2.5 Flash API via @google/generative-ai
- **Deployment:** Vercel (serverless hosting with automatic GitHub CI/CD)
- **Data Fetching:** SWR + Axios

## Project Structure

```
cutiehack/
├── components/               # React components
│   ├── Layout.js            # Main layout wrapper with fantasy styling
│   ├── Sidebar.js           # World navigation sidebar
│   ├── EntityList.js        # Reusable entity card list component
│   ├── EntityModal.js       # Dynamic create/edit modal forms
│   ├── AIWizard.js          # AI chat interface with quick actions
│   ├── RelationshipMap.js   # (Not implemented)
│   └── LocationMap.js       # (Not implemented)
├── lib/
│   ├── prisma.js            # Prisma client singleton
│   └── gemini.js            # Google Gemini API service wrapper
├── pages/
│   ├── _app.js              # Next.js app wrapper
│   ├── index.js             # Dashboard (world list)
│   ├── world/
│   │   └── [id].js          # World detail view with entity tabs
│   └── api/                 # Backend API routes
│       ├── worlds/          # World CRUD endpoints
│       │   ├── index.js     # GET (all), POST (create)
│       │   └── [id].js      # GET, PUT, DELETE (single)
│       ├── characters/      # Character CRUD
│       ├── locations/       # Location CRUD
│       ├── magics/          # Magic system CRUD
│       ├── factions/        # Faction CRUD
│       ├── events/          # Story event CRUD
│       └── ai/
│           └── generate.js  # AI content generation endpoint
├── prisma/
│   ├── schema.prisma        # Database schema (PostgreSQL)
│   ├── seed.js              # Demo world seed script
│   └── migrations/          # Prisma migration history
├── styles/
│   └── globals.css          # Global styles (pixel-art fantasy theme)
├── .env.local               # Environment variables (gitignored)
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## Database Schema

### Models (Prisma)

**World**

- `id` (Int, primary key)
- `name` (String)
- `description` (String, optional)
- `createdAt` (DateTime)
- Relations: `characters[]`, `locations[]`, `magics[]`, `factions[]`, `events[]`

**Character**

- `id`, `worldId`, `name`, `role`, `description`, `personality`, `backstory`, `age`, `strengths`, `weaknesses`
- `tags` (String - CSV format)
- `relationships` (String - CSV of character IDs)

**Location**

- `id`, `worldId`, `name`, `type`, `description`, `history`, `population`, `climate`
- `connected` (String - CSV of location IDs)

**Magic**

- `id`, `worldId`, `title`, `overview`, `rules`, `limitations`, `costs`, `category`, `examples`

**Faction**

- `id`, `worldId`, `name`, `purpose`, `conflicts`, `type`, `leader`
- `members` (String - CSV of character IDs)

**StoryEvent**

- `id`, `worldId`, `title`, `description`, `timestamp`, `outcome`, `locationId`
- `charactersInvolved` (String - CSV of character IDs)

### Database Provider

PostgreSQL hosted on Neon (512MB free tier, serverless-compatible).

Connection string format:

```
postgresql://user:password@endpoint.neon.tech/database?sslmode=require
```

## API Endpoints

All endpoints follow RESTful conventions with JSON request/response bodies.

### Worlds

- `GET /api/worlds` → List all worlds
- `POST /api/worlds` → Create new world
  - Body: `{ name, description? }`
- `GET /api/worlds/[id]` → Get world with all related entities
- `PUT /api/worlds/[id]` → Update world
  - Body: `{ name?, description? }`
- `DELETE /api/worlds/[id]` → Delete world (cascades to all entities)

### Characters

- `GET /api/characters?worldId={id}` → List characters for world
- `POST /api/characters` → Create character
  - Body: `{ worldId, name, role, description?, personality?, backstory?, age?, strengths?, weaknesses?, tags?, relationships? }`
- `GET /api/characters/[id]` → Get single character
- `PUT /api/characters/[id]` → Update character
- `DELETE /api/characters/[id]` → Delete character

**Same CRUD pattern applies to:**

- `/api/locations`
- `/api/magics`
- `/api/factions`
- `/api/events`

### AI Generation

- `POST /api/ai/generate`
  - Body: `{ prompt, worldName?, worldDescription?, entityType?, entities? }`
  - Response: `{ suggestion }` (formatted prose with markdown-style headings/bullets)

## AI Integration

### Google Gemini 2.5 Flash

**Implementation:** `lib/gemini.js`

**Features:**

- Context-aware prompts including world name, description, and existing entities
- Structured prose output (not JSON) with markdown formatting
- Specific generators for each entity type (characters, locations, magic, factions, events)
- System instructions for clean, creative worldbuilding suggestions

**Example Prompt Structure:**

```javascript
const prompt = `
You are a creative worldbuilding assistant for "${worldName}".

Current World Context:
${worldDescription}

Existing Characters: ${characterNames.join(", ")}

Generate 3 new character concepts...
`;
```

**AI Wizard Component:**

- Quick action buttons (context-aware based on current tab)
- Chat interface for custom questions
- Character counter (multiline textarea)
- Message formatting with basic markdown rendering
- Integrates with `/api/ai/generate` endpoint

## Frontend Architecture

### Pages

**Dashboard (`/`)**

- Lists all worlds with create button
- Card-based layout
- Navigates to world detail on click

**World Detail (`/world/[id]`)**

- Sidebar with world summary and navigation
- Tab-based interface (Characters, Locations, Magic, Factions, Story)
- Entity lists with View/Edit/Delete actions
- Modal forms for CRUD operations
- AI Wizard floating button

### Components

**EntityList.js**

- Reusable component for displaying entity cards
- Props: `entities`, `onEdit`, `onDelete`, `onView`
- Displays different fields based on entity type

**EntityModal.js**

- Dynamic form generation based on entity type
- Supports create and edit modes
- Field validation
- Submits to appropriate API endpoint

**AIWizard.js**

- Floating wizard button (bottom-right)
- Quick actions: Generate suggestions based on current tab
- Chat interface: Ask custom questions about world
- Context-aware: Passes world info and existing entities to AI

**Layout.js**

- Global layout wrapper
- Navigation header
- Footer
- Fantasy-themed styling

**Sidebar.js**

- World information display
- Entity type navigation (tabs)
- Entity counts

### Styling

Custom CSS with pixel-art fantasy theme:

- Purple/gold gradient color scheme
- Cinzel font for headings
- Pixel-art borders and shadows
- Responsive design
- Dark background with mystical aesthetic

## Development Workflow

### Local Setup

1. Clone repository
2. Install dependencies: `npm install`
3. Set environment variables in `.env.local`:
   ```
   DATABASE_URL="postgresql://..."
   GEMINI_API_KEY="your_api_key"
   ```
4. Generate Prisma client: `npx prisma generate`
5. Push schema to database: `npx prisma db push`
6. Seed demo data: `npm run seed`
7. Start dev server: `npm run dev`

### Database Commands

```powershell
npx prisma studio           # Open database GUI
npx prisma generate         # Regenerate Prisma client
npx prisma db push          # Sync schema to database (dev)
npx prisma migrate dev      # Create migration (production-ready)
npm run seed                # Run seed script
```

### Scripts

- `npm run dev` — Start development server (port 3000)
- `npm run build` — Build for production
- `npm start` — Run production server
- `npm run seed` — Seed database with demo world

## Deployment Guide

### Vercel Deployment

**Prerequisites:**

- GitHub repository
- Neon PostgreSQL database (free tier)
- Google Gemini API key

**Steps:**

1. **Create Neon Database**

   - Sign up at neon.tech (no credit card required)
   - Create new project
   - Copy connection string

2. **Push to GitHub**

   ```powershell
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Import to Vercel**

   - Go to vercel.com
   - Click "New Project"
   - Import GitHub repository
   - Framework preset: Next.js

4. **Configure Environment Variables**

   - Add `DATABASE_URL` (Neon connection string)
   - Add `GEMINI_API_KEY` (from Google AI Studio)

5. **Override Build Command**

   - Go to Settings → Build & Development
   - Build Command: `prisma generate && prisma db push && node prisma/seed.js && next build`
   - This ensures Prisma client is generated, schema is synced, and demo world is seeded

6. **Deploy**
   - Click "Deploy"
   - Automatic deployments will trigger on every push to main branch

### Build Pipeline Explained

```bash
prisma generate              # Generate Prisma client from schema
prisma db push               # Sync schema to database (serverless-safe)
node prisma/seed.js          # Seed demo world (checks for duplicates)
next build                   # Build Next.js application
```

**Note:** `prisma migrate dev` is NOT used in production (requires filesystem access). Use `prisma db push` for serverless environments.

## Extending the Application

### Add a New Entity Type

1. **Update Database Schema** (`prisma/schema.prisma`)

   ```prisma
   model NewEntity {
     id       Int    @id @default(autoincrement())
     worldId  Int
     name     String
     world    World  @relation(fields: [worldId], references: [id], onDelete: Cascade)
   }
   ```

2. **Add Relation to World Model**

   ```prisma
   model World {
     // ...existing fields
     newEntities NewEntity[]
   }
   ```

3. **Create API Routes** (`pages/api/newentities/`)

   - `index.js` — GET all, POST create
   - `[id].js` — GET, PUT, DELETE single

4. **Add Tab to World View** (`pages/world/[id].js`)

   ```javascript
   const tabs = [...existingTabs, "newentities"];
   ```

5. **Update EntityModal** (`components/EntityModal.js`)

   - Add form fields for new entity type

6. **Deploy**
   ```powershell
   npx prisma db push
   git add . && git commit -m "Add new entity type"
   git push origin main
   ```

### Customize AI Prompts

Edit `lib/gemini.js` to modify AI behavior:

```javascript
export async function generateCharacter(context) {
  const prompt = `
    Your custom prompt here...
    World: ${context.worldName}
    Tone: ${context.tone}
  `;

  return await generateContent(prompt);
}
```

### Add Custom Fields

1. Update Prisma schema
2. Run `npx prisma db push`
3. Update EntityModal form fields
4. Update EntityList display logic

## Troubleshooting

**Issue: Prisma client not found**

- Solution: Run `npx prisma generate`

**Issue: Database connection failed**

- Check `DATABASE_URL` in `.env.local`
- Verify Neon database is running
- Ensure connection string includes `?sslmode=require`

**Issue: AI not generating content**

- Verify `GEMINI_API_KEY` is set
- Check API quota at Google AI Studio
- Review browser console for errors

**Issue: Build fails on Vercel**

- Ensure Build Command is overridden in Vercel settings
- Check environment variables are set
- Review build logs for Prisma errors

**Issue: Demo world not appearing**

- Seed script runs on deployment
- Check Vercel deployment logs for seed errors
- Verify `node prisma/seed.js` is in build command

## Performance Considerations

**Serverless Functions:**

- Each API route is a separate serverless function
- Cold starts: ~500ms-1s
- Prisma client singleton reduces connection overhead

**Database Connections:**

- Neon uses connection pooling automatically
- Prisma manages connection lifecycle
- No persistent connections in serverless environment

**Client-side Caching:**

- SWR caches entity lists
- Revalidation on focus/reconnect
- Optimistic updates for better UX

## Security Best Practices

- Environment variables never committed to Git
- API routes validate input (basic)
- Database cascading deletes prevent orphaned records
- SSL required for database connections
- CORS handled by Next.js defaults

**Recommended Additions:**

- Authentication (NextAuth.js)
- Rate limiting on AI endpoints
- Input sanitization
- CSRF protection

## Future Enhancement Ideas

- [ ] User authentication and world ownership
- [ ] Real-time collaboration (WebSockets)
- [ ] Version history / git-like diffs for worlds
- [ ] Export to PDF/Markdown/JSON
- [ ] Image uploads (character portraits, location maps)
- [ ] Timeline visualization for story events
- [ ] Full-text search across entities
- [ ] Tag-based filtering and search
- [ ] AI consistency checker (detect lore conflicts)
- [ ] Custom map drawing tools (canvas-based)
- [ ] Mobile app (React Native)
- [ ] Dark/light theme toggle
- [ ] Markdown editor with live preview
- [ ] Character relationship graph visualization
- [ ] Location connection map visualization

## License

MIT

---

**Built with ❤️ for writers, game designers, and worldbuilders**
