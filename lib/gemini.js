import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateWithGemini({ prompt, context = {} }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build context-aware prompt
    let fullPrompt = "";

    if (context.worldName) {
      fullPrompt += `You are a creative worldbuilding assistant for the fantasy world "${context.worldName}".\n\n`;
    }

    if (context.entityType) {
      fullPrompt += `The user is working on: ${context.entityType}\n`;
    }

    if (context.existingEntities && context.existingEntities.length > 0) {
      fullPrompt += `\nExisting ${
        context.entityType || "entities"
      } in this world:\n`;
      context.existingEntities.forEach((entity) => {
        fullPrompt += `- ${entity.name || entity.title}: ${
          entity.description || ""
        }\n`;
      });
      fullPrompt += "\n";
    }

    fullPrompt += prompt;

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
    prompt: `Generate 3 unique character concepts for this fantasy world. For each character, provide:
- Name (fantasy-appropriate)
- Role (their occupation or position)
- Age
- Personality (2-3 key traits)
- Brief description (1-2 sentences)
- Backstory hook (1 sentence)
- Strengths (2-3)
- Weaknesses (2-3)

Format as JSON array with these exact fields: name, role, age, personality, description, backstory, strengths, weaknesses`,
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
    prompt: `Generate 3 unique location ideas for this fantasy world. For each location, provide:
- Name (evocative and memorable)
- Type (city, forest, mountain, ruins, etc.)
- Population (rough estimate or description)
- Climate (weather patterns, seasons)
- Description (2-3 sentences about what makes it unique)
- History (1-2 sentences about its past)

Format as JSON array with these exact fields: name, type, population, climate, description, history`,
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
    prompt: `Generate 2 unique magic system concepts for this fantasy world. For each system, provide:
- Name (what it's called)
- Category (elemental, divine, arcane, blood magic, etc.)
- Description (2-3 sentences explaining how it works)
- Rules (3-4 key rules or principles)
- Limitations (what it cannot do or costs)
- Costs (what practitioners sacrifice or need)
- Examples (2-3 example spells or abilities)

Format as JSON array with these exact fields: name, category, description, rules, limitations, costs, examples`,
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
    prompt: `Generate 3 unique faction ideas for this fantasy world. For each faction, provide:
- Name (organization name)
- Type (guild, military, religious order, criminal syndicate, etc.)
- Leader (name and brief description)
- Description (2-3 sentences about the faction)
- Goals (what they want to achieve)
- Conflicts (who or what opposes them)

Format as JSON array with these exact fields: name, type, leader, description, goals, conflicts`,
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
    prompt: `Generate 3 compelling story event ideas for this fantasy world. For each event, provide:
- Title (dramatic and intriguing)
- Date (timeline position - can be relative like "Year 1, Spring" or specific)
- Location (where it happens - use existing locations if appropriate)
- Description (2-3 sentences about what happens)
- Characters Involved (list names of involved characters)
- Outcome (what changed as a result)

Format as JSON array with these exact fields: title, date, location, description, charactersInvolved, outcome`,
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
