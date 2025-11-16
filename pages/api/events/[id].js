import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const id = Number(req.query.id);
  if (req.method === "GET") {
    const item = await prisma.storyEvent.findUnique({ where: { id } });
    res.json(item);
    return;
  }

  if (req.method === "PUT") {
    const data = req.body;
    const updated = await prisma.storyEvent.update({ where: { id }, data });
    res.json(updated);
    return;
  }

  if (req.method === "DELETE") {
    await prisma.storyEvent.delete({ where: { id } });
    res.status(204).end();
    return;
  }

  res.status(405).end();
}
