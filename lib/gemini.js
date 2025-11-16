import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateWithGemini({ prompt, context = {} }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build context-aware prompt with improved system instructions
    let fullPrompt = `You are an assistant for a pixel-art worldbuilding app called LoreForge.
You help users create and refine fantasy worlds, characters, locations, magic systems, factions, and events.

GENERAL RULES:
- Always respond in clean, human-readable prose with clear formatting
- Use headings (markdown ##) and bullet points for structure
- NEVER output raw JSON unless explicitly asked
- Keep responses concise and scannable (2-4 options per request)
- Avoid repeating the user's prompt back to them
- Use evocative but efficient language (80% clarity, 20% flavor)
- Make each suggestion self-contained and easy to copy

`;

    if (context.worldName) {
      fullPrompt += `WORLD: "${context.worldName}"\n`;
    }

    if (context.tone) {
      fullPrompt += `TONE: ${context.tone}\n`;
    }

    if (context.worldDescription) {
      fullPrompt += `WORLD DESCRIPTION: ${context.worldDescription}\n`;
    }

    if (context.entityType) {
      fullPrompt += `CURRENT CONTEXT: User is working on ${context.entityType}\n`;
    }

    if (context.existingEntities && context.existingEntities.length > 0) {
      fullPrompt += `\nEXISTING ${context.entityType || "ENTITIES"}:\n`;
      context.existingEntities.slice(0, 10).forEach((entity) => {
        fullPrompt += `- ${entity.name || entity.title}: ${
          entity.description?.substring(0, 100) || ""
        }\n`;
      });
      fullPrompt += "\n";
    }

    if (context.currentDraft) {
      fullPrompt += `\nCURRENT DRAFT (what the user is editing):\n`;
      Object.entries(context.currentDraft).forEach(([key, value]) => {
        if (value && value.toString().trim()) {
          fullPrompt += `${key}: ${value}\n`;
        }
      });
      fullPrompt += "\n";
    }

    fullPrompt += `\nUSER REQUEST:\n${prompt}\n`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      text,
      usage: response.usageMetadata || null,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate content",
      text: null,
    };
  }
}

export async function generateCharacterSuggestions({
  worldName,
  existingCharacters = [],
}) {
  return generateWithGemini({
    prompt: `Generate 3 unique character concepts that fit this world.

For each character, provide:

## Character [Number]: [Name]

**Role:** [occupation/position]  
**Age:** [age]  
**Personality:** [2-3 key traits]

**Description:** [1-2 sentences about appearance and demeanor]

**Backstory:** [2-3 sentences about their past and what drives them]

**Story Hooks:**
- [What they want]
- [What they fear]
- [A secret or conflict]

Make each character distinct and fitting for the world's tone. Avoid duplicating roles or personalities from existing characters.`,
    context: {
      worldName,
      entityType: "Characters",
      existingEntities: existingCharacters,
    },
  });
}

export async function generateLocationSuggestions({
  worldName,
  existingLocations = [],
}) {
  return generateWithGemini({
    prompt: `Generate 3 unique location ideas for this world.

For each location, provide:

## Location [Number]: [Name]

**Type:** [city/forest/mountain/ruins/etc.]  
**Vibe:** [2-3 descriptive words]

**Description:** [2-3 sentences about what makes this place unique and memorable]

**Points of Interest:**
- [Specific landmark or feature]
- [Another notable aspect]
- [Third detail]

**Story Hooks:**
- [A conflict or tension]
- [A secret or mystery]
- [An opportunity for adventure]

Make each location distinct and avoid repeating themes from existing locations.`,
    context: {
      worldName,
      entityType: "Locations",
      existingEntities: existingLocations,
    },
  });
}

export async function generateMagicSuggestions({
  worldName,
  existingMagic = [],
}) {
  return generateWithGemini({
    prompt: `Generate 2 unique magic system concepts for this world.

For each system, provide:

## Magic System [Number]: [Name]

**Category:** [elemental/divine/arcane/blood/etc.]  
**Core Concept:** [1 sentence overview]

**How It Works:** [2-3 sentences explaining the mechanics and source]

**Limitations & Costs:**
- [What it cannot do]
- [What practitioners must sacrifice or pay]
- [Physical or mental toll]

**Example Manifestations:**
- [Spell or ability example 1]
- [Spell or ability example 2]
- [Spell or ability example 3]

**Story Hooks:**
- [A conflict or consequence of this magic]
- [A faction or group that uses it]

Make each system distinct with clear rules and interesting trade-offs.`,
    context: {
      worldName,
      entityType: "Magic Systems",
      existingEntities: existingMagic,
    },
  });
}

export async function generateFactionSuggestions({
  worldName,
  existingFactions = [],
}) {
  return generateWithGemini({
    prompt: `Generate 3 unique faction ideas for this world.

For each faction, provide:

## Faction [Number]: [Name]

**Type:** [guild/military/religious order/criminal syndicate/etc.]  
**Leader:** [Name and 1 sentence description]

**Description:** [2-3 sentences about what this faction does and why they matter]

**Goals:**
- [Primary objective]
- [Secondary objective]

**Conflicts:**
- [Who opposes them and why]
- [Internal tensions or challenges]

**Story Hooks:**
- [A quest or mission they might offer]
- [A secret they're hiding]

Make each faction distinct with clear motivations and potential for drama.`,
    context: {
      worldName,
      entityType: "Factions",
      existingEntities: existingFactions,
    },
  });
}

export async function generateStoryEventSuggestions({
  worldName,
  existingEvents = [],
  characters = [],
  locations = [],
}) {
  return generateWithGemini({
    prompt: `Generate 3 compelling story event ideas for this world.

For each event, provide:

## Event [Number]: [Dramatic Title]

**When:** [Timeline position - e.g., "Year 1, Spring" or "The Age of Storms"]  
**Where:** [Location - use existing locations when appropriate]

**What Happens:** [2-3 sentences describing the event and its immediate impact]

**Key Players:**
- [Character or faction involved]
- [Another participant]

**Outcome:** [What changed as a result - 1-2 sentences]

**Story Hooks:**
- [A mystery or question left unanswered]
- [A consequence that leads to future events]

Make each event dramatic and consequential, with clear connections to the world.`,
    context: {
      worldName,
      entityType: "Story Events",
      existingEntities: existingEvents,
    },
  });
}

export async function expandBackstory({
  characterName,
  currentBackstory,
  worldName,
}) {
  return generateWithGemini({
    prompt: `The character "${characterName}" currently has this backstory: "${currentBackstory}"

Expand this into a richer, more detailed backstory (2-3 paragraphs) that:
- Adds specific events and turning points
- Includes relationships with others
- Explains their motivations
- Adds depth and emotional resonance
- Maintains consistency with the existing backstory`,
    context: { worldName },
  });
}

export async function generateRelationships({ characters, worldName }) {
  const characterList = characters.map((c) => c.name).join(", ");
  return generateWithGemini({
    prompt: `Given these characters: ${characterList}

Suggest 3-5 interesting relationships between them. For each relationship, describe:
- Who is involved
- The nature of their relationship (allies, rivals, family, etc.)
- A brief explanation of how they know each other

Be creative and add depth to the world.`,
    context: { worldName, entityType: "Characters" },
  });
}
