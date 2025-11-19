import prisma from "../../../lib/prisma";
import { getOrCreateUser } from "../../../lib/session";
import { verifyWorldOwnership, checkEntityLimit } from "../../../lib/auth";

export default async function handler(req, res) {
  const userId = await getOrCreateUser(req, res);

  if (req.method === "GET") {
    const { worldId } = req.query;
    
    if (!worldId) {
      res.status(400).json({ error: "worldId required" });
      return;
    }

    const isOwner = await verifyWorldOwnership(userId, Number(worldId));
    if (!isOwner) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    const items = await prisma.magic.findMany({
      where: { worldId: Number(worldId) },
    });
    res.json(items);
    return;
  }

  if (req.method === "POST") {
    const data = req.body;

    const isOwner = await verifyWorldOwnership(userId, data.worldId);
    if (!isOwner) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    const underLimit = await checkEntityLimit('magic', data.worldId);
    if (!underLimit) {
      res.status(403).json({ error: "Maximum 10 magics per world. Delete one to create a new one." });
      return;
    }

    const created = await prisma.magic.create({ data });
    res.status(201).json(created);
    return;
  }

  res.status(405).end();
}
