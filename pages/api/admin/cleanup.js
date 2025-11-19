import { cleanupInactiveUsers } from "../../../lib/session";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Optional: Add authentication/API key check here for security
  // const { authorization } = req.headers;
  // if (authorization !== `Bearer ${process.env.CLEANUP_API_KEY}`) {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }

  try {
    const deletedCount = await cleanupInactiveUsers();
    
    res.json({
      success: true,
      message: `Cleaned up ${deletedCount} inactive user(s) (inactive for 7+ days)`,
      deletedCount,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    res.status(500).json({ error: "Cleanup failed", details: error.message });
  }
}
