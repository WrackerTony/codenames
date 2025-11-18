import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Send friend request
export const sendFriendRequest = mutation({
  args: {
    token: v.string(),
    receiverUsername: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify sender's session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Invalid or expired session");
    }

    const sender = await ctx.db.get(session.userId);
    if (!sender) {
      throw new Error("User not found");
    }

    // Find receiver
    const receiver = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.receiverUsername))
      .first();

    if (!receiver) {
      throw new Error("User not found");
    }

    if (sender._id === receiver._id) {
      throw new Error("Cannot send friend request to yourself");
    }

    // Check if already friends
    const existingFriendship = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("userId1", sender._id))
      .filter((q) => q.eq(q.field("userId2"), receiver._id))
      .first();

    const existingFriendship2 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("userId1", receiver._id))
      .filter((q) => q.eq(q.field("userId2"), sender._id))
      .first();

    if (existingFriendship || existingFriendship2) {
      throw new Error("Already friends");
    }

    // Check if request already exists
    const existingRequest = await ctx.db
      .query("friendRequests")
      .withIndex("by_users", (q) =>
        q.eq("senderId", sender._id).eq("receiverId", receiver._id)
      )
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();

    const existingRequest2 = await ctx.db
      .query("friendRequests")
      .withIndex("by_users", (q) =>
        q.eq("senderId", receiver._id).eq("receiverId", sender._id)
      )
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();

    if (existingRequest) {
      throw new Error("Friend request already sent");
    }

    if (existingRequest2) {
      throw new Error("This user has already sent you a friend request");
    }

    // Create friend request
    await ctx.db.insert("friendRequests", {
      senderId: sender._id,
      receiverId: receiver._id,
      status: "pending",
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Accept friend request
export const acceptFriendRequest = mutation({
  args: {
    token: v.string(),
    requestId: v.id("friendRequests"),
  },
  handler: async (ctx, args) => {
    // Verify user's session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Invalid or expired session");
    }

    // Get friend request
    const request = await ctx.db.get(args.requestId);

    if (!request) {
      throw new Error("Friend request not found");
    }

    if (request.receiverId !== session.userId) {
      throw new Error("Unauthorized");
    }

    if (request.status !== "pending") {
      throw new Error("Friend request already processed");
    }

    // Update request status
    await ctx.db.patch(args.requestId, {
      status: "accepted",
    });

    // Create friendship
    await ctx.db.insert("friends", {
      userId1: request.senderId,
      userId2: request.receiverId,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Reject friend request
export const rejectFriendRequest = mutation({
  args: {
    token: v.string(),
    requestId: v.id("friendRequests"),
  },
  handler: async (ctx, args) => {
    // Verify user's session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Invalid or expired session");
    }

    // Get friend request
    const request = await ctx.db.get(args.requestId);

    if (!request) {
      throw new Error("Friend request not found");
    }

    if (request.receiverId !== session.userId) {
      throw new Error("Unauthorized");
    }

    if (request.status !== "pending") {
      throw new Error("Friend request already processed");
    }

    // Update request status
    await ctx.db.patch(args.requestId, {
      status: "rejected",
    });

    return { success: true };
  },
});

// Remove friend
export const removeFriend = mutation({
  args: {
    token: v.string(),
    friendId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Verify user's session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Invalid or expired session");
    }

    // Find friendship
    const friendship1 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("userId1", session.userId))
      .filter((q) => q.eq(q.field("userId2"), args.friendId))
      .first();

    const friendship2 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("userId1", args.friendId))
      .filter((q) => q.eq(q.field("userId2"), session.userId))
      .first();

    const friendship = friendship1 || friendship2;

    if (!friendship) {
      throw new Error("Friendship not found");
    }

    await ctx.db.delete(friendship._id);

    return { success: true };
  },
});

// Get pending friend requests
export const getPendingRequests = query({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.token) {
      return [];
    }

    // Verify user's session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token!))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return [];
    }

    // Get pending requests
    const requests = await ctx.db
      .query("friendRequests")
      .withIndex("by_receiver", (q) =>
        q.eq("receiverId", session.userId).eq("status", "pending")
      )
      .collect();

    // Get sender info for each request
    const requestsWithSenders = await Promise.all(
      requests.map(async (request) => {
        const sender = await ctx.db.get(request.senderId);
        return {
          requestId: request._id,
          senderUsername: sender?.username || "Unknown",
          senderId: request.senderId,
          createdAt: request.createdAt,
        };
      })
    );

    return requestsWithSenders;
  },
});

// Get friends list
export const getFriends = query({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.token) {
      return [];
    }

    // Verify user's session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token!))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return [];
    }

    // Get friendships where user is userId1
    const friendships1 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("userId1", session.userId))
      .collect();

    // Get friendships where user is userId2
    const friendships2 = await ctx.db
      .query("friends")
      .withIndex("by_user2", (q) => q.eq("userId2", session.userId))
      .collect();

    // Get friend IDs
    const friendIds = [
      ...friendships1.map((f) => f.userId2),
      ...friendships2.map((f) => f.userId1),
    ];

    // Get friend details
    const friends = await Promise.all(
      friendIds.map(async (friendId) => {
        const friend = await ctx.db.get(friendId);
        return friend
          ? {
              userId: friend._id,
              username: friend.username,
              points: friend.points,
              gamesWon: friend.gamesWon,
              gamesLost: friend.gamesLost,
            }
          : null;
      })
    );

    return friends.filter((f) => f !== null);
  },
});
