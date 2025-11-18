import { internalMutation } from "./_generated/server";

// Delete all data and reset the database
export const resetDatabase = internalMutation({
  handler: async (ctx) => {
    // Delete all messages
    const messages = await ctx.db.query("messages").collect();
    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
    
    // Delete all games
    const games = await ctx.db.query("games").collect();
    for (const game of games) {
      await ctx.db.delete(game._id);
    }
    
    // Delete all players
    const players = await ctx.db.query("players").collect();
    for (const player of players) {
      await ctx.db.delete(player._id);
    }
    
    // Delete all rooms
    const rooms = await ctx.db.query("rooms").collect();
    for (const room of rooms) {
      await ctx.db.delete(room._id);
    }
    
    return {
      message: "Database reset complete",
      deleted: {
        messages: messages.length,
        games: games.length,
        players: players.length,
        rooms: rooms.length,
      }
    };
  },
});
