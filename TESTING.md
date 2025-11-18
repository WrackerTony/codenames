# Testing Checklist for Codenames Game

## Pre-Testing Setup
- [ ] Run `npx convex dev` in one terminal
- [ ] Run `npm run dev` in another terminal
- [ ] Open browser to `http://localhost:3000`
- [ ] Open incognito/private window for second player

---

## 1. Home Page Tests

### Create Private Lobby
- [ ] Enter player name, click "Create Private Lobby"
- [ ] Room code is displayed (4-6 characters)
- [ ] Redirects to lobby page
- [ ] Room code is visible in lobby

### Join Private Lobby
- [ ] In second browser: Enter name and valid room code
- [ ] Click "Join" button
- [ ] Successfully joins the same lobby
- [ ] Both players visible in lobby

### Join Public Lobby
- [ ] Click "Join Public/Random Lobby"
- [ ] Creates or joins public room
- [ ] Multiple players can join same public room

### Error Handling
- [ ] Try joining with empty name → Shows error
- [ ] Try joining with invalid room code → Shows error
- [ ] Try creating with empty name → Shows error

---

## 2. Lobby Page Tests

### Team Assignment
- [ ] Player can join Red Team as Spymaster
- [ ] Player can join Red Team as Operative
- [ ] Player can join Blue Team as Spymaster
- [ ] Player can join Blue Team as Operative
- [ ] Both teams show correct player counts
- [ ] Cannot have 2 spymasters on same team

### Player Display
- [ ] All connected players are visible
- [ ] Player names are displayed correctly
- [ ] Roles are shown (Spymaster/Operative)
- [ ] Team colors are distinct (Red/Blue)
- [ ] Unassigned players shown separately

### Start Game Validation
- [ ] Cannot start without both teams having players
- [ ] Cannot start without both teams having spymasters
- [ ] Start button disabled when requirements not met
- [ ] Warning message displayed when not ready
- [ ] Host can start game (private room)
- [ ] Any player can start (public room)

### Navigation
- [ ] Room code displayed correctly
- [ ] Public/Private status shown
- [ ] Real-time updates when players join/leave

---

## 3. Game Page Tests

### Board Display
- [ ] 5x5 grid displayed (25 words)
- [ ] Words are readable and properly formatted
- [ ] Spymasters see all color-coded words:
  - [ ] Red words (8 or 9)
  - [ ] Blue words (8 or 9)
  - [ ] Neutral words (7)
  - [ ] Assassin word (1)
- [ ] Operatives see beige cards until revealed

### Turn Management
- [ ] Starting team displayed correctly
- [ ] Current turn indicated (Red/Blue)
- [ ] Turn info updates in real-time
- [ ] Score counters show remaining words

### Spymaster Actions
- [ ] Can give clue (word + number) when it's their turn
- [ ] Clue input only visible to current spymaster
- [ ] Cannot give clue during operative guessing
- [ ] Clue validation:
  - [ ] Empty word rejected
  - [ ] Number outside 0-9 rejected
- [ ] Clue appears in clue history
- [ ] Clue visible to all players

### Operative Actions
- [ ] Can click unrevealed cards when guessing
- [ ] Cannot click already revealed cards
- [ ] Cannot click when not their turn
- [ ] Cannot guess without clue
- [ ] Guess counter decrements after each guess
- [ ] Can end turn early

### Game Logic
#### Correct Guess (Own Team Color)
- [ ] Card reveals with correct color
- [ ] Team score decrements
- [ ] Can continue guessing (if guesses remain)
- [ ] Turn continues

#### Wrong Guess (Opponent Color)
- [ ] Card reveals with opponent color
- [ ] Opponent score decrements
- [ ] Turn ends immediately
- [ ] Switches to other team

#### Neutral Guess
- [ ] Card reveals as neutral
- [ ] No score change
- [ ] Turn ends immediately
- [ ] Switches to other team

#### Assassin Reveal
- [ ] Card reveals as black
- [ ] Game ends immediately
- [ ] Opposing team wins
- [ ] Winner screen displayed

#### Win Condition
- [ ] Game ends when all team words revealed
- [ ] Correct team wins
- [ ] Winner screen displayed

### Real-time Updates
- [ ] All players see clues instantly
- [ ] All players see guesses instantly
- [ ] Scores update for all players
- [ ] Turn changes visible to all
- [ ] Board state synced across all clients

---

## 4. Chat Feature Tests

### Chat UI
- [ ] Chat button visible in game
- [ ] Chat opens/closes correctly
- [ ] Message count badge displayed
- [ ] Messages in chronological order (newest at bottom)
- [ ] Auto-scrolls to new messages

### Messaging
- [ ] Can type and send messages
- [ ] Messages appear for all players in room
- [ ] Player name shown with message
- [ ] Timestamp displayed
- [ ] Empty messages not sent
- [ ] Messages persist during game

---

## 5. End Game Tests

### Winner Display
- [ ] Correct winner team shown
- [ ] Win reason displayed (all words or assassin)
- [ ] Final board state visible
- [ ] "Return to Home" button works
- [ ] Can create/join new game after

---

## 6. Edge Cases & Stress Tests

### Network/Connection
- [ ] Handle page refresh (player reconnection)
- [ ] Handle browser back button
- [ ] Multiple tabs/windows with same player
- [ ] Slow network simulation

### Simultaneous Actions
- [ ] Two operatives guessing at same time
- [ ] Spymaster giving clue while operative guessing
- [ ] Multiple players joining lobby simultaneously

### Data Validation
- [ ] Invalid room IDs
- [ ] Expired/deleted rooms
- [ ] Player leaves during game
- [ ] All players leave lobby

---

## 7. Mobile Responsiveness

### Home Page
- [ ] Layout adapts to small screens
- [ ] Buttons remain clickable
- [ ] Text remains readable
- [ ] No horizontal scroll

### Lobby Page
- [ ] Team sections stack on mobile
- [ ] Buttons remain accessible
- [ ] Player lists readable

### Game Page
- [ ] 5x5 grid fits on screen
- [ ] Cards remain clickable
- [ ] Text in cards readable
- [ ] Controls accessible
- [ ] Chat overlay doesn't block game

### Different Devices
- [ ] Test on iPhone/Android
- [ ] Test on tablet
- [ ] Test landscape/portrait

---

## 8. UI/UX Tests

### Visual Feedback
- [ ] Hover effects on buttons
- [ ] Disabled states clearly visible
- [ ] Loading states present
- [ ] Error messages clear and helpful

### Accessibility
- [ ] Color contrast sufficient
- [ ] Text sizes readable
- [ ] Interactive elements have clear states
- [ ] Keyboard navigation possible (where applicable)

### Performance
- [ ] Page loads quickly
- [ ] No lag when revealing cards
- [ ] Smooth animations
- [ ] Chat doesn't cause slowdown

---

## 9. Game Variations Tests

### Different Player Counts
- [ ] 2 players (1v1)
- [ ] 4 players (2v2)
- [ ] 6 players (3v3)
- [ ] 8 players (4v4)

### Different Starting Teams
- [ ] Red starts (9 red words)
- [ ] Blue starts (9 blue words)
- [ ] Verify word counts correct

---

## 10. Known Issues to Check

- [ ] Player ID persistence in localStorage
- [ ] Room codes unique
- [ ] Game state doesn't get stuck
- [ ] No orphaned rooms in database
- [ ] Spectator mode (if implemented)

---

## Testing Report Template

```
Date: ___________
Tester: ___________
Environment: Local/Production

Passed: __ / __
Failed: __ / __

Critical Issues:
1. 
2. 

Minor Issues:
1. 
2. 

Notes:
```

---

## Quick Test Scenario (5 minutes)

For rapid testing, follow this path:

1. **Player 1**: Create private lobby as "Alice"
2. **Player 2**: Join with code as "Bob"
3. **Alice**: Red Spymaster
4. **Bob**: Blue Spymaster
5. **Start game**
6. **Alice**: Give clue "FRUIT 2"
7. **Alice team**: Click 2 cards
8. **Verify**: Turn switches to Blue
9. **Bob**: Give clue "ANIMAL 1"
10. **Bob team**: Click 1 card
11. **Verify**: All updates work in real-time
12. **Test chat**: Send messages
13. **End game**: Continue until win/lose

✅ If all above work → Basic functionality confirmed
