import prisma from "../../../lib/prisma";
import { getOrCreateUser } from "../../../lib/session";

export default async function handler(req, res) {
  // Get or create user session
  const userId = await getOrCreateUser(req, res);

  if (req.method === "GET") {
    const worlds = await prisma.world.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(worlds);
    return;
  }

  if (req.method === "POST") {
    // Check world limit (max 4 worlds per user)
    const worldCount = await prisma.world.count({
      where: { userId },
    });

    if (worldCount >= 4) {
      res.status(403).json({ error: "Maximum 4 worlds allowed. Delete a world to create a new one." });
      return;
    }

    const { name, summary } = req.body;
    const w = await prisma.world.create({ 
      data: { name, summary, userId } 
    });
    res.status(201).json(w);
    return;
  }

  res.status(405).end();
}
