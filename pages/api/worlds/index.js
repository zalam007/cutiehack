import prisma from '../../../lib/prisma'

export default async function handler(req, res){
  if (req.method === 'GET'){
    const worlds = await prisma.world.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(worlds)
    return
  }

  if (req.method === 'POST'){
    const { name, summary } = req.body
    const w = await prisma.world.create({ data: { name, summary } })
    res.status(201).json(w)
    return
  }

  res.status(405).end()
}
