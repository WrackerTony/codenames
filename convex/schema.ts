import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    username: v.string(),
    points: v.number(), // Points earned from games
    gamesWon: v.number(),
    gamesLost: v.number(),
    createdAt: v.number(),
    lastLoginAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_username", ["username"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  friendRequests: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
    createdAt: v.number(),
  })
    .index("by_receiver", ["receiverId", "status"])
    .index("by_sender", ["senderId", "status"])
    .index("by_users", ["senderId", "receiverId"]),

  friends: defineTable({
    userId1: v.id("users"),
    userId2: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_user1", ["userId1"])
    .index("by_user2", ["userId2"]),

  rooms: defineTable({
    code: v.string(), // 4-6 character room code
    isPublic: v.boolean(), // true for public matchmaking
    language: v.union(
      v.literal("en"),
      v.literal("cs"),
      v.literal("es"),
      v.literal("fr"),
      v.literal("de")
    ),
    hostId: v.string(), // player ID of the host
    status: v.union(
      v.literal("waiting"), // In lobby
      v.literal("playing"), // Game in progress
      v.literal("finished") // Game ended
    ),
    createdAt: v.number(),
    startedAt: v.optional(v.number()),
  })
    .index("by_code", ["code"])
    .index("by_status", ["status"])
    .index("by_public_status", ["isPublic", "status"])
    .index("by_language_public_status", ["language", "isPublic", "status"]),

  players: defineTable({
    roomId: v.id("rooms"),
    playerId: v.string(), // Unique player identifier
    userId: v.optional(v.id("users")), // Link to registered user
    name: v.string(),
    team: v.optional(
      v.union(v.literal("red"), v.literal("blue"), v.literal("spectator"))
    ),
    role: v.optional(
      v.union(v.literal("spymaster"), v.literal("operative"))
    ),
    isConnected: v.boolean(),
    lastSeen: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_and_team", ["roomId", "team"])
    .index("by_player_id", ["playerId"])
    .index("by_user", ["userId"]),

  games: defineTable({
    roomId: v.id("rooms"),
    board: v.array(
      v.object({
        word: v.string(),
        color: v.union(
          v.literal("red"),
          v.literal("blue"),
          v.literal("neutral"),
          v.literal("assassin")
        ),
        revealed: v.boolean(),
        revealedBy: v.optional(v.string()), // player ID
      })
    ),
    currentTurn: v.union(v.literal("red"), v.literal("blue")),
    startingTeam: v.union(v.literal("red"), v.literal("blue")),
    currentClue: v.optional(
      v.object({
        word: v.string(),
        number: v.number(),
        givenBy: v.string(), // player ID
      })
    ),
    guessesRemaining: v.number(),
    redRemaining: v.number(),
    blueRemaining: v.number(),
    winner: v.optional(
      v.union(v.literal("red"), v.literal("blue"), v.literal("assassin"))
    ),
    clueHistory: v.array(
      v.object({
        team: v.union(v.literal("red"), v.literal("blue")),
        word: v.string(),
        number: v.number(),
        givenBy: v.string(),
        timestamp: v.number(),
      })
    ),
  }).index("by_room", ["roomId"]),

  messages: defineTable({
    roomId: v.id("rooms"),
    playerId: v.string(),
    playerName: v.string(),
    message: v.string(),
    timestamp: v.number(),
  }).index("by_room", ["roomId"]),
});
