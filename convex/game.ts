import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Give a clue as spymaster
export const giveClue = mutation({
  args: {
    roomId: v.id("rooms"),
    playerId: v.string(),
    word: v.string(),
    number: v.number(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db
      .query("games")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .first();
    
    if (!game) throw new Error("Game not found");
    if (game.winner) throw new Error("Game is over");
    
    // Find the player
    const players = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
    
    const player = players.find(p => p.playerId === args.playerId);
    if (!player) throw new Error("Player not found");
    
    // Verify player is the spymaster of the current team
    if (player.team !== game.currentTurn) {
      throw new Error("Not your turn");
    }
    
    if (player.role !== "spymaster") {
      throw new Error("Only spymaster can give clues");
    }
    
    if (game.currentClue && game.guessesRemaining > 0) {
      throw new Error("Team is still guessing");
    }
    
    // Validate clue
    if (!args.word || args.word.trim().length === 0) {
      throw new Error("Clue word cannot be empty");
    }
    
    // Allow 0-9 for normal clues, 99 for infinite (∞)
    if (args.number < 0 || (args.number > 9 && args.number !== 99)) {
      throw new Error("Clue number must be 0-9 or ∞ (infinite)");
    }
    
    const clue = {
      word: args.word.toUpperCase(),
      number: args.number,
      givenBy: args.playerId,
    };
    
    // For 0: unlimited guesses (but operatives cannot pick words related to the clue)
    // For 99 (∞): unlimited guesses
    // For normal numbers: number + 1 guesses
    const guessesRemaining = (args.number === 0 || args.number === 99) 
      ? 999 // Effectively unlimited
      : args.number + 1;
    
    await ctx.db.patch(game._id, {
      currentClue: clue,
      guessesRemaining: guessesRemaining,
      clueHistory: [
        ...game.clueHistory,
        {
          ...clue,
          team: game.currentTurn,
          timestamp: Date.now(),
        },
      ],
    });
  },
});

// Make a guess as operative
export const makeGuess = mutation({
  args: {
    roomId: v.id("rooms"),
    playerId: v.string(),
    wordIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db
      .query("games")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .first();
    
    if (!game) throw new Error("Game not found");
    if (game.winner) throw new Error("Game is over");
    
    // Find the player
    const players = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
    
    const player = players.find(p => p.playerId === args.playerId);
    if (!player) throw new Error("Player not found");
    
    // Verify player is on the current team
    if (player.team !== game.currentTurn) {
      throw new Error("Not your turn");
    }
    
    // Verify there's a clue and guesses remaining
    if (!game.currentClue) {
      throw new Error("Waiting for spymaster to give a clue");
    }
    
    if (game.guessesRemaining <= 0) {
      throw new Error("No guesses remaining");
    }
    
    // Verify word hasn't been revealed
    const word = game.board[args.wordIndex];
    if (!word) throw new Error("Invalid word index");
    if (word.revealed) throw new Error("Word already revealed");
    
    // Reveal the word
    const newBoard = [...game.board];
    newBoard[args.wordIndex] = {
      ...word,
      revealed: true,
      revealedBy: args.playerId,
    };
    
    const wordColor = word.color;
    let newGuessesRemaining = game.guessesRemaining - 1;
    let newTurn = game.currentTurn;
    let winner: "red" | "blue" | "assassin" | undefined = game.winner;
    let redRemaining = game.redRemaining;
    let blueRemaining = game.blueRemaining;
    
    // Update remaining counts
    if (wordColor === "red") {
      redRemaining--;
    } else if (wordColor === "blue") {
      blueRemaining--;
    }
    
    // Check for assassin
    if (wordColor === "assassin") {
      winner = (game.currentTurn === "red" ? "blue" : "red") as "red" | "blue";
      newGuessesRemaining = 0;
    }
    // Check for win condition
    else if (redRemaining === 0) {
      winner = "red";
    } else if (blueRemaining === 0) {
      winner = "blue";
    }
    // Wrong guess - end turn
    else if (wordColor !== game.currentTurn) {
      newTurn = game.currentTurn === "red" ? "blue" : "red";
      newGuessesRemaining = 0;
    }
    // Correct guess but no more guesses - end turn
    else if (newGuessesRemaining === 0) {
      newTurn = game.currentTurn === "red" ? "blue" : "red";
    }
    
    await ctx.db.patch(game._id, {
      board: newBoard,
      guessesRemaining: newGuessesRemaining,
      currentTurn: newTurn,
      redRemaining,
      blueRemaining,
      winner,
      currentClue: newGuessesRemaining === 0 ? undefined : game.currentClue,
    });
    
    // Update room status and award points if game is over
    if (winner) {
      await ctx.db.patch(args.roomId, {
        status: "finished",
      });

      // Award points to winning team's registered users
      const players = await ctx.db
        .query("players")
        .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
        .collect();

      for (const player of players) {
        if (player.userId) {
          const user = await ctx.db.get(player.userId);
          if (user) {
            if (player.team === winner) {
              // Winner gets 10 points
              await ctx.db.patch(player.userId, {
                points: user.points + 10,
                gamesWon: user.gamesWon + 1,
              });
            } else if (player.team && player.team !== "spectator") {
              // Loser gets 3 points for participation
              await ctx.db.patch(player.userId, {
                points: user.points + 3,
                gamesLost: user.gamesLost + 1,
              });
            }
          }
        }
      }
    }
  },
});

// End turn early
export const endTurn = mutation({
  args: {
    roomId: v.id("rooms"),
    playerId: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db
      .query("games")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .first();
    
    if (!game) throw new Error("Game not found");
    if (game.winner) throw new Error("Game is over");
    
    const players = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
    
    const player = players.find(p => p.playerId === args.playerId);
    if (!player) throw new Error("Player not found");
    
    if (player.team !== game.currentTurn) {
      throw new Error("Not your turn");
    }
    
    const newTurn = game.currentTurn === "red" ? "blue" : "red";
    
    await ctx.db.patch(game._id, {
      currentTurn: newTurn,
      guessesRemaining: 0,
      currentClue: undefined,
    });
  },
});

// Send a chat message
export const sendMessage = mutation({
  args: {
    roomId: v.id("rooms"),
    playerId: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const players = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
    
    const player = players.find(p => p.playerId === args.playerId);
    if (!player) throw new Error("Player not found");
    
    await ctx.db.insert("messages", {
      roomId: args.roomId,
      playerId: args.playerId,
      playerName: player.name,
      message: args.message.trim(),
      timestamp: Date.now(),
    });
  },
});

// Get messages for a room
export const getMessages = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .order("desc")
      .take(100);
  },
});
