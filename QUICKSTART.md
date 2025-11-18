# Quick Start Guide

## First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize Convex (IMPORTANT - Do this first!):**
   ```bash
   npx convex dev
   ```
   
   This will:
   - Prompt you to create a new Convex project or log in
   - Automatically create a `.env.local` file with your Convex URL
   - Deploy your schema and functions
   - Start the Convex dev server
   
   **Keep this terminal running!**

3. **In a NEW terminal, start the Next.js dev server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Testing the Game

### Local Multiplayer Testing

To test with multiple players on the same machine:

1. Open [http://localhost:3000](http://localhost:3000) in your main browser
2. Open [http://localhost:3000](http://localhost:3000) in an incognito/private window
3. You can also use different browsers (Chrome, Firefox, Safari, etc.)

Each window will be a separate player!

### Test Flow

1. **Player 1**: Create a private lobby with name "Alice"
   - Note the room code (e.g., "AB12CD")

2. **Player 2**: Join private lobby with name "Bob"
   - Enter the room code from Player 1

3. **In Lobby**:
   - Player 1: Join Red Team as Spymaster
   - Player 2: Join Blue Team as Spymaster
   - Player 1 (host): Click "Start Game"

4. **In Game**:
   - Red Spymaster gives a clue (e.g., "FRUIT 2")
   - Red Operatives (if any) make guesses
   - Turns alternate between teams

## Game Rules Quick Reference

### Teams
- **Red Team**: 8 or 9 words (whoever goes first gets 9)
- **Blue Team**: 8 or 9 words
- **Neutral**: 7 words (no penalty)
- **Assassin**: 1 word (instant loss if revealed)

### Roles
- **Spymaster**: Sees all colors, gives clues to team
- **Operative**: Makes guesses based on clues

### Turn Flow
1. Spymaster gives one-word clue + number
2. Team can guess up to (number + 1) times
3. Turn ends if:
   - Wrong word guessed (neutral, opponent's word, or assassin)
   - Team chooses to end turn
   - All guesses used

### Winning
- Reveal all your team's words first = WIN
- Reveal the assassin = LOSE

## Common Issues

### "Failed to fetch" or Connection Errors
- Make sure `npx convex dev` is running in a separate terminal
- Check that `.env.local` exists with `NEXT_PUBLIC_CONVEX_URL`
- Try restarting both the Convex dev server and Next.js dev server

### Changes Not Reflecting
- **For backend changes** (convex/ files): Convex auto-deploys, wait a few seconds
- **For frontend changes** (app/ files): Next.js auto-reloads
- If stuck, restart both dev servers

### Port Already in Use
- **Next.js (3000)**: Kill the process or use `npm run dev -- -p 3001`
- **Convex**: It handles its own ports automatically

## Deployment

### Deploy to Production

1. **Deploy Convex:**
   ```bash
   npx convex deploy
   ```
   Copy the production URL

2. **Deploy to Vercel:**
   - Push code to GitHub
   - Import to Vercel
   - Add environment variable: `NEXT_PUBLIC_CONVEX_URL` = your production Convex URL
   - Deploy!


## Next Steps

Want to customize the game?

- **Add more words**: Edit `convex/wordBank.ts`
- **Change board size**: Modify `generateBoard()` in `wordBank.ts`
- **Customize colors**: Edit Tailwind classes in component files
- **Add features**: Create new mutations in `convex/` files

Happy gaming! 🎮
