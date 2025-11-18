import { internalMutation } from "./_generated/server";

// Migration to add playerId to existing players
export const addPlayerIds = internalMutation({
  handler: async (ctx) => {
    const players = await ctx.db.query("players").collect();
    
    let updated = 0;
    for (const player of players) {
      if (!player.playerId) {
        // Generate a unique playerId for this existing player
        const playerId = crypto.randomUUID();
        await ctx.db.patch(player._id, { playerId });
        updated++;
      }
    }
    
    return { message: `Updated ${updated} players with new playerIds` };
  },
});

// Clean up old disconnected players without playerIds
export const cleanupOldPlayers = internalMutation({
  handler: async (ctx) => {
    const players = await ctx.db.query("players").collect();
    
    let deleted = 0;
    for (const player of players) {
      if (!player.playerId && !player.isConnected) {
        await ctx.db.delete(player._id);
        deleted++;
      }
    }
    
    return { message: `Deleted ${deleted} old disconnected players` };
  },
});
