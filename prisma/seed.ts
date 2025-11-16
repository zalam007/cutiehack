const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const world = await prisma.world.create({
    data: {
      name: 'Aurelia',
      summary: 'A high-fantasy world with fractured kingdoms and fading magic.'
    }
  })

  const char1 = await prisma.character.create({
    data: {
      worldId: world.id,
      name: 'Elys Varn',
      role: 'Wandering scholar',
      description: 'A gaunt, quick-eyed historian who seeks lost lore.',
      personality: 'Curious, secretive',
      backstory: 'Left the academy after a scandal involving forbidden texts.',
      tags: 'scholar,secretive'
    }
  })

  const char2 = await prisma.character.create({
    data: {
      worldId: world.id,
      name: 'Serra Koth',
      role: 'Captain of the Sunwatch',
      description: 'A veteran soldier with a stern countenance.',
      personality: 'Stoic, loyal',
      backstory: 'Rose through the ranks during border skirmishes.',
      tags: 'soldier'
    }
  })

  await prisma.location.create({
    data: { worldId: world.id, name: 'Highmere', type: 'City', description: 'The capital city of Aurelia.' }
  })

  await prisma.location.create({
    data: { worldId: world.id, name: 'Ebonreach', type: 'Fortress', description: 'A grim fortress at the edge of the wastes.' }
  })

  await prisma.magic.create({
    data: {
      worldId: world.id,
      title: 'Leybinding',
      overview: 'A ritual-based discipline that draws on ley lines.',
      rules: 'Requires anchors and long preparation.',
      limitations: 'Risk of backlash near corrupted nodes.',
      costs: 'Physical exhaustion and memory loss.'
    }
  })

  console.log('Seed complete')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
