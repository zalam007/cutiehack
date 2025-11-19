import prisma from "./prisma";

/**
 * Verify that a user owns a world
 * @param {string} userId 
 * @param {number} worldId 
 * @returns {Promise<boolean>}
 */
export async function verifyWorldOwnership(userId, worldId) {
  const world = await prisma.world.findUnique({
    where: { id: worldId },
    select: { userId: true },
  });

  if (!world || world.userId !== userId) {
    return false;
  }

  return true;
}

/**
 * Check entity count limit for a world (max 10 per type)
 * @param {string} entityType - 'character', 'location', 'magic', 'faction', 'storyEvent'
 * @param {number} worldId 
 * @returns {Promise<boolean>} true if under limit, false if at limit
 */
export async function checkEntityLimit(entityType, worldId) {
  const modelName = entityType.charAt(0).toUpperCase() + entityType.slice(1);
  
  const count = await prisma[entityType].count({
    where: { worldId },
  });

  return count < 10;
}
