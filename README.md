# X Debates ⚔️ – Grok-Powered Arena for X

Built by [@mrborders222](https://x.com/mrborders222) – Live in under 60 mins!

**Demo**: [xdebates.com](https://xdebates.com) (or deploy your copy below)

## Epic Features
- **Red vs Blue Pill**: Instant 1v1 matching.
- **60s Debates**: Live text battles, audience votes.
- **Grok Fact-Checks** 🤖: Real-time via xAI API.
- **Badges Forever**: Win tiers (🥇 Rookie → 👑 God) + local storage.
- **Leaderboard**: Top 100 via Supabase (free DB).
- **Monetized**: 5-sec skippable ads (plug sponsors easy).

Addictive X mini-app – truth wins clout.

## Deploy Free (One-Click)
### Frontend (Vercel)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mrborders222/x-debates)

### Backend (Railway)
1. [Railway.app/new](https://railway.app/new) → GitHub repo link.
2. Env vars: `SUPABASE_URL`/`SUPABASE_KEY` (free leaderboard), `GROK_KEY` ([x.ai/api](https://x.ai/api)).
3. Update `SOCKET_URL` in index.html to your Railway URL.

### Supabase (DB Setup)
- [supabase.com](https://supabase.com) > New project.
- Table: `debate_wins` (username: text PK, wins: int default 0).

## Stack
- Frontend: HTML/JS + Tailwind/Alpine/Socket.io
- Backend: Node/Express + Supabase + Grok API
- MIT License – Fork & profit!

@xai @grok @elonmusk – Official collab? This prints virality. ⚔️
