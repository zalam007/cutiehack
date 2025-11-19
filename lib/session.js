import { parse, serialize } from "cookie";
import { randomUUID } from "crypto";
import prisma from "./prisma";

const COOKIE_NAME = "loreforge_user_id";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

/**
 * Get or create a user session from cookies
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @returns {Promise<string>} userId
 */
export async function getOrCreateUser(req, res) {
  // Parse cookies from request
  const cookies = parse(req.headers.cookie || "");
  let userId = cookies[COOKIE_NAME];

  // If no cookie exists, create new anonymous user
  if (!userId) {
    userId = randomUUID();

    // Create user in database
    await prisma.user.create({
      data: {
        id: userId,
        createdAt: new Date(),
        lastVisited: new Date(),
      },
    });

    // Seed demo world for new user
    await seedDemoWorld(userId);

    // Set persistent cookie (1 year expiration)
    const cookie = serialize(COOKIE_NAME, userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    res.setHeader("Set-Cookie", cookie);

    return userId;
  }

  // User exists, update lastVisited timestamp
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastVisited: new Date() },
    });
  } catch (error) {
    // User cookie exists but not in database (cleaned up or DB reset)
    // Create new user with same ID
    await prisma.user.create({
      data: {
        id: userId,
        createdAt: new Date(),
        lastVisited: new Date(),
      },
    });

    // Seed demo world for returning user
    await seedDemoWorld(userId);
  }

  return userId;
}

/**
 * Create demo world for a new user
 * @param {string} userId
 */
async function seedDemoWorld(userId) {
  // Check if user already has worlds (shouldn't happen, but just in case)
  const existingWorlds = await prisma.world.count({
    where: { userId },
  });

  if (existingWorlds > 0) {
    return; // User already has worlds, don't seed
  }

  // Create Mythworld (Demo)
  const world = await prisma.world.create({
    data: {
      userId,
      name: "Mythworld (Demo)",
      summary:
        "A high-fantasy realm where ancient magic collides with political intrigue, floating islands drift through endless skies, and forgotten ruins hold the secrets of a fallen civilization.",
    },
  });

  // Create demo characters
  await prisma.character.createMany({
    data: [
      {
        worldId: world.id,
        name: "Elara Vane",
        role: "Runecrafter & Scholar",
        age: "32",
        description:
          "A brilliant runecrafter with silver-streaked auburn hair and ink-stained fingers, known for deciphering lost magical texts.",
        personality: "Curious, methodical, fiercely independent",
        backstory:
          "Orphaned during the Night of Falling Stars, raised by the Silver Covenant's archivists.",
        strengths: "Ancient language expertise, rune magic, problem-solving",
        weaknesses: "Reckless when pursuing knowledge, distrusts authority",
      },
      {
        worldId: world.id,
        name: "Kaelen Gorok",
        role: "Exiled Warlord",
        age: "45",
        description:
          "A towering orc with ritual scars and a notched greatsword, seeking redemption for past atrocities.",
        personality: "Stoic, honorable, haunted by guilt",
        backstory:
          "Former commander of the Ashen Horde, turned against his own people to stop a genocide.",
        strengths: "Combat mastery, tactical genius, intimidation",
        weaknesses: "Carries psychological trauma, struggles with trust",
      },
      {
        worldId: world.id,
        name: "Zephyr",
        role: "Sky-Pirate Captain",
        age: "Unknown",
        description:
          "A charismatic airship captain with wind-magic tattoos and a mysterious past.",
        personality: "Charming, opportunistic, secretly idealistic",
        backstory:
          "Found as a child in the Shattered Isles wreckage, raised by pirates, now seeks freedom for all.",
        strengths: "Wind magic, aerial combat, negotiation",
        weaknesses: "Commitment issues, gambling addiction, fear of abandonment",
      },
    ],
  });

  // Create demo locations
  await prisma.location.createMany({
    data: [
      {
        worldId: world.id,
        name: "Highmere",
        type: "Capital City",
        population: "~200,000",
        climate: "Temperate, coastal winds",
        description:
          "The floating capital of the Silver Covenant, built on a massive island suspended by ancient Leybinding anchors. Crystal spires pierce the clouds, and skyships dock at gravity-defying ports.",
        history:
          "Founded 800 years ago after the Sundering, Highmere became the center of magical academia and political power. Its levitation runes are powered by the imprisoned elemental spirits beneath the city.",
      },
      {
        worldId: world.id,
        name: "The Shattered Isles",
        type: "Archipelago Ruins",
        population: "~5,000 (scattered settlements)",
        climate: "Stormy, unpredictable",
        description:
          "A maze of broken landmasses and debris fields left from the Night of Falling Stars. Treasure hunters, outcasts, and pirates call this lawless frontier home.",
        history:
          "Once a thriving chain of sky-cities, the Isles were obliterated when an experimental Soulforging ritual backfired 200 years ago. Survivors claim the ruins are haunted by the souls of the dead.",
      },
      {
        worldId: world.id,
        name: "Ebonreach Fortress",
        type: "Military Stronghold",
        population: "~8,000 (garrison)",
        climate: "Cold, mountainous",
        description:
          "A massive obsidian fortress carved into a mountain peak, home to the Breakers' revolutionary army. Its black walls absorb magic, making it nearly impervious to magical assault.",
        history:
          "Built 50 years ago by enslaved workers, Ebonreach was seized by the Breakers during the uprising. Now it stands as a symbol of resistance against the Silver Covenant's rule.",
      },
    ],
  });

  // Create demo magic systems
  await prisma.magic.createMany({
    data: [
      {
        worldId: world.id,
        name: "Leybinding",
        category: "Elemental Magic",
        description:
          "The art of channeling raw elemental energy through ley lines—ancient rivers of magic that flow beneath the world. Practitioners can manipulate earth, fire, water, air, and lightning.",
        rules:
          "Requires physical contact with a ley node or conductive material (crystal, metal, water). Power scales with proximity to ley lines.",
        limitations:
          "Overuse causes 'ley sickness' (fever, hallucinations, magical burnout). Ley lines can be depleted or corrupted.",
        costs:
          "Physical exhaustion, risk of elemental backlash if control is lost.",
        examples:
          "Levitating cities with earth-binding, summoning storms with air-binding, creating volcanic eruptions with fire-binding.",
      },
      {
        worldId: world.id,
        name: "Soulforging",
        category: "Soul Magic (Forbidden)",
        description:
          "The dangerous practice of binding souls—either one's own or another's—into objects, constructs, or even living bodies. Grants immense power but at horrific ethical and magical cost.",
        rules:
          "Requires a living sacrifice (voluntary or not) and a vessel. The soul retains fragmented memories and personality.",
        limitations:
          "Illegal under Silver Covenant law. Prolonged use erodes the caster's humanity. Soulforged constructs can go rogue.",
        costs:
          "Moral corruption, risk of soul fragmentation, societal exile.",
        examples:
          "Creating sentient weapons, transferring consciousness into golems, resurrecting the dead as hollow puppets.",
      },
    ],
  });

  // Create demo factions
  await prisma.faction.createMany({
    data: [
      {
        worldId: world.id,
        name: "The Silver Covenant",
        type: "Ruling Oligarchy",
        leader: "High Arcanist Seraphine Vael",
        description:
          "The dominant political and magical authority in Mythworld, ruling from Highmere. Comprised of noble houses, archmages, and merchant guilds.",
        goals:
          "Maintain magical supremacy, preserve the status quo, expand trade networks.",
        conflicts:
          "Faces rebellion from the Breakers, ethical scrutiny over Soulforging ban enforcement, internal power struggles.",
      },
      {
        worldId: world.id,
        name: "The Ashen Circle",
        type: "Secret Society",
        leader: "Unknown (rumored to be 'The Ember')",
        description:
          "A shadowy cabal of rogue mages obsessed with uncovering pre-Sundering magical knowledge. Operates in the Shattered Isles and underground networks.",
        goals:
          "Rediscover lost Soulforging techniques, challenge the Covenant's magical monopoly.",
        conflicts:
          "Hunted by Covenant inquisitors, internal disagreements over ethics, competition with pirates for ruin access.",
      },
      {
        worldId: world.id,
        name: "The Breakers",
        type: "Revolutionary Army",
        leader: "General Thorne Ironfist",
        description:
          "A militant faction of former slaves, laborers, and disenfranchised citizens seeking to overthrow the Silver Covenant. Based in Ebonreach Fortress.",
        goals:
          "Abolish magical slavery, redistribute wealth, establish democratic rule.",
        conflicts:
          "Outmatched militarily by the Covenant, accused of terrorism, struggles with internal radicalization.",
      },
    ],
  });

  // Create demo story events
  await prisma.storyEvent.createMany({
    data: [
      {
        worldId: world.id,
        title: "The Night of Falling Stars",
        date: "200 years ago",
        description:
          "A catastrophic magical disaster where dozens of floating islands lost their levitation magic and plummeted from the sky, killing hundreds of thousands.",
        location: "The Shattered Isles (formerly known as the Starlight Archipelago)",
        charactersInvolved: "Unknown (predates current characters)",
        outcome:
          "Created the Shattered Isles, led to the ban on experimental Soulforging, and sparked the rise of the Silver Covenant's strict magical regulation.",
      },
      {
        worldId: world.id,
        title: "The Highmere Accord",
        date: "50 years ago",
        description:
          "A peace treaty signed between the Silver Covenant and the newly-formed Breakers after a brutal 5-year civil war.",
        location: "Highmere, Hall of Echoes",
        charactersInvolved:
          "High Arcanist Seraphine Vael, General Thorne Ironfist (represented Breakers)",
        outcome:
          "Temporary ceasefire established, but tensions remain high. Breakers gained autonomy over Ebonreach Fortress.",
      },
      {
        worldId: world.id,
        title: "The Ebonreach Breach",
        date: "3 months ago",
        description:
          "A mysterious explosion ripped through Ebonreach Fortress's western wall, killing 300 soldiers. Both sides accuse each other of sabotage.",
        location: "Ebonreach Fortress",
        charactersInvolved:
          "Kaelen Gorok (investigating), Elara Vane (hired to analyze magical residue)",
        outcome:
          "Investigation ongoing. Evidence suggests neither side was responsible—possibly the work of the Ashen Circle.",
      },
    ],
  });
}

/**
 * Clean up users who haven't visited in 7+ days
 * Should be called periodically (e.g., via cron job or API endpoint)
 */
export async function cleanupInactiveUsers() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const result = await prisma.user.deleteMany({
    where: {
      lastVisited: {
        lt: sevenDaysAgo,
      },
    },
  });

  return result.count; // Number of users deleted
}
