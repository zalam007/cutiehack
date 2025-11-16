# LoreForge — Technical Documentation

## Architecture

**Stack:**
- Frontend: Next.js 13 (React)
- Backend: Next.js API routes
- Database: Prisma + SQLite (production: switch to PostgreSQL)
- Visualizations: vis-network

## Project Structure

```
cutiehack/
├── components/          # Reusable React components
│   ├── Layout.js        # Main layout wrapper
│   ├── Sidebar.js       # World navigation sidebar
│   ├── EntityList.js    # Generic list component for entities
│   ├── EntityModal.js   # Modal for create/edit forms
│   ├── RelationshipMap.js  # Character relationship graph
│   └── LocationMap.js   # Location node map
├── lib/
│   └── prisma.js        # Prisma client singleton
├── pages/
│   ├── _app.js          # Next.js app wrapper
│   ├── index.js         # Dashboard (worlds list)
│   ├── world/
│   │   └── [id].js      # World view with tabs
│   └── api/             # Backend API routes
│       ├── worlds/      # World CRUD
│       ├── characters/  # Character CRUD
│       ├── locations/   # Location CRUD
│       ├── magics/      # Magic system CRUD
│       ├── factions/    # Faction CRUD
│       ├── events/      # Story event CRUD
│       └── ai/
│           └── generate.js  # AI stub endpoint
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
├── styles/
│   └── globals.css      # Global styles
└── package.json
```

## Data Models

### World
- id, name, summary, createdAt
- Relations: characters, locations, magics, factions, events

### Character
- id, worldId, name, role, description, personality, backstory
- tags (CSV string), relationships (CSV string of IDs)

### Location
- id, worldId, name, type, description, history
- connected (CSV string of location IDs)

### Magic
- id, worldId, title, overview, rules, limitations, costs

### Faction
- id, worldId, name, purpose, conflicts
- members (CSV string of character IDs)

### StoryEvent
- id, worldId, title, description, timestamp
- charactersInvolved (CSV string of IDs), locationId

## API Endpoints

All endpoints follow REST conventions:

**Worlds**
- GET /api/worlds — List all worlds
- POST /api/worlds — Create world
- GET /api/worlds/[id] — Get world with relations
- PUT /api/worlds/[id] — Update world
- DELETE /api/worlds/[id] — Delete world

**Characters** (same pattern)
- /api/characters
- /api/characters/[id]

**Locations** (same pattern)
- /api/locations
- /api/locations/[id]

**Magics, Factions, Events** follow the same pattern.

**AI**
- POST /api/ai/generate — { prompt, context } → { result }

## Frontend Features

### Dashboard (/)
- Lists all worlds
- Create new world button
- Click world to navigate to world view

### World View (/world/[id])
- Sidebar navigation for entity types
- Tab-based interface (Characters, Locations, Magic, Factions, Story)
- CRUD operations via modals
- Visualizations:
  - Character relationship graph (vis-network)
  - Location map (vis-network)

## How to Extend

### Add a new entity type

1. **Define model** in `prisma/schema.prisma`
2. **Create API routes** in `pages/api/[entityType]/`
3. **Add tab** in `pages/world/[id].js`
4. **Update Sidebar** with new navigation link

### Add AI integration

Replace the stub in `pages/api/ai/generate.js`:

```js
import axios from 'axios'

export default async function handler(req, res){
  const { prompt, context } = req.body
  
  // Example: OpenAI
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  }, {
    headers: { Authorization: `Bearer ${process.env.AI_API_KEY}` }
  })
  
  res.json({ result: response.data.choices[0].message.content })
}
```

Then add AI buttons to EntityModal or entity detail pages.

### Switch to PostgreSQL

1. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/loreforge"
   ```

2. Change provider in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. Update array fields back to proper arrays (Postgres supports them):
   ```prisma
   tags String[] @default([])
   ```

4. Re-run migrations:
   ```powershell
   npm run prisma:migrate
   ```

## Deployment

### Vercel (recommended for Next.js)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables (DATABASE_URL, AI_API_KEY)
4. Deploy

### Docker

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]
```

## Stretch Features (Future)

- [ ] Export world to PDF/Markdown
- [ ] Collaboration mode (multi-user editing)
- [ ] Version history with git-like diffs
- [ ] AI consistency checker
- [ ] Custom map drawing tools
- [ ] Character portrait generator (DALL-E, Midjourney)
- [ ] Timeline visualization (vis-timeline)
- [ ] Full-text search across entities
- [ ] Tags and filtering system
- [ ] Dark/light theme toggle
- [ ] Mobile-responsive design
- [ ] Drag-and-drop relationship editor
- [ ] Markdown editor with preview
- [ ] Image upload and gallery

## Troubleshooting

**Q: Prisma client not found**
A: Run `npm run prisma:generate`

**Q: Database not found**
A: Run `npm run prisma:migrate` then `npm run seed`

**Q: Port 3000 already in use**
A: Change port in `package.json` dev script or kill the process

**Q: AI endpoint returns stub data**
A: Set AI_API_KEY in .env and update /api/ai/generate.js with real provider

## License

MIT
