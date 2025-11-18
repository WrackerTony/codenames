import { internalMutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Migration to delete all rooms without language field
export const deleteRoomsWithoutLanguage = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allRooms = await ctx.db.query("rooms").collect() as any[];
    let deletedCount = 0;
    
    for (const room of allRooms) {
      // Delete room if it doesn't have language field
      if (!("language" in room)) {
        // Delete associated players
        const players = await ctx.db
          .query("players")
          .withIndex("by_room", (q) => q.eq("roomId", room._id))
          .collect();
        
        for (const player of players) {
          await ctx.db.delete(player._id);
        }
        
        // Delete associated games
        const games = await ctx.db
          .query("games")
          .withIndex("by_room", (q) => q.eq("roomId", room._id))
          .collect();
        
        for (const game of games) {
          await ctx.db.delete(game._id);
        }
        
        // Delete associated chat messages
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_room", (q) => q.eq("roomId", room._id))
          .collect();
        
        for (const message of messages) {
          await ctx.db.delete(message._id);
        }
        
        // Delete the room
        await ctx.db.delete(room._id);
        deletedCount++;
      }
    }
    
    return { deletedCount };
  },
});
