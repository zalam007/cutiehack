import prisma from "../../../lib/prisma";
import { getOrCreateUser } from "../../../lib/session";

export default async function handler(req, res) {
  const userId = await getOrCreateUser(req, res);
  const id = Number(req.query.id);

  // Verify world ownership
  const world = await prisma.world.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!world) {
    res.status(404).json({ error: "World not found" });
    return;
  }

  if (world.userId !== userId) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  if (req.method === "GET") {
    const w = await prisma.world.findUnique({
      where: { id },
      include: { characters: true, locations: true },
    });
    res.json(w);
    return;
  }

  if (req.method === "PUT") {
    const data = req.body;
    const updated = await prisma.world.update({ where: { id }, data });
    res.json(updated);
    return;
  }

  if (req.method === "DELETE") {
    // Cascading deletes are handled by database schema
    await prisma.world.delete({ where: { id } });
    res.status(204).end();
    return;
  }

  res.status(405).end();
}
