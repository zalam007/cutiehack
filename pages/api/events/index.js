import prisma from '../../../lib/prisma'

export default async function handler(req, res){
  if (req.method === 'GET'){
    const { worldId } = req.query
    const where = worldId ? { where: { worldId: Number(worldId) } } : {}
    const items = await prisma.storyEvent.findMany(where)
    res.json(items)
    return
  }

  if (req.method === 'POST'){
    const data = req.body
    const created = await prisma.storyEvent.create({ data })
    res.status(201).json(created)
    return
  }

  res.status(405).end()
}
