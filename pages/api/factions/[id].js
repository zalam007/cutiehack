import prisma from "../../../lib/prisma";
import { getOrCreateUser } from "../../../lib/session";

export default async function handler(req, res) {
  const userId = await getOrCreateUser(req, res);
  const id = Number(req.query.id);

  const entity = await prisma.faction.findUnique({
    where: { id },
    include: { world: { select: { userId: true } } },
  });

  if (!entity) {
    res.status(404).json({ error: "Faction not found" });
    return;
  }

  if (entity.world.userId !== userId) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  if (req.method === "GET") {
    res.json(entity);
    return;
  }

  if (req.method === "PUT") {
    const data = req.body;
    const updated = await prisma.faction.update({ where: { id }, data });
    res.json(updated);
    return;
  }

  if (req.method === "DELETE") {
    await prisma.faction.delete({ where: { id } });
    res.status(204).end();
    return;
  }

  res.status(405).end();
}
