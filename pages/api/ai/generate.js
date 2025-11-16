// AI endpoint stub. Configure an external AI provider (OpenAI, Anthropic, etc.) in .env
export default async function handler(req, res) {
  const { prompt, context } = req.body;

  // Stub: return a canned suggestion. Replace with actual AI API call.
  const suggestions = {
    character: "A mysterious traveler with a hidden past.",
    location: "An ancient library, rumored to hold forbidden knowledge.",
    backstory:
      "They once served the crown, but betrayed their oath after discovering dark secrets.",
    expand:
      "Further details: they carry a sigil etched in silver, a reminder of their fallen order.",
  };

  const result = suggestions[context] || "AI suggestion placeholder.";
  res.json({ result });
}
