import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { generateBoard } from "./wordBank";

// Generate a random room code
function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Avoid confusing characters
  const length = Math.floor(Math.random() * 3) + 4; // 4-6 characters
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a new room
export const createRoom = mutation({
  args: {
    isPublic: v.boolean(),
    playerName: v.string(),
    language: v.union(
      v.literal("en"),
      v.literal("cs"),
      v.literal("es"),
      v.literal("fr"),
      v.literal("de")
    ),
  },
  handler: async (ctx, args) => {
    let code = generateRoomCode();
    
    // Ensure unique code
    let existing = await ctx.db
      .query("rooms")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();
    
    while (existing) {
      code = generateRoomCode();
      existing = await ctx.db
        .query("rooms")
        .withIndex("by_code", (q) => q.eq("code", code))
        .first();
    }
    
    const playerId = crypto.randomUUID();
    
    const roomId = await ctx.db.insert("rooms", {
      code,
      isPublic: args.isPublic,
      language: args.language,
      hostId: playerId,
      status: "waiting",
      createdAt: Date.now(),
    });
    
    await ctx.db.insert("players", {
      roomId,
      playerId,
      name: args.playerName,
      isConnected: true,
      lastSeen: Date.now(),
    });
    
    return { roomId, code, playerId };
  },
});

// Join an existing room by code
export const joinRoomByCode = mutation({
  args: {
    code: v.string(),
    playerName: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();
    
    if (!room) {
      throw new Error("Room not found");
    }
    
    if (room.status !== "waiting") {
      throw new Error("Game already in progress");
    }
    
    const playerId = crypto.randomUUID();
    
    await ctx.db.insert("players", {
      roomId: room._id,
      playerId,
      name: args.playerName,
      isConnected: true,
      lastSeen: Date.now(),
    });
    
    return { roomId: room._id, playerId };
  },
});

// Join a public room (matchmaking)
export const joinPublicRoom = mutation({
  args: {
    playerName: v.string(),
    language: v.union(
      v.literal("en"),
      v.literal("cs"),
      v.literal("es"),
      v.literal("fr"),
      v.literal("de")
    ),
  },
  handler: async (ctx, args) => {
    // Find a public room that's waiting with the same language
    const rooms = await ctx.db
      .query("rooms")
      .withIndex("by_language_public_status", (q) => 
        q.eq("language", args.language).eq("isPublic", true).eq("status", "waiting")
      )
      .collect();
    
    // Filter rooms that have less than 8 players
    let availableRoom = null;
    for (const room of rooms) {
      const playerCount = await ctx.db
        .query("players")
        .withIndex("by_room", (q) => q.eq("roomId", room._id))
        .collect();
      
      if (playerCount.length < 8) {
        availableRoom = room;
        break;
      }
    }
    
    // Create a new public room if none available
    if (!availableRoom) {
      let code = generateRoomCode();
      let existing = await ctx.db
        .query("rooms")
        .withIndex("by_code", (q) => q.eq("code", code))
        .first();
      
      while (existing) {
        code = generateRoomCode();
        existing = await ctx.db
          .query("rooms")
          .withIndex("by_code", (q) => q.eq("code", code))
          .first();
      }
      
      const playerId = crypto.randomUUID();
      
      const roomId = await ctx.db.insert("rooms", {
        code,
        isPublic: true,
        language: args.language,
        hostId: playerId,
        status: "waiting",
        createdAt: Date.now(),
      });
      
      await ctx.db.insert("players", {
        roomId,
        playerId,
        name: args.playerName,
        isConnected: true,
        lastSeen: Date.now(),
      });
      
      return { roomId, playerId };
    }
    
    const playerId = crypto.randomUUID();
    
    await ctx.db.insert("players", {
      roomId: availableRoom._id,
      playerId,
      name: args.playerName,
      isConnected: true,
      lastSeen: Date.now(),
    });
    
    return { roomId: availableRoom._id, playerId };
  },
});

// Get room details
export const getRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) return null;
    
    const players = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
    
    const game = await ctx.db
      .query("games")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .first();
    
    return { room, players, game };
  },
});

// Get public rooms for lobby list
export const getPublicRooms = query({
  args: {
    language: v.union(
      v.literal("en"),
      v.literal("cs"),
      v.literal("es"),
      v.literal("fr"),
      v.literal("de")
    ),
  },
  handler: async (ctx, args) => {
    const rooms = await ctx.db
      .query("rooms")
      .withIndex("by_language_public_status", (q) => 
        q.eq("language", args.language).eq("isPublic", true).eq("status", "waiting")
      )
      .collect();
    
    // Get player count for each room
    const roomsWithPlayers = await Promise.all(
      rooms.map(async (room) => {
        const players = await ctx.db
          .query("players")
          .withIndex("by_room", (q) => q.eq("roomId", room._id))
          .collect();
        
        return {
          _id: room._id,
          code: room.code,
          playerCount: players.length,
          createdAt: room.createdAt,
        };
      })
    );
    
    // Filter out full rooms and sort by creation time
    return roomsWithPlayers
      .filter(room => room.playerCount < 8)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Update player team and role
export const updatePlayerTeamRole = mutation({
  args: {
    playerId: v.string(),
    roomId: v.id("rooms"),
    team: v.optional(v.union(v.literal("red"), v.literal("blue"), v.literal("spectator"))),
    role: v.optional(v.union(v.literal("spymaster"), v.literal("operative"))),
  },
  handler: async (ctx, args) => {
    const players = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
    
    const player = players.find(p => p.playerId === args.playerId);
    
    if (!player) {
      throw new Error("Player not found");
    }
    
    // If changing to spymaster, ensure no other spymaster on the same team
    if (args.role === "spymaster" && args.team && args.team !== "spectator") {
      const existingSpymaster = players.find(
        p => p.team === args.team && p.role === "spymaster" && p._id !== player._id
      );
      
      if (existingSpymaster) {
        throw new Error("Team already has a spymaster");
      }
    }
    
    await ctx.db.patch(player._id, {
      team: args.team,
      role: args.role,
    });
  },
});

// Start the game
export const startGame = mutation({
  args: {
    roomId: v.id("rooms"),
    playerId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");
    
    // Verify player is host (for private rooms)
    if (!room.isPublic && room.hostId !== args.playerId) {
      throw new Error("Only host can start the game");
    }
    
    // Check if there are enough players
    const players = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
    
    const redTeam = players.filter(p => p.team === "red");
    const blueTeam = players.filter(p => p.team === "blue");
    
    if (redTeam.length < 2 || blueTeam.length < 2) {
      throw new Error("Both teams need at least 2 players (minimum 4 players total)");
    }
    
    const redSpymaster = redTeam.find(p => p.role === "spymaster");
    const blueSpymaster = blueTeam.find(p => p.role === "spymaster");
    
    if (!redSpymaster || !blueSpymaster) {
      throw new Error("Both teams need a spymaster");
    }
    
    // Generate game board with room's language
    const { board, startingTeam, redCount, blueCount } = generateBoard(room.language);
    
    await ctx.db.insert("games", {
      roomId: args.roomId,
      board,
      currentTurn: startingTeam,
      startingTeam,
      guessesRemaining: 0,
      redRemaining: redCount,
      blueRemaining: blueCount,
      clueHistory: [],
    });
    
    await ctx.db.patch(args.roomId, {
      status: "playing",
      startedAt: Date.now(),
    });
  },
});
