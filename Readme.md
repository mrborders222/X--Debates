# X Debates ⚔️

Real-time 1v1 debate arena powered by Grok AI.  
Pick Red or Blue pill → Instant match → 60-sec battle → Grok fact-checks live → Earn badges forever.

## Live Demo
[Try it now](https://xdebates.com) (or deploy your own below)

## Features
- 🚀 Instant 1v1 matching  
- 🤖 Grok live fact-checking on every message  
- 🏅 Permanent badges (Rookie Slayer → God of Debate)  
- 📊 Global leaderboard (Top 100)  
- 💰 5-sec skippable ads (monetized)  
- Built for X – viral & addictive  

## Quick Deploy
### Frontend (Free on Vercel)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mrborders222/x-debates)

### Backend (Free on Railway)
1. Go to [Railway.app](https://railway.app/new)  
2. Link this repo  
3. Add env vars: `SUPABASE_URL`, `SUPABASE_KEY`, `GROK_KEY` (from x.ai/api)  

## Setup Supabase (Free DB for Leaderboard)
1. Sign up at [supabase.com](https://supabase.com)  
2. New project → Create table `debate_wins` with columns: `username` (text, primary key), `wins` (int)  
3. Copy URL + Anon Key to Railway env  

Made with ❤️ by @mrborders222 for xAI. Open to collabs!

## License
MIT – Fork, ship, profit.
