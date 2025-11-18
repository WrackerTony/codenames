# Codenames - Online Multiplayer Game

A real-time web version of the popular party game Codenames, built with Next.js, React, TailwindCSS, and Convex.

## Features

### 🎮 Game Modes
- **Private Lobbies**: Create a room with a 4-6 character code and share it with friends
- **Public Matchmaking**: Join random public games with other players
- **Spectator Mode**: Watch games in progress

### 🎯 Core Gameplay
- **5x5 Word Grid**: 25 randomly selected words from a 400+ word bank
- **Team Play**: Red vs Blue teams with distinct roles
- **Spymaster Role**: See all word colors and give one-word clues with numbers
- **Operative Role**: Guess words based on spymaster's clues
- **Real-time Updates**: All players see board updates instantly
- **Win Conditions**: 
  - Reveal all your team's words to win
  - Avoid the assassin or lose instantly
- **Clue History**: Track all clues given during the game

### 💬 Additional Features
- **Live Chat**: Real-time messaging between players
- **Team Assignment**: Choose your team (Red/Blue) and role (Spymaster/Operative)
- **Mobile Responsive**: Play on any device
- **Turn Management**: Clear indication of whose turn it is
- **Score Tracking**: See remaining words for each team

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS 4
- **Backend**: Convex (real-time database and serverless functions)
- **TypeScript**: Full type safety across the stack

## Getting Started

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
cd codenames
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Convex**
```bash
npx convex dev
```
This will:
- Create a new Convex project (or link to existing one)
- Generate a `.env.local` file with your `NEXT_PUBLIC_CONVEX_URL`
- Start the Convex development server

4. **Run the development server**
In a new terminal:
```bash
npm run dev
```

5. **Open the app**
Navigate to [http://localhost:3000](http://localhost:3000)

## How to Play

### Setup (Lobby)
1. **Create or Join a Room**:
   - Create a private lobby and share the room code
   - Join a private lobby with a room code
   - Join a public/random lobby for matchmaking

2. **Choose Team and Role**:
   - Select Red Team or Blue Team
   - Choose to be a **Spymaster** (gives clues) or **Operative** (guesses words)
   - Each team needs at least one Spymaster

3. **Start the Game**:
   - Host (or any player in public rooms) can start when both teams are ready
   - Both teams must have at least one player and a Spymaster

### Gameplay
1. **Spymaster's Turn**:
   - See all word colors on the board
   - Give a one-word clue and a number (how many words relate to the clue)
   - Cannot use any words on the board or variations

2. **Operatives' Turn**:
   - See only neutral-colored cards (until revealed)
   - Make guesses based on the Spymaster's clue
   - Can guess up to (clue number + 1) times
   - Turn ends when:
     - You guess a wrong word
     - You choose to end your turn
     - You've used all guesses

3. **Winning**:
   - First team to reveal all their words wins
   - If you reveal the assassin, you lose immediately

### Card Colors (Spymaster View)
- 🔴 **Red**: Red team's words (8 or 9 depending on starting team)
- 🔵 **Blue**: Blue team's words (8 or 9 depending on starting team)
- ⬜ **Neutral**: Innocent bystander words (7)
- ⬛ **Assassin**: Game-ending word (1)

## Project Structure

```
codenames/
├── app/
│   ├── components/
│   │   └── Chat.tsx          # Real-time chat component
│   ├── game/[roomId]/
│   │   └── page.tsx          # Main game board
│   ├── lobby/[roomId]/
│   │   └── page.tsx          # Lobby/team selection
│   ├── ConvexClientProvider.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Home page
├── convex/
│   ├── _generated/           # Convex generated files
│   ├── game.ts              # Game logic mutations/queries
│   ├── rooms.ts             # Room management
│   ├── schema.ts            # Database schema
│   └── wordBank.ts          # Word list and board generation
├── public/
└── package.json
```

## Database Schema

### Tables
- **rooms**: Game rooms with codes, status, and host info
- **players**: Player information, team assignment, and roles
- **games**: Active game state, board, scores, and turn info
- **messages**: Chat messages for each room

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
npm start
```

### Deploying

#### Deploy to Vercel
1. Push your code to GitHub
2. Import project in Vercel
3. Add your Convex environment variables
4. Deploy!

#### Deploy Convex
```bash
npx convex deploy
```

## Environment Variables

Create a `.env.local` file (automatically created by `npx convex dev`):

```
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Inspired by the original Codenames board game by Vlaada Chvátil
- Built with Next.js, React, and Convex
