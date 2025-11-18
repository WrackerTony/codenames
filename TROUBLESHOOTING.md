# Troubleshooting Guide

## Common Issues and Solutions

### Setup Issues

#### "Cannot find module 'convex/react'" or similar import errors
**Problem**: Dependencies not installed
**Solution**: 
```bash
npm install
```

#### "NEXT_PUBLIC_CONVEX_URL is not defined"
**Problem**: Convex not initialized
**Solution**: 
```bash
npx convex dev
```
This will create the `.env.local` file automatically.

#### "Port 3000 is already in use"
**Problem**: Another process is using port 3000
**Solution**: 
```bash
# Kill the process on port 3000
kill -9 $(lsof -ti:3000)
# OR run on a different port
npm run dev -- -p 3001
```

---

### Connection Issues

#### "Failed to fetch" or "Network request failed"
**Problem**: Convex dev server not running
**Solution**: 
- Make sure `npx convex dev` is running in a separate terminal
- Check that `.env.local` exists and has the correct URL
- Restart both Convex and Next.js dev servers

#### Changes not reflecting
**Problem**: Cache or stale build
**Solution**: 
```bash
# Clear Next.js cache
rm -rf .next
# Restart dev server
npm run dev
```

#### Real-time updates not working
**Problem**: Convex connection issue
**Solution**: 
- Check browser console for errors
- Verify `NEXT_PUBLIC_CONVEX_URL` in `.env.local`
- Restart Convex dev server
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

---

### Game Play Issues

#### "Room not found" when joining
**Possible Causes & Solutions**:
1. **Wrong code**: Double-check the room code (case-sensitive)
2. **Expired room**: Room may have been deleted
3. **Database issue**: Restart Convex dev server

#### "Game already in progress"
**Problem**: Trying to join after game started
**Solution**: 
- In private rooms, can only join during lobby phase
- Try creating a new room

#### "Both teams need a spymaster"
**Problem**: Missing spymasters before starting
**Solution**: 
- Ensure both Red and Blue teams have selected a Spymaster
- Check that roles are properly assigned

#### Stuck in loading screen
**Possible Causes & Solutions**:
1. **No playerId in localStorage**:
   - Clear localStorage and start over
   - Open browser console: `localStorage.clear()`
   
2. **Invalid room ID**: 
   - Check the URL
   - Return to home and rejoin

3. **Network issue**:
   - Check browser console for errors
   - Verify Convex is running

#### Players not appearing in lobby
**Problem**: Real-time sync issue
**Solution**: 
- Refresh the page
- Check that `npx convex dev` is running
- Look for errors in browser console

#### Cannot give clue or make guess
**Possible Causes & Solutions**:
1. **Not your turn**: Wait for your team's turn
2. **Wrong role**: Operatives can't give clues, Spymasters can't guess
3. **No clue given yet**: Operatives need to wait for spymaster's clue
4. **Guesses exhausted**: Turn ended, wait for next turn

---

### UI Issues

#### Cards not clickable
**Possible Causes & Solutions**:
1. **Not your turn**: Check turn indicator
2. **Already revealed**: Can't click revealed cards
3. **No guesses remaining**: End turn or wait
4. **You're a spymaster**: Spymasters can't guess

#### Text too small on mobile
**Solution**: 
- Use landscape mode for better view
- Zoom in using pinch gesture
- Cards adapt to screen size automatically

#### Chat not opening
**Solution**: 
- Check for JavaScript errors in console
- Ensure you're in the game page
- Try refreshing the page

#### Colors not showing correctly
**Problem**: Tailwind CSS not loaded
**Solution**: 
```bash
# Rebuild
npm run dev
```

---

### Browser-Specific Issues

#### Safari Issues
- **LocalStorage**: Ensure "Prevent Cross-Site Tracking" is OFF
- **WebSocket**: Update to latest Safari version
- Try in Chrome or Firefox if issues persist

#### Firefox Issues
- **Private Browsing**: Some features may not work
- Allow cookies and storage
- Check Enhanced Tracking Protection settings

#### Mobile Browser Issues
- **iOS Safari**: Use Safari, not Chrome on iOS
- **Android**: Chrome works best
- Clear browser cache if issues occur

---

### Database/Backend Issues

#### "Player not found" error
**Solution**: 
```javascript
// Clear localStorage and rejoin
localStorage.clear()
// Then go back to home page
```

#### Duplicate players in lobby
**Problem**: Same playerId used twice
**Solution**: 
- Close all tabs
- Clear localStorage
- Create new player session

#### Game state inconsistent
**Problem**: Database sync issue
**Solution**: 
- All players refresh the page
- If persists, restart the game
- Check Convex dashboard for errors

---

### Development Issues

#### TypeScript errors
**Solution**: 
```bash
# Regenerate Convex types
npx convex dev
# Check TypeScript config
npx tsc --noEmit
```

#### ESLint warnings
**Solution**: 
```bash
npm run lint
```
Most warnings are non-critical. Fix errors first.

#### Tailwind classes not working
**Solution**: 
- Check `tailwind.config.js` is correct
- Restart dev server
- Verify class names are valid TailwindCSS 4 syntax

---

### Deployment Issues

#### Vercel deployment fails
**Possible Causes & Solutions**:
1. **Missing env variable**: Add `NEXT_PUBLIC_CONVEX_URL` in Vercel
2. **Build error**: Check build logs
3. **Node version**: Use Node 20+

#### Convex deployment fails
**Solution**: 
```bash
# Login first
npx convex login
# Then deploy
npx convex deploy
```

#### Production app doesn't load
**Checklist**:
- [ ] Convex deployed to production
- [ ] Production Convex URL added to Vercel env vars
- [ ] Vercel deployment successful
- [ ] No build errors in logs

---

### Performance Issues

#### Slow loading
**Possible Causes & Solutions**:
1. **First load**: Next.js compiles on first visit
2. **Network**: Check internet connection
3. **Too many players**: Game supports up to 8 players

#### Lag when revealing cards
**Solution**: 
- Close other tabs/applications
- Check network latency
- Use wired connection instead of WiFi

#### Chat messages delayed
**Problem**: Network or Convex connection issue
**Solution**: 
- Check internet connection
- Verify Convex status
- Try refreshing the page

---

## Debug Checklist

When something doesn't work, check in this order:

1. **Is `npx convex dev` running?** ✓
2. **Is `npm run dev` running?** ✓
3. **Does `.env.local` exist with correct URL?** ✓
4. **Any errors in browser console?** ✓
5. **Any errors in terminal?** ✓
6. **Is internet connection stable?** ✓
7. **Is localStorage accessible?** ✓
8. **Is the browser up to date?** ✓

---

## Getting Help

### Check Logs
**Browser Console**: F12 or Right-click → Inspect → Console
**Terminal**: Look at the output from both dev servers

### Convex Dashboard
Visit your Convex dashboard to:
- See database contents
- Check function logs
- Monitor errors
- View API calls

### Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Room not found" | Invalid room ID | Check room code |
| "Not your turn" | Wrong team's turn | Wait for your turn |
| "Player not found" | Invalid playerId | Clear localStorage |
| "Failed to fetch" | Network/API issue | Check Convex is running |
| "Only host can start" | Not the host | Wait for host to start |

---

## Reset Everything

If all else fails, complete reset:

```bash
# 1. Stop all dev servers (Ctrl+C)

# 2. Clear dependencies
rm -rf node_modules package-lock.json

# 3. Clear Next.js cache
rm -rf .next

# 4. Clear local storage (in browser console)
localStorage.clear()

# 5. Reinstall
npm install

# 6. Restart Convex
npx convex dev

# 7. Restart Next.js (in new terminal)
npm run dev
```

---

## Still Having Issues?

1. **Check GitHub Issues**: See if others have the same problem
2. **Convex Documentation**: https://docs.convex.dev
3. **Next.js Documentation**: https://nextjs.org/docs
4. **Create an Issue**: Include:
   - Error message
   - Steps to reproduce
   - Browser and OS
   - Screenshots if relevant

---

## Tips for Smooth Experience

- ✅ Keep both dev servers running
- ✅ Use latest browser version
- ✅ Test with 2+ players in different windows
- ✅ Check console regularly for errors
- ✅ Clear browser cache if UI looks broken
- ✅ Use incognito mode for multi-player testing
- ✅ Refresh page if real-time updates stop working

---

**Remember**: Most issues are resolved by:
1. Restarting dev servers
2. Clearing browser cache
3. Refreshing the page

Happy debugging! 🐛🔧
