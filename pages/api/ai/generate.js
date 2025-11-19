import {
  generateWithGemini,
  generateCharacterSuggestions,
  generateLocationSuggestions,
  generateMagicSuggestions,
  generateFactionSuggestions,
  generateStoryEventSuggestions,
  expandBackstory,
  generateRelationships,
} from "../../../lib/gemini";
import { getOrCreateUser } from "../../../lib/session";
import { verifyWorldOwnership } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = await getOrCreateUser(req, res);
  const { action, prompt, context } = req.body;

  // Verify world ownership if worldId is provided
  if (context?.worldId) {
    const isOwner = await verifyWorldOwnership(userId, context.worldId);
    if (!isOwner) {
      return res.status(403).json({ error: "Access denied" });
    }
  }

  try {
    let result;

    switch (action) {
      case "generate-characters":
        result = await generateCharacterSuggestions({
          worldName: context.worldName,
          existingCharacters: context.existingEntities || [],
        });
        break;

      case "generate-locations":
        result = await generateLocationSuggestions({
          worldName: context.worldName,
          existingLocations: context.existingEntities || [],
        });
        break;

      case "generate-magic":
        result = await generateMagicSuggestions({
          worldName: context.worldName,
          existingMagic: context.existingEntities || [],
        });
        break;

      case "generate-factions":
        result = await generateFactionSuggestions({
          worldName: context.worldName,
          existingFactions: context.existingEntities || [],
        });
        break;

      case "generate-events":
        result = await generateStoryEventSuggestions({
          worldName: context.worldName,
          existingEvents: context.existingEntities || [],
          characters: context.characters || [],
          locations: context.locations || [],
        });
        break;

      case "expand-backstory":
        result = await expandBackstory({
          characterName: context.characterName,
          currentBackstory: context.backstory,
          worldName: context.worldName,
        });
        break;

      case "generate-relationships":
        result = await generateRelationships({
          characters: context.characters || [],
          worldName: context.worldName,
        });
        break;

      case "chat":
        result = await generateWithGemini({
          prompt: prompt || context.message,
          context: {
            worldName: context.worldName,
            entityType: context.entityType,
            existingEntities: context.existingEntities || [],
          },
        });
        break;

      default:
        return res.status(400).json({ error: "Invalid action" });
    }

    if (result.success) {
      res.json({ success: true, result: result.text, usage: result.usage });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
