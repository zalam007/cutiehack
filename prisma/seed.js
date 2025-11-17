const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Check if demo world already exists
  const existing = await prisma.world.findFirst({
    where: { name: 'Mythworld (Demo)' }
  })

  if (existing) {
    console.log('Demo world already exists, skipping seed.')
    return
  }

  // Create demo world
  const world = await prisma.world.create({
    data: {
      name: 'Mythworld (Demo)',
      summary: 'A high-fantasy realm where ancient magic collides with political intrigue. Explore floating sky-islands, forgotten ruins, and warring factions in this demo world.'
    }
  })

  // Characters
  await prisma.character.create({
    data: {
      worldId: world.id,
      name: 'Elara Vane',
      role: 'Runecrafter & Cartographer',
      age: '28',
      description: 'A slender woman with ink-stained fingers and eyes that trace invisible patterns in the air. She maps forgotten ley lines across the wildlands.',
      personality: 'Meticulous, introverted, observant',
      backstory: 'She seeks to prove her disgraced mentor\'s theories about a collapsing magical barrier by charting its shifting energies.',
      strengths: 'Encyclopedic knowledge of runes and ancient languages, exceptional navigation',
      weaknesses: 'Socially awkward, physically frail, prone to overthinking',
      tags: 'scholar,magic-user'
    }
  })

  await prisma.character.create({
    data: {
      worldId: world.id,
      name: 'Kaelen "Stonefist" Gorok',
      role: 'Exiled Mountain Guardian',
      age: '45',
      description: 'A broad-shouldered warrior of the mountain folk, his face etched with scars and his gaze heavy with regret.',
      personality: 'Stoic, honorable, burdened',
      backstory: 'Banished from his clan after failing to protect a sacred artifact, he now wanders seeking redemption.',
      strengths: 'Unmatched physical strength, unwavering loyalty, wilderness survival expert',
      weaknesses: 'Stubborn, slow to trust, haunted by past failures',
      tags: 'warrior,exile'
    }
  })

  await prisma.character.create({
    data: {
      worldId: world.id,
      name: 'Zephyr "Whisperwind"',
      role: 'Sky-Pirate Scavenger',
      age: '19',
      description: 'A nimble young adventurer with vibrant hair and a perpetually curious glint in their eyes, always hunting for treasures in the floating debris fields.',
      personality: 'Mischievous, resourceful, restless',
      backstory: 'Orphaned when a storm destroyed their parents\' airship, they now navigate the sky-islands with uncanny skill.',
      strengths: 'Exceptional agility, mechanical aptitude, unparalleled aerial navigation',
      weaknesses: 'Impulsive, lacks formal education, struggles with authority',
      tags: 'rogue,sky-pirate'
    }
  })

  // Locations
  await prisma.location.create({
    data: {
      worldId: world.id,
      name: 'Highmere',
      type: 'Capital City',
      description: 'A sprawling metropolis built into the cliffside, where noble houses plot and merchants trade exotic wares from across the realm.',
      population: '75,000',
      climate: 'Temperate, misty mornings',
      history: 'Founded 800 years ago as a trade hub, now the seat of political power.'
    }
  })

  await prisma.location.create({
    data: {
      worldId: world.id,
      name: 'The Shattered Isles',
      type: 'Sky Islands',
      description: 'Floating chunks of earth suspended by ancient magic, connected by rope bridges and airship routes. Home to sky-pirates and rare minerals.',
      population: 'Scattered settlements, ~5,000 total',
      climate: 'Harsh winds, thin air, frequent storms',
      history: 'Created during the Sundering, when a catastrophic spell tore the land apart.'
    }
  })

  await prisma.location.create({
    data: {
      worldId: world.id,
      name: 'Ebonreach Fortress',
      type: 'Military Stronghold',
      description: 'A grim black-stone fortress at the edge of the Wastes, the last defense against creatures from beyond.',
      population: '800 soldiers, 200 support staff',
      climate: 'Cold, perpetual twilight',
      history: 'Built 300 years ago after the first Waste incursion. Has never fallen.'
    }
  })

  // Magic Systems
  await prisma.magic.create({
    data: {
      worldId: world.id,
      name: 'Leybinding',
      category: 'Ritual Magic',
      description: 'A discipline that taps into ley lines - invisible streams of magical energy crisscrossing the world.',
      rules: 'Requires physical anchors, long preparation, and deep concentration. Power scales with proximity to ley line nodes.',
      limitations: 'Cannot be cast in areas devoid of ley energy. Corrupted nodes cause backlash.',
      costs: 'Physical exhaustion, temporary memory loss, accelerated aging with overuse.',
      examples: 'Barrier creation, scrying, magical detection, teleportation between nodes'
    }
  })

  await prisma.magic.create({
    data: {
      worldId: world.id,
      name: 'Soulforging',
      category: 'Blood Magic',
      description: 'A forbidden art that binds fragments of one\'s soul into objects or weapons, granting them extraordinary properties.',
      rules: 'Requires a ritual sacrifice of part of the caster\'s essence. More powerful effects demand greater sacrifice.',
      limitations: 'Each forging permanently reduces the caster\'s vitality and emotional capacity. Irreversible.',
      costs: 'Loss of memories, emotions, or physical senses. Death if pushed too far.',
      examples: 'Sentient weapons, phylacteries, emotion-eating artifacts'
    }
  })

  // Factions
  await prisma.faction.create({
    data: {
      worldId: world.id,
      name: 'The Silver Covenant',
      type: 'Noble Alliance',
      description: 'An alliance of merchant princes and noble houses seeking to maintain the status quo and their economic dominance.',
      leader: 'Lady Cassandra Velm - A shrewd diplomat with a network of spies across the realm.',
      goals: 'Preserve trade routes, prevent magical regulation, maintain noble privileges.',
      conflicts: 'Opposed by common folk movements and anti-magic factions. Internal power struggles.',
      members: '12 major houses, hundreds of affiliated merchants'
    }
  })

  await prisma.faction.create({
    data: {
      worldId: world.id,
      name: 'The Ashen Circle',
      type: 'Arcane Order',
      description: 'A secretive society of mages dedicated to preserving dangerous knowledge and preventing magical catastrophes.',
      leader: 'Grandmaster Theron Ash - An ancient lich who claims to serve the greater good.',
      goals: 'Contain rogue magic users, study forbidden spells, prevent another Sundering.',
      conflicts: 'Hunted by the church, mistrusted by governments, internal debates over ethics.',
      members: '~200 mages, scattered across hidden sanctums'
    }
  })

  await prisma.faction.create({
    data: {
      worldId: world.id,
      name: 'The Breakers',
      type: 'Revolutionary Movement',
      description: 'A growing insurgency of commoners, escaped slaves, and disillusioned soldiers fighting for equality and an end to noble tyranny.',
      leader: 'Commander Ryla Stormhand - A former soldier who lost everything to noble greed.',
      goals: 'Overthrow the aristocracy, redistribute wealth, establish democratic governance.',
      conflicts: 'Brutal crackdowns by the Silver Covenant, internal factions debating violence vs. peace.',
      members: 'Unknown, estimates range from 5,000 to 20,000 active members'
    }
  })

  // Story Events
  await prisma.storyEvent.create({
    data: {
      worldId: world.id,
      title: 'The Night of Falling Stars',
      date: 'Year 0 - The Catalyst',
      description: 'A massive meteor shower struck the world, awakening dormant ley lines and causing widespread magical anomalies. This event marks the beginning of the current age.',
      location: 'World-wide',
      charactersInvolved: 'All witnessed it; many lost loved ones.',
      outcome: 'Magic became unpredictable. New ley lines formed. Political instability followed.'
    }
  })

  await prisma.storyEvent.create({
    data: {
      worldId: world.id,
      title: 'The Highmere Accord',
      date: 'Year 15 - Recent Past',
      description: 'Noble houses signed a fragile peace treaty after decades of border wars, establishing the Silver Covenant.',
      location: 'Highmere',
      charactersInvolved: 'Lady Cassandra Velm brokered the deal.',
      outcome: 'Temporary peace, but resentment simmers. Trade flourishes, but common folk suffer.'
    }
  })

  await prisma.storyEvent.create({
    data: {
      worldId: world.id,
      title: 'The Ebonreach Breach',
      date: 'Year 18 - Current Crisis',
      description: 'Creatures from the Wastes broke through Ebonreach\'s defenses for the first time in 300 years, prompting a desperate call for reinforcements.',
      location: 'Ebonreach Fortress',
      charactersInvolved: 'Kaelen "Stonefist" Gorok answered the call, seeking redemption.',
      outcome: 'Breach sealed, but at great cost. Questions raised about weakening magical barriers.'
    }
  })

  console.log('✅ Demo world "Mythworld" created with sample data!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
