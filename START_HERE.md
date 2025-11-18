# 🎮 Codenames Game - Complete Implementation

## ✨ What You Have

A **fully functional, real-time multiplayer Codenames game** with:
- ✅ Private & public lobbies
- ✅ Real-time synchronization
- ✅ Team & role management
- ✅ Complete game logic
- ✅ Live chat
- ✅ Mobile responsive design
- ✅ Professional UI/UX

---

## 🚀 Quick Start (First Time)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Initialize Convex (CRITICAL!)
```bash
npx convex dev
```
- This creates your `.env.local` file automatically
- **Keep this terminal running**
- You'll be prompted to create a Convex account (free)

### Step 3: Start Next.js (New Terminal)
```bash
npm run dev
```
- **Keep this terminal running too**

### Step 4: Play!
1. Open [http://localhost:3000](http://localhost:3000)
2. Enter your name
3. Create a private lobby (note the room code)
4. Open another browser/incognito window
5. Join with the room code
6. Assign teams and start playing!

---

## 📁 What's Included

### Documentation
- **README.md** - Full project documentation
- **QUICKSTART.md** - Detailed setup guide
- **TESTING.md** - Comprehensive testing checklist
- **TROUBLESHOOTING.md** - Common issues and solutions
- **PROJECT_SUMMARY.md** - Complete feature list

### Frontend (`app/`)
```
app/
├── components/
│   ├── Chat.tsx              # Real-time chat
│   └── LoadingSpinner.tsx    # Loading UI
├── game/[roomId]/
│   └── page.tsx              # Game board (5x5 grid)
├── lobby/[roomId]/
│   └── page.tsx              # Team selection
├── page.tsx                  # Home page
├── layout.tsx                # Root layout
└── globals.css               # Styles
```

### Backend (`convex/`)
```
convex/
├── schema.ts        # Database tables
├── rooms.ts         # Room management
├── game.ts          # Game logic
└── wordBank.ts      # 400+ words
```

---

## 🎯 Features Checklist

### Core Features
- [x] Create private lobbies with 4-6 character codes
- [x] Join private lobbies by code
- [x] Join public/random lobbies (matchmaking)
- [x] Player name system
- [x] Team assignment (Red/Blue)
- [x] Role assignment (Spymaster/Operative)
- [x] 5x5 word grid
- [x] Color-coded words for spymasters
- [x] Hidden words for operatives
- [x] Clue giving (word + number)
- [x] Word guessing
- [x] Turn management
- [x] Score tracking
- [x] Win/lose conditions
- [x] End-game screen

### Bonus Features
- [x] Real-time chat
- [x] Mobile responsive
- [x] Loading states
- [x] Error handling
- [x] Clue history
- [x] End turn early
- [x] Spectator mode
- [x] Modern UI design

---

## 🎲 How to Play

### Setup (2-8 players)
1. Create or join a room
2. Choose team: Red or Blue
3. Choose role: Spymaster or Operative
4. Each team needs 1+ players and 1 Spymaster
5. Host starts the game

### Gameplay
**Spymasters:**
- See all word colors (Red, Blue, Neutral, Assassin)
- Give one-word clue + number to your team
- Cannot guess

**Operatives:**
- See beige cards (colors hidden)
- Guess words based on spymaster's clue
- Can guess up to clue number + 1 times

**Win Conditions:**
- ✅ Reveal all your team's words = WIN
- ❌ Reveal the assassin = LOSE

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 + React 19 + TailwindCSS 4
- **Backend**: Convex (real-time database)
- **Language**: TypeScript
- **Styling**: TailwindCSS + CSS
- **Real-time**: Convex subscriptions

---

## 📊 Project Stats

- **Total Files Created**: 15+
- **Lines of Code**: 2000+
- **Components**: 5
- **Database Tables**: 4
- **API Functions**: 10+
- **Word Bank**: 400+ words

---

## 🐛 If Something Breaks

### Quick Fixes
1. **Restart Convex**: Ctrl+C in Convex terminal, then `npx convex dev`
2. **Restart Next.js**: Ctrl+C in Next terminal, then `npm run dev`
3. **Clear cache**: Delete `.next` folder and restart
4. **Clear browser**: Ctrl+Shift+R (hard refresh)

### Common Issues
- "Room not found" → Check room code
- "Player not found" → Clear localStorage
- "Failed to fetch" → Check Convex is running
- Pages not loading → Check both dev servers are running

See **TROUBLESHOOTING.md** for detailed solutions.

---

## 🎨 Customization Ideas

### Easy
- Add more words to `convex/wordBank.ts`
- Change colors in component files
- Modify grid size (requires logic changes)

### Medium
- Add timer per turn
- Different word categories
- Game statistics
- Player profiles

### Advanced
- AI opponent
- Tournament mode
- Custom word lists upload
- Voice chat integration

---

## 📝 Important Files

| File | Purpose |
|------|---------|
| `.env.local` | Convex URL (auto-created) |
| `app/page.tsx` | Home page |
| `app/lobby/[roomId]/page.tsx` | Lobby |
| `app/game/[roomId]/page.tsx` | Game |
| `convex/schema.ts` | Database structure |
| `convex/rooms.ts` | Room logic |
| `convex/game.ts` | Game logic |

---

## 🌐 Deployment

### Convex (Backend)
```bash
npx convex deploy
```
Copy the production URL

### Vercel (Frontend)
1. Push to GitHub
2. Import to Vercel
3. Add env var: `NEXT_PUBLIC_CONVEX_URL` = production URL
4. Deploy

---

## 🎯 Testing Checklist

**Basic Flow** (5 minutes):
1. ✓ Create private lobby
2. ✓ Join with second player
3. ✓ Assign teams and roles
4. ✓ Start game
5. ✓ Spymaster gives clue
6. ✓ Operative guesses
7. ✓ Turn switches
8. ✓ Chat works
9. ✓ Game ends correctly

See **TESTING.md** for complete checklist.

---

## 📚 Learning Resources

- **Convex Docs**: https://docs.convex.dev
- **Next.js Docs**: https://nextjs.org/docs
- **TailwindCSS**: https://tailwindcss.com/docs
- **Codenames Rules**: https://czechgames.com/files/rules/codenames-rules-en.pdf

---

## 🎉 You're All Set!

Your Codenames game is complete and ready to play!

**Next Steps:**
1. Run the quick start commands above
2. Test with friends
3. Deploy to production (optional)
4. Customize and extend (optional)

**Need Help?**
- Check **TROUBLESHOOTING.md**
- Read **QUICKSTART.md**
- See **TESTING.md**

---

## 📜 License

This project is open source. Feel free to modify and share!

---

**Have fun playing Codenames!** 🎮🎉

---

## 🙏 Acknowledgments

- Original game by Vlaada Chvátil
- Built with Next.js, React, and Convex
- Inspired by the classic board game

**Game on!** 🚀
