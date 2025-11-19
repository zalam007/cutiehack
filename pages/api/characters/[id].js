import prisma from "../../../lib/prisma";
import { getOrCreateUser } from "../../../lib/session";

export default async function handler(req, res) {
  const userId = await getOrCreateUser(req, res);
  const id = Number(req.query.id);

  // Verify ownership through world relationship
  const character = await prisma.character.findUnique({
    where: { id },
    include: { world: { select: { userId: true } } },
  });

  if (!character) {
    res.status(404).json({ error: "Character not found" });
    return;
  }

  if (character.world.userId !== userId) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  if (req.method === "GET") {
    res.json(character);
    return;
  }

  if (req.method === "PUT") {
    const data = req.body;
    const updated = await prisma.character.update({ where: { id }, data });
    res.json(updated);
    return;
  }

  if (req.method === "DELETE") {
    await prisma.character.delete({ where: { id } });
    res.status(204).end();
    return;
  }

  res.status(405).end();
}
