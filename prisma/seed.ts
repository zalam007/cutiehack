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
      age: '32',
      description: 'A gaunt, quick-eyed historian who seeks lost lore.',
      personality: 'Curious, secretive',
      backstory: 'Left the academy after a scandal involving forbidden texts.',
      strengths: 'Extensive knowledge of ancient texts, skilled researcher',
      weaknesses: 'Physically weak, paranoid',
      tags: 'scholar,secretive'
    }
  })

  const char2 = await prisma.character.create({
    data: {
      worldId: world.id,
      name: 'Serra Koth',
      role: 'Captain of the Sunwatch',
      age: '28',
      description: 'A veteran soldier with a stern countenance.',
      personality: 'Stoic, loyal',
      backstory: 'Rose through the ranks during border skirmishes.',
      strengths: 'Expert swordsmanship, tactical mind',
      weaknesses: 'Struggles with emotions, stubborn',
      tags: 'soldier'
    }
  })

  await prisma.location.create({
    data: { worldId: world.id, name: 'Highmere', type: 'City', description: 'The capital city of Aurelia.', population: '50,000', climate: 'Temperate' }
  })

  await prisma.location.create({
    data: { worldId: world.id, name: 'Ebonreach', type: 'Fortress', description: 'A grim fortress at the edge of the wastes.', population: '500 soldiers', climate: 'Harsh, cold' }
  })

  await prisma.magic.create({
    data: {
      worldId: world.id,
      name: 'Leybinding',
      category: 'Ritual',
      description: 'A ritual-based discipline that draws on ley lines.',
      rules: 'Requires anchors and long preparation.',
      limitations: 'Risk of backlash near corrupted nodes.',
      costs: 'Physical exhaustion and memory loss.',
      examples: 'Creating barriers, sensing magical disturbances'
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
