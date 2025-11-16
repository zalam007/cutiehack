import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const id = Number(req.query.id);
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
    await prisma.world.delete({ where: { id } });
    res.status(204).end();
    return;
  }

  res.status(405).end();
}
