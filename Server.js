<!DOCTYPE html> <html class="h-full bg-gray-900 text-white" lang="en"> <head>   <meta charset="UTF-8" />   <meta name="viewport" content="width=device-width, initial-scale=1.0"/>   <title>X DEBATES ⚔️</title>   <script src="https://cdn.tailwindcss.com"></script>   <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>   <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/> </head> <body class="h-full">  <!-- 5-SECOND AD OVERLAY --> <div id="ad-overlay" class="fixed inset-0 z-50 bg-black flex items-center justify-center" x-data="ad()">   <div class="relative">     <video id="ad-video" class="rounded-xl shadow-2xl max-w-3xl w-full" autoplay muted playsinline loop>       <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">     </video>     <div class="absolute bottom-4 right-4 bg-black/80 px-4 py-2 rounded-lg">       <span x-text="time > 0 ? `Ad in ${time}s` : 'Skip Ad →'"></span>       <button @click="skip()" x-show="time === 0" class="ml-3 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700">Skip</button>     </div>     <div class="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded text-sm">Sponsored</div>     <a href="https://your-sponsor.com" target="_blank" class="absolute inset-0"></a>   </div> </div>  <div class="min-h-screen" x-data="app()" x-init="init()">   <!-- Leaderboard Button -->   <div class="fixed top-4 right-4 z-40">     <button @click="showLeaderboard = true" class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2">       <i class="fas fa-trophy"></i> Leaderboard     </button>   </div>    <!-- Landing -->   <div x-show="!user.side" class="flex flex-col items-center justify-center min-h-screen text-center px-4">     <h1 class="text-7xl font-black bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mb-8">       X DEBATES ⚔️     </h1>     <p class="text-2xl mb-12">60 seconds. One truth. Eternal glory.</p>     <div class="flex gap-16">       <button @click="choose('red')" class="w-64 h-64 rounded-full bg-red-600 hover:scale-110 transition text-9xl shadow-2xl">Red Pill</button>       <button @click="choose('blue')" class="w-64 h-64 rounded-full bg-blue-600 hover:scale-110 transition text-9xl shadow-2xl">Blue Pill</button>     </div>   </div>    <!-- Waiting / Debate UI -->   <div x-show="user.side && !debateEnded" class="max-w-6xl mx-auto p-8">     <div class="text-center mb-8">       <h2 class="text-4xl" x-text="matched ? 'DEBATE LIVE' : 'Searching opponent...'"></h2>       <div class="text-9xl my-8" :class="user.side === 'red' ? 'text-red-500' : 'text-blue-500'">         <span x-text="user.side === 'red' ? 'Red Pill' : 'Blue Pill'"></span>       </div>       <div class="flex justify-center gap-3 text-4xl">         <template x-for="b in user.badges">           <span :title="b.name" x-text="b.emoji"></span>         </template>       </div>     </div>      <div x-show="matched" class="grid lg:grid-cols-3 gap-8">       <div class="lg:col-span-2 space-y-4">         <div id="messages" class="bg-gray-800 rounded-xl p-6 h-96 overflow-y-auto space-y-4"></div>         <form @submit.prevent="send" class="flex gap-2">           <input x-model="msg" placeholder="Drop truth bombs..." class="flex-1 bg-gray-700 rounded-lg px-4 py-3"/>           <button class="px-8 py-3 bg-purple-600 rounded-lg hover:bg-purple-700">Send</button>         </form>         <div class="text-center text-5xl font-bold mt-4" x-text="timer + 's'"></div>       </div>        <div class="space-y-6">         <div class="bg-gray-800 rounded-xl p-6">           <h3 class="text-xl font-bold mb-4 flex items-center gap-2"><i class="fas fa-robot"></i> Grok Fact-Check</h3>           <div id="grok" class="text-sm space-y-2"></div>         </div>         <div class="bg-gray-800 rounded-xl p-6 text-center">           <p class="mb-4">Live Audience: <span id="viewers">0</span></p>           <div class="flex gap-4 justify-center text-4xl">             <button @click="vote('red')" class="hover:scale-110 bg-red-600 px-4 py-2 rounded">Red <span id="redVotes">0</span></button>             <button @click="vote('blue')" class="hover:scale-110 bg-blue-600 px-4 py-2 rounded">Blue <span id="blueVotes">0</span></button>           </div>         </div>       </div>     </div>   </div>    <!-- Winner -->   <div x-show="debateEnded" class="flex flex-col items-center justify-center min-h-screen text-center">     <h1 class="text-9xl font-black" :class="winner === user.side ? 'text-green-500' : 'text-red-500'">       <span x-text="winner.toUpperCase()"></span> WINS!     </h1>     <div x-show="justWonBadge" class="mt-10 text-6xl animate-bounce">       <span x-text="newBadge.emoji"></span> <span x-text="newBadge.name"></span> UNLOCKED!     </div>     <button @click="reset()" class="mt-20 px-12 py-6 bg-purple-600 text-3xl rounded-xl hover:bg-purple-700">       Debate Again     </button>   </div>    <!-- Leaderboard Modal -->   <div x-show="showLeaderboard" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" @click.self="showLeaderboard=false">     <div class="bg-gray-900 rounded-xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto">       <h2 class="text-4xl font-bold mb-6 text-center">Top 100 Debate Gods</h2>       <div id="leaderboard-list"></div>     </div>   </div> </div>  <script> const SOCKET_URL = "wss://your-backend-url.com"; // Update after deploying backend const socket = io(SOCKET_URL);  function ad() {   return { time: 5, skip() { document.getElementById('ad-overlay').remove() },     init() { setInterval(() => this.time > 0 && this.time--, 1000) }   } }  function app() {   const badges = [     {min:100, emoji:"👑", name:"God of Debate"},     {min:50,  emoji:"🏆", name:"Undisputed Champion"},     {min:25,  emoji:"⭐", name:"Logic Legend"},     {min:10,  emoji:"⚔️", name:"Truth Warrior"},     {min:5,   emoji:"🛡️", name:"Debate Gladiator"},     {min:1,   emoji:"🥇", name:"Rookie Slayer"}   ];    return {     user: { name: prompt("Your @username")?.trim() || "Anon", side: null,             wins: parseInt(localStorage.getItem('wins')||'0'),             badges: JSON.parse(localStorage.getItem('badges')||'[]') },     matched: false, debateEnded: false, winner: null, timer: 60, msg: '', showLeaderboard: false,     justWonBadge: false, newBadge: null,      choose(side) { this.user.side = side; socket.emit('join', this.user) },     send() { if(this.msg.trim()){ socket.emit('msg', {text:this.msg, ...this.user}); this.msg=''} },     vote(side) { socket.emit('vote', side) },     reset() { location.reload() },      getBadge(wins) { return badges.find(b => wins >= b.min) },      async init() {       socket.on('matched', () => { this.matched = true; const t=setInterval(()=>this.timer-->0||clearInterval(t),1000) });       socket.on('msg', m => this.addMessage(m));       socket.on('grok', d => this.addGrok(d));       socket.on('viewers', n => document.getElementById('viewers').textContent = n);       socket.on('votes', v => { document.getElementById('redVotes').textContent = v.red; document.getElementById('blueVotes').textContent = v.blue });       socket.on('winner', async w => {         this.winner = w; this.debateEnded = true;         if(w === this.user.side) {           this.user.wins++;           localStorage.setItem('wins', this.user.wins);           const nb = this.getBadge(this.user.wins);           if(nb && !this.user.badges.some(b=>b.name===nb.name)) {             this.user.badges.push(nb);             localStorage.setItem('badges', JSON.stringify(this.user.badges));             this.justWonBadge = true; this.newBadge = nb;           }           socket.emit('win', this.user.name);         }       });        socket.on('leaderboard', data => {         const list = document.getElementById('leaderboard-list');         list.innerHTML = data.map((p,i)=>`           <div class="flex justify-between items-center p-4 bg-gray-800 rounded mb-2">             <span class="text-2xl">#${i+1}</span>             <span class="font-bold">@${p.username}</span>             <span>${p.wins} wins ${p.wins>=100?'👑':p.wins>=50?'🏆':p.wins>=25?'⭐':p.wins>=10?'⚔️':''}</span>           </div>`).join('');       });       setInterval(()=>socket.emit('getLeaderboard'), 5000);     },      addMessage(m) {       const div = document.createElement('div');       div.className = 'p-4 rounded-lg bg-gray-800/70';       const badgesHtml = m.badges?.map(b=>`<span class="mr-1">${b.emoji}</span>`).join('') || '';       div.innerHTML = `${badgesHtml}<strong class="${m.side==='red'?'text-red-400':'text-blue-400'}">@${m.name}</strong>: ${m.text}`;       document.getElementById('messages').appendChild(div);       div.scrollIntoView();     },     addGrok(d) {       const el = document.createElement('div');       el.className = 'border-l-4 border-purple-500 pl-4';       el.innerHTML = `🤖 Grok: ${d.verdict}`;       document.getElementById('grok').appendChild(el);     }   } } </script> </body> </html>
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

let waiting = { red: null, blue: null };
let rooms = {};
let votes = { red: 0, blue: 0 };

io.on('connection', socket => {
  socket.on('join', async user => {
    const opposite = user.side === 'red' ? 'blue' : 'red';
    if (waiting[opposite]) {
      const room = `room_${Date.now()}`;
      const p1 = waiting[opposite];
      const p2 = { ...user, id: socket.id };
      rooms[room] = { p1, p2, start: Date.now() };
      waiting = { red: null, blue: null };
      io.to(p1.id).to(p2.id).emit('matched');
      setTimeout(() => endDebate(room), 60000);
    } else {
      waiting[user.side] = { ...user, id: socket.id };
    }
  });

  socket.on('msg', async msg => {
    io.emit('msg', msg);
    // Grok fact-check (add your API key)
    try {
      const res = await axios.post('https://api.x.ai/v1/chat/completions', {
        model: "grok-beta",
        messages: [{ role: "user", content: `Fact-check in one sentence: "${msg.text}"` }]
      }, { headers: { Authorization: `Bearer ${process.env.GROK_KEY}` }});
      io.emit('grok', { verdict: res.data.choices[0].message.content });
    } catch(e) {
      io.emit('grok', { verdict: "Grok says: Interesting point – needs more data." });
    }
  });

  socket.on('vote', side => { votes[side]++; io.emit('votes', votes) });
  socket.on('win', async username => {
    const { data, error } = await supabase
      .from('debate_wins')
      .upsert({ username, wins: supabase.raw('COALESCE(wins, 0) + 1') }, { onConflict: 'username' })
      .select();
  });
  socket.on('getLeaderboard', async () => {
    const { data } = await supabase
      .from('debate_wins')
      .select('username, wins')
      .order('wins', { ascending: false })
      .limit(100);
    io.emit('leaderboard', data || []);
  });

  function endDebate(room) {
    if (!rooms[room]) return;
    const winner = votes.red > votes.blue ? 'red' : votes.blue > votes.red ? 'blue' : 'red'; // Tiebreaker
    const p1 = rooms[room].p1.side, p2 = rooms[room].p2.side;
    io.to(rooms[room].p1.id).to(rooms[room].p2.id).emit('winner', p1 === winner ? 'red' : 'blue');
    votes = { red: 0, blue: 0 };
    delete rooms[room];
  }
});

app.get('/', (req,res)=>res.send('X Debates backend live!'));
server.listen(process.env.PORT || 3000, ()=>console.log('Server running'));
