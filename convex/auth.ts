import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import bcrypt from "bcryptjs";
import { Id } from "./_generated/dataModel";

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to generate session token
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Register new user
export const register = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate email format
    if (!isValidEmail(args.email)) {
      throw new Error("Invalid email format");
    }

    // Validate password strength
    if (args.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Validate username
    if (args.username.length < 3) {
      throw new Error("Username must be at least 3 characters long");
    }

    if (args.username.length > 20) {
      throw new Error("Username must be at most 20 characters long");
    }

    // Check if email already exists
    const existingEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existingEmail) {
      throw new Error("Email already registered");
    }

    // Check if username already exists (case-insensitive)
    const normalizedUsername = args.username.toLowerCase();
    const allUsers = await ctx.db.query("users").collect();
    const existingUsername = allUsers.find(
      (u) => u.username.toLowerCase() === normalizedUsername
    );

    if (existingUsername) {
      throw new Error("Username already taken");
    }

    // Hash password synchronously (bcrypt.hashSync doesn't use setTimeout)
    const passwordHash = bcrypt.hashSync(args.password, 10);

    // Create user
    const userId = await ctx.db.insert("users", {
      email: args.email.toLowerCase(),
      passwordHash,
      username: args.username,
      points: 0,
      gamesWon: 0,
      gamesLost: 0,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    });

    // Create session
    const token = generateToken();
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    await ctx.db.insert("sessions", {
      userId,
      token,
      createdAt: Date.now(),
      expiresAt,
    });

    return {
      userId,
      username: args.username,
      token,
    };
  },
});

// Login user
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password synchronously
    const isValid = bcrypt.compareSync(args.password, user.passwordHash);

    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    // Update last login
    await ctx.db.patch(user._id, {
      lastLoginAt: Date.now(),
    });

    // Create session
    const token = generateToken();
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      createdAt: Date.now(),
      expiresAt,
    });

    return {
      userId: user._id,
      username: user.username,
      token,
    };
  },
});

// Verify session and get user
export const getCurrentUser = query({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.token) {
      return null;
    }

    // Find session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token!))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    // Get user
    const user = await ctx.db.get(session.userId);

    if (!user) {
      return null;
    }

    return {
      userId: user._id,
      email: user.email,
      username: user.username,
      points: user.points,
      gamesWon: user.gamesWon,
      gamesLost: user.gamesLost,
    };
  },
});

// Logout user
export const logout = mutation({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.token) {
      return;
    }

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token!))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});

// Get user profile by username
export const getUserProfile = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (!user) {
      return null;
    }

    return {
      username: user.username,
      points: user.points,
      gamesWon: user.gamesWon,
      gamesLost: user.gamesLost,
      createdAt: user.createdAt,
    };
  },
});

// Search users by username
export const searchUsers = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.searchTerm.length < 2) {
      return [];
    }

    const allUsers = await ctx.db.query("users").collect();
    
    return allUsers
      .filter((user) =>
        user.username.toLowerCase().includes(args.searchTerm.toLowerCase())
      )
      .slice(0, 10)
      .map((user) => ({
        userId: user._id,
        username: user.username,
        points: user.points,
      }));
  },
});
