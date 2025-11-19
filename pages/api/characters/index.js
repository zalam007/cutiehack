import prisma from "../../../lib/prisma";
import { getOrCreateUser } from "../../../lib/session";

export default async function handler(req, res) {
  const userId = await getOrCreateUser(req, res);

  if (req.method === "GET") {
    const { worldId } = req.query;
    
    if (!worldId) {
      res.status(400).json({ error: "worldId required" });
      return;
    }

    // Verify world ownership
    const world = await prisma.world.findUnique({
      where: { id: Number(worldId) },
      select: { userId: true },
    });

    if (!world || world.userId !== userId) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    const items = await prisma.character.findMany({
      where: { worldId: Number(worldId) },
    });
    res.json(items);
    return;
  }

  if (req.method === "POST") {
    const data = req.body;

    // Verify world ownership
    const world = await prisma.world.findUnique({
      where: { id: data.worldId },
      select: { userId: true },
    });

    if (!world || world.userId !== userId) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    // Check character limit (max 10 per world)
    const characterCount = await prisma.character.count({
      where: { worldId: data.worldId },
    });

    if (characterCount >= 10) {
      res.status(403).json({ error: "Maximum 10 characters per world. Delete a character to create a new one." });
      return;
    }

    const created = await prisma.character.create({ data });
    res.status(201).json(created);
    return;
  }

  res.status(405).end();
}
